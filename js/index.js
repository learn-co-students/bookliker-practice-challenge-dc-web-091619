document.addEventListener("DOMContentLoaded", function() {
fetchBooks()
});


function fetchBooks() {
    fetch('http://localhost:3000/books')
        .then(resp => resp.json())
        .then(bookArray => bookArray.forEach(book => renderBooks(book))
    )
}

function renderBooks(book) {
    let bookUl = document.getElementById('list')

    let bookLi = document.createElement('li')
    bookLi.innerText = `${book.title}`
    bookLi.id = book.id
    bookLi.addEventListener('click', bookThumbnail)
    bookUl.append(bookLi)

}

function bookThumbnail(event) {
    let bookId = event.target.id
    fetch(`http://localhost:3000/books/${bookId}`)
        .then(resp => resp.json())
        .then(book => renderOneBook(book))
}

function renderOneBook(book) {
    let bookContainer = document.getElementById('show-panel')
    bookContainer.innerHTML = ""

    let bookTitle = document.createElement('h2')
    bookTitle.innerText = `${book.title}`

    let bookImage = document.createElement('img')
    bookImage.src = book.img_url

    let bookDescription = document.createElement('p')
    bookDescription.innerText = `${book.description}`

    let readersList = document.createElement('ul')
    readersList.id = 'readerList'
    bookContainer.append(bookTitle, bookImage, bookDescription, readersList)
    
    book.users.forEach(user => renderUser(user))
    
    let readButton = document.createElement('button')
    readButton.innerText = 'read'

    
    readButton.addEventListener('click',() => addReader(event, book)) 
    bookContainer.append(readButton)
}

function renderUser(user) {
    let userContainer = document.getElementById('readerList')
    let userLi = document.createElement('li')
    userLi.innerText = `${user.username}`
    userContainer.appendChild(userLi)
}

function addReader(event, book) {
    let userList = []
    book.users.forEach( user => userList.push(user))
    userList.push({"id":1, "username":"pouros"})
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        body: JSON.stringify({"users" : userList}),
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(resp => resp.json())
    .then(book => renderUser(book.users.slice(-1)[0]))
}
