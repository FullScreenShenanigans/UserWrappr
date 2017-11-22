import { action } from "mobx";
import { IClassNames } from "../Display";

/**
 * How a menu should visually behave.
 */
export enum VisualState {
    /**
     * The menu isn't opened yet.
     */
    Closed,

    /**
     * The menu is closing.
     */
    Closing,

    /**
     * The menu is opening.
     */
    Open,

    /**
     * The menu is fully open.
     */
    Opening,

    /**
     * The menu is locked into being fully open.
     */
    PinnedOpen
}

/**
 * Waits before calling an action.
 *
 * @param action   Action to call after a delay.
 * @param delay   How long to wait before calling the action.
 * @returns Identifier for the waited action.
 */
export type ISetTimeout = (action: () => void, delay: number) => number;

/**
 * Dependencies to initialize a new MenuStore.
 */
export interface IMenuStoreDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: IClassNames;

    /**
     * Waits before calling an action.
     */
    setTimeout: ISetTimeout;

    /**
     * Section title of the menu.
     */
    title: string;

    /**
     * How long to transition between visual states.
     */
    transitionTime: number;
}

/**
 * Backing store for a menu.
 */
export class MenuStore {
    /**
     * How the menu should visually behave.
     */
    private state: VisualState = VisualState.Closed;

    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IMenuStoreDependencies;

    /**
     * Initializes a new instance of the MenuStore class.
     *
     * @param dependencies   Dependencies used for initialization.
     */
    public constructor(dependencies: IMenuStoreDependencies) {
        this.dependencies = dependencies;
    }

    /**
     * Class names to use for display elements.
     */
    public get classNames(): IClassNames {
        return this.dependencies.classNames;
    }

    /**
     * Section title of the menu.
     */
    public get title(): string {
        return this.dependencies.title;
    }

    /**
     * How the menu should visually behave.
     */
    public get visualState(): VisualState {
        return this.state;
    }

    /**
     * Toggles whether the menu was opened.
     *
     * @returns Whether any state change was made.
     */
    @action
    public toggleOpen = (): boolean => {
        if (this.isTransitioning()) {
            return false;
        }

        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }

        return true;
    }

    /**
     * Toggles whether the menu is pinned.
     *
     * @returns Whether any state change was made.
     */
    @action
    public togglePinned = (): boolean => {
        if (this.isClosed() || this.isTransitioning()) {
            return false;
        }

        this.state = this.state === VisualState.Open
            ? VisualState.PinnedOpen
            : VisualState.Open;

        return true;
    }

    /**
     * Closes the menu.
     */
    private close() {
        this.state = VisualState.Closing;
        this.dependencies.setTimeout(
            (): void => {
                this.state = VisualState.Closed;
            },
            this.dependencies.transitionTime);
    }

    /**
     * Opens the menu.
     */
    private open() {
        this.state = VisualState.Opening;
        this.dependencies.setTimeout(
            (): void => {
                this.state = VisualState.Open;
            },
            this.dependencies.transitionTime);
    }

    /**
     * @returns Whether the menu is open.
     */
    private isOpen() {
        return this.state === VisualState.Open
            || this.state === VisualState.PinnedOpen;
    }

    /**
     * @returns Whether the menu is closed.
     */
    private isClosed() {
        return this.state === VisualState.Closed;
    }

    /**
     * @returns Whether the menu is transitioning.
     */
    private isTransitioning() {
        return this.state === VisualState.Closing
            || this.state === VisualState.Opening;
    }
}