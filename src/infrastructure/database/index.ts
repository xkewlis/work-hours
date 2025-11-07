import { WorkDaySequelize, WorkMarkSequelize } from "./models";

// Definir las relaciones
WorkDaySequelize.hasMany(WorkMarkSequelize, {
  foreignKey: 'workDayId',
  as: 'workMarks'
});

WorkMarkSequelize.belongsTo(WorkDaySequelize, {
  foreignKey: 'workDayId',
  as: 'workDay'
});