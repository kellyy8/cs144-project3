/* Text to add to the move here button */
const MOVE_HERE_TEXT = "— Move here —";

export default class Mover {
  constructor() {
    this._selected_card = null;
  }

  startMoving(card) {  // card == this.newCard property of Card object
    // Handles case (3) of canceling a move: If another move was previously initiated, cancel the previous move.
    if (this._selected_card !== null){
      this.stopMoving();
    }

    // Select card for moving.
    this._selected_card = card;
    this._selected_card.classList.add("moving");

    // EXTRA CREDIT (sub-start): Handle the case when card is not dropped onto a moveHere button.
    const cancelDrag = (event) => {
      event.preventDefault();
      this.stopMoving();
    }
    document.body.addEventListener("drop", cancelDrag);
    document.body.addEventListener("dragover", (event) => {event.preventDefault();});
    // EXTRA CREDIT (sub-end)

    const moveCard = (event) => {
      event.preventDefault();  // EXTRA CREDIT
      const target = event.currentTarget;  // Target (button) belongs to a card or title. Selected card should take the spot of target.
      target.after(this._selected_card);
      this.stopMoving();  // Complete the move.
    }

    function createMoveHereButton() {
      let moveHereButton = document.createElement("BUTTON");
      moveHereButton.classList.add("moveHere");
      moveHereButton.textContent = MOVE_HERE_TEXT;
      moveHereButton.addEventListener("click", moveCard);
      moveHereButton.addEventListener("drop", moveCard);  // EXTRA CREDIT
      moveHereButton.addEventListener("dragover", (event) => {event.preventDefault();});  // EXTRA CREDIT
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
  }

}
