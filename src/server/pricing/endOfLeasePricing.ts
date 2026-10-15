/**
 * Clean & Crest — Server-Side End of Lease Pricing Engine
 *
 * SERVER-SIDE ONLY MODULE.
 * This module contains the proprietary End of Lease pricing matrix, add-on rates,
 * and calculation engine. It must never be imported in client components or bundled into the browser.
 */

export const PRICING_DATA_VERSION = "eol-2025-v1";

// Ensure this module cannot run in a browser environment
if (typeof window !== "undefined") {
  throw new Error("SERVER-SIDE ONLY: Pricing engine cannot be imported into client bundle.");
}

export type SupportedCity = "Brisbane" | "Perth" | "Melbourne";

export type PropertySizeKey =
  | "1-1"
  | "2-1"
  | "2-2"
  | "3-1"
  | "3-2"
  | "3-3"
  | "4-2"
  | "4-3"
  | "5-2"
  | "5-3";

export const PROPERTY_SIZE_KEYS: PropertySizeKey[] = [
  "1-1",
  "2-1",
  "2-2",
  "3-1",
  "3-2",
  "3-3",
  "4-2",
  "4-3",
  "5-2",
  "5-3",
];

export const PROPERTY_SIZE_LABELS: Record<PropertySizeKey, string> = {
  "1-1": "1 bed, 1 bath",
  "2-1": "2 bed, 1 bath",
  "2-2": "2 bed, 2 bath",
  "3-1": "3 bed, 1 bath",
  "3-2": "3 bed, 2 bath",
  "3-3": "3 bed, 3 bath",
  "4-2": "4 bed, 2 bath",
  "4-3": "4 bed, 3 bath",
  "5-2": "5 bed, 2 bath",
  "5-3": "5 bed, 3 bath",
};

/**
 * Base End of Lease rates in integer cents [withCarpet, noCarpet].
 * Explicit values for all cities (Perth is stored as explicit numbers, not recalculated at runtime).
 */
export const BASE_RATES_IN_CENTS: Record<
  SupportedCity,
  Record<PropertySizeKey, [number, number]>
> = {
  Brisbane: {
    "1-1": [35000, 32000],
    "2-1": [45000, 40000],
    "2-2": [48000, 42000],
    "3-1": [52000, 49000],
    "3-2": [58000, 52000],
    "3-3": [61000, 55000],
    "4-2": [67000, 60000],
    "4-3": [70000, 63000],
    "5-2": [70000, 63000],
    "5-3": [75000, 70000],
  },
  Perth: {
    "1-1": [33250, 30400],
    "2-1": [42750, 38000],
    "2-2": [45600, 39900],
    "3-1": [49400, 46550],
    "3-2": [55100, 49400],
    "3-3": [57950, 52250],
    "4-2": [63650, 57000],
    "4-3": [66500, 59850],
    "5-2": [66500, 59850],
    "5-3": [71250, 66500],
  },
  Melbourne: {
    "1-1": [22000, 20000],
    "2-1": [28000, 25000],
    "2-2": [32000, 28000],
    "3-1": [35000, 34000],
    "3-2": [38000, 36000],
    "3-3": [41000, 39000],
    "4-2": [42000, 40000],
    "4-3": [48000, 45000],
    "5-2": [48000, 45000],
    "5-3": [50000, 48000],
  },
};

/**
 * Flat Add-ons (per unit, integer cents)
 */
export const FLAT_ADD_ONS = {
  "mould-spot": {
    id: "mould-spot",
    label: "Shower Grout Mould Removal",
    unitLabel: "mould spot",
    priceCents: 5000, // $50
  },
  "wall-wash": {
    id: "wall-wash",
    label: "Wall Wash",
    unitLabel: "wall",
    priceCents: 2000, // $20
  },
  "blind": {
    id: "blind",
    label: "Blinds Cleaning",
    unitLabel: "blind",
    priceCents: 1500, // $15
  },
  "ac-filter": {
    id: "ac-filter",
    label: "Air Conditioner Filter Cleaning",
    unitLabel: "filter",
    priceCents: 2000, // $20
  },
  "garage-wash": {
    id: "garage-wash",
    label: "Standard Garage Wash",
    unitLabel: "unit",
    priceCents: 5000, // $50 (standard size, quantity 1)
  },
};

