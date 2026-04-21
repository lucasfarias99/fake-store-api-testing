describe('API - /auth', () => {
    let createdIds = []

    beforeEach(() => {
        createdIds = []
    })

    afterEach(() => {
        createdIds.forEach((id) => {
            cy.request({ method: 'DELETE', url: `/users/${id}`, failOnStatusCode: false })
        })
    })

    it('TC-A001 — Login with valid credentials returns JWT', () => {
        cy.fixture('users').then((users) => {
            const user = users.tcA001

            cy.request('POST', '/users', user).then((postRes) => {
                createdIds.push(postRes.body.id)

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
})
