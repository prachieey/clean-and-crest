/**
 * Clean & Crest — Email Utility Helpers
 */

/**
 * Escapes unsafe HTML characters to prevent XSS / HTML injection in email clients.
 */
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Checks if a value is unset or a placeholder string like "[ABN]" or "[PLACEHOLDER: ...]"
 */
export function isPlaceholderValue(val: unknown): boolean {
  if (!val) return true;
  const s = String(val).trim();
  return (
    s === "" ||
    s.startsWith("[PLACEHOLDER") ||
    s.startsWith("[ABN") ||
    s.startsWith("[SITE") ||
    s.includes("placeholder")
  );
}

/**
 * Strips newlines from header strings
 */
export function sanitizeSubject(val: string): string {
  return val.replace(/[\r\n]+/g, " ").trim();
}

