// cypress/e2e/api/user_details.cy.js
describe("API - Detalhes do usuário com livros escolhidos", () => {
  let session = null;

  before(() => {
    cy.readFile("cypress/fixtures/session.json").then((data) => {
      session = data; // { userName, password, userID, token, isbns }
    });
  });

  it("deve listar o usuário e conter os dois ISBNs alugados", () => {
    cy.request({
      method: "GET",
      url: `/Account/v1/User/${session.userID}`,
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("books");
      const userIsbns = (res.body.books || []).map((b) => b.isbn);

      // Os escolhidos na etapa anterior precisam estar presentes
      session.isbns.forEach((isbn) => {
        expect(userIsbns, `contém ISBN ${isbn}`).to.include(isbn);
      });
    });
  });
});
