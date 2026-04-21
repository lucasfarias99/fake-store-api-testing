# Test Cases — Fake Store API

> Test case structure based on the GeeksforGeeks test case template.
> Each test case is documented before implementation.

## Template

### Header

| Field              | Description                                         |
|--------------------|-----------------------------------------------------|
| **ID**             | TC-XXX                                              |
| **Description**    | Short, behavior-describing title                    |
| **Resource**       | Which API resource (Products, Carts, Users, Auth)   |
| **Method**         | HTTP method (GET, POST, PUT, PATCH, DELETE)         |
| **Endpoint**       | Full path (e.g. `/products/:id`)                    |
| **Preconditions**  | What must be true before the test runs              |
| **Postconditions** | Expected system state after the test completes      |

### Body

| Field           | Description                                              |
|-----------------|----------------------------------------------------------|
| **Steps**       | Numbered, step-by-step actions to perform                |
| **Test Data**   | Input values used during execution                       |
| **Expected**    | Expected response (status code + body shape + key fields)|
| **Actual**      | Filled after execution                                   |
| **Status**      | PASS / FAIL / BLOCKED                                    |
| **Comments**    | Remarks or observations from execution                   |

---

## TC-P001 — Get all products

### Header

| Field              | Value                                               |
|--------------------|-----------------------------------------------------|
| **ID**             | TC-P001                                              |
| **Description**    | Get all products                                    |
| **Resource**       | Products                                            |
| **Method**         | GET                                                 |
| **Endpoint**       | /products                                           |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tcP001` and store the returned ID |
| **Postconditions** | Delete the created product via DELETE /products/:id |

### Body

| Field           | Value                                                                      |
|-----------------|----------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /products                                          |
| **Test Data**   | None                                                                       |
| **Expected**    | 200 OK — response is an array and deep-includes the product created in precondition |
| **Actual**      | 200 OK                                                                     |
| **Status**      | PASS                                                                       |
| **Comments**    | GET /products response items include a Mongoose `__v` field; tolerated by `.to.include` asserting only on seeded fields |

---

## TC-P002 — Add new product

### Header

| Field              | Value                                               |
|--------------------|-----------------------------------------------------|
| **ID**             | TC-P002                                              |
| **Description**    | Add new product                                     |
| **Resource**       | Products                                            |
| **Method**         | POST                                                |
| **Endpoint**       | /products                                           |
| **Preconditions**  | None                                                |
| **Postconditions** | Product successfully added to the system            |

### Body

| Field           | Value                                                                      |
|-----------------|----------------------------------------------------------------------------|
| **Steps**       | 1 - Send POST request to /products with test data                          |
| **Test Data**   | `fixtures/products.json → tcP002`                                           |
| **Expected**    | 200 OK — response body matches the `tcP002` fixture with an auto-generated `id` |
| **Actual**      | 200 OK                                                                     |
| **Status**      | PASS                                                                       |
| **Comments**    | API returns 200 instead of REST-standard 201 on resource creation. POST response is clean — controller explicitly strips Mongoose `_id` and `__v` via destructuring before returning |

---

## TC-P003 — Get product by ID

### Header

| Field              | Value                                               |
|--------------------|-----------------------------------------------------|
| **ID**             | TC-P003                                              |
| **Description**    | Get product by ID                                   |
| **Resource**       | Products                                            |
| **Method**         | GET                                                 |
| **Endpoint**       | /products/:id                                       |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tcP003` and store the returned ID |
| **Postconditions** | Delete the created product via DELETE /products/:id |

### Body

| Field           | Value                                                                      |
|-----------------|----------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /products/:id using the ID from precondition       |
| **Test Data**   | None                                                                       |
| **Expected**    | 200 OK — response body matches the `tcP003` fixture with the same `id` from precondition |
| **Actual**      | 200 OK                                                                     |
| **Status**      | PASS                                                                       |
| **Comments**    | GET /products/:id response includes a Mongoose `__v` field; tolerated by `.to.include` |

---

## TC-P004 — Update product

### Header

