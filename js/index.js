document.addEventListener("DOMContentLoaded", function() {
    fetchAllBooks()

});

function fetchAllBooks(){
    fetch("http://localhost:3000/books")
    .then(response=>response.json())
    .then(json=>json.forEach(bookHash=>renderBook(bookHash)))
}

function list(){
    return document.getElementById("list")
}

function showPanel(){
    return document.getElementById("show-panel")
}

function buttonId(){
    return event.currentTarget.parentElement.id.split("-")[1]
}

function showBookInfo(bookinfo){
    showPanel().innerHTML=""
    let title = document.createElement("h2")
    title.innerText = bookinfo.title

    let button = document.createElement("button")
    button.id = `book-${bookinfo.id}`
    button.innerText = "read"
    button.addEventListener("click", toggleButton)

    let readerList = document.createElement("ul")
    readerList.id = `bookList-${bookinfo.id}`
    if (bookinfo.users.length > 0){
        bookinfo.users.forEach(reader=>{
            let readerItem = document.createElement("li")
            readerItem.innerText = reader.username
            readerItem.id = `user-${reader.id}`
            readerList.appendChild(readerItem)
            if (reader.username === "pouros"){
                button.innerText = "unread"
            }
        })
    }

    let picture = document.createElement("img")
    picture.src = bookinfo.img_url

    let description = document.createElement("p")
    description.innerText= bookinfo.description

    showPanel().append(title, picture, description, readerList, button)
}

function renderBook(bookHash){
    let bookCard = document.createElement("div")
    bookCard.id = `book-${bookHash.id}`

    let bookItem = document.createElement("li")
    bookItem.innerText = bookHash.title
    bookItem.addEventListener("click", fetchBookInfo)

    bookCard.append(bookItem)
    list().append(bookCard)
}

function fetchBookInfo(){
    fetch(`http://localhost:3000/books/${buttonId()}`)
    .then(response=>response.json())
    .then(json=>showBookInfo(json))
}

function toggleButton(event){
    switch(event.target.innerText) {
        case "read":
            event.target.innerText = "unread"
            patchRequest(event)
            //need to update DOM
            break
        case "unread":
            event.target.innerText = "read"
            deleteRequest(event)
            break
    }
}

function patchRequest(event){
    let bookId = event.target.id.split("-")[1]
    let bookList=document.getElementById(`bookList-${bookId}`)
    let dataHash = {"users":[]}
    let userArray = [...bookList.children]
    userArray.forEach(user=>{
        dataHash["users"].push({"id": user.id.split("-")[1], "username":user.innerText})
    })
    dataHash.users.push({"id":1, "username":"pouros"})
    fetch(`http://localhost:3000/books/${bookId}`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "appliction/json"
        },
        body: JSON.stringify(dataHash)
    })
    let readerItem = document.createElement("li")
    readerItem.innerText = "pouros"
    readerItem.id = `user-1`
    bookList.appendChild(readerItem)
}

function deleteRequest(event){
    let bookId = event.target.id.split("-")[1]
    let bookList=document.getElementById(`bookList-${bookId}`)
    let dataHash = {"users":[]}
    let userArray = [...bookList.children]
    userArray.forEach(user=>{
        dataHash["users"].push({"id": user.id.split("-")[1], "username":user.innerText})
    })
    dataHash["users"].pop()
    fetch(`http://localhost:3000/books/${bookId}`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "appliction/json"
        },
        body: JSON.stringify(dataHash)
    })
    bookList.lastElementChild.remove()
}
