const express = require('express');
const app = express();

// If you expect webhook data as JSON
app.use(express.json());
// If you expect webhooks as plain text
app.use(express.text());
// If you expect webhooks as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


app.post('/', (req, res) => {
    res.send({ message: 'Hello Niceyyy!' });
    console.log(req.body);
});

app.listen(3000, () => {
    console.log('Application listening on port 3000!');
});