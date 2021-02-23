import express, { response } from 'express';
import bodyParser from 'body-parser';
import fetch from "node-fetch";
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// --> res= this is working
// --> /signin --> POST = success/fail
// --> /register --> POST = user
// /profile/:userID --> GET = user
// /image --> PUT --> user

// db.select('*').from('users').then(data=>{
//     console.log(data);
// });

const customerForm =['id','客户全称','客户邮编','客户公司地址','客户公司电话','联系人','联系电话','开户银行','银行帐号','联系人信箱','客户传真','状态'];
const goodsForm =['id','商品名称','产地','规格','包装','生产批号','批准文号','描述','价格','供应商编号','状态'];
const importsForm =['id','供应商编号','支付类型','进货时间','操作员','数量','注释','商品编号'];
const returnForm =['id','供应商编号','支付类型','退货时间','操作员','数量','注释','商品编号'];
const supplyerForm =['id','供应商全称','供应商邮编','公司地址','公司电话','联系人','联系人电话','开户银行','银行帐号','联系人邮箱','公司传真','状态'];
const salesForm =['id','客户编号','支付类型','销售时间','操作员','数量','注释','商品编号'];
const salesReturnForm =['id','客户编号','支付类型','退货时间','操作员','数量','注释','商品编号'];
const inventoryForm =['id','商品编号','数量'];
const summaryForm = {
     'customerForm':customerForm,
     'goodsForm':goodsForm,
     'importsForm':importsForm,
     'returnForm':returnForm,
     'supplyerForm':supplyerForm,
     'salesForm':salesForm,
     'salesReturnForm':salesReturnForm,
     'inventoryForm':inventoryForm
}

const dummyForm = (formType,repeat,newdata) => {
    const dummyList = [];
    for (var index = 0; index < repeat; index++) { 
        var dummyObject = new Object();
        formType.map((item,i) => {
            if (item.includes("时间")){
                dummyObject[item] = "2021-02-04T20:0";
            } else if (item.includes("数量")){
                dummyObject[item] = "123";
            } else if (item.includes("id")){
                dummyObject[item] = index;
            } else {
                dummyObject[item] = "hello";
            }
        })
        dummyList.push(dummyObject)
    }
    if(newdata!=''){dummyList.push(newdata)}
    return dummyList;
}

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'guanlun',
      password : 'your_database_password',
      database : 'inventory'
    }
  });


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/mainpage',(req,res)=>{
    res.json(dummyForm(inventoryForm,5))
})

// app.post('/mainpage',(req,res)=>{
//     fetch('https://fakestoreapi.com/products?limit=50')
//             .then(res=>res.json())
//             .then(json=>{res.json(json)})
// })

//dummy post
app.post('/form',(req,res)=>{
    const newform = req.body;
    console.log(newform.formnav)
    if (summaryForm.hasOwnProperty(newform.formnav)){
        res.json(dummyForm(summaryForm[newform.formnav],5,newform.data))
      } else {
        res.json(dummyForm(inventoryForm,5))
      }
})
// app.post('/form',(req,res)=>{
//     const newform = req.body;
//     res.json(newform);
// })


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