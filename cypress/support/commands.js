const cleanup = { products: [], users: [], carts: [] }

Cypress.Commands.add('createProduct', (product) => {
    return cy.request('POST', '/products', product).then((res) => {
        cleanup.products.push(res.body.id)
        return cy.wrap(res.body, { log: false })
    })
})

Cypress.Commands.add('createUser', (user) => {
    return cy.request('POST', '/users', user).then((res) => {
        cleanup.users.push(res.body.id)
        return cy.wrap(res.body, { log: false })
    })
})

Cypress.Commands.add('createCart', ({ productId, userId, date, quantity }) => {
    const body = {
        userId,
        date,
        products: [{ productId, quantity }],
    }
    return cy.request('POST', '/carts', body).then((res) => {
        cleanup.carts.push(res.body.id)
        return cy.wrap(res.body, { log: false })
    })
})

Cypress.Commands.add('trackProduct', (id) => {
    cleanup.products.push(id)
})

Cypress.Commands.add('trackUser', (id) => {
    cleanup.users.push(id)
})

Cypress.Commands.add('trackCart', (id) => {
    cleanup.carts.push(id)
})

afterEach(() => {
    cleanup.carts.forEach((id) => {
        cy.request({ method: 'DELETE', url: `/carts/${id}`, failOnStatusCode: false })
    })
    cleanup.products.forEach((id) => {
        cy.request({ method: 'DELETE', url: `/products/${id}`, failOnStatusCode: false })
    })
    cleanup.users.forEach((id) => {
        cy.request({ method: 'DELETE', url: `/users/${id}`, failOnStatusCode: false })
    })
    cleanup.carts = []
    cleanup.products = []
    cleanup.users = []
})
