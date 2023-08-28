const app = require('./app');
const createWebSocketServer = require('./app-ws'); // Importar a função que cria o servidor WebSocket

const httpServer = app.listen(process.env.PORT || 3000, () => {
  console.log('App Express is running');
});

createWebSocketServer(httpServer); // Passar a instância do servidor HTTP