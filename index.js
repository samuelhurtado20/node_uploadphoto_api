var Express     = require("express")
var bodyParser  = require("body-parser")
var fileUpload  = require('express-fileupload')
var fs          = require('fs')
var cors        = require('cors')

var app = Express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(fileUpload())
app.use('/Photos', Express.static(__dirname+'/Photos'))
app.use(cors())

//db
var MongoClient = require("mongodb").MongoClient
var ConnString = "mongodb://uxghgh4iwlhri0ewumpj:EecihdRwN2UrgiDdlABR@biavrh7viutgdfb-mongodb.services.clever-cloud.com:27017/biavrh7viutgdfb"
var database;
app.listen(45045, ()=>
{
    console.log('server on port 45045')
    MongoClient.connect(ConnString, {useNewUrlParser:true},
        (error,client)=>{
            database=client.db('biavrh7viutgdfb')
            console.log('Mongo db connection successfull')
        })
})

//
app.get('/', (req, res)=>{res.json('hello world')})

app.get('/api/deparment', (req, res)=>{
    
    database.collection("Deparment").find({}).toArray((error,result)=>{
        if(error){
            console.log(error)
        }
        res.json(result)
    })

})

app.post('/api/deparment', (req, res)=>{
    
    database.collection("Deparment").count({}, function(error,num){
        if(error){
            console.log(error)
        }

        database.collection("Deparment").insertOne({
            DepartmentId : num+1,
            Name : req.body['Name']
        })

        res.json('Added successfully')
    })
})

app.put('/api/deparment', (req, res)=>{
    //et id = req.query._id;
    database.collection("Deparment").updateOne(
        //filter criteria
        {
            "DepartmentId" : req.body['DepartmentId']
            //_id: id
        },
        //update
        {
            $set:
            {
                "Name" : req.body['Name']
            }
        }
    )

    res.json('Update successfully')
})

app.delete('/api/deparment/:id', (req, res)=>{
    database.collection("Deparment").deleteOne(
        {
            DepartmentId: parseInt(req.params.id)
        }
    )

    res.json('Deleted successfully')
})
//employee
app.get('/api/employee', (req, res)=>{
    
    database.collection("Employee").find({}).toArray((error,result)=>{
        if(error){
            console.log(error)
        }
        res.json(result)
    })

})

app.post('/api/employee', (req, res)=>{
    
    database.collection("Employee").count({}, function(error,num){
        if(error){
            console.log(error)
        }

        database.collection("Employee").insertOne({
            EmployeeId : num+1,
            Name : req.body['Name'],
            LastName : req.body['LastName'],
            Salary : parseFloat(req.body['Salary']),
            DateOfJoining : req.body['DateOfJoining'],
            PhotoFileName : req.body['PhotoFileName']
        })

        res.json('Added successfully')
    })
})

app.put('/api/employee', (req, res)=>{
    database.collection("Employee").updateOne(
        {
            "EmployeeId" : req.body['EmployeeId']
        },
        {
            $set:
            {
                Name : req.body['Name'],
                LastName : req.body['LastName'],
                Salary : parseFloat(req.body['Salary']),
                DateOfJoining : req.body['DateOfJoining'],
                PhotoFileName : req.body['PhotoFileName']
            }
        }
    )

    res.json('Updated successfully')
})

app.delete('/api/employee/:id', (req, res)=>{
    database.collection("Employee").deleteOne(
        {
            EmployeeId : parseInt(req.params.id)
        }
    )

    res.json('Deleted successfully')
})

app.post('/api/employee/savefile', (req, res)=>{
    
    fs.writeFile("./Photos/" + req.files.file.name,
        req.files.file.data, function(err)
        {
            if(err)
            {
                console.log(err)
            }

            res.json(req.files.file.name)
        }
    )
})