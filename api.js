var MongoClient = require('mongodb');
var Server = require('mongodb').Server;

var fs = require('fs');
var api = function (){
	var self = this;

	var mongoData = [];
	var retId = 0;
	self.setMongoData = function(op, params) {
		retId++;
		mongoData[retId] = false;
		var MongoClient = require('mongodb');
		var url = 'mongodb://127.0.0.1:27017/users';
		MongoClient.connect(url, function(err, db) {
		    var collection = db.collection('users');
		    //collection.insertMany([{'name' : 'test1', 'type' : 'admin'}]);
			switch (op) {
				case 'getUsersData':
				    collection.find({}).toArray(function(err, docs){
						mongoData[retId] = docs;
			    	    db.close();
				    });
				break;
				case 'getUserData':
					console.log(params.id);
					var oId = new MongoClient.ObjectID(params.id);
				    collection.find({'_id' : oId}).toArray(function(err, docs){
						mongoData[retId] = docs[0];
						console.log(mongoData);
			    	    db.close();
				    });
				break;
				case 'updateUserData':
					var oId = new MongoClient.ObjectID(params._id);
					delete params._id;
					collection.update({'_id' : oId}, params, { upsert: true }, function(err, doc) {
						console.log(err);
						mongoData[retId] = {'err' : 'no'};
					});
				break;
				case 'insertUserData':
					collection.insert(params, function(err, doc) {
						console.log(err);
						mongoData[retId] = {'err' : 'no'};
					});
				break;
				case 'deleteUserData':
					console.log(params);
					var oId = new MongoClient.ObjectID(params.id);
					collection.deleteOne({'_id' : oId}, function(err, doc) {
						console.log(err);
						mongoData[retId] = {'err' : 'no'};
					});
				break;

			}
		});
		return retId;
	}

	self.getMongoData = function(retId) {
		return mongoData[retId];
	}
	


	self.getData = function (){
		var jsonData = fs.readFileSync('./data/db.json', 'utf8');
		var obj = JSON.parse(jsonData);
		return obj;
	}
	self.getUser = function(userId) {
		var jsonData = fs.readFileSync('./data/db.json', 'utf8');
		var obj = JSON.parse(jsonData);
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].id == userId) {
				return obj[i];
			}
		}
		return {'error' : ''}
	}
	self.updateUser = function(userData) {
		var jsonData = fs.readFileSync('./data/db.json', 'utf8');
		var obj = JSON.parse(jsonData);
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].id == userData.id) {
				obj[i] = userData;
			}
		}
		
		fs.writeFile('./data/db.json', JSON.stringify(obj), function(err) {
			if(err) {
				return console.log(err);
			}
		});
		
		return {'error' : ''}
	}
	self.deleteUser = function(userData) {
		var jsonData = fs.readFileSync('./data/db.json', 'utf8');
		var obj = JSON.parse(jsonData);
		var newObj = [];
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].id != userData.id) {
				newObj.push(obj[i]);
			}
		}
		
		fs.writeFile('./data/db.json', JSON.stringify(newObj), function(err) {
			if(err) {
				return console.log(err);
			}
		});
		
		return {'error' : ''}
	}
	self.addUser = function(userData) {
		var jsonIdData = fs.readFileSync('./data/id.json', 'utf8');
		var idObj = JSON.parse(jsonIdData);
		var maxId = idObj.id;
		maxId++;
		idObj.id = maxId;
		fs.writeFile('./data/id.json', JSON.stringify(idObj), function(err) {});
		userData.id = maxId;

		var jsonData = fs.readFileSync('./data/db.json', 'utf8');
		var obj = JSON.parse(jsonData);
		obj.push(userData);
		
		fs.writeFile('./data/db.json', JSON.stringify(obj), function(err) {
			if(err) {
				return console.log(err);
			}
		});

		return {'error' : ''}
	}

};
module.exports = api;
