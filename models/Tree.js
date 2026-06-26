const mongoose = require('mongoose');

const treeSchema = new mongoose.Schema({
    treename: {
        type: String,
        required: [true, 'Tree name is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('TreeCollection', treeSchema, 'TreeCollection');
