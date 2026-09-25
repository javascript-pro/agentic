# Introduction & Theoretical Foundation

> SEO was built for a web where humans searched, clicked, read and decided. AI search is rapidly changing that. The question has gone beyond just whether AI can read your site, it’s whether an agent can understand what your business knows, work out what is relevant to a user, discover what it can do, and actually take action.

AI readable is good. AI actionable is better.

The `@goldlabelapps/agent-layer` package explores what that could mean for the web: structured knowledge, relationships, capabilities, machine-readable actions, APIs, `llms.txt`, and a new potential optimisation target beyond traditional SEO. The key idea is: **Don't just make your website understandable by AI. Make it usable by AI.**

---

## 1. Introduction

The traditional web assumes a human at the other end of the connection. A website presents information. A human reads it, interprets it and decides what to do next.

This model has remained remarkably effective. Search engines improved the process by indexing and ranking pages, but the fundamental interaction remained unchanged:

```
search → visit → read → understand → decide → act
```

Large language models have changed the first part of this process. Users can increasingly ask an AI system to perform research on their behalf rather than searching for and visiting individual websites themselves.

The next logical development is more significant. Instead of merely asking an AI system to summarise information from websites, users may ask it to:

- Research options
- Compare products or services
- Determine which option is appropriate
- Obtain prices
- Check eligibility or requirements
- Make recommendations
- Initiate bookings or purchases

The interaction therefore becomes:

```
query → research → compare → decide → act
```

This raises a question for website owners:

> **If an AI agent encounters your website while performing this task, can it actually use the information and capabilities that the website provides?**

---

## 2. The Human-Oriented Web

Most websites contain considerably more information than is explicitly represented as data. Consider a page describing the transportation of a dog from the UK to another country.

A human might read several paragraphs and infer:

- The animal's size
- Its likely transport requirements
- The relevant destination
- Applicable restrictions
- Which transport provider may be appropriate
- Approximate costs
- What information the customer needs to provide next

Much of this knowledge may never exist as explicit fields. Instead it exists as natural language. For a human, this is often desirable—humans are extremely good at extracting meaning from prose and context.

For an AI agent, the same information introduces an additional reasoning step:

```
retrieve → parse → extract → interpret → resolve ambiguity → reason
```

This is possible with modern language models, but it is inherently less deterministic than querying explicitly structured information.

---

## 3. From AI-Readable to AI-Actionable

There is an important distinction between two concepts:

### AI-readable
The information can be understood by an AI model. Modern language models are increasingly good at this—in principle, almost any reasonably written webpage can be interpreted.

### AI-actionable
The information is exposed in a form that allows an agent to reliably determine:
1. What the information means
2. How different pieces of information relate to one another
3. What operations can be performed
4. What inputs those operations require
5. What the resulting outputs mean

The goal is therefore not simply to make websites "AI-readable". It is to make them **agent-consumable**.
