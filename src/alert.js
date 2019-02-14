// Require Third-party Dependencies
const SafeEmitter = require("@slimio/safe-emitter");

// Require Internal Dependencies
const getAlarm = require("./alarm.class");

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

    // Scoped Bind
    const Alarm = getAlarm(event);

    // Scoped Variables
    const cache = [];
    const event = new SafeEmitter();
    event.catch((err) => console.error(err));

    event.on("create_alarm", (alarm) => {
        if (!addon.isAwake) {
            return cache.push([TYPES.alarm, alarm]);
        }

        console.log("create alarm");

        return void 0;
    });

    process.nextTick(() => {
        if (!addon.locks.has("events")) {
            addon.lockOn("events");
        }

        addon.on("awake", async() => {
            const lCache = cache.splice(0, cache.length).sort((a, b) => a[0] - b[0]);
            for (const [type, element] of lCache) {
                event.emit(EVENT_MAP[type], element);
            }
        });
    });

    return { Alarm };
}

module.exports = alert;
