const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending',
  },
}, {
  indexes: [
    { unique: true, fields: ['id'] }, // Primary Key Index
    { fields: ['status'] }, // Index on status for filtering
    { fields: ['title'] } // Optional index for searching
  ]
});

(async () => {
  await sequelize.sync();
})();

module.exports = Task;