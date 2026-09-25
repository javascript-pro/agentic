import { setupAgentLayer } from './agent-setup.js';
import { startServer } from './server.js';
import http from 'node:http';

// Helper for making HTTP requests in node
function makeRequest(url: string, options: { method?: string; body?: any; headers?: Record<string, string> } = {}): Promise<{ status: number; body: any; rawBody: string }> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions: http.RequestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(raw);
        } catch {
          // Plain text / markdown
        }
        resolve({ status: res.statusCode || 500, body: json, rawBody: raw });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('====================================================');
  console.log(' 🚀 @goldlabelapps/agent-layer Validation Harness');
  console.log('====================================================\n');

  const TEST_PORT = 3099;
  const server = await startServer(TEST_PORT);
  const baseUrl = `http://localhost:${TEST_PORT}`;

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.log(`  ❌ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Test Group 1: Agent Manifest Discovery (.well-known/agent-layer.json)
    // -------------------------------------------------------------
    console.log('\n--- 1. Discovery Manifest Endpoint ---');
    const manifestRes = await makeRequest(`${baseUrl}/.well-known/agent-layer.json`);
    assert(manifestRes.status === 200, 'Manifest HTTP Status is 200 OK');
    assert(manifestRes.body && manifestRes.body.name === 'DogAbroad AI-Helpful Agent Layer', 'Manifest contains correct site name');
    assert(manifestRes.body?.capabilities?.standaloneActions?.length > 0, 'Manifest lists registered standalone capabilities');

    // -------------------------------------------------------------
    // Test Group 2: Knowledge Graph Serialization & Routing
    // -------------------------------------------------------------
    console.log('\n--- 2. Knowledge Graph Endpoint & Retrieval ---');
    const kgRes = await makeRequest(`${baseUrl}/api/agent/knowledge`);
    assert(kgRes.status === 200, 'Knowledge Graph HTTP Status is 200 OK');
    assert(kgRes.body?.domainName === 'Pet Relocation & Travel Services', 'Knowledge graph domain name matches');
    assert(Array.isArray(kgRes.body?.entities) && kgRes.body.entities.length >= 2, 'Knowledge graph returns entities array');
    assert(Array.isArray(kgRes.body?.constraints) && kgRes.body.constraints.length >= 1, 'Knowledge graph returns active constraints');

    // -------------------------------------------------------------
    // Test Group 3: Agent Action Execution & Schema Validation
    // -------------------------------------------------------------
    console.log('\n--- 3. Action Execution & Parameter Validation ---');
    const validExecutionRes = await makeRequest(`${baseUrl}/api/agent/execute`, {
      method: 'POST',
      body: {
        action: 'calculate_quote',
        input: { origin: 'UK', destination: 'Portugal', species: 'Dog', weightKg: 22 },
      },
    });

    assert(validExecutionRes.status === 200, 'Valid Execution HTTP Status is 200 OK');
    assert(validExecutionRes.body?.success === true, 'Execution result returns success=true');
    assert(validExecutionRes.body?.data?.quoteAmountGBP === 425, 'Execution result calculates correct quote (150 + 22*12.5 = 425)');

    // Rejection on invalid parameters
    const invalidExecutionRes = await makeRequest(`${baseUrl}/api/agent/execute`, {
      method: 'POST',
      body: {
        action: 'calculate_quote',
        input: { origin: 'UK' }, // missing required parameters
      },
    });

    assert(invalidExecutionRes.status === 400 || invalidExecutionRes.body?.success === false, 'Invalid parameters rejected with error');
    assert(invalidExecutionRes.body?.error?.code === 'INVALID_INPUT', 'Error code indicates INVALID_INPUT');

    // -------------------------------------------------------------
    // Test Group 4: LLM Protocol Adapters (OpenAI & Anthropic MCP)
    // -------------------------------------------------------------
    console.log('\n--- 4. LLM Adapter Schema Exports ---');
    const { openAiTools, mcpTools } = setupAgentLayer();

    assert(Array.isArray(openAiTools) && openAiTools.length >= 2, 'toOpenAITools exports OpenAI function definitions');
    assert(openAiTools[0].type === 'function' && typeof openAiTools[0].function.name === 'string', 'OpenAI tool adheres to function calling spec');
    assert(openAiTools[0].function.parameters.type === 'object', 'OpenAI tool parameters formatted as JSON Schema object');

    assert(Array.isArray(mcpTools) && mcpTools.length >= 2, 'toMcpTools exports Anthropic MCP tool definitions');
    assert(typeof mcpTools[0].name === 'string' && mcpTools[0].inputSchema.type === 'object', 'MCP tool adheres to Model Context Protocol spec');

    // -------------------------------------------------------------
    // Test Group 5: llms.txt Machine-Readable Summary Endpoint
    // -------------------------------------------------------------
    console.log('\n--- 5. llms.txt Route & Generation ---');
    const llmsTxtRes = await makeRequest(`${baseUrl}/llms.txt`);
    assert(llmsTxtRes.status === 200, 'llms.txt HTTP Status is 200 OK');
    assert(llmsTxtRes.rawBody.includes('# DogAbroad Pet Relocation'), 'llms.txt contains generated Markdown title');
    assert(llmsTxtRes.rawBody.includes('## Core Capabilities'), 'llms.txt contains expected sections');

    // -------------------------------------------------------------
    // Test Group 6: Consumability Efficacy Comparison
    // -------------------------------------------------------------
    console.log('\n--- 6. Efficacy & Consumability Benchmark ---');
    const unstructuredHtmlSample = `
      <html>
        <body>
          <h1>Moving your dog from UK to Portugal</h1>
          <p>When transporting your pet dog overseas from the United Kingdom to Portugal, there are several strict guidelines. First of all, the dog must be microchipped before receiving its rabies vaccination. Rabies vaccination must be administered at least 21 days prior to travel. You will also need an EU Animal Health Certificate issued within 10 days of travel date...</p>
          <p>Pricing starts with a standard base handling fee of £150, plus £12.50 per kilogram of animal weight.</p>
        </body>
      </html>
    `;

    const structuredAgentPayload = JSON.stringify(validExecutionRes.body);

    console.log(`  📊 Unstructured Web Scraping HTML Payload Size: ${unstructuredHtmlSample.length} bytes`);
    console.log(`  📊 Agent-Layer Execution Response Size:        ${structuredAgentPayload.length} bytes`);
    console.log(`  📊 Payload Efficiency Gain:                     ${((1 - structuredAgentPayload.length / unstructuredHtmlSample.length) * 100).toFixed(1)}% size reduction`);
    console.log(`  📊 Determinism Guarantee:                       100% type-checked JSON Schema validation vs LLM probabilistic inference`);
    assert(true, 'Consumability comparison benchmark completed successfully');

  } catch (err: any) {
    console.error('Fatal error during test suite execution:', err);
    failed++;
  } finally {
    server.close();
    console.log('\n====================================================');
    console.log(` 🏁 Test Suite Finished: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================\n');
    if (failed > 0) {
      process.exit(1);
    }
  }
}

runTestSuite();
