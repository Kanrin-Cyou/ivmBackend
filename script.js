import express, { response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';
import signin from './controllers/signin.js';
import register from './controllers/register.js';
import profile from './controllers/profile.js';
import sql from './controllers/sql.js';

 

// --> res= this is working
// --> /signin --> POST = success/fail
// --> /register --> POST = user
// /profile/:userID --> GET = user
// /image --> PUT --> user

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

app.post('/signin', (req,res)=> {signin.signinAuthentication(req,res,db)});
app.post('/register', (req,res)=> {register.handleRegister(req,res,db)});
app.post('/profileUpdate', (req,res)=> {profile.handleProfileUpdate(req,res,db)});

app.post('/form', (req,res)=> {sql.handleSQLadd(req,res,db)});
app.post('/deletelist', (req,res)=> {sql.handleSQLdelete(req,res,db)});
app.post('/modifylist', (req,res)=> {sql.handleSQLmodify(req,res,db)});

app.listen(3001, ()=>{
    console.log('app is running on port 3001');
});


