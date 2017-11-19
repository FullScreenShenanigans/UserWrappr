import { observer } from "mobx-react";
import * as React from "react";

import { ISelectSchema } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

@observer
export class SelectOption extends React.Component<{ store: SaveableStore<ISelectSchema, string> }> {
    public render(): JSX.Element {
        return (
            <div className="option-saveable">
                <div className="option-left">
                    {this.props.store.schema.title}
                </div>
                <div className="option-right">
                    <select onChange={this.changeValue} value={this.props.store.value}>
                        {this.props.store.schema.options.map(this.renderOption)}
                    </select>
                </div>
            </div>
        );
    }

    private renderOption = (option: string): JSX.Element =>
        <option key={option} value={option} />

    private changeValue = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        this.props.store.setValue(event.target.value);
    }
}
