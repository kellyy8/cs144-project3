/* The text to use when description is empty */
const NO_DESCRIPTION_TEXT = "(No description)";

export default class Card {
  constructor(title, color) {
    this._mover = null;  // STEP 3

    // STEP 1:
    let templateCard = document.querySelector(".template.card");
    this._newCard = templateCard.cloneNode(true);
    this._newCard.classList.remove("template");
    
    // Retrieve clone's elements and modify their text content between tags.
    let newCardTitle = this._newCard.querySelector(".title");  // fixed
    newCardTitle.textContent = title;
    
    this._newCardDescription = this._newCard.querySelector(".description"); // not fixed; can be updated
    this._newCardDescription.textContent = NO_DESCRIPTION_TEXT;

    // STEP 2 & Project 3: Step 5
    this._delButton = this._newCard.querySelector(".delete");
    const removeCard = () => {
      // Remove card data from local storage.
      let columns = JSON.parse(window.localStorage.getItem("columns"));
      const index = this._newCard.dataset.index;
      const col = this._newCard.dataset.col;
      // console.log(index);

      // In the DOM, update the indices for the cards that follow the deleted card.
      if (col === "todo"){
        let todoCards = document.getElementById("todo").querySelectorAll(".card");
        for (let i=index; i<todoCards.length; i++){
          todoCards[i].dataset.index -= 1;
        }
        columns.todo.splice(index, 1);  // remove card data from local storage
      }
      // TODO: Test if this works on doing and done columns. (i think they are tbh)
      else if (col === "doing"){
        let doingCards = document.getElementById("doing").querySelectorAll(".card");
        for (let i=index; i<doingCards.length; i++){
          doingCards[i].dataset.index -= 1;
        }
        columns.doing.splice(index, 1);  // remove card data from local storage
      }
      else if (col === "done"){
        let doneCards = document.getElementById("done").querySelectorAll(".card");
        for (let i=index; i<doneCards.length; i++){
          doneCards[i].dataset.index -= 1;
        }
        columns.done.splice(index, 1);  // remove card data from local storage
      }
      window.localStorage.setItem("columns", JSON.stringify(columns));  // update local storage
      
      // Remove card from DOM.
      this._newCard.remove();
    }
    this._delButton.addEventListener("click", removeCard);

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

        // Project 3: Step 5
        // Update card data in local storage.
        let columns = JSON.parse(window.localStorage.getItem("columns"));
        const index = this._newCard.dataset.index;
        const col = this._newCard.dataset.col;
        if (col === "todo"){
          columns.todo[index].description = this._newCardDescription.textContent;
        }
        else if (col === "doing"){
          columns.doing[index].description = this._newCardDescription.textContent;
        }
        else if (col === "done"){
          columns.done[index].description = this._newCardDescription.textContent;
        }
        window.localStorage.setItem("columns", JSON.stringify(columns));

      })

    }
    this._editButton.addEventListener("click", editCard);

    // EXTRA CREDIT:
    this._newCard.setAttribute("draggable", true);  

    // Project 3: Step 3 (Implement light/dark mode).
    // Set the card's background color.
    this._newCard.style.backgroundColor = color;

    // Determine the brightness of the background color.
    color = color.replace(/^#/, '');
    let bigint = parseInt(color, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    let brightness = 0.2126*r + 0.7152*g + 0.0722*b;
    
    // Set the card's font color.
    let font_color = "black";     // bg color is light
    if (brightness < 128){        // bg color is dark
      font_color = "white";

      // flip the color of the buttons from black to white
      let buttons = this._newCard.querySelectorAll(".edit, .startMove, .delete");
      buttons.forEach((button) => {
        let img = button.querySelector("img");
        img.style.filter = 'invert(100%)';
      })
    }
    this._newCard.style.color = font_color;

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
    this._newCard.dataset.col = colElem.getAttribute("id");  // Project 3: Step 5
  }

  setDescription(text) {
    if (text === ""){
      this._newCardDescription.textContent = NO_DESCRIPTION_TEXT;
    }
    else {
      this._newCardDescription.textContent = text;
    }
  }

  // TODO: Check if I'm allowed to add this function. Check if I can implement functionality without this function.
  setIndex(index) {
    this._newCard.dataset.index = index;
  }

}
