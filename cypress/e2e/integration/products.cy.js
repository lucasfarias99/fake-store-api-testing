import products from '../../fixtures/products.json'
import { uniquify } from '../../support/utils'

describe('API - /products', () => {
    
    it('TC-P001 — Get all products', () => {
        const product = uniquify(products.tcP001, Date.now(), ['title', 'category'])

        cy.createProduct(product).then((created) => {
            cy.request('GET', '/products').then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.an('array')

                const match = response.body.find((p) => p.id === created.id)
                expect(match, 'created product present in response').to.exist
                expect(match).to.include(product)
            })
        })
    })

    it('TC-P002 — Add new product', () => {
        const newProduct = uniquify(products.tcP002, Date.now(), ['title', 'category'])

        cy.request('POST', '/products', newProduct).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.include(newProduct)
            expect(response.body.id).to.exist

            cy.trackProduct(response.body.id)
        })
    })

    it('TC-P003 — Get product by ID', () => {
        const product = uniquify(products.tcP003, Date.now(), ['title', 'category'])

        cy.createProduct(product).then((created) => {
            cy.request('GET', `/products/${created.id}`).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.include(product)
                expect(response.body.id).to.eq(created.id)
            })
        })
    })

    it('TC-P004 — Update product by ID', () => {
        const runId = Date.now()
        const original = uniquify(products.tcP004.original, runId, ['title', 'category'])
        const updated = uniquify(products.tcP004.updated, runId, ['title', 'category'])

        cy.createProduct(original).then((created) => {
            cy.request('PUT', `/products/${created.id}`, updated).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.include(updated)
                expect(response.body.id).to.eq(created.id)
            })
        })
    })

    it('TC-P005 — Delete product by ID', () => {
        const product = uniquify(products.tcP005, Date.now(), ['title', 'category'])

        cy.createProduct(product).then((created) => {
            cy.request('DELETE', `/products/${created.id}`).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.include(product)
                expect(response.body.id).to.eq(created.id)
            })
        })
    })

    it('TC-P006 — List product categories includes created category', () => {
        const product = uniquify(products.tcP006, Date.now(), ['title', 'category'])

        cy.createProduct(product).then(() => {
            cy.request('GET', '/products/categories').then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.an('array')
                expect(response.body).to.include(product.category)
            })
        })
    })

    it('TC-P007 — List products in category returns matching products', () => {
        const product = uniquify(products.tcP007, Date.now(), ['title', 'category'])

        cy.createProduct(product).then((created) => {
            cy.request('GET', `/products/category/${product.category}`).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.an('array')

                const match = response.body.find((p) => p.id === created.id)
                expect(match, 'created product present in category response').to.exist
                expect(match).to.include(product)
            })
        })
    })
})
