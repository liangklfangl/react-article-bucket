declare global {
    interface Window {
        safari: any;
    }
}
export declare type Predicate = () => boolean;
export declare const isFirefox: Predicate;
export declare const isSafari: Predicate;
