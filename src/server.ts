import http from 'node:http';
import { handleNodeAgentRequest } from '@goldlabelapps/agent-layer';
import { setupAgentLayer } from './agent-setup.js';

const { manifest, executor, knowledgeGraph, llmsTxtOptions } = setupAgentLayer();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export function startServer(port: number = PORT) {
  const server = http.createServer(async (req, res) => {
    const options = {
      manifest,
      executor,
      knowledgeGraph,
      llmsTxt: llmsTxtOptions,
    };

    const handled = await handleNodeAgentRequest(options, req, res);

    if (!handled) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found', message: 'Requested path is not an Agent Layer endpoint.' }));
    }
  });

  return new Promise<http.Server>((resolve) => {
    server.listen(port, () => {
      console.log(`[Agent Layer Server] Running on http://localhost:${port}`);
      resolve(server);
    });
  });
}

// Run server directly if invoked as main script
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
