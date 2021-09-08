const express = require('express');
const app = express();

// If you expect webhook data as JSON
app.use(express.json());
// // If you expect webhooks as plain text
// app.use(express.text());
// If you expect webhooks as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


app.post('/', (req, res) => {
    // res.send({ message: 'Node.js Server has received the data!' });
    res.status(200).json({ message: 'Node.js Server has received the data!' });
    // console.log(req.body.line_items);
    req.body.line_items.forEach(element => {
        // console.log(element.variant_id);
        // console.log(element.quantity);

        updateQuantity(element.variant_id, element.quantity);

    });

});

function updateQuantity(variant_id, quantity) {

    console.log(variant_id + " " + quantity);

}

app.listen(3000, () => {
    console.log('Application listening on port 3000!');
});