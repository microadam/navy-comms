# navy-comms

A CLI used to issue orders to your fleet of [Captains](http://github.com/microadam/navy-captain) via the central [Admiral](http://github.com/microadam/navy-admiral).

## Installation

    npm install -g navy-comms

## Usage

    comms --help

## Quickstart Demo

Currently you can not create any applications or store any configuration data, however if you are using the example Order plugin (see [Captain](http://github.com/microadam/navy-captain)) then you can run the following to see navy in action:

    comms issue testApp test 1 2 3

'testApp' is an application identifier
'test' is the name of the order you wish to execute
'1 2 3' are example arguments that will be used when executing the order
