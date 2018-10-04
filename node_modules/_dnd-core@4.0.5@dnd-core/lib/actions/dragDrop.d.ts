import { Action, DragDropManager, BeginDragPayload, BeginDragOptions, SentinelAction, HoverPayload, HoverOptions } from '../interfaces';
export declare const BEGIN_DRAG = "dnd-core/BEGIN_DRAG";
export declare const PUBLISH_DRAG_SOURCE = "dnd-core/PUBLISH_DRAG_SOURCE";
export declare const HOVER = "dnd-core/HOVER";
export declare const DROP = "dnd-core/DROP";
export declare const END_DRAG = "dnd-core/END_DRAG";
export default function createDragDropActions<Context>(manager: DragDropManager<Context>): {
    beginDrag(sourceIds?: string[], { publishSource, clientOffset, getSourceClientOffset, }?: BeginDragOptions): Action<BeginDragPayload> | undefined;
    publishDragSource(): SentinelAction | undefined;
    hover(targetIdsArg: string[], { clientOffset }?: HoverOptions): Action<HoverPayload>;
    drop(options?: {}): void;
    endDrag(): SentinelAction;
};
