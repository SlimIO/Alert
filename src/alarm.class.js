// Require Node.js Dependencies
const events = require("events");

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
         *
         * @throws {TypeError}
         */
        constructor(message, options = Object.create(null)) {
            super();
            if (typeof message !== "string") {
                throw new TypeError("message must be a string");
            }

            const { entity = 1, severity = Alarm.DefaultSeverity } = options;
            if (typeof entity === "undefined" || entity === null) {
                throw new TypeError("entity must be a number or an Entity Object");
            }
            if (typeof severity !== "number") {
                throw new TypeError("severity must be a number");
            }

            this.cid = null;
            this.severity = severity;
            this.message = message;
            this.entity = entity;

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
                severity: this.severity
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
