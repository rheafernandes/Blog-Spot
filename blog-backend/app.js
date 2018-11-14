const express =require('express');
const app=express();
// To set a middleware (incoming req should pass through app use)
//next is a function argument to move the req to the next middleware
const morgan= require('morgan');
const bodyParser= require('body-parser');
//This is a package for easy connection setup to mongodb
const mongoose=require('mongoose');


//CORS handling, RESTful API's should allow all
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,Authorization"
    );
    if(req.method=== 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET,PUT');
        return res.status(200).json({});
    }
    next();
});

const blogpostRoutes=require('./api/routes/blogposts');
const userRoutes=require('./api/routes/users');

//connect to mongodb atlas

mongoose.connect(`mongodb+srv://xoxobunnyrhea:${process.env.MONGO_ATLAS_PWD}@blog-cluster-rtrgr.mongodb.net/test?retryWrites=true`,
{
    // useMongoClient:true
    useNewUrlParser:true
}
)


//A middleware to show times and all
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//All the routes that Blogspot will be using
app.use('/blogposts',blogpostRoutes);
app.use('/user',userRoutes);

//Error handling 
app.use((req,res,next) => {
    const error= new Error('Page Not Found');
    error.status(404);
    next(error); 
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
});

module.exports=app;