import { observer } from "mobx-react";
import * as React from "react";

import { optionLeftStyle, optionRightStyle, optionStyle } from "../../Bootstrapping/Styles";
import { ISelectSchema } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

@observer
export class SelectOption extends React.Component<{ store: SaveableStore<ISelectSchema, string> }> {
    public render(): JSX.Element {
        const { store } = this.props;

        return (
            <div className={store.classNames.option} style={optionStyle as React.CSSProperties}>
                <div className={store.classNames.optionLeft} style={optionLeftStyle as React.CSSProperties}>
                    {store.schema.title}
                </div>
                <div className={store.classNames.optionRight} style={optionRightStyle as React.CSSProperties}>
                    <select onChange={this.changeValue} value={this.props.store.value}>
                        {this.props.store.schema.options.map(this.renderOption)}
                    </select>
                </div>
            </div>
        );
    }

    private renderOption = (option: string): JSX.Element => (
        <option key={option} value={option}>
            {option}
        </option>
    )

    private changeValue = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        this.props.store.setValue(event.target.value);
    }
}
