# seneca-r-script

A seneca plugin to run R scripts as child processes.

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coveralls][BadgeCoveralls]][Coveralls]

The plugin is a simple wrapper of the [joshkatz/r-script](https://github.com/joshkatz/r-script) module.

Data passed from this plugin is converted into a list and sent to the R script throught the environment.
Then the R script is called as a child process.

This R script can be run either asynchronously, or synchronously.

There is a hidden, helper script in between the plugin and the called R script,
which reads the passed data in, and puts it into a variable named `input`, then `source` the R script.
This helper script also makes sure that the exit status of the R script as well as its output will go back to the caller plugin.

Conversion from R to JSON can be specified as options (see [toJSON.R](https://github.com/jeroenooms/jsonlite/blob/master/R/toJSON.R)).


## Installation

Run the install command:

    npm install

Run tests:

    npm test

To see the coverage, run:

    npm run coverage

## Usage

The plugin can be activated with the following arguments:

- `role`: Its value is always `seneca-r-script`.
- `cmd`: This tells whether the call should be asynchronous (`call`), or synchronous (`callSync`).
- `path`: This is the path of the R script to be called.
- `data`: an arbitrary object, to forward towards the R script as `input`. In case it is not defined, an empty object will be sent.
- `options`: an object, which tells the toJSON options for the R script, when it sends the results back.

For example this is an asynchronous call to an R script which echoes back the whole data sent to it:

    const dataToSend = { text: 'some text...', num: 12345, logic: true }
    const optionsToSend = { pretty: true }
    
    seneca.act('role: seneca-r-script, cmd: callSync, path: echo.spec.R', { data: dataToSend, options: optionsToSend }, function(err, data) {
        if (err === null) {
            expect(data[0]).to.eql(dataToSend) 
            done(err)
        }
    })
 
and this is an example for a synchronous call:

    const dataToSend = { text: 'some text...', num: 12345, logic: true }
    seneca.act('role: seneca-r-script, cmd: call, path: echo.spec.R', { data: dataToSend }, function(err, data) {
        if (err === null) {
            expect(data[0]).to.eql(dataToSend) 
            done(err)
        }
    })

And this is the echoing R script:

    # This script echoes back the whole data it got from the caller, because
    # the input parameters (whatever they are) arrive into the `input` variable through the environment as a list,
    # and the last statement will be sent back to the caller as a JSON object.
    input

The following code snippet sends a data object with a `pleaseFail: true` property, and expects a `false` response:

    const dataToFail = { text: 'some text...', num: 12345, pleaseFail: true }
    seneca.act(`role: ${pluginName}, cmd: call, path: ./lib/fail.spec.R`, { data: dataToFail }, function(err, data) {
        if (err === null) {
            expect(data[0]).to.equal(false) 
            done(err)
        }
    })

This R script will give an adequate response to the previous request:

    # This script gets an object, which has a `pleaseFail` boolean property.
    # If this value is `true`, then returns with a boolean `false` value, otherwise returns with `true`.
    result <- TRUE
    if (input[[1]]$pleaseFail) {
        result <- FALSE
    }

    list(result)

For further details, please study the [joshkatz/r-script](https://github.com/joshkatz/r-script) project.

## References
- [joshkatz/r-script - A simple little module for passing data from NodeJS to R (and back again).](https://github.com/joshkatz/r-script)
- [toJSON.R](https://github.com/jeroenooms/jsonlite/blob/master/R/toJSON.R)
- [Seneca.js](http://senecajs.org/)

---

This project was generated from the [seneca-plugin-archetype](https://github.com/tombenke/seneca-plugin-archetype)
by the [kickoff](https://github.com/tombenke/kickoff) utility.

[npm-badge]: https://badge.fury.io/js/seneca-r-script.svg
[npm-url]: https://badge.fury.io/js/seneca-r-script
[travis-badge]: https://api.travis-ci.org/tombenke/seneca-r-script.svg
[travis-url]: https://travis-ci.org/tombenke/seneca-r-script
[Coveralls]: https://coveralls.io/github/tombenke/seneca-r-script?branch=master
[BadgeCoveralls]: https://coveralls.io/repos/github/tombenke/seneca-r-script/badge.svg?branch=master
