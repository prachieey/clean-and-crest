import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

console.log(`🧪 Running Transactional Email Test Suite against ${BASE_URL}...\n`);

async function runTests() {
  // ---------------------------------------------------------------------------
  // Test 1: Customer Confirmation Email (End of Lease)
  // ---------------------------------------------------------------------------
  console.log("Test 1: Customer Confirmation Preview (End of Lease)");
  const eolRes = await fetch(`${BASE_URL}/api/dev/email-preview?type=customer&service=eol&format=html`);
  assert.equal(eolRes.status, 200, "Preview endpoint must return 200");
  const eolHtml = await eolRes.text();
  const eolSubject = eolRes.headers.get("x-email-subject") || "";

  assert.ok(eolSubject.includes("We've received your request - Clean & Crest"), "Subject has expected format");
  assert.ok(eolHtml.includes("Bond Back Assurance"), "EOL email contains Bond Back Assurance");
  assert.ok(eolHtml.includes("3 working days"), "Assurance includes 3 working days condition");
  assert.ok(eolHtml.includes("/terms"), "Assurance links to terms");
  assert.ok(!eolHtml.includes("[ABN]"), "Must NOT contain [ABN] placeholder");
  assert.ok(!eolHtml.includes("<script>"), "Must escape all user inputs");
  assert.ok(!eolHtml.includes("guaranteed"), "Must not use prohibited 'guaranteed' claim");
  console.log("  ✅ Customer confirmation (EOL) pass");

  // ---------------------------------------------------------------------------
  // Test 2: Customer Confirmation Email (General Cleaning)
  // ---------------------------------------------------------------------------
  console.log("\nTest 2: Customer Confirmation Preview (General Cleaning)");
  const genRes = await fetch(`${BASE_URL}/api/dev/email-preview?type=customer&service=general&format=html`);
  assert.equal(genRes.status, 200);
  const genHtml = await genRes.text();

  assert.ok(!genHtml.includes("Bond Back Assurance"), "General Cleaning must NOT show Bond Back Assurance");
  assert.ok(genHtml.includes("General Cleaning"), "Shows service title");
  assert.ok(genHtml.includes("Michael"), "Addresses customer by first name");
  console.log("  ✅ Customer confirmation (General Clean) pass");

  // ---------------------------------------------------------------------------
  // Test 3: Customer Plain Text Version
  // ---------------------------------------------------------------------------
  console.log("\nTest 3: Customer Email Plain Text Version");
  const textRes = await fetch(`${BASE_URL}/api/dev/email-preview?type=customer&service=eol&format=text`);
  assert.equal(textRes.status, 200);
  const textBody = await textRes.text();

  assert.ok(!textBody.includes("<html"), "Plain text must not contain HTML tags");
  assert.ok(textBody.includes("Jane"), "Greets customer by name");
  assert.ok(textBody.includes("Bond Back Assurance"), "Text version mentions assurance for EOL");
  assert.ok(textBody.length > 200, "Plain text must have substantial content");
  console.log("  ✅ Customer plain text version pass");

  // ---------------------------------------------------------------------------
  // Test 4: Business Notification Email
  // ---------------------------------------------------------------------------
  console.log("\nTest 4: Business Notification Email");
  const bizRes = await fetch(`${BASE_URL}/api/dev/email-preview?type=business&service=eol&format=html`);
  assert.equal(bizRes.status, 200);
  const bizHtml = await bizRes.text();
  const bizSubject = bizRes.headers.get("x-email-subject") || "";

  assert.ok(bizSubject.startsWith("New End of Lease Cleaning request"), "Business subject follows pattern");
  assert.ok(bizHtml.includes("0412 345 678"), "Contains click-to-call phone number");
  assert.ok(bizHtml.includes("jane.doe@example.com.au"), "Contains customer email");
  assert.ok(bizHtml.includes("South Yarra"), "Contains suburb");
  assert.ok(bizHtml.includes("$480.00"), "Contains estimated amount for business");
  console.log("  ✅ Business notification email pass");

  // ---------------------------------------------------------------------------
  // Test 5: End-to-End Quote API Dispatch & Idempotency
  // ---------------------------------------------------------------------------
  console.log("\nTest 5: Live Quote Submission API & Idempotency");
  const quotePayload = {
    service: "End of Lease Cleaning",
    city: "Melbourne",
    propertyType: "Apartment",
    bedrooms: "2",
    bathrooms: "1",
    hasCarpet: true,
    extraCarpetZones: 0,
    storeys: "Single",
    withinRadius: "yes",
    suburb: "St Kilda",
    postcode: "3182",
    fullName: "Integration Test User",
    phone: "0400 123 456",
    email: "delivered@resend.dev",
    preferredContactMethod: "Phone Call",
    preferredDateOption: "flexible",
    vacancyAcknowledged: true,
    termsAcknowledged: true,
    consent: true,
    clientToken: `TOKEN-${Date.now()}`,
  };

  const submit1 = await fetch(`${BASE_URL}/api/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quotePayload),
  });
  const data1 = await submit1.json();

  assert.equal(submit1.status, 200, "First submission must succeed");
  assert.equal(data1.success, true);
  assert.ok(data1.quoteReference, "Reference number must be generated");
  assert.ok(data1.emailConfigured, "Email configured flag must be returned");

  // Immediate second submission with identical clientToken (idempotency check)
  const submit2 = await fetch(`${BASE_URL}/api/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quotePayload),
  });
  const data2 = await submit2.json();

  assert.equal(submit2.status, 200);
  assert.equal(data2.quoteReference, data1.quoteReference, "Idempotent request must return identical reference without duplicate creation");
  console.log("  ✅ Quote API dispatch and idempotency pass");

  console.log("\n✨ ALL 5 TRANSACTIONAL EMAIL TESTS PASSED SUCCESSFULLY! ✨\n");
}

runTests().catch((err) => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
