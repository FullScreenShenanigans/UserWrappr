module UserWrappr.UISchemas {
    "use strict";

    /**
     * Options generator for a grid of maps, along with other options.
     */
    export class MapsGridGenerator extends OptionsGenerator implements IOptionsGenerator {
        generate(schema: IOptionsMapGridSchema): HTMLDivElement {
            var output: HTMLDivElement = document.createElement("div");

            output.className = "select-options select-options-maps-grid";

            if (schema.rangeX && schema.rangeY) {
                output.appendChild(this.generateRangedTable(schema));
            }

            if (schema.extras) {
                this.appendExtras(output, schema);
            }

            return output;
        }

        generateRangedTable(schema: IOptionsMapGridSchema): HTMLTableElement {
            var scope: MapsGridGenerator = this,
                table: HTMLTableElement = document.createElement("table"),
                rangeX: number[] = schema.rangeX,
                rangeY: number[] = schema.rangeY,
                row: HTMLTableRowElement,
                cell: HTMLTableCellElement,
                i: number,
                j: number;

            for (i = rangeY[0]; i <= rangeY[1]; i += 1) {
                row = document.createElement("tr");
                row.className = "maps-grid-row";

                for (j = rangeX[0]; j <= rangeX[1]; j += 1) {
                    cell = document.createElement("td");
                    cell.className = "select-option maps-grid-option maps-grid-option-range";
                    cell.textContent = i + "-" + j;
                    cell.onclick = (function (callback: () => any): void {
                        if (scope.getParentControlDiv(cell).getAttribute("active") === "on") {
                            callback();
                        }
                    }).bind(scope, schema.callback.bind(scope, scope.GameStarter, schema, cell));
                    row.appendChild(cell);
                }

                table.appendChild(row);
            }

            return table;
        }

        appendExtras(output: HTMLDivElement, schema: IOptionsMapGridSchema): void {
            var element: HTMLDivElement,
                extra: IOptionsMapGridExtra,
                i: string,
                j: number;

            for (i in schema.extras) {
                if (!schema.extras.hasOwnProperty(i)) {
                    continue;
                }

                extra = schema.extras[i];
                element = document.createElement("div");

                element.className = "select-option maps-grid-option maps-grid-option-extra";
                element.textContent = extra.title;
                element.setAttribute("value", extra.title);
                element.onclick = extra.callback.bind(this, this.GameStarter, schema, element);
                output.appendChild(element);

                if (extra.extraElements) {
                    for (j = 0; j < extra.extraElements.length; j += 1) {
                        output.appendChild(this.GameStarter.createElement.apply(this.GameStarter, extra.extraElements[j]));
                    }
                }
            }
        }
    }
}
