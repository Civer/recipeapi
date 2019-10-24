var MongoClient = require("mongodb").MongoClient;

var option = {
  numberOfRetries: 5,
  auto_reconnect: true,
  poolSize: 40,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

var dbPool: any;

var initDBPool = function() {
  let mongo_url: string = process.env.MONGO_URL + process.env.MONGO_PORT;
  console.log("Opening up database pool on URL: " + mongo_url);
  MongoClient.connect(mongo_url, option)
    .then((db: any) => {
      dbPool = db;
    })
    .catch((error: any) => {
      return Promise.reject(error);
    });
};

var getDB = function() {
  return new Promise(function(resolve, reject) {
    resolve(dbPool);
  });
};

/**
 * This function will find data in the MongoDB
 *
 * @param {String} collection Name of MongoDB collection
 * @param {Object} query      MongoDB conform query object
 * @param {Object} projection MongoDB conform projection object (used for filtering)
 *
 * @returns {Array.object}    MongoDB result
 */
var dbFetchData = function(collection: string, query: any, projection: any) {
  return new Promise(function(resolve, reject) {
    getDB()
      .then((db: any) => {
        var dbo = db.db(process.env.MONGO_DATABASE);

        dbo
          .collection(collection)
          .find(query, projection)
          .toArray()
          .then((result: any) => {
            resolve(result);
          })
          .catch((error: any) => {
            reject(error);
          });
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

/**
 * This function will add data to the MongoDB
 *
 * @param {String} collection                 Name of MongoDB collection
 * @param {recipe} insertObject    Array with MongoDB insert objects
 *
 * @returns {Number}                          Number of successful inserts
 */
var dbInsertData = function(collection: string, insertObject: recipe) {
  return new Promise(function(resolve, reject) {
    getDB()
      .then((db: any) => {
        var dbo = db.db(process.env.MONGO_DATABASE);

        dbo
          .collection(collection)
          .insertOne(insertObject)
          .then((result: any) => {
            resolve(result);
          })
          .catch((error: any) => {
            reject(error);
          });
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

/**
 * This function will add data to the MongoDB
 *
 * @param {string} collection       Name of MongoDB collection
 * @param {recipe} insertObject     Single Object with updated data
 * @param {object} query            query searching for existing object in DB
 *
 * @returns {Number}                Number of successful updates
 */
var dbReplaceData = function(
  collection: string,
  query: any,
  insertObject: recipe
) {
  return new Promise(function(resolve, reject) {
    getDB()
      .then((db: any) => {
        var dbo = db.db(process.env.MONGO_DATABASE);

        dbo
          .collection(collection)
          .replaceOne(query, insertObject)
          .then((result: any) => {
            resolve(result);
          })
          .catch((error: any) => {
            reject(error);
          });
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

/**
 * This function will delete data from the MongoDB
 *
 * @param {String} collection                 Name of MongoDB collection
 * @param {Object} query                      MongoDB conform query object
 *
 * @returns {Number}                          Number of successful inserts
 */
var dbDeleteData = function(collection: string, query: any) {
  return new Promise(function(resolve, reject) {
    getDB()
      .then((db: any) => {
        var dbo = db.db(process.env.MONGO_DATABASE);

        dbo
          .collection(collection)
          .deleteMany(query)
          .then((result: any) => {
            resolve(result);
          })
          .catch((error: any) => {
            reject(error);
          });
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  });
};

var dbFunctions = {
  initDBPool,

  dbFetchData,
  dbInsertData,
  dbReplaceData,
  dbDeleteData
};

module.exports = dbFunctions;
