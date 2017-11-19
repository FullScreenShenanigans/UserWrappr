import { observer } from "mobx-react";
import * as React from "react";

import { MenuStore, VisualState } from "./MenuStore";

// TODO: Instead of using class names, use inline styles and react-transition-group

export const Menu = observer(({ children, store }: { children?: React.ReactNode; store: MenuStore }) => (
    <div className={`menu menu-${VisualState[store.visualState]}`}>
        <div className="menu-child">
            {children}
        </div>
        <div className="menu-title">
            {store.title}
        </div>
    </div>
));
