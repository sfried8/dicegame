import { immerable } from "immer";

export default class GridCell {
    [immerable] = true;
    row: number;
    col: number;
    constructor(
        public index: number,
        public value: number | null,
        public disabled: boolean,
        public frozen: boolean,
        public gold: boolean,
        gridDimension: number = 6
    ) {
        this.row = Math.floor(index / gridDimension);
        this.col = index % gridDimension;
    }
    get displayValue() {
        return this.value != null
            ? ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][this.value]
            : "";
    }

    // Add any methods you need for this class
}
