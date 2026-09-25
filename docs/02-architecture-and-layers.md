# Architecture & The 3-Layer Web Model

## 4. An AI-Helpful Layer

One possible architecture is to retain the existing human-facing website while introducing a second representation specifically designed for machine consumption.

The human interface might remain:
```
HTML → browser → human
```

While an agent could interact with:
```
structured knowledge → query → reasoning → action
```

The additional layer exposes:
- Structured entities
- Relationships between entities
- Explicit attributes
- Constraints and requirements
- Pricing information
- Availability
- Provider information
- Provenance
- Confidence or uncertainty
- Machine-readable actions

This does not necessarily require a completely separate application. It can be implemented through existing standards:
- Schema.org / JSON-LD
- Structured HTML & Open APIs
- Machine-readable endpoints (`/.well-known/agent-layer.json`)
- OpenAPI specifications
- Action-oriented API registries

---

## 8. The Missing Layer: Intent and Action

Structured information alone may not be sufficient. An agent does not merely need to know that a company provides dog transportation. It needs to know what it can do.

For example:

```yaml
Provider: PetAir

Capabilities:
  - international_pet_transport
  - quote_request

Required inputs:
  - origin
  - destination
  - species
  - breed
  - weight
  - travel_date

Available actions:
  - calculate_quote
  - check_requirements
  - request_quote
```

This resembles an interface definition rather than a webpage. The critical concept is **capability discovery**. An agent should be able to determine not only *"What does this website know?"* but also *"What can I do through this website?"*

---

## 9. A 3-Layer Web Architecture

A future-oriented website exposes three related layers:

### Layer 1 — Human interface
Designed for people (HTML, CSS, JS, UI, natural language content).

### Layer 2 — Machine knowledge
Designed to expose meaning (Entities, attributes, relations, constraints).

### Layer 3 — Agent capabilities
Designed to expose actions (Queries, APIs, functions, transactions, quotes, bookings).

```
                ┌─────────────────┐
                │      HUMAN      │
                └────────┬────────┘
                         │
                      Website
                         │
            ┌────────────┴────────────┐
            │                         │
         HTML/UI            AI-helpful layer
                                      │
                          ┌───────────┴───────────┐
                          │                       │
                     Knowledge               Capabilities
                          │                       │
                     Structured             Actions/API
                          │                       │
                          └───────────┬───────────┘
                                      │
                                  AI AGENT
                                      │
                                User's intent
```

The human website and agent interface become **two representations of the same underlying business capability**.
