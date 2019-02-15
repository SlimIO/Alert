// Require Node.js Dependencies
const events = require("events");

// Require Third-party Dependencies
const is = require("@slimio/is");

// Require Internal Dependencies
const { assertCK } = require("./utils");

function exportClass(event) {
    /**
     * @class Alarm
     */
    class Alarm extends events {
        /**
         * @constructor
         * @memberof Alarm#
         * @param {!String} message Alarm message
         * @param {Object} [options] Alarm options
         * @param {Entity | Number | String} [options.entity] entity
         * @param {Number} [options.severity=1] alarm severity
         * @param {String} [options.correlateKey] correlateKey
         *
         * @throws {TypeError}
         */
        constructor(message, options = Object.create(null)) {
            super();
            if (typeof message !== "string") {
                throw new TypeError("message must be a string");
            }

            const { entity = 1, severity = Alarm.DefaultSeverity } = options;
            if (is.nullOrUndefined(entity)) {
                throw new TypeError("entity must be a number or an Entity Object");
            }
            if (typeof severity !== "number") {
                throw new TypeError("severity must be a number");
            }
            assertCK(options.correlateKey);

            this.cid = null;
            this.severity = severity;
            this.message = message;
            this.entity = entity;
            this.correlateKey = options.correlateKey;

            event.emit("create_alarm", this);
        }

        /**
         * @method toJSON
         * @memberof Alarm#
         * @returns {Object}
         */
        toJSON() {
            return {
                message: this.message,
                entity: this.entity,
                severity: this.severity,
                correlateKey: this.correlateKey
            };
        }
    }

    Alarm.Severity = Object.freeze({
        Critical: 0,
        Major: 1,
        Minor: 2
    });
    Alarm.DefaultSeverity = Alarm.Severity.Major;

    return Alarm;
}

module.exports = exportClass;
