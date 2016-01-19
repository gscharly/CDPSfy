/* 

Modelo de datos de canciones (track)

track_id: {
	name: nombre de la canción,
	url: url del fichero de audio
} 

*/
/*
exports.tracks = {
	1: {
		name: 'Cute',
		url: 'http://tracks.cdpsfy.es:3000/songs/Cute.mp3'
	},
	2: {
		name: 'Dubstep',
		url: 'http://tracks.cdpsfy.es:3000/songs/Dubstep.mp3'
	},
	3: {
		name: 'Epic',
		url: 'http://tracks.cdpsfy.es:3000/songs/Epic.mp3'
	},
	4: {
		name: 'Littleidea',
		url: 'http://tracks.cdpsfy.es:3000/songs/Littleidea.mp3'
	}
};
*/

module.exports = function(sequelize, DataTypes){

	return sequelize.define('Track',
	{
		/*id:{ type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey:true
		},*/
		name: DataTypes.STRING,
		url: DataTypes.STRING,
		photoName: DataTypes.STRING,
		photo: DataTypes.STRING

	});
}