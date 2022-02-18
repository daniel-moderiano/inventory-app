const NFT = require('../models/nft');
const Creator = require('../models/creator');
const NftCollection = require('../models/nftCollection');
const async = require('async');
const { body, validationResult } = require("express-validator");
const multer = require('multer');

// Setup memory storage for Multer. Files won't be physically saved to a directory, but will be held in memory buffer temporarily
const storage = multer.memoryStorage();
// Define the Multer parameters for image upload. Call this upload function in routers below as needed
const upload = multer({ storage: storage });

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
exports.nftList = function (req, res, next) {
  // Find all NFT documents in db and sort by name
  NFT.find({})
    .sort({ name: 1 })
    .populate('creator')
    .populate('nftCollection')
    // Once the query is complete, chain the 'execute' function below to operate on the results. If an error occurs, you must pass to the next middleware in the chain with next. Since render ends the logic, no next is required
    .exec(function (err, nftList) {
      if (err) { return next(err) }
      // Successful, so render
      res.render('nftList', { title: 'Browse all NFTs', nftList: nftList });
    });
};

// Display details page for specific NFT.
exports.nftDetail = function (req, res, next) {
  // Find NFT document by URL ID param
  NFT.findById(req.params.id)
    .populate('creator')
    .populate('nftCollection')
    .exec(function (err, nft) {
      if (err) { return next(err) }
      // Successful, so render
      res.render('nftDetail', { title: nft.name, nft: nft });
    });
};

// Display form for adding new NFT on GET.
exports.addNftGet = function (req, res, next) {
  // Get all creators and collections to add to the new NFT
  async.parallel({
    creators: function (callback) {
      Creator.find(callback);
    },
    nftCollections: function (callback) {
      NftCollection.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    // Success, so render GET form with db values above
    res.render('nftForm', { title: 'Add NFT', creators: results.creators, collections: results.nftCollections });
  })
};

// Handle adding new NFT on POST.
exports.addNftPost = [
  // Upload file with Multer. This will create a 'req.file' object that can be validated below before buffer data is added to db
  upload.single('img'),

  // Validate and sanitise fields
  body('name', 'NFT name is required').trim().isLength({ min: 1 }).escape(),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required').isLength({ max: 100 }).withMessage('Description is too long (100 character max)').escape(),
  body('currentPrice').trim().isLength({ min: 1 }).withMessage('Current price is required').matches(/^[1-9][0-9]*$/).withMessage('Price must be a whole number > 0').escape(),
  body('creator', 'Creator must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('nftCollection', 'Collection must not be empty.').trim().isLength({ min: 1 }).escape(),

  body('img').custom((value, { req }) => {
    // Check file mimetype is PNG. Do not use extension as the user can simply edit this manually
    if (req.file.mimetype !== 'image/png') {
      // Throw error to satisfy non-valid criteria for validator function
      throw new Error('Please upload a PNG');
    }
    // Image is PNG, return truthy value to satisfy validation
    return true;
  }),

  // Process request after input data has been validated and sanitised
  (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create new NFT object with data
    const nft = new NFT(
      {
        name: req.body.name,
        description: req.body.description,
        currentPrice: req.body.currentPrice,
        creator: req.body.creator,
        nftCollection: req.body.nftCollection,
        img: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        }
      }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitised values and error messages
      // Get all creators and collections to add to the new NFT
      async.parallel({
        creators: function (callback) {
          Creator.find(callback);
        },
        nftCollections: function (callback) {
          NftCollection.find(callback);
        },
      }, function (err, results) {
        if (err) { return next(err); }
        // Success, so render GET form with db values above and errors array
        res.render('nftForm', { title: 'Add NFT', creators: results.creators, collections: results.nftCollections, nft: nft, errors: errors.array() });
      })
    } else {
      // Data from form is valid
      // Check if collection with that name already exists
      NFT.findOne({ 'name': req.body.name })
        .exec(function (err, nftFound) {
          if (err) { return next(err) }
          if (nftFound) {
            // NFT with that name already exists, redirect to its detail page
            res.redirect(`/nft${nftFound.url}`);
          } else {
            // No duplicate found, create and save new NFT to db
            nft.save(function (err) {
              if (err) { return next(err) }
              // Collection saved, redirect to it's (new) detail page
              res.redirect(`/nft${nft.url}`);
            });
          }
        });
    }
  }
];

// Display Creator delete form on GET.
exports.deleteNftGet = function (req, res, next) {
  // Find NFT document by URL ID param
  NFT.findById(req.params.id)
    .exec(function (err, nft) {
      if (err) { return next(err) }
      // Successful, so render
      res.render('nftDelete', { title: `Delete NFT '${nft.name}'`, nft: nft });
    });
};

// Handle Creator delete on POST.
exports.deleteNftPost = function (req, res, next) {
  // No associated deletes are necessary with NFTs, delete immediately
  NFT.findByIdAndRemove(req.body.nftid, function deleteNFT(err) {
    if (err) { return next(err); }
    // Success, go to NFT list
    res.redirect('/nfts');
  })
};

// Display Creator update form on GET.
exports.updateNftGet = function (req, res, next) {
  // Get all creators and collections associated with the NFT
  async.parallel({
    nft: function (callback) {
      NFT.findById(req.params.id).populate('creator').populate('nftCollection').exec(callback);
    },
    creators: function (callback) {
      Creator.find(callback);
    },
    nftCollections: function (callback) {
      NftCollection.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.nft === null) { // No results
      const err = new Error('NFT not found');
      err.status = 404;
      return next(err);
    }
    // Success, render update form with update param (this will ensure the image field is not available)
    res.render('nftForm', { title: 'Update NFT', creators: results.creators, collections: results.nftCollections, nft: results.nft, update: true });
  });
};

// Handle Creator update on POST.
exports.updateNftPost = [
  // Validate and sanitise fields
  body('name', 'NFT name is required').trim().isLength({ min: 1 }).escape(),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required').isLength({ max: 100 }).withMessage('Description is too long (100 character max)').escape(),
  body('currentPrice').trim().isLength({ min: 1 }).withMessage('Current price is required').matches(/^[1-9][0-9]*$/).withMessage('Price must be a whole number > 0').escape(),
  body('creator', 'Creator must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('nftCollection', 'Collection must not be empty.').trim().isLength({ min: 1 }).escape(),

  // Process request after input data has been validated and sanitised
  (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create new NFT object with data
    const nft = new NFT(
      {
        name: req.body.name,
        description: req.body.description,
        currentPrice: req.body.currentPrice,
        creator: req.body.creator,
        nftCollection: req.body.nftCollection,
        _id: req.params.id,
      }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitised values and error messages
      // Get all creators and collections to add to the new NFT
      async.parallel({
        creators: function (callback) {
          Creator.find(callback);
        },
        nftCollections: function (callback) {
          NftCollection.find(callback);
        },
      }, function (err, results) {
        if (err) { return next(err); }
        // Success, so render GET form with db values above and errors array
        res.render('nftForm', { title: 'Update NFT', creators: results.creators, collections: results.nftCollections, nft: nft, errors: errors.array() });
      })
    } else {
      // Data from form is valid. Update the record
      NFT.findByIdAndUpdate(req.params.id, nft, {}, function (err, updatedNFT) {
        if (err) { return next(err) }
        // Successful, redirect to NFT detail page
        res.redirect(`/nft${updatedNFT.url}`);
      });
    }
  }
];