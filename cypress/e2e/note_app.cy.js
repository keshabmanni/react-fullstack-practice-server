describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Keshab Manni',
      username: 'keshab',
      password: 'keshab'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3003')

  })

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2022')
  })

  it('user can login', function() {
    cy.contains('login').click()
    cy.get('#username').type('keshab')
    cy.get('#password').type('keshab')
    cy.get('#login-button').click()

    cy.contains('Keshab Manni logged-in')
  })

  it('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
  })


  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'keshab', password: 'keshab' })
    })

    it('a new note can be created', function() {
      cy.get('#new-note-button').click()
      cy.get('#content').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })

    describe('and several notes exist', function () {
      beforeEach(function () {
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })

      it('one of those can be made important', function() {
        cy.contains('second note').as('theNote')
          
        cy.get('@theNote').contains('make important').click()

        cy.get('@theNote').contains('make not important')
      })
    })
  })
})