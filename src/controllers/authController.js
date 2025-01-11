import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js'
import axios from 'axios';

// Регистрация пользователя
export const registerUser = async (req, res) => {

  console.log(req.body)
  //Результат проверки валидации
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Если есть ошибки, возвращаем их клиенту
    const err = errors.array();
    //console.log(err[0]?.msg)
    return res.status(400).json({ errors: err[0]?.msg });
    }

   


  const { username, email, password, captchaToken } = req.body;
    //console.log(captchaToken);

    const secretKey = '6LcR6bAqAAAAAMFVaiKEX0xykUp5inXXFEb6J2KE';
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify`;

  
    const response = await axios.post(recaptchaUrl, null, {
      params: {
        secret: secretKey,
        response: captchaToken,
      },
    });

    console.log("проверка recapca register ", response.data.success);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO User (name, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );



    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });

  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message)
  }
};

// Авторизация пользователя
export const loginUser = async (req, res) => {
   
  console.log(req.body)

    const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Если есть ошибки, возвращаем их клиенту
    console.log(errors.array())
    return res.status(455).json({ errors: errors.array() });
    }

    const { email, password, captchaToken } = req.body;

    const secretKey = '6LcR6bAqAAAAAMFVaiKEX0xykUp5inXXFEb6J2KE';
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify`;

  
    const response = await axios.post(recaptchaUrl, null, {
      params: {
        secret: secretKey,
        response: captchaToken,
      },
    });

    console.log(response.data.success);

    if (!response.data.success) {
      return res.status(400).json({ message: 'reCAPTCHA не прошла проверку. Попробуйте еще раз.' });
     }
    

  try {
    const [rows] = await db.query('SELECT * FROM User WHERE email = ?', [email]);


    

    if (rows.length === 0) return res.status(404).json({ message: `${ email } Не зарегистрирован!` });

    // Если пользователь найден, извлекаем его данные (например, хэшированный пароль)
    const user = rows[0];
    const userid = rows[0]?.id;
    
    // Сравниваем введённый пароль с хэшированным паролем в базе данных
    const isMatch = await bcrypt.compare(password, user.password);

    
    // Если пароли не совпадают, возвращаем ошибку с кодом 401 (неправильные данные)
    if (!isMatch) {
      return res.status(401).json({ message: 'Не верный логин или пароль' });
    }

    // Если пароль совпал, создаем JWT токен с данными пользователя
    // Включаем ID пользователя и имя для дальнейшей идентификации
    const token = jwt.sign(
        { id: user.id, username: user.name }, // Данные, которые будут зашифрованы в токене
           process.env.JWT_SECRET, //ключ для подписи токена (храниться в .env файле)
        { expiresIn: '1h' } // Время жизни токена — 1 час
      );
  
      // Отправляем токен обратно в ответе
      res.status(200).json({token, userid});
  
    } catch (err) {
      // Если произошла ошибка на любом этапе, возвращаем ошибку 500
      res.status(500).json({ error: err.message, masseg: "awdawawdawdawd" });
    }
};

export const homeUser = async (req, res) => {

  
  try {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //id с заналовка при получение его после authorization 
    
    const { id } = req.params;
    //console.log(id)
   
  if (!token) return res.status(401).json({ message: 'Нет токена авторизации' });

    const [rows] = await db.query('SELECT * FROM User WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Прошизашла ошибка попоробуйте перезайти!' });

    //console.log(rows)
    res.json({rows});

  } catch (error) {
    //console.error('Ошибка на сервере:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};



