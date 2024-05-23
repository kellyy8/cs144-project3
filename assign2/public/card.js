/* The text to use when description is empty */
const NO_DESCRIPTION_TEXT = "(No description)";

export default class Card {
  constructor(title, color) {
    this._mover = null;  // STEP 3

    // STEP 1:
    let templateCard = document.querySelector(".template.card");
    this._newCard = templateCard.cloneNode(true);
    this._newCard.classList.remove("template");

    // Select the card's color.
    this._newCard.style.backgroundColor = color;
    
    // Retrieve clone's elements and modify their text content between tags.
    let newCardTitle = this._newCard.querySelector(".title");  // fixed
    newCardTitle.textContent = title;
    
    this._newCardDescription = this._newCard.querySelector(".description"); // not fixed; can be updated
    this._newCardDescription.textContent = NO_DESCRIPTION_TEXT;

    // STEP 2:
    this._delButton = this._newCard.querySelector(".delete");
    this._delButton.addEventListener("click", () => {this._newCard.remove();});

    this._editButton = this._newCard.querySelector(".edit");
    const editCard = () => {      
      // ENTER EDITING MODE
      let inputArea = this._newCard.querySelector(".editDescription.hidden");
      if (this._newCardDescription.textContent !== NO_DESCRIPTION_TEXT){
        inputArea.value = this._newCardDescription.textContent;
      }
      this._newCardDescription.classList.add("hidden");
      inputArea.classList.remove("hidden");
      inputArea.focus();
      inputArea.select();

      // EXIT EDITING MODE
      inputArea.addEventListener("blur", () => {
        this.setDescription(inputArea.value);
        inputArea.classList.add("hidden");
        this._newCardDescription.classList.remove("hidden");
      })
    }
    this._editButton.addEventListener("click", editCard);

    // EXTRA CREDIT:
    this._newCard.setAttribute("draggable", true);  
  }

  addToCol(colElem, mover) { 
    // STEP 3:
    this._mover = mover;
    this._delButton.addEventListener("click", () => {this._mover.stopMoving();});  // Handles case (1) of canceling a move.
    let moveButton = this._newCard.querySelector(".startMove");
    moveButton.addEventListener("click", () => {this._mover.startMoving(this._newCard)});

    // EXTRA CREDIT:
    this._newCard.addEventListener("dragstart", () => {this._mover.startMoving(this._newCard)});

    // STEP 1:
    colElem.appendChild(this._newCard);
  }

  setDescription(text) {
    if (text === ""){
      this._newCardDescription.textContent = NO_DESCRIPTION_TEXT;
    }
    else {
      this._newCardDescription.textContent = text;
    }
  }

}
