import { Backend, DragDropManager } from 'dnd-core';
declare global {
    interface Window {
        __isReactDndBackendSetUp: boolean | undefined;
    }
}
export default class HTML5Backend implements Backend {
    private actions;
    private monitor;
    private registry;
    private context;
    private sourcePreviewNodes;
    private sourcePreviewNodeOptions;
    private sourceNodes;
    private sourceNodeOptions;
    private enterLeaveCounter;
    private dragStartSourceIds;
    private dropTargetIds;
    private dragEnterTargetIds;
    private currentNativeSource;
    private currentNativeHandle;
    private currentDragSourceNode;
    private currentDragSourceNodeOffset;
    private currentDragSourceNodeOffsetChanged;
    private altKeyPressed;
    private mouseMoveTimeoutTimer;
    private asyncEndDragFrameId;
    private dragOverTargetIds;
    constructor(manager: DragDropManager<any>);
    readonly window: Window | undefined;
    setup(): void;
    teardown(): void;
    connectDragPreview(sourceId: string, node: any, options: any): () => void;
    connectDragSource(sourceId: string, node: any, options: any): () => void;
    connectDropTarget(targetId: string, node: any): () => void;
    private addEventListeners;
    private removeEventListeners;
    private getCurrentSourceNodeOptions;
    private getCurrentDropEffect;
    private getCurrentSourcePreviewNodeOptions;
    private getSourceClientOffset;
    private isDraggingNativeItem;
    private beginDragNativeItem;
    private endDragNativeItem;
    private isNodeInDocument;
    private endDragIfSourceWasRemovedFromDOM;
    private setCurrentDragSourceNode;
    private clearCurrentDragSourceNode;
    private checkIfCurrentDragSourceRectChanged;
    private handleTopDragStartCapture;
    private handleDragStart;
    private handleTopDragStart;
    private handleTopDragEndCapture;
    private handleTopDragEnterCapture;
    private handleDragEnter;
    private handleTopDragEnter;
    private handleTopDragOverCapture;
    private handleDragOver;
    private handleTopDragOver;
    private handleTopDragLeaveCapture;
    private handleTopDropCapture;
    private handleDrop;
    private handleTopDrop;
    private handleSelectStart;
}
