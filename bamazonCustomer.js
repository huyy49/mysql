var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "YHuPass123$",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  readProducts();
});

function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    buyProducts();
  });
}

function buyProducts() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].item_id);
            }
            return choiceArray;
          },
          message: "What's the ID of the product that you would like to buy?"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many would you like to buy?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        // console.log(answer.choice);
        for (var i = 0; i < res.length; i++) {
          // console.log(res[i]);
          if (res[i].item_id === answer.choice) {
            chosenItem = res[i];
            // console.log(chosenItem);
          }
        }

        // determine if bid was high enough
        console.log('Quantity Available: ' + chosenItem.stock_quantity);
        console.log('Quantity Requested: ' + answer.quantity);
        if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: chosenItem.stock_quantity - answer.quantity
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Order placed successfully!");
              connection.end();
              // start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Insufficient quantity!");
          connection.end();
          // start();
        }
      });
  });
}
