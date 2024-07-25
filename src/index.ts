// import { sha256 } from "js-sha256";
import { sha256 } from "js-sha256";

const LATEST_API_VERSION : string = '2';





export function createSign(object: any = {}, key?: string | undefined) {

    if(object == null) return '';

    function extract(ob: any) {
        let keymap: any[] = [];
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


export const HttpResponseType = Object.freeze({
    REQUEST: 'request',
    HEART_BEAT: 'heart-beat',
    OK: 'OK',
    ERROR: 'error'
})


export const HttpMethods = Object.freeze({
    POST: 'POST',
    PUT: 'PUT',
    GET: 'GET',
    DELETE: 'DELETE',
    OPTIONS: 'OPTIONS',
    TRACE: 'TRACE',
    PATCH: 'PATCH',
    CONNECT: 'CONNECT',
    HEAD: 'HEAD'
});







export declare type HttpResponseObject<T> = {
    status: string,
    statusCode: number | string,
    version: string,
    type: HttpResponseType,
    timestamp: Date,
    message: string | undefined,
    signature?: string | null,
    error?: {
        status?: string,
        message?: string,
        errorMessage?: string,
        errorCode?: number | string
    },
    payload: T | null
}
export declare type HttpMethods = typeof HttpMethods[keyof typeof HttpMethods];
export declare type HttpResponseType = typeof HttpResponseType[keyof typeof HttpResponseType];
export declare type HttpResponse = {
    error: <T>(prop: { version?: string, errorMsg?: string, message?: string, errorStatus?: any, errorCode?: number | string, statusCode?: number | string, type?: HttpResponseType  }) => HttpResponseObject<T>,
    success: <T>(prop: { version?: string, message?: string, payload?: T, statusCode?: number | string, type?: HttpResponseType }) => HttpResponseObject<T>,
    ok: <T>() => HttpResponseObject<T>,
    heartBeat: <T>() => HttpResponseObject<T>
}




export declare interface StandardHttpResponseConstructor{
    version: string,
}
export class StandardHttpResponse{
    version: string = '1';

    constructor(prop: StandardHttpResponseConstructor){
        this.version = prop.version;
    }

    error<T>({ version = this.version,  errorMsg = "", message, errorStatus = null, errorCode, statusCode = 400, type = HttpResponseType.ERROR} : 
        { version?: string, errorMsg?: string, message?: string, errorStatus?: any, errorCode?: number | string, statusCode?: number | string, type?: HttpResponseType  } = {}) : HttpResponseObject<T> {
        return {
            status: 'Failed',
            statusCode,
            version,
            type,
            timestamp: new Date(),
            message: errorMsg || message,
            error: {
                errorCode,
                status: errorStatus,
                message,
                errorMessage: errorMsg || message
            },
            payload: null
        }
    }
    success<T>({ version = this.version, message =  "", payload = null, statusCode = 200, type = HttpResponseType.REQUEST } : 
        { version?: string, message?: string, payload?: T | null, statusCode?: number | string, type?: HttpResponseType } = {}) : HttpResponseObject<T>{
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
    }
    ok<T>() : HttpResponseObject<T>{
        return this.success({ message: 'ok', type: HttpResponseType.OK })
    }
    heartBeat<T>() : HttpResponseObject<T>{
        return this.success({ message: 'Heart-Beat', type: HttpResponseType.HEART_BEAT });
    }
}



export const HttpResponse : HttpResponse = {
    error: ({ version = LATEST_API_VERSION,  errorMsg = "", message, errorStatus = null, errorCode, statusCode = 400, type = HttpResponseType.ERROR} = {}) => {
        return {
            status: 'Failed',
            statusCode,
            version,
            type,
            timestamp: new Date(),
            message: errorMsg || message,
            error: {
                errorCode,
                status: errorStatus,
                message,
                errorMessage: errorMsg || message
            },
            payload: null
        }
    },
    success: ({ version = LATEST_API_VERSION, message =  "", payload = null, statusCode = 200, type = HttpResponseType.REQUEST } = {}) => {
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
        return HttpResponse.success({ message: 'Heart-Beat', type: HttpResponseType.HEART_BEAT });
    }
}


export const FetchResponse = {
    async handle(res: any) {
        const response = await res.json();
        if(response.statusCode == 400) throw response.error;
        return response.payload;
    }
}


export const Fetch = {
    createFetchOptions({ method, data }: { method: HttpMethods, data: any } = { method: HttpMethods.POST, data: {} }){
        return {
            method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    },
    put(data: any = {}){
        return this.createFetchOptions({ method: HttpMethods.PUT, data })
    },
    post(data: any = {}){
        return this.createFetchOptions({ method: HttpMethods.POST, data })
    },
    delete(data: any = {}){
        return this.createFetchOptions({ method: HttpMethods.DELETE, data })
    },
}
