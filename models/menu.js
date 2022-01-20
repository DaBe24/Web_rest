var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Menu = new Schema(
    {
        dish: String,
        description: String,
        price: Schema.Types.Number
    }
);

// Virtual for book's URL
Menu
    .virtual('url')
    .get(function () {
        return '/catalog/menu/' + this._id;
    });


module.exports = mongoose.model('Menu', Menu);