import { observer } from "mobx-react";
import * as React from "react";

import { ActionStore } from "./ActionStore";

export const ActionOption = observer(({ store }: { store: ActionStore }) => (
    <button name={store.schema.title} onClick={store.activate}>
        {store.schema.title}
    </button>
));