/**
 * Scale Add-ons (by bedroom count 1 to 5, integer cents)
 */
export const SCALE_ADD_ONS = {
  "outside-windows": {
    id: "outside-windows",
    label: "Outside Windows",
    ratesByCity: {
      Brisbane: [5000, 8000, 11000, 12000, 14000],
      Perth: [5000, 8000, 11000, 12000, 14000],
      Melbourne: [4000, 7000, 9000, 9000, 12000],
    },
    melbourneDoubleStoreyNote:
      "For double-storey houses in Melbourne this covers sliding doors only",
  },
  "wall-spots": {
    id: "wall-spots",
    label: "Wall Spots",
    ratesByCity: {
      Brisbane: [8000, 9000, 12000, 15000, 18000],
      Perth: [8000, 9000, 12000, 15000, 18000],
      Melbourne: [6000, 8000, 8000, 10000, 12000],
    },
  },
  "pest-flea": {
    id: "pest-flea",
    label: "Pest / Flea Treatment",
    ratesAllCities: [12000, 14000, 15000, 17000, 18000],
  },
};

export const EXTRA_CARPET_ZONE_CENTS = 4000; // $40 per zone

/**
 * Format AUD integer cents into en-AU string.
 * Whole dollars without cents ($580), otherwise 2 decimals ($332.50).
 */
export function formatAudCents(cents: number): string {
  if (cents % 100 === 0) {
    return `$${cents / 100}`;
  }
  return `$${(cents / 100).toFixed(2)}`;
}

export interface EstimateInputAddOn {
  id: string;
  quantity?: number;
}

export interface ServerEndOfLeaseEstimateInput {
  city?: string | null;
  bedrooms?: string | number | null;
  bathrooms?: string | number | null;
  storeys?: "Single" | "Double" | string | null;
  hasCarpet?: boolean | null;
  extraCarpetZones?: number | null;
  addOns?: EstimateInputAddOn[] | null;
  heavilySoiled?: boolean | null;
  beyond50km?: boolean | null;
  doubleStoreyDisplay?: "range" | "confirm";
  pestFleaEnabled?: boolean;
}

export interface EstimateAddOnLine {
  id: string;
  label: string;
  unitPrice: number;
  unitPriceFormatted: string;
  quantity: number;
  lineTotal: number;
  lineTotalFormatted: string;
}

export interface ServerEndOfLeaseEstimateResult {
  success: boolean;
  status: "exact" | "range" | "confirm";
  pricingDataVersion: string;
  baseAmount: number | null;
  baseAmountFormatted: string | null;
  doubleStoreyRange?: {
    minAmount: number;
    maxAmount: number;
    minFormatted: string;
    maxFormatted: string;
  } | null;
  extraCarpetZoneLine?: {
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    lineTotalFormatted: string;
  } | null;
  addOnLines: EstimateAddOnLine[];
  subtotal: number | null;
  subtotalFormatted: string | null;
  minFormatted?: string | null;
  maxFormatted?: string | null;
  reason?: string | null;
  notes: string[];
}

/**
 * Normalizes input city to SupportedCity or null.
 */
function normalizeCity(city?: string | null): SupportedCity | null {
  if (!city || typeof city !== "string") return null;
  const c = city.trim().toLowerCase();
  if (c === "brisbane") return "Brisbane";
  if (c === "perth") return "Perth";
  if (c === "melbourne") return "Melbourne";
  return null;
}

/**
 * Normalizes bedroom count to 1-5 or null.
 */
