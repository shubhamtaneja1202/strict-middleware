# Strict Middleware

Basic rate-limiting middleware for Express. Used to limit repeated requests to public APIs and/or endpoints. It can be used to rateLimit IP addresses.

## Installation

```
npm i --save strict-middlware
```

## Usage

```
const fileControllers = require('../controllers/file');
const routes = require('express').Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const {strictIpMiddleware, init} = require('../strict-ip-middleware');

// initialize middleware
// you can skip initialization if you want, the configuration will be set by default as below.
init({
allowCountPerHour : 10,
expiryTime : 360000,
response : { 
  error : { 
  message : 'too many requests'
  }
 }
})

// get the data
routes.get('/file/:id', strictIpMiddleware, async(req, res) => {
  try {
    const response = await fileControllers.getFileData(req.params.id);
    res.status(200).send({data : response, message : null});
  }
  catch(err){
    res.status(500).send({message : err.message,data: null});
  }
})

```
