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

router.post('/consultaB', async (req, res, next) => {
  const tituloFranquicia = req.body.franquicia;
  const consultaB = await DBPeliculas.find({ franquicia: tituloFranquicia });
  res.render('consultaB', { consultaB });
});

router.post('/consultaC', async (req, res, next) => {
  const rangoUno= req.body.primerRango;
  const rangoDos = req.body.segundoRango;
  const consultaC = await DBPeliculas.find({ anio: { $gte: rangoUno, $lte: rangoDos } });
  console.log(consultaC);
  res.render('consultaC', { consultaC });
});

router.post('/consultaD', async (req, res, next) => {
  const Productora = req.body.productora;
  const consultaD = await DBPeliculas.find({ compania: Productora });
  res.render('consultaD', { consultaD });
});

router.post('/consultaE', async (req, res, next) => {
  const Productora = req.body.productora;
  const consultaEuno = await DBPeliculas.find({ compania: Productora });
  //var findQuerymin = DBPeliculas.find({ compania: Productora }).sort({duracion : 1}).limit(1);
  //var findQuerymax = DBPeliculas.find({ compania: Productora }).sort({duracion : -1}).limit(1);
  var consulta = DBPeliculas.aggregate([{$group:{ _id: "$compania", minResult:{$min:"$duracion"} , maxResult:{$max:"$duracion"},promedio:{$avg:"$duracion"}}}])

  function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

  consulta.exec(function(err, Result) {
    if (err) {return err;}
    var valProdAggregate = getObjects(Result, '_id', Productora); //se obtiene un json con los valores de la productora apartir de lo generado en el aggregate
    var valMin = valProdAggregate[0].minResult; // se obtiene la duracion minima 
    var valMax = valProdAggregate[0].maxResult; // se obtiene la duracion maxima 
    var valAvg = valProdAggregate[0].promedio; // se obtiene el promedio
    var minResult = getObjects(consultaEuno, 'duracion',valMin); // se obtiene toda la informacion del json que tenga el valMin
    var maxResult = getObjects(consultaEuno, 'duracion',valMax); // se obtiene toda la informacion del json que tenga el valMax
    
    res.render('consultaE', { consultaEuno, minResult, maxResult, valAvg});
  

  });

  /*findQuerymin.exec(function(err, minResult) {
    if (err) {return err;}

    findQuerymax.exec(function(err, maxResult) {
      if (err) {return err;}
  
      console.log(minResult);
      console.log("Hola");
      console.log(maxResult);
      res.render('consultaE', { consultaEuno, minResult, maxResult});
  
    });*/

   

});


module.exports = router;