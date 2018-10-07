const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompaniasSchema = Schema({
  nombre: String,
  anio: Number,
  web: String
});

module.exports = mongoose.model('companias', CompaniasSchema);