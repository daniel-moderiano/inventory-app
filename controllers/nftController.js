const NFT = require('../models/nft');
const Creator = require('../models/creator');
const NftCollection = require('../models/nftCollection');
const async = require('async');
const { body, validationResult } = require("express-validator");
const multer  = require('multer');

// Setup memory storage for Multer. Files won't be physically saved to a directory, but will be held in memory buffer temporarily
const storage = multer.memoryStorage();
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png"
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("File format should be PNG,JPG,JPEG"), false); // if validation failed then generate error
//   }
// }
// Define the Multer parameters for image upload. Call this upload function in routers below as needed
const upload = multer({ storage : storage });

// EXAMPLE for uploading images
// router.post('/', upload.single('img'), function (req, res) {
//   // req.file is the name of your file in the form above, here 'uploaded_file'
//   // req.body will hold the text fields, if there were any 
//   const buffer = req.file.buffer;
//   console.log(buffer);
//   // const data = fs.readFileSync(path.resolve(__dirname, `../public/data/uploads/${req.file.filename}`));
//   // fs.writeFileSync(path.resolve(__dirname, `../public/data/uploads/${req.file.filename}.txt`), data, (err) => {
//   //   if (err) {console.log(err)}
//   // })
//   res.send('Done');
// });

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
exports.nftDetail = function (req, res) {
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
  res.render('nftForm', { title: 'Add NFT' });
};

// Handle adding new NFT on POST.
exports.addNftPost = [
  // Extract relevant file upload data
  upload.single('img'),

  // Validate and sanitise fields
  body('name', 'NFT name is required').trim().isLength({ min: 1 }).escape(),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required').isLength({ max: 100 }).withMessage('Description is too long (100 character max)').escape(),
  // Consider sanitising input by matchign regex pattern that first digit is not zero
  body('currentPrice').trim().isLength({ min: 1 }).withMessage('Current price is required').matches(/^[1-9][0-9]$/).withMessage('Price must be a whole number > 0').escape(),

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
    const nft = new NFT (
      { 
        name: req.body.name,
        description: req.body.description, 
        currentPrice: req.body.currentPrice,
        img: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        }
      }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitisez values and error messages
      res.render('nftForm', { title: 'Add new NFT', nft: nft, errors: errors.array() })
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
            // nft.save(function (err) {
            //   if (err) { return next(err) }
            //   // Collection saved, redirect to it's (new) detail page
            //   res.redirect(`/nft${nft.url}`);
            // });
            res.send(nft);
          }
        });
    }
  }
];

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