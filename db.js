var mongoose = require('mongoose')
 
mongoose.connect('mongodb://localhost/test', function(err) {
    if (err) {
        console.err(err);
    } else {
        console.log('Connected');
    }
});

mongoose.Promise = global.Promise

var userSchema = new mongoose.Schema({
  username: {type:String, required: true, unique: true},
  password: {type:String, required: true},
})

var CustardUser = mongoose.model('custarduser', userSchema)

var opSchema = new mongoose.Schema({
  _custarduser: {type:mongoose.Schema.Types.ObjectId},
  opjobtitle: {type:String, required: true},
  oplocation: {type:String},
  opemployer: {type:String},
  opurl: {type:String, unique: true},
  optodo: {type:String},
  opstatus: {type:String},
})

var CustardOp = mongoose.model('custardop', opSchema)

CustardUser.findOne(function (err, custarduser) {
  if (err) {
      return handleError(err);
      console.log('This user not found!');
  }
})

CustardOp.find(function (err, custardop) {
  if (err) {
      return handleError(err);
  }
    console.log('This is the "custardop" from the db.js: ', custardop)
})

module.exports = {CustardUser: CustardUser, CustardOp: CustardOp}
