import {
  KnowledgeGraph,
  CapabilityRegistry,
  createAgentManifest,
  AgentExecutor,
  AgentHttpRouter,
  toOpenAITools,
  toMcpTools,
  generateLlmsTxt,
  AgentManifest,
  ActionResult,
} from '@goldlabelapps/agent-layer';

export function setupAgentLayer() {
  // 1. Knowledge Graph Setup
  const knowledgeGraph = new KnowledgeGraph('Pet Relocation & Travel Services');

  knowledgeGraph.addEntity({
    id: 'route-uk-pt',
    type: 'JourneyRoute',
    name: 'UK to Portugal Pet Transport',
    attributes: {
      origin: 'UK',
      destination: 'Portugal',
      allowedSpecies: ['Dog', 'Cat'],
      approvedTransport: ['Air Cargo', 'Road Express'],
    },
    provenance: {
      sourceUrl: 'https://dogabroad.demo/routes/uk-portugal',
      confidence: 0.99,
    },
  });

  knowledgeGraph.addEntity({
    id: 'provider-petair',
    type: 'TransportProvider',
    name: 'PetAir Global',
    attributes: {
      rating: 4.9,
      baseRatePerKgGBP: 12.5,
      handlingFeeGBP: 150,
      iataCertified: true,
    },
  });

  knowledgeGraph.addRelation({
    subjectId: 'provider-petair',
    predicate: 'operates_route',
    objectId: 'route-uk-pt',
  });

  knowledgeGraph.addConstraint({
    id: 'c-max-weight-air',
    targetType: 'JourneyRoute',
    field: 'weightKg',
    operator: 'lte',
    value: 50,
    description: 'Pets exceeding 50kg require custom road transport approval.',
  });

  // 2. Capability Registry Setup
  const registry = new CapabilityRegistry();

  registry.registerAction({
    name: 'calculate_quote',
    description: 'Calculates pet relocation quote based on weight, origin, and destination.',
    method: 'POST',
    endpoint: '/api/agent/execute',
    tags: ['pricing', 'quote'],
    parameters: [
      { name: 'origin', type: 'string', description: 'Origin country code/name', required: true },
      { name: 'destination', type: 'string', description: 'Destination country code/name', required: true },
      { name: 'species', type: 'string', description: 'Species of pet (e.g. Dog, Cat)', required: true },
      { name: 'weightKg', type: 'number', description: 'Pet weight in kilograms', required: true },
    ],
    handler: async (input: Record<string, unknown>): Promise<ActionResult<{ quoteAmountGBP: number; breakdown: Record<string, number> }>> => {
      const weight = (input.weightKg as number) || 10;
      const baseFee = 150;
      const ratePerKg = 12.5;
      const total = baseFee + weight * ratePerKg;

      return {
        success: true,
        data: {
          quoteAmountGBP: total,
          breakdown: {
            handlingFee: baseFee,
            freightCost: weight * ratePerKg,
          },
        },
        metadata: { timestamp: new Date().toISOString() },
      };
    },
  });

  registry.registerAction({
    name: 'check_requirements',
    description: 'Retrieves mandatory health, microchip, and passport requirements for travel.',
    method: 'POST',
    endpoint: '/api/agent/execute',
    tags: ['compliance', 'health'],
    parameters: [
      { name: 'origin', type: 'string', description: 'Origin country', required: true },
      { name: 'destination', type: 'string', description: 'Destination country', required: true },
      { name: 'species', type: 'string', description: 'Pet species', required: true },
    ],
    handler: async (input: Record<string, unknown>): Promise<ActionResult<{ requirements: string[]; validForDays: number }>> => {
      return {
        success: true,
        data: {
          requirements: [
            'ISO 11784/11785 compliant Microchip before rabies vaccination',
            'Valid Rabies Vaccination (>21 days prior to travel)',
            'EU Animal Health Certificate (AHC) issued within 10 days of travel',
            'Tapeworm treatment (Echinococcus multilocularis) 24-120h prior to entry',
          ],
          validForDays: 10,
        },
      };
    },
  });

  // 3. Manifest & Executor Creation
  const manifest: AgentManifest = createAgentManifest({
    name: 'DogAbroad AI-Helpful Agent Layer',
    description: 'Machine-actionable knowledge and capability layer for international pet relocation.',
    baseUrl: 'http://localhost:3000',
    provider: { name: 'DogAbroad Services', url: 'https://dogabroad.demo' },
    registry,
    knowledgeGraph,
  });

  const executor = new AgentExecutor(registry);

  // 4. LLM txt format options
  const llmsTxtOptions = {
    site: {
      name: 'DogAbroad Pet Relocation',
      description: 'International Pet Relocation & Machine Actionable Portal',
      url: 'http://localhost:3000',
    },
    sections: [
      {
        title: 'Core Capabilities',
        resources: [
          { title: 'Quote Calculator', url: '/api/agent/execute', description: 'Machine actionable pet travel quote generation' },
          { title: 'Compliance Check', url: '/api/agent/execute', description: 'Retrieve destination animal health requirements' },
        ],
      },
    ],
  };

  // 5. Router Instance
  const router = new AgentHttpRouter({
    manifest,
    executor,
    knowledgeGraph,
    llmsTxt: llmsTxtOptions,
  });

  return {
    knowledgeGraph,
    registry,
    manifest,
    executor,
    router,
    llmsTxtOptions,
    openAiTools: toOpenAITools(registry),
    mcpTools: toMcpTools(registry),
  };
}
