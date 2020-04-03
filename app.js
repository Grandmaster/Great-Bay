// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");

// Connection
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Chidi17",
  database: "items_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
});

// Initial prompt
inquirer
  .prompt([
    {
      type: "list",
      message: "Would you like to bid on an item or post one?",
      name: "bidOrPost",
      choices: ["Bid", "Post"],
    },
  ])
  .then(function (response) {
    // console.log(response);
    if (response.bidOrPost === "Post") {
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the name of the object you want to post?",
            name: "name",
          },
          {
            type: "number",
            message: "What is the price of this item?",
            name: "price",
          },
        ])
        .then(function (response) {
          createPostItem(response);
        });
    } else if (response.bidOrPost === "Bid") {
      var items = readItems();
    items = items.filter(object => {
        return object.bid_items === true;
    });
    items = items.map(object => {
        return object.name
    })
      inquirer.prompt({
          type: 'list',
          message: 'Which item would you like to bid on?',
          name: 'item',
          choices: items
  }).then(function(response){
      console.log(response);
  })

// function to create item
function createPostItem(object) {
  console.log("Inserting a new item...\n");
  Object.assign(object, { post_items: true });
  var query = connection.query("INSERT INTO items SET ?", object, function (
    err,
    res
  ) {
    if (err) throw err;
    console.log(res.affectedRows + " item inserted!\n");
    readItems();
  });
}

function createBidItem(object) {
  console.log("Inserting a new item...\n");
  Object.assign(object, { bid_items: true });
  var query = connection.query("INSERT INTO items SET ?", object, function (
    err,
    res
  ) {
    if (err) throw err;
    console.log(res.affectedRows + " item inserted!\n");
    readItems();
  });
}

function readItems(bid) {
  console.log("Selecting all items...\n");
  connection.query("SELECT * FROM items WHERE ?", { bid_items: 1 }, function (
    err,
    res
  ) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
}
