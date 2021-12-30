const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2xl13.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('OfficeManagement');
        const employeesCollection = database.collection('emloyees');

        // get all employee
        app.get('/employees', async (req, res) => {
            const employees = await employeesCollection.find({}).toArray();
            res.send(employees)
        });

        // update an employee info
        app.put('/employee/:id', async (req, res) => {
            const employeeId = req.params.id
            const { updatedEmp, employee } = req.body;
            const query = { _id: ObjectId(employeeId) };
            const options = { upsert: true };
            const updateInfo = {
                $set: {
                    employee_img: updatedEmp.employee_img || employee?.employee_img,
                    employee_name: updatedEmp.employee_name || employee?.employee_name,
                    employee_salary: updatedEmp.employee_salary || employee?.employee_salary,
                    employee_age: updatedEmp.employee_age || employee?.employee_age,
                }
            }
            const result = await employeesCollection.updateOne(query,updateInfo, options)
            res.json(result)
        });

        // insert an employee
        app.post('/addEmployee', async (req, res) => {
            const newEmployee = await employeesCollection.insertOne(req.body);
            res.json(newEmployee)
        })
        // delete an employee
        app.delete('/deleteEmp/:id', async(req,res)=>{
            const deletedId = req.params.id;
            const query = {_id: ObjectId(deletedId)};
            const result = await employeesCollection.deleteOne(query);
            res.json(result)
        })

    } finally {
        // await client.close()
    }
}
run().catch(console.dir)

// verify the server hitting

app.get('/', (req, res) => {
    res.send('server hitting')
})
app.listen(port, () => {
    console.log(`listening from http://localhost:${port}`)
})