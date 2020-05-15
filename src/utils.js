"use strict";

/**
 * @namespace Utils
 */

/**
 * @async
 * @function doWhile
 * @memberof Utils#
 * @param {object} [options] options
 * @param {number} [options.max=1] maximum while
 * @param {number} [options.ms=1000] time to wait in milliseconds
 * @param {any} cond condition to execute in do while
 * @returns {boolean}
 */
async function doWhile({ max = 1, ms = 1000 }, cond) {
    let maxRetry = max;
    do {
        if (maxRetry-- === 0) {
            return true;
        }
        await new Promise((resolve) => setTimeout(resolve, ms));
    } while (cond());

    return false;
}

/**
 * @function sleep
 * @memberof Utils#
 * @param {!number} ms milliseconds
 * @returns {Promise<void>}
 */
function sleep(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @function handleVars
 * @memberof Utils#
 * @param {!string} message original message
 * @param {object} [payload] payload data
 * @returns {string}
 */
function handleVars(message, payload = Object.create(null)) {
    const regex = /\${([\w]+)}/g;
    let ret = message;
    let match = null;

    while ((match = regex.exec(message)) !== null) {
        const [full, name] = match;
        if (Reflect.has(payload, name)) {
            ret = ret.replace(full, payload[name]);
        }
    }

    return ret;
}

module.exports = { doWhile, sleep, handleVars };
