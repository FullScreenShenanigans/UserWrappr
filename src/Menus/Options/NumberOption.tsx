import { observer } from "mobx-react";
import * as React from "react";

import { INumberSchema } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

@observer
export class NumberOption extends React.Component<{ store: SaveableStore<INumberSchema, number> }> {
    public render() {
        return (
            <div className="option-saveable">
                <div className="option-left">
                    {this.props.store.schema.title}
                </div>
                <div className="option-right">
                    <input
                        max={this.props.store.schema.max}
                        min={this.props.store.schema.min}
                        onChange={this.changeValue}
                        type="number"
                    />
                </div>
            </div>
        );
    }

    private changeValue = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.store.setValue(event.target.valueAsNumber);
    }
}
