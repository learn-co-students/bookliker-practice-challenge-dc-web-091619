document.addEventListener("DOMContentLoaded", function() {

  fetch("http://localhost:3000/books")
  .then(res => res.json())
  .then(books => books.forEach(book => addBook(book)))

});

// let currentUsers = [];

function addBook(book) {
  const containerUl = document.getElementById("list")
  const bookLi = document.createElement("li")
  containerUl.appendChild(bookLi)
  bookLi.classList.add("each-book")
  bookLi.id = `book-${book.id}`
  bookLi.innerText = book.title
  bookLi.addEventListener("click", bookClicked)
}

function bookClicked(event) {
  const bookId = event.target.id.split("-")[1]
  fetch(`http://localhost:3000/books/${bookId}`)
  .then(res => res.json())
  .then(book => showThumbnail(book))
}


function showThumbnail(book) {
  const showPanel = document.getElementById("show-panel")
  showPanel.innerHTML = ""
  const title = document.createElement("h2")
  title.innerText = book.title

  const image = document.createElement("img")
  image.src = book["img_url"]

  const desc = document.createElement("p")
  desc.innerText = book.description

  const readersUl = document.createElement("ul")
  readersUl.classList.add("readers-ul")

  const userLiked = document.createElement("h3")
  userLiked.innerText = "Users who liked this book:"

  const readButton = document.createElement("button")
  readButton.id = `button-${book.id}`
  readButton.innerText = "Read book"
  readButton.addEventListener("click", readButtonClicked)

  showPanel.append(title, image, desc, userLiked, readersUl, readButton)

  // currentUsers = [];
  book.users.forEach(user => addUserLi(user, readersUl))
}

function addUserLi(user, readersUl) {
  const userLi = document.createElement("li")
  // currentUsers.push(user)
  userLi.innerText = user.username
  readersUl.appendChild(userLi)
}

function readButtonClicked(event) {
  const readersUl = event.target.previousElementSibling
  const bookId = parseInt(event.target.id.split("-")[1], 10)

  fetch(`http://localhost:3000/books/${bookId}`)
  .then(res => res.json())
  .then(book => {
      if (book.users.map(user => user.id).includes(1)) {
        alert("You already read this book!")
      } else {
      const users = book.users.push({"id":1, "username":"pouros"});
      fetch(`http://localhost:3000/books/${bookId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          users: book.users
        })
      })
      .then(res => res.json())
      .then(book => addUserLi({"id":1, "username":"pouros"}, readersUl))
      }  
  })
}