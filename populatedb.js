#! /usr/bin/env node


console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async')
const NftCollection = require('./models/nftCollection')
const Creator = require('./models/creator')
const NFT = require('./models/nft');
const fs = require('fs');
const path = require('path');


const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const creators = []
const nftcollections = []
const nfts = []

// Create a creator document, and save to the mongoDB collection 'creators'
function creatorCreate(name, cb) {
  creatordetail = { name: name }
  
  const creator = new Creator(creatordetail);
       
  creator.save(function (err) {
    if (err) {
      cb(err, null)
      return;
    }
    console.log('New Creator: ' + creator);
    creators.push(creator)
    cb(null, creator)
  });
}

// Create an NftCollection document, and save to the mongoDB collection 'nftcollections'
function nftCollectionCreate(name, description, cb) {
  nftCollectiondetail = { name: name, description: description }
  
  const nftCollection = new NftCollection(nftCollectiondetail);
       
  nftCollection.save(function (err) {
    if (err) {
      cb(err, null)
      return;
    }
    console.log('New NFT Collection: ' + nftCollection);
    nftcollections.push(nftCollection)
    cb(null, nftCollection)
  });
}

// Create an nft document, and save to the mongoDB collection 'nfts'
function nftCreate(name, description, creator, currentPrice, nftCollection, imgData, cb) {
  nftdetail = { 
    name: name,
    description: description,
    creator: creator,
    nftCollection: nftCollection,
    currentPrice: currentPrice,
    img: {
      data: imgData,
      contentType: 'image/png'
    },
  }    
    
  const nft = new NFT(nftdetail);    

  nft.save(function (err) {
    if (err) {
      console.log(err);
      return
    }
    console.log('New NFT: ' + nft);
    nfts.push(nft)
    cb(null, nft)
  });
}


function createCreators(cb) {
  async.series([
    function(callback) {
      creatorCreate('BoredApeYachtClub', callback);
    },
    function(callback) {
      creatorCreate('Larva Labs', callback);
    },
    function(callback) {
      creatorCreate('TheLongLost', callback)
    },
  ],
  // optional callback
  cb);
}

function createNftCollections(cb) {
  async.series([
    function(callback) {
      nftCollectionCreate('Bored Ape Yacht Club', "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.", callback);
    },
    function(callback) {
      nftCollectionCreate('CryptoPunks', "CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard. They have been featured in places like The New York Times, Christie;'s of London, Art|Basel Miami, and The PBS NewsHour.", callback);
    },
    function(callback) {
      nftCollectionCreate('The Long Lost', "Long Lost is a 10,000 piece genesis collection from the '5th Dimension Collective.'", callback);
    },
  ],
  // optional callback
  cb);
}

// Read image data from files associated with the specific NFT
function createNfts(cb) {
  async.parallel([
    function(callback) {
      nftCreate('CryptoPunk #462', 'Male with sunglasses, cap forward, and a clown nose.', creators[1], 120, nftcollections[1], fs.readFileSync(path.resolve(__dirname, 'public/data/uploads/a418a4f3314aaabc15dc5cabe48b9b0a.txt')), callback);
    },
    function(callback) {
      nftCreate('CryptoPunk #1115', 'Female with wild white hair and hot lipstick.', creators[1], 7, nftcollections[1], fs.readFileSync(path.resolve(__dirname, 'public/data/uploads/19192e21dd42859a02c4b9a83052061d.txt')), callback);
    },
    function(callback) {
      nftCreate('Long Lost #9959', 'Purple BG, striped hoodie, lost cap, small pupils, no tatoos, confused, red zombie.', creators[2], 2, nftcollections[2], fs.readFileSync(path.resolve(__dirname, 'public/data/uploads/2b0a4556964de2c2443d980b89a6bb30.txt')), callback);
    },
    function(callback) {
      nftCreate('Long Lost #6720', 'Yellow BG, green eye crew, portal eyes, greenghoul, dizzy, gold grills', creators[2], 18, nftcollections[2], fs.readFileSync(path.resolve(__dirname, 'public/data/uploads/50792468c18cee9de2985a0468bf16b8.txt')), callback);
    },
    function(callback) {
      nftCreate('#7703', 'Orange BG, Bayc black tee, silver stud, sleepy, pink fur, fez.', creators[0], 105, nftcollections[0], fs.readFileSync(path.resolve(__dirname, 'public/data/uploads/358a580f72f02bbb38f5ce9a9a31ff4a.txt')), callback);
    },
    function(callback) {
      nftCreate('#7202', 'Gray BG, blue dress, brown fur, angry, unshaved, halo.', creators[0], 106, nftcollections[0], fs.readFileSync(path.resolve(__dirname, 'public/data/uploads/231c5695028cc3840df43bb1529cb0da.txt')), callback);
    },
  ],
  // optional callback
  cb);
}


async.series([
  createCreators,
  createNftCollections,
  createNfts
],
// Optional callback
function(err, results) {
  if (err) {
    console.log('FINAL ERR: '+err);
  }
  else {
    console.log('Added data');
  }
  // All done, disconnect from database
  mongoose.connection.close();
});

