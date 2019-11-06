const BOOK_URL = "http://localhost:3000/books"
const currentUserName = "pouros"

document.addEventListener("DOMContentLoaded", function() {
  fetchBooks();
});

function fetchBooks(){
  fetch(BOOK_URL)
    .then( response => response.json() )
    .then( booksArray => booksArray.forEach(
      book => renderBookList(book)
    ) )
}

function renderBookList(book){
  let ul = document.querySelector("#list")

  let li = document.createElement("li")
  li.dataset.bookId = book.id
  li.innerText = book.title
  li.addEventListener("click", fetchBookDetails)

  ul.append(li)
}

function fetchBookDetails(){
  let bookId = event.currentTarget.dataset.bookId

  fetch(`${BOOK_URL}/${bookId}`)
    .then( response => response.json() )
    .then( book => renderBookDetails(book) )
}

function renderBookDetails(book){
  let panel = document.querySelector("#show-panel")
  panel.innerHTML = ""

  let bookTitle = document.createElement("h1")
  bookTitle.innerText = book.title

  let bookImg = document.createElement("img")
  bookImg.src = book.img_url

  let bookDescContainer = document.createElement("div")
  let bookDesc = document.createElement("p")
  bookDesc = book.description

  let fansContainer = document.createElement("div")
  fansContainer.id = "fans-container"

  let fansHeadline = document.createElement("h4")
  fansHeadline.innerHTML = `Fans of <em>${book.title}</em>`

  let fansList = document.createElement("ul")
  fansList.classList.add("fans-list")
  let bookFansArray = book.users
  bookFansArray.forEach(fan => renderFans(fan, fansList))

  let likeBtn = document.createElement("button") 
  likeBtn.innerText = likeBtnText(bookFansArray)
  likeBtn.addEventListener("click", function(){
    if( likeBtn.innerText === "Like!" ){
      likeBook(book, bookFansArray)
    } else {
      unlikeBook(book, bookFansArray)
    }
  })

  bookDescContainer.append(bookDesc)
  fansContainer.append(fansHeadline,fansList)
  panel.append(bookTitle, bookImg, bookDescContainer, fansContainer, likeBtn)
}

function likeBtnText(bookFansArray){
  let text 

  for (let i = 0; i < bookFansArray.length; i++){
    if (bookFansArray[i].username === currentUserName){
      text = "Unlike"
    } else {
      text = "Like!"
    }
  }
  
  return text
}

function renderFans(fan, fansList){
  let fanLi = document.createElement("li")
  fanLi.dataset.fanId = fan.id
  fanLi.innerText = fan.username

  fansList.append(fanLi)
}

function likeBook(book, bookFansArray){
  let newFansArray = bookFansArray
  newFansArray.push({id: 1, "username":"pouros"})
  
  data = {
    users: newFansArray
  }
  fetch(`${BOOK_URL}/${book.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(data)
  })
    .then( response => response.json() )
    .then( updatedBook => renderBookDetails(updatedBook) )
}

function unlikeBook(book, bookFansArray){
  let index
  for (let i = 0; i < bookFansArray.length; i++){
    if (bookFansArray[i].username === currentUserName){
      index = i
    }
  }

  let newFansArray = bookFansArray
  newFansArray.splice(index, 1)

  let data = {
    users: newFansArray
  }

  fetch(`${BOOK_URL}/${book.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(data)
  })
    .then( response => response.json() )
    .then( updatedBook => renderBookDetails(updatedBook) )
}