import { ActionStore } from "./ActionStore";
import { SaveableStore } from "./SaveableStore";

export type IOptionStore = ActionStore | SaveableStore;

/**
 * Stores child options.
 */
export class OptionsStore {
    /**
     * Child options.
     */
    private readonly childStores: IOptionStore[];

    /**
     * Initializes a new instance of the OptionsStore class.
     *
     * @param childStores   Child options.
     */
    public constructor(childStores: IOptionStore[]) {
        this.childStores = childStores;
    }

    /**
     * Activates the option's action.
     */
    public get children(): IOptionStore[] {
        return this.childStores;
    }
}
