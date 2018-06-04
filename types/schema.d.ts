interface Model {
    [propName: string]: TypeInfo;
}

interface TypeInfo {
    type: string;
    default: any;
    extra: object;
}