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

function assertCK(correlateKey) {
    if (typeof correlateKey !== "string") {
        throw new TypeError("correlateKey must be a string");
    }
    if (correlateKey.length < 1 || correlateKey.length > 14) {
        throw new TypeError("correlateKey length must be betweeen 1 and 14");
    }
}

module.exports = { doWhile, assertCK };
