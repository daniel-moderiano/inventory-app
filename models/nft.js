const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for an NFT. This defines an NFT artwork, and includes references to its collection and creator
const nftSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true }, // If description is left as an empty string, it will later be populater by 'created by ....'
    creator: { type: Schema.Types.ObjectId, ref: 'Creator', required: true  },
    currentPrice: { type: Number, required: true }, // Arbitrarily set and hardcoded, not calculated from some API. In ETH units
    nftCollection: { type: Schema.Types.ObjectId, ref: 'NftCollection', required: true },
    imgUrl: { type: String }, // To be implemented later, may even be combined below to make a virtual property
  } 
);

// Virtual for NFT's URL. Note an arrow function is not used in the getter to avoid incorrect 'this' binding
nftSchema
.virtual('url')
.get(function () {
  return '/' + this._id;
});

// Export the Schema as a mongoose model. A model instance can be considered an actual document to be saved/updated/deleted from a MongoDB collection
module.exports = mongoose.model('NFT', nftSchema);