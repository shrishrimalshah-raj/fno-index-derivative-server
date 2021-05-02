import Papa from "papaparse";
const fs = require("fs");
const path = require("path");
import mongoose from "mongoose";
import * as https from "https";
import StringStream from "scramjet";
import request from "request";
import fetch from "node-fetch";
import axios from "axios";

const csvFilePath = path.join(__dirname, "../../constants/FII/FIIALLDATA.csv");
// const csvFilePath = path.join(__dirname, '../../constants/FII/FIIINDEXDATA.csv');
import { RootRepository } from "../RootRepository";
import {
  FIIIndexModel,
  FIIFutureModel,
  FIICallModel,
  FIIPutModel,
  CLIENTIndexModel,
  CLIENTFutureModel,
  CLIENTCallModel,
  CLIENTPutModel,
  PROIndexModel,
  PROFutureModel,
  PROCallModel,
  PROPutModel,
} from "../../db/models";

import { convertArrayToFIIModelFormat } from "../../lib";

import {
  CLIENTIndexService,
  CLIENTFutureService,
  CLIENTCallService,
  CLIENTPutService,
} from "./Seed/Client";

import {
  PROIndexService,
  PROFutureService,
  PROCallService,
  PROPutService,
} from "./Seed/PRO";

import {
  FIIndexService,
  FIIFutureService,
  FIICallService,
  FIIPutService,
} from "./Seed/FII";

class FIIIndexService extends RootRepository {
  constructor(model) {
    super(model);
  }

  // async InsertMany(results) {
  //   const {
  //     fiiIndexData,
  //     fiiFutureData,
  //     fiiCallData,
  //     fiiPutData,
  //   } = convertArrayToFIIModelFormat(results.data);
  //   try {
  //     // INSERT MANY ==> SEED DATA FOR FII
  //     await RootRepository.insertMany(fiiIndexData, FIIIndexModel);
  //     await RootRepository.insertMany(fiiFutureData, FIIFutureModel);
  //     await RootRepository.insertMany(fiiCallData, FIICallModel);
  //     let result = await RootRepository.insertMany(fiiPutData, FIIPutModel);

  //     if (result) {
  //       console.log("!!! DATA SEEDED !!!");
  //     }
  //   } catch (error) {
  //     console.log("error ********", error);
  //   }
  // }

  // async seedData() {
  //   //  DELETE MANY ===> DELETE DATA FOR FII
  //   await FIIIndexModel.deleteMany();
  //   await FIIFutureModel.deleteMany();
  //   await FIICallModel.deleteMany();
  //   await FIIPutModel.deleteMany();

  //   const countData = await super.countDocuments({});
  //   if (countData === 0) {
  //     const file = fs.createReadStream(csvFilePath);

  //     var csvData = [];

  //     Papa.parse(file, {
  //       header: true,
  //       complete: this.InsertMany,
  //     });
  //   }
  // }

  async find() {
    const result = await super.find();
    return result;
  }

  async findLastRecord(days) {
    const result = await super.findLastRecord(days);
    const sortedData = result.sort((a, b) => a.date - b.date);
    return sortedData;
  }

  async create(item) {
    const result = await super.create(item);
    return result;
  }

  async findByDate(cond) {
    const result = await super.findByDate(cond);
    return result;
  }

  async deleteAllRecords() {
    // DELETE MANY ===> DELETE DATA FOR client
    await CLIENTIndexModel.deleteMany();
    await CLIENTFutureModel.deleteMany();
    await CLIENTCallModel.deleteMany();
    await CLIENTPutModel.deleteMany();
    // DELETE MANY ===> DELETE DATA FOR PRO
    await PROIndexModel.deleteMany();
    await PROFutureModel.deleteMany();
    await PROCallModel.deleteMany();
    await PROPutModel.deleteMany();
    // DELETE MANY ===> DELETE DATA FOR FII
    await FIIIndexModel.deleteMany();
    await FIIFutureModel.deleteMany();
    await FIICallModel.deleteMany();
    await FIIPutModel.deleteMany();
    console.log("executed");
    const res = await PROPutModel.find({}).sort({ date: -1 }).limit(71);
    res.forEach(async (doc) => {
      await PROPutModel.deleteOne({ _id: doc._id });
    });
  }

