import { WebSocketServer } from 'ws';
import stockController from './stock/stockController.js';

const set = new Set();
const clients = new Set();
export default function(){
  setInterval(async () => {
    const stocks = await stockController.updateStock();
    clients.forEach((el) => {
      el.send(JSON.stringify(stocks));
    });
  }, 7000)
  const wss = new WebSocketServer({ port: 8000 });

  wss.on('connection', async function connection(ws, req) {
    /*const ip = req.socket.remoteAddress;
    set.add(ip);
    clients.add(ws);
    clients.forEach((el) => {
      el.send(set.size);
    });
    ws.on('error', console.error);

    ws.on('message', function message(data) {
      console.log(data);
    });*/

    clients.add(ws);
    ws.onclose(() => {
      clients.delete(ws)
    })
  });
}
