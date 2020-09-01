const mongoose = require('mongoose');
const recordSchema = require('../schema/schema_record')

module.exports = mongoose.model('record', new mongoose.Schema(recordSchema));