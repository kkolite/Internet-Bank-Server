import Stock from '../models/stock.js';
import User from '../models/user.js';
import { COMMISSION, OPERATIONS_ACTION } from '../config.js';
import buyStonks from './utils/buyStonks.js';
import sellStonks from './utils/sellStonks.js';

class StockController {
  async getStocks() {
    const stocks = await Stock.find();
    return stocks;
  }

  async updateStock() {
    const stocks = await this.getStocks();
    stocks.forEach(async (el) => {
      const random = Math.random() * 10;
      el.money += (random > 4 ? random / 30 : -random / 30);
      await el.save();
    })
    return stocks;
  }

  async getUserStocks(username) {
    const user = await User.findOne({username});
    return user.stocks;
  }

  async getData(req, res) {
    try {
      const {user} = req;
      const userStocks = user.stocks;
      const stocks = await Stock.find();
      return res
      .status(200)
      .json({
        success: true,
        message: 'Success',
        stocks,
        userStocks
      })
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: 'Error!',
        success: false,
      })
    }
  }

  async changeStocks(req, res) {
    try {
      const {user} = req;
      const {number, stockName} = req.body;
      const {operation} = req.query;
      let result;
      if (operation === OPERATIONS_ACTION.ADD) {
        result = await buyStonks(user, stockName, number);
      }
      if (operation === OPERATIONS_ACTION.REMOVE) {
        result = await sellStonks(user, stockName, number);
      }

      if (!result) {
        return res
        .status(400)
        .json({
          success: false,
          message: 'Invalid body or query'
        })
      }

      return res
      .status(result.success ? 200 : 400)
      .json(result)
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: 'Error!',
        success: false,
      })
    }
  }
}

export default new StockController();
