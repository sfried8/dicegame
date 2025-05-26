import styles from "./page.module.css";
import GameHandler from "./components/GameHandler";

const randomSeed = Date.now().toString();
export default function Home() {
    return (
        <div className={styles.page}>
            <GameHandler randomSeed={randomSeed} />
        </div>
    );
}
