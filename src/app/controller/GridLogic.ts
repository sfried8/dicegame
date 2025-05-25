import GridCell from "../model/GridCell";

    function getNeighborsInDirection(
        cells: GridCell[][],
        cell: GridCell,
        dx: number,
        dy: number
    ) {
        const neighbors = [];
        if (dx === 0 && dy === 0) {
            return [];
        }
        let i = 1;
        do {
            const newX = cell.col + dx * i;
            const newY = cell.row + dy * i;
            if (newX < 0 || newX > 5 || newY < 0 || newY > 5) {
                break;
            }
            let neighbor = cells[newY][newX];
            if (neighbor.value === null) {
                break;
            }
            neighbors.push(neighbor);
            i++;
        } while (i <= 6);
        return neighbors;
    }
    function getActiveCellNeighbors(
        cells: GridCell[][],
        activeCell: GridCell | null
    ) {
        if (!activeCell) {
            return [];
        }
        const neighbors = [];
        neighbors.push(...getNeighborsInDirection(cells, activeCell, 0, 1));
        neighbors.push(...getNeighborsInDirection(cells, activeCell, 0, -1));
        neighbors.push(...getNeighborsInDirection(cells, activeCell, 1, 1));
        neighbors.push(...getNeighborsInDirection(cells, activeCell, 1, 0));
        neighbors.push(...getNeighborsInDirection(cells, activeCell, 1, -1));
        neighbors.push(...getNeighborsInDirection(cells, activeCell, -1, -1));
        neighbors.push(...getNeighborsInDirection(cells, activeCell, -1, 0));
        neighbors.push(...getNeighborsInDirection(cells, activeCell, -1, 1));
        return neighbors;
    }
          function  getNeighborsInBetween(cells: GridCell[][], cellA: GridCell, cellB: GridCell) {
            if (cellA.row === cellB.row && cellA.col === cellB.col) {
                return [cellA]
            }
            const inbetweeners = []
            let x = cellA.col
            let y = cellA.row
            let dX = Math.sign(cellB.col - cellA.col)
            let dY = Math.sign(cellB.row - cellA.row)
            do {
                inbetweeners.push(cells[y][x])
                x += dX
                y += dY
            }
            while (x !== cellB.col || y !== cellB.row)
            inbetweeners.push(cellB)
            return inbetweeners
        }
    export { getNeighborsInDirection, getActiveCellNeighbors, getNeighborsInBetween };