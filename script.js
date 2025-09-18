const cardEl = document.getElementById("card");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const indexEl = document.getElementById("index");
const lengthEl = document.getElementById("length");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("previous");
const deleteBtn = document.getElementById("delete-card");
const addBtn = document.getElementById("add-card");
const openHamburgerMenuBtn = document.getElementById("hamburger-open-button");
const closeHamburgerMenuBtn = document.getElementById("hamburger-close-button");
const hamburgerMenuEl = document.getElementById("hamburger-menu");
const hamburgerCreateButton = document.getElementById("hamburger-create-button");
const folderContainerEl = document.getElementById("folder-container");

let rotate = false;
let currentIndex = 0;
let currentFolderIndex = 0;
const cacheName = "cache-v0.1"
const defaultCard = {
    question: "Click the add button to create a flashcard",
    answer: "Click the delete button to delete the current flashcard"
};

/**
 * Array of objects where each object represents each folder
 * Folders contains name and card
 * card is an orray of object where each object therein represents cards with
 * question and answer fields
 */
let cache;

/**
 * Updates the flashcard contents being displayed with the relevant one
 * @param {number} index 
 * @param {Object[]} cardContents 
 */
function reRenderContent(cardContents, index) {
    rotate = true;
    rotateCard();
    
    if (cardContents.length === 0) {
        questionEl.innerText = defaultCard.question;
        answerEl.innerText = defaultCard.answer;
        indexEl.innerText = 0;
        lengthEl.innerText = 0;
    } else if (index < 0) {
        questionEl.innerText = cardContents[++index].question;
        answerEl.innerText = cardContents[index].answer;
        indexEl.innerText = index + 1;
        lengthEl.innerText = cardContents.length;
    } else {
        questionEl.innerText = cardContents[index].question;
        answerEl.innerText = cardContents[index].answer;
        indexEl.innerText = index + 1;
        lengthEl.innerText = cardContents.length;
    }
}

/**
 * Rotates the card. A pretty descriptive name ngl :)
 */
function rotateCard() {
    if (!rotate) {
        cardEl.style.transform = "rotateY(180deg)";
        questionEl.style.display = "none";
        answerEl.style.display = "block";
        rotate = true;
    } else {
        cardEl.style.transform = "rotateY(-180deg)";
        questionEl.style.display = "block";
        questionEl.style.transform = "rotateY(180deg)";
        answerEl.style.display = "none";
        rotate = false;
    }
}

function reRenderFolders(cache, index) {
    folderContainerEl.innerHTML = "";
    cache.forEach((folder, id) => {
        const liEl = `
            <li>
                <input class="folder" type="radio" name="folder-select" id="${id}" ${id == index ? "checked" : ""}>
                <label for="${id}">${folder.name}</label>
                ${id !== 0 ? `<button class="delete-folder" id="${id}" title="Delete folder and its contents">del</delete>` : ""}
            </li>
        `;
        folderContainerEl.innerHTML += liEl; 
    });
}

window.onload = function () {
    cache = JSON.parse(localStorage.getItem(cacheName));
    
    if (cache === null) cache = [{name: "Default", cards: []}];
    
    currentFolderIndex = 0;
    currentIndex = 0;

    reRenderFolders(cache, currentFolderIndex);
    
    if (cache[currentFolderIndex].cards.length === 0) {
        reRenderContent(cache[currentFolderIndex].cards, -1);
    } else {
        reRenderContent(cache[currentFolderIndex].cards, currentIndex);
    }
};

folderContainerEl.addEventListener("click", (event) => {
    if(event.target.classList.contains("folder")){
        const id = event.target.id;
        if (cache[id] !== undefined) {
            currentFolderIndex = id;
            currentIndex = cache[currentFolderIndex].cards.length === 0 ? -1 : 0;
            if (cache[currentFolderIndex].cards.length === 0) {
                reRenderContent(cache[currentFolderIndex].cards, -1);
            } else {
                reRenderContent(cache[currentFolderIndex].cards, 0);
            }
        }
    } else if (event.target.classList.contains("delete-folder")) {
        const confirmation = confirm("Are you sure you want to delete this folder?")
        if (confirmation) {
            const id = parseInt(event.target.id);
            cache.splice(id, 1);
            localStorage.setItem(cacheName, JSON.stringify(cache));
            currentFolderIndex = (currentFolderIndex == id) ? --currentFolderIndex : currentFolderIndex;
            
            reRenderFolders(cache, currentFolderIndex);
            currentIndex = cache[currentFolderIndex].cards.length === 0 ? -1 : 0;
            reRenderContent(cache[currentFolderIndex].cards, currentIndex);
        }
    }
});

cardEl.addEventListener("click", () => {
    rotateCard();
});

nextBtn.addEventListener("click", () => {
    if (currentIndex < cache[currentFolderIndex].cards.length - 1) {
        reRenderContent(cache[currentFolderIndex].cards, ++currentIndex);
    }
});

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        reRenderContent(cache[currentFolderIndex].cards, --currentIndex);
    }
});

deleteBtn.addEventListener("click", () => {
    let confirmation = confirm("Are you sure you want to delete this card?");
    if (confirmation) {
        if (cache[currentFolderIndex].cards.length > 0) {
            cache[currentFolderIndex].cards.splice(currentIndex, 1);
            localStorage.setItem(cacheName, JSON.stringify(cache))
            reRenderContent(cache[currentFolderIndex].cards, --currentIndex);
        } else {
            alert("There are no flashcards to delete.")
        }
    }
});

addBtn.addEventListener("click", () => {
    let question = prompt("Question:");
    if (question !== null && question !== "") {
        let answer = prompt("Answer:");
        if (answer !== null && answer !== "") {
            
            cache[currentFolderIndex].cards.push({question, answer});
            localStorage.setItem(cacheName, JSON.stringify(cache))
            currentIndex = cache[currentFolderIndex].cards.length - 1; 
            reRenderContent(cache[currentFolderIndex].cards, currentIndex);
        }
    } 
});

openHamburgerMenuBtn.addEventListener("click", () => {
    hamburgerMenuEl.classList.remove("hide");
    hamburgerMenuEl.classList.add("show");
});

closeHamburgerMenuBtn.addEventListener("click", () => {
    hamburgerMenuEl.classList.remove("show");
    hamburgerMenuEl.classList.add("hide");
});

hamburgerCreateButton.addEventListener("click", () => {
    const folderName = prompt("Folder name: ");
    if (folderName !== null && folderName !== "") {
        let newFolder = {
            name: folderName,
            cards: []
        };
        cache.push(newFolder);
        localStorage.setItem(cacheName, JSON.stringify(cache));
        currentFolderIndex = cache.length - 1;
        currentIndex = -1;
        reRenderFolders(cache, currentFolderIndex)
        reRenderContent(cache[currentFolderIndex].cards, currentIndex);
    }
})