import { Scope } from '@sentry/hub';
import { Client, Event, EventHint, Integration, IntegrationClass, Options, SdkInfo, Severity } from '@sentry/types';
import { SyncPromise } from '@sentry/utils';
import { Backend, BackendClass } from './basebackend';
import { Dsn } from './dsn';
import { IntegrationIndex } from './integration';
/**
 * Base implementation for all JavaScript SDK clients.
 *
 * Call the constructor with the corresponding backend constructor and options
 * specific to the client subclass. To access these options later, use
 * {@link Client.getOptions}. Also, the Backend instance is available via
 * {@link Client.getBackend}.
 *
 * If a Dsn is specified in the options, it will be parsed and stored. Use
 * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is
 * invalid, the constructor will throw a {@link SentryException}. Note that
 * without a valid Dsn, the SDK will not send any events to Sentry.
 *
 * Before sending an event via the backend, it is passed through
 * {@link BaseClient.prepareEvent} to add SDK information and scope data
 * (breadcrumbs and context). To add more custom information, override this
 * method and extend the resulting prepared event.
 *
 * To issue automatically created events (e.g. via instrumentation), use
 * {@link Client.captureEvent}. It will prepare the event and pass it through
 * the callback lifecycle. To issue auto-breadcrumbs, use
 * {@link Client.addBreadcrumb}.
 *
 * @example
 * class NodeClient extends BaseClient<NodeBackend, NodeOptions> {
 *   public constructor(options: NodeOptions) {
 *     super(NodeBackend, options);
 *   }
 *
 *   // ...
 * }
 */
export declare abstract class BaseClient<B extends Backend, O extends Options> implements Client<O> {
    /**
     * The backend used to physically interact in the enviornment. Usually, this
     * will correspond to the client. When composing SDKs, however, the Backend
     * from the root SDK will be used.
     */
    protected readonly _backend: B;
    /** Options passed to the SDK. */
    protected readonly _options: O;
    /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */
    protected readonly _dsn?: Dsn;
    /** Array of used integrations. */
    protected readonly _integrations: IntegrationIndex;
    /** Is the client still processing a call? */
    protected _processing: boolean;
    /**
     * Initializes this client instance.
     *
     * @param backendClass A constructor function to create the backend.
     * @param options Options for the client.
     */
    protected constructor(backendClass: BackendClass<B, O>, options: O);
    /**
     * @inheritDoc
     */
    captureException(exception: any, hint?: EventHint, scope?: Scope): string | undefined;
    /**
     * @inheritDoc
     */
    captureMessage(message: string, level?: Severity, hint?: EventHint, scope?: Scope): string | undefined;
    /**
     * @inheritDoc
     */
    captureEvent(event: Event, hint?: EventHint, scope?: Scope): string | undefined;
    /**
     * @inheritDoc
     */
    getDsn(): Dsn | undefined;
    /**
     * @inheritDoc
     */
    getOptions(): O;
    /**
     * @inheritDoc
     */
    flush(timeout?: number): Promise<boolean>;
    /**
     * @inheritDoc
     */
    close(timeout?: number): Promise<boolean>;
    /**
     * @inheritDoc
     */
    getIntegrations(): IntegrationIndex;
    /**
     * @inheritDoc
     */
    getIntegration<T extends Integration>(integration: IntegrationClass<T>): T | null;
    /** Waits for the client to be done with processing. */
    protected _isClientProcessing(timeout?: number): Promise<{
        ready: boolean;
        interval: number;
    }>;
    /** Returns the current backend. */
    protected _getBackend(): B;
    /** Determines whether this SDK is enabled and a valid Dsn is present. */
    protected _isEnabled(): boolean;
    /**
     * Adds common information to events.
     *
     * The information includes release and environment from `options`,
     * breadcrumbs and context (extra, tags and user) from the scope.
     *
     * Information that is already present in the event is never overwritten. For
     * nested objects, such as the context, keys are merged.
     *
     * @param event The original event.
     * @param hint May contain additional informartion about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A new event with more information.
     */
    protected _prepareEvent(event: Event, scope?: Scope, hint?: EventHint): SyncPromise<Event | null>;
    /**
     * This function adds all used integrations to the SDK info in the event.
     * @param sdkInfo The sdkInfo of the event that will be filled with all integrations.
     */
    protected _addIntegrations(sdkInfo?: SdkInfo): void;
    /**
     * Processes an event (either error or message) and sends it to Sentry.
     *
     * This also adds breadcrumbs and context information to the event. However,
     * platform specific meta data (such as the User's IP address) must be added
     * by the SDK implementor.
     *
     *
     * @param event The event to send to Sentry.
     * @param hint May contain additional informartion about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
     */
    protected _processEvent(event: Event, hint?: EventHint, scope?: Scope): SyncPromise<Event>;
    /**
     * Resolves before send Promise and calls resolve/reject on parent SyncPromise.
     */
    private _handleAsyncBeforeSend;
}
//# sourceMappingURL=baseclient.d.ts.map