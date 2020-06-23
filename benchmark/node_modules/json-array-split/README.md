##About
It splits a json array into arrays with specified number of elements.

##Usage
 ````
var jsonSplit = require('json-array-split')

var splitArr = jsonSplit([{'john':'doe'},{'foo':'bar'},{'bruce':wayne},{'barry':'allen'}],2);
//[ [ { john: 'doe' }, { foo: 'bar' } ],[ { bruce: 'wayne' }, { barry: 'allen' } ] ]
 ````
##Requirements

1. nodejs > 0.10
2. npm 

##License
MIT License 