const app = document.querySelector("#app");
const userBanner = document.querySelector("#user-banner");
const authLink = document.querySelector("#auth-link");
const resLink = document.querySelector("#reservations-link");

// ---------------- DATA ----------------
const GENRES = ["Fiction", "Fantasy", "Horror", "History", "Science", "Other"];
const COLORS = { Fiction: "#6b7a8f", Fantasy: "#2f3e66", Horror: "#3a2a25", History: "#8a6a3b", Science: "#4f7a5a", Other: "#7a8a5a" };

const defaultBooks = [
  { id: 1, cover: "f8bf00ae553b4893ebc6996d7cc0014c7900a103.jpg", title: "Outlast: Principles of Resilience", author: "Dr. Samia Chennouf", genre: "Science", price: 100, rating: 4.5, active: true, brief: "An empirical investigation into survival and adaptive biology." },
  { id: 2, cover: "8887a111941e4b49098b654677016440a002e267.jpg", title: "The Citadel of Sand & Stars", author: "Amine Belkacem", genre: "Fantasy", price: 120, rating: 4.8, active: true, brief: "A captivating fantasy of myth and magic in the desert." },
  { id: 3, cover: "b691515e680ad3883f5b0eb82821ba0d6ed1f889.jpg", title: "Echoes in the Casbah", author: "Leila Hadj-Ali", genre: "History", price: 110, rating: 4.9, active: true, brief: "A journey through the legendary Casbah of Algiers." },
  { id: 4, cover: "3a96888f70b6ebf388387a8fb3e68259b745afd1.jpg", title: "The Whispering Archives", author: "Reda Mansouri", genre: "Horror", price: 90, rating: 4.3, active: true, brief: "A creeping dread inside a crumbling Ottoman manuscript vault." },
  { id: 5, cover: "ddb7d7609973cd5ba0a7f387b26b4050982d98f9.jpg", title: "The Solitary Traveler", author: "Yacine Kateb", genre: "Fiction", price: 130, rating: 4.7, active: true, brief: "A poetic exploration of memory and wandering coastal streets." },
  { id: 6, cover: "6a74a9f06076b3708f7bfddded325137cca85a33.jpg", title: "Botanica Maghrebia", author: "Prof. Farida Zerrouki", genre: "Other", price: 80, rating: 4.6, active: true, brief: "Illustrated compendium of endemic medicinal flora." }
];

// New storage keys (_v2) so old saved data does not break the new fields
let books = JSON.parse(localStorage.getItem("books_v3")) || defaultBooks;
let reservations = JSON.parse(localStorage.getItem("reservations_v2")) || [];

function saveAppData() {
  localStorage.setItem("books_v3", JSON.stringify(books));
  localStorage.setItem("reservations_v2", JSON.stringify(reservations));
}

// ---------------- HELPERS ----------------
const formatDZD = (n) => `${n.toLocaleString("fr-DZ")} DA`;
const DAY = 86400000;
const toMs = (s) => new Date(s + "T00:00:00Z").getTime();
const todayStr = () => new Date().toISOString().slice(0, 10);
const addDays = (s, n) => new Date(toMs(s) + n * DAY).toISOString().slice(0, 10);
const daysBetween = (a, b) => (toMs(b) - toMs(a)) / DAY + 1;
const isBooked = (id, d) => reservations.some(r => r.bookId === id && d >= r.startDate && d <= r.endDate);
const rangeBlocked = (id, a, b) => reservations.some(r => r.bookId === id && a <= r.endDate && b >= r.startDate);

let filters = { q: "", genre: "All" };
let sel = { start: null, end: null };
let openBook = null;

function updateUIHeader() {
  if (currentUser.role === "ADMIN") {
    userBanner.textContent = "Admin";
    userBanner.style.display = "inline";
  } else {
    userBanner.style.display = "none";
  }
  const loggedIn = currentUser.role !== "visitor";
  resLink.style.display = loggedIn ? "inline" : "none";
  authLink.textContent = loggedIn ? "Logout" : "Login";
  authLink.href = loggedIn ? "#/logout" : "#/login";
}

function coverHtml(b) {
  return `<img class="cover" src="${b.cover}" alt="${b.title}" style="background:${COLORS[b.genre]}">`;
}

function bookCardHtml(b) {
  return `
    <article class="card">
      ${coverHtml(b)}
      <span class="tag">${b.genre}</span>${b.active ? "" : '<span class="tag off">Archived</span>'}
      <p class="meta">★ ${b.rating}</p>
      <h3 class="serif">${b.title}</h3>
      <p class="author">${b.author}</p>
      <div class="card-foot">
        <div><small>Daily rate</small><strong>${formatDZD(b.price)} / day</strong></div>
        <a class="btn" href="#/books/${b.id}">Reserve Dates</a>
      </div>
      ${currentUser.role === "ADMIN" && b.active ? `<button class="btn danger" onclick="archiveBook(${b.id})">Archive</button>` : ""}
    </article>`;
}

