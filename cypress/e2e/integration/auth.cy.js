import users from '../../fixtures/users.json'
import { uniquify } from '../../support/utils'

describe('API - /auth', () => {
    it('TC-A001 — Login with valid credentials returns JWT', () => {
        const user = uniquify(users.tcA001, Date.now(), ['email', 'username'])

        cy.createUser(user).then(() => {
            cy.request('POST', '/auth/login', {
                username: user.username,
                password: user.password,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.token).to.be.a('string').and.not.be.empty
                expect(response.body.token.split('.')).to.have.length(3)
            })
        })
    })
})
