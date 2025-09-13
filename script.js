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

let rotate = false;
let currentIndex = 0;
const defaultCard = {
    question: "Click the add button to create a flashcard",
    answer: "Click the delete button to delete the current flashcard"
};

/**
 * Structure: Array of objects where each object represents a card
 *      question - Contains the question
 *      answer - Contains the answer to the question
 */
let cardContents = [
];

/**
 * Array of objects where each object represents each folder
 * Folders contains name and card
 * card is an orray of object where each object therein represents cards with
 * question and answer fields
 */
let cache = [
    {
        name: "Folder Names",
        cards: [
            {
                question: "What is the current year?",
                answer: "2025",
            },
            { 
                question: "What are the 3 service models?",
                answer: "IaaS, PaaS & SaaS",
            }
        ]
    },
];

/**
 * Updates the flashcard contents being displayed with the relevant one
 * @param {number} index 
 */
function reRenderContent(index) {
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

window.onload = function () {
    cardContents = JSON.parse(localStorage.getItem("cache"));
    if (cardContents === null) cardContents = [];
    
    if (cardContents.length === 0) {
        reRenderContent(-1);
    } else {
        reRenderContent(0);
    }
};

cardEl.addEventListener("click", () => {
    rotateCard();
});

nextBtn.addEventListener("click", () => {
    if (currentIndex < cardContents.length - 1) {
        reRenderContent(++currentIndex)
    }
});

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        reRenderContent(--currentIndex);
    }
});

deleteBtn.addEventListener("click", () => {
    let confirmation = confirm("Are you sure you want to delete this card?");
    if (confirmation) {
        if (cardContents.length > 0) {
            cardContents.splice(currentIndex, 1);
            localStorage.setItem("cache", JSON.stringify(cardContents))
            reRenderContent(--currentIndex);
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
            cardContents.push({question, answer});
            if (currentIndex < 0) currentIndex = 0;
            localStorage.setItem("cache", JSON.stringify(cardContents))
            reRenderContent(currentIndex);
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