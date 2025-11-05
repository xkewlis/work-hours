import {FindOptions, Model, Sequelize} from "sequelize";
import {config} from "./config";
import moment from "moment";


const sequelize = new Sequelize(config)
sequelize.addHook('afterFind', (result: Model<any, any> | Model<any, any>[] | null, _options: FindOptions) => {
  const formatDates = (record: Model<any, any>) => {
    const data = record.dataValues;
    for (const key in data) {
      if (data[key] instanceof Date) {        
        data[key] = moment(data[key]).format('DD/MM/YYYY');
      }
    }
  };

  if (Array.isArray(result)) {
    result.forEach(record => {
      if (record) formatDates(record);
    });
  } else if (result) {
    formatDates(result);
  }
});


export default sequelize;