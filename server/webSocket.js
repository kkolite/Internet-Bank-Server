import { WebSocketServer } from 'ws';
import stockController from './stock/stockController.js';

const set = new Set();
const clients = new Set();

export async function sendOnce(){
  const stocks = await stockController.updateStock();
  clients.forEach((el) => {
    el.send(JSON.stringify(stocks));
  });
}

export default function(){
  setInterval(async () => {
    const stocks = await stockController.updateStock();
    clients.forEach((el) => {
      el.send(JSON.stringify(stocks));
    });
  }, 7000)
  const wss = new WebSocketServer({ port: 8000 });

  wss.on('connection', async function connection(ws, req) {
    clients.add(ws);
    ws.on('close', () => {
      clients.delete(ws);
    })
  });
}
