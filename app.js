const app = document.querySelector("#app");

const books = [
  { id: 1, title: "book1" },
  { id: 2, title: "book2" },
  { id: 3, title: "book3" },
  { id: 4, title: "book4" },
  { id: 5, title: "book5" },
  { id: 6, title: "book6" }
];

function showHome() {
  app.innerHTML = `<h1 class="page-title">Home</h1>`;
}

function showBooks() {
  let html = `<h1 class="page-title">Books</h1>`;
  html += `<div class="grid">`;

  for (let i = 0; i < books.length; i++) {
    html += `
      <div class="card">
        <h3 class="card-title">${books[i].title}</h3>
        <a class="btn" href="#/books/${books[i].id}">Details</a>
      </div>`;
  }

  html += `</div>`;
  app.innerHTML = html;
}

function showDetails(id) {
  const book = books.find(b => b.id === id);
  if (!book) {
    app.innerHTML = `<h1 class="page-title">Book not found</h1>
                     <a class="btn" href="#/books">Back</a>`;
    return;
  }
  app.innerHTML = `
    <div id="details">
      <h1 class="page-title">${book.title}</h1>
      <a class="btn" href="#/books">Back</a>
    </div>`;
}

function router() {
  const hash = location.hash || "#/";
  const parts = hash.slice(2).split("/");

  if (parts[0] === "") showHome();
  else if (parts[0] === "books" && parts[1]) showDetails(Number(parts[1]));
  else if (parts[0] === "books") showBooks();
  else app.innerHTML = `<h1 class="page-title">404</h1>`;
}

window.addEventListener("hashchange", router);
router();
//{  }
//l
//k
