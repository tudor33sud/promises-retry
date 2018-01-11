const retry = require('../index');
const chai = require('chai');
const { expect } = chai;
function errorPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return reject(new Error('Dummy error'));
        }, 10);
    });
}

function successPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Success');
        }, 100);
    });
}

describe('Retry', function () {
    it('Should not retry a successful promise', async function () {
        const response = await retry(successPromise());
        expect(response).to.be.equal('Success');
    });

    it('Should retry according to custom options', async function () {
        this.timeout(1520);
        try {
            const response = await retry(errorPromise(), { retries: 3, minTimeout: 500 });
        } catch (err) {
            expect(err.retry.attempts).to.be.eql(3);
        }
    });
    it('Should exit on custom logic', async function () {
        try {
            const response = await retry(errorPromise(), {
                exit: (attempt, err) => {
                    //exit on second attempt
                    if (attempt == 2) {
                        return true;
                    }
                    return false;
                }
            });
        } catch (err) {
            expect(err.retry.attempts).to.be.eql(2);
        }
    });
    
    it('Should retry on error 5 times by default', async function () {
        this.timeout(11000);
        try {
            const response = await retry(errorPromise());
        } catch (err) {
            expect(err.retry.attempts).to.be.eql(5);
        }
    });
});
