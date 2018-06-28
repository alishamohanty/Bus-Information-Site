var express               = require("express"),
    mongoose              = require("mongoose"),
    bodyparser            = require("body-parser"),
    app                   = express(),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    passport              = require("passport");
    
mongoose.connect("mongodb://localhost/bus_info");
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({extended:true}));

app.use(require("express-session")({
    secret: "This is the best bus info site in the world",
    resave: false,
    saveUninitialized: false
}));

var adminSchema=new mongoose.Schema(
    { 
       firstname:String,
       lastname:String,
       username:String,
       password:String
    });
var busSchema=new mongoose.Schema(
    { 
       bustime:String,
       source:String,
       destination:String,
       arrival_time:String,
       total_time:String,
       duration:String,
       fare:Number
    });
    adminSchema.plugin(passportLocalMongoose);
var bus=mongoose.model("bus",busSchema);
var admin = mongoose.model("admin",adminSchema);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(admin.authenticate()));
passport.serializeUser(admin.serializeUser());
passport.deserializeUser(admin.deserializeUser());
// //Creating an user in site

admin.create({
      firstname:"alisha",
      lastname:"mohanty",
      email:"alishapapun@gmail.com",
      password:"glasses"
             },
            function(err,data)
          {
               if(err)
               {
                  console.log("Entering error block");
                  console.log(err);
               }
               else
               {
                  console.log("Data inserted");
                  console.log(data);
               }
          });
bus.create({
       bustime:"Rangrez",
       source:"Bhubaneswar",
       destination:"Puri",
       arrival_time:"10.00AM",
       total_time:"12.10PM",
       duration:"2hr10min",
       fare:70
             },
            function(err,data)
          {
               if(err)
               {
                  console.log("Entering error block");
                  console.log(err);
               }
               else
               {
                  console.log("Data inserted");
                  console.log(data);
               }
          });

app.get("/",function(req,res)
{
   res.render("bus.ejs");
   
});
app.post("/bus_details",function(req,res)
{  var sou=req.body.sourceCityId;
   var des=req.body.destinationCityId;
   console.log(sou,des);
   bus.find({source :sou,destination: des},function(err,data)
    {
       if(err)
       {
           console.log(err);
       } 
       else
       {
         //  console.log("Done");
         //  console.log(data[0].fare);
         // // console.log(data);
         res.render("bus_details",{user:data});
       }
    });
   
   // res.render("bus_details.ejs"); 
});
app.get("/contact",function(req,res)
{
   res.render("contact"); 
});
app.get("/about",function(req,res)
{
   res.render("about"); 
});
app.get("/team",function(req,res)
{
   res.render("team"); 
});
app.get("/register",function(req,res)
{
   res.render("register"); 
});
app.get("/admin",function(req,res){
   res.render("admin");
});
app.get("/new",function(req,res){
   res.render("new");
});
app.get("/successfull",function(req,res){
   res.render("successfull");
});

app.post("/register",function(req,res)
{
   var firname=req.body.fname;
   var lasname=req.body.lname;
   var ema =   req.body.email;
   var pas =   req.body.pass;
   var ad={firstname:firname,lastname:lasname,username:ema,password:pas};
   console.log(ad);
   admin.register(ad,pas,function(err,newly)
   {
      if(err)
      {
         console.log(err);
      }
      else
      {
         console.log(newly);
         res.redirect("/successfull");
      }
      
   });
      
});
app.post("/bus_register",function(req,res)
{
   var bname=req.body.busname;
   var sou=req.body.source_;
   var dest =   req.body.destination;
   var ti =   req.body.time;
   var fin_ti=req.body.final_time;
   var dur =   req.body.duration;
   var fare =   req.body.fare;
   var ad={bustime:bname,
       source:sou,
       destination:dest,
       arrival_time:ti,
       total_time:fin_ti,
       duration:dur,
       fare:fare};
   bus.create(ad,function(err,data)
   {
      if(err)
      {
         console.log(err);
      }
      else
      {
         console.log(data);
         res.redirect("/successfull");
      }
      
   });
      
});
app.get("/bus_register",function(req,res){
   res.render("bus_register");
});

app.get("/bus_details",function(req,res){
   res.render("bus_details");
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));