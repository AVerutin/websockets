const WebSocketsServer = new require ('ws');
const config = require ('config');

const wsport = config.get('port');
const wsServer = new WebSocketsServer.Server({port: wsport});

var clients = [];
wsServer.on ('connection', function(ws) {
    console.log('Connected on port %d', wsport);

    var id = clients.length;
    clients[id] = ws;
    console.log('Новое соединение #%d', id);
    clients[id].send('Welcome! Your ID is %d', id);
    
});

