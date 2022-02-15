const NFT = require('../models/nft');

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