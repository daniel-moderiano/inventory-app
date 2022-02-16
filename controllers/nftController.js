const NFT = require('../models/nft');
const Creator = require('../models/creator');
const NftCollection = require('../models/nftCollection');
const async = require('async');
const { body, validationResult } = require("express-validator");

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
exports.addNftPost = function (req, res) {
  res.send('NOT IMPLEMENTED: NFT add POST');
};

// EXAMPLE for uploading images
// router.post('/', upload.single('uploaded_file'), function (req, res) {
//   // req.file is the name of your file in the form above, here 'uploaded_file'
//   // req.body will hold the text fields, if there were any 
//   // console.log(req);
//   const data = fs.readFileSync(path.resolve(__dirname, `../public/data/uploads/${req.file.filename}`));
//   fs.writeFileSync(path.resolve(__dirname, `../public/data/uploads/${req.file.filename}.txt`), data, (err) => {
//     if (err) {console.log(err)}
//   })
//   console.log(data);
//   res.send('Done');
// });

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