| Field              | Value                                                                 |
|--------------------|-----------------------------------------------------------------------|
| **ID**             | TC-P004                                                                |
| **Description**    | Update product by ID                                                  |
| **Resource**       | Products                                                              |
| **Method**         | PUT                                                                   |
| **Endpoint**       | /products/:id                                                         |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tcP004.original` and store the returned ID |
| **Postconditions** | Delete the created product via DELETE /products/:id                   |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send PUT request to /products/:id with `tcP004.updated` as body                        |
| **Test Data**   | `fixtures/products.json → tcP004.updated`                                                  |
| **Expected**    | 200 OK — response body matches `tcP004.updated` with the same `id` from precondition       |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | Test data must differ from the product created in precondition to validate the update. PUT response includes a Mongoose `__v` field; tolerated by `.to.include` |

---

## TC-P005 — Delete product

### Header

| Field              | Value                                                                 |
|--------------------|-----------------------------------------------------------------------|
| **ID**             | TC-P005                                                                |
| **Description**    | Delete product by ID                                                  |
| **Resource**       | Products                                                              |
| **Method**         | DELETE                                                                |
| **Endpoint**       | /products/:id                                                         |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tcP005` and store the returned ID |
| **Postconditions** | Product no longer exists in the system                                |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send DELETE request to /products/:id using the ID from precondition                   |
| **Test Data**   | None                                                                                      |
| **Expected**    | 200 OK — response body matches the product created in precondition                        |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | No teardown needed — the test itself is the deletion. DELETE response includes a Mongoose `__v` field; tolerated by `.to.include` |

---

## TC-P006 — List product categories

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-P006                                                                                 |
| **Description**    | List product categories includes dynamically added category                            |
| **Resource**       | Products                                                                               |
| **Method**         | GET                                                                                    |
| **Endpoint**       | /products/categories                                                                   |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tcP006` and store the returned ID |
| **Postconditions** | Delete the created product via DELETE /products/:id                                    |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /products/categories                                              |
| **Test Data**   | None                                                                                      |
| **Expected**    | 200 OK — response array includes `"test-categoria-tcP006"`                                 |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | Categories are derived dynamically from existing products via `distinct('category')` — no category table exists. Response is an array of plain strings — no Mongoose metadata |

---

## TC-P007 — List products in category

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-P007                                                                                 |
| **Description**    | List products in category returns only products of that category                       |
| **Resource**       | Products                                                                               |
| **Method**         | GET                                                                                    |
| **Endpoint**       | /products/category/:category                                                           |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tcP007` and store the returned ID |
| **Postconditions** | Delete the created product via DELETE /products/:id                                    |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /products/category/test-categoria-tcP007                           |
| **Test Data**   | None                                                                                      |
| **Expected**    | 200 OK — response array deep-includes the product created in precondition                 |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | Unique category name prevents interference from seeded or other test data. Response items include a Mongoose `__v` field; tolerated by `.to.include` |

---

## TC-C001 — Get all carts

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-C001                                                                               |
| **Description**    | Get all carts                                                                          |
| **Resource**       | Carts                                                                                  |
| **Method**         | GET                                                                                    |
| **Endpoint**       | /carts                                                                                 |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tcC001` and store the returned ID; create a cart via POST /carts using `fixtures/carts.json → tcC001` with the product ID and store the returned cart ID |
| **Postconditions** | Delete the created cart via DELETE /carts/:id and the created product via DELETE /products/:id |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /carts                                                            |
| **Test Data**   | None                                                                                      |
| **Expected**    | 200 OK — response array deep-includes the cart created in precondition                    |
| **Actual**      | 200 OK                                                                                       |
| **Status**      | PASS                                                                                       |
| **Comments**    | Uses `.to.deep.include` to avoid coupling to seed data or parallel test activity. GET /carts response items include a Mongoose `__v` field; tolerated by the partial match |

---

## TC-C002 — Add a new cart

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-C002                                                                               |
| **Description**    | Add a new cart                                                                         |
| **Resource**       | Carts                                                                                  |
| **Method**         | POST                                                                                   |
| **Endpoint**       | /carts                                                                                 |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tcC002` and store the returned ID |
| **Postconditions** | Delete the created cart via DELETE /carts/:id and the created product via DELETE /products/:id |

### Body

| Field           | Value                                                                                                                 |
|-----------------|-----------------------------------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send POST request to /carts with `userId`, `date` and `products` (single entry referencing the ID from precondition) |
| **Test Data**   | `fixtures/carts.json → tcC002` (userId, date, quantities) merged with productId from precondition                      |
| **Expected**    | 200 OK — response body contains the submitted `userId`, `date`, a generated `id`, and the product (productId + quantity match the submission) |
| **Actual**      | 200 OK                                                                                                                   |
| **Status**      | PASS                                                                                                                   |
| **Comments**    | API inconsistency: POST /carts response leaks a Mongo `_id` on each product subdocument (absent from all GET responses). Top-level POST response has no `__v` (unlike GET/PUT/DELETE). Assertion uses `.to.include` per product subdoc to ignore `_id` |

