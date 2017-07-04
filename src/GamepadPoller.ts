/**
 * Settings to initialize a new instance of the GamepadPoller class.
 */
export interface IGamepadPollerSettings {
    /**
     * @returns How many ticks are between game upkeeps.
     */
    getInterval: () => number;

    /**
     * @returns Whether the game is paused.
     */
    getPaused: () => boolean;

    /**
     * @returns How many real upkeeps happen on the game interval.
     */
    getSpeed: () => number;

    /**
     * How long to wait to poll while the game is paused.
     */
    pausedDevicePollTime: number;

    /**
     * Runs gamepad logic.
     */
    runGamepad: () => void;

    /**
     * Schedules an callback to be executed after a wait.
     *
     * @param callback   Callback to be executed.
     * @param wait   How long to wait.
     */
    setTimeout: (callback: () => void, wait: number) => void;
}

/**
 * Polls gamepad state for a GameStartr's DeviceLayr.
 */
export class GamepadPoller {
    /**
     * Settings be used for initialization.
     */
    private readonly settings: IGamepadPollerSettings;

    /**
     * Initializes a new instance of the GamepadPoller class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IGamepadPollerSettings) {
        this.settings = settings;
    }

    /**
     * Polls for gamepad activity.
     */
    public pollDevices = (): void => {
        this.settings.setTimeout(
            this.pollDevices,
            this.settings.getPaused()
                ? this.settings.pausedDevicePollTime
                : this.settings.getInterval() / this.settings.getSpeed());

        this.settings.runGamepad();
    }
}
