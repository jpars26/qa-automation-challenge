// cypress/e2e/api/list_books.cy.js
// Teste de API para listar livros e salvar os dois primeiros ISBNs

describe("API - Listar livros e salvar 2 ISBNs", () => {
  it("deve buscar a lista de livros e guardar 2 ISBNs no session.json", () => {
    // Faz a requisição para obter os livros
    cy.request("GET", "/BookStore/v1/Books").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("books");
      expect(response.body.books).to.be.an("array").that.has.length.greaterThan(1);

      // Seleciona os dois primeiros ISBNs da lista
      const doisPrimeirosIsbns = response.body.books.slice(0, 2).map((livro) => livro.isbn);

      // Lê o arquivo de sessão e salva os ISBNs
      cy.readFile("cypress/fixtures/session.json").then((dadosAntigos) => {
        cy.writeFile("cypress/fixtures/session.json", {
          ...dadosAntigos,
          isbns: doisPrimeirosIsbns,
        });
      });

      cy.log(`ISBNs salvos: ${doisPrimeirosIsbns.join(", ")}`);
    });
  });
});
