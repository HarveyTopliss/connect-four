'use strict';

const grid = document.querySelector('#game-grid');
const gridSpaces = document.querySelectorAll('#game-grid div');
const dropContainer = document.querySelectorAll('#drop-container div');
const heading = document.querySelectorAll('.player-heading');

//////////////////////////////////////////////////////////////////////////
//list of cells in reverse(start from bottom right)
const gridR = Array.prototype.toReversed.call(gridSpaces);
let gameOngoing = true;
let currentPlayer = 1;
//returns current player in two different forms
const whichPlayer = function (type) {
  if (type === 'number') {
    return currentPlayer === 1 ? 2 : 1;
  } else if (type === 'counter') {
    return `counter-${currentPlayer === 1 ? 'one' : 'two'}`;
  }
};

//list of winning combinations via grid cells
const winningFours = [
  [0, 1, 2, 3],
  [1, 2, 3, 4],
  [2, 3, 4, 5],
  [3, 4, 5, 6],
  [7, 8, 9, 10],
  [8, 9, 10, 11],
  [9, 10, 11, 12],
  [10, 11, 12, 13],
  [14, 15, 16, 17],
  [15, 16, 17, 18],
  [16, 17, 18, 19],
  [17, 18, 19, 20],
  [21, 22, 23, 24],
  [22, 23, 24, 25],
  [23, 24, 25, 26],
  [24, 25, 26, 27],
  [28, 29, 30, 31],
  [29, 30, 31, 32],
  [30, 31, 32, 33],
  [31, 32, 33, 34],
  [35, 36, 37, 38],
  [36, 37, 38, 39],
  [37, 38, 39, 40],
  [38, 39, 40, 41],
  [0, 7, 14, 21],
  [41, 34, 27, 20],
  [1, 8, 15, 22],
  [40, 33, 26, 19],
  [2, 9, 16, 23],
  [39, 32, 25, 18],
  [3, 10, 17, 24],
  [38, 31, 24, 17],
  [4, 11, 18, 25],
  [37, 30, 23, 16],
  [5, 12, 19, 26],
  [36, 29, 22, 15],
  [6, 13, 20, 27],
  [35, 28, 21, 14],
  [0, 8, 16, 24],
  [41, 33, 25, 17],
  [7, 15, 23, 31],
  [34, 26, 18, 10],
  [14, 22, 30, 38],
  [27, 19, 11, 3],
  [35, 29, 23, 17],
  [6, 12, 18, 24],
  [28, 22, 16, 10],
  [13, 19, 25, 31],
  [21, 15, 9, 3],
  [20, 26, 32, 38],
  [36, 30, 24, 18],
  [5, 11, 17, 23],
  [37, 31, 25, 19],
  [4, 10, 16, 22],
  [2, 10, 18, 26],
  [39, 31, 23, 15],
  [1, 9, 17, 25],
  [40, 32, 24, 16],
  [9, 17, 25, 33],
  [8, 16, 24, 32],
  [11, 17, 23, 29],
  [12, 18, 24, 30],
  [7, 14, 21, 28],
  [8, 15, 22, 29],
  [9, 16, 23, 30],
  [10, 17, 24, 31],
  [11, 18, 25, 32],
  [12, 19, 26, 33],
  [13, 20, 27, 34],
];

//////////////////////////////////////////////////////////////////////////////////////////////
//checks if current players counters covers a winning combination- check if game ended
const winnerCheck = function () {
  for (let y = 0; y < winningFours.length; y++) {
    if (
      gridSpaces[winningFours[y][0]].classList.contains(
        whichPlayer('counter')
      ) &&
      gridSpaces[winningFours[y][1]].classList.contains(
        whichPlayer('counter')
      ) &&
      gridSpaces[winningFours[y][2]].classList.contains(
        whichPlayer('counter')
      ) &&
      gridSpaces[winningFours[y][3]].classList.contains(whichPlayer('counter'))
    ) {
      gameOngoing = false;
    }
  }
};

//shows which column the players counter will drop to when hovering
gridSpaces.forEach(el => {
  let dropSpace = dropContainer[el.dataset.column - 1];
  el.addEventListener('mouseover', () => {
    if (gameOngoing) dropSpace.classList.add(whichPlayer('counter'));
  });
  el.addEventListener('mouseout', () => {
    if (gameOngoing) dropSpace.classList.remove(...dropSpace.classList);
  });
  //removes any hovering counter after player clicks- prevent bugs
  el.addEventListener('click', () => {
    if (gameOngoing) dropSpace.classList.remove(...dropSpace.classList);
  });
});

//when player clicks on board/grid- intending to drop counter
const gridClickHandler = function (e) {
  //if the target of the click isn't within a column
  if (!e.target.dataset.column) {
    return;
  }
  const targetColumn = e.target.dataset.column;
  let targetCell;
  //finds available cell to drop column starting from  the bottom of column
  for (let i = 0; i <= gridR.length; i++) {
    if (
      gridR[i].classList.contains('counter-one') ||
      gridR[i].classList.contains('counter-two') ||
      !(gridR[i].dataset.column === targetColumn)
    ) {
      continue;
    } else {
      //store cell of new counter
      targetCell = gridR[i];
      break;
    }
  }
  if (targetCell && gameOngoing) {
    //add counter to target cell, the check for winner
    targetCell.classList.add(whichPlayer('counter'));
    winnerCheck();
    if (gameOngoing) {
      //change heading for new current player
      heading[currentPlayer - 1].classList.toggle('hidden');
      currentPlayer = whichPlayer('number');
      heading[currentPlayer - 1].classList.toggle('hidden');
      targetCell = false;
      return;
    } else {
      //change heading for game end and reload
      heading[
        currentPlayer - 1
      ].textContent = `Player${currentPlayer} is the Winner!`;
      setTimeout(() => location.reload(), 2000);
    }
  }
};

grid.addEventListener('click', gridClickHandler);
