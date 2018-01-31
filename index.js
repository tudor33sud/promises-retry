/**
 * @typedef {Object} retryOptions
 * @property {Number} retries The maximum amount of times to retry the operation. Default is 5.
 * @property {Number} factor The exponential factor to use. Default is 2.
 * @property {Number} minTimeout The number of milliseconds before starting a retry. Default is 1000.
 * @property {function(attempt,Error):Boolean} exit Function to determine if retries should not continue any further. By default this function returns false if another one is not specified in options.
 */


/**
 * Helper to provide easy retry for a function which returns a promise
 * @param {Function} fn function that returns the promise
 * @param {Array<String>} args arguments which should be applied to the function
 * @param {retryOptions} options retry options
 */
async function retry(fn, args, options) {
    const opts = Object.assign({}, {
        retries: 5,
        factor: 2,
        minTimeout: 1000,
        exit: (attempt, err) => { return false }
    }, options || {});
    for (let i = 0; i < opts.retries; i++) {
        try {
            return await fn(...args);
        } catch (err) {
            const currentAttempt = i + 1;
            err.retry = {
                attempts: currentAttempt
            };
            if (opts.exit(currentAttempt, err) == true) {
                throw err;
            }
            const exponentialTimeout = Math.pow(opts.factor, i) * 100;
            const waitTime = exponentialTimeout > opts.minTimeout ? exponentialTimeout : opts.minTimeout;
            await wait(waitTime);
            if (currentAttempt == opts.retries)
                throw err;
        }
    }
}

function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timeout)
    });
}

module.exports = exports = retry;