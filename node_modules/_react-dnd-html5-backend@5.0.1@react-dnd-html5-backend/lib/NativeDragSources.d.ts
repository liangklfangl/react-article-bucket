import { DragDropMonitor } from 'dnd-core';
export declare function createNativeDragSource(type: any): {
    new (): {
        item: any;
        mutateItemByReadingDataTransfer(dataTransfer: any): void;
        canDrag(): boolean;
        beginDrag(): any;
        isDragging(monitor: DragDropMonitor, handle: string): boolean;
        endDrag(): void;
    };
};
export declare function matchNativeItemType(dataTransfer: any): string | null;
