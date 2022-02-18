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
exports.addNftCollectionPost = [
  // Validate and sanitise fields
  body('name', 'Collection name is required').trim().isLength({ min: 1 }).escape(),
  // Chain separate withMessage call for min and max to customise message
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required').isLength({ max: 600 }).withMessage('Description is too long (600 character max)').escape(),

  // Process request after input data has been validated and sanitised
  (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create new Collection object with data
    const nftCollection = new NftCollection (
      { 
        name: req.body.name,
        description: req.body.description, 
      }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitisez values and error messages
      res.render('collectionForm', { title: 'Add new Creator', nftCollection: nftCollection, errors: errors.array() })
    } else {
      // Data from form is valid
      // Check if collection with that name already exists
      NftCollection.findOne({ 'name': req.body.name })
        .exec(function (err, nftCollectionFound) {
          if (err) { return next(err) }
          if (nftCollectionFound) {
            // Collection with that name already exists, redirect to its detail page
            res.redirect(`/collection${nftCollectionFound.url}`);
          } else {
            // No duplicate found, create and save new Collection to db
            nftCollection.save(function (err) {
              if (err) { return next(err) }
              // Collection saved, redirect to it's (new) detail page
              res.redirect(`/collection${nftCollection.url}`);
            });
          }
        });
    }
  }
];

// Display NFT collection delete form on GET.
exports.deleteNftCollectionGet = function(req, res) {
  // Find both the collection in question, and any NFTs in the collection
  async.parallel({
    nftCollection: function (callback) {
      NftCollection.findById(req.params.id).exec(callback);
    },
    collectionsNfts: function (callback) {
      NFT.find({ 'nftCollection': req.params.id }).exec(callback);
    },
  }, function (err, results) {
    if (err) { return next(err) }
    if (results.nftCollection === null) { // No results, so nothing to delete.
      res.redirect('/collections');
    }
    // Successful, so render
    res.render('collectionDelete', { title: `Delete Collection '${results.nftCollection.name}'`, collection: results.nftCollection, collectionsNfts: results.collectionsNfts })
  })
};

// Handle NFT collection delete on POST.
exports.deleteNftCollectionPost = function(req, res) {
   // Find both the collection in question, and any NFTs in the collection
   async.parallel({
    nftCollection: function (callback) {
      NftCollection.findById(req.body.collectionid).exec(callback);
    },
    collectionsNfts: function (callback) {
      NFT.find({ 'nftCollection': req.body.collectionid }).exec(callback);
    },
  },function (err, results) {
    if (err) { return next(err) }
    // Success
    if (results.collectionsNfts.length > 0) {
      // Collection still has NFTs remaining. Render in same way as for GET route
      res.render('collectionDelete', { title: `Delete Collection '${results.nftCollection.name}'`, collection: results.nftCollection, collectionsNfts: results.collectionsNfts })
    } else {
      // Creator has no remaining NFTs. Delete from db and redirect to list of creators
      NftCollection.findByIdAndRemove(req.body.collectionid, function deleteCollection (err) { // Callback is named for clarity
        if (err) { return next(err); }
        // Success, go to collection list
        res.redirect('/collections');
      })
    }
  });
};

// Display NFT collection update form on GET.
exports.updateNftCollectionGet = function(req, res) {
  res.send('NOT IMPLEMENTED: NFT collection update GET');
};

// Handle NFT collection update on POST.
exports.updateNftCollectionPost = function(req, res) {
  res.send('NOT IMPLEMENTED: NFT collection update POST');
};