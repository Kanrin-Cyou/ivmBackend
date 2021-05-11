
const handleProfileUpdate = (req,res,db) => {
    console.log(req.body,req.body.updateName,req.body.updatePassword);
    db.from('users').where('email',req.body.email)
    .update({name:req.body.name,
         password:req.body.password}
    ).then(data=>{data? console.log("Updated"):console.log("not Updated")});
    db.select('*').where('email',req.body.email).from('users').then(data=>{res.json(data)});
} 

const profile = {
    'handleProfileUpdate':handleProfileUpdate,
}
 
export default profile;