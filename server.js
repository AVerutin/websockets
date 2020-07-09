const WebSocketsServer = new require ('ws');
const config = require ('config');

const wsport = config.get('port');
const wsServer = new WebSocketsServer.Server({port: wsport});

var clients = [];

/* TODO: 
    1) Сделать авторизацию пользователей в отдельном окне и сохранять их имена в привязке к сессии
    2) Сохранять последние 10 сообщений и присылать их всем вновь подключившимся
*/

wsServer.on('connection', function connection(ws) {
    console.log('Connected on port %d', wsport);
    var client = {};
    var id = clients.length;

    client.ID = id;
    client.Socket = ws;
    client.Connected = true;
    client.Status = 'Online';
    client.LastConnected = new Date().toLocaleString();

    clients.push(client);

    console.log('Новое соединение #%d', id);

    ws.on('message', function incoming(message) {
        var now = new Date().toDateString();
        var sndMessage = {};
        var rcvMessage = JSON.parse(message);
        sndMessage.login = rcvMessage.login;
        sndMessage.text = rcvMessage.text;
        sndMessage.date = now;
        // Рассылаем ссобщение всем клиентам
        for (let client of clients) {
            if(client.ID != id) { 
                client.Socket.send(JSON.stringify(sndMessage));
            }
        }
    });

    ws.on('close', function close() {
        msg = `${client.login} was disconnected`;
        console.log(msg);
        for (client of clients) {
            if (client.ID != id) {
                client.Socket.send(msg);
            }
        }
    })
});
