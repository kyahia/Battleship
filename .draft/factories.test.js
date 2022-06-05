const factories = require('./factories')

// Ships tests
const testShip1 = factories.Ship(1, ['A2']);
const testShip2 = factories.Ship(3, ['A1', 'B1', 'C1']);

test('Ship initialize', () => {
   expect(testShip1.getLength()).toEqual(1);
   expect(testShip2.getLength()).toBe(3);
})

test('Ship Hit', () => {
   expect(testShip1.isSunk()).toBe(false);
   testShip1.hit('A2');
   expect(testShip1.isSunk()).toBe(true);
   testShip2.hit('A1'); testShip2.hit('B1'); 
   expect(testShip2.isSunk()).toBe(false);
   testShip2.hit('C1'); 
   expect(testShip2.isSunk()).toBe(true);
})

// Board tests

const testboard1 = factories.GameBoard();

test('Gameboard int', () => {
   testboard1.placeShip(1, ['A1']);
   testboard1.placeShip(2, ['E1', 'E2']);
   testboard1.placeShip(3, ['C1','C2','C3']);
})

test('Gameboard action', () => {
   expect(testboard1.missedAttacks).toEqual([])
   testboard1.receiveAttack('B1');
   testboard1.receiveAttack('A1');
   expect(testboard1.missedAttacks).toEqual(['B1']);
   testboard1.receiveAttack('E1');
   testboard1.receiveAttack('E2');
   expect(testboard1.missedAttacks).toEqual(['B1']);
   expect(testboard1.hasLost()).toBe(false);
})

test('Game over', () => {
   const testLoser = factories.GameBoard('LosingPlayer');
   testLoser.placeShip(1, ['A1'])
   testLoser.placeShip(2, ['C1', 'C2'])
   testLoser.receiveAttack('A1');testLoser.receiveAttack('C1');testLoser.receiveAttack('C2');
   expect(testLoser.hasLost()).toBe(true);
})
