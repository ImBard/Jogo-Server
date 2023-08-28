const Game = require('./game');
const WebSocket = require('ws');
const Player = require('./player');
let turn = true;
// Objeto para armazenar os pares de usuários
const rooms = {};
const game = new Game();

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
    console.log(data);
    if (player) {
      // Adiciona a jogada ao array de movimentos do jogador
      game.setJogadas(data, turn);
      player.setMoves(data);
      // console.log(`${player.player.username}'s moves: ${player.moves}`);
    }
    console.log('getMOVES');
    console.log(player.getMoves());

    // const result = game.ganhou(`${player.moves}`);
    // if (result[0]) {
    //   room.forEach(connection => {
    //     connection.player.send(JSON.stringify(result));
    //   });
    // } else if (result[0] == false){
    //   room.forEach(connection => {
    //     connection.player.send(JSON.stringify(result));
    //   });
    // }

  }
}

function onConnection(ws, req) {
  const { id, username } = parseQueryParams(req.url);

  if (!rooms[id]) {
    rooms[id] = [];
  }

  ws.username = username;

  const player = new Player(ws);

  rooms[id].push(player);

  player.ws.on('message', data => {
    onMessage(id, player.ws, data);
  });

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
  console.log(queryString);
  if (queryString) {
    for (let param of queryString) {
      const [key, value] = param.split('=');

      queryParams[key] = value;
    }
  }
  return queryParams;
}