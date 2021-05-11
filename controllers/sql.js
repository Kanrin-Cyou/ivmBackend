import SummaryForm from '../constants.js'

//add
const handleSQLadd = (req,res,db) =>{
    const newform = req.body;
    if (SummaryForm.hasOwnProperty(newform.formnav)){
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
}

//delete
const handleSQLdelete = (req,res,db)=>{
    const newform = req.body;
    if (SummaryForm.hasOwnProperty(newform.formnav)){
        if (newform.deletelist.length !== 0) {
            newform.deletelist.map((item,i)=>{db.from(newform.formnav).where('id',item).del().then(data=>{data? console.log("deleted"):console.log("not deleted")})})
        } else {
            res.status(400).json('not found in database')
        }
    } else {
            res.status(400).json('not found in database')
    }
    db.select('*').from(newform.formnav).then(data=>{res.json(data)});
}

//modify 
const handleSQLmodify = (req,res,db)=>{
    const newform = req.body;
    console.log(newform.formnav,newform.modifyform,newform.modifyform.id)
    if (SummaryForm.hasOwnProperty(newform.formnav)){
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
}

const sql = {
    'handleSQLadd':handleSQLadd,
    'handleSQLdelete':handleSQLdelete,
    'handleSQLmodify':handleSQLmodify
}

export default sql;