import { WebSocketServer } from 'ws';
import stockController from './stock/stockController.js';
import express from 'express';

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

  const wss = new WebSocketServer({server: server});

  wss.on('connection', async function connection(ws, req) {
    clients.add(ws);
    console.log('WS conn', clients);
    ws.on('close', () => {
      clients.delete(ws);
      console.log('WS Close', clients);
    })
  });
}
