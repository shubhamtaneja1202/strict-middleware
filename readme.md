# Strict Middleware

Basic rate-limiting middleware for Express. Used to limit repeated requests to public APIs and/or endpoints. It can be used to rateLimit IP addresses.

## Installation

```
npm i --save ratelimiter-middleware
```

## Usage

```
const fileControllers = require('../controllers/file');
const routes = require('express').Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const {strictIpMiddleware} = require('../strict-ip-middleware');


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