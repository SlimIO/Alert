# Alert
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/SlimIO/Alert/master/package.json?token=AOgWw3vrgQuu-U4fz1c7yYZyc7XJPNtrks5catjdwA%3D%3D&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![dep](https://img.shields.io/david/SlimIO/Alert)
![size](https://img.shields.io/github/languages/code-size/SlimIO/Alert)
[![Known Vulnerabilities](https://snyk.io//test/github/SlimIO/Alert/badge.svg?targetFile=package.json)](https://snyk.io//test/github/SlimIO/Alert?targetFile=package.json)
[![Build Status](https://travis-ci.com/SlimIO/Alert.svg?branch=master)](https://travis-ci.com/SlimIO/Alert)

## Requirements
- [Node.js](https://nodejs.org/en/) v12 or higher

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
import Addon from "@slimio/addon";
import alert from "@slimio/alert";
import metrics from "@slimio/metrics";

const test = new Addon("test");
const { Entity } = metrics(test);
const { Alarm } = alert(test);

const ALARM_INTERVAL = 1_000;
const MY_ENTITY = new Entity("MyEntity", {
    description: "Hello world!"
});

test.registerInterval(() => {
    new Alarm("hello world!", {
        correlateKey: "test_alarm",
        entity: MY_ENTITY
    });
}, ALARM_INTERVAL);

export default test;
```

## API
The alert package return a function described by the following interface:
```ts
declare function Alert(addon: Addon): {
    Alarm: typeof Alarm;
};
```

Each instance of Alarm are unique to the local Addon.

### Alarm
This section describe the methods and properties of Alarm Object.

<details><summary>constructor(message: string, options: Alert.ConstructorOptions)</summary>
<br />

Create a new Alarm Object.
```js
new Alarm("hello world alarm", {
    correlateKey: "test_alarm"
});
```

Available options are described the following interface:
```ts
interface ConstructorOptions {
    severity?: SlimIO.AlarmSeverity;
    entity?: Metrics.Entity | string | number;
    correlateKey: string;
}
```
</details>

<details><summary>toJSON(): SlimIO.RawAlarm</summary>
<br />

Return a raw alarm. Refer to `@slimio/tsd` for more information.
</details>

#### Properties

```ts
declare class Alarm extends events {
    public cid: SlimIO.CID;
    public severity: number;
    public entity: Metrics.Entity | number;
    public message: string;
    public correlateKey: string;

    static DefaultSeverity: number;
    static Severity: SlimIO.AlarmSeverity;
}
```

Severity is defined in `@slimio/tsd` as follow:
```ts
enum AlarmSeverity {
    Critical,
    Major,
    Minor
}
```

The default severity is defined as **1** for **Major**.

## Dependencies

|Name|Refactoring|Security Risk|Usage|
|---|---|---|---|
|[@slimio/is](https://github.com/SlimIO/is#readme)|Minor|Low|Type checker|
|[@slimio/safe-emitter](https://github.com/SlimIO/safeEmitter#readme)|⚠️Major|Medium|Safe emitter|
|[@slimio/timemap](https://github.com/SlimIO/TimeMap#readme)|⚠️Major|Low|Time map|
|[@slimio/utils](https://github.com/SlimIO/Utils#readme)|Minor|High|Bunch of useful functions|

## License
MIT
