const NftCollection = require('../models/nftCollection');
const NFT = require('../models/nft');
const async = require('async');
const { body, validationResult } = require("express-validator");

// Display list of all NFT collections.
exports.nftCollectionList = function (req, res) {
  // Find all creator documents in db and sort by name
  NftCollection.find({})
    .sort({ name: 1 })
    .exec(function (err, collectionList) {
      if (err) { return next(err) }
      // Successful, so render
      res.render('collectionList', { title: 'Browse all Collections', collectionList: collectionList });
    });
};

// Display details page for specific NFT collection.
exports.nftCollectionDetail = function (req, res, next) {
  // Need to find not only the collection, but all NFTs in that collection
  async.parallel({
    nftCollection: function (callback) {
      // Find NFT collection by URL ID param
      NftCollection.findById(req.params.id)
        .exec(callback)
    },
    nftList: function (callback) {
      // Find all NFTs with associated collection equal to this collection ID
      NFT.find({ 'nftCollection': req.params.id })
        .exec(callback)
    },
  }, function (err, results) {
    if (err) { return next(err) } // API error
    if (results.NftCollection === null) {  // No results
      const err = new Error('Collection not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    res.render('collectionDetail', { title: results.nftCollection.name, nftCollection: results.nftCollection, nftList: results.nftList });
  });
};

// Display form for adding new NFT collection on GET.
exports.addNftCollectionGet = function (req, res) {
  res.render('collectionForm', { title: 'Add new Collection' });
};

// Handle adding new NFT collection on POST.
exports.addNftCollectionPost = function (req, res) {
  res.send('NOT IMPLEMENTED: NFT collection add POST');
};

// Display NFT collection delete form on GET.
exports.deleteNftCollectionGet = function(req, res) {
  res.send('NOT IMPLEMENTED: NFT collection delete GET');
};

// Handle NFT collection delete on POST.
exports.deleteNftCollectionPost = function(req, res) {
  res.send('NOT IMPLEMENTED: NFT collection delete POST');
};

// Display NFT collection update form on GET.
exports.updateNftCollectionGet = function(req, res) {
  res.send('NOT IMPLEMENTED: NFT collection update GET');
};

// Handle NFT collection update on POST.
exports.updateNftCollectionPost = function(req, res) {
  res.send('NOT IMPLEMENTED: NFT collection update POST');
};