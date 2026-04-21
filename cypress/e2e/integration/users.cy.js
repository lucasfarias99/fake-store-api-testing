describe('API - /users', () => {
    let createdIds = []

    beforeEach(() => {
        createdIds = []
    })

    afterEach(() => {
        createdIds.forEach((id) => {
            cy.request({ method: 'DELETE', url: `/users/${id}`, failOnStatusCode: false })
        })
    })

    it('TC-U001 — Get all users', () => {
        cy.fixture('users').then((users) => {
            const user = users.tcU001

            cy.request('POST', '/users', user).then((postRes) => {
                const id = postRes.body.id
                createdIds.push(id)

                cy.request('GET', '/users').then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.an('array')

                    const match = response.body.find((u) => u.id === id)
                    expect(match, 'created user present in response').to.exist
                    expect(match).to.deep.include(user)
                })
            })
        })
    })

    it('TC-U002 — Add new user', () => {
        cy.fixture('users').then((users) => {
            const newUser = users.tcU002

            cy.request('POST', '/users', newUser).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.deep.include(newUser)
                expect(response.body.id).to.exist

                createdIds.push(response.body.id)
            })
        })
    })

    it('TC-U003 — Get user by ID', () => {
        cy.fixture('users').then((users) => {
            const user = users.tcU003

            cy.request('POST', '/users', user).then((postRes) => {
                const id = postRes.body.id
                createdIds.push(id)

                cy.request('GET', `/users/${id}`).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.deep.include(user)
                    expect(response.body.id).to.eq(id)
                })
            })
        })
    })

    it('TC-U004 — Update user by ID', () => {
        cy.fixture('users').then((users) => {
            const original = users.tcU004.original
            const updated = users.tcU004.updated

            cy.request('POST', '/users', original).then((postRes) => {
                const id = postRes.body.id
                createdIds.push(id)

                cy.request('PUT', `/users/${id}`, updated).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.deep.include(updated)
                    expect(response.body.id).to.eq(id)
                })
            })
        })
    })

    it('TC-U005 — Delete user by ID', () => {
        cy.fixture('users').then((users) => {
            const user = users.tcU005

            cy.request('POST', '/users', user).then((postRes) => {
                const id = postRes.body.id

                cy.request('DELETE', `/users/${id}`).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.deep.include(user)
                    expect(response.body.id).to.eq(id)
                })
            })
        })
    })
})
