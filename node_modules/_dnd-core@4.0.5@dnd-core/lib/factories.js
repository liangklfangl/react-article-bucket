"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DragDropManagerImpl_1 = require("./DragDropManagerImpl");
function createDragDropManager(backend, context) {
    return new DragDropManagerImpl_1.default(backend, context);
}
exports.createDragDropManager = createDragDropManager;
