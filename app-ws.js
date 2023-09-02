const Game = require('./game');
const WebSocket = require('ws');
const Player = require('./player');
let turn = true;
const fs = require('fs');
// Objeto para armazenar os pares de usuários
const rooms = {};
const game = new Game();
const roomPlayers = {
  player1: "",
  player2: ""
}
function onError(ws, err) {
  console.error(`onError: ${err.message}`);
}

function onMessage(id, sender, data) {
  const room = rooms[id];
  if (room) {
    room.forEach(connection => {
      if (connection.ws !== sender) {
        connection.ws.send(`${data}`);
      }
    });

    // Encontra o jogador que enviou a mensagem
    const player = room.find(connection => connection.ws === sender);
    if (player) {
      // Adiciona a jogada ao array de movimentos do jogador
      game.setJogadas(data, turn);
      player.setMoves(`${data}`);

    }
    const result = { result: false, moves: [], winner: player.ws.username }
    const gameResult = game.ganhou(player.getMoves());
    result.result = gameResult[0];
    result.moves = gameResult[1];
    if (result.result) {
      room.forEach(connection => {
        connection.ws.send(JSON.stringify(result));
      });
    } else if (result.result == false) {
      room.forEach(connection => {
        connection.ws.send(JSON.stringify(player.getMoves()));
      });
    }

  }
}

function onConnection(ws, req) {
  const { id, username } = parseQueryParams(req.url);

  if (!rooms[id]) {
    rooms[id] = [];
  }

  ws.username = username;

  const player = new Player(ws);

  if (rooms[id].length === 0) {
    // Este é o primeiro usuário na sala
    rooms[id].push(player);
    player.ws.on('message', data => {
      onMessage(id, player.ws, data);
    });
    roomPlayers.player1 = username;
    // Enviar uma mensagem para o primeiro usuário
    player.ws.send("inicia_o_jogo");

  } else {
    // Já existe um usuário na sala
    rooms[id].push(player);
    player.ws.on('message', data => {
      onMessage(id, player.ws, data);
    });
    roomPlayers.player2 = username;
    rooms[id].forEach(connection => {
      connection.ws.send(JSON.stringify(roomPlayers));
    });

  }

  if (rooms[id].length == 2) {
    ws.on('error', error => onError(ws, error));
  }
  ws.on('error', error => onError(ws, error));

  console.log(`User ${username} connected to room ${id}`);
}

module.exports = (httpServer) => {
  const wss = new WebSocket.Server({
    noServer: true // Usar a mesma instância do servidor HTTP
  });

  wss.on('connection', onConnection);

  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  console.log('App Web Socket Server is running!');
};

function parseQueryParams(url) {
  const queryParams = {};
  const queryString = url.split('?');
  queryString.shift()
  if (queryString) {
    for (let param of queryString) {
      const [key, value] = param.split('=');

      queryParams[key] = value;
    }
  }
  return queryParams;
}