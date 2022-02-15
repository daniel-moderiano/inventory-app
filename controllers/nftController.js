const NFT = require('../models/nft');
const Creator = require('../models/creator');
const NftCollection = require('../models/nftCollection');
const async = require('async');

// Display home page
exports.index = function (req, res) {
  // Count all documents of each type in async parralel, saving each as a key:value pair
  async.parallel({
    nftCount: function (callback) {
      // An empty query is passed here to match all documents
      NFT.countDocuments({}, callback);
    },
    creatorCount: function (callback) {
      // An empty query is passed here to match all documents
      Creator.countDocuments({}, callback);
    },
    nftCollectionCount: function (callback) {
      // An empty query is passed here to match all documents
      NftCollection.countDocuments({}, callback);
    }
  }, function (err, results) {
    // Pass the results array above into the render template to display data
    res.render('index', { title: 'NFT Inventory', error: err, data: results });
  });
};

// Display list of all NFTs.
exports.nftList = function (req, res) {
  res.send('NOT IMPLEMENTED: NFT list');
};

// Display details page for specific NFT.
exports.nftDetail = function (req, res) {
  res.send('NOT IMPLEMENTED: NFT detail: ' + req.params.id);
};

// Display form for adding new NFT on GET.
exports.addNftGet = function (req, res) {
  res.send('NOT IMPLEMENTED: NFT add GET');
};

// Handle adding new NFT on POST.
exports.addNftPost = function (req, res) {
  res.send('NOT IMPLEMENTED: NFT add POST');
};

// Display Creator delete form on GET.
exports.deleteNftGet = function(req, res) {
  res.send('NOT IMPLEMENTED: NFT delete GET');
};

// Handle Creator delete on POST.
exports.deleteNftPost = function(req, res) {
  res.send('NOT IMPLEMENTED: NFT delete POST');
};

// Display Creator update form on GET.
exports.updateNftGet = function(req, res) {
  res.send('NOT IMPLEMENTED: NFT update GET');
};

// Handle Creator update on POST.
exports.updateNftPost = function(req, res) {
  res.send('NOT IMPLEMENTED: NFT update POST');
};