import { WebSocketServer } from 'ws';
import stockController from './stock/stockController.js';
import express from 'express';

const app = express();
const set = new Set();
const clients = new Set();

export async function sendOnce(){
  const stocks = await stockController.updateStock();
  clients.forEach((el) => {
    el.send(JSON.stringify(stocks));
  });
}

export default function(server){
  setInterval(async () => {
    const stocks = await stockController.updateStock();
    clients.forEach((el) => {
      el.send(JSON.stringify(stocks));
    });
  }, 7000)

  //const server = app.listen(8000, () => console.log(`Listening on 8000`));
  const wss = new WebSocketServer({server: server});

  wss.on('connection', async function connection(ws, req) {
    console.log('WS conn');
    clients.add(ws);
    ws.on('close', () => {
      clients.delete(ws);
    })
  });
}
