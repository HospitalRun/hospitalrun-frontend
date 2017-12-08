var camelize = require('camelize');
var config = require('../config.js');
var fs = require('fs');
var moment = require('moment');
var nano = require('nano')(config.couchAuthDbURL);
var parse = require('csv-parse');
var relPouch = require('relational-pouch');
var uuid = require('node-uuid');

var maindb = nano.use('main');
var inventoryMap = {};
var locationMap = {};
var aisleMap = {};
var types = {};
var units = {};
var inventoryToImport;
var numItems = 0;
var friendlyIdsUsed = {};
var importDateReceived;

var parser = parse({columns: true, trim: true, auto_parse: true}, function(err, data) {
  if (err) {
    console.log('Error parsing csv file:', err);
  } else {
    inventoryToImport = data;
    relPouch.setSchema([]);
    processItem(inventoryToImport.shift());
  }
});

if (process.argv.length < 4) {
  console.log('Usage: node inv-import.js file.csv YYYY-MM-DD');
} else {
  importDateReceived = moment(process.argv[3]).toDate();
  fs.createReadStream(process.argv[2]).pipe(parser);
}

function convertToInt(number) {
  if (number) {
    if (number.replace) {
      number = number.replace(',', '');
    }
    return parseInt(number);
  } else {
    return 0;
  }
}

function isEmpty(obj) {
  if (!obj || obj === '') {
    return true;
  } else {
    return false;
  }
}

function formatLocationName(location, aisleLocation) {
  var locationName = '';
  if (!isEmpty(location)) {
    locationName += location;
    if (!isEmpty(aisleLocation)) {
      locationName += ' : ';
    }
  }
  if (!isEmpty(aisleLocation)) {
    locationName += aisleLocation;
  }
  return locationName;
}

function addPurchase(csvItem, inventoryDetails, callback) {
  var purchaseId = getNewId('inv-purchase');
  var newPurchase = {
    _id: purchaseId,
    data: {
      aisleLocation: csvItem.aisleLocation,
      currentQuantity: convertToInt(csvItem.quantity),
      dateReceived: importDateReceived,
      inventoryItem: inventoryDetails.item._id,
      location: csvItem.location,
      lotNumber: csvItem.lotNumber,
      originalQuantity: convertToInt(csvItem.quantity),
      purchaseCost: convertToInt(csvItem.purchaseCost),
      vendor: csvItem.vendor,
      vendorItemNo: csvItem.vendorItemNo
    }
  };
  if (!isEmpty(csvItem.expirationDate)) {
    newPurchase.data.expirationDate = moment(csvItem.expirationDate, 'MM/DD/YY').toDate();
  }
  if (csvItem.giftInKind === 'Yes') {
    newPurchase.data.giftInKind = true;
  }
  inventoryDetails.item.data.quantity += newPurchase.data.currentQuantity;

  if (
    newPurchase.data.currentQuantity === 0 &&
    inventoryDetails.item.data.purchases &&
    inventoryDetails.item.data.purchases.length > 0
  ) {
    // Don't save a purchase of zero quantity if the item already exists
    console.log('Skipping purchase because of zero quantity and it already exists: ', csvItem);
    callback();
  } else {
    // Insert purchase
    updateRecord(newPurchase, function(err) {
      if (err) {
        callback(err);
      } else {
        if (!inventoryDetails.item.data.purchases) {
          inventoryDetails.item.data.purchases = [];
        }
        var parsedId = relPouch.rel.parseDocID(purchaseId).id;
        inventoryDetails.item.data.purchases.push(parsedId);
        // Update insert location
        addPurchaseToLocation(inventoryDetails, newPurchase, function(err) {
          // Update inventory item
          if (err) {
            callback(err);
          } else {
            updateRecord(inventoryDetails.item, callback);
          }
        });
      }
    });
  }
}

function updateRecord(record, callback) {
  var updateParams = record._id;
  maindb.insert(record, updateParams, function(err, body) {
    if (err) {
      callback(err);
    } else {
      record._id = body.id;
      record._rev = body.rev;
      callback(null, record);
    }
  });
}

function addPurchaseToLocation(inventoryDetails, purchase, callback) {
  var locationToFind = formatLocationName(purchase.data.location, purchase.data.aisleLocation);
  var locationRecord = inventoryDetails.locations[locationToFind];
  if (inventoryDetails.locations[locationToFind]) {
    locationRecord.data.quantity += purchase.data.originalQuantity;
  } else {
    var locationId = getNewId('inv-location');
    locationRecord = {
      _id: locationId,
      data: {
        aisleLocation: purchase.data.aisleLocation,
        location: purchase.data.location,
        quantity: purchase.data.originalQuantity
      }
    };
    if (!inventoryDetails.item.data.locations) {
      inventoryDetails.item.data.locations = [];
    }
    var parsedId = relPouch.rel.parseDocID(locationId).id;
    inventoryDetails.item.data.locations.push(parsedId);
    inventoryDetails.locations[locationToFind] = locationRecord;
  }
  updateRecord(locationRecord, callback);
}

function processItem(item) {
  if (item) {
    handleItem(item, function(err) {
      if (err) {
        console.log('Got error while processing item', item, err);
      } else {
        if (!aisleMap[item.aisleLocation]) {
          aisleMap[item.aisleLocation] = true;
        }
        if (!locationMap[item.location]) {
          locationMap[item.location] = true;
        }
      }
      numItems++;
      processItem(inventoryToImport.shift());
    });
  } else {
    console.log('DONE, processed ' + numItems);
    updateLocations(function(err) {
      if (err) {
        console.log('Error updating locations: ', err);
      } else {
        console.log('SUCCESS updating locations.');
      }
    });
  }
}

