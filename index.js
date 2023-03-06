const e = require("express");
const express = require("express");
const math=
{
	add:function(a,b)
	{
		return a+b;
	}
}
const app = express();
const port = 8000;

const { initializeApp , cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
var serviceAccount = require("./key.json");
initializeApp({
	credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine","ejs");
app.use(express.static('public'));

app.get("/",(req,res)=>{
	res.send("Hello! This is Chaitanya Syamala");
});

app.get("/login",(req,res)=>{
	res.render("login");
});
app.get("/loginsubmit",(req,res)=>{
	const email=req.query.email;
	const pwd=req.query.pwd;
	const role=req.query.role;
	console.log(role);
	if(role=="organiser"){
		db.collection("Organisers")
		.where("email","==",email)
	    .where("pwd","==",pwd)
	    .get()
	    .then((docs) => {
			if(docs.size > 0){
			console.log("pwd");
			res.render("organ");
			}
		})
    }
	else if(role=="donor"){
		db.collection("donors")
		.where("email","==",email)
	    .where("pasword","==",pwd)
	    .get()
	    .then((docs) => {
			if(docs.size > 0){
				console.log("pwd");
				res.render("donor");
			}
		})
    }
	else{
		res.send("loginfailed");
	}
});


app.get("/signup",(req,res)=>{
	res.render("ss");
});
app.get("/s",(req,res)=>{
	res.render("landing");
});
app.get("/donorReg.ejs",(req,res)=>{
	res.render("donorReg");
});
app.get("/dr",async(req,res)=>{
	const fname=req.query.fname;
	const lname=req.query.lname;
	const phn=req.query.tel;
	const emailid = req.query.email;
	const pwd = req.query.pwd;
	const add= req.query.add;
	console.log(emailid);
	console.log(fname);
	db.collection("donors").add({
		donar: fname+""+lname,
		email:emailid,
		pasword:pwd,
		address:add,
		phonenum:phn,
	}).then(()=>{
	res.render("donor");
	 })

 })
app.get("/organReg.ejs",(req,res)=>{
	res.render("organReg");
});
app.get("/Or",async(req,res)=>{
	const fname=req.query.org;
	const lname=req.query.orgname;
	const phn1=req.query.num1;
	const phn2=req.query.num2;
	const count=req.query.pp;
	const emailid = req.query.email;
	const pwd = req.query.pwd;
	const add= req.query.add;
	console.log(emailid);
	console.log(fname);
	db.collection("Organisers").add({
		organisation: fname,
		organiser:lname,
		phone1:phn1,
		phone2:phn2,
		count:count,
		email:emailid,
		pwd:pwd,
		address:add,
	}).then(()=>{
		res.render("organ");
	 })

 })
 const funds =[];
 app.get("/need",async(req,res)=>{
	const mencl=req.query.men;
	const food=req.query.food;
	const phn=req.query.phn;
	const other = req.query.othr;
	const menum = req.query.menum;
	const othrnum= req.query.othrnum;
	console.log(food);
	console.log(phn);
	funds.push(phn);
	funds.push(food);
	funds.push(mencl);
	funds.push(menum);
	funds.push(other);
	funds.push(othrnum);
	//console.log(funds);
	//res.send("success");
	var snapshot= await db.collection("donors").get();
	db.collection("donors")
	.where("phonenum","==",phn)
	.get()
	.then((docs)=>{
		res.send("Thanks for your contribution your'e funds collected :))");

	});
	// .then((docs)=>{
	// 	return snapshot.docs.map(doc => {
	// 		db.collection("donors").doc(doc.id).update({Funds:funds})
	// 	});
	// 	console.log(funds);
	// })
	
 })
 app.get("/funds",(req,res)=>{
	const ned=req.query.needs;
	const num=req.query.number;
	//const pwd=req.query.pwd;
	 console.log(num);
	console.log(ned);
	res.send("thankyou!!you're needs collected succesfully");
	// db.collection("needs").add({
	// 		need: ned,
	// 		number : num,
	// 	}).then(()=>{
	// 		res.send("needs collected succesfully");
	// 		console.log("emailadded");
	// 	});	
});
app.get("/signupsubmit",(req,res)=>{
	const name=req.query.user;
	const email=req.query.email;
	const pwd=req.query.pwd;
	// console.log(name);
	// console.log(email);
	db.collection("customers")
		.where("email","==",email)
	    .where("pwd","==",pwd)
	    .get()
	    .then((docs) => {
			res.send("email already exists");
		});
	db.collection("customers").add({
			username: name,
			Email : email,
			password: pwd,
		}).then(()=>{
			res.render("landing");
			console.log("emailadded");
		});	
});
app.get("/fun",(req,res)=>{
	res.render("fund");
});
app.get("/ned",(req,res)=>{
	res.render("needs");
});

app.get("/home",(req,res)=>{
	res.render("home");
});

const arr=[];
const costs=[];
var amount=0;
app.get("/addedToCart",(req,res)=>{
	const val=req.query.item;
	var c=req.query.cost;
	costs.push(c);
	c=eval(c.slice(0,c.length-2));
	console.log(c);
	amount=math.add(amount,c);
	arr.push(val);
	res.render("home");
});

app.get("/cart",(req,res)=>{
	if(typeof(arr) != "undefined"){
		db.collection("Cart").add({
			Cart : arr,
			Costs : costs,
			TotalCost : amount,
		}).then(()=>{
			res.render("cart",{booksData : arr, amount : amount, costs : costs});
		});
	}
});
app.listen(port,()=>{
	console.log(`You are in port number ${port}`);
});
