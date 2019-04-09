# Alert
![V1.0](https://img.shields.io/badge/version-0.1.0-blue.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)

## Requirements
- Node.js v10 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/alert
# or
$ yarn add @slimio/alert
```

## Usage example
A simple addon that will throw an alarm every second...

```js
// Require Dependencies
const Addon = require("@slimio/addon");
const alert = require("@slimio/alert");
const metrics = require("@slimio/metrics");

// Declare addons
const test = new Addon("test");
const { Entity } = metrics(test);
const { Alarm } = alert(test);

let intervalId;
const MyEntity = new Entity("MyEntity", {
    description: "Hello world!"
});

test.on("awake", () => {
    intervalId = setInterval(() => {
        new Alarm("hello world!", {
            correlateKey: "test_alarm",
            entity: MyEntity
        });
    }, 1000);

    test.ready();
});

test.on("close", () => {
    clearInterval(intervalId);
});

module.exports = test;
```

## API
TBC

## License
MIT
