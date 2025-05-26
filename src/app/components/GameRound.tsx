"use client";
import { useImmer } from "use-immer";
import GridCellObject from "../model/GridCell";
import GridBoard from "./GridBoard";
import {
    getActiveCellNeighbors,
    getNeighborsInBetween,
} from "../controller/GridLogic";
import CalculateScore from "../controller/Score";
import styles from "./GameRound.module.css";
import { PERKS } from "../controller/Perks";
import RNG from "../model/RNG";
import GridCell from "./GridCell";

function getPossibleDiceValues(perks: PERKS[]) {
    return [1, 2, 3, 4, 5, 6].filter((value) => {
        if (perks.includes(PERKS.noones) && value === 1) {
            return false;
        }
        if (perks.includes(PERKS.notwos) && value === 2) {
            return false;
        }
        return true;
    });
}
function getInitialCellObjects(
    rng: RNG,
    perks: PERKS[] = []
): GridCellObject[][] {
    const possibleValues = getPossibleDiceValues(perks);
    const goldProbability =
        perks.filter((perk) => perk === PERKS.onepercentchanceforgold).length *
        0.01;
    const cellObjects: GridCellObject[][] = [];
    for (let i = 0; i < 6; i++) {
        cellObjects[i] = [];
        for (let j = 0; j < 6; j++) {
            cellObjects[i].push(
                new GridCellObject(
                    i * 6 + j,
                    rng.randomElement(possibleValues),
                    false,
                    false,
                    rng.randomBool(goldProbability)
                )
            );
        }
    }
    return cellObjects;
}

export default function GameRound({
    rng,
    startingHands,
    startingRerolls,
    scoreTarget,
    perks,
    onGameOver,
    onRoundWin,
}: {
    rng: RNG;
    startingHands: number;
    startingRerolls: number;
    scoreTarget: number;
    perks: PERKS[];
    onGameOver?: () => void;
    onRoundWin?: () => void;
}) {
    const [cells, setCells] = useImmer(getInitialCellObjects(rng, perks));
    const [activeCell, setActiveCell] = useImmer<GridCellObject | null>(null);
    const [score, setScore] = useImmer(0);
    const [remainingHands, setRemainingHands] = useImmer(startingHands);
    const [remainingRerolls, setRemainingRerolls] = useImmer(startingRerolls);
    const [proposedHand, setProposedHand] = useImmer<GridCellObject[]>([]);
    const [handScore, setHandScore] = useImmer(0);
    const handleSetActiveCell = (cell: GridCellObject | null) => {
        setCells((draft) => {
            if (!cell) {
                draft.flat().forEach((dcell) => {
                    dcell.disabled = false;
                });
                setActiveCell(null);
                return;
            }
            setActiveCell(cell);
            const neighbors = getActiveCellNeighbors(draft, cell);
            draft.flat().forEach((dcell) => {
                dcell.disabled = dcell.index !== cell.index;
            });
            neighbors.forEach((neighbor) => {
                neighbor.disabled = false;
            });
        });
    };
    function playHand(inbetweeners: GridCellObject[]) {
        if (remainingHands === 0) {
            if (score < scoreTarget) {
                onGameOver?.();
            }
            return;
        }
        setRemainingHands((draft) => draft - 1);
        console.log(inbetweeners.map((c) => c.value));
        const handScore = CalculateScore(inbetweeners, perks);
        setHandScore(handScore);
        setTimeout(() => {
            setHandScore(0);
            setScore((draft) => draft + handScore);
            const inbetweenerIndexes = inbetweeners.map((c) => c.index);
            setCells((draft) => {
                draft.flat().forEach((c) => {
                    if (inbetweenerIndexes.includes(c.index)) {
                        c.value = null;
                    }
                });
            });
            if (score + handScore >= scoreTarget) {
                onRoundWin?.();
            } else if (remainingHands === 1) {
                onGameOver?.();
            }
        }, 2000);
    }
    function onClick(cell: GridCellObject) {
        if (!activeCell) {
            handleSetActiveCell(cell);
            return;
        }
        const inbetweeners = getNeighborsInBetween(cells, activeCell, cell);
        console.log(inbetweeners);
        setProposedHand(
            inbetweeners.map(
                (c) =>
                    new GridCellObject(c.index, c.value, false, false, c.gold)
            )
        );
        handleSetActiveCell(null);
    }
    function onRightClick(cell: GridCellObject) {
        setCells((draft) => {
            draft[cell.row][cell.col].frozen =
                !draft[cell.row][cell.col].frozen;
        });
    }
    function reroll() {
        if (remainingRerolls === 0) {
            return;
        }
        setProposedHand([]);
        setRemainingRerolls((draft) => draft - 1);
        setCells((draft) => {
            const goldProbability =
                perks.filter((perk) => perk === PERKS.onepercentchanceforgold)
                    .length * 0.01;
            draft.flat().forEach((c) => {
                if (c.value === null || c.frozen) return;
                c.value = rng.randomElement(getPossibleDiceValues(perks));
                c.gold = rng.randomBool(goldProbability);
            });
        });
    }
    return (
        <div>
            <div className={styles["game-round"]}>
                <GridBoard
                    cells={cells}
                    onClick={onClick}
                    onRightClick={onRightClick}
                />
                <button
                    onClick={reroll}
                    disabled={remainingRerolls === 0}
                    className={styles["reroll"]}
                >
                    Reroll ({remainingRerolls})
                </button>
                <div className={styles["hands-remaining"]}>
                    Hands ({remainingHands})
                </div>
                <div>
                    <div>Score: {score}</div>
                    <div>Target: {scoreTarget}</div>
                </div>
            </div>
            {proposedHand.length > 0 && (
                <div className={styles["proposed-hand"]}>
                    {proposedHand.map((cell) => (
                        <GridCell
                            cell={cell}
                            key={cell.index}
                            onClick={() => {}}
                            onRightClick={() => {}}
                        ></GridCell>
                    ))}
                    <button
                        onClick={() => {
                            playHand(proposedHand);
                            setProposedHand([]);
                        }}
                    >
                        Play Hand
                    </button>
                </div>
            )}
            {handScore > 0 && <div>+{handScore}</div>}
        </div>
    );
}
