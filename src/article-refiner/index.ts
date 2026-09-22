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

// Agent 1: analyzes the article
const analyzer = new Agent({
  id: "article-analyzer",
  model,
  instructions: `
You are an article quality analyzer.

Analyze the article provided by the user.

Identify:
1. The main weakness of the article
2. Problems with clarity
3. Problems with structure
4. Missing details or examples
5. Specific improvements that an editor should make

Do not rewrite the article.
Only provide an improvement plan.
`,
  maxTurns: 1,
});

// Agent 2: rewrites the article
const editor = new Agent({
  id: "article-editor",
  model,
  instructions: `
You are an experienced article editor.

Rewrite the article based on:
1. The original article
2. The improvement plan from another agent

Improve clarity, structure, readability, and usefulness.

Return only the rewritten article.
`,
  maxTurns: 1,
});

const article = `
Artificial intelligence is changing many industries.
It can help companies work faster and make better decisions.
But companies need to be careful when implementing AI.
`;

console.log("\n=== ORIGINAL ARTICLE ===\n");
console.log(article);

// Step 1: analyze the article
const analysisResult = await analyzer.generate({
  prompt: article,
});

if (analysisResult.type !== "response") {
  throw new Error("Analyzer did not return a response");
}

const analysis = analysisResult.output;

console.log("\n=== ANALYSIS ===\n");
console.log(analysis);

// Step 2: send the original article + analysis to the editor
const editorPrompt = `
Original article:

${article}

Improvement plan:

${analysis}

Rewrite the article using the improvement plan.
`;

const editedResult = await editor.generate({
  prompt: editorPrompt,
});

if (editedResult.type !== "response") {
  throw new Error("Editor did not return a response");
}

console.log("\n=== REWRITTEN ARTICLE ===\n");
console.log(editedResult.output);