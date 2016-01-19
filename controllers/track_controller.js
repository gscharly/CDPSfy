var fs = require('fs');
//var track_model = require('./../models/track');
//AÑADIR REQUEST
var request = require('request')
var models = require('../models/models.js')


exports.load = function(req,res,next,trackId){
	models.Track.find(trackId).then(function(track){
		if(track){
			req.track = track;
			next();
		} else{
			next(new Error('No existe trackId=' + trackId));
		}
	}).catch(function(error){next(error)});
};

exports.ownershipRequired = function(req,res,next){
	var objTrackOwner = req.track.UserId;
	var logUser = req.session.user.id;
	var isAdmin = req.session.user.isAdmin;

	if(isAdmin || objTrackOwner === logUser){
		next();
	} else{
		res.redirect('/');
	}
}
// Devuelve una lista de las canciones disponibles y sus metadatos
exports.list = function (req, res) {

	var i;
	var favs = [];
	var users = [];
	if(req.session.user){
		models.favourites.findAll({
			where:{UserId: Number(req.session.user.id)}
		}).then(function(favo){
			for(i=0; i<favo.length;i++){
				favs.push(favo[i].dataValues.TrackId);
			}
		})
	}

	models.Track.findAll().then(function(tracks){
		var mensaje = "Listen to everyones music!"
		/*console.log(tracks.length);
		
		for(t in tracks){
			models.User.find(tracks[t].UserId).then(function(user){
				
				users.push(user.dataValues.username);
				console.log(users);

			});
		}
		console.log("Usuarios: " + users);*/
		//console.log(tracks)
		res.render('tracks/index', {tracks: tracks, favs:favs, mensaje:mensaje, errors:[]});
	});

	//var tracks = track_model.tracks;
	//res.render('tracks/index', {tracks: tracks});
};

// Devuelve la vista del formulario para subir una nueva canción
exports.new = function (req, res) {
	res.render('tracks/new', {errors:[]});
};

// Devuelve la vista de reproducción de una canción.
// El campo track.url contiene la url donde se encuentra el fichero de audio
exports.show = function (req, res) {

	models.Track.find(req.params.trackId).then(function(track){
		//track.id = req.params.trackId;
		console.log(track.name)
		console.log(track.id)

		res.render('tracks/show', {track: track, errors:[]});
	})

	//var track = track_model.tracks[req.params.trackId];
	//track.id = req.params.trackId;
	//res.render('tracks/show', {track: track});
};

// Escribe una nueva canción en el registro de canciones.
// TODO:
// - Escribir en tracks.cdpsfy.es el fichero de audio contenido en req.files.track.buffer
// - Escribir en el registro la verdadera url generada al añadir el fichero en el servidor tracks.cdpsfy.es
exports.create = function (req, res) {
	//var track = models.Track.build(req.files.track)
	var userId = req.session.user.id;
	console.log("userID", userId);
	var track = req.files.track;
	var photo = req.files.photo;
	console.log('Nuevo fichero de audio. Datos: ', track);
	console.log('Nueva carátula:', photo);
	//var id = track.name.split('.')[0];
	var name = track.originalname.split('.')[0];
	var photoName = photo.originalname.split('.')[0];
	console.log('Nombre canción:',name)
	console.log('Nombre carátula:', photoName)
	//console.log(id)
	// Aquí debe implementarse la escritura del fichero de audio (track.buffer) en tracks.cdpsfy.es
	// Esta url debe ser la correspondiente al nuevo fichero en tracks.cdpsfy.es
	var url = 'http://tracks.cdpsfy.es/songs/sube';
	var urlPhoto = 'http://tracks.cdpsfy.es/photos/sube';
	
	var req = request.post(url, function(err,resp,body){

		if(err){
			console.log(err)
		}else{

			console.log('URL: ' + body)
		}
	});

	var reqPhoto = request.post(urlPhoto, function(err,resp,body){

		if(err){
			console.log(err)
		}else{

			console.log('URL: ' + body)
		}
	});

	var form = req.form();
	var formPhoto = reqPhoto.form();
	
	var nombre = name + "_" + ((new Date()).getTime())  + ".mp3";
	var nombrePhoto = photoName + "_" + ((new Date()).getTime()) + ".png";
	form.append('nombreTrack', track.buffer, {filename:nombre, contentType:'audio/mpeg'});

	var nombrePhoto = photoName + "_" + ((new Date()).getTime()) + ".png";
	//idSong++
	
	formPhoto.append('nombrePhoto', photo.buffer, {filename:nombrePhoto, contentType:'image/png'});

	var url = 'http://tracks.cdpsfy.es/songs/' + nombre;
	var urlPhoto = 'http://tracks.cdpsfy.es/photos/' + nombrePhoto;
	// Escribe los metadatos de la nueva canción en el registro.
	/*
	track.save({fields: ["name", "url"]}).then(function(){
		console.log(track)
		res.redirect('/tracks');
	})*/

	models.Track.create({
		name: nombre,
		url: url,
		photoName: nombrePhoto,
		photo: urlPhoto,
		UserId: userId
	}).then(function(){
		//console.log(models.Track)
		res.redirect('/tracks');
	})

	/*track_model.tracks[id] = {
		name: nombre.split('.')[0],
		url: url
	};
	console.log(track_model.tracks)*/
	//res.redirect('/tracks');
};

// Borra una canción (trackId) del registro de canciones 
// TODO:
// - Eliminar en tracks.cdpsfy.es el fichero de audio correspondiente a trackId
exports.destroy = function (req, res) {
	var trackId = req.params.trackId;
	
	// Aquí debe implementarse el borrado del fichero de audio indetificado por trackId en tracks.cdpsfy.es
	//console.log(trackId)
	//var track = track_model.tracks[trackId];
	//var trackName = track.name;
	//console.log(trackName)
	models.Track.find(req.params.trackId).then(function(track){
		//track.id = req.params.trackId;
		console.log(track.name)
		var nombre = track.name.split('.')[0]
		var nombreFoto = track.photoName.split('.')[0]
		console.log(nombreFoto)
		console.log(track.id)
		request.del('http://tracks.cdpsfy.es/deleteSong/' + nombre)
		request.del('http://tracks.cdpsfy.es/deletePhoto/' + nombreFoto)
		track.destroy().then(function(){
			res.redirect('/tracks');
		});
		
	});
	
	
	// Borra la entrada del registro de datos
	//delete track_model.tracks[trackId];
	//res.redirect('/tracks');
};

//GET /tracks Buscar canciones de un usuario
exports.index = function(req,res){
	var options = {};
	if(req.user){
		options.where = {UserId: req.user.id}
	}
	models.Track.findAll(options).then(function(tracks){
		res.render('tracks/my_tracks.ejs', {tracks:tracks, errors:[]});
	}).catch(function(error){next(error)});
};