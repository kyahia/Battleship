test('Busy Points', () => {
   let myBoard = buildBoard(5)
   let busyCells = busyBoardCells(['A1'], /[A-E][1-5]/);

   console.log(busyCells);

   expect(busyCells).toEqual(['A1', 'A2', 'B1', 'B2'])
})

function buildBoard(limit) {
   const bord = [];
   const horiz = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
   for (let j = 0; j < limit; j++) {
      for (let i = 1; i <= 5; i++) {
         bord.push({point: horiz[j]+i, isFree: true});
      }
   }
   return bord;
}

function busyBoardCells(coords, domain = /[A-E][1-5]/){
   let pts = [];
   coords.forEach(pt => {
      let col1 = [String.fromCharCode(pt[0].charCodeAt() - 1) + (Number(pt[1]) - 1),
                  String.fromCharCode(pt[0].charCodeAt() - 1) + pt[1],
                  String.fromCharCode(pt[0].charCodeAt() - 1) + (Number(pt[1]) + 1)
                  ]
      let col2 = [`${pt[0]}${Number(pt[1]) - 1}`, pt, `${pt[0]}${Number(pt[1]) + 1}`];
      let col3 = [String.fromCharCode(pt[0].charCodeAt() + 1) + (Number(pt[1]) - 1),
                  String.fromCharCode(pt[0].charCodeAt() + 1) + pt[1],
                  String.fromCharCode(pt[0].charCodeAt() + 1) + (Number(pt[1]) + 1)
                  ]
      
      pts.push(col1.concat(col2, col3));
   });

   return pts[0].filter(pt => domain.test(pt));
}
