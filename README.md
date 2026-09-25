# Agentic Web Layer Demo & Evaluation

> Demonstration application and validation test harness for [`@goldlabelapps/agent-layer`](https://www.npmjs.com/package/@goldlabelapps/agent-layer).

`@goldlabelapps/agent-layer` is a JavaScript library for building an **AI-actionable web layer**. It enables websites to expose machine-oriented representations of their domain knowledge and capabilities to autonomous AI agents via structured knowledge graphs, capability registries, OpenAPI/MCP adapters, and discovery endpoints.

---

## 📚 Documentation Table of Contents

The complete documentation and architectural paper have been refactored into modular documents in the [`docs/`](./docs) directory:

1. [**Introduction & Theoretical Foundation**](./docs/01-introduction.md)
   - Background on search evolution: from human browsing (`search → visit → read`) to agentic tasks (`query → research → decide → act`).
   - Difference between *AI-readable* and *AI-actionable* content.

2. [**Architecture & The 3-Layer Web Model**](./docs/02-architecture-and-layers.md)
   - Detailed specification of the 3-Layer Web Model: Layer 1 (Human UI), Layer 2 (Machine Knowledge), and Layer 3 (Agent Capabilities).
   - Intent, action discovery, and capability registration.

3. [**Case Study & Consumability Metrics**](./docs/03-case-study-and-metrics.md)
   - Dog Abroad international pet relocation case study.
   - Measuring consumability: accuracy, entity resolution, interaction overhead, and payload reduction metrics.

4. [**SEO Evolution & Future Outlook**](./docs/04-seo-and-future-outlook.md)
   - Shift from traditional SEO (page visibility) to Agentic SEO (knowledge accessibility).
   - Conversion funnel evolution and open industry questions (security, trust, freshness, liability).

5. [**Developer Guide & Code Examples**](./docs/05-developer-guide.md)
   - Quickstart code example.
   - HTTP endpoint demonstration (`/.well-known/agent-layer.json`, `/api/agent/knowledge`, `/api/agent/execute`, `/llms.txt`).
   - LLM schema exports (OpenAI Function Calling & Anthropic MCP adapters).

6. [**Agent Execution & Orchestration Insights**](./docs/06-agent-orchestration-insights.md)
   - Execution modes (Fast vs. Planning).
   - Comparative feature analysis (Antigravity vs. GitHub Copilot).
   - Core design patterns for agentic software systems.

---

## ⚡ Quickstart: Running the Demo & Test Harness

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Automated Validation Test Harness

The project includes an automated test harness validating discovery manifests, knowledge graph queries, parameter validation, action execution, LLM schema adapters, and efficiency benchmarks:

```bash
npm test
```

### 3. Build Project

```bash
npm run build
```

---

## 🛠️ Repository Structure

```
.
├── docs/                                  # Refactored modular documentation
│   ├── 01-introduction.md                 # Theoretical foundation & background
│   ├── 02-architecture-and-layers.md      # 3-Layer Web Model & capability design
│   ├── 03-case-study-and-metrics.md       # Dog Abroad case study & metrics
│   ├── 04-seo-and-future-outlook.md       # Agentic SEO & conversion funnels
│   ├── 05-developer-guide.md              # Quickstart, cURL samples & adapters
│   └── 06-agent-orchestration-insights.md # Fast vs Planning modes & Copilot comparison
├── src/                                   # TypeScript source code
│   ├── agent-setup.ts                     # KnowledgeGraph, Capabilities & HTTP Router setup
│   ├── server.ts                          # Node.js HTTP server hosting Agent Layer endpoints
│   └── test-harness.ts                    # Automated 21-assertion validation test suite
├── package.json
├── tsconfig.json
└── README.md                              # Main Table of Contents & Quickstart
```
