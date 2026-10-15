#!/usr/bin/env node

/**
 * Clean & Crest — End of Lease Pricing Engine Unit Tests
 *
 * Verifies calculation accuracy, business rules, edge cases,
 * and outputs comparison table for all 60 base rates combinations.
 */

import {
  calculateServerEndOfLeaseEstimate,
  PROPERTY_SIZE_KEYS,
} from "../src/server/pricing/endOfLeasePricing.ts";

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

let failures = 0;
let passed = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    passed++;
    console.log(`  ${green("✔")} ${testName}`);
  } else {
    failures++;
    console.error(`  ${red("✖")} ${testName}`);
    if (details) {
      console.error(`    ${red(details)}`);
    }
  }
}

console.log("\n" + cyan("=".repeat(76)));
console.log(bold(cyan("  CLEAN & CREST — END OF LEASE PRICING ENGINE VERIFICATION")));
console.log(cyan("=".repeat(76)) + "\n");

// -----------------------------------------------------------------------------
// REQUIRED TEST CASES FROM PROJECT SPECIFICATION
// -----------------------------------------------------------------------------
console.log(bold("Section 1: Required Pricing & Policy Scenarios (15 Cases)"));

// 1. Brisbane 3bed2bath with carpet = 580
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Brisbane",
    bedrooms: 3,
    bathrooms: 2,
    hasCarpet: true,
  });
  assert(
    res.status === "exact" && res.subtotal === 580 && res.subtotalFormatted === "$580",
    "1. Brisbane 3bed2bath with carpet = 580",
    `Got: status=${res.status}, subtotal=${res.subtotal}, formatted=${res.subtotalFormatted}`
  );
}

// 2. Brisbane 3bed2bath no carpet = 520
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Brisbane",
    bedrooms: 3,
    bathrooms: 2,
    hasCarpet: false,
  });
  assert(
    res.status === "exact" && res.subtotal === 520 && res.subtotalFormatted === "$520",
    "2. Brisbane 3bed2bath no carpet = 520",
    `Got: status=${res.status}, subtotal=${res.subtotal}, formatted=${res.subtotalFormatted}`
  );
}

// 3. Perth 2bed1bath no carpet = 380
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Perth",
    bedrooms: 2,
    bathrooms: 1,
    hasCarpet: false,
  });
  assert(
    res.status === "exact" && res.subtotal === 380 && res.subtotalFormatted === "$380",
    "3. Perth 2bed1bath no carpet = 380",
    `Got: status=${res.status}, subtotal=${res.subtotal}, formatted=${res.subtotalFormatted}`
  );
}

// 4. Perth 1bed1bath with carpet = 332.50
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Perth",
    bedrooms: 1,
    bathrooms: 1,
    hasCarpet: true,
  });
  assert(
    res.status === "exact" && res.subtotal === 332.5 && res.subtotalFormatted === "$332.50",
    "4. Perth 1bed1bath with carpet = 332.50",
    `Got: status=${res.status}, subtotal=${res.subtotal}, formatted=${res.subtotalFormatted}`
  );
}

// 5. Melbourne 1bed1bath with carpet = 220
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Melbourne",
    bedrooms: 1,
    bathrooms: 1,
    hasCarpet: true,
  });
  assert(
    res.status === "exact" && res.subtotal === 220 && res.subtotalFormatted === "$220",
    "5. Melbourne 1bed1bath with carpet = 220",
    `Got: status=${res.status}, subtotal=${res.subtotal}, formatted=${res.subtotalFormatted}`
  );
}

// 6. Melbourne 5bed3bath no carpet = 480
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Melbourne",
    bedrooms: 5,
    bathrooms: 3,
    hasCarpet: false,
  });
  assert(
    res.status === "exact" && res.subtotal === 480 && res.subtotalFormatted === "$480",
    "6. Melbourne 5bed3bath no carpet = 480",
    `Got: status=${res.status}, subtotal=${res.subtotal}, formatted=${res.subtotalFormatted}`
  );
}

