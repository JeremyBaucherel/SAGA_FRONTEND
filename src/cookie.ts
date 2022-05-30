function parseCookieValue(s: string): string {
    if (s.indexOf('"') === 0) {
        // This is a quoted cookie as according to RFC2068, unescape...
        s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    try {
        // Replace server-side written pluses with spaces.
        // If we can't decode the cookie, ignore it, it's unusable.
        // If we can't parse the cookie, ignore it, it's unusable.
        s = decodeURIComponent(s.replace(/\+/g, ' '));
        return s;
    } catch(e) {
        return '';
    }
}



function read(cookieName: string): string {
    let cookies = document.cookie ? document.cookie.split('; ') : [];

    let value = '';

    for (let i = 0, l = cookies.length; i < l; i++) {
        var parts = cookies[i].split('=');
        var rawName = parts.shift();
        if (rawName) {
            var name = decodeURIComponent(rawName);
            var cookie = parts.join('=');

            if (cookieName && cookieName === name) {
                value = parseCookieValue(cookie) ;
                break;
            }
        }
    }

    return value;
}

export function readString (cookieName: string): string {
    return read(cookieName);
}

interface IOptions {
    expires?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
}

export function writeString(cookieName: string, cookieValue: string, options: IOptions) {
    //_writeString(cookieName, '', {expires: -1});
    _writeString(cookieName, cookieValue, options);
}

function _writeString (cookieName: string, cookieValue: string, options: IOptions) {
    let cookie = encodeURIComponent(cookieName);
    cookie += '=';
    cookie += encodeURIComponent(cookieValue);

    if (options.expires) {
        var t = new Date();
        t.setTime(t.getTime() + (options.expires * 36e+5));    // t.setTime(t.getTime() + (options.expires * 864e+5));
        cookie += '; expires=' + t.toUTCString();
    }

    cookie += '; path=/';

    if (options.domain) {
        cookie += '; domain=' + options.domain;
    }

    if (options.secure) {
        cookie += '; secure';
    }
    document.cookie = cookie;
}
