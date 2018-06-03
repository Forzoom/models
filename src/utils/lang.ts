
// 定义data descriptor
export function defVal(target: any, key: string, val: any, enumerable: boolean = true, configurable: boolean = true, writable: boolean = true) {
	Object.defineProperty(target, key, {
		value: val,
		configurable,
		enumerable,
		writable,
	});
}

// 强制转化成type
export function typeCast(value: any, type: string): any {
	return window[type](value);
}