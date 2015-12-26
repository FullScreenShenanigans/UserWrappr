module UserWrappr.UISchemas {
    "use strict";

    /**
     * A buttons generator for an options section that contains any number
     * of general buttons.
     */
    export class ButtonsGenerator extends OptionsGenerator implements IOptionsGenerator {
        generate(schema: IOptionsButtonsSchema): HTMLDivElement {
            var output: HTMLDivElement = document.createElement("div"),
                options: IOptionsButtonSchema[] = schema.options instanceof Function
                    ? (<IOptionSource>schema.options).call(self, this.GameStarter)
                    : schema.options,
                optionKeys: string[] = Object.keys(options),
                keyActive: string = schema.keyActive || "active",
                classNameStart: string = "select-option options-button-option",
                scope: ButtonsGenerator = this,
                option: IOptionsButtonSchema,
                element: HTMLDivElement,
                i: number;

            output.className = "select-options select-options-buttons";

            for (i = 0; i < optionKeys.length; i += 1) {
                option = options[optionKeys[i]];

                element = document.createElement("div");
                element.className = classNameStart;
                element.textContent = optionKeys[i];

                element.onclick = function (schema: IOptionsButtonSchema, element: HTMLDivElement): void {
                    if (scope.getParentControlDiv(element).getAttribute("active") !== "on") {
                        return;
                    }
                    schema.callback.call(scope, scope.GameStarter, schema, element);

                    if (element.getAttribute("option-enabled") === "true") {
                        element.setAttribute("option-enabled", "false");
                        element.className = classNameStart + " option-disabled";
                    } else {
                        element.setAttribute("option-enabled", "true");
                        element.className = classNameStart + " option-enabled";
                    }
                }.bind(this, schema, element);

                this.ensureLocalStorageButtonValue(element, option, schema);

                if (option[keyActive]) {
                    element.className += " option-enabled";
                    element.setAttribute("option-enabled", "true");
                } else if (schema.assumeInactive) {
                    element.className += " option-disabled";
                    element.setAttribute("option-enabled", "false");
                } else {
                    element.setAttribute("option-enabled", "true");
                }

                output.appendChild(element);
            }

            return output;
        }
    }
}
