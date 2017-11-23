import { observer } from "mobx-react";
import * as React from "react";

import { optionLeftStyle, optionRightStyle, optionStyle } from "../../Bootstrapping/Styles";
import { INumberSchema } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

@observer
export class NumberOption extends React.Component<{ store: SaveableStore<INumberSchema, number> }> {
    public render() {
        const { store } = this.props;

        return (
            <div className={store.classNames.option} style={optionStyle as React.CSSProperties}>
                <div className={store.classNames.optionLeft} style={optionLeftStyle as React.CSSProperties}>
                    {store.schema.title}
                </div>
                <div className={store.classNames.optionRight} style={optionRightStyle as React.CSSProperties}>
                    <input
                        max={store.schema.max}
                        min={store.schema.min}
                        onChange={this.changeValue}
                        type="number"
                        value={store.value}
                    />
                </div>
            </div>
        );
    }

    private changeValue = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.store.setValue(event.target.valueAsNumber);
    }
}
