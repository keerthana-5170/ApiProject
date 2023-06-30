const express = require('express')

const app = express()

app.use(express.json())


let myDb = [
    {
        id: 1,
        info: "information 1",
        date: "2022-04-03T20:00:22.158Z"
    },
    {
        id: 2,
        info: "information 2",
        date: "2022-03-03T20:00:22.158Z"
    }
]

const generateID = () =>{
    const maxId = (myDb.length > 0) ? Math.max(...myDb.map(i=>i.id)) : 0
    return maxId+1
}

const getObjAndIndex= (id) =>{
    let Obj = {}
    let index = 0
    for(let i=0;i<myDb.length;i++)
    {
        if(id==myDb[i].id)
        {
            Obj = myDb[i]
            index = i
        }
    } 
    return [Obj,index]
} 

app.get('/', (req, res) => {
    res.send('welcome to the app')
})

app.get('/api/info',(req,res)=>{
    res.status(200).json(myDb)
})

app.get('/api/info/:id',(req,res)=>{
    const id = Number(req.params.id)
    const infoObject = myDb.find(info=>info.id===id)
    infoObject ? res.status(200).json(infoObject) : res.status(404).json({error:`object with ${id} doesnot exist`})
    res.status(204).json(myDb)
})

app.post('/api/info',(req,res)=>{
    const body = req.body
    if(!body.info)
    {
        res.status(400).json({error:'please enter the data'})
    }
    const infoObject = {
        id:generateID(),
        info:body.info,
        date:new Date()
    }
    myDb.concat(infoObject)
    res.status(201).json(infoObject)
})

app.delete('/api/info/:id',(req,res)=>{
    const id = Number(req.params.id)
    myDb = myDb.filter(i=>i.id===id) 
    res.status(204).end()
})

app.put('/api/info/:id',(req,res)=>{
    const id = Number(req.params.id)
    const body = req.body
    if(!body)
    {
        res.status(400).json({error:"fill in info"})
    }
    const [infoObj,index] = getObjAndIndex(id)
    const modifiedInfo = {
        id:infoObj.id,
        info : body.info,
        date:new Date()
    } 
    infoObj[index] = modifiedInfo
    res.status(200).json(modifiedInfo).end()
})
const PORT = 3001

app.listen(PORT, () => {
    console.log(`server running on  ${PORT}`)
})
