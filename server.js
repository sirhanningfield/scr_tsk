const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/api.routes');
const expressValidator = require('express-validator');


const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// Express Validator
app.use(expressValidator());
app.use('/api',routes);





app.listen(5000, function(){
    console.log('Listening on port 5000')
});