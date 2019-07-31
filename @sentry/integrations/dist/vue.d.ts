import { EventProcessor, Hub, Integration } from '@sentry/types';
/** JSDoc */
export declare class Vue implements Integration {
    /**
     * @inheritDoc
     */
    name: string;
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    private readonly _Vue;
    /**
     * When set to false, Sentry will suppress reporting all props data
     * from your Vue components for privacy concerns.
     */
    private readonly _attachProps;
    /**
     * @inheritDoc
     */
    constructor(options?: {
        Vue?: any;
        attachProps?: boolean;
    });
    /** JSDoc */
    private _formatComponentName;
    /**
     * @inheritDoc
     */
    setupOnce(_: (callback: EventProcessor) => void, getCurrentHub: () => Hub): void;
}
