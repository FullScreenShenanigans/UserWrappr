import { observer } from "mobx-react";
import * as React from "react";

import { optionLeftStyle, optionRightStyle, optionStyle } from "../../Bootstrapping/Styles";
import { IBooleanSchema } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

@observer
export class BooleanOption extends React.Component<{ store: SaveableStore<IBooleanSchema> }> {
    public render() {
        const { store } = this.props;

        return (
            <div className={store.classNames.option} style={optionStyle as React.CSSProperties}>
                <div className={store.classNames.optionLeft} style={optionLeftStyle as React.CSSProperties}>
                    {store.schema.title}
                </div>
                <div className={store.classNames.optionRight} style={optionRightStyle as React.CSSProperties}>
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
