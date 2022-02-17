const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for an NFT creator, using the Schema class in Mongoose. This essentially defines the fields and values permitted for a creator document in MongoDB
const CreatorSchema = new Schema(
  {
    name: { type: String, required: true },
  } 
);

// Virtual for creator's URL. Note an arrow function is not used in the getter to avoid incorrect 'this' binding
CreatorSchema
.virtual('url')
.get(function () {
  return '/' + this._id;
});

// Export the Schema as a mongoose model. A model instance can be considered an actual document to be saved/updated/deleted from a MongoDB collection
module.exports = mongoose.model('Creator', CreatorSchema);