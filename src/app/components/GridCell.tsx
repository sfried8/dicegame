"use client";
import styles from "./GridCell.module.css";
import GridCellObject from "../model/GridCell";
export default function GridCell({
    cell,
    onClick,
    onRightClick,
}: {
    cell: GridCellObject;
    onClick: () => void;
    onRightClick: () => void;
}) {
    const className = `${styles["grid-cell"]}  ${
        cell.disabled ? styles.disabled : ""
    } ${cell.frozen ? styles.frozen : ""} ${
        cell.value != null ? styles.filled : styles.empty
    } ${cell.gold && cell.value ? styles.gold : ""}`;
    return (
        <div
            className={className}
            onClick={() => {
                if (!cell.disabled) onClick();
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                if (!cell.disabled) onRightClick();
            }}
        >
            {cell.displayValue}
        </div>
    );
}

function onClick() {}