function normalizeBedrooms(bedrooms?: string | number | null): number | null {
  if (bedrooms === null || bedrooms === undefined) return null;
  const str = String(bedrooms).trim().toLowerCase();
  if (str === "studio") return null; // studio needs custom quote
  const num = parseInt(str, 10);
  if (isNaN(num) || num < 1 || num > 5) return null;
  return num;
}

/**
 * Normalizes bathroom count to 1-3 or null.
 */
function normalizeBathrooms(bathrooms?: string | number | null): number | null {
  if (bathrooms === null || bathrooms === undefined) return null;
  const str = String(bathrooms).trim().toLowerCase();
  const num = parseInt(str, 10);
  if (isNaN(num) || num < 1 || num > 3) return null;
  return num;
}

/**
 * Main server-side calculation engine for End of Lease Cleaning.
 */
export function calculateServerEndOfLeaseEstimate(
  input: ServerEndOfLeaseEstimateInput
): ServerEndOfLeaseEstimateResult {
  const notes: string[] = [
    "Prices assume a property in normal condition.",
    "Standard rates apply within 50km of the city CBD.",
  ];

  // 1. Check input bounds on quantities (0 to 50 allowed)
  if (input.extraCarpetZones !== null && input.extraCarpetZones !== undefined) {
    if (input.extraCarpetZones < 0 || input.extraCarpetZones > 50) {
      throw new Error("Extra carpet zones must be between 0 and 50.");
    }
  }

  if (Array.isArray(input.addOns)) {
    for (const a of input.addOns) {
      const q = a.quantity !== undefined ? a.quantity : 1;
      if (q < 0 || q > 50) {
        throw new Error(`Quantity for add-on ${a.id} must be between 0 and 50.`);
      }
    }
  }

  // 2. Check conditions requiring 'confirm' (custom quote)
  if (input.heavilySoiled) {
    return {
      success: true,
      status: "confirm",
      pricingDataVersion: PRICING_DATA_VERSION,
      baseAmount: null,
      baseAmountFormatted: null,
      doubleStoreyRange: null,
      extraCarpetZoneLine: null,
      addOnLines: [],
      subtotal: null,
      subtotalFormatted: null,
      reason: "Heavily soiled properties require a custom quote.",
      notes,
    };
  }

  if (input.beyond50km) {
    return {
      success: true,
      status: "confirm",
      pricingDataVersion: PRICING_DATA_VERSION,
      baseAmount: null,
      baseAmountFormatted: null,
      doubleStoreyRange: null,
      extraCarpetZoneLine: null,
      addOnLines: [],
      subtotal: null,
      subtotalFormatted: null,
      reason: "Properties more than 50km from the CBD require individual travel assessment.",
      notes,
    };
  }

  const city = normalizeCity(input.city);
  if (!city) {
    return {
      success: true,
      status: "confirm",
      pricingDataVersion: PRICING_DATA_VERSION,
      baseAmount: null,
      baseAmountFormatted: null,
      doubleStoreyRange: null,
      extraCarpetZoneLine: null,
      addOnLines: [],
      subtotal: null,
      subtotalFormatted: null,
      reason: "Custom quote required for properties outside our standard service zones.",
      notes,
    };
  }

  const bedNum = normalizeBedrooms(input.bedrooms);
  const bathNum = normalizeBathrooms(input.bathrooms);

  if (!bedNum || !bathNum) {
    return {
      success: true,
      status: "confirm",
      pricingDataVersion: PRICING_DATA_VERSION,
      baseAmount: null,
      baseAmountFormatted: null,
      doubleStoreyRange: null,
      extraCarpetZoneLine: null,
      addOnLines: [],
      subtotal: null,
      subtotalFormatted: null,
      reason: "Properties of this size require an individual quote.",
      notes,
    };
  }

  const sizeKey = `${bedNum}-${bathNum}` as PropertySizeKey;
  const rates = BASE_RATES_IN_CENTS[city][sizeKey];

  if (!rates) {
    return {
      success: true,
      status: "confirm",
      pricingDataVersion: PRICING_DATA_VERSION,
      baseAmount: null,
      baseAmountFormatted: null,
      doubleStoreyRange: null,
      extraCarpetZoneLine: null,
      addOnLines: [],
      subtotal: null,
      subtotalFormatted: null,
      reason: "This property size is not in our standard matrix and will be quoted individually.",
      notes,
    };
  }

  // 3. Compute Base Price
  const hasCarpet = Boolean(input.hasCarpet);
  const [carpetCents, noCarpetCents] = rates;
  const baseCents = hasCarpet ? carpetCents : noCarpetCents;
  const baseAmount = baseCents / 100;
  const baseAmountFormatted = formatAudCents(baseCents);

  if (hasCarpet) {
    notes.push("'With Carpet' includes standard bedrooms and main living room.");
  }

  // 4. Compute Extra Carpet Zones
  let extraCarpetZoneLine: {
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    lineTotalFormatted: string;
  } | null = null;

  let extraCarpetCents = 0;
  const extraZones = hasCarpet ? Math.max(0, input.extraCarpetZones || 0) : 0;
  if (hasCarpet && extraZones > 0) {
    extraCarpetCents = extraZones * EXTRA_CARPET_ZONE_CENTS;
    extraCarpetZoneLine = {
      unitPrice: EXTRA_CARPET_ZONE_CENTS / 100,
      quantity: extraZones,
      lineTotal: extraCarpetCents / 100,
      lineTotalFormatted: formatAudCents(extraCarpetCents),
    };
  }

  // 5. Compute Add-On Lines
  const addOnLines: EstimateAddOnLine[] = [];
  let addOnsTotalCents = 0;

  if (Array.isArray(input.addOns)) {
    for (const a of input.addOns) {
      const rawId = a.id;
      const id =
        rawId === "shower-grout-mould-removal"
          ? "mould-spot"
          : rawId === "blinds-cleaning" || rawId === "blinds"
          ? "blind"
          : rawId === "ac-filter-cleaning" || rawId === "ac-filters"
          ? "ac-filter"
          : rawId === "spot-cleaning"
          ? "wall-spots"
          : rawId;

      // Flat Add-on?
      if (id in FLAT_ADD_ONS) {
        const def = FLAT_ADD_ONS[id as keyof typeof FLAT_ADD_ONS];
        const qty = def.id === "garage-wash" ? 1 : (a.quantity !== undefined ? a.quantity : 1);
        const lineCents = def.priceCents * qty;
        addOnsTotalCents += lineCents;
        addOnLines.push({
          id: def.id,
          label: def.label,
          unitPrice: def.priceCents / 100,
          unitPriceFormatted: formatAudCents(def.priceCents),
          quantity: qty,
          lineTotal: lineCents / 100,
          lineTotalFormatted: formatAudCents(lineCents),
        });
      }

      // Scaled Add-on: Outside Windows
      else if (id === "outside-windows") {
        const def = SCALE_ADD_ONS["outside-windows"];
        const ratesArr = def.ratesByCity[city];
        const unitCents = ratesArr[bedNum - 1];
        const lineCents = unitCents * 1;
        addOnsTotalCents += lineCents;
        addOnLines.push({
          id: def.id,
          label: def.label,
          unitPrice: unitCents / 100,
          unitPriceFormatted: formatAudCents(unitCents),
          quantity: 1,
          lineTotal: lineCents / 100,
          lineTotalFormatted: formatAudCents(lineCents),
        });

        if (city === "Melbourne" && input.storeys === "Double") {
          notes.push(def.melbourneDoubleStoreyNote);
        }
      }

      // Scaled Add-on: Wall Spots
      else if (id === "wall-spots") {
        const def = SCALE_ADD_ONS["wall-spots"];
        const ratesArr = def.ratesByCity[city];
        const unitCents = ratesArr[bedNum - 1];
        const lineCents = unitCents * 1;
        addOnsTotalCents += lineCents;
        addOnLines.push({
          id: "wall-spots",
          label: def.label,
          unitPrice: unitCents / 100,
          unitPriceFormatted: formatAudCents(unitCents),
          quantity: 1,
          lineTotal: lineCents / 100,
          lineTotalFormatted: formatAudCents(lineCents),
        });
      }

      // Scaled Add-on: Pest / Flea
      else if (id === "pest-flea") {
        if (input.pestFleaEnabled) {
          const def = SCALE_ADD_ONS["pest-flea"];
          const unitCents = def.ratesAllCities[bedNum - 1];
          const lineCents = unitCents * 1;
          addOnsTotalCents += lineCents;
          addOnLines.push({
            id: def.id,
            label: def.label,
            unitPrice: unitCents / 100,
            unitPriceFormatted: formatAudCents(unitCents),
            quantity: 1,
            lineTotal: lineCents / 100,
            lineTotalFormatted: formatAudCents(lineCents),
          });
        }
      }
    }
  }

  // 6. Double-Storey Surcharge Handling
  const isDouble = input.storeys === "Double";
  const doubleMode = input.doubleStoreyDisplay || "range";

  if (isDouble) {
    // Double-storey base carries a 5% to 10% surcharge
    // 5% minimum surcharge, 10% maximum surcharge on base package
    const minBaseCents = Math.round(baseCents * 1.05);
    const maxBaseCents = Math.round(baseCents * 1.10);

    const minTotalCents = minBaseCents + extraCarpetCents + addOnsTotalCents;
    const maxTotalCents = maxBaseCents + extraCarpetCents + addOnsTotalCents;

    if (doubleMode === "confirm") {
      notes.push("Double-storey surcharge will be confirmed in your quote.");
      return {
        success: true,
        status: "confirm",
        pricingDataVersion: PRICING_DATA_VERSION,
        baseAmount,
        baseAmountFormatted,
        doubleStoreyRange: {
          minAmount: minBaseCents / 100,
          maxAmount: maxBaseCents / 100,
          minFormatted: formatAudCents(minBaseCents),
          maxFormatted: formatAudCents(maxBaseCents),
        },
        extraCarpetZoneLine,
        addOnLines,
        subtotal: null,
        subtotalFormatted: null,
        reason: "Plus a double-storey surcharge, confirmed in your quote.",
        notes,
      };
    }

    // Default 'range' display
    notes.push("Double-storey base packages carry a 5% to 10% surcharge depending on property layout.");
    return {
      success: true,
      status: "range",
      pricingDataVersion: PRICING_DATA_VERSION,
      baseAmount,
      baseAmountFormatted,
      doubleStoreyRange: {
        minAmount: minBaseCents / 100,
        maxAmount: maxBaseCents / 100,
        minFormatted: formatAudCents(minBaseCents),
        maxFormatted: formatAudCents(maxBaseCents),
      },
      extraCarpetZoneLine,
      addOnLines,
      subtotal: null,
      subtotalFormatted: null,
      minFormatted: formatAudCents(minTotalCents),
      maxFormatted: formatAudCents(maxTotalCents),
      notes,
    };
  }

  // Single Storey — Exact Total
  const totalCents = baseCents + extraCarpetCents + addOnsTotalCents;
  const subtotal = totalCents / 100;
  const subtotalFormatted = formatAudCents(totalCents);

  return {
    success: true,
    status: "exact",
    pricingDataVersion: PRICING_DATA_VERSION,
    baseAmount,
    baseAmountFormatted,
    doubleStoreyRange: null,
    extraCarpetZoneLine,
    addOnLines,
    subtotal,
    subtotalFormatted,
    notes,
  };
}
