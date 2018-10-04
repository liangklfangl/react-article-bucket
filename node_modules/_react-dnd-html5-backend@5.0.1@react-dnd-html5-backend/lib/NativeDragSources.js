"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var NativeTypes = require("./NativeTypes");
function getDataFromDataTransfer(dataTransfer, typesToTry, defaultValue) {
    var result = typesToTry.reduce(function (resultSoFar, typeToTry) { return resultSoFar || dataTransfer.getData(typeToTry); }, null);
    return result != null ? result : defaultValue;
}
var nativeTypesConfig = (_a = {},
    _a[NativeTypes.FILE] = {
        exposeProperty: 'files',
        matchesTypes: ['Files'],
        getData: function (dataTransfer) {
            return Array.prototype.slice.call(dataTransfer.files);
        },
    },
    _a[NativeTypes.URL] = {
        exposeProperty: 'urls',
        matchesTypes: ['Url', 'text/uri-list'],
        getData: function (dataTransfer, matchesTypes) {
            return getDataFromDataTransfer(dataTransfer, matchesTypes, '').split('\n');
        },
    },
    _a[NativeTypes.TEXT] = {
        exposeProperty: 'text',
        matchesTypes: ['Text', 'text/plain'],
        getData: function (dataTransfer, matchesTypes) {
            return getDataFromDataTransfer(dataTransfer, matchesTypes, '');
        },
    },
    _a);
function createNativeDragSource(type) {
    var _a = nativeTypesConfig[type], exposeProperty = _a.exposeProperty, matchesTypes = _a.matchesTypes, getData = _a.getData;
    return /** @class */ (function () {
        function NativeDragSource() {
            var _a;
            this.item = (_a = {},
                Object.defineProperty(_a, exposeProperty, {
                    get: function () {
                        // tslint:disable-next-line no-console
                        console.warn("Browser doesn't allow reading \"" + exposeProperty + "\" until the drop event.");
                        return null;
                    },
                    enumerable: true,
                    configurable: true
                }),
                _a);
        }
        NativeDragSource.prototype.mutateItemByReadingDataTransfer = function (dataTransfer) {
            delete this.item[exposeProperty];
            this.item[exposeProperty] = getData(dataTransfer, matchesTypes);
        };
        NativeDragSource.prototype.canDrag = function () {
            return true;
        };
        NativeDragSource.prototype.beginDrag = function () {
            return this.item;
        };
        NativeDragSource.prototype.isDragging = function (monitor, handle) {
            return handle === monitor.getSourceId();
        };
        NativeDragSource.prototype.endDrag = function () {
            // empty
        };
        return NativeDragSource;
    }());
}
exports.createNativeDragSource = createNativeDragSource;
function matchNativeItemType(dataTransfer) {
    var dataTransferTypes = Array.prototype.slice.call(dataTransfer.types || []);
    return (Object.keys(nativeTypesConfig).filter(function (nativeItemType) {
        var matchesTypes = nativeTypesConfig[nativeItemType].matchesTypes;
        return matchesTypes.some(function (t) { return dataTransferTypes.indexOf(t) > -1; });
    })[0] || null);
}
exports.matchNativeItemType = matchNativeItemType;
