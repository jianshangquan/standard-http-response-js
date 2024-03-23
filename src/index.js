// import { sha256 } from "js-sha256";
const { sha256 } = require('js-sha256');

const LATEST_API_VERSION = 2;



const createSign = (object = {}, key) => {

    function extract(ob) {
        let keymap = [];
        const entries = Object.entries(ob);
        entries.map(([k, v], i) => {
            if(typeof v == 'object' && v != null && v != undefined){
                return keymap = keymap.concat(extract(v))           
            }
            keymap.push({ key: k, value: v })
        })

        return keymap;
    }


    const mapping = extract(object);
    if(mapping.length == 0) return null;

    const string = JSON.stringify(mapping.sort((a, b) => a.key.localeCompare(b.key)));
    return sha256(`${string}|key=${key}`).toUpperCase()
}


const HttpResponseType = Object.freeze({
    REQUEST: 'request',
    HEART_BEAT: 'heart-beat',
    OK: 'OK',
    ERROR: 'error'
})


const HttpMethods = Object.freeze({
    POST: 'POST',
    PUT: 'PUT',
    GET: 'GET',
    DELETE: 'DELETE',
    OPTION: 'OPTION'
});



const HttpResponse = {
    error: ({ version = LATEST_API_VERSION,  errorMsg = "", message, errorStatus = null, statusCode = 400, type = HttpResponseType.ERROR} = {}) => {
        return {
            status: 'Failed',
            statusCode,
            version,
            type,
            timestamp: new Date(),
            message: errorMsg || message,
            error: {
                status: errorStatus,
                message,
                errorMessage: errorMsg || message
            },
            payload: null
        }
    },
    success: ({ version = LATEST_API_VERSION, message =  "", payload = {}, statusCode = 200, type = HttpResponseType.REQUEST } = {}) => {
        const timestamp = new Date();
        return {
            status: 'Succeed',
            statusCode,
            version,
            type,
            timestamp,
            message,
            signature: createSign(payload),
            payload: payload
        }
    },
    ok(){
        return HttpResponse.success({ message: 'ok', type: HttpResponseType.OK })
    },
    heartBeat(){
        return HttpResponse.success({ type: 'Heart-Beat', type: HttpResponseType.HEART_BEAT });
    }
}


const FetchResponse = {
    async handle(res) {
        const response = await res.json();
        if(response.statusCode == 400) throw response.error;
        return response.payload;
    }
}


const Fetch = {
    createFetchOptions({ method = HttpMethods.POST, data } = {}){
        return {
            method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    },
    put(data = {}){
        return this.createFetchOptions({ method: HttpMethods.PUT, data })
    },
    post(data = {}){
        return this.createFetchOptions({ method: HttpMethods.POST, data })
    },
    delete(data = {}){
        return this.createFetchOptions({ method: HttpMethods.DELETE, data })
    },
}


module.exports = { HttpResponse, HttpResponseType, FetchResponse, Fetch, HttpMethods }