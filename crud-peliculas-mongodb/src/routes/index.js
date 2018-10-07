const express = require('express');
const router = express.Router();
const DBPeliculas = require('../models/peliculas');
const DBCompanias = require('../models/companias');

// rutas para peliculas
router.get('/', async (req, res) => {
  const peliculas = await DBPeliculas.find();
  res.render('index', { 
    peliculas
  });
});

router.post('/add', async (req, res, next) => {
  const newpelicula = new DBPeliculas(req.body);
  await newpelicula.save();
  res.redirect('/');
});

router.get('/edit/:id', async (req, res, next) => {
  const peliculas = await DBPeliculas.findById(req.params.id);
  res.render('edit', { peliculas });
});

router.post('/edit/:id', async (req, res, next) => {
  const { id } = req.params;
  await DBPeliculas.update({_id: id}, req.body);
  res.redirect('/');
});

router.get('/delete/:id', async (req, res, next) => {
  let { id } = req.params;
  await DBPeliculas.remove({_id: id});
  res.redirect('/');
});




// rutas para compañias
router.get('/compania', async (req, res) => {
  const companias = await DBCompanias.find();
  res.render('companias', { 
    companias
  });
});

router.post('/compania/add', async (req, res, next) => {
  const newcompania = new DBCompanias(req.body);
  await newcompania.save();
  res.redirect('/compania');
});

router.get('/compania/edit/:id', async (req, res, next) => {
  const companias = await DBCompanias.findById(req.params.id);
  res.render('editCompania', { companias });
});

router.post('/compania/edit/:id', async (req, res, next) => {
  const { id } = req.params;
  await DBCompanias.update({_id: id}, req.body);
  res.redirect('/compania');
});

router.get('/compania/delete/:id', async (req, res, next) => {
  let { id } = req.params;
  await DBCompanias.remove({_id: id});
  res.redirect('/compania');
});


// rutas para las consultas
// rutas para compañias
router.get('/consultas', async (req, res) => {
  res.render('consultas');
});

router.post('/consultaA', async (req, res, next) => {
  const titulo = req.body.nombre;
  const consultaA = await DBPeliculas.find({ nombre: titulo });
  res.render('consultaA', { consultaA });
});

/*router.post('/consultaB', async (req, res, next) => {
  const titulo = req.body.nombre;
  const consultaA = await DBPeliculas.find({ nombre: titulo });
  res.render('consultaA', { consultaA });
});*/

router.post('/consultaC', async (req, res, next) => {
  const rangoUno= req.body.primerRango;
  const rangoDos = req.body.segundoRango;
  const consultaC = await DBPeliculas.find({ anio: { $gte: rangoUno, $lte: rangoDos } });
  console.log(consultaC);
  res.render('consultaC', { consultaC });
});


module.exports = router;