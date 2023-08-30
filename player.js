class Player {
  constructor(ws) {
    this.ws = ws
    this.moves = [];
  }

  setMoves(move) {
    this.moves.push(move);
  }

  getMoves() {
    // console.log(this.moves)
    // console.log(typeof(this.moves))
    return this.moves;
  }
}

module.exports = Player;