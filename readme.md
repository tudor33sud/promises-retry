# Project Title

Retry promises with exponential back-off strategy. Exit on custom logic before the maximum number of retries.

### Installing

npm install promises-retry

## Usage

`const retry = require('promises-retry');`

Using default retry parameters:
```javascript
async function(){
    try{
        const result = retry(promise);
        //use the result
    } catch(err){
        //your promise failed to execute after the number of retries(by default 10)
    }
}
```

Using custom configuration:
```javascript
async function(){
    try{
        const result = retry(promise,{
        retries:3,
        minTimeout:500,
        exit:(attempt,err)=>{
            if(err.message='Your error message')
               return true;
            return false;
            }
        })
        //use the result
    } catch(err){
        //your promise failed to execute after the number of retries or using custom logic
    }
}
```
### Available parameters

* **retries** - the number of retries for a promise(defaults to **10**)
* **factor** - the exponential factor to use(defaults to **2**)
* **minTimeout** - the number of milliseconds before starting a retry(defaults to **1000**)
* **exit** - **function(attempt,err)** utility function for implementing custom logic to exit retrying if some condition is fulfilled. Useful for implementing fast exit for a promise, for example if a connection times out.

### Prerequisites

If you want to test the module, you need to have mocha installed on your machine.

## Running the tests

In order to test the package, run the following command
 
**npm run test**

## Authors

* **Tudor Suditu** - *Initial work* - (https://github.com/tudor33sud)


## License

This project is licensed under the MIT License 

