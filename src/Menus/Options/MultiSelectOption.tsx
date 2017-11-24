import { observer } from "mobx-react";
import * as React from "react";

import { IMultiSelectSchema } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

@observer
export class MultiSelectOption extends React.Component<{ store: SaveableStore<IMultiSelectSchema, string[]> }> {
    public render(): JSX.Element {
        const { store } = this.props;

        return (
            <div className={store.classNames.option} style={store.styles.option as React.CSSProperties}>
                <div className={store.classNames.optionLeft} style={store.styles.optionLeft as React.CSSProperties}>
                    {store.schema.title}
                </div>
                <div className={store.classNames.optionRight} style={store.styles.optionRight as React.CSSProperties}>
                    {this.renderSelects()}
                </div>
            </div>
        );
    }

    private renderSelects(): JSX.Element[] {
        const selects = [];

        for (let i = 0; i < this.props.store.schema.selections; i += 1) {
            selects.push(this.renderSelect(i));
        }

        return selects;
    }

    private renderSelect = (key: number): JSX.Element => (
        <select
            key={key}
            onChange={(event) => this.changeValue(event, key)}
            style={this.props.store.styles.input as React.CSSProperties}
        >
            {this.props.store.schema.options.map(this.renderOption)}
        </select>
    )

    private renderOption = (option: string): JSX.Element => (
        <option key={option} value={option}>
            {option}
        </option>
    )

    private changeValue = (event: React.ChangeEvent<HTMLSelectElement>, key: number): void => {
        const values = this.props.store.value;
        values[key] = event.target.value;
        this.props.store.setValue(values);
    }
}