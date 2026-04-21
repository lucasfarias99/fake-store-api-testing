describe('API - /products', () => {
    let createdIds = []

    beforeEach(() => {
        createdIds = []
    })

    afterEach(() => {
        createdIds.forEach((id) => {
            cy.request({
                method: 'DELETE',
                url: `/products/${id}`,
                failOnStatusCode: false,
            })
        })
    })

    it('TC-P001 — Get all products', () => {
        cy.fixture('products').then((products) => {
            const seedProducts = products.tcP001

            seedProducts.forEach((product) => {
                cy.request('POST', '/products', product).then((res) => {
                    createdIds.push(res.body.id)
                })
            })

            cy.request('GET', '/products').then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.an('array')

                seedProducts.forEach((seeded) => {
                    const match = response.body.find((p) => p.title === seeded.title)
                    expect(match, `product "${seeded.title}" present in response`).to.exist
                    expect(match).to.include(seeded)
                })
            })
        })
    })

    it('TC-P002 — Add new product', () => {
        cy.fixture('products').then((products) => {
            const newProduct = products.tcP002

            cy.request('POST', '/products', newProduct).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.include(newProduct)
                expect(response.body.id).to.exist

                createdIds.push(response.body.id)
            })
        })
    })

    it('TC-P003 — Get product by ID', () => {
        cy.fixture('products').then((products) => {
            const product = products.tcP003

            cy.request('POST', '/products', product).then((postRes) => {
                const id = postRes.body.id
                createdIds.push(id)

                cy.request('GET', `/products/${id}`).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.include(product)
                    expect(response.body.id).to.eq(id)
                })
            })
        })
    })

    it('TC-P004 — Update product by ID', () => {
        cy.fixture('products').then((products) => {
            const original = products.tcP004.original
            const updated = products.tcP004.updated

            cy.request('POST', '/products', original).then((postRes) => {
                const id = postRes.body.id
                createdIds.push(id)

                cy.request('PUT', `/products/${id}`, updated).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.include(updated)
                    expect(response.body.id).to.eq(id)
                })
            })
        })
    })

    it('TC-P005 — Delete product by ID', () => {
        cy.fixture('products').then((products) => {
            const product = products.tcP005

            cy.request('POST', '/products', product).then((postRes) => {
                const id = postRes.body.id

                cy.request('DELETE', `/products/${id}`).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.include(product)
                    expect(response.body.id).to.eq(id)
                })
            })
        })
    })

    it('TC-P006 — List product categories includes created category', () => {
        cy.fixture('products').then((products) => {
            const product = products.tcP006

            cy.request('POST', '/products', product).then((postRes) => {
                createdIds.push(postRes.body.id)

                cy.request('GET', '/products/categories').then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.an('array')
                    expect(response.body).to.include(product.category)
                })
            })
        })
    })

    it('TC-P007 — List products in category returns only matching products', () => {
        cy.fixture('products').then((products) => {
            const seedProducts = products.tcP007
            const category = seedProducts[0].category

            seedProducts.forEach((product) => {
                cy.request('POST', '/products', product).then((res) => {
                    createdIds.push(res.body.id)
                })
            })

            cy.request('GET', `/products/category/${category}`).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.an('array')
                expect(response.body).to.have.length(seedProducts.length)

                seedProducts.forEach((seeded) => {
                    const match = response.body.find((p) => p.title === seeded.title)
                    expect(match, `product "${seeded.title}" present in response`).to.exist
                    expect(match).to.include(seeded)
                })
            })
        })
    })

})
