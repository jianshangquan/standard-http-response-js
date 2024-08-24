// import { sha256 } from "js-sha256";
import { sha256 } from "js-sha256";

const LATEST_API_VERSION: string = '2';





export function createSign(object: any = {}, key?: string | null | undefined) {

    if (object == null) return '';

    function extract(ob: any) {
        let keymap: any[] = [];
        const entries = Object.entries(ob);
        entries.map(([k, v], i) => {
            if (typeof v == 'object' && v != null && v != undefined) {
                return keymap = keymap.concat(extract(v))
            }
            keymap.push({ key: k, value: v })
        })

        return keymap;
    }


    const mapping = extract(object);
    if (mapping.length == 0) return null;

    const string = JSON.stringify(mapping.sort((a, b) => a.key.localeCompare(b.key)));
    return sha256(`${string}|key=${key}`).toUpperCase()
}


export function checkSign({ payload, key, signature }: { payload: object | any, key: string | null, signature: string }): boolean {
    const createdSign = createSign(payload, key);
    return createdSign == signature;
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
    error: <T>(prop: { version?: string, errorMsg?: string, message?: string, errorStatus?: any, errorCode?: number | string, statusCode?: number | string, type?: HttpResponseType }) => HttpResponseObject<T>,
    success: <T>(prop: { version?: string, message?: string, payload?: T, statusCode?: number | string, type?: HttpResponseType }) => HttpResponseObject<T>,
    ok: <T>() => HttpResponseObject<T>,
    heartBeat: <T>() => HttpResponseObject<T>
}
export declare type HttpRequestObject = {
    version: string,
    timestamp: Date,
    signature: string | null,
    payload: object | null | any
}



export declare interface StandardHttpResponseConstructor {
    version: string,
    secretKey: string | null
}
export class StandardHttpResponse {
    version: string = '1';
    secretKey: string | null = null;

    constructor(prop: StandardHttpResponseConstructor) {
        this.version = prop.version;
        this.secretKey = this.secretKey;
    }

    check<T>(object: HttpResponseObject<T>) {
        const checkSignResult = checkSign({
            payload: object.payload,
            key: this.secretKey,
            signature: object.signature || '',
        })
        return checkSignResult;
    }

    async handle<T>(response: any) {
        return await this.handleWithCustomErrorCode<T>(400)(response);
    }

    handleWithCustomErrorCode<T>(statusCode: string | null | number) {
        return async (res: any) => {
            const response = await res.json() as HttpResponseObject<T>;
            if (!this.check(response)) throw new Error("INVALID VERSION OR SIGNATURE");
            if (response.statusCode == statusCode) throw response.error;
            return response.payload;
        }
    }

    error<T>({ version = this.version, errorMsg = "", message, errorStatus = null, errorCode, statusCode = 400, type = HttpResponseType.ERROR }:
        { version?: string, errorMsg?: string, message?: string, errorStatus?: any, errorCode?: number | string, statusCode?: number | string, type?: HttpResponseType } = {}): HttpResponseObject<T> {
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
    success<T>({ version = this.version, message = "", payload = null, statusCode = 200, type = HttpResponseType.REQUEST }:
        { version?: string, message?: string, payload?: T | null, statusCode?: number | string, type?: HttpResponseType } = {}): HttpResponseObject<T> {
        const timestamp = new Date();
        return {
            status: 'Succeed',
            statusCode,
            version,
            type,
            timestamp,
            message,
            signature: createSign(payload, this.secretKey),
            payload: payload
        }
    }
    ok<T>(): HttpResponseObject<T> {
        return this.success({ message: 'ok', type: HttpResponseType.OK })
    }
    heartBeat<T>(): HttpResponseObject<T> {
        return this.success({ message: 'Heart-Beat', type: HttpResponseType.HEART_BEAT });
    }
}



export declare interface StandardHttpRequestConstructor {
    version: string,
    secretKey: string | null
}
export class StandardHttpRequest {
    version: string = '1';
    secretKey: string | null = null;

    constructor({ version = '1', secretKey }: StandardHttpRequestConstructor) {
        this.version = version;
        this.secretKey = secretKey;
    }

    request(payload: object | any): HttpRequestObject {
        const signature = createSign(payload, this.secretKey);
        return {
            version: this.version,
            timestamp: new Date(),
            signature: signature,
            payload: payload
        }
    }

    check(requestObject: HttpRequestObject | object): HttpRequestObject | object {
        if (this.isValid(requestObject)) {
            return requestObject;
        }
        throw new Error("[STANDARD-HTTP-REQUEST]: INVALID REQUEST OBJECT WITH SIGNATURE")
    }


    parse(requestObject: HttpRequestObject): object | null {
        if (this.isValid(requestObject)) {
            return requestObject.payload;
        }
        return null;
    }


    tryParse(requestObject: HttpRequestObject): object | null {
        if (this.isValid(requestObject)) {
            return requestObject.payload;
        }
        throw new Error("[STANDARD-HTTP-REQUEST]: INVALID REQUEST OBJECT WITH SIGNATURE")
    }


    isValid(requestObject: HttpRequestObject | object, signature: string | null | undefined = this.secretKey): boolean {
        if (this.#isHttpRequestObject(requestObject)) {
            if (this.version != requestObject.version) return false;
            return checkSign({
                payload: requestObject.payload,
                key: this.secretKey,
                signature: requestObject.signature || signature || ''
            });
        } else {
            return checkSign({
                payload: requestObject,
                key: this.secretKey,
                signature: signature || ''
            })
        }
    }

    #isHttpRequestObject(ob: any): ob is HttpRequestObject {
        return (
            typeof ob === "object" &&
            ob !== null &&
            typeof ob.version === "string" &&
            ob.timestamp instanceof Date &&
            (typeof ob.signature === "string" || ob.signature === null) &&
            (typeof ob.payload === "object" || ob.payload === null || ob.payload !== undefined)
        );
    }
}



export const HttpResponse: HttpResponse = {
    error: ({ version = LATEST_API_VERSION, errorMsg = "", message, errorStatus = null, errorCode, statusCode = 400, type = HttpResponseType.ERROR } = {}) => {
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
    success: ({ version = LATEST_API_VERSION, message = "", payload = null, statusCode = 200, type = HttpResponseType.REQUEST } = {}) => {
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
    ok() {
        return HttpResponse.success({ message: 'ok', type: HttpResponseType.OK })
    },
    heartBeat() {
        return HttpResponse.success({ message: 'Heart-Beat', type: HttpResponseType.HEART_BEAT });
    }
}


export const FetchResponse = {
    async handle(res: any) {
        const response = await res.json();
        if (response.statusCode == 400) throw response.error;
        return response.payload;
    },
    async handleWithCustomErrorCode(statusCode: string | null | number) {
        return async (res: any) => {
            const response = await res.json();
            if (response.statusCode == statusCode) throw response.error;
            return response.payload;
        }
    }
}


export const Fetch = {
    createFetchOptions({ method, data }: { method: HttpMethods, data: any } = { method: HttpMethods.POST, data: {} }) {
        return {
            method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    },
    put(data: any = {}) {
        return this.createFetchOptions({ method: HttpMethods.PUT, data })
    },
    post(data: any = {}) {
        return this.createFetchOptions({ method: HttpMethods.POST, data })
    },
    delete(data: any = {}) {
        return this.createFetchOptions({ method: HttpMethods.DELETE, data })
    },
}
