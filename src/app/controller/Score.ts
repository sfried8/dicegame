import GridCell from "../model/GridCell";
import { PERKS } from "./Perks";

enum HANDS {
    Chance = "Chance",
    Pair = "Pair",
    TwoPair = "TwoPair",
    ThreePair = "ThreePair",
    FullHouse = "FullHouse", // 3 of a kind and 2 of a kind
    FullerHouse = "FullerHouse", // 4 of a kind and 2 of a kind
    ThreeOfAKind = "ThreeOfAKind",
    TwoXThree = "TwoXThree", //  = "// " = "// "3 of a kind and 3 of a kind
    FourOfAKind = "FourOfAKind",
    SmallStraight = "SmallStraight",
    LargeStraight = "LargeStraight",
    HugeStraight = "HugeStraight",
    Yacht = "Yacht",
    SuperYacht = "SuperYacht",
}
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

function getStraightScore(hand: HANDS) {
    if (hand === HANDS.SmallStraight) {
        return 200;
    }
    if (hand === HANDS.LargeStraight) {
        return 500;
    }
    if (hand === HANDS.HugeStraight) {
        return 1000;
    }
    return 0;
}
function checkForStraight(frequencyGraph: { [key: number]: number }) {
    if (graphHas(frequencyGraph, [1, 2, 3, 4, 5, 6])) {
        return HANDS.HugeStraight;
    }
    if (
        graphHasAnySet(frequencyGraph, [
            [1, 2, 3, 4, 5],
            [2, 3, 4, 5, 6],
        ])
    ) {
        return HANDS.LargeStraight;
    }
    if (
        graphHasAnySet(frequencyGraph, [
            [1, 2, 3, 4],
            [2, 3, 4, 5],
            [3, 4, 5, 6],
        ])
    ) {
        return HANDS.SmallStraight;
    }

    return null;
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

function determineHand(cells: number[]) {
    const freq = frequencyGraph(cells);
    const vals = Object.values(freq);
    if (vals.includes(6)) {
        return HANDS.SuperYacht;
    }
    if (vals.includes(5)) {
        return HANDS.Yacht;
    }
    const straight = checkForStraight(freq);
    if (straight != null) {
        return straight;
    }
    if (vals.includes(4)) {
        if (vals.includes(2)) {
            return HANDS.FullerHouse;
        }
        return HANDS.FourOfAKind;
    }
    if (vals.includes(3)) {
        if (vals.filter((val) => val === 3).length === 2) {
            return HANDS.TwoXThree;
        }
        if (vals.includes(2)) {
            return HANDS.FullHouse;
        }
        return HANDS.ThreeOfAKind;
    }
    if (vals.includes(2)) {
        const numPairs = vals.filter((val) => val === 2).length;
        if (numPairs === 3) {
            return HANDS.ThreePair;
        }
        if (numPairs === 2) {
            return HANDS.TwoPair;
        }
        return HANDS.Pair;
    }
    return HANDS.Chance;
}
function getMult(hand: HANDS, perks: PERKS[]) {
    let handMult = 1;
    switch (hand) {
        case HANDS.SuperYacht:
            handMult = 250;
            break;
        case HANDS.Yacht:
            handMult = 150;
            break;
        case HANDS.SmallStraight:
            handMult = 40;
            break;
        case HANDS.LargeStraight:
            handMult = 75;
            break;
        case HANDS.HugeStraight:
            handMult = 125;
            break;
        case HANDS.FourOfAKind:
            handMult = 50;
            break;
        case HANDS.FullerHouse:
            handMult = 75;
            break;
        case HANDS.TwoXThree:
            handMult = 50;
            break;
        case HANDS.ThreePair:
            handMult = 25;
            break;
        case HANDS.Pair:
            handMult = 8;
            break;
        case HANDS.TwoPair:
            handMult = 16;
            break;
        case HANDS.ThreeOfAKind:
            handMult = 25;
            break;
        case HANDS.FullHouse:
            handMult = 50;
            break;
        default:
            handMult = 1;
            break;
    }
    // TODO add perks
    console.log(perks);
    return handMult;
}
function getScoreComponents(gridcells: GridCell[], perks: PERKS[]) {
    const points = gridcells.reduce((total, cell) => {
        return total + getEffectiveDiceValue(cell.value!, perks);
    }, 0);
    const mult = getMult(
        determineHand(gridcells.map((cell) => cell.value!)),
        perks
    );
    const multmult = Math.pow(2, gridcells.filter((cell) => cell.gold).length);
    return { points, mult, multmult };
}
const handTest = (hand: number[], expectedHand: HANDS) => {
    const actual = determineHand(hand);
    if (actual !== expectedHand) {
        throw new Error(
            hand.join(",") + " should be " + expectedHand + " but was " + actual
        );
    }
};
//eslint-disable-next-line
const testHands = () => {
    handTest([1, 1, 1, 1, 1, 4], HANDS.Yacht);
    handTest([3, 3, 3, 3, 3, 3], HANDS.SuperYacht);
    handTest([2, 3, 4, 5, 6], HANDS.LargeStraight);
    handTest([1, 2, 3, 4, 5, 6], HANDS.HugeStraight);
    handTest([2, 3, 4, 5, 5, 5], HANDS.SmallStraight);
    handTest([4, 4, 4, 4, 1, 2], HANDS.FourOfAKind);
    handTest([4, 4, 4, 4, 2, 2], HANDS.FullerHouse);
    handTest([4, 4, 4, 2, 2, 2], HANDS.TwoXThree);
    handTest([4, 4, 5, 5, 2, 2], HANDS.ThreePair);
    handTest([1, 2, 4, 2, 6, 5], HANDS.Pair);
    handTest([1, 2, 4, 2, 1, 5], HANDS.TwoPair);
    handTest([1, 2, 4, 2, 6, 2], HANDS.ThreeOfAKind);
    handTest([4, 4, 5, 2, 2, 2], HANDS.FullHouse);
    handTest([1, 2, 3], HANDS.Chance);
};

export default function CalculateScore(gridcells: GridCell[], perks: PERKS[]) {
    const dice = gridcells.map((cell) => cell.value!);
    const graph = frequencyGraph(dice);
    const goldMultiplier = Math.pow(
        2,
        gridcells.filter((cell) => cell.gold).length
    );
    console.log(getScoreComponents(gridcells, perks));
    const straightScore = checkForStraight(graph);
    if (straightScore != null) {
        return getStraightScore(straightScore) * goldMultiplier;
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
