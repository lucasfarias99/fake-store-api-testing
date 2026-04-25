# Fake Store API — Integration & Performance Tests

A QA automation project that exercises the [Fake Store API](https://fakestoreapi.com) end-to-end using Cypress for integration testing and (soon) k6 for performance testing. The goal is not only to verify that the API behaves as advertised, but to demonstrate a maintainable, readable test suite that a professional QA engineer would be comfortable handing off.

---

## Introduction

The Fake Store API is a public REST service that exposes four resources — products, carts, users and auth — with full CRUD coverage. Because the hosted version returns **faked** write responses (it never actually mutates a database), the project runs the API locally against a real MongoDB, which makes the complete lifecycle (POST → GET → PUT → DELETE) observable and therefore testable.

The deliverable is organized around three axes:

1. **Integration tests** against every endpoint (this repository — `cypress/e2e/integration/`).
2. **Performance tests** (load and stress) using k6 — `k6/load-test.js` and `k6/stress-test.js`.
3. **Written documentation**: test case specs in `docs/test-cases.md` and this README explaining decisions, trade-offs and lessons learned.

The learning path behind the suite was anchored in a small set of references that shaped the vocabulary and approach:

- GeeksforGeeks — *[API Testing — Software Testing](https://www.geeksforgeeks.org/software-engineering/api-testing-software-testing/)*, for the overall taxonomy of API testing (contract, functional, integration, performance, security).
- GeeksforGeeks — *[Software Engineering — Integration Testing](https://www.geeksforgeeks.org/software-testing/software-engineering-integration-testing/)*, for the specific definition of integration testing and its variants.
- Rodrigo Pacheco — *[Teoria de testes de integração em APIs (uma abordagem)](https://www.youtube.com/watch?v=mHMAneHNFhM)*, which framed integration testing as validating contracts between services rather than units.
- Nick Chapsas — *[How to write integration tests over your API](https://www.youtube.com/watch?v=rBx3ur9ntRA)* and *[How to write more maintainable integration tests](https://www.youtube.com/watch?v=dj9urZ2KQgs)*, which directly inspired the refactoring moves described in *How the tests were implemented*.

---

## What are integration tests?

An **integration test** verifies that two or more components work correctly together. Unlike unit tests, which isolate a single function or class behind mocks, integration tests deliberately exercise real boundaries — typically the ones most likely to break in production: HTTP, database, file system, third-party APIs.

For an HTTP API specifically, integration testing means issuing real requests against a running instance of the service and asserting against the real responses and the real resulting state. This catches a different class of bug than unit tests do: wrong status codes, serialization quirks, middleware ordering, database schema drifts, authentication misconfigurations. In other words, the mistakes that only surface when the pieces are wired together.

In this project, every test in `cypress/e2e/integration/` follows that shape: it sends one or more real `cy.request` calls to `http://localhost:8765` (the locally-hosted Fake Store API), and asserts on the real response body and status. No network mocking, no API stubbing, no fake databases. The only scaffolding is test-data seeding and cleanup, both done through the same HTTP surface the production client would use.

---

## How the tests were implemented

### Stack

- **Cypress 13** running in headless mode, using only `cy.request` (no browser UI — this is a pure HTTP suite).
- A **local fork** of the Fake Store API running on `http://localhost:8765`, backed by MongoDB in Docker. Seed data is loaded via `npm run db:seed` before every Cypress run.
- Fixtures (JSON test data) live under `cypress/fixtures/`. Custom Cypress commands and pure utility helpers live under `cypress/support/`.

### Guiding principles

The design of the suite converged over several iterations and a few deliberate trade-off decisions. The most consequential ones are worth documenting here.

**Every test must be independent from the database's prior state.** An early version of the suite relied on hard-coded counts and shared fixture identities (e.g. `expect(response.body).to.have.length(3)` after seeding 3 items). That only works if the database is reset to a known baseline before every test, and it couples tests to each other through global state. The fix was two-fold:

1. Every test derives a `runId = Date.now()` and suffixes its fixture data (`title`, `category`, `username`, `email`) with that id. Two runs of the same test — or a run against a dirty database — never collide because the identifying fields are unique.
2. Assertions on list endpoints use `find(...)` followed by a partial match on the created record, rather than asserting the exact length of the array. Seed data and parallel test activity become invisible to the assertion.

**Partial matching is the default assertion style.** `expect(body).to.include(fixture)` for flat objects, `expect(body).to.deep.include(fixture)` when there are nested objects (users have `name` and `address` sub-objects). This choice is deliberate: many Fake Store endpoints return Mongoose metadata (`__v` on every GET/PUT/DELETE; `_id` leaking through POST /carts' product subdocuments) that the client never asked for and shouldn't care about. Strict equality would couple the tests to implementation details of the persistence layer; partial matching asserts exactly what the contract promises and no more.

**Setup is shared; the request under test is inline.** After re-watching Nick Chapsas' [second video on maintainable integration tests](https://www.youtube.com/watch?v=dj9urZ2KQgs), the suite was refactored to extract three Cypress commands — `cy.createProduct`, `cy.createUser`, `cy.createCart` — and a global cleanup registry that tears down created resources in an `afterEach` hook. Tests no longer declare per-file `createdIds` arrays or cleanup hooks. However, the specific request the test is validating (the GET or PUT or DELETE under test) is always kept **inline** with `cy.request`. The rationale: setup is noise, and hiding it behind a command increases signal-to-noise; but the request under test *is* the test, and wrapping it in a helper would obscure what the TC actually verifies. This split tracks the distinction the video draws between *arrange* (factor out) and *act* (keep visible).

**Fixtures are imported statically.** The original iteration used `cy.fixture('products').then((products) => { ... })` inside every test, which added two levels of indentation and a nested callback with no payoff. Since the fixtures are static JSON, a plain ES module import at the top of the spec (`import products from '../../fixtures/products.json'`) serves the same purpose while flattening the test body considerably. `cy.fixture` is worth it when fixtures change at runtime or need Cypress' aliasing; neither applies here.

**Single-item seeding by default.** Early versions of `TC-P001 — Get all products` seeded three products per run, with the intent of simultaneously testing "the response is a list" and "multiple items come through". In review, that conflated two concerns: a list test doesn't need three items to prove it returns a list, and the additional seeding costs three POSTs and three cleanups. The suite was simplified so every list/get-all test seeds a single item. Dedicated multi-item tests will be added later under their own TC IDs rather than smuggled into the happy-path list tests.

**API quirks are documented, not worked around.** The test case file (`docs/test-cases.md`) includes a `Comments` field for every TC, and it is used liberally to record observed contract gaps — 200 instead of 201 on resource creation, `__v` leakage on reads and writes, `_id` leakage on cart product subdocuments, plain-text (non-JSON) bodies on auth failures. The assertions tolerate these quirks via partial matching, but the quirks themselves are called out as documentation so future maintainers know what is intentional and what would be a regression.

### Repository layout

```
fake-store-tests/
├── cypress/
│   ├── e2e/integration/         ← spec files (one per resource)
│   │   ├── products.cy.js
│   │   ├── carts.cy.js
│   │   ├── users.cy.js
│   │   └── auth.cy.js
│   ├── fixtures/                ← static JSON test data
│   │   ├── products.json
│   │   ├── carts.json
│   │   └── users.json
│   └── support/
│       ├── commands.js          ← cy.createProduct / createUser / createCart + global cleanup
│       └── utils.js             ← uniquify() helper
├── docs/
│   └── test-cases.md            ← written TCs (GeeksforGeeks-style template)
├── k6/
│   ├── load-test.js             ← 100 VUs sustained, http.batch, thresholds
│   └── stress-test.js           ← 200→500→1000 VU ramp
├── fake-store-api/              ← read-only reference: local API fork + MongoDB seed
├── cypress.config.js
└── package.json
```

### Running the suite

```bash
# 1. Start the API + MongoDB
cd fake-store-api
docker compose up -d
npm start           # API at http://localhost:8765

# 2. Run the tests
cd ..
npm run cy:run      # seeds DB, then runs cypress headless
npm run cy:open     # same, but opens the Cypress runner UI
```

`npm run cy:run` chains `npm run db:seed` so every run starts from a clean, known database state. That is a belt-and-braces guarantee on top of the runId-based independence described above.

---

## Test cases (explained)

The authoritative, step-by-step TCs live in [`docs/test-cases.md`](docs/test-cases.md), documented in a GeeksforGeeks-style template (Header + Body, with Preconditions, Postconditions, Steps, Expected, Actual, Status, Comments). This section gives the narrative overview — what each TC actually exercises and why.

TC IDs follow the convention `TC-<R><nnn>` where `R` is the resource (`P` products, `C` carts, `U` users, `A` auth) and `nnn` is a zero-padded counter.

### Products (`TC-P001` → `TC-P007`)

- **TC-P001 — Get all products.** Creates a product, then asserts that `GET /products` is an array that contains the created item.
- **TC-P002 — Add new product.** Sends `POST /products` and asserts the echoed body plus an auto-generated `id`.
- **TC-P003 — Get product by ID.** Creates a product, then reads it back by id.
- **TC-P004 — Update product by ID.** Creates an `original` and replaces it with `updated` via PUT, with assertions on the new values and the preserved id.
- **TC-P005 — Delete product by ID.** Creates a product and verifies that DELETE returns the deleted record.
- **TC-P006 — List product categories includes created category.** Seeds a product under a unique category and asserts that `GET /products/categories` includes it. The Fake Store derives categories dynamically (`distinct('category')` on the products collection), so this test doubles as a check that the derivation actually picks up new entries.
- **TC-P007 — List products in category.** Asserts that a product created with a unique category shows up under `GET /products/category/:category`.

### Carts (`TC-C001` → `TC-C006`)

Carts reference products, so every cart test first creates a product via `cy.createProduct`. The cart itself is created via `cy.createCart({ productId, userId, date, quantity })` — except in `TC-C002`, where `POST /carts` is the subject.

- **TC-C001 — Get all carts.** Create product + cart, assert the cart appears in `GET /carts`.
- **TC-C002 — Add a new cart.** The only cart test that builds the cart body inline.
- **TC-C003 — Get cart by ID.** Round-trip read-back.
- **TC-C004 — Get carts by user ID includes created cart.** Uses a unique `userId` per fixture (104 for this TC) to avoid conflating the created cart with carts seeded for users 1–10.
- **TC-C005 — Update cart.** Creates with `original`, replaces with `updated`. The `userId` stays constant but `date` and `quantity` change — enough to prove the PUT actually rewrote the record.
- **TC-C006 — Delete cart.** Mirrors `TC-P005`.

### Users (`TC-U001` → `TC-U005`)

Same shape as products, but with the added detail that users carry nested objects (`name`, `address`, `address.geolocation`). Assertions use `.to.deep.include` accordingly. Every test suffixes `email` and `username` with `runId` so re-runs never collide.

- **TC-U001 — Get all users.**
- **TC-U002 — Add new user.** Subject is POST, so it's inline.
- **TC-U003 — Get user by ID.**
- **TC-U004 — Update user by ID.**
- **TC-U005 — Delete user by ID.**

### Auth (`TC-A001`)

- **TC-A001 — Login with valid credentials returns JWT.** Creates a user (so the test doesn't depend on any seeded account), then calls `POST /auth/login` with the same credentials. Asserts that the response has a non-empty `token` string with three dot-separated parts (the structural signature of a JWT). The test does not decode or validate the signature — that would be a unit concern for whatever downstream service verifies the token, not for the integration contract.

The auth resource is light today on purpose; negative cases (invalid credentials, missing fields, malformed bodies) will be added as separate TCs rather than bundled into the happy path. For the record, the API returns HTTP 401 with a plain-text body (not JSON) on invalid credentials — documented in the TC comments.

---

## Performance tests

### Theory

Performance testing validates how a system behaves under load — not whether it returns the right data, but whether it returns it fast enough, and for how long. The taxonomy used here follows the Grafana k6 documentation and Samuel Lucas' foundational overview:

| Test type | Goal | VU profile |
|-----------|------|------------|
| **Smoke** | Sanity-check: does it work at all? | 1–2 VUs, brief |
| **Load (average-load)** | Does it hold up under expected normal traffic? | Sustained target VUs, ~5 min |
| **Stress** | Where does it break? | Ramp beyond expected load |
| **Spike** | Can it absorb a sudden surge? | Instant jump to peak VUs |
| **Soak** | Does it degrade over time? | Sustained load for hours |
| **Breakpoint** | What is the maximum throughput ceiling? | Continuous ramp until failure |

This project implements **load** and **stress** — enough to answer the two most operationally relevant questions for a REST API: "does it meet SLO under normal conditions?" and "what happens when it doesn't?".

**Key metrics** tracked in every k6 run:

- `http_req_duration` — end-to-end latency per request (the primary SLO metric)
- `http_req_failed` — percentage of 4xx/5xx responses
- `checks` — percentage of assertions that passed

Thresholds (`options.thresholds`) are the pass/fail gates. Summary stats (`--summary-trend-stats`) are what gets printed — the full distribution is always computed internally by k6.

**Virtual Users (VUs)** are concurrent goroutines, each running the `default` function in a loop. The relationship between VUs, throughput and response time follows Little's Law:

```
VUs = Throughput (RPS) × Average response time (s)
```

A target of 100 VUs with an observed 4ms average response time yields ~250 RPS — which matches the load test output exactly.

### References

- Samuel Lucas — [Primeiros passos com testes de performance e JMeter](https://medium.com/@samuellucas/primeiros-passos-com-testes-de-performance-e-jmeter-a96b4db360ab) — taxonomy and foundational concepts
- iamferraz — [K6: vamos testar sua API](https://www.tabnews.com.br/iamferraz/k6-vamos-testar-sua-api) — k6 structure, `options`, `stages`, `thresholds`, `checks`
- Grafana — [API Load Testing](https://grafana.com/docs/k6/latest/testing-guides/api-load-testing/) — test-type methodology and guidance
- Grafana — [k6-learn](https://github.com/grafana/k6-learn) — practical k6 patterns and `http.batch` usage

---

### Tool: k6

k6 is a JS-based load-testing tool by Grafana. Each test script exports an `options` object (load profile + thresholds) and a `default` function (what every VU does each iteration):

```js
export const options = {
  stages: [
    { duration: "10s", target: 100 },
    { duration: "280s", target: 100 },
    { duration: "10s", target: 0 },
  ],
  thresholds: { http_req_duration: ["p(95)<500"] },
};

export default () => {
  // each VU runs this on every iteration
  http.get("http://localhost:8765/products");
  sleep(1);
};
```

`http.batch` fires multiple requests in parallel within a single iteration — used here so each VU simultaneously probes the most impactful endpoint of each resource group in one round-trip.

---

### Design decisions

**Endpoint selection.** Rather than testing every endpoint individually, the tests target the most impactful representative per resource group:

| Group | Endpoint | Rationale |
|-------|----------|-----------|
| Products | `GET /products` | Largest payload, full collection scan |
| Carts | `GET /carts` | Full collection scan |
| Auth | `POST /auth/login` | Write path + JWT generation |

All three fire in parallel per iteration via `http.batch`.

**VU target.** The initial target of 100 VUs came from Little's Law: 50 req/s × 2s average response = 100 VUs. This was validated empirically with a staircase capacity test (0 → 25 → 50 → 75 → 100 VUs, 1 min each). Result: at 100 VUs the API returned p(95) = 4.9ms with 0% errors — well within threshold. The 100-VU target was confirmed and locked.

**Stress test ceiling.** Since 100 VUs produced trivially low latency, the stress test needed to push well beyond. Stages were set at 200 → 500 → 1000 VUs (each with 30s ramp + 1min sustain) to find the degradation curve. The 5x and 10x multipliers over the baseline VUs are a common convention from the k6-learn material.

---

### Running the tests

```bash
# Start the API
cd fake-store-api
docker compose up -d
npm run seed
npm start          # API at http://localhost:8765

# In a separate terminal
cd ..
~/bin/k6 run --summary-trend-stats="avg,min,med,p(95),p(99),max" k6/load-test.js
~/bin/k6 run --summary-trend-stats="avg,min,med,p(95),p(99),max" k6/stress-test.js
```

---

### Results

#### Load test (`k6/load-test.js`)

100 VUs · ramp 10s → sustain 280s → ramp 10s · threshold `p(95)<500ms`

```
     ✓ status was 200

     checks.........................: 100.00% 86709 out of 86709
     data_received..................: 347 MB  1.1 MB/s
     data_sent......................: 10 MB   32 kB/s
     http_req_blocked...............: avg=7.05µs  min=778ns   med=4.79µs  p(95)=8.42µs   p(99)=37.15µs  max=15.89ms
     http_req_connecting............: avg=904ns   min=0s      med=0s      p(95)=0s       p(99)=0s       max=2.55ms
   ✓ http_req_duration..............: avg=4.25ms  min=1.16ms  med=3.05ms  p(95)=6.07ms   p(99)=16.76ms  max=2.95s
       { expected_response:true }...: avg=4.25ms  min=1.16ms  med=3.05ms  p(95)=6.07ms   p(99)=16.76ms  max=2.95s
   ✓ http_req_failed................: 0.00%   0 out of 86709
     http_reqs......................: 86709   265.041351/s
     iterations.....................: 28903   88.347117/s
     vus............................: 5       min=5   max=100
```

#### Stress test (`k6/stress-test.js`)

Stages: 200 → 500 → 1000 VUs · threshold `p(95)<2000ms`

```
     ✓ status was 200

     checks.........................: 100.00% 256182 out of 256182
     data_received..................: 1.0 GB  3.1 MB/s
     data_sent......................: 31 MB   93 kB/s
   ✗ http_req_duration..............: avg=872.98ms  min=1.09ms  med=454.71ms  p(95)=2.08s  p(99)=4.83s  max=5.13s
   ✓ http_req_failed................: 0.00%   0 out of 256182
     http_reqs......................: 256182  782.928486/s
     iterations.....................: 85394   260.976162/s
     vus............................: 19      min=7   max=1000

time="..." level=error msg="thresholds on metrics 'http_req_duration' have been crossed"
```

---

#### Stress test analysis: 500 → 1000 VU ramp

The aggregate summary hides when degradation occurred. Splitting the test into time windows reveals the structure:

**Per-plateau breakdown**

| Stage | VUs | Requests | avg | p(95) | p(99) | Threshold |
|-------|-----|----------|-----|-------|-------|-----------|
| Plateau 200 | 200 | 32,264 | 3.8ms | 7.0ms | 12.0ms | ✓ pass |
| Plateau 500 | 500 | 57,986 | 427ms | 627ms | 729ms | ✓ pass |
| Ramp 500→1000 | 500→1000 | 28,969 | 561ms | 962ms | 3,295ms | ✓ p95 |
| Plateau 1000 | 1,000 | 56,041 | 1,933ms | 4,736ms | 5,091ms | ✗ fail |

**Granular 5s windows during the 500→1000 ramp (180s–215s)**

| Window | ≈VUs | Requests | p(95) | p(99) | Note |
|--------|------|----------|-------|-------|------|
| 175–180s | 500 | 5,093 | 641ms | 663ms | Last 500-VU slice |
| 180–185s | 500 | 5,409 | 452ms | 464ms | |
| 185–190s | 583 | 4,241 | 526ms | 538ms | |
| **190–195s** | **666** | **3,326** | **3,301ms** | **3,310ms** | ← **transient spike** |
| 195–200s | 750 | 5,431 | 466ms | 474ms | recovers |
| 200–205s | 833 | 5,311 | 687ms | 702ms | |
| 205–210s | 916 | 5,251 | 1,018ms | 1,056ms | |
| 210–215s | 1,000 | 5,216 | 1,258ms | 1,275ms | plateau starts |

**Queue saturation at 1000 VUs (10s windows, 210s–270s)**

| Window | Requests | avg | p(95) | p(99) |
|--------|----------|-----|-------|-------|
| 210–220s | 10,513 | 1,195ms | 1,394ms | 1,410ms |
| 220–230s | 7,040 | 2,481ms | 4,808ms | 4,852ms |
| 230–240s | 9,930 | 1,992ms | 2,244ms | 2,283ms |
| 240–250s | 10,534 | 1,873ms | 2,088ms | 2,175ms |
| 250–260s | 10,141 | 1,781ms | 1,823ms | 1,837ms |
| 260–270s | 7,883 | 2,630ms | 5,098ms | 5,122ms |

**Degradation point:** the system first spikes past 2s at approximately **666 VUs** (transient). Once sustained at 1,000 VUs, the event loop queue fills ~20–30 seconds in, and latency oscillates between 1.4s and 5.1s — a classic sign of queue saturation in a single-process runtime.

---

#### Interpretation

| Observation | What it tells us |
|-------------|-----------------|
| p(95) = 6ms at 100 VUs | API handles expected load with large headroom — 83× below the 500ms threshold |
| 0% failed requests at all VU levels | Bottleneck is throughput, not capacity to respond — the server never rejects connections |
| Latency jumps from 7ms → 627ms when crossing 200 → 500 VUs | First saturation knee: MongoDB starts queuing read operations |
| Transient 3.3s spike at ≈666 VUs, then recovery | Event loop momentarily overwhelmed during ramp; single-threaded JS catches up once VU ramp pauses |
| p(95) collapses to 4.7s when sustained at 1,000 VUs | Queue grows faster than it drains — the system is past its sustainable throughput ceiling |
| Latency oscillates (1.4s → 4.8s → 2.2s) at 1,000 VUs | GC pauses + MongoDB cursor exhaustion alternately clear and refill the queue |

**Root cause:** Node.js runs a single event loop. With `sleep(1)` removed conceptually, 1,000 concurrent VUs generate ≈3,000 parallel HTTP connections (3 per batch). A single-threaded runtime serialises async callbacks — at high enough concurrency, the gap between the request arrival rate and the service rate causes unbounded queue growth. Horizontal scaling (multiple API instances behind a load balancer) would be the production fix.

---

## Results

At the time of writing, the suite contains **19 integration tests across 4 specs**, all passing:

```
auth.cy.js       1 test   — TC-A001
carts.cy.js      6 tests  — TC-C001 .. TC-C006
products.cy.js   7 tests  — TC-P001 .. TC-P007
users.cy.js      5 tests  — TC-U001 .. TC-U005
                ──────────────────────────────
                19 tests, 19 passing
```

The happy paths for every documented CRUD operation are green. Observations recorded during exploration — and documented in the per-TC `Comments` field — include:

- `POST` endpoints return **200** instead of the REST-conventional **201** on creation.
- `GET`, `PUT` and `DELETE` responses universally leak the Mongoose `__v` field across all resources.
- `POST /carts` additionally leaks `_id` on each product subdocument, while `POST /products` and `POST /users` are clean (their controllers explicitly destructure and strip the Mongo fields before responding). This is an **API inconsistency**, not a bug in the suite.
- `/products/categories` derives its list dynamically from existing products; no category table exists.
- Invalid credentials on `/auth/login` return 401 with a plain-text body.

**Performance summary (k6):**

| Test | VUs | p(95) | p(99) | RPS | Errors | Result |
|------|-----|-------|-------|-----|--------|--------|
| Load test | 100 sustained | 6ms | 17ms | 265 | 0% | ✓ pass |
| Stress test | 200→500→1000 | 2.08s | 4.83s | 783 | 0% | ✗ p95 exceeded |

Degradation point: ~666 VUs (transient spike); sustained collapse at 1,000 VUs after ~20s of queue saturation. See the *Performance tests* section for full analysis.

---

## Challenges and lessons learned

**Defining what "independent tests" actually means.** The instinctive answer is "each test sets up what it needs and cleans up after itself". That's necessary but not sufficient — a test that creates a record with a fixed title is still coupled to the database *and* to every other test that might create the same title. Moving to `runId`-suffixed identifying fields turned "independent from other tests in this suite" into "independent from any history the database could possibly have". This was the single biggest mindset shift of the project.

**Strict vs partial matching is not a style preference.** When the first iteration of `TC-U001` asserted `expect(response.body).to.eq(user)` and failed because the API returned a `__v` field, the instinct was to strip the field before asserting. The better lesson was that strict equality was the wrong assertion in the first place — the contract is "the response body contains these fields with these values", not "the response body is exactly these fields". `.to.deep.include` expresses that correctly. This generalizes: assert what the contract promises, not what the implementation happens to return.

**Helpers should hide the boring parts and *only* the boring parts.** An early temptation was to wrap every request in a command — `cy.getProductById`, `cy.updateCart`, and so on. In practice, this flattened the test body so much that the test file no longer told you what was actually being tested. The split eventually settled on: *setup* goes into helpers (`cy.createProduct`, `cy.createCart`), because it's the same every time; the *act* step stays inline, because it's the reason the test exists. Nick Chapsas' videos were the direct inspiration for this distinction.

**Simpler fixtures mean simpler tests.** The decision to drop `quantities: [N]` in favor of `quantity: N` in cart fixtures came late, but it rippled pleasantly through the whole carts spec — every `cartData.quantities[0]` became `cartData.quantity`, with no loss of expressivity given that every cart in the suite has exactly one product. The lesson: fixture shape *is* an API that the tests consume, and over-generalizing it costs readability.

**A failing test is cheaper than a vague test.** Several TCs were rewritten once it became clear they would have passed against a broken API. Example: an earlier version of `TC-C005 — Update cart` used the same `userId`, `date` and `quantity` for `original` and `updated` — so the PUT could have been a silent no-op and the test would still be green. Making the two fixtures differ in meaningful fields was a small change that turned a tautology into an actual assertion about the PUT's behavior.

**Documenting quirks pays off immediately.** The `Comments` column in `docs/test-cases.md` started as a formality and became the most referenced part of the document during development. When an assertion failed because of a `__v` leak, the comment right next to it explained that the leak was expected, why, and how the assertion tolerated it — turning five minutes of debugging into five seconds of reading.

**Naming conventions deserve one pass of polish.** TC IDs migrated from `TC-P-001` to `TC-P001` halfway through the project. Tiny change, zero technical impact, noticeably cleaner to read and type. Worth doing early rather than leaving it as drift.

---

## Conclusion

The suite in its current form covers the happy path for every CRUD operation across products, carts, users and auth, organized around a set of principles that prioritize independence from external state, readability of the act step, and honest documentation of the API's actual behavior (including the parts that don't quite match the documented contract). The refactors that got it there — runId-based uniqueness, partial matching, static fixture imports, shared setup helpers, single-item seeding — were each small in isolation, but together they made the difference between a suite that "runs" and a suite that would survive being handed to someone else.

What remains: negative and edge-case TCs for every resource (invalid IDs, missing fields, malformed auth bodies), dedicated multi-item tests where the "more than one" case is the actual subject rather than an incidental detail, and the k6 performance layer. Those are the next milestones.
