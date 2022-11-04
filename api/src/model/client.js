const mongoose = require('mongoose');

const { Schema, model } = mongoose;


const clientSchema = new Schema({
    name: String,
    lastName: String,
    age: Number,
    gender: String,
    addres: String,

},{
    timestamps: true,
    versionKey: false
}
)


module.exports = model('Client', clientSchema)