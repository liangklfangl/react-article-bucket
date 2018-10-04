"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var EnterLeaveCounter_1 = require("./EnterLeaveCounter");
var BrowserDetector_1 = require("./BrowserDetector");
var OffsetUtils_1 = require("./OffsetUtils");
var NativeDragSources_1 = require("./NativeDragSources");
var NativeTypes = require("./NativeTypes");
var autobind_decorator_1 = require("autobind-decorator");
var defaults = require('lodash/defaults');
var shallowEqual = require('shallowequal');
var HTML5Backend = /** @class */ (function () {
    function HTML5Backend(manager) {
        this.sourcePreviewNodes = new Map();
        this.sourcePreviewNodeOptions = new Map();
        this.sourceNodes = new Map();
        this.sourceNodeOptions = new Map();
        this.enterLeaveCounter = new EnterLeaveCounter_1.default();
        this.dragStartSourceIds = null;
        this.dropTargetIds = [];
        this.dragEnterTargetIds = [];
        this.currentNativeSource = null;
        this.currentNativeHandle = null;
        this.currentDragSourceNode = null;
        this.currentDragSourceNodeOffset = null;
        this.currentDragSourceNodeOffsetChanged = false;
        this.altKeyPressed = false;
        this.mouseMoveTimeoutTimer = null;
        this.asyncEndDragFrameId = null;
        this.dragOverTargetIds = null;
        this.actions = manager.getActions();
        this.monitor = manager.getMonitor();
        this.registry = manager.getRegistry();
        this.context = manager.getContext();
    }
    Object.defineProperty(HTML5Backend.prototype, "window", {
        // public for test
        get: function () {
            if (this.context && this.context.window) {
                return this.context.window;
            }
            else if (typeof window !== 'undefined') {
                return window;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    HTML5Backend.prototype.setup = function () {
        if (this.window === undefined) {
            return;
        }
        if (this.window.__isReactDndBackendSetUp) {
            throw new Error('Cannot have two HTML5 backends at the same time.');
        }
        this.window.__isReactDndBackendSetUp = true;
        this.addEventListeners(this.window);
    };
    HTML5Backend.prototype.teardown = function () {
        if (this.window === undefined) {
            return;
        }
        this.window.__isReactDndBackendSetUp = false;
        this.removeEventListeners(this.window);
        this.clearCurrentDragSourceNode();
        if (this.asyncEndDragFrameId) {
            this.window.cancelAnimationFrame(this.asyncEndDragFrameId);
        }
    };
    HTML5Backend.prototype.connectDragPreview = function (sourceId, node, options) {
        var _this = this;
        this.sourcePreviewNodeOptions.set(sourceId, options);
        this.sourcePreviewNodes.set(sourceId, node);
        return function () {
            _this.sourcePreviewNodes.delete(sourceId);
            _this.sourcePreviewNodeOptions.delete(sourceId);
        };
    };
    HTML5Backend.prototype.connectDragSource = function (sourceId, node, options) {
        var _this = this;
        this.sourceNodes.set(sourceId, node);
        this.sourceNodeOptions.set(sourceId, options);
        var handleDragStart = function (e) { return _this.handleDragStart(e, sourceId); };
        var handleSelectStart = function (e) { return _this.handleSelectStart(e); };
        node.setAttribute('draggable', true);
        node.addEventListener('dragstart', handleDragStart);
        node.addEventListener('selectstart', handleSelectStart);
        return function () {
            _this.sourceNodes.delete(sourceId);
            _this.sourceNodeOptions.delete(sourceId);
            node.removeEventListener('dragstart', handleDragStart);
            node.removeEventListener('selectstart', handleSelectStart);
            node.setAttribute('draggable', false);
        };
    };
    HTML5Backend.prototype.connectDropTarget = function (targetId, node) {
        var _this = this;
        var handleDragEnter = function (e) { return _this.handleDragEnter(e, targetId); };
        var handleDragOver = function (e) { return _this.handleDragOver(e, targetId); };
        var handleDrop = function (e) { return _this.handleDrop(e, targetId); };
        node.addEventListener('dragenter', handleDragEnter);
        node.addEventListener('dragover', handleDragOver);
        node.addEventListener('drop', handleDrop);
        return function () {
            node.removeEventListener('dragenter', handleDragEnter);
            node.removeEventListener('dragover', handleDragOver);
            node.removeEventListener('drop', handleDrop);
        };
    };
    HTML5Backend.prototype.addEventListeners = function (target) {
        // SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
        if (!target.addEventListener) {
            return;
        }
        target.addEventListener('dragstart', this.handleTopDragStart);
        target.addEventListener('dragstart', this.handleTopDragStartCapture, true);
        target.addEventListener('dragend', this.handleTopDragEndCapture, true);
        target.addEventListener('dragenter', this.handleTopDragEnter);
        target.addEventListener('dragenter', this.handleTopDragEnterCapture, true);
        target.addEventListener('dragleave', this.handleTopDragLeaveCapture, true);
        target.addEventListener('dragover', this.handleTopDragOver);
        target.addEventListener('dragover', this.handleTopDragOverCapture, true);
        target.addEventListener('drop', this.handleTopDrop);
        target.addEventListener('drop', this.handleTopDropCapture, true);
    };
    HTML5Backend.prototype.removeEventListeners = function (target) {
        // SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
        if (!target.removeEventListener) {
            return;
        }
        target.removeEventListener('dragstart', this.handleTopDragStart);
        target.removeEventListener('dragstart', this.handleTopDragStartCapture, true);
        target.removeEventListener('dragend', this.handleTopDragEndCapture, true);
        target.removeEventListener('dragenter', this.handleTopDragEnter);
        target.removeEventListener('dragenter', this.handleTopDragEnterCapture, true);
        target.removeEventListener('dragleave', this.handleTopDragLeaveCapture, true);
        target.removeEventListener('dragover', this.handleTopDragOver);
        target.removeEventListener('dragover', this.handleTopDragOverCapture, true);
        target.removeEventListener('drop', this.handleTopDrop);
        target.removeEventListener('drop', this.handleTopDropCapture, true);
    };
    HTML5Backend.prototype.getCurrentSourceNodeOptions = function () {
        var sourceId = this.monitor.getSourceId();
        var sourceNodeOptions = this.sourceNodeOptions.get(sourceId);
        return defaults(sourceNodeOptions || {}, {
            dropEffect: this.altKeyPressed ? 'copy' : 'move',
        });
    };
    HTML5Backend.prototype.getCurrentDropEffect = function () {
        if (this.isDraggingNativeItem()) {
            // It makes more sense to default to 'copy' for native resources
            return 'copy';
        }
        return this.getCurrentSourceNodeOptions().dropEffect;
    };
    HTML5Backend.prototype.getCurrentSourcePreviewNodeOptions = function () {
        var sourceId = this.monitor.getSourceId();
        var sourcePreviewNodeOptions = this.sourcePreviewNodeOptions.get(sourceId);
        return defaults(sourcePreviewNodeOptions || {}, {
            anchorX: 0.5,
            anchorY: 0.5,
            captureDraggingState: false,
        });
    };
    HTML5Backend.prototype.getSourceClientOffset = function (sourceId) {
        return OffsetUtils_1.getNodeClientOffset(this.sourceNodes.get(sourceId));
    };
    HTML5Backend.prototype.isDraggingNativeItem = function () {
        var itemType = this.monitor.getItemType();
        return Object.keys(NativeTypes).some(function (key) { return NativeTypes[key] === itemType; });
    };
    HTML5Backend.prototype.beginDragNativeItem = function (type) {
        this.clearCurrentDragSourceNode();
        var SourceType = NativeDragSources_1.createNativeDragSource(type);
        this.currentNativeSource = new SourceType();
        this.currentNativeHandle = this.registry.addSource(type, this.currentNativeSource);
        this.actions.beginDrag([this.currentNativeHandle]);
    };
    HTML5Backend.prototype.endDragNativeItem = function () {
        if (!this.isDraggingNativeItem()) {
            return;
        }
        this.actions.endDrag();
        this.registry.removeSource(this.currentNativeHandle);
        this.currentNativeHandle = null;
        this.currentNativeSource = null;
    };
    HTML5Backend.prototype.isNodeInDocument = function (node) {
        // Check the node either in the main document or in the current context
        return ((!!document && document.body.contains(node)) ||
            (!!this.window && this.window.document.body.contains(node)));
    };
    HTML5Backend.prototype.endDragIfSourceWasRemovedFromDOM = function () {
        var node = this.currentDragSourceNode;
        if (this.isNodeInDocument(node)) {
            return;
        }
        if (this.clearCurrentDragSourceNode()) {
            this.actions.endDrag();
        }
    };
    HTML5Backend.prototype.setCurrentDragSourceNode = function (node) {
        var _this = this;
        this.clearCurrentDragSourceNode();
        this.currentDragSourceNode = node;
        this.currentDragSourceNodeOffset = OffsetUtils_1.getNodeClientOffset(node);
        this.currentDragSourceNodeOffsetChanged = false;
        // A timeout of > 0 is necessary to resolve Firefox issue referenced
        // See:
        //   * https://github.com/react-dnd/react-dnd/pull/928
        //   * https://github.com/react-dnd/react-dnd/issues/869
        var MOUSE_MOVE_TIMEOUT = 1000;
        // Receiving a mouse event in the middle of a dragging operation
        // means it has ended and the drag source node disappeared from DOM,
        // so the browser didn't dispatch the dragend event.
        //
        // We need to wait before we start listening for mousemove events.
        // This is needed because the drag preview needs to be drawn or else it fires an 'mousemove' event
        // immediately in some browsers.
        //
        // See:
        //   * https://github.com/react-dnd/react-dnd/pull/928
        //   * https://github.com/react-dnd/react-dnd/issues/869
        //
        this.mouseMoveTimeoutTimer = setTimeout(function () {
            return (_this.window &&
                _this.window.addEventListener('mousemove', _this.endDragIfSourceWasRemovedFromDOM, true));
        }, MOUSE_MOVE_TIMEOUT);
    };
    HTML5Backend.prototype.clearCurrentDragSourceNode = function () {
        if (this.currentDragSourceNode) {
            this.currentDragSourceNode = null;
            this.currentDragSourceNodeOffset = null;
            this.currentDragSourceNodeOffsetChanged = false;
            if (this.window) {
                this.window.clearTimeout(this.mouseMoveTimeoutTimer);
                this.window.removeEventListener('mousemove', this.endDragIfSourceWasRemovedFromDOM, true);
            }
            this.mouseMoveTimeoutTimer = null;
            return true;
        }
        return false;
    };
    HTML5Backend.prototype.checkIfCurrentDragSourceRectChanged = function () {
        var node = this.currentDragSourceNode;
        if (!node) {
            return false;
        }
        if (this.currentDragSourceNodeOffsetChanged) {
            return true;
        }
        this.currentDragSourceNodeOffsetChanged = !shallowEqual(OffsetUtils_1.getNodeClientOffset(node), this.currentDragSourceNodeOffset);
        return this.currentDragSourceNodeOffsetChanged;
    };
    HTML5Backend.prototype.handleTopDragStartCapture = function () {
        this.clearCurrentDragSourceNode();
        this.dragStartSourceIds = [];
    };
    HTML5Backend.prototype.handleDragStart = function (e, sourceId) {
        if (!this.dragStartSourceIds) {
            this.dragStartSourceIds = [];
        }
        this.dragStartSourceIds.unshift(sourceId);
    };
    HTML5Backend.prototype.handleTopDragStart = function (e) {
        var _this = this;
        var dragStartSourceIds = this.dragStartSourceIds;
        this.dragStartSourceIds = null;
        var clientOffset = OffsetUtils_1.getEventClientOffset(e);
        // Avoid crashing if we missed a drop event or our previous drag died
        if (this.monitor.isDragging()) {
            this.actions.endDrag();
        }
        // Don't publish the source just yet (see why below)
        this.actions.beginDrag(dragStartSourceIds || [], {
            publishSource: false,
            getSourceClientOffset: this.getSourceClientOffset,
            clientOffset: clientOffset,
        });
        var dataTransfer = e.dataTransfer;
        var nativeType = NativeDragSources_1.matchNativeItemType(dataTransfer);
        if (this.monitor.isDragging()) {
            if (typeof dataTransfer.setDragImage === 'function') {
                // Use custom drag image if user specifies it.
                // If child drag source refuses drag but parent agrees,
                // use parent's node as drag image. Neither works in IE though.
                var sourceId = this.monitor.getSourceId();
                var sourceNode = this.sourceNodes.get(sourceId);
                var dragPreview = this.sourcePreviewNodes.get(sourceId) || sourceNode;
                var _a = this.getCurrentSourcePreviewNodeOptions(), anchorX = _a.anchorX, anchorY = _a.anchorY, offsetX = _a.offsetX, offsetY = _a.offsetY;
                var anchorPoint = { anchorX: anchorX, anchorY: anchorY };
                var offsetPoint = { offsetX: offsetX, offsetY: offsetY };
                var dragPreviewOffset = OffsetUtils_1.getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint);
                dataTransfer.setDragImage(dragPreview, dragPreviewOffset.x, dragPreviewOffset.y);
            }
            try {
                // Firefox won't drag without setting data
                dataTransfer.setData('application/json', {});
            }
            catch (err) {
                // IE doesn't support MIME types in setData
            }
            // Store drag source node so we can check whether
            // it is removed from DOM and trigger endDrag manually.
            this.setCurrentDragSourceNode(e.target);
            // Now we are ready to publish the drag source.. or are we not?
            var captureDraggingState = this.getCurrentSourcePreviewNodeOptions().captureDraggingState;
            if (!captureDraggingState) {
                // Usually we want to publish it in the next tick so that browser
                // is able to screenshot the current (not yet dragging) state.
                //
                // It also neatly avoids a situation where render() returns null
                // in the same tick for the source element, and browser freaks out.
                setTimeout(function () { return _this.actions.publishDragSource(); }, 0);
            }
            else {
                // In some cases the user may want to override this behavior, e.g.
                // to work around IE not supporting custom drag previews.
                //
                // When using a custom drag layer, the only way to prevent
                // the default drag preview from drawing in IE is to screenshot
                // the dragging state in which the node itself has zero opacity
                // and height. In this case, though, returning null from render()
                // will abruptly end the dragging, which is not obvious.
                //
                // This is the reason such behavior is strictly opt-in.
                this.actions.publishDragSource();
            }
        }
        else if (nativeType) {
            // A native item (such as URL) dragged from inside the document
            this.beginDragNativeItem(nativeType);
        }
        else if (!dataTransfer.types &&
            (!e.target.hasAttribute || !e.target.hasAttribute('draggable'))) {
            // Looks like a Safari bug: dataTransfer.types is null, but there was no draggable.
            // Just let it drag. It's a native type (URL or text) and will be picked up in
            // dragenter handler.
            return;
        }
        else {
            // If by this time no drag source reacted, tell browser not to drag.
            e.preventDefault();
        }
    };
    HTML5Backend.prototype.handleTopDragEndCapture = function () {
        if (this.clearCurrentDragSourceNode()) {
            // Firefox can dispatch this event in an infinite loop
            // if dragend handler does something like showing an alert.
            // Only proceed if we have not handled it already.
            this.actions.endDrag();
        }
    };
    HTML5Backend.prototype.handleTopDragEnterCapture = function (e) {
        this.dragEnterTargetIds = [];
        var isFirstEnter = this.enterLeaveCounter.enter(e.target);
        if (!isFirstEnter || this.monitor.isDragging()) {
            return;
        }
        var dataTransfer = e.dataTransfer;
        var nativeType = NativeDragSources_1.matchNativeItemType(dataTransfer);
        if (nativeType) {
            // A native item (such as file or URL) dragged from outside the document
            this.beginDragNativeItem(nativeType);
        }
    };
    HTML5Backend.prototype.handleDragEnter = function (e, targetId) {
        this.dragEnterTargetIds.unshift(targetId);
    };
    HTML5Backend.prototype.handleTopDragEnter = function (e) {
        var _this = this;
        var dragEnterTargetIds = this.dragEnterTargetIds;
        this.dragEnterTargetIds = [];
        if (!this.monitor.isDragging()) {
            // This is probably a native item type we don't understand.
            return;
        }
        this.altKeyPressed = e.altKey;
        if (!BrowserDetector_1.isFirefox()) {
            // Don't emit hover in `dragenter` on Firefox due to an edge case.
            // If the target changes position as the result of `dragenter`, Firefox
            // will still happily dispatch `dragover` despite target being no longer
            // there. The easy solution is to only fire `hover` in `dragover` on FF.
            this.actions.hover(dragEnterTargetIds, {
                clientOffset: OffsetUtils_1.getEventClientOffset(e),
            });
        }
        var canDrop = dragEnterTargetIds.some(function (targetId) {
            return _this.monitor.canDropOnTarget(targetId);
        });
        if (canDrop) {
            // IE requires this to fire dragover events
            e.preventDefault();
            e.dataTransfer.dropEffect = this.getCurrentDropEffect();
        }
    };
    HTML5Backend.prototype.handleTopDragOverCapture = function () {
        this.dragOverTargetIds = [];
    };
    HTML5Backend.prototype.handleDragOver = function (e, targetId) {
        if (this.dragOverTargetIds === null) {
            this.dragOverTargetIds = [];
        }
        this.dragOverTargetIds.unshift(targetId);
    };
    HTML5Backend.prototype.handleTopDragOver = function (e) {
        var _this = this;
        var dragOverTargetIds = this.dragOverTargetIds;
        this.dragOverTargetIds = [];
        if (!this.monitor.isDragging()) {
            // This is probably a native item type we don't understand.
            // Prevent default "drop and blow away the whole document" action.
            e.preventDefault();
            e.dataTransfer.dropEffect = 'none';
            return;
        }
        this.altKeyPressed = e.altKey;
        this.actions.hover(dragOverTargetIds || [], {
            clientOffset: OffsetUtils_1.getEventClientOffset(e),
        });
        var canDrop = (dragOverTargetIds || []).some(function (targetId) {
            return _this.monitor.canDropOnTarget(targetId);
        });
        if (canDrop) {
            // Show user-specified drop effect.
            e.preventDefault();
            e.dataTransfer.dropEffect = this.getCurrentDropEffect();
        }
        else if (this.isDraggingNativeItem()) {
            // Don't show a nice cursor but still prevent default
            // "drop and blow away the whole document" action.
            e.preventDefault();
            e.dataTransfer.dropEffect = 'none';
        }
        else if (this.checkIfCurrentDragSourceRectChanged()) {
            // Prevent animating to incorrect position.
            // Drop effect must be other than 'none' to prevent animation.
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }
    };
    HTML5Backend.prototype.handleTopDragLeaveCapture = function (e) {
        if (this.isDraggingNativeItem()) {
            e.preventDefault();
        }
        var isLastLeave = this.enterLeaveCounter.leave(e.target);
        if (!isLastLeave) {
            return;
        }
        if (this.isDraggingNativeItem()) {
            this.endDragNativeItem();
        }
    };
    HTML5Backend.prototype.handleTopDropCapture = function (e) {
        this.dropTargetIds = [];
        e.preventDefault();
        if (this.isDraggingNativeItem()) {
            this.currentNativeSource.mutateItemByReadingDataTransfer(e.dataTransfer);
        }
        this.enterLeaveCounter.reset();
    };
    HTML5Backend.prototype.handleDrop = function (e, targetId) {
        this.dropTargetIds.unshift(targetId);
    };
    HTML5Backend.prototype.handleTopDrop = function (e) {
        var dropTargetIds = this.dropTargetIds;
        this.dropTargetIds = [];
        this.actions.hover(dropTargetIds, {
            clientOffset: OffsetUtils_1.getEventClientOffset(e),
        });
        this.actions.drop({ dropEffect: this.getCurrentDropEffect() });
        if (this.isDraggingNativeItem()) {
            this.endDragNativeItem();
        }
        else {
            this.endDragIfSourceWasRemovedFromDOM();
        }
    };
    HTML5Backend.prototype.handleSelectStart = function (e) {
        var target = e.target;
        // Only IE requires us to explicitly say
        // we want drag drop operation to start
        if (typeof target.dragDrop !== 'function') {
            return;
        }
        // Inputs and textareas should be selectable
        if (target.tagName === 'INPUT' ||
            target.tagName === 'SELECT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable) {
            return;
        }
        // For other targets, ask IE
        // to enable drag and drop
        e.preventDefault();
        target.dragDrop();
    };
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "getSourceClientOffset", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "endDragNativeItem", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "isNodeInDocument", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "endDragIfSourceWasRemovedFromDOM", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragStartCapture", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragStart", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragEndCapture", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragEnterCapture", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragEnter", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragOverCapture", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragOver", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragLeaveCapture", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDropCapture", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDrop", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleSelectStart", null);
    return HTML5Backend;
}());
exports.default = HTML5Backend;