  async seedData() {
    // var destinationFile = path.join(__dirname, "./yourdestination.csv");

    // await this.deleteAllRecords();

    const dates = [
      // "02112020",
      // "03112020",
      // "04112020",
      // "05112020",
      // "06112020",
      // "09112020",
      // "10112020",
      // "11112020",
      // "12112020",
      // "13112020",
      // "17112020",
      //  "18112020",
      //  "19112020",
      //  "20112020",
      // "01022021",
      // "02022021",
      // "03022021",
      // "04022021",
      // "05022021",
      // "08022021",
      // "09022021"
      // "10022021"
      // "11022021",
      // "12022021",
      // "15022021",
      // "16022021",
      // "17022021",
      // "18022021",
      // "19022021",
      // "22022021",
      // "23022021",
      // "24022021"
      // "25022021",
      // "26022021",
      // "01032021",
      // "02032021",
      // "03032021",
      // "04032021",
      // "05032021",
      // "08032021",
      // "09032021",
      // "10032021",
      // "12032021",
      // "15032021",
      // "16032021",
      // "17032021",
      // "18032021",
      // "19032021",
      // "22032021",
      // "23032021",
      // "24032021",
      // "25032021",
      // "26032021",
      // "30032021",
      // "31032021",
      // "01042021",
      // "05042021",
      // "06042021",
      // "07042021",
      // "08042021",
      // "09042021",
      // "12042021",
      // "13042021",
      // "15042021",
      // "16042021",
      // "19042021",
      // "20042021",
      // "22042021",
      // "23042021",
      "26042021",






















    ];

    await dates.reduce(async (memo, date, i) => {
      await memo;
      var destinationFile = path.join(__dirname, `${date}.csv`);

      try {
        const fileUrl = `https://www1.nseindia.com/content/nsccl/fao_participant_oi_${date}.csv`;
        const res = await axios.get(fileUrl, {
          responseType: "stream",
        });

        /**
         * OVERWRITE NEW DATA TO destinationFile
         */
        await this.httpResponseToFile(res, destinationFile);
        const data = await this.convertFileTOData(destinationFile);
        await this.seedDataIntoDB(data, date);
        // fs.unlinkSync(destinationFile)
      } catch (error) {
        console.log("ERROR **********", error);
      }
    }, undefined);
  }

  async seedDataIntoDB(data, date) {
    // console.log('seedDataIntoDB executed')
    // CLIENT SERVICE
    console.log(`******* CLIENT SERVICE ${date} *********`);
    await CLIENTIndexService.insertDataForClientIndex(data, date);
    await CLIENTFutureService.insertDataForClientFuture(data, date);
    await CLIENTCallService.insertDataForClientCall(data, date);
    await CLIENTPutService.insertDataForClientPut(data, date);
    // PRO SERVICE
    console.log(`******* PRO SERVICE ${date} *********`);
    await PROIndexService.insertDataForProIndex(data, date);
    await PROFutureService.insertDataForProFuture(data, date);
    await PROCallService.insertDataForProCall(data, date);
    await PROPutService.insertDataForProPut(data, date);
    // FII SERVICE
    console.log(`******* FII SERVICE ${date} *********`);
    await FIIndexService.insertDataForFiiIndex(data, date);
    await FIIFutureService.insertDataForFiiFuture(data, date);
    await FIICallService.insertDataForFiiCall(data, date);
    await FIIPutService.insertDataForFiiPut(data, date);
  }

  async convertFileTOData(fileCSV) {
    let file = fs.readFileSync(fileCSV, "utf8").toString().split("\n");
    file.shift();
    file.pop();
    file = file.join("\n");

    let data;
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          data = results.data;
        },
      });
      resolve(data);
    });
  }

  async httpResponseToFile(response, destination) {
    const writer = fs.createWriteStream(destination);

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on("close", () => {
        if (!error) {
          resolve(true);
        }
      });
    });
  }
}

export default new FIIIndexService(FIIIndexModel);
