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
    OPTION: "OPTION";
}>;
export declare type HttpResponseObject<T> = {
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
export declare type HttpMethods = typeof HttpMethods[keyof typeof HttpMethods];
export declare type HttpResponseType = typeof HttpResponseType[keyof typeof HttpResponseType];
export declare type HttpResponse = {
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
export declare const HttpResponse: HttpResponse;
export declare const FetchResponse: {
    handle(res: any): Promise<any>;
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
