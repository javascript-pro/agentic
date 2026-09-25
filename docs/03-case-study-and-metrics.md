# Case Study & Consumability Metrics

## 5. The Difference in Interaction

Consider an agent asked:

> *"I need to move my 22kg English Springer Spaniel from the UK to Portugal. What are my options?"*

Using a conventional website, the agent may need to discover the page, parse prose, extract species rules, determine weight eligibility, find transport methods, and calculate costs via unstructured text.

A structured representation exposes underlying concepts directly:

```json
{
  "animal": {
    "breed": "English Springer Spaniel",
    "weight": "22kg"
  },
  "journey": {
    "origin": "UK",
    "destination": "Portugal"
  },
  "transport": {
    "methods": ["air", "road"]
  },
  "provider": {
    "name": "PetAir",
    "service": "Air Cargo",
    "eligibility": "valid_microchip_and_rabies"
  },
  "actions": [
    "calculate_quote",
    "check_requirements",
    "request_booking"
  ]
}
```

The agent's task becomes: `query → filter → reason → act`.

---

## 10. Dog Abroad as a Case Study

International pet transportation is unusually information-dense:
- Animal breed, size, weight
- Origin & destination rules
- Airline & country requirements
- Documentation & timing constraints
- Provider quotes & availability

This domain is ideal for comparing control (conventional HTML website) vs. test condition (agent-oriented information and capability layer).

---

## 11. Measuring Agent Consumability

Metrics for evaluating agent-layer performance:

- **Information Retrieval Accuracy**: Can the agent correctly identify relevant facts?
- **Entity Resolution**: Can it determine which information applies to specific user constraints?
- **Task Completion Rate**: Can it complete the requested task without error?
- **Interaction Overhead**: Number of page visits, requests, or round-trips required.
- **Payload Efficiency**: Byte size reduction of structured endpoints vs full HTML pages.
- **Determinism**: Elimination of speculative LLM parsing in favor of JSON schema execution.
