import axios from 'axios';
import cofig from './config'
import {CAR_API_ENDPOINT} from '../constant/const';

export default axios.create({           // The base url of external api
  baseURL: CAR_API_ENDPOINT  
});

