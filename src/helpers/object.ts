import mapKeys from "lodash/mapKeys";

const removeSpacesFromKeys = (obj: Record<string, any>): Record<string, any> => mapKeys(obj, (_value, key) => key.replace(/\s/g, ""));

const decodeKeys = (mappingObject: Record<string, string>, obj: Record<string, any>): Record<string, any> =>
  mapKeys(obj, (_value, key) => mappingObject[key] || key);

export { removeSpacesFromKeys, decodeKeys };
