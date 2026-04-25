import users from '../../fixtures/users.json'
import { uniquify } from '../../support/utils'

describe('API - /users', () => {
    
    it('TC-U001 — Get all users', () => {
        const user = uniquify(users.tcU001, Date.now(), ['email', 'username'])

        cy.createUser(user).then((created) => {
            cy.request('GET', '/users').then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.an('array')

                const match = response.body.find((u) => u.id === created.id)
                expect(match, 'created user present in response').to.exist
                expect(match).to.deep.include(user)
            })
        })
    })

    it('TC-U002 — Add new user', () => {
        const newUser = uniquify(users.tcU002, Date.now(), ['email', 'username'])

        cy.request('POST', '/users', newUser).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.deep.include(newUser)
            expect(response.body.id).to.exist

            cy.trackUser(response.body.id)
        })
    })

    it('TC-U003 — Get user by ID', () => {
        const user = uniquify(users.tcU003, Date.now(), ['email', 'username'])

        cy.createUser(user).then((created) => {
            cy.request('GET', `/users/${created.id}`).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.deep.include(user)
                expect(response.body.id).to.eq(created.id)
            })
        })
    })

    it('TC-U004 — Update user by ID', () => {
        const runId = Date.now()
        const original = uniquify(users.tcU004.original, runId, ['email', 'username'])
        const updated = uniquify(users.tcU004.updated, runId, ['email', 'username'])

        cy.createUser(original).then((created) => {
            cy.request('PUT', `/users/${created.id}`, updated).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.deep.include(updated)
                expect(response.body.id).to.eq(created.id)
            })
        })
    })

    it('TC-U005 — Delete user by ID', () => {
        const user = uniquify(users.tcU005, Date.now(), ['email', 'username'])

        cy.createUser(user).then((created) => {
            cy.request('DELETE', `/users/${created.id}`).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.deep.include(user)
                expect(response.body.id).to.eq(created.id)
            })
        })
    })
})
