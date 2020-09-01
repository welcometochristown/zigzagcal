const express = require('express');
const mongoose = require('mongoose')

const config = require('./config');
const record = require('./models/model_record');

const router = express.Router();

router.get('/', (req, res, next) => {
     mongoose.connect('mongodb+srv://' + config.db_config.user + ':' + config.db_config.pass + '@' + config.db_config.cluster + '/' + config.db_config.db + '?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {

        if (err)
            throw err;

        record.find({}, (err, duties) => {
            res.status(200).json(duties);
        })
    })  
});

router.get('/:user', (req, res, next) => {
    mongoose.connect('mongodb+srv://' + config.db_config.user + ':' + config.db_config.pass + '@' + config.db_config.cluster + '/' + config.db_config.db + '?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
       const user = req.params.user
    
       if (err)
           throw err;

       record.find({name : user}, (err, duties) => {
           res.status(200).json(duties);
       })
   })  
});

router.post('/:user', (req, res, next) => {
    mongoose.connect('mongodb+srv://' + config.db_config.user + ':' + config.db_config.pass + '@' + config.db_config.cluster + '/' + config.db_config.db + '?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
       const user = req.params.user
    
       if (err)
           throw err;

       record.find({name : user}, (err, duties) => {
           res.status(200).json(duties);
       })
   })  
});

module.exports = router;