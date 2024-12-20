// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

//============================== Users Schema========================================
const UsersModelSchema = new Schema({
    username: {type:String, required:true},
    //salt:{type:String, required:true},
    //hash:{type:String, required:true},
    password: {type:String, required:true}
});

// Compile model from schema
const UsersModel = mongoose.model("users", UsersModelSchema);
module.exports = UsersModel;


