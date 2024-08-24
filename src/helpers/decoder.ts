import * as objectUtils from './object'

/**
 * @title Decode table
 * @description decode and array of objects type based on translation object
 * @example
 *    - rawTable: [{'  MY - KEY 1': 'value', 'MY - KEY 2  ': 'value'}]
 *    - translation: {'MY-KEY1': 'myKey1', 'MY-KEY-2': 'myKey2'}
 *    - output: [{'myKey1': 'value', 'myKey2': 'value'}]
 */
export function decodeTable(rawTable: any[], translation: any): any[] {
  return rawTable
    .map((obj) => objectUtils.removeSpacesFromKeys(obj))
    .map((obj) => objectUtils.decodeKeys(translation, obj))
}
