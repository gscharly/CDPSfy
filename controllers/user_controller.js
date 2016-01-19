var models = require('../models/models.js');

exports.ownershipRequired = function(req,res,next){
	var objUser = req.user.id;
	var logUser = req.session.user.id;
	var isAdmin = req.session.user.isAdmin;
	if(isAdmin || objUser === logUser){
		next();
	} else{
		res.redirect('/');
	}
}

//Autoload
exports.load = function(req,res,next,userId){
	models.User.find({where: {id: Number(userId)}})
	.then(function(user){
		if(user){
			req.user = user;
			//console.log("User:",user);
			next();
		} else{ next(new Error('No existe userId=' + userId))}
	}).catch(function(error){next(error)});
};

//Comprueba si el usuario está registrado
exports.autenticar = function(login, password, callback){

	models.User.find({
		where: {
			username: login
		}
	}).then(function(user){
		if(user){
			if(user.verifyPassword(password)){
				callback(null,user);
			}
			else{
				callback(new Error('Password erróneo.'));
			}
		}
			else{
				callback(new Error('No existe el usuario'));
			}
		
	}).catch(function(error){callback(error)});

	
};

// GET /user/:id/edit
exports.edit = function(req,res){
	res.render('user/edit', {user: req.user, errors: []});
};

// PUT /user/:id
exports.update = function(req,res,next){
	console.log(req.body);
	//console.log(req.user.password);
	req.user.username = req.body.username;
	req.user.password = req.body.password;
	console.log("Username nuevo:", req.user.username);
	console.log("Password nueva:", req.user.password);
	req.user.validate().then(function(err){
		if(err){
			res.render('user/' + req.user.id, {user: req.user, errors: err.errors});
		} else{
			req.user.save({fields: ["username", "password"]})
			.then(function(){
				res.redirect('/');
			});
		}
	}).catch(function(error){next(error)});
};

//GET /user
exports.new = function(req,res){
	var user = models.User.build(
		{
			username:"", password: ""
		}
		);
	res.render("user/new", {user:user, errors: []});
};

//POST /user
exports.create = function(req,res){
	var user = models.User.build(req.body);

	console.log("Usuario nuevo:", user);

	user.validate().then(function(err){
		if(err){
			res.render('user/new', {user:user, errors: err.errors});
		} else{
			user.save({fields: ["username", "password"]})
			.then(function(){
				req.session.user = {id:user.dataValues.id, username: user.username};
				console.log("Sesion:",req.session.user);
				res.redirect('/');
			});
		}
	}).catch(function(error){next(error)});
};

//DELETE /user/:ID
exports.destroy = function(req,res){
	req.user.destroy().then(function(){
		delete req.session.user;
		res.redirect('/');
	}).catch(function(error){next(error)});
};