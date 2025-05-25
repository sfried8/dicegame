export default function getScoreTarget(round: number) {
    return 50* (Math.floor(10 * Math.pow(round, 1.5)))
}