import Schema from './schema';
import {
    RuntimeOptions,
} from '../types/index';

function RuntimeType(options: RuntimeOptions) {
    return function(target: any) {
        // 这里target代表class，或者说代表一个function
        target.models = options.models;
    }
}

export {
    Schema,
    RuntimeType,
};