"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var reducers_1 = require("./reducers");
var dragDrop_1 = require("./actions/dragDrop");
var DragDropMonitorImpl_1 = require("./DragDropMonitorImpl");
var HandlerRegistryImpl_1 = require("./HandlerRegistryImpl");
var DragDropManagerImpl = /** @class */ (function () {
    function DragDropManagerImpl(createBackend, context) {
        if (context === void 0) { context = {}; }
        this.context = context;
        this.isSetUp = false;
        var store = redux_1.createStore(reducers_1.default);
        this.store = store;
        this.monitor = new DragDropMonitorImpl_1.default(store, new HandlerRegistryImpl_1.default(store));
        this.backend = createBackend(this);
        store.subscribe(this.handleRefCountChange.bind(this));
    }
    DragDropManagerImpl.prototype.getContext = function () {
        return this.context;
    };
    DragDropManagerImpl.prototype.getMonitor = function () {
        return this.monitor;
    };
    DragDropManagerImpl.prototype.getBackend = function () {
        return this.backend;
    };
    DragDropManagerImpl.prototype.getRegistry = function () {
        return this.monitor.registry;
    };
    DragDropManagerImpl.prototype.getActions = function () {
        var manager = this;
        var dispatch = this.store.dispatch;
        function bindActionCreator(actionCreator) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var action = actionCreator.apply(manager, args);
                if (typeof action !== 'undefined') {
                    dispatch(action);
                }
            };
        }
        var actions = dragDrop_1.default(this);
        return Object.keys(actions).reduce(function (boundActions, key) {
            var action = actions[key];
            boundActions[key] = bindActionCreator(action);
            return boundActions;
        }, {});
    };
    DragDropManagerImpl.prototype.dispatch = function (action) {
        this.store.dispatch(action);
    };
    DragDropManagerImpl.prototype.handleRefCountChange = function () {
        var shouldSetUp = this.store.getState().refCount > 0;
        if (shouldSetUp && !this.isSetUp) {
            this.backend.setup();
            this.isSetUp = true;
        }
        else if (!shouldSetUp && this.isSetUp) {
            this.backend.teardown();
            this.isSetUp = false;
        }
    };
    return DragDropManagerImpl;
}());
exports.default = DragDropManagerImpl;