// ---------------- VIEWS ----------------
function showHome() {
  const picks = books.filter(b => b.active).slice(0, 6);
  app.innerHTML = `
    <section class="hero">
      <p class="eyebrow">DIDOUCHE MOURAD ST • ALGIERS</p>
      <h1 class="serif">Timeless physical books, borrowed by the day.</h1>
      <p class="lead">No online payment, no subscription lock-ins. Reserve your dates and settle in Algerian Dinars (DA) at the counter.</p>
      <form class="search" onsubmit="event.preventDefault(); goSearch();">
        <input id="home-search" placeholder="Search by title, author, or keyword...">
        <button class="btn">Browse books</button>
      </form>
      <div class="stats">
        <div><strong>1,400+</strong>Archival physical titles</div>
        <div><strong>0 DA</strong>Upfront reservation fee</div>
        <div><strong>48 hrs</strong>Guaranteed counter hold</div>
      </div>
    </section>
    <h2 class="serif">Available Today</h2>
    <div class="grid">${picks.map(bookCardHtml).join("")}</div>
    <h2 class="serif center">How It Works</h2>
    <div class="steps">
      <div class="step"><h3>01 Choose a book</h3><p class="hint">Explore our curated archive across 6 genres.</p></div>
      <div class="step"><h3>02 Pick your dates</h3><p class="hint">Loans from 1 to 30 inclusive days. Rate locked on reserving.</p></div>
      <div class="step"><h3>03 Confirm &amp; collect</h3><p class="hint">We hold your book 48 hours. Pay on pickup.</p></div>
    </div>`;
}

function goSearch() {
  filters.q = document.querySelector("#home-search").value;
  location.hash = "#/books";
}

function showBooks() {
  const chips = ["All", ...GENRES].map(g =>
    `<button class="chip ${filters.genre === g ? "on" : ""}" onclick="filters.genre='${g}'; showBooks();">${g}</button>`
  ).join("");
  app.innerHTML = `
    <h1 class="serif">The Book Catalog</h1>
    <p class="lead">Browse curated physical editions. Inclusive daily loan rates in DA with zero upfront deposit.</p>
    <div class="filters">
      <input id="q" placeholder="Search by title, author, or keyword..." value="${filters.q}" oninput="filters.q=this.value; drawGrid();">
      <div class="chips">${chips}</div>
    </div>
    <p id="count" class="hint"></p>
    <div id="catalog-grid" class="grid"></div>`;
  drawGrid();
}

function drawGrid() {
  const q = filters.q.toLowerCase();
  const list = books.filter(b =>
    (b.active || currentUser.role === "ADMIN") &&
    (filters.genre === "All" || b.genre === filters.genre) &&
    (b.title + " " + b.author).toLowerCase().includes(q)
  );
  document.querySelector("#catalog-grid").innerHTML = list.length ? list.map(bookCardHtml).join("") : "<p>No books found.</p>";
  document.querySelector("#count").textContent = `Showing ${list.length} of ${books.filter(b => b.active).length} titles`;
}

function monthHtml(y, m, bookId) {
  const first = new Date(Date.UTC(y, m, 1));
  const total = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const last = addDays(todayStr(), 365);
  let h = `<div class="month"><h4>${first.toLocaleString("en", { month: "long", year: "numeric", timeZone: "UTC" })}</h4><div class="cal">`;
  ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].forEach(d => h += `<span class="dow">${d}</span>`);
  for (let i = 0; i < first.getUTCDay(); i++) h += "<span></span>";
  for (let d = 1; d <= total; d++) {
    const ds = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    let cls = "day", extra = "";
    if (ds < todayStr() || ds > last) { cls += " out"; extra = "disabled"; }
    else if (isBooked(bookId, ds)) { cls += " booked"; extra = 'disabled aria-label="Reserved"'; }
    else if (ds === sel.start || ds === sel.end) cls += " selected";
    else if (sel.start && sel.end && ds > sel.start && ds < sel.end) cls += " inrange";
    h += `<button class="${cls}" ${extra} onclick="pickDay('${ds}')">${d}</button>`;
  }
  return h + "</div></div>";
}