// 7. Brisbane 3bed2bath with carpet plus 2 extra carpet zones = 660
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Brisbane",
    bedrooms: 3,
    bathrooms: 2,
    hasCarpet: true,
    extraCarpetZones: 2,
  });
  assert(
    res.status === "exact" && res.subtotal === 660 && res.subtotalFormatted === "$660",
    "7. Brisbane 3bed2bath with carpet plus 2 extra carpet zones = 660",
    `Got: status=${res.status}, subtotal=${res.subtotal}, formatted=${res.subtotalFormatted}`
  );
}

// 8. Brisbane 3bed2bath with carpet plus 2 extra zones plus 3 blinds plus 3-bed wall spots = 825
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Brisbane",
    bedrooms: 3,
    bathrooms: 2,
    hasCarpet: true,
    extraCarpetZones: 2,
    addOns: [
      { id: "blind", quantity: 3 },
      { id: "wall-spots" },
    ],
  });
  assert(
    res.status === "exact" && res.subtotal === 825 && res.subtotalFormatted === "$825",
    "8. Brisbane 3bed2bath with carpet plus 2 extra zones plus 3 blinds plus 3-bed wall spots = 825",
    `Got: status=${res.status}, subtotal=${res.subtotal}, formatted=${res.subtotalFormatted}`
  );
}

// 9. Melbourne 4bed outside windows = 90
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Melbourne",
    bedrooms: 4,
    bathrooms: 2,
    hasCarpet: false,
    addOns: [{ id: "outside-windows" }],
  });
  const windowLine = res.addOnLines.find((a) => a.id === "outside-windows");
  assert(
    res.status === "exact" &&
      windowLine !== undefined &&
      windowLine.lineTotal === 90 &&
      windowLine.lineTotalFormatted === "$90",
    "9. Melbourne 4bed outside windows = 90",
    `Got: status=${res.status}, windowLine=${JSON.stringify(windowLine)}`
  );
}

// 10. Brisbane 3bed double-storey range for base 580 = 609 to 638
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Brisbane",
    bedrooms: 3,
    bathrooms: 2,
    hasCarpet: true,
    storeys: "Double",
    doubleStoreyDisplay: "range",
  });
  assert(
    res.status === "range" &&
      res.doubleStoreyRange !== null &&
      res.doubleStoreyRange?.minAmount === 609 &&
      res.doubleStoreyRange?.maxAmount === 638 &&
      res.minFormatted === "$609" &&
      res.maxFormatted === "$638",
    "10. Brisbane 3bed double-storey range for base 580 = 609 to 638",
    `Got: status=${res.status}, min=${res.minFormatted}, max=${res.maxFormatted}, range=${JSON.stringify(res.doubleStoreyRange)}`
  );
}

// 11. 1bed2bath = confirm
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Brisbane",
    bedrooms: 1,
    bathrooms: 2,
    hasCarpet: true,
  });
  assert(
    res.status === "confirm" && res.subtotal === null,
    "11. 1bed2bath = confirm",
    `Got: status=${res.status}, reason=${res.reason}`
  );
}

// 12. Other area = confirm
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Other area",
    bedrooms: 3,
    bathrooms: 2,
    hasCarpet: true,
  });
  assert(
    res.status === "confirm" && res.subtotal === null,
    "12. Other area = confirm",
    `Got: status=${res.status}, reason=${res.reason}`
  );
}

// 13. heavilySoiled = confirm
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Brisbane",
    bedrooms: 3,
    bathrooms: 2,
    hasCarpet: true,
    heavilySoiled: true,
  });
  assert(
    res.status === "confirm" && res.subtotal === null,
    "13. heavilySoiled = confirm",
    `Got: status=${res.status}, reason=${res.reason}`
  );
}

// 14. pest/flea hidden while the flag is false
{
  const res = calculateServerEndOfLeaseEstimate({
    city: "Brisbane",
    bedrooms: 3,
    bathrooms: 2,
    hasCarpet: true,
    pestFleaEnabled: false,
    addOns: [{ id: "pest-flea" }],
  });
  const pestLine = res.addOnLines.find((a) => a.id === "pest-flea");
  assert(
    pestLine === undefined && res.subtotal === 580,
    "14. pest/flea hidden while the flag is false",
    `Got: pestLine=${JSON.stringify(pestLine)}, subtotal=${res.subtotal}`
  );
}

