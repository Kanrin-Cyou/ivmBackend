import express, { response } from 'express';
import bodyParser from 'body-parser';
import fetch from "node-fetch";
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';
// const saltRounds = 10;
// const salt = bcrypt.genSaltSync(saltRounds);

// --> res= this is working
// --> /signin --> POST = success/fail
// --> /register --> POST = user
// /profile/:userID --> GET = user
// /image --> PUT --> user

//Constant
const customer =['id','name','postal','address','telephone','contact_person','contact_person_phone','bank','bank_account','email','fax','status'];
const supplyer =['id','name','postal','address','telephone','contact_person','contact_person_phone','bank','bank_account','email','fax','status'];

const imports =['id','supplyer_id','payment_type','time','operator','quantity','note','sku'];
const importsreturn =['id','supplyer_id','payment_type','time','operator','quantity','note','sku'];
const sales =['id','customer_id','payment_type','time','operator','quantity','note','sku'];
const salesreturn =['id','customer_id','payment_type','time','operator','quantity','note','sku'];

const goods =['id','name','origin','standard','package','batch','approval','note','price','supplyer_id','status'];
const inventory =['id','sku','stock'];

const summaryForm = {
     'customer':customer,
     'imports':imports,
     'importsreturn':importsreturn,
     'supplyer':supplyer,
     'sales':sales,
     'salesreturn':salesreturn,
     'goods':goods,
     'inventory':inventory
}

//Connect to DataBase

const db = knex({
    client: 'pg',
    connection: {
      port: '6969',
      host : '127.0.0.1',
      database : 'IVM'
    }
  });

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/mainpage',(req,res)=>{
    res.json(dummyForm(inventoryForm,10))
})

//add
app.post('/form',(req,res)=>{
    const newform = req.body;
    if (summaryForm.hasOwnProperty(newform.formnav)){
        if (newform.data !== '') {
            db.insert(newform.data).into(newform.formnav).then(
                data=>{console.log("added",data);db.select('*').from(newform.formnav).then(data=>res.json(data))}
            )
        } else {
            db.select('*').from(newform.formnav).then(data=>res.json(data));
        }
    } else {
            res.status(400).json('not found in database')
    }
})

//delete
app.post('/deletelist',(req,res)=>{
    const newform = req.body;

    if (summaryForm.hasOwnProperty(newform.formnav)){

        if (newform.deletelist.length !== 0) {
            newform.deletelist.map((item,i)=>{db.from(newform.formnav).where('id',item).del().then(data=>{data? console.log("deleted"):console.log("not deleted")})})
        } else {
            res.status(400).json('not found in database')
        }
    } else {
            res.status(400).json('not found in database')
    }
    db.select('*').from(newform.formnav).then(data=>{res.json(data)});
})

//modify

app.post('/modifylist',(req,res)=>{

    const newform = req.body;
    console.log(newform.formnav,newform.modifyform,newform.modifyform.id)

    if (summaryForm.hasOwnProperty(newform.formnav)){
        if (newform.modifyform.length !== 0) {
            db.from(newform.formnav)
            .where('id',newform.modifyform.id)
            .update(newform.modifyform)
            .then(data=>{data? console.log("Updated"):console.log("not Updated")})     
        } else {
            res.status(400).json('not found in database')
        }
    } else {
            res.status(400).json('not found in database')
    }
    db.select('*').from(newform.formnav).then(data=>{res.json(data)});
})

//search


// ---- ***** Signin System ***** ----

const dummyUser = {
    users: [
        {
            id:'123',
            name:'John',
            email:'john@gmail.com',
            password:'cookies',
            entries:0,
            joined: new Date()
        },
        {
            id:'124',
            name:'Sally',
            email:'sally@gmail.com',
            password:'bananas',
            entries:0,
            joined: new Date()
        }
    ]
}

app.post('/signin',(req,res)=>{
    console.log(req.body)
    if (req.body.email === dummyUser.users[0].email &&
    req.body.password === dummyUser.users[0].password) {
    console.log("pass")
    res.json(dummyUser.users[0]);     
    } else {
        res.status(400).json('error logging in');
    }

    // db.select('email','hash').from('login')
    // .where('email', '=', req.body.email)
    // .then(data=>{
    //     const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
    //     if (isValid){
    //         return db.select('*').from('users')
    //         .where('email','=',req.body.email)
    //         .then(user => {
    //             res.json(user[0])
    //         })
    //         .catch(err=> res.status(400).json('unable to get user'))
    //     } else {
    //         res.status(400).json('wrong credentials')
    //     }
    // })
    // .catch(err => res.status(400).json('wrong credentials'))

})

// app.post('/register',(req,res)=>{
//     const {email,name,password} = req.body;
    // database.users.push({
    //     id:'125',
    //     name:name,
    //     email:email,
    //     password: password,
    //     entries:0,
    //     joined: new Date()
    // })


//     const hash = bcrypt.hashSync(password,salt);
//     db.transaction(trx => {
//         trx.insert({
//             hash: hash,
//             email: email
//         })
//         .into('login')
//         .returning('email')
//         .then(loginEmail => {
//             return trx('users')
//             .returning('*')
//             .insert({
//                 email:loginEmail[0],
//                 name:name,
//                 joined: new Date()
//                 })
//                 .then(user=>{
//                 res.json(user[0]);
//             })
//         })
//         .then(trx.commit)
//         .catch(trx.rollback)
//     })
//     .catch(err => res.status(400).json('unable to register'))
// })

// app.get('/profile/:id',(req,res)=>{
//     const {id} = req.params;
//     // let found = false;
//     db.select('*').from('users').where({id})
//     .then(user=>{
//         if(user.length){
//             res.json(user[0])
//         } else {
//             res.status(400).json('Not Found')
//         }
//     })
    // database.users.forEach(user => {
    //     if(user.id === id){
    //         found = true;
    //         return res.json(user);
    //     } 
    // })
    // if (!found) {
    //     res.status(400).json('no such user');
    // }
// })

// app.put('/image',(req,res)=>{
//     const {id} = req.body;
//     console.log(id)
//     db('users').where('id','=',id)
//     .increment('entries',1)
//     .returning('entries')
//     .then(entries => {
//         console.log(entries);
//     })  
// })
    // let found = false;
    // database.users.forEach(user => {
    //     if(user.id === id){
    //         found = true;
    //         user.entries++;
    //         return res.json(user.entries);
    //     } 
    // })
    // if (!found) {
    //     res.status(400).json('not found');
    // }



app.listen(3001, ()=>{
    console.log('app is running on port 3001');
});


