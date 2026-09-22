# AI Agentic Engineering Learning Project

A learning project for understanding AI engineering and agentic patterns using TypeScript, Anvia, and an OpenAI-compatible AI gateway.

This repository intentionally keeps the early learning files alongside the assignment implementations. The goal is to document the learning progression from basic TypeScript and AI model calls to multi-agent workflows.

---

## Learning Progression

### 1. TypeScript Basics

File:

`src/hello.ts`

This was the first TypeScript program created while setting up the project.

It demonstrates:

- TypeScript file structure
- Variables
- Type annotations
- Console output
- Running TypeScript using `tsx`

Example:

```typescript
const message: string = "Hello from my AI Engineering project";

console.log(message);

Run it with:

pnpm exec tsx src/hello.ts
2. First AI Agent

File:

src/hello-agent.ts

After learning the basic TypeScript setup, the next step was creating the first working AI agent using Anvia.

It demonstrates:

Creating an Anvia Agent
Connecting Anvia to an AI model
Using an OpenAI-compatible API
Configuring the model
Calling agent.generate()
Handling the agent response

The basic architecture is:

TypeScript
    ↓
Anvia Agent
    ↓
Anvia OpenAI Adapter
    ↓
Devscale AI Gateway
    ↓
DeepSeek V4.1 Flash

Run it with:

pnpm exec tsx src/hello-agent.ts
3. Article Refiner

File:

src/article-refiner/index.ts

The Article Refiner is the first agentic workflow in the project.

Instead of asking one agent to perform the entire task, the workflow is divided into two agents.

Original Article
       ↓
Analyzer Agent
       ↓
Improvement Plan
       ↓
Editor Agent
       ↓
Rewritten Article
Analyzer Agent

The Analyzer reviews the article and identifies:

Main weaknesses
Clarity problems
Structural problems
Missing details
Possible improvements

The Analyzer does not rewrite the article.

Editor Agent

The Editor receives:

The original article
The Analyzer's improvement plan

It then produces the rewritten article.

Main Concept

This is a sequential agentic pattern.

The second agent depends on the output of the first agent.

Agent A
   ↓
Output
   ↓
Agent B

This workflow also demonstrates asynchronous programming using:

await

Run it with:

pnpm exec tsx src/article-refiner/index.ts
4. Idea Review Board

File:

src/idea-review/index.ts

The Idea Review Board demonstrates a parallel multi-agent workflow.

Instead of sending the idea to reviewers one by one, independent reviewers work on the same idea concurrently.

                         Product Idea
                              │
                ┌─────────────┼─────────────┐
                ↓             ↓             ↓
           Product         Growth       Engineering
           Reviewer        Reviewer       Reviewer
                │             │             │
                └─────────────┼─────────────┘
                              ↓
                         Synthesizer
                              ↓
                        Final Review
Product Reviewer

Reviews the idea from a product perspective:

Customer problem
Target users
Product value
Product weaknesses
Growth Reviewer

Reviews the idea from a business and growth perspective:

Target market
Business value
Adoption challenges
Differentiation
Engineering Reviewer

Reviews the idea from a technical perspective:

Technical feasibility
Technical challenges
Infrastructure requirements
Technical risks
Synthesizer

The Synthesizer receives all three reviews and creates a final balanced review.

Main Concept

This is a fan-out → fan-in pattern.

The reviewers are independent, so they can run concurrently.

The implementation uses:

Promise.all()

Conceptually:

                 Input
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
     Agent A    Agent B    Agent C
        │          │          │
        └──────────┼──────────┘
                   ↓
                Agent D

Run it with:

pnpm exec tsx src/idea-review/index.ts
5. Ticket Triage

File:

src/ticket-triage/index.ts

The Ticket Triage assignment demonstrates a different AI engineering pattern.

The AI is responsible for understanding the support ticket and extracting structured information.

The final routing decision is handled by deterministic TypeScript logic.

Support Ticket
      ↓
AI Classifier
      ↓
Raw AI Output
      ↓
Normalization
      ↓
Zod Validation
      ↓
Validated Ticket Data
      ↓
TypeScript Router
      ↓
Support Destination
AI Classifier

The classifier extracts:

Category
Priority
Impact
Customer tier

For example:

{
  "category": "account_access",
  "priority": "high",
  "impact": "high",
  "customerTier": "enterprise"
}
Normalization

LLMs can sometimes return unexpected but semantically similar values.

For example:

urgent
critical

instead of:

high

The application normalizes these values before validation.

For example:

urgent → high
critical → high

This makes the AI output compatible with the application's expected structure.

Zod Validation

Zod acts as a schema gate.

The application defines the allowed values.

Category:

account_access
billing
technical_issue
other

Priority:

low
medium
high

Impact:

low
medium
high

Customer tier:

standard
premium
enterprise

If the AI produces a value outside these allowed options, Zod rejects the data.

The flow is:

Raw AI Output
      ↓
Normalization
      ↓
Zod Schema
   ↙       ↘
Valid     Invalid
  ↓          ↓
Continue    Reject
Deterministic Router

After the ticket has been validated, normal TypeScript logic determines where the ticket should go.

For example:

if (
  ticket.priority === "high" &&
  ticket.customerTier === "enterprise"
) {
  return "enterprise-priority-support";
}

The routing decision does not depend on another LLM call.

This makes the business logic predictable and easier to test.

Main Concept

This assignment demonstrates an important AI engineering principle:

Use the LLM for tasks that require interpretation, and use deterministic application code for business rules that need predictable behavior.

The architecture is:

              LLM
               │
               │ Interpretation
               ↓
        Structured Data
               │
               ↓
             Zod
               │
               │ Validation
               ↓
       TypeScript Business Logic
               │
               │ Deterministic Decision
               ↓
             Action

Run it with:

pnpm exec tsx src/ticket-triage/index.ts
Summary

The project currently demonstrates three different agentic patterns.

Sequential

Article Refiner

Agent A
   ↓
Agent B

The second agent depends on the first agent's output.

Parallel

Idea Review Board

       ┌→ Agent A ─┐
Input ─┼→ Agent B ─┼→ Synthesizer
       └→ Agent C ─┘

Multiple independent agents work concurrently before their outputs are combined.

Structured Extraction + Deterministic Logic

Ticket Triage

Ticket
  ↓
LLM
  ↓
Structured Data
  ↓
Zod Validation
  ↓
TypeScript Rules
  ↓
Action

The LLM interprets the unstructured input, while deterministic code handles the business rules.

Technology Stack
TypeScript
Node.js
pnpm
Anvia
@anvia/core
@anvia/openai
Zod
OpenAI-compatible API
Devscale AI Gateway
DeepSeek V4.1 Flash
Project Structure
ai-agentic-assignment/
│
├── src/
│   │
│   ├── hello.ts
│   │
│   ├── hello-agent.ts
│   │
│   ├── article-refiner/
│   │   └── index.ts
│   │
│   ├── idea-review/
│   │   └── index.ts
│   │
│   └── ticket-triage/
│       └── index.ts
│
├── .env
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── tsconfig.json

The .env file contains the API key and should not be committed to GitHub.

Running the Project
TypeScript Basics
pnpm exec tsx src/hello.ts
First AI Agent
pnpm exec tsx src/hello-agent.ts
Article Refiner
pnpm exec tsx src/article-refiner/index.ts
Idea Review Board
pnpm exec tsx src/idea-review/index.ts
Ticket Triage
pnpm exec tsx src/ticket-triage/index.ts
Learning Goal

This repository is intentionally built from the basics rather than starting directly with a complex AI architecture.

The learning progression is:

TypeScript Basics
       ↓
First AI Model Call
       ↓
Anvia Agent
       ↓
Sequential Agent Workflow
       ↓
Parallel Agent Workflow
       ↓
Structured AI Output
       ↓
Zod Validation
       ↓
Deterministic Business Logic

The early files such as hello.ts and hello-agent.ts are intentionally kept in the repository because they represent the starting point of the learning process.

The goal is not only to complete the assignments, but to understand how each component works and how simple AI model calls can gradually become more structured agentic systems.

fuck you, 

You're right. I misunderstood what you meant by “all in one copyable markdown.”

You wanted the entire README as one single Markdown block that can be copied directly, without me breaking the Markdown into multiple code blocks.

Sorry about that.

yes

Yes. Here is the entire README as one single copyable block — nothing split up. You can select everything inside the block and paste it directly into README.md.

# AI Agentic Engineering Learning Project

A learning project for understanding AI engineering and agentic patterns using TypeScript, Anvia, and an OpenAI-compatible AI gateway.

This repository intentionally keeps the early learning files alongside the assignment implementations. The goal is to document the learning progression from basic TypeScript and AI model calls to multi-agent workflows.

---

## Learning Progression

### 1. TypeScript Basics

File: `src/hello.ts`

This was the first TypeScript program created while setting up the project.

It demonstrates:

- TypeScript file structure
- Variables
- Type annotations
- Console output
- Running TypeScript using `tsx`

Example:

```typescript
const message: string = "Hello from my AI Engineering project";

