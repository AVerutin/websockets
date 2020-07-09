const WebSocketsServer = new require ('ws');
const { Pool } = require('pg');
const config = require ('config');

const wsport = config.get('port');
const wsServer = new WebSocketsServer.Server({port: wsport});

const Clients = {
    sqlInsertClient: "INSERT INTO clients (login, password, last_login) VALUES ($1, $2, $3);",
    sqlUpdateClientInfo: "UPDATE TABLE clients SET login=$1, password=$2, last_login=$3 WHERE id=$4;",
    sqlUpdateLastLogin: "UPDATE TABLE clients SET last_login=$1 WHERE id=$2;",

    db: new Pool(config.get("dbConfig")),
    result: null,

    addClient: async function(login, pwd) {
        // Добавление нового клиента
        const login_date = new Date();
        try {
            result = await this.db.query(this.sqlInsertClient, login, pwd, login_date);
        } catch (err) {
            console.log('DB Error: ', err.message);
        }
    }
}


var online = [];

/* TODO: 
    1) Сделать авторизацию пользователей в отдельном окне и сохранять их имена в привязке к сессии
    2) Сохранять последние 10 сообщений и присылать их всем вновь подключившимся
*/

wsServer.on('connection', function connection(ws) {
    console.log('Connected on port %d', wsport);
    var client = {};
    var id = online.length;

    client.ID = id;
    client.Socket = ws;
    client.Connected = true;
    client.Status = 'Online';
    client.LastConnected = new Date().toLocaleString();

    online.push(client);

    console.log('Новое соединение #%d', id);

    ws.on('message', function incoming(message) {
        var now = new Date().toDateString();
        var sndMessage = {};
        var rcvMessage = JSON.parse(message);
        sndMessage.login = rcvMessage.login;
        sndMessage.text = rcvMessage.text;
        sndMessage.date = now;
        // Рассылаем ссобщение всем клиентам
        for (let client of online) {
            if(client.ID != id) { 
                client.Socket.send(JSON.stringify(sndMessage));
            }
        }
    });

    ws.on('close', function close() {
        msg = `${client.login} was disconnected`;
        console.log(msg);
        for (client of online) {
            if (client.ID != id) {
                client.Socket.send(msg);
            }
        }
    })
});
