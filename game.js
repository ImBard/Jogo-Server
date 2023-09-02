class Game {
  constructor() {
    this.possibilities = [
      ['a1', 'a2', 'a3'],
      ['b1', 'b2', 'b3'],
      ['c1', 'c2', 'c3'],
      ['a1', 'b1', 'c1'],
      ['a2', 'b2', 'c2'],
      ['a3', 'b3', 'c3'],
      ['a1', 'b2', 'c3'],
      ['a3', 'b2', 'c1'],
    ]

    this.p1 = [];
    this.p2 = [];
  }


  ganhou(jogadas) {
    let result =[];

    for (let possibility of this.possibilities) {
      let c = 0;
      jogadas.map((item) => {
        if (possibility.includes(item)) c++;
      })
      if (c == 3) {
        // return finish(possibility);
        result = [true, possibility];
      }
    }

    if (this.p1.length + this.p2.length == 9) {
      result = [false, 'Deu velha!'];
    }
    return result; // Teve ganhador ou empatou

  }

  setJogadas(jogada, player) {
    if (player) {
      this.p1.push(jogada);
    } else {
      this.p2.push(jogada);
    }
  }

}

module.exports = Game;