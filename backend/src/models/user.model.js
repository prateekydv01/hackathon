import mongoose,{Schema} from "mongoose"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from "bcryptjs";

dotenv.config({
    path:"./.env"
})

const userSchema = new Schema(
    {
        fullName:{
            type:String,
            required:true,
            trim:true        
        },
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase : true,
            trim: true,
        },
        password: {
            type:String,
            required:[true,"password is required"],
        },
        profession:{
            type:String,
            required:true
        },
        avatar:{
            type:String,
            required:true
        },
        avatarPublicId:{
            type:String,
            required:true
        },
        contactNumber:{
            type:String,
            required:true,
            match: [/^\d{10}$/, 'Phone number must be 10 digits']

        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: true
            },
            address: {  // ✅ Add this field
                type: String,
                default: 'Unknown Location'
            }

        },
        aboutMe:{
            type:String,
            required:true
        },
        refreshToken:{
            type:String
        }
},{ timestamps:true });

userSchema.index({ location: '2dsphere' });

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next() 
    this.password = await bcrypt.hash(this.password,10) 
    next()  
}) 

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password) //this will return wether true or false
}

userSchema.methods.generateAccessToken = function(){
   return jwt.sign({ 
        _id : this._id,
        email : this.email,
        username : this.username
    },
     process.env.ACCESS_TOKEN_SECRET,
     {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({ 
        _id : this._id,
    },
     process.env.REFRESH_TOKEN_SECRET,
     {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    );
}

export const User = mongoose.model("User",userSchema)