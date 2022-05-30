export const API_URL_PREFIX = (process.env.SY_API_URL ? process.env.SY_API_URL : 'http://localhost:8080');

export enum ECallStatus {
    NOT_STARTED,
    RUNNING,
    OK,
    NOK,
}

export enum EResponseStatus {
    OK = 'OK',
    NOK = 'NOK',
}

export interface IResponse<T> {
    status: EResponseStatus;
    body: T;
    errors: any;
    errorsSummary: string;
}

export type Callback = {(resp: IResponse<any>): void};

/**
 * An helper class to manipulate API call URLs.
 */
export class Url {
    components: string[];
    params?: {[paramName: string]: string};

    constructor  (components: string[], params?: {[paramName: string]: string}) {
        this.components = components;
        this.params = params;
    }

    toStringWithoutHostname (): string {
        let url = '';
        for (let i = 0; i < this.components.length; ++i) {
            url += '/';
            url += encodeURIComponent(this.components[i]);
        }

        let urlParams = '';
        if (this.params) {
            let paramNames = Object.keys(this.params);
            for (let i = 0; i < paramNames.length; ++i) {
                let paramName = paramNames[i];
                if (urlParams === '') {
                    urlParams = '?';
                } else {
                    urlParams += '&';
                }

                urlParams += encodeURIComponent(paramName);
                urlParams += '=';
                urlParams += encodeURIComponent(this.params[paramName]);
            }
        }

        return url + urlParams;
    }

    toString (): string {
        return API_URL_PREFIX + this.toStringWithoutHostname();
    }
}

export class JsonCall<T> {
    signal: any | null;
    status: ECallStatus;
    okCallback: any | null;
    nokCallback: any | null;

    constructor () {
        this.signal = null;
        this.okCallback = null;
        this.nokCallback = null;
        this.status = ECallStatus.NOT_STARTED;
    }



    get (urlParts: string[]): void {
        let url = new Url(urlParts);
        
        this.status = ECallStatus.RUNNING;

        let init: RequestInit = {
            method: 'GET',
            credentials: 'include'
        }
        fetch(url.toString(), init)
            .then (function (response): T {
                if (response.ok !== true) {
                    return getApiHttpErrorResponse(response);
                } else {
                    return response.json();
                }
            }.bind(this)).catch(function (err: Response) {
                return getApiHttpErrorResponse(err);
            }.bind(this))
            .then (function (response) {
                if (response.status == 'OK') {
                    this.receiveData(response);
                } else {
                    this.receiveDataError(response);
                }
            }.bind(this));
    }

    isNok(): boolean {
        return this.status == ECallStatus.NOK;
    }

    isNotStarted(): boolean {
        return this.status == ECallStatus.NOT_STARTED;
    }

    isOk(): boolean {
        return this.status == ECallStatus.OK;
    }
    
    isRunning(): boolean {
        return this.status == ECallStatus.RUNNING;
    }

    post (url: Url, data: any): void {
        this.status = ECallStatus.RUNNING;

        let payload = new FormData();
        payload.append("json", JSON.stringify(data));

        let init: RequestInit = {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data),
        }
        fetch(url.toString(), init)
            .then (function (response): T {
                if (response.ok !== true) {
                    return getApiHttpErrorResponse(response);
                } else {
                    return response.json();
                }
            }).catch((err: Response) => {
                return getApiHttpErrorResponse(err);
            })
            .then (function (response) {
                if (response.status == 'OK') {
                    this.receiveData(response);
                } else {
                    this.receiveDataError(response);
                }
            });
    }

    receiveData (resp: T): void {
        this.status = ECallStatus.OK;

        this.okCallback(resp);
    }

    receiveDataError (resp: T): void {
        this.status = ECallStatus.NOK;
        this.nokCallback(resp);
    }
}

