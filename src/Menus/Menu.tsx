import { observer } from "mobx-react";
import * as React from "react";

import { menuStyle, menuTitleStyle } from "../Bootstrapping/Styles";
import { MenuStore, VisualState } from "./MenuStore";

const isVisualStateOpen = (visualState: VisualState): boolean => {
    return visualState === VisualState.Open || visualState === VisualState.PinnedOpen;
};

export const Menu = observer(({ children, store }: { children?: React.ReactNode; store: MenuStore }) => {
    const isOpen = isVisualStateOpen(store.visualState);
    const className = [
        store.classNames.menu,
        " ",
        store.classNames.menu,
        "-",
        VisualState[store.visualState]
    ].join("");

    return (
        <div
            className={className}
            onMouseOver={store.open}
            style={menuStyle as React.CSSProperties}
        >
            {isOpen ? children : undefined}
            <h4
                className={store.classNames.menuTitle}
                style={menuTitleStyle as React.CSSProperties}
            >
                {store.title}
            </h4>
        </div>
    );
});
