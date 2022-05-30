function isArray (value: any): boolean {
	return Array.isArray(value) === true;
}

function isDate (value: any): boolean {
	return Object.prototype.toString.call(value) == '[object Date]';
}

function isNumber (value: any): boolean {
	return typeof value == 'number';
}

function isString (value: any): boolean {
	return typeof value == 'string';
}

function isObject (value: any): boolean {
	return value != null && typeof value == 'object';
}

function isDefined (value: any): boolean {
	return typeof value != 'undefined';
}

function isUndefined (value: any): boolean {
	return typeof value == 'undefined';
}

function isFunction (value: any): boolean {
	return typeof value == 'function';
}

function isRegExp (value: any): boolean {
	return (value instanceof RegExp) == true;
}

function isWindow (obj: any) {
	return obj && obj.document && obj.location && obj.alert && obj.setInterval;
}

function isScope (obj: any): boolean {
	return obj && obj.$evalAsync && obj.$watch;
}

function isFile(obj: any): boolean {
	return toString.apply(obj) === '[object File]';
}

function isBoolean (value: any): boolean {
	return typeof value == 'boolean';
}

export function equals (o1: any, o2: any): boolean {
	if (o1 === o2) return true;
	if (o1 === null || o2 === null) return false;
	if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
	var t1 = typeof o1;
	var t2 = typeof o2
	var length = 0;
	var key;
	let keySet: {[prop: string]: boolean} = {};

	if (t1 == t2) {
		if (t1 == 'object') {
		if (isArray(o1)) {
			if (!isArray(o2)) return false;
			if ((length = o1.length) == o2.length) {
			for(key=0; key<length; key++) {
				if (!equals(o1[key], o2[key])) return false;
			}
			return true;
			}
		} else if (isDate(o1)) {
			return isDate(o2) && o1.getTime() == o2.getTime();
		} else if (isRegExp(o1) && isRegExp(o2)) {
			return o1.toString() == o2.toString();
		} else {
			if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2)) {
				return false;
			}
			keySet = {};
			for(key in o1) {
			if (key.charAt(0) === '$' || isFunction(o1[key])) continue;
			if (!equals(o1[key], o2[key])) return false;
				keySet[key] = true;
			}
			for(key in o2) {
				if (!keySet.hasOwnProperty(key) &&
					key.charAt(0) !== '$' &&
					o2[key] !== undefined &&
					!isFunction(o2[key])) return false;
				}
				return true;
			}
		}
	}
	return false;
}