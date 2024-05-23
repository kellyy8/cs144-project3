import Card from "./card.js";
import Mover from "./mover.js";

export default class App {
  constructor() {
    this._mover = new Mover();  // STEP 3

    const addCardForm = document.getElementById("addCard");
    const cardTitle = document.getElementById("cardTitle");
    // const cardColor = document.getElementById("cardColor");

    const submitCardInfo = (event) => {
      this._mover.stopMoving();  // STEP 3: Handles case (2) of canceling a move
      event.preventDefault();  // prevent default reloading window
      this.addCard("todo", cardTitle.value, cardColor.value);
      cardTitle.value = "";
      cardColor.value = "#9caf88";
    }

    addCardForm.addEventListener("submit", submitCardInfo);
    cardTitle.addEventListener("submit", submitCardInfo);
    // cardColor.addEventListener("keypress", enterPressed);
  }

  addCard(col, title, color) {
    let colElem = document.getElementById(col);  // col = string id of column card is added to (i.e. 'todo', 'doing', 'done')
    let newCard = new Card(title, color);
    newCard.addToCol(colElem, this._mover);  // STEP 3
    return newCard;
  }

}
