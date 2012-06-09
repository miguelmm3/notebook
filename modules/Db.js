var pg = require( 'pg' );
var env = require("./Properties.js");

var dbUrl = env.map.DB_URL +"/"+env.map.DB_NAME;
//var dbUrl = env.map.DOTCLOUD_DATA_DB_URL + "/"+env.map.DB_NAME;

var client = new pg.Client( dbUrl );
client.connect();

var ifTableAlreadyExistLogAMessage = function(){
  console.log("ERROR tables already exist")
};

var query = client.query("CREATE TABLE class ( id SERIAL PRIMARY KEY, json text)");
query.on("error", ifTableAlreadyExistLogAMessage);

query = client.query("CREATE TABLE user (type text, id text, name text)")
query.on("error",ifTableAlreadyExistLogAMessage);

exports.db = client;
