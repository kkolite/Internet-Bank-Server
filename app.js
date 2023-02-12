import express from 'express';
const app = express();
import cors from 'cors';
import mng from 'mongoose';
import bp from 'body-parser';
import userRouter from './server/user/userRouter.js';
import moneyRouter from './server/money/moneyRouter.js';
import adminRouter from './server/admin/adminRouter.js';
import quizRouter from './server/quiz/quizRouter.js';
import webSocket from './server/webSocket.js';
import statRouter from './server/statistics/statRouter.js';
import adminCheck from './server/admin/utils/adminCheck.js';
import actionRouter from './server/user/actionRouter.js';
import userCheck from './server/user/utils/userCheck.js';
import moneySecureRouter from './server/money/moneySecureRouter.js';
import stockRouter from './server/stock/stockRouter.js';

const { set, connect } = mng;
const { json } = bp;

const port = process.env.PORT || 3000;
const MONGO_URL = `mongodb://qwerty:9Ij62MhBMOLIoZQ5@ac-ek4wj69-shard-00-00.jmt0gmm.mongodb.net:27017,ac-ek4wj69-shard-00-01.jmt0gmm.mongodb.net:27017,ac-ek4wj69-shard-00-02.jmt0gmm.mongodb.net:27017/?ssl=true&replicaSet=atlas-12rcvp-shard-0&authSource=admin&retryWrites=true&w=majority`

app.use(json());
app.use(cors());
app.use('/action', actionRouter);
app.use('/user', userCheck, userRouter);
app.use('/securemoney', userCheck, moneySecureRouter);
app.use('/money', moneyRouter);
app.use('/admin', adminCheck, adminRouter);
app.use('/quiz', quizRouter);
app.use('/statistics', statRouter);
app.use('/stocks', userCheck, stockRouter);

async function start() {
	try {
		set('strictQuery', true);
		await connect(MONGO_URL);
		const server = app.listen(port, function () {
			console.log(`Server listens ${port}`);
		});
		webSocket(server);
	} catch (error) {
		console.log(error);
	}
}

start();
