const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/api');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api',routes);



app.listen(5000, function(){
    console.log('Listening on port 5000')
});