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

export default summaryForm;