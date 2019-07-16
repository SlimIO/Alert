"use strict";

// Require Node.js Dependencies
const events = require("events");

// Require Third-party Dependencies
const is = require("@slimio/is");
const { assertCK } = require("@slimio/utils");

/**
 * @function exportClass
 * @param {*} event
 * @returns {Alarm}
 */
function exportClass(event) {
    class Alarm extends events {
        /**
         * @class Alarm
         * @memberof Alarm#
         * @param {!string} message Alarm message
         * @param {object} [options] Alarm options
         * @param {Entity|number|string} [options.entity] entity
         * @param {number} [options.severity=1] alarm severity
         * @param {string} [options.correlateKey] correlateKey
         *
         * @throws {TypeError}
         */
        constructor(message, options = Object.create(null)) {
            super();
            if (typeof message !== "string") {
                throw new TypeError("message must be a string");
            }
            if (!is.plainObject(options)) {
                throw new TypeError("options must be a plainObject");
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
         * @function toJSON
         * @memberof Alarm#
         * @returns {object}
         */
        toJSON() {
            return {
                message: this.message,
                entityId: this.entity,
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
