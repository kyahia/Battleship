import {Player, GameBoard} from './factors'

// Start game
const grid = buildBoard()

document.querySelector('header').appendChild(designBoard(grid));
const gamer = Player('Yahia');

designPlaceShips(gamer, grid)

function goToMain() {
   document.querySelector('header').textContent = ''
   // build player computer
   const computerPlayer = Player('AI');
   placeComputerShips(computerPlayer);

   const mainWrapper = document.querySelector('main');

   const playerSct = document.createElement('section');
   playerSct.className = gamer.getName() + '-section';
   const playerBoard = designBoard(buildBoard())
   playerSct.appendChild(playerBoard)

   const computerSct = document.createElement('section');
   computerSct.className = computerPlayer.getName() + '-section';
   const computerBoard = designBoard(buildBoard())
   computerSct.appendChild(computerBoard)

   // Game
   computerBoard.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', playCell))


   function playCell(event) {
      const cell = event.target;
      const Attackresult = computerPlayer.board.receiveAttack(cell.id)
      let looping = true
      if (Attackresult === 'miss') {
         computerBoard.querySelector(`#${cell.id}`).className = 'not-damaged';
         while (looping) {
            looping = randAttack(computerPlayer, gamer, playerBoard);
         }
      } else {
         computerBoard.querySelector(`#${event.target.id}`).className = 'damaged';
         checkWinner(gamer.getName(), computerPlayer.getName())
      }
      cell.removeEventListener('click', playCell);
   }

   const playerNameDisplay = document.createElement('p');
   playerNameDisplay.textContent = gamer.getName();
   playerSct.appendChild(playerNameDisplay)
   const computerNameDisplay = document.createElement('p');
   computerNameDisplay.textContent = computerPlayer.getName();
   computerSct.appendChild(computerNameDisplay)

   mainWrapper.appendChild(playerSct)
   mainWrapper.appendChild(computerSct);
}

function placeComputerShips(botPlayer) {
   let computerBoard = buildBoard();
   const computerShipsSizes = [5, 4, 3, 2, 2];

   for (let i of computerShipsSizes) {
      let looping = true;
      while (looping) {
         const randPt = computerBoard[Math.floor(Math.random() * computerBoard.length)]
         const randOrient = ['Horizontal', 'Vertical'][Math.floor(Math.random() * 2)]
         const coordinates = checkDesignPossibility(randPt, randOrient, i, computerBoard)

         if (coordinates.length) {
            computerBoard = placeShip(botPlayer, coordinates, computerBoard);
            looping = false;
         }
      }
   }

}

// operational functions

function randAttack(computer, myPlayer, myPlayerBoard){
   let randAIchoice;
   let attackResult;
   do {
      randAIchoice = grid[Math.floor(Math.random() * 100)];
      attackResult = computer.attack(myPlayer, randAIchoice);
   } while (!attackResult)

   if (attackResult === 'success') {
      myPlayerBoard.querySelector(`#${randAIchoice}`).className = 'damaged';
      checkWinner(computer.getName(), myPlayer.getName())
      return true
   } else {
      myPlayerBoard.querySelector(`#${randAIchoice}`).className = 'not-damaged';
      return false;
   }
}


function designPlaceShips(player, grid) {
   let availableIds = grid;
   const orientBtn = document.createElement('button')
   orientBtn.id = 'orientation'
   orientBtn.textContent = 'Horizontal'
   orientBtn.classList = 'Horizontal'

   document.querySelector('header').appendChild(orientBtn)

   orientBtn.addEventListener('click', e => {
      e.target.classList.toggle('Horizontal')
      e.target.classList.toggle('Vertical')
      e.target.textContent = e.target.className;
   })

   const shipsSizes = [2, 2, 3, 4, 5];
   let siblings = [];

   document.querySelectorAll('.cell').forEach(elem => {
      // Hovering
      elem.addEventListener('mouseover', event => {
         siblings = toggleHovered(event, orientBtn.textContent, shipsSizes[shipsSizes.length - 1], availableIds);
      })
      elem.addEventListener('mouseout', () => {
         document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('hovered'))
      })

      // clicking
      elem.addEventListener('click', () => {
         if (siblings[0]) {
            availableIds = placeShip(player, siblings, availableIds);
            siblings.forEach(pt => {
               document.getElementById(pt).classList.add('placed');
            })
            siblings = [];
            shipsSizes.pop();
         }
         if (shipsSizes.length === 0) {
            goToMain()
         }
      })
   })
}

function placeShip(player, coordinates, availableIds) {
   player.board.placeShip(coordinates.length, coordinates)

   let perifPts = []
   coordinates.forEach(pt => {
      perifPts = [...perifPts, ...ptsAround(pt)]
   })

   let remainIds = availableIds.filter(id => !perifPts.includes(id))

   return remainIds;
}

function toggleHovered(event, orientation, size, availableIds) {
   const position = event.target.id;
   let siblings = [];

   siblings = checkDesignPossibility(position, orientation, size, availableIds)

   siblings.forEach(pt => {
      document.getElementById(pt).classList.toggle('hovered')
   })

   return siblings;
}

function checkDesignPossibility(startId, orientation, size, availableIds) {
   let possibleSiblings = [];
   for (let i = 0; i < size; i++) {
      if (orientation === 'Horizontal') {
         const siblingCol = String.fromCharCode(startId[0].charCodeAt() + i)
         const siblingRow = startId.slice(1)

         possibleSiblings[i] = siblingCol + siblingRow;
      }

      if (orientation === 'Vertical') {
         const siblingCol = startId[0]
         const siblingRow = Number(startId.slice(1)) + i

         possibleSiblings[i] = siblingCol + siblingRow;
      }
   }

   return possibleSiblings.reduce((p, n) => p && availableIds.includes(n), true) ? possibleSiblings : [];
}

function buildBoard() {
   const bord = [];
   const horiz = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
   for (let i = 1; i <= 10; i++) {
      for (let j of horiz) {
         bord.push(j + i);
      }
   }
   return bord;
}

function designBoard(cellsIds) {
   const board = document.createElement('div');

   cellsIds.forEach(id => {
      const cell = document.createElement('button');
      cell.className = 'cell'
      cell.id = id;
      cell.style.opacity = 1;
      board.appendChild(cell)
   })
   return board;
}

function ptsAround(pt) {
   let ptsList = [];
   let col = pt[0];
   let prevCol = String.fromCharCode(col.charCodeAt() - 1);
   let nextCol = String.fromCharCode(col.charCodeAt() + 1);
   let row = Number(pt.slice(1));

   let col1 = [prevCol + (row - 1), prevCol + row, prevCol + (row + 1)]
   let col2 = [`${col}${row - 1}`, pt, `${col}${row + 1}`];
   let col3 = [nextCol + (row - 1), nextCol + row, nextCol + (row + 1)]

   ptsList.push(...col1, ...col2, ...col3)

   return ptsList;
}

function checkWinner(currentPlayer, opponent){
   [...document.querySelector(`.${opponent}-section`).querySelectorAll('.damaged')].reduce((prev, act) =>{
      return act.className === 'damaged' ? 1+prev : prev
   }, 0) === 16 ? displayWinner() : {}
   function displayWinner(){
      document.querySelector('main').textContent = '';
      document.querySelector('footer').textContent = currentPlayer + ' Wins';
   }
}
