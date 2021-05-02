import { PROFutureService } from "../../../service";
import mongoose from 'mongoose';
import moment from 'moment';

class PROFutureController {
  async findLastRecord(req, res) {
    const { days } = req.params;
    try {
      const data = await PROFutureService.findLastRecord(parseInt(days));
      return res.status(200).json({ message: "Data fetch successfully", data })
    } catch (error) {
      return res.status(500).json({ "error": error })
    }
  }

  async find(req, res) {
    try {
      const data = await PROFutureService.find()
      return res.status(200).json({ message: "Data fetch successfully", data })
    } catch (error) {
      return res.status(500).json({ "error": error })
    }
  }

  async findByDate(req, res) {
    let { startDate, endDate } = req.query;

    const conditions = {
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }

    try {
      const data = await PROFutureService.findByDate(conditions)
      return res.status(200).json({ message: "Data fetch successfully", data })
    } catch (error) {
      return res.status(500).json({ "error": error })
    }
  }


  async create(req, res) {
    let { date, longPosition, shortPosition, netBuy } = req.body
    date = date ? new Date(date) : new Date(); 
    longPosition = parseInt(longPosition);
    shortPosition = parseInt(shortPosition);
    netBuy = parseInt(netBuy);

    try {
      const lastRecord = await PROFutureService.findLastRecord(1);
      const newObject = {
        date: moment(date.toISOString()).add(1, 'days').utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        longPosition: parseInt(longPosition),
        shortPosition: parseInt(shortPosition),
        netBuy: parseInt(netBuy),
        dailyLongPosition: longPosition - lastRecord[0]["longPosition"],
        dailyShortPosition: shortPosition - lastRecord[0]["shortPosition"],
        dailyLongPercentage: Number((longPosition / (longPosition + shortPosition)).toFixed(2)),
        dailyShortPercentage: Number((shortPosition / (longPosition + shortPosition)).toFixed(2)),
        originalId: mongoose.Types.ObjectId(),
        createdAt: new Date(),
      }

      const data = await PROFutureService.create(newObject)
      return res.status(201).json({ message: "New record created", data });

    } catch (error) {
      return res.status(500).json({ "error": error })
    }
  }
}

export default new PROFutureController();