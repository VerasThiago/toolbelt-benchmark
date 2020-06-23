/**
* splitJSON takes a JSON array and splits it into arrays with length count.
**/

function splitJSON(jsonArray,count) {
  var processed = [];
  var length = jsonArray.length;
  for(var i = 0 ; i < length ; i = i + count) {
    processed.push(jsonArray.slice(i , i + count));         
  }

  return processed;
}

module.exports = splitJSON;