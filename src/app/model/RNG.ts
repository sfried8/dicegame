import seedrandom from "seedrandom";

export default class RNG {
    rng: seedrandom.PRNG;
    constructor(randomseed: string) {
        this.rng = seedrandom(randomseed);
    }
    shuffleArray<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(this.rng() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    randomElement<T>(array: T[]) {
        return array[Math.floor(this.rng() * array.length)];
    }
    randomBool(probability: number = 0.5) {
        return this.rng() < probability;
    }
}
