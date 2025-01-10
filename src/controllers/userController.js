import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js'
import axios from 'axios';

export const homeUser = async (req, res) => {

    try{
        const userid = req.params.id;
        console.log(userid) 
        res.status(200).json({userid});
    }catch(err){
        res.status(440).json({err});
    }
    
  
  
    
  
  }
  