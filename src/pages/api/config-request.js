import axios from 'axios';
import { Domain } from './config';


export default (method, url, params={}, headers = "", responseType) => {
    method = method.toLowerCase();


    let opts = {
        method : method,
        url: url,
        headers: {
            // token: storeData && storeData.authToken ? JSON.parse(storeData.authToken) : ''
            
            'Accept-language': 'en',
            // 'Access-Control-Allow-Origin': 'http://localhost:3000/umusic',
            // 'Access-Control-Allow-Credentials': 'true',
          'Client-Type': 'Android',
            'Revision': 1234,
            // 'Sec-Fetch-Mode:': 'no-cors',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    if (method==='get')
        opts.params = params;
    else 
        opts.params = params;

    if (headers) {
        opts.headers = Object.assign(opts.headers, headers);
    }

    if(responseType) {
        opts.responseType = responseType;
    }

    opts.validateStatus = (status) => {
        return true;
    }

    return axios(opts);
}