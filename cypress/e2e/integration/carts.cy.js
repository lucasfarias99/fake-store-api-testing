import productsFixture from '../../fixtures/products.json'
import cartsFixture from '../../fixtures/carts.json'

describe('API - /carts', () => {
    it('TC-C001 — Get all carts', () => {
        const cartData = cartsFixture.tcC001

        cy.createProduct(productsFixture.tcC001).then((product) => {
            cy.createCart({ productId: product.id, ...cartData }).then((cart) => {
                cy.request('GET', '/carts').then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.an('array')

                    const match = response.body.find((c) => c.id === cart.id)
                    expect(match, 'created cart present in response').to.exist
                    expect(match.userId).to.eq(cartData.userId)
                    expect(match.date).to.eq(cartData.date)
                    expect(match.products).to.have.length(1)
                    expect(match.products[0]).to.include({
                        productId: product.id,
                        quantity: cartData.quantity,
                    })
                })
            })
        })
    })

    it('TC-C002 — Add a new cart', () => {
        const cartData = cartsFixture.tcC002

        cy.createProduct(productsFixture.tcC002).then((product) => {
            const cartBody = {
                userId: cartData.userId,
                date: cartData.date,
                products: [{ productId: product.id, quantity: cartData.quantity }],
            }

            cy.request('POST', '/carts', cartBody).then((response) => {
                cy.trackCart(response.body.id)

                expect(response.status).to.eq(200)
                expect(response.body.id).to.exist
                expect(response.body.userId).to.eq(cartData.userId)
                expect(response.body.date).to.eq(cartData.date)
                expect(response.body.products).to.have.length(1)
                expect(response.body.products[0]).to.include({
                    productId: product.id,
                    quantity: cartData.quantity,
                })
            })
        })
    })

    it('TC-C003 — Get cart by ID', () => {
        const cartData = cartsFixture.tcC003

        cy.createProduct(productsFixture.tcC003).then((product) => {
            cy.createCart({ productId: product.id, ...cartData }).then((cart) => {
                cy.request('GET', `/carts/${cart.id}`).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.id).to.eq(cart.id)
                    expect(response.body.userId).to.eq(cartData.userId)
                    expect(response.body.date).to.eq(cartData.date)
                    expect(response.body.products).to.have.length(1)
                    expect(response.body.products[0]).to.include({
                        productId: product.id,
                        quantity: cartData.quantity,
                    })
                })
            })
        })
    })

    it('TC-C004 — Get carts by user ID includes created cart', () => {
        const cartData = cartsFixture.tcC004

        cy.createProduct(productsFixture.tcC004).then((product) => {
            cy.createCart({ productId: product.id, ...cartData }).then((cart) => {
                cy.request('GET', `/carts/user/${cartData.userId}`).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.an('array')

                    const match = response.body.find((c) => c.id === cart.id)
                    expect(match, 'created cart present in user carts').to.exist
                    expect(match.userId).to.eq(cartData.userId)
                    expect(match.date).to.eq(cartData.date)
                    expect(match.products).to.have.length(1)
                    expect(match.products[0]).to.include({
                        productId: product.id,
                        quantity: cartData.quantity,
                    })
                })
            })
        })
    })

    it('TC-C005 — Update cart', () => {
        const original = cartsFixture.tcC005.original
        const updated = cartsFixture.tcC005.updated

        cy.createProduct(productsFixture.tcC005).then((product) => {
            cy.createCart({ productId: product.id, ...original }).then((cart) => {
                const updatedBody = {
                    userId: updated.userId,
                    date: updated.date,
                    products: [{ productId: product.id, quantity: updated.quantity }],
                }

                cy.request('PUT', `/carts/${cart.id}`, updatedBody).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.id).to.eq(cart.id)
                    expect(response.body.userId).to.eq(updated.userId)
                    expect(response.body.date).to.eq(updated.date)
                    expect(response.body.products).to.have.length(1)
                    expect(response.body.products[0]).to.include({
                        productId: product.id,
                        quantity: updated.quantity,
                    })
                })
            })
        })
    })

    it('TC-C006 — Delete cart', () => {
        const cartData = cartsFixture.tcC006

        cy.createProduct(productsFixture.tcC006).then((product) => {
            cy.createCart({ productId: product.id, ...cartData }).then((cart) => {
                cy.request('DELETE', `/carts/${cart.id}`).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.id).to.eq(cart.id)
                    expect(response.body.userId).to.eq(cartData.userId)
                    expect(response.body.date).to.eq(cartData.date)
                    expect(response.body.products).to.have.length(1)
                    expect(response.body.products[0]).to.include({
                        productId: product.id,
                        quantity: cartData.quantity,
                    })
                })
            })
        })
    })
})
