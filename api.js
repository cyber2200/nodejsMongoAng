var MongoClient = require('mongodb');

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
				case 'getData':
				    collection.find({}).toArray(function(err, docs){
						mongoData[retId] = docs;
			    	    db.close();
				    });
				break;
				case 'getUser':
					var oId = new MongoClient.ObjectID(params.id);
				    collection.find({'_id' : oId}).toArray(function(err, docs){
						mongoData[retId] = docs[0];
			    	    db.close();
				    });
				break;
				case 'updateUser':
					var oId = new MongoClient.ObjectID(params._id);
					delete params._id;
					collection.update({'_id' : oId}, params, { upsert: true }, function(err, doc) {
						mongoData[retId] = {'err' : 'no'};
					});
				break;
				case 'addUser':
					collection.insert(params, function(err, doc) {
						mongoData[retId] = {'err' : 'no'};
					});
				break;
				case 'deleteUser':
					var oId = new MongoClient.ObjectID(params.id);
					collection.deleteOne({'_id' : oId}, function(err, doc) {
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
};
module.exports = api;
