const express = require('express');
const mongoose = require('mongoose')
const config = require('./config');
const record = require('./models/model_record');
const bodyParser = require('body-parser')

const router = express.Router();

const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()

router.get('/', (req, res, next) => {
     mongoose.connect('mongodb+srv://' + config.db_config.user + ':' + config.db_config.pass + '@' + config.db_config.cluster + '/' + config.db_config.db + '?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {

        if (err)
            throw err;

        record.find({}, (err, entries) => {
            res.status(200).json(entries);
        })
    })  
});

router.get('/last/:user/:datesk', (req, res, next) => {
    mongoose.connect('mongodb+srv://' + config.db_config.user + ':' + config.db_config.pass + '@' + config.db_config.cluster + '/' + config.db_config.db + '?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
       const user = req.params.user;
       const datesk = req.params.datesk;
    
       if (err)
           throw err;

       record
       .find(
        {name : user, datesk : { $lt: datesk }},
        (err, entries) => {

            if(entries.length > 0)
                entries = entries.slice(0,1);

            res.status(200).json(entries);
       })
       .sort({datesk : -1});
   })  
});

router.get('/:user/:datesk', (req, res, next) => {
    mongoose.connect('mongodb+srv://' + config.db_config.user + ':' + config.db_config.pass + '@' + config.db_config.cluster + '/' + config.db_config.db + '?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
       const user = req.params.user;
       const datesk = req.params.datesk;
    
       if (err)
           throw err;

       record.find({name : user, datesk : datesk}, (err, entries) => {
           res.status(200).json(entries);
       })
   })  
});

router.post('/', jsonParser, (req, res, next) => {
    mongoose.connect('mongodb+srv://' + config.db_config.user + ':' + config.db_config.pass + '@' + config.db_config.cluster + '/' + config.db_config.db + '?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {

       if (err)
           throw err;

       record.findOneAndUpdate(
           {name: req.body.name, datesk: req.body.datesk}, req.body, { upsert: true, returnNewDocument:true, new: true }
        )
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err.message);
            res.sendStatus(400);
        })

  
   })  
});

module.exports = router;