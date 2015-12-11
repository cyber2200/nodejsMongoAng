var MongoClient = require('mongodb');
var url = 'mongodb://127.0.0.1:27017/users';

MongoClient.connect(url, function(err, db) {
	var collection = db.collection('users');
	var oId = new MongoClient.ObjectID('566ad54935ce6d0f431085a8');
    collection.update({'_id' : oId}, {'name' : 'testrrr', 'type' : 'admin'}, { upsert: true }, function(err, doc) {
    	console.log(err);
    });

	collection.find({}).toArray(function(err, docs){
		console.log(docs);
		db.close();
	});
});
