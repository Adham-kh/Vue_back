
import express from 'express';
import authRoutes from './routes/authRoutes.js'
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();




//import db from './config/db.js'

const app = express();

const port = process.env.PORT;

app.use(express.json());

//app.use(cors({origin: ["http://localhost:8080"] || ["http://192.168.0.101:8080"]}));

 app.use(cors({
   origin: '*', // Разрешить все адреса
   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешить определенные методы
   allowedHeaders: ['Content-Type', 'Authorization'], // Разрешить определенные заголовки
 }));

app.use('/api/auth', authRoutes);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


export default app;

