const WebSocketsServer = new require ('ws');
const config = require ('config');

const wsport = config.get('port');
const wsServer = new WebSocketsServer.Server({port: wsport});

var clients = [];

wsServer.on('connection', function connection(ws) {
    console.log('Connected on port %d', wsport);
    var client = {};
    var id = clients.length;

    client.ID = id;
    client.Socket = ws;

    clients.push(client);

    console.log('Новое соединение #%d', id);
    // clients[id].send(`Welcome! Your ID is ${id}`);

    ws.on('message', function incoming(message) {
        var now = new Date().toDateString();
        var sndMessage = {};
        var rcvMessage = JSON.parse(message);
        sndMessage.login = rcvMessage.login;
        sndMessage.text = rcvMessage.text;
        sndMessage.date = now;
        var txtMessage = `Message from ${rcvMessage.login}: ${rcvMessage.text}`;
        console.log(txtMessage);
        // Рассылаем ссобщение всем клиентам
        for (let client of clients) {
            if(client.ID != id) { 
                client.Socket.send(JSON.stringify(sndMessage));
            }
        }
    });

    ws.on('close', function close() {
        console.log('Connection closed');
    })
});
