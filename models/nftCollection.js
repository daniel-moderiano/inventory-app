const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for an NFT collection (a.k.a. brand of NFT, e.g. Cryptopunks, Bored Ape Yacht Club, etc.)
const NftCollectionSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    numberOfItems: { type: Number }  // Calculated using NFTs with this collection ID
  } 
);

// Virtual for collection URL. Note an arrow function is not used in the getter to avoid incorrect 'this' binding
NftCollectionSchema
.virtual('url')
.get(function () {
  return '/' + this._id;
});

// Export the Schema as a mongoose model. A model instance can be considered an actual document to be saved/updated/deleted from a MongoDB collection
module.exports = mongoose.model('NftCollection', NftCollectionSchema);