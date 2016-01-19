var express = require('express');
var router = express.Router();
var multer  = require('multer');

var tracks_dir = process.env.TRACKS_DIR || './media/';
//Controlador canciones
var trackController = require('../controllers/track_controller');
//Controlador sesiones
var sessionController = require('../controllers/session_controller');
//Controlador de usuarios
var userController = require('../controllers/user_controller');
//Controlador de listas
var favController = require('../controllers/fav_controller');

//GET /
router.get('/', function(req, res) {
  res.render('index', {errors:[]});
});

router.param('trackId', trackController.load);
router.param('userId', userController.load); //autoload :userId


//Rutas de sesiones
//GET /login
router.get('/login', sessionController.new);
//POST /login
router.post('/login', sessionController.create);
//GET /logout
router.get('/logout', sessionController.destroy);


//Rutas de cuentas
router.get('/user', userController.new); //Sign in
router.post('/user', userController.create); //registrar usuario
router.get('/user/:userId(\\d+)/edit', sessionController.loginRequired, userController.ownershipRequired, userController.edit); //editar usuario
router.put('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.update);
router.delete('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.destroy); //eliminar usuario
router.get('/user/:userId(\\d+)/tracks',sessionController.loginRequired, trackController.index);
//Rutas de canciones

router.get('/tracks', trackController.list);

router.get('/tracks/new', sessionController.loginRequired, trackController.new);

router.get('/tracks/:trackId', trackController.show);

router.post('/tracks', multer({inMemory: true}), sessionController.loginRequired, trackController.create);

router.delete('/tracks/:trackId', sessionController.loginRequired, trackController.ownershipRequired, trackController.destroy);


//Rutas de listas favoritas
router.put('/user/:userId(\\d+)/favourites/:trackId', sessionController.loginRequired, favController.new);
router.delete('/user/:userId(\\d+)/favourites/:trackId',sessionController.loginRequired, favController.destroy);
router.get('/user/:userId(\\d+)/favourites',sessionController.loginRequired, favController.show);

module.exports = router;