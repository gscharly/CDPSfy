var path = require('path');
var Sequelize = require('sequelize');



var sequelize = new Sequelize('database',null,null,{dialect: "sqlite", storage: "track.sqlite"});

var Track = sequelize.import(path.join(__dirname,'track'));
var user_path = path.join(__dirname,'user');
var User = sequelize.import(user_path);

Track.belongsTo(User);
User.hasMany(Track);

//Listas

favourites= sequelize.define('favourites');
User.belongsToMany(Track, {through: 'favourites'});
Track.belongsToMany(User, {through: 'favourites'});

exports.Track = Track;
exports.User = User;
exports.favourites = favourites;

sequelize.sync().then(function(){

	User.count().then(function(count){
		if(count===0){
			User.bulkCreate(
				[ {username: 'admin', password:'1234', isAdmin:true},
				  {username: 'pepe', password:'5678'}
				]
				).then(function(){

					console.log('Base de datos usuarios inicializada');
					Track.count().then(function(count){
						if(count===0){
							Track.bulkCreate(
								[
									{ name: 'Cute',
						   url: 'http://tracks.cdpsfy.es/songs/Cute.mp3',
						   photoName: 'Cute',
						   photo: 'http://tracks.cdpsfy.es/photos/Cute.png',
						   UserId: 2
						},
						{ name: 'Dubstep',
						   url: 'http://tracks.cdpsfy.es/songs/Dubstep.mp3',
						   photoName: 'Dubstep',
						   photo: 'http://tracks.cdpsfy.es/photos/Dubstep.png',
						   UserId: 2
						},

						{ name: 'Epic',
						   url: 'http://tracks.cdpsfy.es/songs/Epic.mp3',
						   photoName: 'Epic',
						   photo: 'http://tracks.cdpsfy.es/photos/Epic.png',
						   UserId: 2
						},
							{ name: 'Littleidea',
						   url: 'http://tracks.cdpsfy.es/songs/Littleidea.mp3',
						   photoName: 'Littleidea',
						   photo: 'http://tracks.cdpsfy.es/photos/Littleidea.png',
						   UserId: 2
						}


								]

								).then(function(){console.log('Base de datos track inicializada')})
						}
					})

				})
		}
	})

	/*Track.count().then(function(count){
		if(count === 0){
			Track.create({ name: 'Cute',
						   url: 'http://tracks.cdpsfy.es:3000/songs/Cute.mp3',
						   photoName: 'Cute',
						   photo: 'http://tracks.cdpsfy.es:3000/photos/Cute.png'
						});
			Track.create({ name: 'Dubstep',
						   url: 'http://tracks.cdpsfy.es:3000/songs/Dubstep.mp3',
						   photoName: 'Dubstep',
						   photo: 'http://tracks.cdpsfy.es:3000/photos/Dubstep.png'
						});
			Track.create({ name: 'Epic',
						   url: 'http://tracks.cdpsfy.es:3000/songs/Epic.mp3',
						   photoName: 'Epic',
						   photo: 'http://tracks.cdpsfy.es:3000/photos/Epic.png'
						});
			Track.create({ name: 'Littleidea',
						   url: 'http://tracks.cdpsfy.es:3000/songs/Littleidea.mp3',
						   photoName: 'Littleidea',
						   photo: 'http://tracks.cdpsfy.es:3000/photos/Littleidea.png'
						}

		).then(function(){console.log('Base de datos inicializada')});
		};
	});*/
});