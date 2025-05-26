"use client";
import styles from "../page.module.css";
import GameRound from "./GameRound";
import { useState } from "react";
import getScoreTarget from "../controller/ScoreTarget";
import PerkPicker from "./PerkPicker";
import { getRandomPerks, PERKS } from "../controller/Perks";
import RNG from "../model/RNG";

let rng: RNG | null = null;
export default function GameHandler({ randomSeed }: { randomSeed: string }) {
    if (!rng) {
        rng = new RNG(randomSeed);
    }
    const [round, setRound] = useState(1);
    const [reroll, setReroll] = useState(3);
    const [hands, setHands] = useState(3);
    const [gameState, setGameState] = useState("playing");
    const [perks, setPerks] = useState<PERKS[]>([
        PERKS.onepercentchanceforgold,
        PERKS.onepercentchanceforgold,
    ]);
    function getHandsAndRerolls(perks: PERKS[]) {
        const handsAndRerolls = {
            hands: 3,
            rerolls: 3,
        };
        perks.forEach((perk) => {
            if (perk === PERKS.plusonehand) {
                handsAndRerolls.hands += 1;
            }
            if (perk === PERKS.plusonereroll) {
                handsAndRerolls.rerolls += 1;
            }
            if (perk === PERKS.minusonehandplusthreereroll) {
                handsAndRerolls.hands -= 1;
                handsAndRerolls.rerolls += 3;
            }
        });
        return handsAndRerolls;
    }
    return (
        <div className={styles.page}>
            {gameState === "playing" ? (
                <GameRound
                    key={round}
                    rng={rng}
                    startingHands={hands}
                    startingRerolls={reroll}
                    scoreTarget={getScoreTarget(round)}
                    perks={perks}
                    onGameOver={() => {
                        console.log("Game Over");
                        setGameState("gameover");
                    }}
                    onRoundWin={() => {
                        setGameState("perks");
                        setRound(round + 1);
                    }}
                />
            ) : gameState === "perks" ? (
                <PerkPicker
                    options={getRandomPerks(perks, rng!)}
                    onSelect={(option) => {
                        setPerks([...perks, option]);
                        const handsAndRerolls = getHandsAndRerolls([
                            ...perks,
                            option,
                        ]);
                        setReroll(handsAndRerolls.rerolls);
                        setHands(handsAndRerolls.hands);
                        setGameState("playing");
                    }}
                />
            ) : (
                gameState === "gameover" && <div>Game Over</div>
            )}
        </div>
    );
}
