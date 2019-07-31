import { EventProcessor, Hub, Integration } from '@sentry/types';
/** JSDoc */
interface TracingOptions {
    tracingOrigins?: Array<string | RegExp>;
    traceFetch?: boolean;
    traceXHR?: boolean;
    autoStartOnDomReady?: boolean;
}
/**
 * Tracing Integration
 */
export declare class Tracing implements Integration {
    private readonly _options;
    /**
     * @inheritDoc
     */
    name: string;
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * If we have an xhr we need to store the url in the instance.
     *
     */
    private _xhrUrl?;
    /**
     * Constructor for Tracing
     *
     * @param _options TracingOptions
     */
    constructor(_options?: TracingOptions);
    /**
     * @inheritDoc
     */
    setupOnce(_: (callback: EventProcessor) => void, getCurrentHub: () => Hub): void;
    /**
     * Starts a new trace
     * @param hub The hub to start the trace on
     * @param transaction Optional transaction
     */
    static startTrace(hub: Hub, transaction?: string): void;
    /**
     * JSDoc
     */
    private _traceXHR;
    /**
     * JSDoc
     */
    private _traceFetch;
}
export {};
