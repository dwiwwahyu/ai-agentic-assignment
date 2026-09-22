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

const agent = new Agent({
  id: "hello-agent",
  model,
  instructions: "Answer questions clearly and concisely.",
  maxTurns: 1,
});

const result = await agent.generate({
  prompt: "Explain what an API is in one simple sentence.",
});

if (result.type === "response") {
  console.log(result.output);
} else {
  console.log("Agent did not return a response:", result);
}