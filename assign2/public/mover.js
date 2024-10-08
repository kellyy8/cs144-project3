/* Text to add to the move here button */
const MOVE_HERE_TEXT = "— Move here —";

export default class Mover {
  constructor() {
    this._selected_card = null;

    // PROJECT 3 EXTRA CREDIT
    this._emptySpace = document.querySelector(".template.card").cloneNode(true);  // not added to DOM tree upon cloning
    this._emptySpace.classList.remove("template");
    this._emptySpace.style.opacity = "0";

    this.cancelMove = (event) => {
      // Cancel move if user clicked outside moving card's region and it's not a moveHere button.
      if (this._selected_card != null && !this._selected_card.contains(event.target) && !event.target.classList.contains("moveHere")) {
        // console.log(this._selected_card);
        // console.log(event.target);
        event.preventDefault();
        this.stopMoving();
      }
    }
  }

  startMoving(card) {  // card == this.newCard property of Card object
    // Handles case (3) of canceling a move: If another move was previously initiated, cancel the previous move.
    if (this._selected_card !== null){
      this.stopMoving();
    }

    // Select card for moving.
    this._selected_card = card;
    this._selected_card.classList.add("moving");

    // Project 2: EC and Step 3.4 - Cancel move via missing drop zone or click outside of card buttons.
    document.addEventListener("click", this.cancelMove);
    document.body.addEventListener("drop", this.cancelMove);

    // Handle what happens as card is being dragged.
    document.body.addEventListener("dragover", (event) => {event.preventDefault();});

    const moveCard = (event) => {
      // event.stopPropagation();
      event.preventDefault();  // EXTRA CREDIT
      const target = event.currentTarget;  // Target (button) belongs to a card or title. Selected card should take the spot of target.
      
      // Project 3: Step 5
      let columns = JSON.parse(window.localStorage.getItem("columns"));

      // DOM ∆ PART 1 OUT OF 4: Decrement the indices for the cards following the removed card.
      // LOCAL STORAGE ∆ PART 1 OUT OF 2: Remove card data from current column's list in local storage.
      let curr_index = this._selected_card.dataset.index;
      let curr_col = this._selected_card.dataset.col;
      let cardInfo = null;  // hold copy of card data to add into new column's list in local storage
      // console.log("Current: ", curr_col, curr_index);

      if (curr_col === "todo"){
        let todoCards = document.getElementById("todo").querySelectorAll(".card");
        for (let i=curr_index; i<todoCards.length; i++){
          todoCards[i].dataset.index -= 1;
        }
        cardInfo = columns.todo[curr_index];
        columns.todo.splice(curr_index, 1); 
      }
      // TODO: Test if this works on doing and done columns. (i think they are tbh)
      else if (curr_col === "doing"){
        let doingCards = document.getElementById("doing").querySelectorAll(".card");
        for (let i=curr_index; i<doingCards.length; i++){
          doingCards[i].dataset.index -= 1;
        }
        cardInfo = columns.doing[curr_index];
        columns.doing.splice(curr_index, 1); 
      }
      else if (curr_col === "done"){
        let doneCards = document.getElementById("done").querySelectorAll(".card");
        for (let i=curr_index; i<doneCards.length; i++){
          doneCards[i].dataset.index -= 1;
        }
        cardInfo = columns.done[curr_index];
        columns.done.splice(curr_index, 1); 
      }

      // DOM ∆ PART 2 and 3 OUT OF 4: Remove node from current parent/column & add it to children of new parent/column. 
      target.after(this._selected_card);

      // DOM ∆ PART 4 OUT OF 4: Increment the indices of all cards that will follow inserted card.
      // LOCAL STORAGE ∆ PART 2 OUT OF 2: Add card data to new column's list in local storage.
      let new_col = target.parentElement.getAttribute("id");
      let new_index = 0;  // if adding to top of column
      // console.log(target.previousSibling.nodeName);
      if (target.previousSibling.nodeName === "ARTICLE"){  // if adding to middle or bottom of column
        // console.log("updated index")
        new_index = Number(target.previousSibling.dataset.index) + 1;  // +1 since inserting after the moveHere button
      }

      // In the DOM, update moved card's index relative to new column.
      this._selected_card.dataset.index = new_index;
      this._selected_card.dataset.col = new_col;
      // console.log("New: ", new_col, new_index);
      // console.log("Moved card title: ", cardInfo.title);

      /* Notes: - colCards[i] where i==new_index is the card that just got moved.
                - Cards whose indices needed to be incremented will start at index+1 since card node already moved in DOM. */
      if (new_col === "todo"){
        let todoCards = document.getElementById("todo").querySelectorAll(".card");
        for (let i=new_index+1; i<todoCards.length; i++){
          todoCards[i].dataset.index = Number(todoCards[i].dataset.index) + 1;
        }
        columns.todo.splice(new_index, 0, cardInfo); 
      }
      else if (new_col === "doing"){
        let doingCards = document.getElementById("doing").querySelectorAll(".card");
        for (let i=new_index+1; i<doingCards.length; i++){
          doingCards[i].dataset.index = Number(doingCards[i].dataset.index) + 1;
        }
        columns.doing.splice(new_index, 0, cardInfo); 
      }
      else if (new_col === "done"){
        let doneCards = document.getElementById("done").querySelectorAll(".card");
        for (let i=new_index+1; i<doneCards.length; i++){
          doneCards[i].dataset.index = Number(doneCards[i].dataset.index) + 1;
        }
        columns.done.splice(new_index, 0, cardInfo); 
      }

      window.localStorage.setItem("columns", JSON.stringify(columns)); // Update local storage with the changes.

      // PROJECT 3 EXTRA CREDIT
      if(event.type === "drop"){
        console.log(event.type);
        this._selected_card.classList.add("dropped");
      }

      this.stopMoving();  // Complete the move.
    }

    // PROJECT 3 EXTRA CREDIT
    const removeBorder = () => {
      let droppedCard = document.querySelector(".dropped");
      if(droppedCard != null){
        console.log(droppedCard);
        droppedCard.classList.remove("dropped");
      }
    }
    document.addEventListener("click", removeBorder);
    document.addEventListener("dragstart", removeBorder);  // TODO: Check if this is required.

    // Project 3: EC
    const makeSpace = (event) => {
      event.preventDefault();
      event.target.after(this._emptySpace);
    }

    function createMoveHereButton() {
      let moveHereButton = document.createElement("BUTTON");
      moveHereButton.classList.add("moveHere");
      moveHereButton.textContent = MOVE_HERE_TEXT;
      moveHereButton.addEventListener("click", moveCard);
      moveHereButton.addEventListener("drop", moveCard);  // EXTRA CREDIT
      moveHereButton.addEventListener("dragover", makeSpace);  // EXTRA CREDIT
      return moveHereButton;
    }

    // Add button below each column title = add button before first card in each column
    let colElems = document.querySelectorAll(".column");
    for(let i=0; i < colElems.length; i++){
      let firstCard = colElems[i].querySelector(".card");
      colElems[i].insertBefore(createMoveHereButton(), firstCard);
    }

    // Add button below each card
    let allCards = document.querySelectorAll(".card");
    for(let i=0; i < allCards.length; i++){
      if(!allCards[i].classList.contains("template")){
        allCards[i].after(createMoveHereButton());
      }
    }
  }

  stopMoving() {
    // Handles: Completing a move & canceling a move.
    // Cancel current move when (1) a card is added, (2) a card is deleted, (3) before moving another card is started.
    
    if (this._selected_card === null){
      return;
    }

    // Deselect card.
    this._selected_card.classList.remove("moving");
    this._selected_card = null;

    // Remove all moveHere buttons.
    let allMoveHereButtons = document.querySelectorAll(".moveHere");
    for(let i=0; i<allMoveHereButtons.length; i++){
      allMoveHereButtons[i].remove();
    }

    // Project 2: Step 3.4
    document.removeEventListener("click", this.cancelMove);

    // PROJECT 3 EXTRA CREDIT - Remove the blank space and reset the blank space to be ready for another move via drag.
    this._emptySpace.remove();
    this._emptySpace = document.querySelector(".template.card").cloneNode(true);  // not added to DOM tree upon cloning
    this._emptySpace.classList.remove("template");
    this._emptySpace.style.opacity = "0";
  }

}