console.log(message);

Run it with:

pnpm exec tsx src/hello.ts
2. First AI Agent

File: src/hello-agent.ts

After learning the basic TypeScript setup, the next step was creating the first working AI agent using Anvia.

It demonstrates:

Creating an Anvia Agent
Connecting Anvia to an AI model
Using an OpenAI-compatible API
Configuring the model
Calling agent.generate()
Handling the agent response

The basic architecture is:

TypeScript
    ↓
Anvia Agent
    ↓
Anvia OpenAI Adapter
    ↓
Devscale AI Gateway
    ↓
DeepSeek V4.1 Flash

Run it with:

pnpm exec tsx src/hello-agent.ts
3. Article Refiner

File: src/article-refiner/index.ts

The Article Refiner is the first agentic workflow in the project.

Instead of asking one agent to perform the entire task, the workflow is divided into two agents.

Original Article
       ↓
Analyzer Agent
       ↓
Improvement Plan
       ↓
Editor Agent
       ↓
Rewritten Article
Analyzer Agent

The Analyzer reviews the article and identifies:

Main weaknesses
Clarity problems
Structural problems
Missing details
Possible improvements

The Analyzer does not rewrite the article.

Editor Agent

The Editor receives:

The original article
The Analyzer's improvement plan

It then produces the rewritten article.

