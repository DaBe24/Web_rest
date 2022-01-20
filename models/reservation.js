//Требуется Mongoose
var mongoose = require('mongoose');

//Определяем схему
var Schema = mongoose.Schema;

var Reservation = new Schema({
    n_table: Schema.Types.Number,
    name: String,
    a_date: { type: Date, default: Date.now }
});

Reservation
    .virtual('url')
    .get(function () {
        return '/catalog/reservation/' + this._id;
    });


module.exports =  mongoose.model('Reservation', Reservation );