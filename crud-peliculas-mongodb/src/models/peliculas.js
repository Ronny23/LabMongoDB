const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PeliculasSchema = Schema({
  nombre: String,
  genero: String,
  franquicia: String,
  pais: String,
  anio: Number,
  duracion: Number,
  compania: String,
  actores: String
});

module.exports = mongoose.model('peliculas', PeliculasSchema);