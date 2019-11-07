const books = document.getElementById('list');
const showPanel = document.getElementById('show-panel')
const users = document.createElement('ul');
const me = {id: 1, username: "pouros"}

document.addEventListener('DOMContentLoaded', function() {
    fetch("http://localhost:3000/books")
    .then(response => response.json())
    .then(books => books.forEach(book => renderBooks(book)))
})

function fetchOneBook(book) {
    return fetch(`http://localhost:3000/books/${book.id}`)
    .then(response => response.json())
}

function renderBooks(book) {
    const liElem = document.createElement('li')
    liElem.innerText = book.title
    books.appendChild(liElem)
    liElem.addEventListener('click', () => {
        fetchOneBook(book)
        .then(newBook => showBook(newBook))
    })
}

function showBook(book) {
    showPanel.innerText = ""
    const title = document.createElement('h2')
    title.innerText = book.title
    const cover = document.createElement('img');
    cover.src = book.img_url;
    const desc = document.createElement('p');
    desc.innerText = book.description;
    showPanel.appendChild(title)
    showPanel.appendChild(cover)
    showPanel.appendChild(desc)
    showPanel.appendChild(users)
    const button = document.createElement('button');
    renderUsers(book)
    button.addEventListener('click', () => {
        fetchOneBook(book)
        .then(newBook => read(newBook, button))
    })
    didIRead(book, button)
    showPanel.appendChild(button)
}

function renderUsers(book) {
    users.innerText = ""
    book.users.forEach(user => {
        const liElem = document.createElement('li');
        liElem.innerText = user.username
        users.appendChild(liElem)
    })
}

function read(book, button) {
    const configObj = {
        method: "PATCH",
        headers: {
            "Content-Type" : "application/json",
            "Accept": "application/json"
        }
    }
    if (didIRead(book, button)) {
        configObj.body = JSON.stringify({users: book.users.filter(removeMe)})
        button.innerText = "Read This Book!"
    } else {
        configObj.body = JSON.stringify({users: [...book.users, me]})
        button.innerText = "Take This Off My List!"
    }
    fetch(`http://localhost:3000/books/${book.id}`, configObj)
    .then(response => response.json())
    .then(newBook => renderUsers(newBook))
}

function didIRead(book, button) {
    let answer = false
    book.users.forEach(user => {
        if (user.id === 1) {
            answer = true
            button.innerText = "Take This Off My List!"
        } else {
            button.innerText = "Read This Book!"
        }
    })
    return answer
}

function removeMe(user) {
    return user.id !== 1
}