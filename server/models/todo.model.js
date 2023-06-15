const mongoose = require('mongoose');


const ItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, "You need a item name!"],
        minlength: [3, "Item name must have at least 3 letters!"]
    },
    category: {
        type: String,
        required: [true, "Item must belong to a category!"],
        minlength: [3, "Category length must be at least 3 characters!"]
    },
    isFinished: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const ListSchema = new mongoose.Schema({
    items: [ItemSchema],
    colorChoice: {
        type: String,
        default: '#FFF9C4'
    }
}, {timestamps:true})


module.exports = mongoose.model('TodoList', ListSchema)