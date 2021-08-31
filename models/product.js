const mongoose=require('mongoose'); // Taaking this module into our file
const Schema=mongoose.Schema;      // using the mongoose schema 

const productSchema= new Schema({ // Creating our products
    name: {
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    maxquan: {
        type: Number,
        required: true
    }
});

module.exports=mongoose.model('Product',productSchema); // Exporting the mongoose models through name which we will use for the database 