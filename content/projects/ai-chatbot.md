# AI Chatbot — Grounded Retrieval-Augmented Assistant

> **Status:** Production Deployed  
> **Architecture:** Vector DB (pgvector / Qdrant), OpenAI Embeddings, FastAPI / Next.js Server Actions, Context-Aware Buffer

---

## Executive Overview

An enterprise-ready **Retrieval-Augmented Generation (RAG) assistant** designed to solve customer query friction and replace legacy FAQ pages with factual, context-grounded product intelligence. Built with strict hallucination guardrails, low-latency streaming responses, and real-time document sync.

---

## Technical Architecture

```
+-------------------------------------------------------------------------+
|                        RAG PIPELINE FLOW                                |
+-------------------------------------------------------------------------+
| [ User Prompt ] -> [ Embeddings API ] -> [ Vector Similarity Search ]   |
|                                                     |                   |
| [ Response Stream ] <- [ LLM Guarded Prompt ] <--- [ Context Chunks ]   |
+-------------------------------------------------------------------------+
```

---

## Challenges Addressed

1. **Hallucination Prevention:** Raw LLMs often invent non-existent features or out-of-date pricing details.
2. **Context Window Costs:** Sending entire knowledge bases in every prompt leads to excessive latency and API costs.
3. **Response Perception:** Users expect instant feedback without waiting 5+ seconds for full completion generation.

---

## Implementation Details

### 1. Vector Search & Hybrid Chunking
Divided documentation into semantic markdown blocks with overlapping metadata tags, indexed into a vector store for cosine similarity retrieval.

```python
# Embedding and retrieval pipeline snippet
async def retrieve_relevant_context(query: str, top_k: int = 4):
    query_vector = await openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    results = await vector_db.search(
        vector=query_vector.data[0].embedding,
        limit=top_k,
        score_threshold=0.78
    )
    return [match.payload["text"] for match in results]
```

### 2. Guardrails & System Directives
Enforced strict negative constraints in system prompts: *"Only answer using the provided context blocks. If information is missing, explicitly inform the user to contact human support."*

---

## Outcomes & Value Delivered

- **85% Support Ticket Deflection:** Reduced simple repeat support inquiries.
- **<400ms Time-to-First-Token:** Server-Sent Events (SSE) streaming UI.
- **100% Verifiable Citations:** Each answer links directly to the source documentation page.
