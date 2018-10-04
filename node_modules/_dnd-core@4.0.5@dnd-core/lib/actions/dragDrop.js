"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var matchesType_1 = require("../utils/matchesType");
var invariant = require('invariant');
var isObject = require('lodash/isObject');
exports.BEGIN_DRAG = 'dnd-core/BEGIN_DRAG';
exports.PUBLISH_DRAG_SOURCE = 'dnd-core/PUBLISH_DRAG_SOURCE';
exports.HOVER = 'dnd-core/HOVER';
exports.DROP = 'dnd-core/DROP';
exports.END_DRAG = 'dnd-core/END_DRAG';
function createDragDropActions(manager) {
    return {
        beginDrag: function (sourceIds, _a) {
            if (sourceIds === void 0) { sourceIds = []; }
            var _b = _a === void 0 ? {
                publishSource: true,
            } : _a, publishSource = _b.publishSource, clientOffset = _b.clientOffset, getSourceClientOffset = _b.getSourceClientOffset;
            var monitor = manager.getMonitor();
            var registry = manager.getRegistry();
            invariant(!monitor.isDragging(), 'Cannot call beginDrag while dragging.');
            for (var _i = 0, sourceIds_1 = sourceIds; _i < sourceIds_1.length; _i++) {
                var s = sourceIds_1[_i];
                invariant(registry.getSource(s), 'Expected sourceIds to be registered.');
            }
            var sourceId = null;
            for (var i = sourceIds.length - 1; i >= 0; i--) {
                if (monitor.canDragSource(sourceIds[i])) {
                    sourceId = sourceIds[i];
                    break;
                }
            }
            if (sourceId === null) {
                return;
            }
            var sourceClientOffset = null;
            if (clientOffset) {
                invariant(typeof getSourceClientOffset === 'function', 'When clientOffset is provided, getSourceClientOffset must be a function.');
                sourceClientOffset = getSourceClientOffset(sourceId);
            }
            var source = registry.getSource(sourceId);
            var item = source.beginDrag(monitor, sourceId);
            invariant(isObject(item), 'Item must be an object.');
            registry.pinSource(sourceId);
            var itemType = registry.getSourceType(sourceId);
            return {
                type: exports.BEGIN_DRAG,
                payload: {
                    itemType: itemType,
                    item: item,
                    sourceId: sourceId,
                    clientOffset: clientOffset || null,
                    sourceClientOffset: sourceClientOffset || null,
                    isSourcePublic: !!publishSource,
                },
            };
        },
        publishDragSource: function () {
            var monitor = manager.getMonitor();
            if (!monitor.isDragging()) {
                return;
            }
            return { type: exports.PUBLISH_DRAG_SOURCE };
        },
        hover: function (targetIdsArg, _a) {
            var clientOffset = (_a === void 0 ? {} : _a).clientOffset;
            invariant(Array.isArray(targetIdsArg), 'Expected targetIds to be an array.');
            var targetIds = targetIdsArg.slice(0);
            var monitor = manager.getMonitor();
            var registry = manager.getRegistry();
            invariant(monitor.isDragging(), 'Cannot call hover while not dragging.');
            invariant(!monitor.didDrop(), 'Cannot call hover after drop.');
            // First check invariants.
            for (var i = 0; i < targetIds.length; i++) {
                var targetId = targetIds[i];
                invariant(targetIds.lastIndexOf(targetId) === i, 'Expected targetIds to be unique in the passed array.');
                var target = registry.getTarget(targetId);
                invariant(target, 'Expected targetIds to be registered.');
            }
            var draggedItemType = monitor.getItemType();
            // Remove those targetIds that don't match the targetType.  This
            // fixes shallow isOver which would only be non-shallow because of
            // non-matching targets.
            for (var i = targetIds.length - 1; i >= 0; i--) {
                var targetId = targetIds[i];
                var targetType = registry.getTargetType(targetId);
                if (!matchesType_1.default(targetType, draggedItemType)) {
                    targetIds.splice(i, 1);
                }
            }
            // Finally call hover on all matching targets.
            for (var _i = 0, targetIds_1 = targetIds; _i < targetIds_1.length; _i++) {
                var targetId = targetIds_1[_i];
                var target = registry.getTarget(targetId);
                target.hover(monitor, targetId);
            }
            return {
                type: exports.HOVER,
                payload: {
                    targetIds: targetIds,
                    clientOffset: clientOffset || null,
                },
            };
        },
        drop: function (options) {
            if (options === void 0) { options = {}; }
            var monitor = manager.getMonitor();
            var registry = manager.getRegistry();
            invariant(monitor.isDragging(), 'Cannot call drop while not dragging.');
            invariant(!monitor.didDrop(), 'Cannot call drop twice during one drag operation.');
            var targetIds = monitor
                .getTargetIds()
                .filter(monitor.canDropOnTarget, monitor);
            targetIds.reverse();
            // Multiple actions are dispatched here, which is why this doesn't return an action
            targetIds.forEach(function (targetId, index) {
                var target = registry.getTarget(targetId);
                var dropResult = target.drop(monitor, targetId);
                invariant(typeof dropResult === 'undefined' || isObject(dropResult), 'Drop result must either be an object or undefined.');
                if (typeof dropResult === 'undefined') {
                    dropResult = index === 0 ? {} : monitor.getDropResult();
                }
                var action = {
                    type: exports.DROP,
                    payload: {
                        dropResult: __assign({}, options, dropResult),
                    },
                };
                manager.dispatch(action);
            });
        },
        endDrag: function () {
            var monitor = manager.getMonitor();
            var registry = manager.getRegistry();
            invariant(monitor.isDragging(), 'Cannot call endDrag while not dragging.');
            var sourceId = monitor.getSourceId();
            var source = registry.getSource(sourceId, true);
            source.endDrag(monitor, sourceId);
            registry.unpinSource();
            return { type: exports.END_DRAG };
        },
    };
}
exports.default = createDragDropActions;
