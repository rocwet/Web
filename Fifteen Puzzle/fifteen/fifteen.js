/*
Minhhue H. Khuu
May 30, 2015
Fifteen Puzzle javascript file.

The purpose of the fifteen.js file is to create the human interaction for the 
fifteen.html webpage.
This file will create a puzzle that is 4x4 that contains only 15 puzzle pieces
from a predetermined image.
The user can shuffle the image, the shuffled image will be solvable.
The user can hover over a movable piece and if the user clicks on it, 
then the piece will move.
*/
(function () {
  "use strict";
  
  /*
  CONSTANTS
  @ GRID_SIZE The size of the whole puzzle grid
  @ SIZE The size of side (the amount of columns and rows)
  */
  var GRID_SIZE = 400;
  var SIZE = 4;
  
  /*
  Fields for the Fifteen Puzzle
  @emptyX is the x-coordinate of the top left corner of the empty space.
  @emptyY is the y-coordinate of the top left corner of the empty space.
  */
  var emptyX = null;
  var emptyY = null;
  
  /*
  The anonymous function that runs when the webpage is fully loaded.
  */
  window.onload = function(){
    // initialize board and fields
    initialize();          
    // assign action listeners
    var puzzlePieces = document.querySelectorAll(".puzzlepiece");
    for(var i = 0; i< puzzlePieces.length; i++) {                
      puzzlePieces[i].onclick = puzzlePress;                  
    }    
    document.getElementById("shufflebutton").onclick = shuffle;          
  };                                        
  
  /*
  The initialize() function initialize fields and creates the initial puzzle board.
  */
  function initialize() {
    // add puzzle pieces
    var puzzleArea = document.getElementById("puzzlearea");
    for(var i = 0; i < Math.pow(SIZE,2)-1; i++) {
      var puzzlePiece = document.createElement("div");
      var col = (GRID_SIZE/SIZE)*(i%SIZE);
      var row = (GRID_SIZE/SIZE)*((Math.floor(i/SIZE))%SIZE);
      puzzlePiece.classList.add("puzzlepiece");
      puzzlePiece.innerHTML = i + 1;
      puzzlePiece.style.top = row + "px";
      puzzlePiece.style.left = col + "px";
      puzzlePiece.style.backgroundPosition = (-1)*col + "px " + (-1)*row + "px";
      puzzleArea.appendChild(puzzlePiece);
    }
    // initialize empty space
    emptyX = GRID_SIZE - GRID_SIZE/SIZE;
    emptyY = GRID_SIZE - GRID_SIZE/SIZE;
    checkState();
  }
  
  /*
  The shuffle() function will shuffle the puzzle pieces around 1000 times as if
  a the user did it randomly 1000 times. In other words this is a solvable shuffle.
  */
  function shuffle() {
    for(var i = 0; i < 1000; i++) {
      var movablePieces = document.querySelectorAll(".movable");
      var index = Math.floor(movablePieces.length*Math.random());
      puzzleMove(movablePieces[index]);
    }
  }
  
  /*
  The checkState() function will check the current state of each puzzle piece,
  if the piece is movable then it becomes a movable class, if not it is removed.
  */
  function checkState() {
    var puzzlePieces = document.querySelectorAll(".puzzlepiece");
    for(var i = 0; i< puzzlePieces.length; i++) {
      var movable = checkMovable(puzzlePieces[i]);
      if(movable) {
        puzzlePieces[i].classList.add("movable");
        puzzlePieces[i].classList.remove("unmovable");
      } else {
        puzzlePieces[i].classList.remove("movable");
        puzzlePieces[i].classList.add("unmovable");
      }
    }  
  }
  
  /*
  The checkMovableStatus() function takes a given puzzle piece and returns
  information about the status of it.
  @param p The particular puzzle piece to be analyzed.
  @return An array of length 4, that contains information if the column or
      row is movable; and the current top left corner position (x,y) cordinates.
  */
  function checkMovableStatus(p) {
    // get x and y coordinate of a given piece (base-10)
    var x = parseInt(p.style.left,10);
    var y = parseInt(p.style.top,10);
    // determine if the piece can move 
    var moveCol = and(equal(emptyY,y),
              or(equal(emptyX-GRID_SIZE/SIZE,x),
                 equal(emptyX+GRID_SIZE/SIZE,x)));
    var moveRow = and(equal(emptyX,x),
              or(equal(emptyY-GRID_SIZE/SIZE,y),
               equal(emptyY+GRID_SIZE/SIZE,y)));
    // return array of status'
    return [moveCol,moveRow, x, y];
  }
  
  /*
  The checkMovable() function checks if the given piece can be move either 
  up, down, left, or right.
  @param p The particular puzzle piece to be analyzed.
  @return The boolean value determining if the piece can be moved.
  */
  function checkMovable(p){
    return or(checkMovableStatus(p)[0],checkMovableStatus(p)[1]);
  }
  
  /*
  The puzzleMove() function will move a given puzzle piece.
  @param p The particular puzzle pieced to be moved.
  */
  function puzzleMove(p) {
    // retrieve information of current puzzle piece information.
    var status = checkMovableStatus(p);
    var moveCol = status[0];
    var moveRow = status[1];
    var x = status[2];
    var y = status[3];
    
    // move piece column or row - wise.
    // Then switch the coordinates of the empty space x,y fields.
    if(moveCol) {
      movePiece(emptyX, y, p);
      emptyX = x;
    } else if(moveRow) {
      movePiece(x, emptyY, p);
      emptyY = y;
    }
    
    // update state of each puzzle piece.
    checkState();
  }
  
  /*
  The puzzlePress() function will move the pressed puzzle piece.
  */
  function puzzlePress() {
    puzzleMove(this);
  }
  
  /*
  The movePiece function will switch the coordinates of a given puzzle piece
  to the given coordinates.
  @param x The new x coordinate.
  @param y The new y coordinate.
  @param p The particular puzzle piece to have new coordinates.
  */
  function movePiece(x, y, p) {
    p.style.left = x + "px";
    p.style.top = y + "px";
  }
  
  /*
  The equal() function is an equal logic gate, determining if inputs are equal.
  @param A The first input.
  @param B The second input.
  @return Boolean value if A is equal to B.
  */
  function equal(A, B) {
    return A == B;
  }
  
  /*
  The or() function is an or logic gate, determining if one input is true.
  @param A The first input.
  @param B The second input.
  @return Boolean value if A or B is true.
  */
  function or(A, B) {
    return A || B;
  }
  
  /*
  The and() function is an or logic gate, determining if one input is true.
  @param A The first input.
  @param B The second input.
  @return Boolean value if A and B is true.
  */
  function and(A, B) {
    return A && B;
  }

})();
