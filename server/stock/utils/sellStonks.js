import { bankKey, OPERATION_STOCK } from '../../config.js';
import Bank from '../../models/bank.js';
import Stock from '../../models/stock.js';
import User from '../../models/user.js';
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

  const userStock = user.stocks.find((el) => el.name === stockName);
  if (!userStock) {
    return {
      success: false,
      message: 'Not found stocks in user'
    }
  }
  user.stocks.splice(user.stocks.indexOf(userStock), 1);

  if (number > userStock.number) {
    return {
      success: false,
      message: 'Not enough stocks'
    }
  }

  userStock.number -= number;
  let newStocks = [...user.stocks];
  if (userStock.number !== 0) {
    newStocks.push(userStock);
  }

  const price = number * stock.money;

  const bank = await Bank.findOne({name: bankKey});
  const newBankMoney = bank.money - price;
  await Bank.updateOne({name: bankKey}, {
    money: newBankMoney
  })
  
  const newMoney = user.money + price;
  await User.updateOne({username: user.username}, {
    money: newMoney,
    stocks: newStocks
  })

  const newNumber = stock.number + number;
  await Stock.updateOne({name: stockName}, {
    number: newNumber
  })

  await update(OPERATION_STOCK.SELL, price);
  await updateLastFive(user.username, OPERATION_STOCK.SELL, price);

  return {
    success: true,
    message: 'Success'
  }
}
