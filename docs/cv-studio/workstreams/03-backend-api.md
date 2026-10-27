# WS03 - Backend API

## Objective

Provide a versioned FastAPI interface for content, recipes, builds, quality, and
assistant proposals while depending only on abstract service ports.

## Ownership

```text
app/backend/api/**
app/backend/main.py
app/backend/ports/**
tests/api/**
```

Do not implement repository, rendering, AI, or quality logic and do not edit the
frontend.

## Deliverables

- `/api/v1` routes described in `contracts.md`.
- Request/response validation and stable error mapping.
- Dependency-injection ports for repository, compiler, renderer, quality, and AI
  services.
- Fake implementations used by API tests.
- Generated OpenAPI document for frontend mock generation.
- Health endpoint reporting configured adapters and pinned renderer version.

## Independent-development method

Every external service is a fake that implements a frozen port. API tests use
contract fixtures and require no real YAML files, RenderCV process, PDF, or LLM.

## Acceptance criteria

- CRUD, archive, recipe, build, quality, and assistant endpoints match the
  documented status codes and payloads.
- Validation errors identify the exact field and stable error code.
- AI apply accepts explicit proposal IDs and returns a patch preview; it does not
  persist the patch.
- OpenAPI generation is deterministic and suitable for typed client generation.
- No endpoint exposes filesystem paths outside configured artifact metadata.

