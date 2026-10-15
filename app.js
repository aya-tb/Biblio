const books = [
  { id: 1, title: "book1" },
  { id: 2, title: "book2" },
  { id: 3, title: "book3" },
  { id: 4, title: "book4" },
  { id: 5, title: "book5" },
  { id: 6, title: "book6" },

];

function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelector("#page-" + name).classList.add("active");
}


function fillBooks() {
  const list = document.querySelector("#books-list");
  list.innerHTML = books.map(b => `
    <div class="card">
      <h3>${b.title}</h3>
      <a class="btn" href="#/books/${b.id}">Details</a>
    </div>`).join("");
}


function fillDetails(id) {
  const book = books.find(b => b.id === id);
  document.querySelector("#details-title").textContent = book.title;
}


function router() {
  const parts = (location.hash || "#/").slice(2).split("/");

  if (parts[0] === "") {
    showPage("home");
  } else if (parts[0] === "books" && parts[1]) {
    fillDetails(Number(parts[1]));
    showPage("details");
  } else if (parts[0] === "books") {
    fillBooks();
    showPage("books");
  }
}

window.addEventListener("hashchange", router);
router();
//{  }
//l
//k
