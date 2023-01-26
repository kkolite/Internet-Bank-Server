// Роли - юзер, админ, блок
// Регистрация, логин, получение данных (проверка по токену), обновление данных, удаление счета
// Удалять, блокировать юзеров, изменять их счет 
// 9Ij62MhBMOLIoZQ5

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./router');

const port = process.env.PORT || 3000;
const MONGO_URL = `mongodb://qwerty:9Ij62MhBMOLIoZQ5@ac-ek4wj69-shard-00-00.jmt0gmm.mongodb.net:27017,ac-ek4wj69-shard-00-01.jmt0gmm.mongodb.net:27017,ac-ek4wj69-shard-00-02.jmt0gmm.mongodb.net:27017/?ssl=true&replicaSet=atlas-12rcvp-shard-0&authSource=admin&retryWrites=true&w=majority`

app.use(bodyParser.json());
app.use(cors());
app.use('/user', router);

async function start() {
	try {
		mongoose.set('strictQuery', true);
		await mongoose.connect(MONGO_URL);
		app.listen(port, function () {
			console.log(`Server listens ${port}`);
		});
	} catch (error) {
		console.log(error);
	}
}

start();
/*app.post('/main', (req, res) => {
	console.log(req.body.name);
	if (req.body.name === 'Yahor') {
		return res
	.status(200)
	.json({
		name: 'Yahor',
		number: 5,
		info: 'Ratata'
	})
	} else {
		return res
		.status(200)
		.json({
			name: 'Gujob'
		})
	}
})

app.listen(port, function () {
	console.log(`Server listens ${port}`);
});*/