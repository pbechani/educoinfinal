var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SchoolSchema = new Schema({
  address: String,
  name: String,
  edutokens: String,
  uniqueid: String
});

module.exports = mongoose.model('School', SchoolSchema);
