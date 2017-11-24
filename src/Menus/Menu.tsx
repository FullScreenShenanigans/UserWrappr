import { observer } from "mobx-react";
import * as React from "react";

import { MenuStore, VisualState } from "./MenuStore";
import { MenuTitle } from "./MenuTitle";

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
            onClick={store.open}
            style={store.styles.menu as React.CSSProperties}
        >
            <div
                className={store.classNames.menuChildren}
                style={(isOpen ? store.styles.menuChildrenOpen : store.styles.menuChildrenClosed) as React.CSSProperties}
            >
                {isOpen ? children : undefined}
            </div>
            <MenuTitle store={store.titleStore} />
        </div>
    );
});
