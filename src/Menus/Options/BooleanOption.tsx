import { observer } from "mobx-react";
import * as React from "react";

import { IBooleanSchema } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

@observer
export class BooleanOption extends React.Component<{ store: SaveableStore<IBooleanSchema> }> {
    public render() {
        return (
            <div className="option-saveable">
                <div className="option-left">
                    {this.props.store.schema.title}
                </div>
                <div className="option-right">
                    {this.renderButton()}
                </div>
            </div>
        );
    }

    private renderButton() {
        const descriptor = this.props.store.value
            ? "off"
            : "on";

        return (
            <button name={this.props.store.schema.title} onClick={this.toggleValue}>
                {descriptor}
            </button>
        );
    }

    private toggleValue = (): void => {
        this.props.store.setValue(!this.props.store.value);
    }
}
