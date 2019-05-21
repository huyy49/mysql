var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');

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

connection.connect(function (err) {
  if (err) throw err;
  readProducts();
});

function nextAction() {
  // once you have the items, prompt the user for which they'd like to bid on
  inquirer
    .prompt([
      {
        name: "next",
        type: "rawlist",
        choices: ["View products", "Make an order", "Quit"],
        message: "What would you like to do?"
      },
    ])
    .then(function (answer) {
      // respond based on answer
      switch (answer.next) {
        case "View products": readProducts();
          break;
        case "Make an order": buyProducts();
          break;
        case "Quit": connection.end();
          break;
      };
    });
};

function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    // console.log(res);
    // use table module to display the mysql results in a table
    var table = new Table({
      head: ['item_id', 'product_name', 'department_name', 'stock_quantity', 'price']
      , style: {
        head: []    //disable colors in header cells
        , border: []  //disable colors for the border
      }
      // , colWidths: [6, 21, 25, 17]  //set the widths of each column (optional)
    });

    // push all mysql rows to the table
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        res[i].stock_quantity,
        res[i].price],
      );
    };

    console.log(table.toString());
    nextAction();
  });
};

function buyProducts() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function () {
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
      .then(function (answer) {
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
            function (error) {
              if (error) throw err;
              console.log("Order placed successfully!");
              nextAction();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Insufficient quantity!");
          nextAction();
        }
      });
  });
};
