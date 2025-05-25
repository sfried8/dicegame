import styles from "./page.module.css";
import GridBoard from "./components/GridBoard";
import GameRound from "./components/GameRound";
import GridCellObject from "./model/GridCell";
import GameHandler from "./components/GameHandler";

const randomSeed = Date.now().toString();
export default function Home() {
    return (
        <div className={styles.page}>
            <GameHandler randomSeed={randomSeed} />
        </div>
    );
}
