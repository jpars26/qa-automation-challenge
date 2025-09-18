// cypress/e2e/api/list_books.cy.js
describe("API - Listar livros e salvar 2 ISBNs", () => {
  it("deve obter a lista de livros e armazenar 2 ISBNs no session.json", () => {
    cy.request("GET", "/BookStore/v1/Books").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("books");
      expect(res.body.books).to.be.an("array").that.has.length.greaterThan(1);

      const firstTwoIsbns = res.body.books.slice(0, 2).map((b) => b.isbn);

      cy.readFile("cypress/fixtures/session.json").then((prev) => {
        cy.writeFile("cypress/fixtures/session.json", {
          ...prev,
          isbns: firstTwoIsbns,
        });
      });

      cy.log(`ISBNs selecionados: ${firstTwoIsbns.join(", ")}`);
    });
  });
});
