var jsonSplit = require('./index.js');
var assert = require('assert');

var testData = [
  {
  "cause" : "Biometric data did not match" ,
  "msg" : "Please give your finger prints again."
  },
  {
  "cause" :   "OTP validation failed",
  "msg" :   "Please provide correct OTP value."
  },
  {
  "cause" :   "Invalid Aadhaar Status",
  "msg" :   "Your Aadhaar number status is not active. Kindly contact UIDAI Helpline."
  },
  {
  "cause" :   "Invalid Aadhaar Number",
  "msg" :   "Please enter a valid Aadhaar Number"
  },
  {
  "cause" : "OTP expired",
  "msg" : "Please send the request again to generate OTP again" 
  },
  {
  "cause" :   "Invalid Aadhaar Number",
  "msg" :   "Please enter a valid Aadhaar Number"
  }
];

assert.strictEqual(6,jsonSplit(testData,1).length);
assert.strictEqual(3,jsonSplit(testData,2).length);
assert.strictEqual(2,jsonSplit(testData,3).length);
assert.strictEqual(2,jsonSplit(testData,4).length);
assert.strictEqual(2,jsonSplit(testData,5).length);
assert.strictEqual(1,jsonSplit(testData,6).length);

assert.strictEqual(6,jsonSplit(testData,6)[0].length);
assert.strictEqual(2,jsonSplit(testData,2)[0].length);
assert.strictEqual(3,jsonSplit(testData,3)[0].length);
assert.strictEqual(4,jsonSplit(testData,4)[0].length);