// 15. quantities above 50 rejected
{
  let threwExtra = false;
  try {
    calculateServerEndOfLeaseEstimate({
      city: "Brisbane",
      bedrooms: 3,
      bathrooms: 2,
      hasCarpet: true,
      extraCarpetZones: 51,
    });
  } catch {
    threwExtra = true;
  }

  let threwAddOn = false;
  try {
    calculateServerEndOfLeaseEstimate({
      city: "Brisbane",
      bedrooms: 3,
      bathrooms: 2,
      hasCarpet: true,
      addOns: [{ id: "blind", quantity: 51 }],
    });
  } catch {
    threwAddOn = true;
  }

  assert(
    threwExtra && threwAddOn,
    "15. quantities above 50 rejected",
    `Got: threwExtra=${threwExtra}, threwAddOn=${threwAddOn}`
  );
}

// -----------------------------------------------------------------------------
// PART 2: FULL 60 BASE RATES TABLE VERIFICATION (100% MATCH)
// -----------------------------------------------------------------------------
console.log("\n" + bold("Section 2: Complete Base Rates Verification (60 Combinations)"));

const EXPECTED_RATES = {
  Brisbane: {
    "1-1": [350, 320],
    "2-1": [450, 400],
    "2-2": [480, 420],
    "3-1": [520, 490],
    "3-2": [580, 520],
    "3-3": [610, 550],
    "4-2": [670, 600],
    "4-3": [700, 630],
    "5-2": [700, 630],
    "5-3": [750, 700],
  },
  Perth: {
    "1-1": [332.50, 304.00],
    "2-1": [427.50, 380.00],
    "2-2": [456.00, 399.00],
    "3-1": [494.00, 465.50],
    "3-2": [551.00, 494.00],
    "3-3": [579.50, 522.50],
    "4-2": [636.50, 570.00],
    "4-3": [665.00, 598.50],
    "5-2": [665.00, 598.50],
    "5-3": [712.50, 665.00],
  },
  Melbourne: {
    "1-1": [220, 200],
    "2-1": [280, 250],
    "2-2": [320, 280],
    "3-1": [350, 340],
    "3-2": [380, 360],
    "3-3": [410, 390],
    "4-2": [420, 400],
    "4-3": [480, 450],
    "5-2": [480, 450],
    "5-3": [500, 480],
  },
};

const cities = ["Brisbane", "Perth", "Melbourne"];
let matrixPassed = 0;
let matrixTotal = 0;

for (const city of cities) {
  for (const size of PROPERTY_SIZE_KEYS) {
    const [bed, bath] = size.split("-").map(Number);
    const [expWithCarpet, expNoCarpet] = EXPECTED_RATES[city][size];

    // With Carpet
    matrixTotal++;
    const resCarpet = calculateServerEndOfLeaseEstimate({
      city,
      bedrooms: bed,
      bathrooms: bath,
      hasCarpet: true,
    });
    if (resCarpet.status === "exact" && resCarpet.subtotal === expWithCarpet) {
      matrixPassed++;
    } else {
      console.error(red(`Mismatch in ${city} ${size} withCarpet: expected ${expWithCarpet}, got ${resCarpet.subtotal}`));
    }

    // No Carpet
    matrixTotal++;
    const resNoCarpet = calculateServerEndOfLeaseEstimate({
      city,
      bedrooms: bed,
      bathrooms: bath,
      hasCarpet: false,
    });
    if (resNoCarpet.status === "exact" && resNoCarpet.subtotal === expNoCarpet) {
      matrixPassed++;
    } else {
      console.error(red(`Mismatch in ${city} ${size} noCarpet: expected ${expNoCarpet}, got ${resNoCarpet.subtotal}`));
    }
  }
}

console.log(
  `\nMatrix Check: ${matrixPassed}/${matrixTotal} combinations matched (${Math.round((matrixPassed / matrixTotal) * 100)}%)`
);
console.log(
  `Scenario Tests: ${passed}/${passed + failures} passed\n`
);

if (failures > 0 || matrixPassed !== matrixTotal) {
  console.error(red(`❌ Pricing engine verification failed with ${failures} failure(s).`));
  process.exit(1);
} else {
  console.log(green("✅ All 15 required scenarios and all 60 base rate combinations verified with 100% exact match."));
  process.exit(0);
}
