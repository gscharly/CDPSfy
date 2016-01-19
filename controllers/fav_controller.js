var models = require('../models/models.js');

//PUT /user/:userId/favourites/:trackId
exports.new = function  (req,res) {
	var track = req.track;
	var user = req.user;

	user.hasTrack(track).then(function(result){
		if(result){
			next();
			return;
		} else{
			user.addTrack(track).then(function(){
				user.hasTrack(track).then(function(result){
					console.log("Usuario " + user.username + " eligió canción "   + track.id);
				})
			})
		}
		res.redirect('/');
	});
};

exports.destroy = function(req,res){
	var track = req.track;
	var user = req.user;

	user.hasTrack(track).then(function(result){
		if(result){
			user.removeTrack(track).then(function(){
				user.hasTrack(track).then(function(result){
					console.log("Usuario " + user.username + " quitó canción " + track.id);
				})
			})
		}
		res.redirect('/');
	});
};

exports.show = function(req,res){
	var favs = [];
	var i;
	var id;
	var mensaje = "Listen to your own private list! "
	models.favourites.findAll({
		where:{UserId: Number(req.session.user.id)}
	}).then(function(favoritos){
		tracks=[];
		for(i=0;i<favoritos.length;i++){
			favs.push(favoritos[i].dataValues.TrackId);
		}
	}).then(function(){
		if(favs.length > 0){
			for(i=0;i<favs.length;i++){
				id=favs[i];
				models.Track.find({
					where:{id: Number(id)},

				}).then(function(track){
					tracks.push(track);
				}).then(function(){
					if(tracks.length === favs.length){
						res.render('tracks/index', {tracks:tracks, errors:[], favs:favs, mensaje:mensaje})
					}
				});
			}

		} else{

			res.render('tracks/index', {tracks: tracks, errors: [], favs:favs, mensaje:mensaje})
		}
	});
}