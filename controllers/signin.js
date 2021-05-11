const handleSignIn = (req,res,db) =>{
    db.select('email','password').from('users')
    .where('email', '=', req.body.email)
    .then(data =>{
        if (req.body.password === data[0].password){
            return db.select('*').from('users')
            .where('email','=',req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials')
        }
    }) 
    .catch(err => res.status(400).json('wrong credentials'))
}

const signin = {
    'handleSignIn':handleSignIn,
}

export default signin;

// import bcrypt from 'bcrypt';
// const saltRounds = 10;
// const salt = bcrypt.genSaltSync(saltRounds);

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