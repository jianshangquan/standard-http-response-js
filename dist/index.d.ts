declare function createSign(object?: any, key?: string | undefined): string | null;
declare type HttpResponseObject<T> = {
    status: string;
    statusCode: number;
    version: string;
    type: HttpResponseType;
    timestamp: Date;
    message: string | undefined;
    signature?: string | null;
    error?: {
        status?: string;
        message?: string;
        errorMessage?: string;
    };
    payload: T | null;
};
declare const HttpMethods: Readonly<{
    POST: "POST";
    PUT: "PUT";
    GET: "GET";
    DELETE: "DELETE";
    OPTIONS: "OPTIONS";
    TRACE: "TRACE";
    PATCH: "PATCH";
    CONNECT: "CONNECT";
    HEAD: "HEAD";
}>;
declare type HttpMethods = typeof HttpMethods[keyof typeof HttpMethods];
declare const HttpResponseType: Readonly<{
    REQUEST: "request";
    HEART_BEAT: "heart-beat";
    OK: "OK";
    ERROR: "error";
}>;
declare type HttpResponseType = typeof HttpResponseType[keyof typeof HttpResponseType];
declare interface StandardHttpResponseConstructor {
    version: string;
}
declare class StandardHttpResponse {
    version: string;
    constructor(prop: StandardHttpResponseConstructor);
    error<T>({ version, errorMsg, message, errorStatus, statusCode, type }?: {
        version?: string;
        errorMsg?: string;
        message?: string;
        errorStatus?: any;
        statusCode?: number;
        type?: HttpResponseType;
    }): HttpResponseObject<T>;
    success<T>({ version, message, payload, statusCode, type }?: {
        version?: string;
        message?: string;
        payload?: T | null;
        statusCode?: number;
        type?: HttpResponseType;
    }): HttpResponseObject<T>;
    ok<T>(): HttpResponseObject<T>;
    heartBeat<T>(): HttpResponseObject<T>;
}
declare type HttpResponse = {
    error: <T>(prop: {
        version?: string;
        errorMsg?: string;
        message?: string;
        errorStatus?: any;
        statusCode?: number;
        type?: HttpResponseType;
    }) => HttpResponseObject<T>;
    success: <T>(prop: {
        version?: string;
        message?: string;
        payload?: T;
        statusCode?: number;
        type?: HttpResponseType;
    }) => HttpResponseObject<T>;
    ok: <T>() => HttpResponseObject<T>;
    heartBeat: <T>() => HttpResponseObject<T>;
};
declare const HttpResponse: HttpResponse;
declare const FetchResponse: {
    handle(res: any): Promise<any>;
};
declare const Fetch: {
    createFetchOptions({ method, data }?: {
        method: HttpMethods;
        data: any;
    }): {
        method: HttpMethods;
        body: string;
        headers: {
            'Content-Type': string;
        };
    };
    put(data?: any): {
        method: HttpMethods;
        body: string;
        headers: {
            'Content-Type': string;
        };
    };
    post(data?: any): {
        method: HttpMethods;
        body: string;
        headers: {
            'Content-Type': string;
        };
    };
    delete(data?: any): {
        method: HttpMethods;
        body: string;
        headers: {
            'Content-Type': string;
        };
    };
};

export { Fetch, FetchResponse, HttpMethods, HttpResponse, HttpResponseObject, HttpResponseType, StandardHttpResponse, StandardHttpResponseConstructor, createSign };
