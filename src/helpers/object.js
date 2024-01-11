const mapKeys = require("lodash/mapKeys");


const removeSpacesFromKeys = (obj) =>
  mapKeys(obj, (value, key) => key.replace(/\s/g, ""));
const decodeKeys = (mappingObject, obj) =>
  mapKeys(obj, (value, key) => mappingObject[key] || key);

module.exports = {
    removeSpacesFromKeys,
    decodeKeys
}