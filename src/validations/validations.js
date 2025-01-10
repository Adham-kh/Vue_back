import { body } from "express-validator";
import axios from "axios";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';

export const registerValidation = [
    body('username', 'Имя дольжен состоять из более трех символов').isLength({ min: 3}),
    body('email', 'Неверный адрес Эл-почти').isEmail(),
    body('password', 'Пароль должен содержать минимум 8 символов, включать одну заглавную букву, одну цифру и один спецсимвол')
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
]

export const loginValidation = [
    body('email', 'Неверный адрес Эл-почти').isEmail(),
    body('password', 'Пароль должен содержать минимум 8 символов, включать одну заглавную букву, одну цифру и один спецсимвол')
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
]

export const validateEmail = async (req, res, next) => {

    const  email = req.body.email;
    
    const apiKey = process.env.APIKEY;

    const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`;

    try {

        const response = await axios.get(url);

        console.log('Полный ответ от API:', response.data);
        
        const status = response.data.data.status;
        
        if(status === "invalid"){
            res.status(400).json({
                message: 'Несуществующий email',
            });
        };

        next();

    } catch (err) {
        res.status(400).json({
            message: 'Некорректный email',
        });
    }
};

export const tokenValidation = async(req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //console.log(token)

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'Недействительный токен' }); // Если токен недействителен
        }
    
        req.user = user; // Сохраняем данные пользователя из токена в запросе
        next(); // Передаём управление следующей функции
      });

}