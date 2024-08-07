export declare function createSign(object?: any, key?: string | undefined): string | null;
export declare const HttpResponseType: Readonly<{
    REQUEST: "request";
    HEART_BEAT: "heart-beat";
    OK: "OK";
    ERROR: "error";
}>;
export declare const HttpMethods: Readonly<{
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
export declare type HttpResponseObject<T> = {
    status: string;
    statusCode: number | string;
    version: string;
    type: HttpResponseType;
    timestamp: Date;
    message: string | undefined;
    signature?: string | null;
    error?: {
        status?: string;
        message?: string;
        errorMessage?: string;
        errorCode?: number | string;
    };
    payload: T | null;
};
export declare type HttpMethods = typeof HttpMethods[keyof typeof HttpMethods];
export declare type HttpResponseType = typeof HttpResponseType[keyof typeof HttpResponseType];
export declare type HttpResponse = {
    error: <T>(prop: {
        version?: string;
        errorMsg?: string;
        message?: string;
        errorStatus?: any;
        errorCode?: number | string;
        statusCode?: number | string;
        type?: HttpResponseType;
    }) => HttpResponseObject<T>;
    success: <T>(prop: {
        version?: string;
        message?: string;
        payload?: T;
        statusCode?: number | string;
        type?: HttpResponseType;
    }) => HttpResponseObject<T>;
    ok: <T>() => HttpResponseObject<T>;
    heartBeat: <T>() => HttpResponseObject<T>;
};
export declare interface StandardHttpResponseConstructor {
    version: string;
}
export declare class StandardHttpResponse {
    version: string;
    constructor(prop: StandardHttpResponseConstructor);
    error<T>({ version, errorMsg, message, errorStatus, errorCode, statusCode, type }?: {
        version?: string;
        errorMsg?: string;
        message?: string;
        errorStatus?: any;
        errorCode?: number | string;
        statusCode?: number | string;
        type?: HttpResponseType;
    }): HttpResponseObject<T>;
    success<T>({ version, message, payload, statusCode, type }?: {
        version?: string;
        message?: string;
        payload?: T | null;
        statusCode?: number | string;
        type?: HttpResponseType;
    }): HttpResponseObject<T>;
    ok<T>(): HttpResponseObject<T>;
    heartBeat<T>(): HttpResponseObject<T>;
}
export declare const HttpResponse: HttpResponse;
export declare const FetchResponse: {
    handle(res: any): Promise<any>;
    handleWithCustomErrorCode(statusCode: string | null | number): Promise<(res: any) => Promise<any>>;
};
export declare const Fetch: {
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
