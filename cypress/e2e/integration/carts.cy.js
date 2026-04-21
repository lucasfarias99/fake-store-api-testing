describe('API - /carts', () => {
    let createdCartIds = []
    let createdProductIds = []

    beforeEach(() => {
        createdCartIds = []
        createdProductIds = []
    })

    afterEach(() => {
        createdCartIds.forEach((id) => {
            cy.request({ method: 'DELETE', url: `/carts/${id}`, failOnStatusCode: false })
        })
        createdProductIds.forEach((id) => {
            cy.request({ method: 'DELETE', url: `/products/${id}`, failOnStatusCode: false })
        })
    })

    it('TC-C001 — Get all carts', () => {
        cy.fixture('products').then((products) => {
            cy.fixture('carts').then((carts) => {
                const product = products.tcC001
                const cartData = carts.tcC001

                cy.request('POST', '/products', product).then((pRes) => {
                    createdProductIds.push(pRes.body.id)

                    const cartBody = {
                        userId: cartData.userId,
                        date: cartData.date,
                        products: [{ productId: pRes.body.id, quantity: cartData.quantities[0] }],
                    }

                    cy.request('POST', '/carts', cartBody).then((cRes) => {
                        createdCartIds.push(cRes.body.id)

                        cy.request('GET', '/carts').then((response) => {
                            expect(response.status).to.eq(200)
                            expect(response.body).to.be.an('array')

                            const match = response.body.find((c) => c.id === cRes.body.id)
                            expect(match, 'created cart present in response').to.exist
                            expect(match.userId).to.eq(cartData.userId)
                            expect(match.date).to.eq(cartData.date)
                            expect(match.products).to.have.length(1)
                            expect(match.products[0]).to.include({
                                productId: pRes.body.id,
                                quantity: cartData.quantities[0],
                            })
                        })
                    })
                })
            })
        })
    })

    it('TC-C002 — Add a new cart with multiple products', () => {
        cy.fixture('products').then((products) => {
            cy.fixture('carts').then((carts) => {
                const productList = products.tcC002
                const cartData = carts.tcC002
                const productIds = []

                productList.forEach((product) => {
                    cy.request('POST', '/products', product).then((pRes) => {
                        productIds.push(pRes.body.id)
                        createdProductIds.push(pRes.body.id)
                    })
                })

                cy.then(() => {
                    const cartBody = {
                        userId: cartData.userId,
                        date: cartData.date,
                        products: productIds.map((id, i) => ({
                            productId: id,
                            quantity: cartData.quantities[i],
                        })),
                    }

                    cy.request('POST', '/carts', cartBody).then((response) => {
                        createdCartIds.push(response.body.id)

                        expect(response.status).to.eq(200)
                        expect(response.body.id).to.exist
                        expect(response.body.userId).to.eq(cartData.userId)
                        expect(response.body.date).to.eq(cartData.date)
                        expect(response.body.products).to.have.length(productIds.length)

                        response.body.products.forEach((p, i) => {
                            expect(p).to.include({
                                productId: productIds[i],
                                quantity: cartData.quantities[i],
                            })
                        })
                    })
                })
            })
        })
    })

    it('TC-C003 — Get cart by ID', () => {
        cy.fixture('products').then((products) => {
            cy.fixture('carts').then((carts) => {
                const product = products.tcC003
                const cartData = carts.tcC003

                cy.request('POST', '/products', product).then((pRes) => {
                    createdProductIds.push(pRes.body.id)

                    const cartBody = {
                        userId: cartData.userId,
                        date: cartData.date,
                        products: [{ productId: pRes.body.id, quantity: cartData.quantities[0] }],
                    }

                    cy.request('POST', '/carts', cartBody).then((cRes) => {
                        const cartId = cRes.body.id
                        createdCartIds.push(cartId)

                        cy.request('GET', `/carts/${cartId}`).then((response) => {
                            expect(response.status).to.eq(200)
                            expect(response.body.id).to.eq(cartId)
                            expect(response.body.userId).to.eq(cartData.userId)
                            expect(response.body.date).to.eq(cartData.date)
                            expect(response.body.products).to.have.length(1)
                            expect(response.body.products[0]).to.include({
                                productId: pRes.body.id,
                                quantity: cartData.quantities[0],
                            })
                        })
                    })
                })
            })
        })
    })

    it('TC-C004 — Get carts by user ID includes created cart', () => {
        cy.fixture('products').then((products) => {
            cy.fixture('carts').then((carts) => {
                const product = products.tcC004
                const cartData = carts.tcC004

                cy.request('POST', '/products', product).then((pRes) => {
                    createdProductIds.push(pRes.body.id)

                    const cartBody = {
                        userId: cartData.userId,
                        date: cartData.date,
                        products: [{ productId: pRes.body.id, quantity: cartData.quantities[0] }],
                    }

                    cy.request('POST', '/carts', cartBody).then((cRes) => {
                        const cartId = cRes.body.id
                        createdCartIds.push(cartId)

                        cy.request('GET', `/carts/user/${cartData.userId}`).then((response) => {
                            expect(response.status).to.eq(200)
                            expect(response.body).to.be.an('array')

                            const match = response.body.find((c) => c.id === cartId)
                            expect(match, 'created cart present in user carts').to.exist
                            expect(match.userId).to.eq(cartData.userId)
                            expect(match.date).to.eq(cartData.date)
                            expect(match.products).to.have.length(1)
                            expect(match.products[0]).to.include({
                                productId: pRes.body.id,
                                quantity: cartData.quantities[0],
                            })
                        })
                    })
                })
            })
        })
    })

    it('TC-C005 — Update cart', () => {
        cy.fixture('products').then((products) => {
            cy.fixture('carts').then((carts) => {
                const product = products.tcC005
                const original = carts.tcC005.original
                const updated = carts.tcC005.updated

                cy.request('POST', '/products', product).then((pRes) => {
                    createdProductIds.push(pRes.body.id)

                    const originalBody = {
                        userId: original.userId,
                        date: original.date,
                        products: [{ productId: pRes.body.id, quantity: original.quantities[0] }],
                    }

                    cy.request('POST', '/carts', originalBody).then((cRes) => {
                        const cartId = cRes.body.id
                        createdCartIds.push(cartId)

                        const updatedBody = {
                            userId: updated.userId,
                            date: updated.date,
                            products: [{ productId: pRes.body.id, quantity: updated.quantities[0] }],
                        }

                        cy.request('PUT', `/carts/${cartId}`, updatedBody).then((response) => {
                            expect(response.status).to.eq(200)
                            expect(response.body.id).to.eq(cartId)
                            expect(response.body.userId).to.eq(updated.userId)
                            expect(response.body.date).to.eq(updated.date)
                            expect(response.body.products).to.have.length(1)
                            expect(response.body.products[0]).to.include({
                                productId: pRes.body.id,
                                quantity: updated.quantities[0],
                            })
                        })
                    })
                })
            })
        })
    })

    it('TC-C006 — Delete cart', () => {
        cy.fixture('products').then((products) => {
            cy.fixture('carts').then((carts) => {
                const product = products.tcC006
                const cartData = carts.tcC006

                cy.request('POST', '/products', product).then((pRes) => {
                    createdProductIds.push(pRes.body.id)

                    const cartBody = {
                        userId: cartData.userId,
                        date: cartData.date,
                        products: [{ productId: pRes.body.id, quantity: cartData.quantities[0] }],
                    }

                    cy.request('POST', '/carts', cartBody).then((cRes) => {
                        const cartId = cRes.body.id

                        cy.request('DELETE', `/carts/${cartId}`).then((response) => {
                            expect(response.status).to.eq(200)
                            expect(response.body.id).to.eq(cartId)
                            expect(response.body.userId).to.eq(cartData.userId)
                            expect(response.body.date).to.eq(cartData.date)
                            expect(response.body.products).to.have.length(1)
                            expect(response.body.products[0]).to.include({
                                productId: pRes.body.id,
                                quantity: cartData.quantities[0],
                            })
                        })
                    })
                })
            })
        })
    })
})
