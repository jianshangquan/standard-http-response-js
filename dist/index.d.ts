declare function createSign(object?: any, key?: string | undefined): string | null;
declare type HttpResponseObject<T> = {
    status: string;
    statusCode: number;
    version: number;
    type: HttpResponseType;
    timestamp: Date;
    message: string | undefined;
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
declare type HttpResponse = {
    error: <T>(prop: {
        version?: number;
        errorMsg?: string;
        message?: string;
        errorStatus?: any;
        statusCode?: number;
        type?: HttpResponseType;
    }) => HttpResponseObject<T>;
    success: <T>(prop: {
        version?: number;
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

export { Fetch, FetchResponse, HttpMethods, HttpResponse, HttpResponseObject, HttpResponseType, createSign };
