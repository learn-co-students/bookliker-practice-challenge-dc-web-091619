let currentReader = []  //will keep track of the readers for every book
const myUser = {"id":1, "username":"pouros"}  //my user 

document.addEventListener("DOMContentLoaded", function() {
    console.log('connected'); //double check the script is connected....
    fetchBooks()
});


function fetchBooks(){
    fetch("http://localhost:3000/books")
    .then(response => response.json())
    .then(books => books.forEach(book => renderBook(book)));
}

function renderBook(book){
    let listContainer = document.getElementById('list');    //container for all the books
    
    let singleBook = document.createElement('li');  //will contain single book title
    singleBook.innerText = book.title; 
    singleBook.id = `book-${book.id}`;  //id added incase we need it to pull the id of the book from the DOM
    singleBook.addEventListener('click', showBook) //event listener added once use clicks on the title the show panel for the boook will show.
    
    listContainer.appendChild(singleBook);
}

function showBook(event){
    const showPanel = document.getElementById('show-panel');
    showPanel.innerText = "";
    let thisBooksID = event.target.id.split('-')[1];        //grabbing the id of the book picked
    
    //creating html elements needed for the show panel
    let bookTitle = document.createElement('h1');
    let bookImage = document.createElement('img');
    let bookDesc = document.createElement('div');
    let readersContainer = document.createElement('div') // <-- will be used to contain the readers for every book, preferably a ul list will be inside
    readersContainer.id = 'all-users';

    let readBookBtn = document.createElement('button');
    readBookBtn.innerText = 'Read Book'
    readBookBtn.addEventListener('click', doSomethingWithUser)

    currentReader = [] //suppose to empty the array of current users if there is any
    fetch(`http://localhost:3000/books/${thisBooksID}`)
    .then(response => response.json())
    .then(function(book){
        bookTitle.innerText = book.title;
        bookImage.srcset = book.img_url;
        bookDesc.innerText = book.description;
        book.users.forEach(function(user){
            readBookBtn.id = `book-${book.id}`
            let userTag = document.createElement('h4')
            userTag.innerText = user.username
            userTag.id = `user-${user.id}`
            readersContainer.append(userTag);
            currentReader.push(user);
        });
    })

    showPanel.append(bookTitle, bookImage, bookDesc, readersContainer, readBookBtn);
}


function doSomethingWithUser(event){
    let thisbook = event.target.id.split('-')[1]
    let url = `http://localhost:3000/books/${thisbook}`
    

    let found = false;
    currentReader.forEach(function(reader){
        if (reader.id === myUser.id){
            found = true;
            return;
        }   
    })

    //if current user is in the current reader hash then we should alert the user if not we should run the patch code
    if (found){
        alert("You have already read this book!")
    } else {
        currentReader.push(myUser) 

        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                users: currentReader
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
    
        //update the showpage with the updated users
        updatedReaders()
    }
}

function updatedReaders(){
    let userContainer = document.querySelector('#all-users');
    userContainer.innerText = "";
    currentReader.forEach(function(user){
        let userTag = document.createElement('h4')
        userTag.innerText = user.username;
        userTag.id = `user-${user.id}`
        userContainer.append(userTag);
    })
}



