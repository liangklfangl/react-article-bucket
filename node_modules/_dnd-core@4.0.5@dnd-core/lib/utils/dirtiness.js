"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var intersection = require('lodash/intersection');
exports.NONE = [];
exports.ALL = [];
/**
 * Determines if the given handler IDs are dirty or not.
 *
 * @param dirtyIds The set of dirty handler ids
 * @param handlerIds The set of handler ids to check
 */
function areDirty(dirtyIds, handlerIds) {
    if (dirtyIds === exports.NONE) {
        return false;
    }
    if (dirtyIds === exports.ALL || typeof handlerIds === 'undefined') {
        return true;
    }
    return intersection(handlerIds, dirtyIds).length > 0;
}
exports.areDirty = areDirty;
