// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

//============================== products Schema========================================
const productsSchema = new Schema({
    title: { type: String, required: true },                    
    seller: { type: String, required: true },
    description: { type: String, required: true },  
    price: { type: Number, required: true },
    condition: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    imageURL: { type: String, required: true},
    password: {type:String, required:true},
    category:{type:String, required:true},
    status: { type: String, default: "Available" }, // Add status field
    username: String,
    createdAt: { type: Date, default: Date.now } // Automatically set to the current timestamp
});

// Compile model from schema
const productsModel = mongoose.model("products", productsSchema);
module.exports = productsModel;