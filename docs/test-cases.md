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
| **Preconditions**  | Create 3 products via POST /products using each entry in `fixtures/products.json → tcP001` |
| **Postconditions** | Products remain in the system                       |

### Body

| Field           | Value                                                                      |
|-----------------|----------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /products                                          |
| **Test Data**   | None                                                                       |
| **Expected**    | 200 OK — response is an array and contains all 3 products created in precondition |
| **Actual**      | 200 OK                                                                     |
| **Status**      | PASS                                                                       |
| **Comments**    | None                                                                       |

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
| **Comments**    | API returns 200 instead of REST-standard 201 on resource creation          |

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
| **Comments**    | None                                                                       |

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
| **Comments**    | Test data must differ from the product created in precondition to validate the update     |

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
| **Comments**    | No teardown needed — the test itself is the deletion                                      |

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
| **Comments**    | Categories are derived dynamically from existing products via `distinct('category')` — no category table exists |

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
| **Preconditions**  | Create 3 products via POST /products using each entry in `fixtures/products.json → tcP007` and store their IDs |
| **Postconditions** | Delete all 3 created products via DELETE /products/:id                                 |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /products/category/test-categoria-tcP007                           |
| **Test Data**   | None                                                                                      |
| **Expected**    | 200 OK — response array contains exactly the 3 products created in precondition           |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | Unique category name prevents interference from seeded or other test data                 |

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
| **Actual**      | TBD                                                                                       |
| **Status**      | TBD                                                                                       |
| **Comments**    | Uses `.to.deep.include` to avoid coupling to seed data or parallel test activity          |

---

## TC-C002 — Add a new cart

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-C002                                                                               |
| **Description**    | Add a new cart containing multiple products                                            |
| **Resource**       | Carts                                                                                  |
| **Method**         | POST                                                                                   |
| **Endpoint**       | /carts                                                                                 |
| **Preconditions**  | Create 2 products via POST /products using each entry in `fixtures/products.json → tcC002` and store their IDs |
| **Postconditions** | Delete the created cart via DELETE /carts/:id and both created products via DELETE /products/:id |

### Body

| Field           | Value                                                                                                                 |
|-----------------|-----------------------------------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send POST request to /carts with `userId`, `date` and `products` (2 entries referencing the IDs from precondition) |
| **Test Data**   | `fixtures/carts.json → tcC002` (userId, date, quantities) merged with productIds from precondition                     |
| **Expected**    | 200 OK — response body contains the submitted `userId`, `date`, a generated `id`, and both products (productId + quantity match the submission) |
| **Actual**      | TBD                                                                                                                   |
| **Status**      | TBD                                                                                                                   |
| **Comments**    | Happy path also covers the "cart accepts multiple products" behavior. API inconsistency: POST /carts response leaks a Mongo `_id` on each product subdocument, while GET responses strip it — assertion uses `.to.deep.include` on each product to ignore `_id` |

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
| **Actual**      | TBD                                                                                       |
| **Status**      | TBD                                                                                       |
| **Comments**    | None                                                                                      |

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
| **Actual**      | TBD                                                                                       |
| **Status**      | TBD                                                                                       |
| **Comments**    | Seed already populates carts for userIds 1–10. Assertion uses `.to.deep.include` to validate only the test's contribution, not the full array length — standard practice for integration tests against shared/seeded data |

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
| **Actual**      | TBD                                                                                       |
| **Status**      | TBD                                                                                       |
| **Comments**    | `original` and `updated` must differ in at least one field (e.g. `userId`, `date`, or `quantity`) to validate that the update actually happened |

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
| **Actual**      | TBD                                                                                       |
| **Status**      | TBD                                                                                       |
| **Comments**    | No teardown needed for the cart — the test itself is the deletion                         |

---
