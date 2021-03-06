### Install

npm i @forzoom/models

---
### Description

provide commonjs/es6/umd format file.

#### SnakeCase

for example:

1. foo_bar
1. foo_1

#### CamelCase

for example:

1. fooBar
1. foo1

---
### Feature

1. support kebabCase and snakeCase access
1. support simple type checker
1. provide `inflate()` for batch set property
1. provide `registerProperty()` for add property after instance is created
1. property support `Vue` reactive data bind

---
### Example

```
import Schema from '@forzoom/models';

class MyModel extends Schema {
    constructor(data) {
        super({
            key1: {
                type: 'String?',
                default: 'value1',
            },
            key2: {
                type: 'Number',
            },
            fooBar: {
                type: 'String?',
                default: 'fooBar',
            },
        }, data);
        this._name = MyModel.name;
    }
}

const model = new MyModel();
model.key1; // value1
model.key2; // null
model.fooBar; // fooBar
model.foo_bar; // fooBar

model.foo_bar = 'foo_bar';
model.fooBar; // foo_bar
model.foo_bar; // foo_bar

// inflate()
model.inflate({
    key1: 'key1',
    key2: 1,
});

// registerProperty()
model.helloWorld; // undefined
model.registerProperty('helloWord', {
    type: 'String?',
    default: 'steve',
});
model.helloWorld; // steve
model.hello_world; // steve

// equal
const test = new MyModel();
model.equal(test) // false
```

---
### Model

`Model` is object which contain `property`'s info, such as type, default value and so on

#### example
```
{
    key1: {
        type: 'String?',
        default: 'value1',
    },
    key2: {
        type: 'Number',
    },
    fooBar: {
        type: 'String?',
        default: 'fooBar',
    },
}
```

#### type

type of property.

#### default

default value of property.

#### extra (since@0.0.9)

extra value of property.

---
### Function

#### Schema

##### inflate(obj: object): void
##### registerProperty(key: string, typeInfo: TypeInfo): void
##### getSnake(): object
##### getCamel(): object
##### equal(to: obj): boolean

#### Schema.utils

##### arrayEqual(arr1: Array<any>, arr2: Array<any>): boolean

---
### Test

npm run test