Main Concept

This is a sequential agentic pattern.

The second agent depends on the output of the first agent.

Agent A
   ↓
Output
   ↓
Agent B

This workflow also demonstrates asynchronous programming using await.

Run it with:

pnpm exec tsx src/article-refiner/index.ts
4. Idea Review Board

File: src/idea-review/index.ts

The Idea Review Board demonstrates a parallel multi-agent workflow.

Instead of sending the idea to reviewers one by one, independent reviewers work on the same idea concurrently.

                         Product Idea
                              │
                ┌─────────────┼─────────────┐
                ↓             ↓             ↓
           Product         Growth       Engineering
           Reviewer        Reviewer       Reviewer
                │             │             │
                └─────────────┼─────────────┘
                              ↓
                         Synthesizer
                              ↓
                        Final Review
Product Reviewer

Reviews the idea from a product perspective:

Customer problem
Target users
Product value
Product weaknesses
Growth Reviewer

Reviews the idea from a business and growth perspective:

Target market
Business value
Adoption challenges
Differentiation
Engineering Reviewer

Reviews the idea from a technical perspective:

Technical feasibility
Technical challenges
Infrastructure requirements
Technical risks
Synthesizer

The Synthesizer receives all three reviews and creates a final balanced review.

Main Concept

This is a fan-out → fan-in pattern.

The reviewers are independent, so they can run concurrently.

The implementation uses Promise.all().

                 Input
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
     Agent A    Agent B    Agent C
        │          │          │
        └──────────┼──────────┘
                   ↓
                Agent D

Run it with:

pnpm exec tsx src/idea-review/index.ts
5. Ticket Triage

File: src/ticket-triage/index.ts

The Ticket Triage assignment demonstrates a different AI engineering pattern.

The AI is responsible for understanding the support ticket and extracting structured information.

The final routing decision is handled by deterministic TypeScript logic.

Support Ticket
      ↓
AI Classifier
      ↓
Raw AI Output
      ↓
Normalization
      ↓
