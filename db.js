var mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/adsf')

console.log('line 4');
mongoose.connect('mongodb://localhost/test', function(err) {
    if (err) {
        console.err(err);
    } else {
        console.log('Connected');
    }
});

mongoose.Promise = global.Promise

// var mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/custard')
// mongoose.Promise = global.Promise

var userSchema = new mongoose.Schema({
  username: {type:String, required: true, unique: true},
  password: {type:String, required: true},
})

var CustardUser = mongoose.model('custarduser', userSchema)

var companySchema = new mongoose.Schema({
  _custarduser: {type: mongoose.Schema.Types.ObjectId},
  companyname: {type:String, required: true},
  companyperson: {type:String},
  companyaddress: {type:String},
  companytel: {type:String},
})

var CustardCompany = mongoose.model('custardcompany', companySchema)

var opSchema = new mongoose.Schema({
  // _custardcompany: {type: mongoose.Schema.Types.ObjectId},
  _custarduser: {type:mongoose.Schema.Types.ObjectId},
  opjobtitle: {type:String, required: true},
  oplocation: {type:String},
  opemployer: {type:String},
  opurl: {type:String, unique: true},
  opstatus: {type:String},
})

var CustardOp = mongoose.model('custardop', opSchema)

CustardCompany.find(function (err, custardcompany) {
  if (err) {
      return handleError(err);
  }
    console.log('This is the "custardcompany" from the db.js: ', custardcompany)
})

CustardUser.findOne(function (err, custarduser) {
  if (err) {
      return handleError(err);
      console.log('This user not found!');
  }
    console.log('This is the "custarduser" from the db.js: ', custarduser)
})

CustardOp.find(function (err, custardop) {
  if (err) {
      return handleError(err);
  }
    console.log('This is the "custardop" from the db.js: ', custardop)
})

module.exports = {CustardUser: CustardUser, CustardCompany: CustardCompany, CustardOp: CustardOp}
