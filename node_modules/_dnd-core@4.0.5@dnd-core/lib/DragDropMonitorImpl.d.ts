import { Store } from 'redux';
import { State } from './reducers';
import { DragDropMonitor, Listener, Unsubscribe, XYCoord, HandlerRegistry } from './interfaces';
export default class DragDropMonitorImpl implements DragDropMonitor {
    private store;
    registry: HandlerRegistry;
    constructor(store: Store<State>, registry: HandlerRegistry);
    subscribeToStateChange(listener: Listener, options?: {
        handlerIds: string[] | undefined;
    }): Unsubscribe;
    subscribeToOffsetChange(listener: Listener): Unsubscribe;
    canDragSource(sourceId: string): boolean;
    canDropOnTarget(targetId: string): boolean;
    isDragging(): boolean;
    isDraggingSource(sourceId: string): boolean;
    isOverTarget(targetId: string, options?: {
        shallow: boolean;
    }): boolean;
    getItemType(): string | symbol;
    getItem(): any;
    getSourceId(): string | null;
    getTargetIds(): string[];
    getDropResult(): any;
    didDrop(): boolean;
    isSourcePublic(): boolean | null;
    getInitialClientOffset(): XYCoord | null;
    getInitialSourceClientOffset(): XYCoord | null;
    getClientOffset(): XYCoord | null;
    getSourceClientOffset(): XYCoord | null;
    getDifferenceFromInitialOffset(): XYCoord | null;
}
