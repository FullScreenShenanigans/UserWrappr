import { observer } from "mobx-react";
import * as React from "react";

import { optionLeftStyle, optionRightStyle, optionStyle } from "../../Bootstrapping/Styles";
import { IStringSchema } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

@observer
export class StringOption extends React.Component<{ store: SaveableStore<IStringSchema, string> }> {
    public render() {
        const { store } = this.props;
        return (
            <div className={store.classNames.option} style={optionStyle as React.CSSProperties}>
                <div className={store.classNames.optionLeft} style={optionLeftStyle as React.CSSProperties}>
                    {store.schema.title}
                </div>
                <div className={store.classNames.optionRight} style={optionRightStyle as React.CSSProperties}>
                    <input onChange={this.changeValue} type="string" />
                </div>
            </div>
        );
    }

    private changeValue = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.store.setValue(event.target.value);
    }
}
