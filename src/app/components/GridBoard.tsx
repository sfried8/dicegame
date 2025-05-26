"use client";
import GridCell from "./GridCell";
import styles from "./GridBoard.module.css";
import GridCellObject from "../model/GridCell";

export default function GridBoard({
    cells,
    onClick,
    onRightClick,
}: {
    cells: GridCellObject[][];
    onClick: (cell: GridCellObject) => void;
    onRightClick: (cell: GridCellObject) => void;
}) {
    return (
        <div className={styles["grid-board"]}>
            {cells.map((row, i) => (
                <div key={i} className={styles["grid-board-row"]}>
                    {row.map((cell, j) => (
                        <GridCell
                            key={i + "-" + j}
                            cell={cell}
                            onClick={() => {
                                onClick(cell);
                            }}
                            onRightClick={() => {
                                onRightClick(cell);
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
