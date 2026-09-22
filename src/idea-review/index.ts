import "dotenv/config";
import { Agent } from "@anvia/core";
import { OpenAIClient } from "@anvia/openai";

const client = new OpenAIClient({
  apiKey: process.env.MUX_API_KEY!,
  baseUrl: process.env.MUX_BASE_URL!,
});

const model = client.completionModel({
  modelId: process.env.MODEL_ID!,
  api: "chat",
});


const productReviewer = new Agent({
  id: "product-reviewer",
  model,
  instructions: `
You are a product strategist.

Review the product idea from a customer and product perspective.

Evaluate:
- Who would use it
- What problem it solves
- Why users might care
- Potential weaknesses

Be concise and practical.
`,
  maxTurns: 1,
});

const growthReviewer = new Agent({
  id: "growth-reviewer",
  model,
  instructions: `
You are a growth strategist.

Review the product idea from a business and growth perspective.

Evaluate:
- Potential target market
- Possible business value
- Adoption challenges
- How the product could differentiate itself

Be concise and practical.
`,
  maxTurns: 1,
});

const engineeringReviewer = new Agent({
  id: "engineering-reviewer",
  model,
  instructions: `
You are a senior software engineer.

Review the product idea from a technical perspective.

Evaluate:
- Technical feasibility
- Major technical challenges
- Data or infrastructure requirements
- Important risks

Be concise and practical.
`,
  maxTurns: 1,
});

const idea = `
An AI assistant that automatically summarizes a company's
daily Slack conversations and sends each employee a personalized
summary of the discussions they missed.
`;

console.log("\n=== PRODUCT IDEA ===\n");
console.log(idea);

const [productResult, growthResult, engineeringResult] =
  await Promise.all([
    productReviewer.generate({
      prompt: idea,
    }),

    growthReviewer.generate({
      prompt: idea,
    }),

    engineeringReviewer.generate({
      prompt: idea,
    }),
  ]);

if (
  productResult.type !== "response" ||
  growthResult.type !== "response" ||
  engineeringResult.type !== "response"
) {
  throw new Error("One of the reviewers failed");
}

const productReview = productResult.output;
const growthReview = growthResult.output;
const engineeringReview = engineeringResult.output;

console.log("\n=== PRODUCT REVIEW ===\n");
console.log(productReview);

console.log("\n=== GROWTH REVIEW ===\n");
console.log(growthReview);

console.log("\n=== ENGINEERING REVIEW ===\n");
console.log(engineeringReview);

const synthesizer = new Agent({
  id: "idea-synthesizer",
  model,
  instructions: `
You are a product review lead.

You will receive reviews from three specialists:
- Product
- Growth
- Engineering

Combine their perspectives into one balanced review.

Structure your response as:

1. Product value
2. Business potential
3. Technical feasibility
4. Main risks
5. Recommended next experiment

Do not simply repeat the reviews.
Synthesize the most important insights.
`,
  maxTurns: 1,
});

const synthesisPrompt = `
Product idea:

${idea}

Product review:

${productReview}

Growth review:

${growthReview}

Engineering review:

${engineeringReview}

Create a balanced final review based on all three perspectives.
`;

const synthesisResult = await synthesizer.generate({
  prompt: synthesisPrompt,
});

if (synthesisResult.type !== "response") {
  throw new Error("Synthesizer did not return a response");
}

console.log("\n=== FINAL REVIEW ===\n");
console.log(synthesisResult.output);

