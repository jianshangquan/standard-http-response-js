import { StandardHttpRequest, StandardHttpResponse } from 'standard-http-response-js';


const options = {
    version: '1',
    secretKey: "349276185"
};

const clientRequest = new StandardHttpRequest(options);
const clientResponse = new StandardHttpResponse(options);


const serverRequest = new StandardHttpRequest(options);
const serverResponse = new StandardHttpResponse(options);