---

## TC-C003 — Get cart by ID

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-C003                                                                               |
| **Description**    | Get cart by ID                                                                         |
| **Resource**       | Carts                                                                                  |
| **Method**         | GET                                                                                    |
| **Endpoint**       | /carts/:id                                                                             |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tcC003` and store the returned ID; create a cart via POST /carts using `fixtures/carts.json → tcC003` with that product ID and store the returned cart ID |
| **Postconditions** | Delete the created cart via DELETE /carts/:id and the created product via DELETE /products/:id |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /carts/:id using the cart ID from precondition                    |
| **Test Data**   | None                                                                                      |
| **Expected**    | 200 OK — response body matches the cart created in precondition (same `id`, `userId`, `date`, `products`) |
| **Actual**      | 200 OK                                                                                       |
| **Status**      | PASS                                                                                       |
| **Comments**    | GET /carts/:id response includes a Mongoose `__v` field; tolerated by partial matching on relevant fields |

---

## TC-C004 — Get carts by user ID

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-C004                                                                               |
| **Description**    | Get carts by user ID includes dynamically created cart                                 |
| **Resource**       | Carts                                                                                  |
| **Method**         | GET                                                                                    |
| **Endpoint**       | /carts/user/:userId                                                                    |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tcC004` and store the returned ID; create a cart via POST /carts using `fixtures/carts.json → tcC004` with that product ID and store the returned cart ID |
| **Postconditions** | Delete the created cart via DELETE /carts/:id and the created product via DELETE /products/:id |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /carts/user/:userId using the userId from `fixtures/carts.json → tcC004` |
| **Test Data**   | None                                                                                      |
| **Expected**    | 200 OK — response array deep-includes the cart created in precondition                    |
| **Actual**      | 200 OK                                                                                       |
| **Status**      | PASS                                                                                       |
| **Comments**    | Seed already populates carts for userIds 1–10. Assertion uses `.to.deep.include` to validate only the test's contribution, not the full array length — standard practice for integration tests against shared/seeded data. Response items include a Mongoose `__v` field; tolerated by the partial match |

---

## TC-C005 — Update cart

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-C005                                                                               |
| **Description**    | Update cart by ID                                                                      |
| **Resource**       | Carts                                                                                  |
| **Method**         | PUT                                                                                    |
| **Endpoint**       | /carts/:id                                                                             |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tcC005` and store the returned ID; create a cart via POST /carts using `fixtures/carts.json → tcC005.original` with that product ID and store the returned cart ID |
| **Postconditions** | Delete the created cart via DELETE /carts/:id and the created product via DELETE /products/:id |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send PUT request to /carts/:id with `fixtures/carts.json → tcC005.updated` as body (productId filled from precondition) |
| **Test Data**   | `fixtures/carts.json → tcC005.updated`                                                     |
| **Expected**    | 200 OK — response body matches `tcC005.updated` with the same cart `id` from precondition  |
| **Actual**      | 200 OK                                                                                       |
| **Status**      | PASS                                                                                       |
| **Comments**    | `original` and `updated` must differ in at least one field (e.g. `userId`, `date`, or `quantity`) to validate that the update actually happened. PUT response includes a Mongoose `__v` field; product subdocs come back clean (no `_id` leak, unlike POST) |

---

## TC-C006 — Delete cart

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-C006                                                                               |
| **Description**    | Delete cart by ID                                                                      |
| **Resource**       | Carts                                                                                  |
| **Method**         | DELETE                                                                                 |
| **Endpoint**       | /carts/:id                                                                             |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tcC006` and store the returned ID; create a cart via POST /carts using `fixtures/carts.json → tcC006` with that product ID and store the returned cart ID |
| **Postconditions** | Cart no longer exists in the system; delete the created product via DELETE /products/:id |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send DELETE request to /carts/:id using the cart ID from precondition                 |
| **Test Data**   | None                                                                                      |
| **Expected**    | 200 OK — response body matches the cart created in precondition                           |
| **Actual**      | 200 OK                                                                                       |
| **Status**      | PASS                                                                                       |
| **Comments**    | No teardown needed for the cart — the test itself is the deletion. DELETE response includes a Mongoose `__v` field; product subdocs come back clean (no `_id` leak, unlike POST) |

---

