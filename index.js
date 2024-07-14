
const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { type } = require('os');

app.use(express.json());
app.use(cors({
    origin: '*', // Allow Any Origin
    methods: ['GET', 'POST'],
    credentials: true,
}));

//DataBase Connect With MongoDB
mongoose.connect('mongodb+srv://richieeeojok:j1Md0ChI35o04IME@cluster0.wtdjxfs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Ecommerce')


//api Creation

app.get('/', (req,res)=>{
    res.send("Express App is Running")
})

//image storage

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file,cb)=> {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({storage:storage})

//Creating upload Engpoit for images

app.use('/images', express.static('upload/images'))

app.post('/upload', upload.single('product'), (req,res)=>{
    res.json({
        success:1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for Creating Products

const AutoIncrement = require('mongoose-sequence')(mongoose);

const ProductSchema = new mongoose.Schema({
    // id:{
    //     type: Number,
    //     required: true
    // },
    name:{
        type: String,
        require: true,
    },
    image:{
        type:String,
        required: true,
    },
    category:{
        type:String,
        required: true,
    },
    new_price:{
        type: Number,
        required: true,
    },
    old_price:{
        type: Number,
        required: true,
    },
    date:{
        type: Number,
        default:Date.now(),
    },
    available:{
        type:Boolean,
        default: true,
    },
})

ProductSchema.plugin(AutoIncrement, { inc_field: 'id' });

const Product = mongoose.model("Product", ProductSchema);

app.post('/addproduct', async (req,res) =>{
    const product = new Product({
        // id:req.body.id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved to DB")
    res.json({
        success:true, 
        name:req.body.name,
    })


})

//API to delete product

app.post('/removeproduct', async (req,res) =>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed from DB");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//API Getting All Products

app.get('/allproducts', async (req,res) =>{

    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

//Schema for creating USer Model

const Users = mongoose.model('Users',{

    name:{
        type: String,
    },
    email:{
        type: String,
        unique: true,
    },
    password:{
        type: String,
    },
    cartData:{
        type: Object,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

//Creating Engpoint user creation
app.post('/signup', async (req,res) =>{

    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false, errors:"Users Already Exisits with Email Address"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++){
        cart[i]=0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
    await user.save();

    const data = {
        user:{
            id:user.id,
        }
    }
    const token = jwt.sign(data, 'secret_ecom');
    console.log("Signed Up to DB");
    res.json({
        success:true,
        token,
    })
})

//user login endpoint
app.post('/login', async (req,res) =>{

    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if (passCompare){
            const data = {
                user:{
                    id:user.id,
                }
            }
            const token = jwt.sign(data,'secret_ecom')
            console.log("User Signed In");
            res.json({
                success:true, 
                token
            })
        } else {
            res.json({success:false,errors: "Wrong Password, Please Try Again" });
        }
    } else {
        res.json({success:false, errors: "Wrong Email Address, Please Try Again"})
    }
})

//endpoint for newcollection Data
app.get('/newcollections', async (req,res) =>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New Collection Fetched");
    res.send(newcollection);
})

//endpoint for Popular Women Data
app.get('/popularinwomen', async (req,res) =>{
    let products = await Product.find({category:"women"});
    let popular = products.slice(0,4);
    console.log("Popular Womens Items Fetched");
    res.send(popular);
})

//middleware to fetch user

const fetchUser = async (req,res,next) =>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please Sign In"})
    } else{
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"Please Sign In this is no game"})
        }
    }

}


//endpoint for products in cartdata
app.post('/addtocart', fetchUser, async (req,res) =>{

    console.log("Added This Item Baby", req.body.itemId)
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    // res.send("Added")
})

//endpoint for remove product from db
app.post('/removefromcart', fetchUser, async (req,res) =>{

    console.log("Removed This Item Baby", req.body.itemId)
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    // res.send("Removed")
})

//endpoint to get cart data
app.post('/getcart', fetchUser, async (req,res) =>{

    console.log("All of your Cart Items Baby")
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})




app.listen(port,'0.0.0.0', (error)=>{
    if(!error){
        console.log("Server Running on Port " +port)
    }else{
        console.log("Error Starting Node: " +error)
    }
})