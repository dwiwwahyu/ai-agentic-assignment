import "dotenv/config";
import { Agent } from "@anvia/core";
import { OpenAIClient } from "@anvia/openai";
import { z } from "zod";

// ----------------------------------------
// 1. Connect to the AI model
// ----------------------------------------

const client = new OpenAIClient({
  apiKey: process.env.MUX_API_KEY!,
  baseUrl: process.env.MUX_BASE_URL!,
});

const model = client.completionModel({
  modelId: process.env.MODEL_ID!,
  api: "chat",
});

// ----------------------------------------
// 2. Define the expected ticket structure
// ----------------------------------------

const TicketSchema = z.object({
  category: z.enum([
    "account_access",
    "billing",
    "technical_issue",
    "other",
  ]),

  priority: z.enum([
    "low",
    "medium",
    "high",
  ]),

  impact: z.enum([
    "low",
    "medium",
    "high",
  ]),

  customerTier: z.enum([
    "standard",
    "premium",
    "enterprise",
  ]),
});

// ----------------------------------------
// 3. Create the AI classifier
// ----------------------------------------

const classifier = new Agent({
  id: "ticket-classifier",
  model,

  instructions: `
You are a customer support ticket classifier.

Read the customer's ticket and classify it into these fields:

- category
- priority
- impact
- customerTier

Allowed category values:
- account_access
- billing
- technical_issue
- other

Allowed priority values:
- low
- medium
- high

Allowed impact values:
- low
- medium
- high

Allowed customerTier values:
- standard
- premium
- enterprise

Do not use alternative words such as:
- urgent
- critical
- severe
- normal

Return only valid JSON.
`,

  maxTurns: 1,
});

// ----------------------------------------
// 4. Example support ticket
// ----------------------------------------

const ticket = `
I have been unable to access my account since this morning.
I'm an enterprise customer and this issue is blocking
our entire finance team from completing today's work.
`;

console.log("\n=== SUPPORT TICKET ===\n");
console.log(ticket);

// ----------------------------------------
// 5. Ask the AI to extract the information
// ----------------------------------------

const result = await classifier.generate({
  prompt: `
Extract the structured information from this support ticket.

Ticket:

${ticket}

Return JSON with exactly these fields:

{
  "category": "...",
  "priority": "...",
  "impact": "...",
  "customerTier": "..."
}
`,
});

// ----------------------------------------
// 6. Make sure the AI returned a response
// ----------------------------------------

if (result.type !== "response") {
  throw new Error("Classifier did not return a response");
}

console.log("\n=== RAW AI OUTPUT ===\n");
console.log(result.output);

// ----------------------------------------
// 7. Convert AI text into a JavaScript object
// ----------------------------------------

const parsed = JSON.parse(result.output);

// ----------------------------------------
// 8. Normalize unexpected AI values
// ----------------------------------------

// The AI might use words like "urgent" or "critical"
// even though our schema only allows "high".

if (
  parsed.priority === "urgent" ||
  parsed.priority === "critical"
) {
  parsed.priority = "high";
}

if (parsed.impact === "critical") {
  parsed.impact = "high";
}

// ----------------------------------------
// 9. Validate the structured data with Zod
// ----------------------------------------

const ticketData = TicketSchema.parse(parsed);

console.log("\n=== EXTRACTED TICKET DATA ===\n");
console.log(ticketData);

// ----------------------------------------
// 10. Deterministic routing logic
// ----------------------------------------

function routeTicket(
  ticket: z.infer<typeof TicketSchema>,
): string {

  // Enterprise + high priority
  if (
    ticket.priority === "high" &&
    ticket.customerTier === "enterprise"
  ) {
    return "enterprise-priority-support";
  }

  // Any high-impact/high-priority ticket
  if (
    ticket.priority === "high" &&
    ticket.impact === "high"
  ) {
    return "priority-support";
  }

  // Billing issues
  if (ticket.category === "billing") {
    return "billing-support";
  }

  // Technical issues
  if (ticket.category === "technical_issue") {
    return "technical-support";
  }

  // Everything else
  return "general-support";
}

// ----------------------------------------
// 11. Route the validated ticket
// ----------------------------------------

const destination = routeTicket(ticketData);

console.log("\n=== ROUTING RESULT ===\n");
console.log(`Ticket routed to: ${destination}`);