import { spawn } from "child_process";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9336;

const chromeProc = spawn(CHROME_PATH, [
  `--remote-debugging-port=${PORT}`,
  "--headless=new",
  "--no-first-run",
  "--no-default-browser-check",
  `--user-data-dir=/tmp/chrome-audit-${Date.now()}`,
  "--disable-gpu",
]);

await new Promise((resolve) => setTimeout(resolve, 1500));

try {
  const versionRes = await fetch(`http://127.0.0.1:${PORT}/json/version`);
  const versionData = await versionRes.json();
  const ws = new WebSocket(versionData.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  let idCounter = 1;
  const callbacks = new Map();
  ws.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  };

  function send(method, params = {}, sessionId = undefined) {
    return new Promise((resolve) => {
      const id = idCounter++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }

  const target = await send("Target.createTarget", { url: "about:blank" });
  const targetId = target.result.targetId;
  const session = await send("Target.attachToTarget", { targetId, flatten: true });
  const sessionId = session.result.sessionId;

  await send("Page.enable", {}, sessionId);
  await send("Runtime.enable", {}, sessionId);

  const viewports = [
    { width: 320, height: 640, label: "320px (min mobile)" },
    { width: 360, height: 740, label: "360px (compact mobile)" },
    { width: 375, height: 667, label: "375x667 (iPhone SE)" },
    { width: 390, height: 844, label: "390px (standard mobile)" },
    { width: 430, height: 932, label: "430px (large mobile)" },
    { width: 768, height: 1024, label: "768px (tablet portrait)" },
    { width: 1024, height: 768, label: "1024px (tablet landscape)" },
    { width: 1440, height: 900, label: "1440px (desktop)" },
  ];

  const routes = [
    "/",
    "/services",
    "/services/house-cleaning",
    "/about",
    "/service-areas",
    "/quote",
    "/contact",
    "/privacy",
    "/terms",
    "/non-existent-page-404",
  ];

  const auditReport = [];

  for (const route of routes) {
    const url = `http://localhost:3000${route}`;
    await send("Page.navigate", { url }, sessionId);
    await new Promise((r) => setTimeout(r, 800));

    for (const vp of viewports) {
      await send("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 1024,
      }, sessionId);

      await new Promise((r) => setTimeout(r, 200));

      const evalRes = await send("Runtime.evaluate", {
        expression: `
        (() => {
          const docEl = document.documentElement;
          const body = document.body;
          const winWidth = window.innerWidth;
          const winHeight = window.innerHeight;

          // 1. Horizontal Scroll Check
          const docScrollWidth = docEl.scrollWidth;
          const bodyScrollWidth = body.scrollWidth;
          const scrollWidth = Math.max(docScrollWidth, bodyScrollWidth);
          const hasHorizontalOverflow = scrollWidth > winWidth + 1;

          // Find overflowing elements
          const overflowingElements = [];
          if (hasHorizontalOverflow) {
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              const style = window.getComputedStyle(el);
              if (style.display === 'none' || style.visibility === 'hidden') return;
              if (r.right > winWidth + 1.5 && r.width > 0) {
                const tag = el.tagName.toLowerCase();
                const id = el.id ? '#' + el.id : '';
                const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '';
                overflowingElements.push({
                  selector: tag + id + cls,
                  width: Math.round(r.width),
                  right: Math.round(r.right),
                  excess: Math.round(r.right - winWidth),
                  snippet: (el.textContent || '').trim().slice(0, 40)
                });
              }
            });
          }

          // 2. Touch targets (< 44x44px)
          const smallTargets = [];
          const interactives = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="radio"], summary');
          interactives.forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;
            const r = el.getBoundingClientRect();
            // Ignore zero-size or off-screen drawer
            if (r.width === 0 || r.height === 0 || r.bottom < 0) return;

            if (r.width < 43.5 || r.height < 43.5) {
              const tag = el.tagName.toLowerCase();
              const text = (el.textContent || el.getAttribute('aria-label') || el.title || el.name || '').trim().slice(0, 30);
              smallTargets.push({
                selector: tag + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/)[0] : ''),
                width: Math.round(r.width),
                height: Math.round(r.height),
                text
              });
            }
          });

          // 3. Form input font sizes (< 16px triggers iOS zoom)
          const smallFontInputs = [];
          document.querySelectorAll('input, select, textarea').forEach(inp => {
            const style = window.getComputedStyle(inp);
            if (style.display === 'none' || style.visibility === 'hidden') return;
            const fs = parseFloat(style.fontSize);
            if (fs < 16) {
              smallFontInputs.push({
                tag: inp.tagName.toLowerCase(),
                name: inp.name || inp.id || inp.placeholder || 'unnamed',
                fontSize: style.fontSize,
                type: inp.type || undefined
              });
            }
          });

          // 4. Hero CTA / Quick-quote visibility (on 375x667)
          let heroDetails = null;
          if (winWidth === 375 && winHeight === 667 && window.location.pathname === '/') {
            const ctaBtn = document.querySelector('button[type=\"submit\"], a[href=\"/quote\"]');
            if (ctaBtn) {
              const r = ctaBtn.getBoundingClientRect();
              heroDetails = {
                text: (ctaBtn.textContent || '').trim().slice(0, 25),
                top: Math.round(r.top),
                bottom: Math.round(r.bottom),
                visibleAboveFold: r.bottom <= winHeight,
              };
            }
          }

          // 5. Body bottom padding vs mobile sticky bar
          let mobileStickyBarOverlap = false;
          let bodyPaddingBottom = parseInt(window.getComputedStyle(document.body).paddingBottom) || 0;
          const stickyBar = document.querySelector('[class*=\"mobileActionBar\"], [class*=\"actionBar\"]');
          if (stickyBar && winWidth < 768) {
            const barHeight = stickyBar.getBoundingClientRect().height;
            if (bodyPaddingBottom < barHeight) {
              mobileStickyBarOverlap = true;
            }
          }

          return {
            winWidth,
            winHeight,
            scrollWidth,
            hasHorizontalOverflow,
            overflowCount: overflowingElements.length,
            overflowingElements: overflowingElements.slice(0, 6),
            smallTargetCount: smallTargets.length,
            smallTargetSample: smallTargets.slice(0, 8),
            smallFontInputs,
            heroDetails,
            mobileStickyBarOverlap,
            bodyPaddingBottom
          };
        })()
        `,
        returnByValue: true,
      }, sessionId);

      const res = evalRes.result?.result?.value;
      if (res) {
        auditReport.push({
          route,
          viewport: vp.label,
          ...res,
        });
      }
    }
  }

  // Print results summary
  console.log("AUDIT_COMPLETE_JSON:" + JSON.stringify(auditReport));

  ws.close();
} finally {
  chromeProc.kill();
}
