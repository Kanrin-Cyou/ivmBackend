import bcrypt from 'bcrypt';

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

const getAuthTokenId = () => {
    console.log('auth has the token')
}

const signinAuthentication = (req,res,db) => {
    const { authorization } = req.headers;
    return authorization 
    ? getAuthTokenId()
    : handleSignIn(req,res,db)
}

const signin = {
    'handleSignIn':handleSignIn,
    'signinAuthentication':signinAuthentication
}

export default signin;

