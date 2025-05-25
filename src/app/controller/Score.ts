import GridCell from "../model/GridCell";
import { PERKS } from "./Perks";

const frequencyGraph = (dice: number[]) => {
    const graph: { [key: number]: number } = {};
    dice.forEach((die) => {
        if (graph[die]) {
            graph[die] += 1;
        } else {
            graph[die] = 1;
        }
    });
    console.log(graph);
    return graph;
};
const graphHasAnySet = (
    graph: { [key: number]: number },
    diceSets: number[][]
) => {
    return diceSets.some((set) => graphHas(graph, set));
};
const graphHas = (graph: { [key: number]: number }, dice: number[]) => {
    return dice.every((die) => graph[die] > 0);
};
function checkForStraight(frequencyGraph: { [key: number]: number }) {
    if (graphHas(frequencyGraph, [1, 2, 3, 4, 5, 6])) {
        return 1000;
    }
    if (
        graphHasAnySet(frequencyGraph, [
            [1, 2, 3, 4, 5],
            [2, 3, 4, 5, 6],
        ])
    ) {
        return 500;
    }
    if (
        graphHasAnySet(frequencyGraph, [
            [1, 2, 3, 4],
            [2, 3, 4, 5],
            [3, 4, 5, 6],
        ])
    ) {
        return 200;
    }

    return 0;
}
function getEffectiveDiceValue(die: number, perks: PERKS[]) {
    let startingValue = die + 4;
    perks.forEach((perk) => {
        if (perk === PERKS.onesaresixes && die === 1) {
            startingValue += 5;
        }
        if (perk === PERKS.doubleodds && die % 2 === 1) {
            startingValue *= 2;
        }
        if (perk === PERKS.doubleevens && die % 2 === 0) {
            startingValue *= 2;
        }
    });
    return startingValue;
}
export default function CalculateScore(gridcells: GridCell[], perks: PERKS[]) {
    const dice = gridcells.map((cell) => cell.value!);
    const graph = frequencyGraph(dice);
    const goldMultiplier = Math.pow(
        2,
        gridcells.filter((cell) => cell.gold).length
    );
    const straightScore = checkForStraight(graph);
    if (straightScore > 0) {
        return straightScore * goldMultiplier;
    }
    let score = 0;
    for (const die in graph) {
        const points = getEffectiveDiceValue(parseInt(die), perks);
        const quantity = graph[die];
        if (quantity == 6) {
            score += points * 60;
        }
        if (quantity >= 3) {
            score += points * quantity * quantity * quantity;
        } else if (quantity >= 2) {
            score += points * 4;
        } else if (quantity >= 1) {
            score += points;
        }
    }
    return score * goldMultiplier;
}
