# Developer Guide & Code Examples

## 16. Developer Guide: Implementation & Testing

This section outlines how to implement, test, and demonstrate `@goldlabelapps/agent-layer` in Node.js, Web/Edge environments, and LLM frameworks.

### 16.1 Quickstart Code Example

```typescript
import {
  KnowledgeGraph,
  CapabilityRegistry,
  createAgentManifest,
  AgentExecutor,
  toOpenAITools,
  toMcpTools,
  createAgentFetchHandler,
} from '@goldlabelapps/agent-layer';

// 1. Build Knowledge Graph
const kg = new KnowledgeGraph('Pet Relocation');
kg.addEntity({
  id: 'pet-1',
  type: 'Animal',
  name: 'Buddy',
  attributes: { breed: 'Springer Spaniel', weightKg: 22 },
});

// 2. Register Capabilities & Action Handlers
const registry = new CapabilityRegistry();
registry.registerAction({
  name: 'calculate_quote',
  description: 'Calculates pet transport quote based on parameters',
  parameters: [
    { name: 'origin', type: 'string', description: 'Origin country', required: true },
    { name: 'destination', type: 'string', description: 'Destination country', required: true },
    { name: 'weightKg', type: 'number', description: 'Weight in kg', required: true },
  ],
  handler: async (input: Record<string, unknown>) => {
    const cost = (input.weightKg as number) * 12.5 + 150;
    return { success: true, data: { quoteAmount: cost, currency: 'GBP' } };
  },
});

// 3. Generate Agent Manifest & Executor
const manifest = createAgentManifest({
  name: 'Dog Abroad API',
  description: 'AI-Helpful Layer for International Pet Relocation',
  registry,
  knowledgeGraph: kg,
});

const executor = new AgentExecutor(registry);

// 4. Create Web Fetch Request Handler (Next.js / Cloudflare / Node http)
export const fetchHandler = await createAgentFetchHandler({ manifest, knowledgeGraph: kg, executor });
```

---

### 16.2 Running Automated Tests

Execute the validation suite:

```bash
npm test
```

This verifies:
- Entity, relationship, and constraint management in `KnowledgeGraph`
- Capability registration, action retrieval, and filtering in `CapabilityRegistry`
- Input schema validation and action handler dispatch in `AgentExecutor`
- Protocol adapter schema translations (`toOpenAITools` and `toMcpTools`)
- HTTP routing for `.well-known/agent-layer.json`, `/api/agent/knowledge`, `/api/agent/execute`, and `/llms.txt`

---

### 16.3 Demonstrating Endpoints via cURL

#### A. Discover Agent Capabilities
```bash
curl http://localhost:3000/.well-known/agent-layer.json
```

#### B. Fetch Knowledge Graph
```bash
curl http://localhost:3000/api/agent/knowledge
```

#### C. Execute Machine Action
```bash
curl -X POST http://localhost:3000/api/agent/execute \
  -H "Content-Type: application/json" \
  -d '{
    "action": "calculate_quote",
    "input": {
      "origin": "UK",
      "destination": "Portugal",
      "weightKg": 22
    }
  }'
```

---

### 16.4 LLM Schema Adapters (OpenAI & Anthropic MCP)

Export registry schemas directly to LLM tool formats:

```typescript
import { toOpenAITools, toMcpTools } from '@goldlabelapps/agent-layer';

// Export to OpenAI Function Calling Schema format
const openAiTools = toOpenAITools(registry);

// Export to Model Context Protocol (MCP) Tool format
const mcpTools = toMcpTools(registry);
```

---

### 16.5 Generating `llms.txt`

Pass `llmsTxt` directly into `createAgentFetchHandler` or use `generateLlmsTxt`:

```typescript
import { generateLlmsTxt } from '@goldlabelapps/agent-layer';

const llmsTxtContent = generateLlmsTxt({
  site: {
    name: 'Goldlabel',
    description: 'Software development and AI consultancy',
    url: 'https://goldlabel.pro',
  },
  sections: [
    {
      title: 'Services',
      resources: [
        { title: 'Web Development', url: '/services/web-development', description: 'Full-stack web apps' },
      ],
    },
  ],
});
```
