import { IClassNames } from "../../Display";
import { ActionStore } from "./ActionStore";
import { IOptionSchema, OptionType } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

/**
 * Known option store types.
 */
export type IOptionStore = ActionStore | SaveableStore;

/**
 * Option store classes, keyed by option type.
 */
interface IOptionStoreCreators {
    [i: string /* OptionType */]: IOptionStoreCreator<IOptionStore>;
}

/**
 * Constructable option store class.
 *
 * @template TOptionStore   Type of the option store class.
 */
interface IOptionStoreCreator<TOptionStore extends IOptionStore> {
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
const createOptionStore = (schema: IOptionSchema): IOptionStore => {
    const creator: IOptionStoreCreator<IOptionStore> | undefined = optionStoreCreators[schema.type];

    if (creator === undefined) {
        throw new Error(`Unknown option type: ${schema.type}`);
    }

    return new optionStoreCreators[schema.type](schema);
};

/**
 * Dependencies to initialize a new OptionsStore.
 */
export interface IOptionsStoreDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: IClassNames;

    /**
     * Schemas for each option.
     */
    options: IOptionSchema[];
}

/**
 * Stores child options.
 */
export class OptionsStore {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IOptionsStoreDependencies;

    /**
     * Child options.
     */
    private readonly childStores: IOptionStore[];

    /**
     * Initializes a new instance of the OptionsStore class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IOptionsStoreDependencies) {
        this.dependencies = dependencies;
        this.childStores = dependencies.options.map(createOptionStore);
    }

    /**
     * Child options.
     */
    public get children(): IOptionStore[] {
        return this.childStores;
    }

    /**
     * Class names to use for display elements.
     */
    public get classNames(): IClassNames {
        return this.dependencies.classNames;
    }
}
