describe('SpaceX Home', function() {
    
    it('load the SpaceX page', function () {
      // programmatically log us in without needing the UI
      cy.request('POST', 'http://localhost:8000/api/v1/user/login', {
          username : 'admin',
          password: 'admin',
      })
      // now that we're logged in, we can visit
      cy.visit('http://localhost:8000/en/launches')
  
      // Assert that el add note is visible
      cy.contains('Upcoming launches').should('be.visible')              
  
    })

    it('load 404 page for invalid uri', function () {
      // programmatically log us in without needing the UI
      cy.request('POST', 'http://localhost:8000/api/v1/user/login', {
          username : 'admin',
          password: 'admin',
      })
      // now that we're logged in, we can visit
      cy.visit('http://localhost:8000/error-path')
  
      // Assert that el add note is visible
      cy.contains('404').should('be.visible')              
  
    })
})