function showDetails(id) {
  const b = books.find(x => x.id === id);
  if (!b || (!b.active && currentUser.role !== "ADMIN")) {
    app.innerHTML = `<h1 class="serif">Book not found</h1><a class="btn" href="#/books">Back</a>`;
    return;
  }
  if (openBook !== id) { sel = { start: null, end: null }; openBook = id; }
  const now = new Date(), y = now.getUTCFullYear(), m = now.getUTCMonth();
  const days = sel.start && sel.end ? daysBetween(sel.start, sel.end) : 0;
  app.innerHTML = `
    <a class="back" href="#/books">← Catalog</a>
    <div class="detail">
      <aside class="panel">
        ${coverHtml(b)}
        <h1 class="serif">${b.title}</h1>
        <p>by ${b.author}</p>
        <p class="meta">★ ${b.rating} · <strong>${formatDZD(b.price)}</strong> / day</p>
        <p class="hint">${b.brief}</p>
      </aside>
      <section>
        <div class="panel">
          <h3>Select Loan Period</h3>
          <p class="hint">Reservations are guaranteed from 1 to 30 days inclusive. Struck-through days are reserved.</p>
          <div class="months">${monthHtml(y, m, id)}${monthHtml(m === 11 ? y + 1 : y, (m + 1) % 12, id)}</div>
          <p id="cal-error" class="error" aria-live="polite"></p>
        </div>
        <div class="panel">
          <h3>Reservation Summary</h3>
          ${days
            ? `<p>${sel.start} → ${sel.end}</p><p>${days} days × ${formatDZD(b.price)}</p><p class="total">${formatDZD(days * b.price)}</p>`
            : `<p class="hint">Pick a start and an end date.</p>`}
          <button class="btn" onclick="confirmReservation(${id})" ${days ? "" : "disabled"}>Continue to checkout</button>
        </div>
      </section>
    </div>`;
}

function pickDay(ds) {
  let err = "";
  if (!sel.start || sel.end || ds < sel.start) sel = { start: ds, end: null };
  else if (daysBetween(sel.start, ds) > 30) err = "Maximum loan is 30 days.";
  else if (rangeBlocked(openBook, sel.start, ds)) err = "Some of these dates are already reserved.";
  else sel.end = ds;
  showDetails(openBook);
  document.querySelector("#cal-error").textContent = err;
}

function showLogin() {
  app.innerHTML = `
    <h1 class="serif">Login</h1>
    <p class="lead">Enter your email to sign in. Use <strong>admin@biblio.dz</strong> for admin access.</p>
    <form onsubmit="event.preventDefault(); submitLoginForm();">
      <input type="email" id="email-input" placeholder="you@example.com" required>
      <button class="btn" type="submit">Continue</button>
    </form>`;
}

function submitLoginForm() {
  if (handleLogin(document.querySelector("#email-input").value)) {
    alert("Logged in successfully!");
    location.hash = "#/books";
  }
}

function showReservation() {
  if (currentUser.role === "visitor") {
    alert("You must log in to view reservations.");
    location.hash = "#/login";
    return;
  }
  const mine = reservations.filter(r => r.userEmail === currentUser.email);
  let html = `<h1 class="serif">My Reservations</h1>`;
  if (mine.length === 0) {
    html += `<p class="lead">No reservations yet.</p><a class="btn" href="#/books">Browse Books</a>`;
  } else {
    html += `<div class="grid">` + mine.map(r => {
      const b = books.find(x => x.id === r.bookId);
      const days = daysBetween(r.startDate, r.endDate);
      return `<article class="card"><h3 class="serif">${b ? b.title : "Unknown book"}</h3>
        <p>${r.startDate} → ${r.endDate} (${days} days)</p>
        <p><strong>${formatDZD(days * r.pricePerDay)}</strong> due at desk</p>
        <p class="hint">Ref #${r.id}</p></article>`;
    }).join("") + `</div>`;
  }
  app.innerHTML = html;
}

// ---------------- ACTIONS ----------------
function confirmReservation(id) {
  if (currentUser.role === "visitor") {
    alert("Please log in to reserve a book.");
    location.hash = "#/login";
    return;
  }
  if (!sel.start || !sel.end) return;
  if (rangeBlocked(id, sel.start, sel.end)) { alert("BOOK_UNAVAILABLE: these dates were just reserved."); return; }
  const b = books.find(x => x.id === id);
  reservations.push({
    id: Date.now(), userEmail: currentUser.email, bookId: id,
    startDate: sel.start, endDate: sel.end, pricePerDay: b.price,
    createdAt: new Date().toISOString()
  });
  saveAppData();
  sel = { start: null, end: null };
  alert("Reservation confirmed!");
  location.hash = "#/reservation";
}

function archiveBook(id) {
  if (currentUser.role !== "ADMIN") return;
  const b = books.find(x => x.id === id);
  if (b) { b.active = false; saveAppData(); router(); }
}

// ---------------- ROUTER ----------------
function router() {
  updateUIHeader();
  const parts = (location.hash || "#/").slice(2).split("/");

  if (parts[0] === "") showHome();
  else if (parts[0] === "books" && parts[1]) showDetails(Number(parts[1]));
  else if (parts[0] === "books") showBooks();
  else if (parts[0] === "reservation") showReservation();
  else if (parts[0] === "login") showLogin();
  else if (parts[0] === "logout") handleLogout();
  else app.innerHTML = `<h1 class="serif">404 - Page Not Found</h1>`;
}

window.addEventListener("hashchange", router);
router();
//img