function handleItem(item, callback) {
  var inventoryDetails = inventoryMap[item.name];
  if (!inventoryDetails) {
    createInventoryItem(item, function(err, newInventoryItem) {
      if (err) {
        console.log('Error inserting inventory item:', err);
        callback(err);
      } else {
        var inventoryDetails = {
          item: newInventoryItem,
          locations: {}
        };
        inventoryMap[item.name] = inventoryDetails;
        addPurchase(item, inventoryDetails, callback);
      }
    });
  } else {
    addPurchase(item, inventoryDetails, callback);
  }
}

function insertInventoryItem(item, callback) {
  getFriendlyId(item, function(err, id) {
    if (err) {
      console.log('Error getting friendlyId: ', err);
      callback(err);
    } else {
      friendlyIdsUsed[id] = true;
      item.data.friendlyId = id;
      item._id = generateId();
      updateRecord(item, callback);
    }
  });
}

function getFriendlyId(item, callback) {
  sequence_id = getNewId('sequence', 'inventory_' + item.data.inventoryType);
  maindb.get(sequence_id, function(err, sequence) {
    if (err) {
      findSequence(item.data.inventoryType, function(err, sequence) {
        if (err) {
          callback(err);
        } else {
          generateFriendlyId(sequence, callback);
        }
      });
    } else {
      generateFriendlyId(sequence, callback);
    }
  });
}

function buildFriendlyId(sequence) {
  var friendlyId = sequence.data.prefix;
  sequence.data.value += 1;
  if (sequence.data.value < 100000) {
    friendlyId += String('00000' + sequence.data.value).slice(-5);
  } else {
    friendlyId += sequence.data.value;
  }
  return friendlyId;
}

function generateFriendlyId(sequence, callback) {
  var friendlyId;
  while (!friendlyId || friendlyIdsUsed[friendlyId]) {
    friendlyId = buildFriendlyId(sequence);
  }
  updateRecord(sequence, function(err) {
    if (err) {
      console.log('ERROR INSERTING SEQUENCE', err);
      callback(err);
    } else {
      callback(null, friendlyId);
    }
  });
}

function generateId() {
  var min = 1;
  var max = 999;
  var part1 = new Date().getTime();
  var part2 = Math.floor(Math.random() * (max - min + 1)) + min;
  return getNewId('inventory', part1.toString(36) + '_' + part2.toString(36));
}

function createInventoryItem(item, callback) {
  var inventoryItem = {
    data: {
      name: item.name,
      distributionUnit: item.distributionUnit,
      quantity: 0, // Quantity gets added via purchases
      inventoryType: item.type,
      crossReference: item.crossReference
    }
  };
  if (!types[item.inventoryType]) {
    types[item.inventoryType] = true;
  }
  if (!units[item.distributionUnit]) {
    units[item.distributionUnit] = true;
  }
  insertInventoryItem(inventoryItem, callback);
}

function findSequence(type, callback) {
  checkNextSequence(type, 0, function(err, prefixChars) {
    var newSequence = {
      _id: getNewId('sequence', 'inventory_' + type),
      data: {
        prefix: type.toLowerCase().substr(0, prefixChars),
        value: 0
      }
    };
    callback(null, newSequence);
  });
}

function findSequenceByPrefix(type, prefixChars, callback) {
  maindb.list({
    key: 'data.prefix',
    startskey: type.toLowerCase().substr(0, prefixChars)
  }, callback);
}

function checkNextSequence(type, prefixChars, callback) {
  prefixChars++;
  findSequenceByPrefix(type, prefixChars, function(err, result) {
    if (err) {
      console.log('error finding by prefix: ' + prefixChars, err);
      callback(err);
    } else {
      if (result.rows.length > 0) {
        checkNextSequence(type, prefixChars, callback);
      } else {
        // Record doesn't exist, use current prefix
        callback(null, prefixChars);
      }
    }
  });
}

function locationMatch(locations, location) {
  var foundMatch = false;
  for (var i = 0; i < locations.length; i++) {
    if (locations[i] === location) {
      foundMatch = true;
      break;
    }
  }
  return foundMatch;
}

function addNewLocations(listname, locationMap, callback) {
  maindb.get(listname, function(err, list) {
    if (err) {
      list = {
        _id: listname,
        data: {
          value: []
        }
      };
    }
    var updateList = false;
    for (var location in locationMap) {
      if (location && location !== '') {
        var existingLocation = locationMatch(list.data.value, location);
        if (!existingLocation) {
          console.log('location doesn\'t exist adding: ', location);
          list.data.value.push(location);
          updateList = true;
        }
      }
    }
    if (updateList) {
      updateRecord(list, callback);
    } else {
      callback();
    }
  });
}

function updateLocations(callback) {
  var warehouse_list_id = getNewId('lookup', 'lookup_warehouse_list');
  addNewLocations(warehouse_list_id, locationMap, function(err) {
    if (err) {
      callback(err);
    }
    var aisle_location_list_id = getNewId('lookup', 'aisle_location_list');
    addNewLocations(aisle_location_list_id, aisleMap, callback);
  });
}

/**
 * Returns a valid _id for use with ember-pouch using a doc's type and id
 * properties.
 *
 * The format is <type>_<id type>_<id>. The <id type> depends on the id. If the
 * id is undefined the value is 0. If the id is a number, the value is 1, if
 * the id is a string the value is 2, and if the id is an object the value is
 * 3.
 *
 * @param {*} type the document type
 * @param {*} id defaults to uuid.v4()
 */
function getNewId(type, id = uuid.v4().toUpperCase()) {
  // ember-pouch convention; uppercase uuid and camelize type
  return relPouch.rel.makeDocID({id, type: camelize(type)});
}
