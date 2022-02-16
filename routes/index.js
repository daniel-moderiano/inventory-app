var express = require('express');
var router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: './public/data/uploads/' });
const fs = require('fs');
const path = require('path');

// Require controller modules
const nftController = require('../controllers/nftController');
const nftCollectionController = require('../controllers/nftCollectionController');
const creatorController = require('../controllers/creatorController');

/// NFT ROUTES ///

/* GET home page. */
router.get('/', nftController.index);

// GET request for creating NFT. NOTE This must come before routes that display NFT (otherwise the 'create' will be considered as ID in route params)
router.get('/nft/create', nftController.addNftGet);

// POST request for creating NFT
router.post('/nft/create', nftController.addNftPost);

// GET request to delete NFT
router.get('/nft/:id/delete', nftController.deleteNftGet);

// POST request to delete NFT
router.post('/nft/:id/delete', nftController.deleteNftPost);

// GET request to update NFT
router.get('/nft/:id/update', nftController.updateNftGet);

// POST request to update NFT
router.post('/nft/:id/update', nftController.updateNftPost);

// GET request for one NFT
router.get('/nft/:id', nftController.nftDetail);

// Get request for list of all NFTs
router.get('/nfts', nftController.nftList);


/// CREATOR ROUTES ///

// GET request for adding Creator. NOTE This must come before routes that display Creator (otherwise the 'create' will be considered as ID in route params)
router.get('/creator/create', creatorController.addCreatorGet);

// POST request for creating Creator
router.post('/creator/create', creatorController.addCreatorPost);

// GET request to delete Creator
router.get('/creator/:id/delete', creatorController.deleteCreatorGet);

// POST request to delete Creator
router.post('/creator/:id/delete', creatorController.deleteCreatorPost);

// GET request to update Creator
router.get('/creator/:id/update', creatorController.updateCreatorGet);

// POST request to update Creator
router.post('/creator/:id/update', creatorController.updateCreatorPost);

// GET request for one Creator
router.get('/creator/:id', creatorController.creatorDetail);

// Get request for list of all Creators
router.get('/creators', creatorController.creatorList);


/// NFT COLLECTION ROUTES ///

// GET request for adding NFT Collection. NOTE This must come before routes that display Collections (otherwise the 'create' will be considered as ID in route params)
router.get('/collection/create', nftCollectionController.addNftCollectionGet);

// POST request for creating NFT Collection
router.post('/collection/create', nftCollectionController.addNftCollectionPost);

// GET request to delete NFT Collection
router.get('/collection/:id/delete', nftCollectionController.deleteNftCollectionGet);

// POST request to delete NFT Collection
router.post('/collection/:id/delete', nftCollectionController.deleteNftCollectionPost);

// GET request to update NFT Collection
router.get('/collection/:id/update', nftCollectionController.updateNftCollectionGet);

// POST request to update NFT Collection
router.post('/collection/:id/update', nftCollectionController.updateNftCollectionPost);

// GET request for one NFT Collection
router.get('/collection/:id', nftCollectionController.nftCollectionDetail);

// Get request for list of all NFT Collections
router.get('/collections', nftCollectionController.nftCollectionList);


module.exports = router;
