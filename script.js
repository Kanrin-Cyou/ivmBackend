import express, { response } from 'express';
import bodyParser from 'body-parser';
import fetch from "node-fetch";
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'guanlun',
      password : 'your_database_password',
      database : 'inventory'
    }
  });

// db.select('*').from('users').then(data=>{
//     console.log(data);
// });

const app = express();
app.use(bodyParser.json());
app.use(cors());
// const database = {
//     users: [
//         {
//             id:'123',
//             name:'John',
//             email:'john@gmail.com',
//             password:'cookies',
//             entries:0,
//             joined: new Date()
//         },
//         {
//             id:'124',
//             name:'Sally',
//             email:'sally@gmail.com',
//             password:'bananas',
//             entries:0,
//             joined: new Date()
//         }
//     ]
// }


app.post('/mainpage',(req,res)=>{
    fetch('https://fakestoreapi.com/products?limit=50')
            .then(res=>res.json())
            .then(json=>{res.json(json)})
})

app.post('/signin',(req,res)=>{
    db.select('email','hash').from('login')
    .where('email', '=', req.body.email)
    .then(data=>{
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid){
            return db.select('*').from('users')
            .where('email','=',req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err=> res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
    // if (req.body.email === database.users[0].email &&
    //     req.body.password === database.users[0].password) {
    //     res.json('success');     
    // } else {
    //     res.status(400).json('error logging in');
    // }
})

app.post('/register',(req,res)=>{
    const {email,name,password} = req.body;
    // database.users.push({
    //     id:'125',
    //     name:name,
    //     email:email,
    //     password: password,
    //     entries:0,
    //     joined: new Date()
    // })
    const hash = bcrypt.hashSync(password,salt);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email:loginEmail[0],
                name:name,
                joined: new Date()
                })
                .then(user=>{
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id',(req,res)=>{
    const {id} = req.params;
    // let found = false;
    db.select('*').from('users').where({id})
    .then(user=>{
        if(user.length){
            res.json(user[0])
        } else {
            res.status(400).json('Not Found')
        }
    })
    // database.users.forEach(user => {
    //     if(user.id === id){
    //         found = true;
    //         return res.json(user);
    //     } 
    // })
    // if (!found) {
    //     res.status(400).json('no such user');
    // }
})

app.put('/image',(req,res)=>{
    const {id} = req.body;
    console.log(id)
    db('users').where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        console.log(entries);
    })  
})
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



// --> res= this is working
// --> /signin --> POST = success/fail
// --> /register --> POST = user
// /profile/:userID --> GET = user
// /image --> PUT --> user