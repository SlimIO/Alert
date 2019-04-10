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
    templateLoader: <T>(template: Alert.Template) => Alert.TemplateResult<T>;
};

declare namespace Alert {
    interface TemplateResult<T> {
        [name: keyof T]: (payload?: T[keyof T]) => Alarm
    }

    interface Template {
        [name: string]: {
            message: string;
            correlateKey: string;
            severity?: number;
            entity?: string | number;
        }
    }

    interface ConstructorOptions {
        severity?: SlimIO.AlarmSeverity;
        entity?: Metrics.Entity | string | number;
        correlateKey: string;
    }
}

export as namespace Alert;
export = Alert;
