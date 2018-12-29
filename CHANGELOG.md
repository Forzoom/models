### Version

#### 0.0.1(deprecated)
1. basic support

#### 0.0.2(deprecated)
1. fix getSnake()/getCamel() fail
1. add unit test

#### 0.0.3(deprecated)
1. add `rollup-plugin-babel`

#### 0.0.4(deprecated)
1. bugfix

#### 0.0.5(deprecated)
1. add #equal function
1. bugfix

#### 0.0.6(deprecated)
1. bugfix

#### 0.0.7(deprecated)
1. bugfix

#### 0.0.8
1. bugfix

#### 0.0.9
1. `model` add `extra` property

#### 0.0.10
1. better `inflate()`. `inflate()` now doesn't accept unregister property

#### 0.0.11
1. metaInfo允许设置configurable
1. 添加setNullable(key, nullable)，允许对模型进行修改

#### 0.0.12
1. 允许非共享的metaInfo

#### 0.0.18
1. 添加types支持

#### 0.0.22
1. build: 添加tsconfig.json并完成修改为typescript编写
2. build: 修改umd包全局输出对象 Schema -> Models
3. feat: 修改Schema类的_models为静态变量
4. feat: 修改util.snakeCase函数逻辑
5. style: 优化代码样式，主要修复tslint错误