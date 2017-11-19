/**
 * Individual option schema within a menu.
 */
// Todo: IScreenshotSchema, ISizeSchema
export type IOptionSchema = (
    | IActionSchema
    | IBooleanSchema
    | INumberSchema
    | ISelectSchema
    | IStringSchema
    | IUnknownSchema
);

/**
 * Type of an option schema.
 */
export const enum OptionType {
    /**
     * Simple triggerable action.
     */
    Action = "action",

    /**
     * Boolean toggle state.
     */
    Boolean = "boolean",

    /**
     * Numeric value within a range.
     */
    Number = "number",

    /**
     * One of given preset values.
     */
    Select = "select",

    /**
     * Any string value.
     */
    String = "string",

    /**
     * Unknown or unsupported value.
     */
    Unknown = "unknown"
}

/**
 * Basic details for option schemas.
 */
export interface IBasicSchema {
    /**
     * Displayed title of the option.
     */
    title: string;

    /**
     * Type of the option.
     */
    type: OptionType;
}

/**
 * Option that just calls an action.
 */
export interface IActionSchema extends IBasicSchema {
    /**
     * Action the option will call.
     */
    action: () => void;

    /**
     * Type of the action (action).
     */
    type: OptionType.Action;
}

/**
 * Schema for an option whose value is saved locally.
 *
 * @template TValue   Type of the value.
 */
export interface ISaveableSchema<TValue> extends IBasicSchema {
    /**
     * @returns An initial state for the value.
     */
    getInitialValue(): TValue;

    /**
     * Saves a new state value.
     *
     * @param state   New state value.
     */
    saveValue(state: TValue): void;
}

/**
 * Option that stores a boolean value.
 */
export interface IBooleanSchema extends ISaveableSchema<boolean> {
    /**
     * Type of the option (boolean).
     */
    type: OptionType.Boolean;
}

/**
 * Option that stores a numeric value.
 */
export interface INumberSchema extends ISaveableSchema<number> {
    /**
     * Maximum numeric value, if any.
     */
    max?: number;

    /**
     * Minimum numeric value, if any.
     */
    min?: number;

    /**
     * Type of the option (numeric).
     */
    type: OptionType.Number;
}

/**
 * Option that stores one of its given preset values.
 */
export interface ISelectSchema extends ISaveableSchema<string> {
    /**
     * Given preset values.
     */
    options: string[];
}

/**
 * Option that stores a string value.
 */
export interface IStringSchema extends ISaveableSchema<string> {
    /**
     * Any suggestions for the value.
     */
    suggestions?: string[];

    /**
     * Type of the option (string).
     */
    type: OptionType.String;
}

export interface IUnknownSchema extends IBasicSchema {
    /**
     * Type of the option (unknown).
     */
    type: OptionType.Unknown;
}
