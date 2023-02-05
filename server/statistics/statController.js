import getAll from "./getAll.js";
import getOne from "./getOne.js";

class StatController {
  async getStatistics(req,res) {
    try {
        const {operationID} = req.query;
        const result = operationID ? await getOne(operationID) : await getAll();
        return res
        .status(result.success ? 200 : 404)
        .json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Error!',
            success: false,
        });
    }
  }
}

export default new StatController();