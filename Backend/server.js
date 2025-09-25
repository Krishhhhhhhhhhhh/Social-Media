import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import {inngest,functions} from './inngest/index.js'

const app=express();
await connectDB();

app.use(express.json());
app.use(cors());
app.use('/api/ingest',serve({client:inngest,functions }))

 

const PORT =process.env.PORT || 4000;

app.listen(PORT,()=>console.log(`Server is running ${PORT}`)) 
