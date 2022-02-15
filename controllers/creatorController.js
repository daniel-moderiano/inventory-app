const Creator = require('../models/creator');

// Display list of all creators.
exports.creatorList = function (req, res) {
  res.send('NOT IMPLEMENTED: Creator list');
};

// Display details page for specific creator.
exports.creatorDetail = function (req, res) {
  res.send('NOT IMPLEMENTED: Creator detail: ' + req.params.id);
};

// Display form for adding new Creator on GET.
exports.addCreatorGet = function (req, res) {
  res.send('NOT IMPLEMENTED: Creator add GET');
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