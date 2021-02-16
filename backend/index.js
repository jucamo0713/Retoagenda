const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require("cors");
const routes = require('./routes/routes');
var bodyParser = require('body-parser');

require('dotenv').config();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit:'100mb'}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({origin: '*'}));

app.use('/', routes);

app.listen(app.get('port'), () => {
	console.log(`Server run on port ${app.get('port')}`);
});