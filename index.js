const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2xl13.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db('OfficeManagement');
        const employeesCollection = database.collection('emloyees');

        // get all employee
        app.get('/employees', async (req,res)=>{
            const employees = await employeesCollection.find({}).toArray();
            res.send(employees)
        });

        // get single employee
        app.get('/employee/:id', async (req,res)=>{
            const employeeId = req.params.id
            const query = {_id:ObjectId(employeeId)};
            const employee = await employeesCollection.findOne(query);
            res.send(employee)
        });
        
    }finally{
        // await client.close()
    }
}
run().catch(console.dir)

// verify the server hitting

app.get('/',(req,res)=>{
    res.send('server hitting')
})
app.listen(port, ()=>{
    console.log(`listening from http://localhost:${port}`)
})