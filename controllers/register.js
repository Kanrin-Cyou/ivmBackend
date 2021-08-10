const handleRegister = (req,res,db) =>{
    console.log(req.body)
    const {email,name,password} = req.body;
    db.insert({
        name:name,
        email:email,
        password: password,
        joined: new Date()
    }).into('users').then(response => {
        console.log(response)
        res.json("success")
    }).catch(
        err => {res.status(400).json("fail")
        console.log(err)}
    )
}

const register = {
    'handleRegister':handleRegister,
}

export default register;