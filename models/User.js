const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name : {
        type : String ,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String ,
        required : true
    },
    role : {
        type : String ,
        enum : ["student" , "teacher" , "admin"],
        default : "student"
    },
    isApproved :{
        type : Boolean ,
        default : false
    }
});

module.exports = mongoose.model("User" , UserSchema);
