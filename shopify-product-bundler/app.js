const express = require('express');
const app = express();

// If you expect webhook data as JSON
app.use(express.json());
// // If you expect webhooks as plain text
// app.use(express.text());
// If you expect webhooks as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const fs = require('fs');
const { off } = require('process');


app.post('/', (req, res) => {
    // res.send({ message: 'Node.js Server has received the data!' });
    res.status(200).json({ message: 'Node.js Server has received the data!' });
    // console.log(req.body.line_items);

    req.body.line_items.forEach(element => {

        updateQuantity(element.variant_id, element.quantity);

    });

});

function updateQuantity(variant_id, quantity) {

    // console.log(variant_id + " " + quantity);

    const data = fs.readFileSync('./database.json', 'utf8');

        // parse JSON string to JSON object
        const databases = JSON.parse(data);

        Object.keys(databases).forEach(function(key) {

            console.log(key);
            console.log(databases[key]);
          
          });

        // print all databases
        databases.forEach(db => {
            console.log(db.variant_id);

            // if(db.variant_id === variant_id) {
                console.log(db.adjuncts);
                
                for (var key in db.adjuncts) {
                    console.log(key);
                    console.log(db.adjuncts[key]);
                }
            
            // }
       
            console.log(`$`)
        });

}

app.listen(3000, () => {
    console.log('Application listening on port 3000!');
});