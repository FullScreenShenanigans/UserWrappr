import { GameStartr } from "gamestartr/lib/GameStartr";

import { ISizeSummaries, ISizeSummary } from "../SizeChanger";
import { ISchema } from "../UISchemas";

/**
 * Options displayers, keyed by name.
 */
export interface IOptionsDisplayers {
    [i: string]: OptionsDisplayer;
}

/**
 * Settings to initialize a new instance of the OptionsGenerator class.
 */
export interface IOptionsDisplayerSettings {
    /**
     * Container GameStartr using this generator.
     */
    gameStarter: GameStartr;

    /**
     * @returns The current screen size.
     */
    getSize(): ISizeSummary;

    /**
     * @returns Allowed screen sizes.
     */
    getSizes(): ISizeSummaries;

    /**
     * Sets a new screen size.
     *
     * @param size   New screen size.
     */
    setSize(size: string | ISizeSummary): void;
}

/**
 * Displays a set of options.
 *
 * @type TSchema   Describes the options being displayed.
 */
export abstract class OptionsDisplayer<TSchema extends ISchema = ISchema> {
    /**
     * Keys that may be assigned input pipes.
     */
    public static allPossibleKeys: string[] = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
        "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "up", "right", "down", "left", "space", "shift", "ctrl", "enter",
        "escape", "backspace"
    ];

    /**
     * Settings used for initialization.
     */
    protected settings: IOptionsDisplayerSettings;

    /**
     * Initializes a new instance of the OptionsGenerator class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IOptionsDisplayerSettings) {
        this.settings = settings;
    }

    /**
     * Generates a control element based on the provided schema.
     *
     * @param schema   Describes the elements being displayed.
     * @returns An HTML element representing the schema.
     */
    public abstract generate(schema: TSchema): HTMLDivElement;

    /**
     * Recursively searches for an element with the "control" class
     * that's a parent of the given element.
     *
     * @param element   An element to start searching on.
     * @returns The closest node with className "control" to the given element
     *          in its ancestry tree.
     */
    protected getParentControlElement(element: HTMLElement): HTMLElement {
        if (element.className === "control" || !element.parentNode) {
            return element;
        }

        return this.getParentControlElement(element.parentElement!);
    }
}
