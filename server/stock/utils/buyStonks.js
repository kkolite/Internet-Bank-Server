import Stock from '../../models/stock.js';
import User from '../../models/user.js';
import Bank from '../../models/bank.js';
import { bankKey, OPERATION_STOCK } from '../../config.js';
import update from '../../statistics/update.js';
import updateLastFive from '../../statistics/updateLastFive.js';

export default async function(user, stockName, number) {
  const stock = await Stock.findOne({name: stockName});
  if (!stock) {
    return {
      success: false,
      message: 'Not found stocks'
    }
  }
  if (number > stock.number) {
    return {
      success: false,
      message: 'Not enough stocks'
    }
  }

  const price = number * stock.money;
  if (price > user.money) {
    return {
      success: false,
      message: 'Not enough money'
    }
  }

  let prevNumber = 0;
  let prevPrice = 0;
  const index = user.stocks.findIndex((el) => el.name === stockName);
  if (index !== -1) {
    prevNumber = user.stocks[index].number;
    prevPrice = user.stocks[index].price;
    user.stocks.splice(index, 1);
  }

  const newStocks = [...user.stocks, {
    name: stockName,
    number: number + prevNumber,
    price: ((stock.money * number) + (prevPrice * prevNumber)) / (number + prevNumber)
  }];

  const bank = await Bank.findOne({name: bankKey});
  const newBankMoney = bank.money + price;
  await Bank.updateOne({name: bankKey}, {
    money: newBankMoney
  })

  const newMoney = user.money - price;
  await User.updateOne({username: user.username}, {
    money: newMoney,
    stocks: newStocks
  })

  const newNumber = stock.number - number;
  await Stock.updateOne({name: stockName}, {
    number: newNumber
  })

  await update(OPERATION_STOCK.BUY, price);
  await updateLastFive(user.username, OPERATION_STOCK.BUY, price);

  return {
    success: true,
    message: 'Success'
  }
}
