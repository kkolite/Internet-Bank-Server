import { WebSocketServer } from 'ws';

const set = new Set();
const clients = new Set();
export default function(){
  const wss = new WebSocketServer({ port: 8000 });

  wss.on('connection', function connection(ws, req) {
    const ip = req.socket.remoteAddress;
    set.add(ip);
    clients.add(ws);
    clients.forEach((el) => {
      el.send(set.size);
    });
    ws.on('error', console.error);

    ws.on('message', function message(data) {
      console.log(data);
      //set.add(data);
      //ws.send(set.size);
    });
  });
}
