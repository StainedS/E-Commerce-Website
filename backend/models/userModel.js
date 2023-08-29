import mongoose, { model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please Enter Your Name"],
        maxLength: [40,"Cannnot exceed more than 40 letters limit(spaces included)"],
        minLength: [4,"Cannot be less than 4 Characters"]
    },
    email:{
        type:String,
        required: [true,"Please Enter Your E - Mail"],
        unique: true,
        validator : [validator.isEmail,"Please Enter a valid Email"]
    },
    password : {
        type : String,
        required: [true,"Please Enter Your Password"],
        minLength: [8,"Please Enter more than 8 Characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
            required:true
           },
           url:{
            type:String,
            required:true
           } 
    },
    role:{
        type:String,
        default: "user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

});

//it is an event before save of user schema
userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
});


//JWT Token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });

};

//Compare Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

//Generating Password Reset Token

userSchema.methods.getResetPasswordToken = function() {
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");


    //Hashing and Adding resestPassowrdToken to User SChema

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;

}


export default mongoose.model('User',userSchema);