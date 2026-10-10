const app = document.querySelector("#app");

const books = [
  { id: 1, title: "Dune" },
  { id: 2, title: "Gatsby" },
  { id: 3, title: "It" }
];

function showHome() {
  app.innerHTML = "<h1>Home</h1>";
}

function showBooks() {
  let html = "<h1>Books</h1>";
  for (let i = 0; i < books.length; i++) {
    html += `<p>${books[i].title}
      <a href="#/books/${books[i].id}">Details</a></p>`;
  }
  app.innerHTML = html;
}

function showDetails(id) {
  const book = books.find(b => b.id === id);
  app.innerHTML = `<h1>${book.title}</h1><a href="#/books">Back</a>`;
}

function router() {
  const hash = location.hash || "#/";
  const parts = hash.slice(2).split("/");   // "books/1" -> ["books", "1"]

  if (parts[0] === "") showHome();
  else if (parts[0] === "books" && parts[1]) showDetails(Number(parts[1]));
  else if (parts[0] === "books") showBooks();
}

window.addEventListener("hashchange", router);
router();