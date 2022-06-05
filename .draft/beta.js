const Ship = function (length, xy) {
   const getLength = () => length;

   let positions = xy.map(coord => ({ position: coord, isHit: false }))

   const hit = coordinate => {
      const hitPoint = positions.find(couple => couple.position === coordinate)
      hitPoint.isHit = true;
   }

   const isSunk = () => {
      return positions.reduce((prev, act) => act.isHit && prev, true);
   }

   return { getLength, hit, isSunk }
}

// Each Player's GAME BOARD

const GameBoard = () => {
   // // let occupiedCells = []; // check utility
   // let grid = buildBoard(); // done
   //const getCells = () => grid.map(elem => elem.point); //

   let ships = [];
   let missedAttacks = []; // done

   const placeShip = (size, coordinates) => {
      let newShip = {};
      newShip['ship'] = Ship(size, coordinates)
      newShip['pts'] = coordinates;
      ships.push(newShip);

      // pushing(occupiedCells, coordinates); check utility
      // Disable busy cells
      // const busyPts = busyBoardCells(coordinates);
      // busyPts.forEach(pt => {
      //    grid.find(elem => elem.point === pt).isFree = false
      // });
   }

   const receiveAttack = coordinate => {
      let damagedShip;

      damagedShip = ships.find(ship => ship.pts.find(pt => pt === coordinate))

      if (damagedShip) {
         damagedShip.ship.hit(coordinate);
         return 'success';
      } else {
         missedAttacks.push(coordinate)
         return 'miss';
      }

   }

   const hasLost = () => ships.reduce((prev, act) => prev && act.ship.isSunk(), true);

   return { missedAttacks, receiveAttack, placeShip, hasLost }//, getCells }
}


// Player factory
const Player = name => {
   const getName = () => name;
   const board = GameBoard(name);

   let attackedPts = [];

   const attack = (enemy, coordinate) => {
      if (attackedPts.includes({ coordinate, impact: 'success' })
         || attackedPts.includes({ coordinate, impact: 'miss' })) {
         return false;
      } // can delete

      attackedPts.push({ coordinate, impact: enemy.board.receiveAttack(coordinate) });
   }

   return { getName, attack, board }
}

// module.exports = { Ship, GameBoard, Player }

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

function mainModule() {
   const grid = buildBoard()

   const computer = Player('AI')
   //computerSct.appendChild(designBoard(computer))

   const computerSct = document.getElementById('computer-section')
   computerSct.appendChild(designBoard(computer.getName(), grid))

   const playerSct = document.getElementById('player-section')
   const gamer = Player('Yahia');
   let availableIds = grid;
   playerSct.appendChild(designBoard(gamer.getName(), grid))

   designFooter(gamer, availableIds)

   function designFooter() {
      const placeBtn = document.createElement('button')
      placeBtn.textContent = 'Place Ships'

      const orientBtn = document.createElement('button')
      orientBtn.id = 'orientation'
      orientBtn.textContent = 'Horizontal'
      orientBtn.classList = 'Horizontal'

      document.getElementById('player-section').appendChild(placeBtn)
      document.getElementById('player-section').appendChild(orientBtn)

      orientBtn.addEventListener('click', e => {
         e.target.classList.toggle('Horizontal')
         e.target.classList.toggle('Vertical')
         e.target.textContent = e.target.className;
      })

      placeBtn.addEventListener('click', designPlaceShips)
   }

   function designPlaceShips() {
      const shipsSizes = [1, 2, 3];

      playerSct.querySelectorAll('.cell').forEach(elem => {
         // Hovering
         elem.addEventListener('mouseover', toggleHovered)
         elem.addEventListener('mouseout', () => {
            playerSct.querySelectorAll('.cell').forEach(cell => cell.classList.remove('hovered'))
         })

         // clicking
         elem.addEventListener('click', e => {
            placeShip(e.target)
            // section.querySelectorAll('.cell').forEach(cell => {
            //    cell.removeEventListener('hover', toggleHovered)
            // })
         })
      })

      function toggleHovered(event) {
         const position = event.target.id;
         const orientation = document.getElementById('orientation').textContent;
         let siblings = [];

         siblings = checkDesignPossibility(position, orientation, shipsSizes[shipsSizes.length - 1])

         siblings.forEach(pt => {
            document.getElementById(pt).classList.toggle('hovered')
         })
      }

      function placeShip(target) {
         const position = target.id;
         const orientation = document.getElementById('orientation').textContent;
         const size = shipsSizes[shipsSizes.length - 1]
         let siblings = checkDesignPossibility(position, orientation, size);
   
         if (siblings[0]) {
            siblings.forEach(pt => {
               document.getElementById(pt).classList.add('placed');
               availableIds = availableIds.filter(id => !ptsAround(pt).includes(id))
            })
            gamer.board.placeShip(shipsSizes.pop(), siblings)
         }
      }
   }

   function checkDesignPossibility(startId, orientation, size) {
      let siblings = [];
      for (let i = 0; i < size; i++) {
         if (orientation === 'Horizontal') {
            const siblingCol = String.fromCharCode(startId[0].charCodeAt() + i)
            const siblingRow = startId.slice(1)

            siblings[i] = siblingCol + siblingRow;
         }

         if (orientation === 'Vertical') {
            const siblingCol = startId[0]
            const siblingRow = Number(startId.slice(1)) + i

            siblings[i] = siblingCol + siblingRow;
         }

      }

      return siblings.reduce((prev, act) => prev && availableIds.includes(act), true) ? siblings : [];
   }
}






function ptsAround(pt) {
   let ptsList = [];
   let row = Number(pt.slice(1));
   let col = pt[0];
   let prevCol = String.fromCharCode(col.charCodeAt() - 1);
   let nextCol = String.fromCharCode(col.charCodeAt() + 1);

   let col1 = [prevCol + (row - 1), prevCol + row, prevCol + (row + 1)]
   let col2 = [`${col}${row - 1}`, pt, `${col}${row + 1}`];
   let col3 = [nextCol + (row - 1), nextCol + row, nextCol + (row + 1)]

   ptsList.push(...col1, ...col2, ...col3)

   return ptsList;
}

mainModule()

// Operational functions

// function buildPositions(coord) {
//    let array = [];
//    for (let i of coord) {
//       array.push({ position: i, isHit: false })
//    }
//    return array;
// }


function checkBuildPossibility(size, startCoord, orientation) {
   let board = buildBoard();

   let xy = [];
   if (orientation === 'H') {
      for (i = 0; i < size; i++) {
         xy.push(String.fromCharCode(startCoord[0].charCodeAt() + i) + startCoord[1])
      }
   } else if (orientation === 'V') {
      for (i = 0; i < size; i++) {
         xy.push(`${startCoord[0]}${Number(startCoord[1]) + i}`)
      }
   }

   let possibility = true;
   xy.forEach(couple => {
      if (!board.find(elem => elem.point === couple)) {
         possibility = false;
      }
   })

   return possibility;
}



// Checked

function designBoard(name, cellsIds) {
   const board = document.createElement('div');
   board.classList.add(name + '-grid');

   cellsIds.forEach(id => {
      const cell = document.createElement('button');
      cell.className = 'cell'
      cell.id = id;
      board.appendChild(cell)
   })
   return board;
}

