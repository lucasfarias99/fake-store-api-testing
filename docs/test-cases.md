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

## TC-001 — Get all products

### Header

| Field              | Value                                               |
|--------------------|-----------------------------------------------------|
| **ID**             | TC-001                                              |
| **Description**    | Get all products                                    |
| **Resource**       | Products                                            |
| **Method**         | GET                                                 |
| **Endpoint**       | /products                                           |
| **Preconditions**  | Create 3 products via POST /products using each entry in `fixtures/products.json → tc001` |
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

## TC-002 — Add new product

### Header

| Field              | Value                                               |
|--------------------|-----------------------------------------------------|
| **ID**             | TC-002                                              |
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
| **Test Data**   | `fixtures/products.json → tc002`                                           |
| **Expected**    | 200 OK — response body matches the `tc002` fixture with an auto-generated `id` |
| **Actual**      | 200 OK                                                                     |
| **Status**      | PASS                                                                       |
| **Comments**    | API returns 200 instead of REST-standard 201 on resource creation          |

---

## TC-003 — Get product by ID

### Header

| Field              | Value                                               |
|--------------------|-----------------------------------------------------|
| **ID**             | TC-003                                              |
| **Description**    | Get product by ID                                   |
| **Resource**       | Products                                            |
| **Method**         | GET                                                 |
| **Endpoint**       | /products/:id                                       |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tc003` and store the returned ID |
| **Postconditions** | Delete the created product via DELETE /products/:id |

### Body

| Field           | Value                                                                      |
|-----------------|----------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /products/:id using the ID from precondition       |
| **Test Data**   | None                                                                       |
| **Expected**    | 200 OK — response body matches the `tc003` fixture with the same `id` from precondition |
| **Actual**      | 200 OK                                                                     |
| **Status**      | PASS                                                                       |
| **Comments**    | None                                                                       |

---

## TC-004 — Update product

### Header

| Field              | Value                                                                 |
|--------------------|-----------------------------------------------------------------------|
| **ID**             | TC-004                                                                |
| **Description**    | Update product by ID                                                  |
| **Resource**       | Products                                                              |
| **Method**         | PUT                                                                   |
| **Endpoint**       | /products/:id                                                         |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tc004.original` and store the returned ID |
| **Postconditions** | Delete the created product via DELETE /products/:id                   |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send PUT request to /products/:id with `tc004.updated` as body                        |
| **Test Data**   | `fixtures/products.json → tc004.updated`                                                  |
| **Expected**    | 200 OK — response body matches `tc004.updated` with the same `id` from precondition       |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | Test data must differ from the product created in precondition to validate the update     |

---

## TC-005 — Delete product

### Header

| Field              | Value                                                                 |
|--------------------|-----------------------------------------------------------------------|
| **ID**             | TC-005                                                                |
| **Description**    | Delete product by ID                                                  |
| **Resource**       | Products                                                              |
| **Method**         | DELETE                                                                |
| **Endpoint**       | /products/:id                                                         |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tc005` and store the returned ID |
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

## TC-006 — List product categories

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-006                                                                                 |
| **Description**    | List product categories includes dynamically added category                            |
| **Resource**       | Products                                                                               |
| **Method**         | GET                                                                                    |
| **Endpoint**       | /products/categories                                                                   |
| **Preconditions**  | Create a product via POST /products using `fixtures/products.json → tc006` and store the returned ID |
| **Postconditions** | Delete the created product via DELETE /products/:id                                    |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /products/categories                                              |
| **Test Data**   | None                                                                                      |
| **Expected**    | 200 OK — response array includes `"test-categoria-tc006"`                                 |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | Categories are derived dynamically from existing products via `distinct('category')` — no category table exists |

---

## TC-007 — List products in category

### Header

| Field              | Value                                                                                  |
|--------------------|----------------------------------------------------------------------------------------|
| **ID**             | TC-007                                                                                 |
| **Description**    | List products in category returns only products of that category                       |
| **Resource**       | Products                                                                               |
| **Method**         | GET                                                                                    |
| **Endpoint**       | /products/category/:category                                                           |
| **Preconditions**  | Create 3 products via POST /products using each entry in `fixtures/products.json → tc007` and store their IDs |
| **Postconditions** | Delete all 3 created products via DELETE /products/:id                                 |

### Body

| Field           | Value                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------|
| **Steps**       | 1 - Send GET request to /products/category/test-categoria-tc007                           |
| **Test Data**   | None                                                                                      |
| **Expected**    | 200 OK — response array contains exactly the 3 products created in precondition           |
| **Actual**      | 200 OK                                                                                    |
| **Status**      | PASS                                                                                      |
| **Comments**    | Unique category name prevents interference from seeded or other test data                 |

---