## TC-U001 — Get all users

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-U001                                                                                |
| **Description**    | Get all users                                                                          |
| **Resource**       | Users                                                                                  |
| **Method**         | GET                                                                                    |
| **Endpoint**       | /users                                                                                 |
| **Preconditions**  | Create a user via POST /users using `fixtures/users.json → tcU001` and store the returned ID |
| **Postconditions** | Delete the created user via DELETE /users/:id                                          |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /users                                                            |
| **Test Data**   | None                                                                                      |
| **Expected**    | 200 OK — response array deep-includes the user created in precondition                    |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | Uses `.to.deep.include` to avoid coupling to seed users. GET /users response items include a Mongoose `__v` field; tolerated by the partial match |

---

## TC-U002 — Add new user

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-U002                                                                                |
| **Description**    | Add new user                                                                           |
| **Resource**       | Users                                                                                  |
| **Method**         | POST                                                                                   |
| **Endpoint**       | /users                                                                                 |
| **Preconditions**  | None                                                                                   |
| **Postconditions** | Delete the created user via DELETE /users/:id                                          |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send POST request to /users with test data                                            |
| **Test Data**   | `fixtures/users.json → tcU002`                                                            |
| **Expected**    | 200 OK — response body matches the `tcU002` fixture with an auto-generated `id`           |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | API returns 200 instead of REST-standard 201 on resource creation. POST /users response is clean at every nesting level (no `_id`, no `__v`) — unlike POST /carts which leaks `_id` in product subdocs |

---

## TC-U003 — Get user by ID

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-U003                                                                                |
| **Description**    | Get user by ID                                                                         |
| **Resource**       | Users                                                                                  |
| **Method**         | GET                                                                                    |
| **Endpoint**       | /users/:id                                                                             |
| **Preconditions**  | Create a user via POST /users using `fixtures/users.json → tcU003` and store the returned ID |
| **Postconditions** | Delete the created user via DELETE /users/:id                                          |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /users/:id using the ID from precondition                         |
| **Test Data**   | None                                                                                      |
| **Expected**    | 200 OK — response body matches the `tcU003` fixture with the same `id` from precondition  |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | GET /users/:id response includes a Mongoose `__v` field; tolerated by `.to.deep.include`  |

---

## TC-U004 — Update user

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-U004                                                                                |
| **Description**    | Update user by ID                                                                      |
| **Resource**       | Users                                                                                  |
| **Method**         | PUT                                                                                    |
| **Endpoint**       | /users/:id                                                                             |
| **Preconditions**  | Create a user via POST /users using `fixtures/users.json → tcU004.original` and store the returned ID |
| **Postconditions** | Delete the created user via DELETE /users/:id                                          |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send PUT request to /users/:id with `tcU004.updated` as body                          |
| **Test Data**   | `fixtures/users.json → tcU004.updated`                                                    |
| **Expected**    | 200 OK — response body matches `tcU004.updated` with the same `id` from precondition      |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | `original` and `updated` must differ in meaningful fields to validate that the update actually happened. PUT /users/:id response includes a Mongoose `__v` field; tolerated by `.to.deep.include` |

---

## TC-U005 — Delete user

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-U005                                                                                |
| **Description**    | Delete user by ID                                                                      |
| **Resource**       | Users                                                                                  |
| **Method**         | DELETE                                                                                 |
| **Endpoint**       | /users/:id                                                                             |
| **Preconditions**  | Create a user via POST /users using `fixtures/users.json → tcU005` and store the returned ID |
| **Postconditions** | User no longer exists in the system                                                    |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send DELETE request to /users/:id using the ID from precondition                      |
| **Test Data**   | None                                                                                      |
| **Expected**    | 200 OK — response body matches the user created in precondition                           |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | No teardown needed — the test itself is the deletion. DELETE /users/:id response includes a Mongoose `__v` field; tolerated by `.to.deep.include` |

---

## TC-A001 — Login with valid credentials returns JWT

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-A001                                                                                |
| **Description**    | Login with valid credentials returns a JWT token                                       |
| **Resource**       | Auth                                                                                   |
| **Method**         | POST                                                                                   |
| **Endpoint**       | /auth/login                                                                            |
| **Preconditions**  | Create a user via POST /users using `fixtures/users.json → tcA001` and store the returned ID |
| **Postconditions** | Delete the created user via DELETE /users/:id                                          |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send POST request to /auth/login with `{username, password}` from `fixtures/users.json → tcA001` |
| **Test Data**   | `{ username: "tcA001", password: "secretA001" }`                                          |
| **Expected**    | 200 OK — response body has a non-empty `token` string in JWT format (three dot-separated parts) |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | Precondition creates the user so the test is self-contained and does not depend on seeded accounts. Response body is minimal — only a `token` field. Observed: invalid credentials return HTTP 401 with plain-text body (not JSON) |

---
