import express from 'express'
import cors from 'cors'
import { PORT } from './utils/config.js';
import authRouter from './routes/authRouter.js';

const app=express();

app.use(express.json())
app.use(cors())

const routes=[
    authRouter
]

routes.forEach((router)=>{
    app.use(router)
})

app.listen(PORT,()=>{
    console.log(`App listens on Port ${PORT}`)
})