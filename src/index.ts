// import { sha256 } from "js-sha256";
import { sha256 } from "js-sha256";

const LATEST_API_VERSION = 2;





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
    OPTION: 'OPTION'
});







export declare type HttpResponseObject<T> = {
    status: string,
    statusCode: number,
    version: number,
    type: HttpResponseType,
    timestamp: Date,
    message: string | undefined,
    error?: {
        status?: string,
        message?: string,
        errorMessage?: string,
    },
    payload: T | null
}
export declare type HttpMethods = typeof HttpMethods[keyof typeof HttpMethods];
export declare type HttpResponseType = typeof HttpResponseType[keyof typeof HttpResponseType];
export declare type HttpResponse = {
    error: <T>(prop: { version?: number, errorMsg?: string, message?: string, errorStatus?: any, statusCode?: number, type?: HttpResponseType  }) => HttpResponseObject<T>,
    success: <T>(prop: { version?: number, message?: string, payload?: T, statusCode?: number, type?: HttpResponseType }) => HttpResponseObject<T>,
    ok: <T>() => HttpResponseObject<T>,
    heartBeat: <T>() => HttpResponseObject<T>
}




export const HttpResponse : HttpResponse = {
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
