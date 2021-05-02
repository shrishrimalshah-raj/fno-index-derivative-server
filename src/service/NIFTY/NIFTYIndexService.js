import Papa from 'papaparse';
const fs = require('fs');
const path = require('path');
import mongoose from 'mongoose';

const csvFilePath = path.join(__dirname, '../../constants/NIFTY/NIFTYINDEXDATA.csv');
import { RootRepository } from '../RootRepository';
import { NIFTYIndexModel } from '../../db/models'
import { convertArrayToNIFTYModelFormat } from '../../lib';

class NIFTYIndexService extends RootRepository {
  constructor(model) {
    super(model)
  }

  async InsertMany(results) {
    const newData = convertArrayToNIFTYModelFormat(results.data);
    try {
      const result = await RootRepository.insertMany(newData, NIFTYIndexModel);
      if(result) {
        console.log('!!! DATA SEEDED !!!');
      }
    } catch (error) {
      console.log('error ********', error)
    }
         
  }

  async seedData() {
    const result = await super.deleteMany();
    const countData = await super.countDocuments({});
    if (countData === 0) {
      const file = fs.createReadStream(csvFilePath);

      var csvData = [];
  
      Papa.parse(file, {
        header: true,
        complete: this.InsertMany,
      })
    }
    
  }
  async find() {
    const result = await super.find();
    return result;
  }
  
  async findLastRecord(days) {
    const result = await super.findLastRecord(days);
    const sortedData = result.sort((a, b) => a.date - b.date)
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

}

export default new NIFTYIndexService(NIFTYIndexModel);
