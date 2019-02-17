// Require Third-party Dependencies
const SafeEmitter = require("@slimio/safe-emitter");

// Require Internal Dependencies
const getAlarm = require("./alarm.class");
const is = require("@slimio/is");

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
    const alarms = new Map();
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
                const alarm = alarms.get(CID);
                alarm.emit("open");
            }
        }
    });

    event.on("create_alarm", async(alarm) => {
        if (!addon.isAwake) {
            return cache.push([TYPES.alarm, alarm]);
        }

        // TODO: Wait for elements to be available!
        if (typeof alarm.entity === "string") {
            const entity = await sendMessage("events.search_entities", [{ name: alarm.entity }]);
            if (is.nullOrUndefined(entity)) {
                throw new Error("Unable to found entity id!");
            }
            alarm.entity = entity.id;
        }

        const CID = `${alarm.entity}#${alarm.correlateKey}`;
        await sendMessage("events.create_alarm", [alarm.toJSON()]);
        alarm.cid = CID;
        alarms.set(CID, alarm);

        return void 0;
    });

    // Check for lock at the end the current event-loop phase
    process.nextTick(() => {
        if (!addon.locks.has("events")) {
            addon.lockOn("events");
        }

        addon.on("awake", async() => {
            const tempLocalCache = cache.splice(0, cache.length).sort((a, b) => a[0] - b[0]);
            for (const [type, element] of tempLocalCache) {
                event.emit(EVENT_MAP[type], element);
            }
        });
    });

    return { Alarm };
}

module.exports = alert;
