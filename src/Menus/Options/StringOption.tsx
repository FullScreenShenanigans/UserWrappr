import { observer } from "mobx-react";
import * as React from "react";

import { IStringSchema } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

@observer
export class StringOption extends React.Component<{ store: SaveableStore<IStringSchema, string> }> {
    public render() {
        return (
            <div className="option-saveable">
                <div className="option-left">
                    {this.props.store.schema.title}
                </div>
                <div className="option-right">
                    <input onChange={this.changeValue} type="string" />
                </div>
            </div>
        );
    }

    private changeValue = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.store.setValue(event.target.value);
    }
}
