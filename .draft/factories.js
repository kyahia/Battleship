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

   let ships = [];
   let missedAttacks = []; // done

   const placeShip = (size, coordinates) => {
      let newShip = {};
      newShip['ship'] = Ship(size, coordinates)
      newShip['pts'] = coordinates;
      ships.push(newShip);
   }

   const receiveAttack = coordinate => {
      let damagedShip = ships.find(ship => ship.pts.find(pt => pt === coordinate))

      if (damagedShip) {
         damagedShip.ship.hit(coordinate);
         return 'success';
      } else {
         missedAttacks.push(coordinate)
         return 'miss';
      }
   }

   const hasLost = () => ships.reduce((prev, act) => prev && act.ship.isSunk(), true);

   return { missedAttacks, receiveAttack, placeShip, hasLost }
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

module.exports = { Ship, GameBoard, Player }
