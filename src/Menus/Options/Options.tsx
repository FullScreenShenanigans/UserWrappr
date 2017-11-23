import { observer } from "mobx-react";
import * as React from "react";

import { optionsStyle } from "../../Bootstrapping/Styles";
import { ActionOption } from "./ActionOption";
import { BooleanOption } from "./BooleanOption";
import { NumberOption } from "./NumberOption";
import { OptionType } from "./OptionSchemas";
import { OptionsStore } from "./OptionsStore";
import { OptionStore } from "./OptionStore";
import { SelectOption } from "./SelectOption";
import { StringOption } from "./StringOption";
import { UnknownOption } from "./UnknownOption";

type IOptionRenderer = (
    | React.ComponentClass
    | (({ store }: { store: OptionStore }) => JSX.Element)
);

const storeRenderers = new Map<OptionType, IOptionRenderer>([
    [OptionType.Action, ActionOption],
    [OptionType.Boolean, BooleanOption],
    [OptionType.Number, NumberOption],
    [OptionType.Select, SelectOption],
    [OptionType.String, StringOption],
]);

const renderOptionStore = (store: OptionStore) => {
    let Renderer = storeRenderers.get(store.schema.type);
    if (Renderer === undefined) {
        Renderer = UnknownOption;
    }

    return <Renderer store={store} key={store.schema.title} />;
};

export const Options = observer(({ store }: { store: OptionsStore }) => (
    <div
        className={store.classNames.options}
        style={optionsStyle as React.CSSProperties}
    >
        {store.children.map(renderOptionStore)}
    </div>
));
