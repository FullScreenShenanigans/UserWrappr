import { IBasicSchema } from "./OptionSchemas";

/**
 * Store for an option schema.
 *
 * @template TSchema   Type of the schema.
 */
export abstract class OptionStore<TSchema extends IBasicSchema = IBasicSchema> {
    /**
     * Stored option schema.
     */
    public readonly schema: Readonly<TSchema>;

    /**
     * Initializes a new instance of the OptionStore class.
     *
     * @param schema   Schema for the saveable value.
     */
    public constructor(schema: TSchema) {
        this.schema = schema;
    }
}
