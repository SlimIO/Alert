// Require Third-party Dependencies
const SafeEmitter = require("@slimio/safe-emitter");
const is = require("@slimio/is");
const TimeMap = require("@slimio/timemap");

// Require Internal Dependencies
const getAlarm = require("./alarm.class");
const { sleep } = require("./utils");

// CONSTANTS
const TYPES = Object.freeze({ alarm: 0 });
const EVENT_MAP = Object.freeze({
    [TYPES.alarm]: "create_alarm"
});

/**
 * @func alert
 * @param {!Addon} addon SlimIO addon container
 * @returns {void}
 */
function alert(addon) {
    if (addon.constructor.name !== "Addon") {
        throw new TypeError("addon must be instanceof Addon");
    }

    // Scoped Variables
    const cache = [];
    const alarms = new TimeMap();
    const event = new SafeEmitter();
    event.catch((err) => console.error(err));

    // Scoped Bind
    const Alarm = getAlarm(event);

    function sendMessage(target, args) {
        return new Promise((resolve, reject) => addon.sendMessage(target, { args }).subscribe(resolve, reject));
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
            for (let i = 0; i < 5; i++) {
                entity = await sendMessage("events.search_entities", [{ name: alarm.entity }]);
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

        alarm.cid = `${alarm.entity}#${alarm.correlateKey}`;
        const isOpen = await sendMessage("events.create_alarm", [alarm.toJSON()]);
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
            const tempLocalCache = cache.splice(0, cache.length).sort((a, b) => a[0] - b[0]);
            for (const [type, element] of tempLocalCache) {
                event.emit(EVENT_MAP[type], element);
            }
        });
    });

    return { Alarm };
}

module.exports = alert;
