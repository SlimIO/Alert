/// <reference types="node" />
/// <reference types="@slimio/addon" />
/// <reference types="@slimio/tsd" />
/// <reference types="@slimio/metrics" />

import * as events from "events";

declare class Alarm extends events {
    constructor(message: string, options: Alert.ConstructorOptions);
    toJSON(): SlimIO.RawAlarm;

    public cid: SlimIO.CID;
    public severity: number;
    public entity: Metrics.Entity | number;
    public message: string;
    public correlateKey: string;

    static DefaultSeverity: number;
    static Severity: SlimIO.AlarmSeverity;
}

declare function Alert(addon: Addon): {
    Alarm: typeof Alarm;
};

declare namespace Alert {
    interface ConstructorOptions {
        severity?: SlimIO.AlarmSeverity;
        entity?: Metrics.Entity | string | number;
        correlateKey: string;
    }
}

export as namespace Alert;
export = Alert;
