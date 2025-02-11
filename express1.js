const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require(`${__dirname}/middleware/authenticate.js`)
const app = express();
const accessToken = require('dotenv').config()
const morgan = require('morgan');
const Info = require('./models/userinfo');
app.set('view engine','ejs');
const dbURL = 'mongodb+srv://heri:heri123@Info.20ldi.mongodb.net/info?retryWrites=true&w=majority&appName=Info';
const connect = mongoose.connect(dbURL)
    connect.then((response)=> console.log('Successfully connected to Database')
    )
    connect.catch((error)=> console.log('Error cnonecting to the database')
    );
 function hashPass(password){
   return bcryptjs.hash(password,10)
 }
// app.get('/user-db',(req,res)=>{
//     Info.find()
//         .then((response)=>{
//                  res.render(`${__dirname}/views/db.ejs`,{info:response});
//         })
//         .catch((error)=>{
//             console.log('Error in fetching data');
//         })
// })
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('dev'));
app.get('/home',(req,res)=>{
        res.render(`${__dirname}/views/home.ejs`);
});
            
app.get('/',(req,res)=>{
    res.redirect('/home');
});
app.get('/rating',(req,res)=>{
    res.render(`${__dirname}/views/rating.ejs`,{title:'Rating'});
});
app.get('/signin',(req,res)=>{
    res.render(`${__dirname}/views/signIn.ejs`,{title:'Login'});
});
app.get('/signup',(req,res)=>{
    res.render(`${__dirname}/views/signup.ejs`,{title:'Register'});
});
app.post('/signup',(req,res)=>{
    Info.findOne({email:req.body.email})
    .then((user)=>{
        if(user){
            res.render(`${__dirname}/views/error.ejs`,{msg:'User Already Exist!'})
        }
        else{
                hashPass(req.body.password)
                    .then((result)=>{
                        console.log(typeof(result));
                        const user = new Info({
                            name:req.body.name,
                            email:req.body.email,
                            password:result
                        });
                        user.save()
                         .then((response)=>{
                            console.log('Signed In Successfully!');
                             res.redirect('/home')
                         })
                         .catch((error)=>{
                             console.log('Error Upating Database');
                             
                         })
                    })
                    .catch((err)=>{
                        console.log('Some Error');
                    })  
        }  
    })
});
 app.post('/signin',(req,res)=>{
    console.log(req.body);
    Info.findOne({name:req.body.name})
        .then((findResult)=>{
            if(findResult){
                    bcryptjs.compare(req.body.password,findResult.password)
                    .then((same)=>{
                        if(same){
                        console.log('Authication Successful!\nUser Exist');
                        const tokens = jwt.sign(req.body,process.env.ACCESS_KEY,(err,user)=>{
                            if(err){
                                return res.render(`${__dirname}/views/error.ejs`,{msg:'Error Authenticating Your Account :('});
                                
                            }
                            else{
                                return res.json({user})
                            }
                        });

                        
                        }
                        else{
                            console.log('Authentication Successful!\nUser Does Not Exist');
                           return res.render(`${__dirname}/views/error.ejs`,{msg:'User Does Not Exist!'});
                        }
                        
                    })
                    .catch((err)=>{
                        console.log('Error Authenticating');
                        
                    })
            }
            else{
                // console.log('User Not Found');
                return res.render(`${__dirname}/views/error.ejs`,{msg:'User Not Found'})
            }
        })
  
});
let authenticationCheck = (req,res,next)=>{
    let tokenHeader  = req.headers["Authorization"];
    console.log("Headers",req.headers);
    console.log(tokenHeader);
    let token = tokenHeader && tokenHeader.split(' ')[1]
    console.log(token);
    if(!token){
        return res.render(`${__dirname}/views/error.ejs`,{msg:'invalid token!'})
    }
    jwt.verify(token,process.env.ACCESS_KEY,(err,result)=>{
        if(err){
            return res.render(`${__dirname}/views/error.ejs`,{msg:'User Does Not Exist!'});
        }
        req.user = result
        next()        
    })


}
app.get('/trichy',(req,res)=>{
        res.render(`${__dirname}/views/map1.ejs`,{title:'Map'});
});
app.get('/bot',(req,res)=>{
    res.render(`${__dirname}/views/chatBot.ejs`);
})
app.get('/madurai',(req,res)=>{
    res.render(`${__dirname}/views/map2.ejs`,{title:'Map'});
});
app.get('/learnMore',(req,res)=>{
    res.render(`${__dirname}/views/learnMore.ejs`,{title:'Learn More'});
})
app.use('/notfound',(req,res)=>{
    res.render(`${__dirname}/notfound.ejs`,{title:'Error'});
})
app.listen(3005,()=>{
    console.log('Server Running on http://localhost:3005/');
})