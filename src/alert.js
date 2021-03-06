/* eslint-disable require-atomic-updates */
"use strict";

// Require Third-party Dependencies
const SafeEmitter = require("@slimio/safe-emitter");
const is = require("@slimio/is");
const TimeMap = require("@slimio/timemap");

// Require Internal Dependencies
const getAlarm = require("./alarm.class");
const { sleep, doWhile, handleVars } = require("./utils");

// CONSTANTS
const KEEP_TIME_MS = 30000;
const TYPES = Object.freeze({ alarm: 0 });
const EVENT_MAP = Object.freeze({
    [TYPES.alarm]: "create_alarm"
});

/**
 * @function alert
 * @param {!Addon} addon SlimIO addon container
 * @returns {void}
 */
function alert(addon) {
    if (addon.constructor.name !== "Addon") {
        throw new TypeError("addon must be instanceof Addon");
    }

    // Scoped Variables
    const cache = [];
    const alarms = new TimeMap(KEEP_TIME_MS);
    const event = new SafeEmitter();
    event.catch((err) => console.error(err));

    // Scoped Bind
    const Alarm = getAlarm(event);

    /**
     * @function templateLoader
     * @param {*} template
     * @returns {Readonly<object>}
     */
    function templateLoader(template) {
        if (!is.plainObject(template)) {
            throw new TypeError("template must be a plainObject");
        }

        const ret = Object.create(null);
        for (const [name, data] of Object.entries(template)) {
            if (!is.string(data.message) || !is.string(data.correlateKey)) {
                continue;
            }
            const message = data.message;
            delete data.message;

            Reflect.defineProperty(ret, name, {
                value: (payload) => new Alarm(handleVars(message, payload), data)
            });
        }

        return Object.freeze(ret);
    }

    addon.of("Alarm.open").subscribe({
        next(CID) {
            if (alarms.has(CID)) {
                alarms.get(CID).emit("open");
            }
        }
    });

    event.on("create_alarm", async(alarm) => {
        if (!addon.isAwake) {
            return cache.push([TYPES.alarm, alarm]);
        }

        if (alarm.entity.constructor.name === "Entity") {
            const stop = await doWhile({ max: 6, ms: 5 }, () => alarm.entity.id === null);
            if (stop) {
                throw new Error("Entity.id is null");
            }

            alarm.entity = alarm.entity.id;
        }
        else if (typeof alarm.entity === "string") {
            let entity;
            for (let id = 0; id < 5; id++) {
                entity = await addon.sendOne("events.search_entities", [{ name: alarm.entity }]);
                if (is.nullOrUndefined(entity)) {
                    await sleep(99);
                    continue;
                }

                break;
            }

            if (is.nullOrUndefined(entity)) {
                throw new Error(`Unable to found entity with name ${alarm.entity}`);
            }
            alarm.entity = entity.id;
        }
        else if (typeof alarm.entity === "number") {
            let idFound = false;
            for (let id = 0; id < 5; id++) {
                const ret = await addon.sendOne("events.get_entity_by_id", [alarm.entity]);
                if (!is.nullOrUndefined(ret)) {
                    idFound = true;
                    break;
                }

                await sleep(99);
            }

            if (!idFound) {
                throw new Error(`Unable to found entity with id ${alarm.entity}`);
            }
        }

        alarm.cid = `${alarm.entity}#${alarm.correlateKey}`;
        const isOpen = await addon.sendOne("events.create_alarm", [alarm.toJSON()]);
        if (isOpen) {
            alarm.emit("open");
        }
        else {
            alarms.set(alarm.cid, alarm);
        }

        return void 0;
    });

    // Check for lock at the end the current event-loop phase
    process.nextTick(() => {
        if (!addon.locks.has("events")) {
            addon.lockOn("events");
        }

        addon.on("awake", () => {
            const tempLocalCache = cache.splice(0, cache.length).sort((leftOp, rightOp) => leftOp[0] - rightOp[0]);
            for (const [type, element] of tempLocalCache) {
                event.emit(EVENT_MAP[type], element);
            }
        });
    });

    return { Alarm, templateLoader };
}

module.exports = alert;
