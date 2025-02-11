const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    name:{
        type:String,
        require:true
    },
    email:
    {
        type:String,
        require:true,
        unique:true
    },
    password:
    {
        type:String,
        require:true
    }
},this.applyTimestamps);
const info = mongoose.model('info',user);

module.exports = info;