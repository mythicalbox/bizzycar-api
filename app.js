var fs = require('fs');
var dir = __dirname + '/db';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var db = require('diskdb');
db.connect(__dirname + '/db', ['customers']);

const Validator = require('jsonschema').Validator;
const v = new Validator();

const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

var addressSchema = {
     "id": "/Address",
     "type": "object",
     "properties": {
       "line1": {"type": "string"},
       "line2": {"type": "string"},
       "city": {"type": "string"},
       "zip": {"type": "string"},
       "country": {"type": "string"}
     },
     "required": ["line1", "city", "zip", "country"]
   };

var vehicleSchema = {
     id: "/Vehicle",
     "type": "object",
     "properties": {
          "manufacturer": { "type": "string" },
          "model": { "type": "string" },
          "year": { "type": "number" }
     },
     "required": ["manufacturer", "model", "year"]
}

var reservationSchema = {
     id: "/Reservation",
     "type": "object",
     "properties": {
          "year": { "type": "number" },
          "month": { "type": "month" },
          "day": { "type": "number" },
          "hour": { "type": "number" },
          "minute": { "type": "number" },
          "length": { "type": "number" }
     },
     "required": ["year", "month", "day", "hour", "minute", "length"]
}

var schema = {
     "id": "/SimplePerson",
     "type": "object",
     "properties": {
       "name": {"type": "string" },
       "address": {"$ref": "/Address" },
       "vehicle": {"$ref": "/Vehicle" },
       "reservation": {"$ref": "/Reservation" },
     },
     required: ["nameFirst", "nameLast", "address", "vehicle", "reservation"]
   };

v.addSchema(addressSchema, '/Address');
v.addSchema(vehicleSchema, '/Vehicle');
v.addSchema(reservationSchema, '/Reservation');

app.get('/', (req, res) => {
     res.send('Hello World!')
});

app.put('/customer', jsonParser, (req, res) => {
     var code = 422;
     var response = {
          message: "error!"
     }
     var validationResult = v.validate(req.body, schema);
     if (validationResult.valid === true) {
          db.customers.save(req.body);

          code = 200;
          response.message = "success!";
          console.log(response.message);
     } else {
          response.errors = validationResult.errors;
     }
     res.status(code);
     res.send(JSON.stringify(response));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});