Zod Validation
      ↓
Validated Ticket Data
      ↓
TypeScript Router
      ↓
Support Destination
AI Classifier

The classifier extracts:

Category
Priority
Impact
Customer tier

For example:

{
  "category": "account_access",
  "priority": "high",
  "impact": "high",
  "customerTier": "enterprise"
}
Normalization

LLMs can sometimes return unexpected but semantically similar values.

For example:

urgent
critical

instead of:

high

The application normalizes these values before validation.

For example:

urgent → high
critical → high

This makes the AI output compatible with the application's expected structure.

Zod Validation

Zod acts as a schema gate.

The application defines the allowed values.

Category:

account_access
billing
technical_issue
other

Priority:

low
medium
high

Impact:

low
medium
high

Customer tier:

standard
premium
enterprise

If the AI produces a value outside these allowed options, Zod rejects the data.

The flow is:

Raw AI Output
      ↓
Normalization
      ↓
Zod Schema
   ↙       ↘
Valid     Invalid
  ↓          ↓
Continue    Reject
Deterministic Router

After the ticket has been validated, normal TypeScript logic determines where the ticket should go.

For example:

if (
  ticket.priority === "high" &&
  ticket.customerTier === "enterprise"
) {
  return "enterprise-priority-support";
}

The routing decision does not depend on another LLM call.

This makes the business logic predictable and easier to test.

Main Concept

This assignment demonstrates an important AI engineering principle:

Use the LLM for tasks that require interpretation, and use deterministic application code for business rules that need predictable behavior.

The architecture is:

              LLM
               │
               │ Interpretation
               ↓
        Structured Data
               │
               ↓
             Zod
               │
               │ Validation
               ↓
       TypeScript Business Logic
               │
               │ Deterministic Decision
               ↓
             Action

Run it with:

pnpm exec tsx src/ticket-triage/index.ts
Summary

The project currently demonstrates three different agentic patterns.

Sequential

Article Refiner

Agent A
   ↓
Agent B

The second agent depends on the first agent's output.

Parallel

Idea Review Board

       ┌→ Agent A ─┐
Input ─┼→ Agent B ─┼→ Synthesizer
       └→ Agent C ─┘

Multiple independent agents work concurrently before their outputs are combined.

Structured Extraction + Deterministic Logic

Ticket Triage

Ticket
  ↓
LLM
  ↓
Structured Data
  ↓
Zod Validation
  ↓
TypeScript Rules
  ↓
Action

The LLM interprets the unstructured input, while deterministic code handles the business rules.

Technology Stack
TypeScript
Node.js
pnpm
Anvia
@anvia/core
@anvia/openai
Zod
OpenAI-compatible API
Devscale AI Gateway
DeepSeek V4.1 Flash
Project Structure
ai-agentic-assignment/
│
├── src/
│   │
│   ├── hello.ts
│   │
│   ├── hello-agent.ts
│   │
│   ├── article-refiner/
│   │   └── index.ts
│   │
│   ├── idea-review/
│   │   └── index.ts
│   │
│   └── ticket-triage/
│       └── index.ts
│
├── .env
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── tsconfig.json

The .env file contains the API key and should not be committed to GitHub.

Running the Project
TypeScript Basics
pnpm exec tsx src/hello.ts
First AI Agent
pnpm exec tsx src/hello-agent.ts
Article Refiner
pnpm exec tsx src/article-refiner/index.ts
Idea Review Board
pnpm exec tsx src/idea-review/index.ts
Ticket Triage
pnpm exec tsx src/ticket-triage/index.ts
Learning Goal

This repository is intentionally built from the basics rather than starting directly with a complex AI architecture.

The learning progression is:

TypeScript Basics
       ↓
First AI Model Call
       ↓
Anvia Agent
       ↓
Sequential Agent Workflow
       ↓
Parallel Agent Workflow
       ↓
Structured AI Output
       ↓
Zod Validation
       ↓
Deterministic Business Logic

The early files such as hello.ts and hello-agent.ts are intentionally kept in the repository because they represent the starting point of the learning process.

The goal is not only to complete the assignments, but to understand how each component works and how simple AI model calls can gradually become more structured agentic systems.