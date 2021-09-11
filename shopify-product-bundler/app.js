const express = require("express");
const app = express();

// If you expect webhook data as JSON
app.use(express.json());
// // If you expect webhooks as plain text
// app.use(express.text());
// If you expect webhooks as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const fs = require("fs");
var https = require("follow-redirects").https;
const { off } = require("process");         //JSON file reading modueles

app.post("/", (req, res) => {
  // res.send({ message: 'Node.js Server has received the data!' });
  
  // console.log(req.body.line_items);

  req.body.line_items.forEach((element) => {
    updateQuantity(element.variant_id, element.quantity);
  });

  res.status(200).json({ message: "Node.js Server has received the data!" });

});

function updateQuantity(variant_id, quantity) {
  console.log(variant_id + " - " + quantity);

  const data = fs.readFileSync("./database.json", "utf8");

  // parse JSON string to JSON object
  const databases = JSON.parse(data);

  // print all databases
  databases.forEach((db) => {
    // console.log(db.variant_id);

    if(db.id == variant_id) {

      console.log ("Variant id matched");

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
  
  var options = {
    method: "POST",
    hostname: "beerco-pty-ltd.myshopify.com",
    path: "/admin/api/2021-07/inventory_levels/adjust.json",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic NWUwYzlkMGVlNzg5OTc1MTQ3ZWJkNzBkNWQ3MWNiMWY6c2hwcGFfMmQ4ZTdkMDRjOTFiYzk2OWJjZGU3NjRkMjUyYjA2ODY="
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
  params.location_id = 285966342;                //BeerCo Warehouse Location ID
  params.inventory_item_id = inventory_item_id;
  params.available_adjustment = quantity * -1;
  var postData = JSON.stringify(params);

  req.write(postData);

  req.end();

  console.log("POST request successful!");
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Application listening on port 3000!");
});
