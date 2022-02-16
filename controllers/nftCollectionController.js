const NftCollection = require('../models/nftCollection');

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
exports.nftCollectionDetail = function (req, res) {
  res.send('NOT IMPLEMENTED: NFT collection detail: ' + req.params.id);
};

// Display form for adding new NFT collection on GET.
exports.addNftCollectionGet = function (req, res) {
  res.send('NOT IMPLEMENTED: NFT collection add GET');
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