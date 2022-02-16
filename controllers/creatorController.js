const Creator = require('../models/creator');
const async = require('async');
const NFT = require('../models/nft');
const { body, validationResult } = require("express-validator");

// Display list of all creators.
exports.creatorList = function (req, res) {
  // Find all creator documents in db and sort by name
  Creator.find({})
    .sort({ name: 1 })
    .exec(function (err, creatorList) {
      if (err) { return next(err) }
      // Successful, so render
      res.render('creatorList', { title: 'Browse all Creators', creatorList: creatorList });
    });
};

// Display details page for specific creator.
exports.creatorDetail = function (req, res) {
  // Need to find not only the collection, but all NFTs in that collection
  async.parallel({
    creator: function (callback) {
      // Find NFT collection by URL ID param
      Creator.findById(req.params.id)
        .exec(callback)
    },
    nftList: function (callback) {
      // Find all NFTs with associated collection equal to this collection ID
      NFT.find({ 'creator': req.params.id })
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
    res.render('creatorDetail', { title: results.creator.name, creator: results.creator, nftList: results.nftList });
  });
};

// Display form for adding new Creator on GET.
exports.addCreatorGet = function (req, res) {
  res.render('creatorForm', { title: 'Add new Creator' });
};

// Handle adding new Creator on POST.
exports.addCreatorPost = function (req, res) {
  res.send('NOT IMPLEMENTED: Creator add POST');
};

// Display Creator delete form on GET.
exports.deleteCreatorGet = function(req, res) {
  res.send('NOT IMPLEMENTED: Creator delete GET');
};

// Handle Creator delete on POST.
exports.deleteCreatorPost = function(req, res) {
  res.send('NOT IMPLEMENTED: Creator delete POST');
};

// Display Creator update form on GET.
exports.updateCreatorGet = function(req, res) {
  res.send('NOT IMPLEMENTED: Creator update GET');
};

// Handle Creator update on POST.
exports.updateCreatorPost = function(req, res) {
  res.send('NOT IMPLEMENTED: Creator update POST');
};