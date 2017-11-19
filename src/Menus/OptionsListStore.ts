import { ActionStore } from "./Options/ActionStore";
import { IOptionSchema, OptionType } from "./Options/OptionSchemas";
import { OptionStore } from "./Options/OptionStore";
import { SaveableStore } from "./Options/SaveableStore";

/**
 * Dependencies to initialize a new OptionsListStore.
 */
export interface IOptionsListStoreDependencies {
    /**
     * Options within the menu.
     */
    options: IOptionSchema[];
}

/**
 * Option store classes, keyed by option type.
 */
interface IOptionStoreCreators {
    [i: string /* OptionType */]: IOptionStoreCreator<OptionStore>;
}

/**
 * Constructable option store class.
 *
 * @template TOptionStore   Type of the option store class.
 */
interface IOptionStoreCreator<TOptionStore extends OptionStore> {
    /**
     * Initializes a new instance of the OptionStore class.
     *
     * @param schema   Schema for the option.
     */
    new (schema: IOptionSchema): TOptionStore;
}

/**
 * Option store classes, keyed by option type.
 */
const optionStoreCreators: IOptionStoreCreators = {
    [OptionType.Action]: ActionStore as IOptionStoreCreator<ActionStore>,
    [OptionType.Boolean]: SaveableStore as IOptionStoreCreator<SaveableStore>,
    [OptionType.Number]: SaveableStore as IOptionStoreCreator<SaveableStore>,
    [OptionType.Select]: SaveableStore as IOptionStoreCreator<SaveableStore>,
    [OptionType.String]: SaveableStore as IOptionStoreCreator<SaveableStore>
};

/**
 * Creates an option store for its schema.
 *
 * @param schema   Individual option schema within a menu.
 * @returns Store for the option.
 */
const createOptionStore = (schema: IOptionSchema): OptionStore => {
    const creator: IOptionStoreCreator<OptionStore> | undefined = optionStoreCreators[schema.type];

    if (creator === undefined) {
        throw new Error(`Unknown option type: ${schema.type}`);
    }

    return new optionStoreCreators[schema.type](schema);
};

/**
 * Backing store for a list of options.
 */
export class OptionsListStore {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IOptionsListStoreDependencies;

    /**
     * Options in the list.
     */
    private readonly childStores: OptionStore[];

    /**
     * Initializes a new instance of the OptionsListStore class.
     *
     * @param dependencies   Dependencies used for initialization.
     */
    public constructor(dependencies: IOptionsListStoreDependencies) {
        this.dependencies = dependencies;
        this.childStores = this.dependencies.options
           .map(createOptionStore);
    }

    /**
     * Options in the list.
     */
    public get options(): OptionStore[] {
        return this.childStores;
    }
}