/**
 * Make a POST request to the API as JSON.
 * @param url URL to post to.
 * @param data Data to post that will be JSONified.
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function postAsJson(url: Url, data: any, okCallback: {(response: any): void}, nokCallback: {(response: any): void}): Promise<void> {
    let payload = new FormData();
    payload.append( "json", JSON.stringify(data));

    let init: RequestInit = {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
    }
    return fetch(url.toString(), init)
    .then(function (resp){
        return resp.json();
    }).then(function (response) {
        if (response.status == 'OK') {
            okCallback(response);
        } else {
            nokCallback(response);
        }
    });
}

/**
 * Make a PUT request to the API as JSON.
 * @param url URL to post to.
 * @param data Data to post that will be JSONified.
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function putAsJson(url: Url, data: any, okCallback: {(response: any): void}, nokCallback: {(response: any): void}): Promise<void> {
    let payload = new FormData();
    payload.append( "json", JSON.stringify(data));

    let init: RequestInit = {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(data),
    }
    return fetch(url.toString(), init)
    .then(function (resp){
        return resp.json();
    }).then(function (response) {
        if (response.status == 'OK') {
            okCallback(response);
        } else {
            nokCallback(response);
        }
    });
}


/**
 * Get a proper API error response if the call to the server fails with no response.
 * @param httpResponse An HTTP response of the call that failed.
 */
export function getApiHttpErrorResponse (httpResponse?: Response): IResponse {
    if (httpResponse) {
        return {
            status: EResponseStatus.NOK,
            errors: {
                'http': httpResponse.status + ' : ' + httpResponse.statusText,
            },
            errorsSummary: httpResponse.status + ' : ' + httpResponse.statusText
        };
    } else {
        return {
            status: EResponseStatus.NOK,
            errors: {
                'http': 'Une erreur inattendue s\'est produite',
            },
            errorsSummary: 'Une erreur inattendue s\'est produite'
        };
    }
}

/**
 * Make a GET request to the API.
 * @param url URL to post to.
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function getJson (url: Url, okCallback: {(response: any): void}, nokCallback: {(response: any): void}): Promise<void> {
    let init: RequestInit = {
        credentials: 'include',
        method: 'GET',
    };

    return fetch(url.toString(), init)
    .then (function (response): IResponse {
        if (response.ok !== true) {
            return getApiHttpErrorResponse(response);
        } else {
            return response.json();
        }
    }).catch((err: Response) => {
        return getApiHttpErrorResponse(err);
    })
    .then (function (response) {
        if (response.status == 'OK') {
            okCallback(response);
        } else {
            nokCallback(response);
        }
    });
}

/**
 * Generate a random request token.
 */
export function getRequestToken (): string {
	var token = 'TOKEN';
	token += '-' + Date.now();
	token += '-' + Math.floor(Math.random()*(100000-0+1)+0);
	return token;
}

/**
 * Make a DELETE request to the API. Data will be JSONified.
 * @param url URL to make the call to.
 * @param data Data that will be sent as JSON.
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function deleteJson (url: Url, data :any, okCallback: {(response: any): void}, nokCallback: {(response: any): void}): Promise<void> {
    let init: RequestInit = {
        credentials: 'include',
        method: 'DELETE',
        body: JSON.stringify(data),
    };

    return fetch(url.toString(), init)
    .then (function (response) {
        return response.json();
    }).then (function (response) {
        if (response.status == 'OK') {
            okCallback(response);
        } else {
            nokCallback(response);
        }
    });
}



export function	copy(aObject:any){
    if (!aObject){return aObject;}
  
    let v;
    let bObject:any = Array.isArray(aObject) ? [] : {};
    for (const k in aObject) {
      v = aObject[k];
      bObject[k] = (typeof v === "object") ? copy(v) : v;
    }
  
    return bObject;
}



export function	hasAuthorization (user:any, autorisation:string): boolean {
    if(user){
        return user.hasAuthorization(autorisation);
    }
    else{
        return false
    }
}