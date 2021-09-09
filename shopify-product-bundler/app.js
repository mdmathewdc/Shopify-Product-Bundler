const express = require("express");
const app = express();

// If you expect webhook data as JSON
app.use(express.json());
// // If you expect webhooks as plain text
// app.use(express.text());
// If you expect webhooks as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const fs = require("fs");
const { off } = require("process");         //JSON file reading modueles

app.post("/", (req, res) => {
  // res.send({ message: 'Node.js Server has received the data!' });
  res.status(200).json({ message: "Node.js Server has received the data!" });
  // console.log(req.body.line_items);

  req.body.line_items.forEach((element) => {
    updateQuantity(element.variant_id, element.quantity);
  });
});

function updateQuantity(variant_id, quantity) {
  console.log(variant_id + " " + quantity);

  const data = fs.readFileSync("./database.json", "utf8");

  // parse JSON string to JSON object
  const databases = JSON.parse(data);

  // print all databases
  databases.forEach((db) => {
    console.log(db.variant_id);

    if(db.variant_id === variant_id) {

        for (var key in db.adjuncts) {
            console.log("Variant id :" + key);                     //inventory_item_id
            console.log("Quantity :" + db.adjuncts[key]);        //quantity

            makePostRequest(key, db.adjuncts[key]);
        }

    }

    console.log(`$$`);
  });
}

function makePostRequest(inventory_item_id, quantity) {

  console.log("Make Post Request Invoked");
  
  var https = require("follow-redirects").https;
  var fs = require("fs");

  var options = {
    method: "POST",
    hostname: "beerco-pty-ltd.myshopify.com",
    path: "/admin/api/2021-07/inventory_levels/adjust.json",
    headers: {
      "Content-Type": "application/json",
    },
    maxRedirects: 20,
  };

  var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  var params = {};
  params.location_id = 285966342;           //BeerCo Warehouse Location ID
  params.inventory_item_id = inventory_item_id;
  params.available_adjustment = quantity * -1;
  var postData = JSON.stringify(params);

//   var postData = JSON.stringify({
//     location_id: 285966342,
//     inventory_item_id: 33098662936622,
//     available_adjustment: -1,
//   });

  req.write(postData);

  req.end();

  console.log("POST request successful!");
}

app.listen(3000, () => {
  console.log("Application listening on port 3000!");
});
