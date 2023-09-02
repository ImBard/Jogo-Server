class Player {
  constructor(ws) {
    this.ws = ws
    this.moves = [];
  }

  setMoves(move) {
    this.moves.push(move);
  }

  getMoves() {
    return this.moves;
  }
}

module.exports = Player;