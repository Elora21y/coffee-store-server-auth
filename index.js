const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 2100

app.use(cors())
app.use(express.json())

app.get('/' , (req, res)=>{
    res.send('Welcome to Hot Hot Coffee Shop Server')
})

app.listen(port , ()=>{
    console.log(`Port is running on : ${port}`)
})