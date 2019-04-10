/**
 * @namespace Utils
 */

/**
 * @async
 * @func doWhile
 * @memberof Utils#
 * @param {Object} [options] options
 * @param {any} cond condition to execute in do while
 * @returns {Boolean}
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
 * @func sleep
 * @memberof Utils#
 * @param {!Number} ms milliseconds
 * @returns {Promise<void>}
 */
function sleep(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @func handleVars
 * @memberof Utils#
 * @param {!String} message original message
 * @param {Object} [payload] payload data
 * @returns {String}
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
