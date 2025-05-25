import RNG from "../model/RNG";

enum PERKS {
    plusonereroll,
    plusonehand,
    onesaresixes,
    doubleodds,
    doubleevens,
    noones,
    notwos,
    onepercentchanceforgold,
}
const PerkDisplayNames = {
    [PERKS.plusonereroll]: "+1 Reroll",
    [PERKS.plusonehand]: "+1 Hand",
    [PERKS.onesaresixes]: "1s are 6s",
    [PERKS.doubleodds]: "odds are doubled",
    [PERKS.doubleevens]: "evens are doubled",
    [PERKS.noones]: "no 1s",
    [PERKS.notwos]: "no 2s",
    [PERKS.onepercentchanceforgold]: "1% chance for gold die",
};
const stackablePerks = [
    PERKS.plusonereroll,
    PERKS.plusonehand,
    PERKS.doubleodds,
    PERKS.doubleevens,
    PERKS.onepercentchanceforgold,
];
const nonStackablePerks = [PERKS.onesaresixes, PERKS.noones, PERKS.notwos];
function getRandomPerks(existingPerks: PERKS[], rng: RNG) {
    const perkOptions = [
        ...stackablePerks,
        ...nonStackablePerks.filter((perk) => !existingPerks.includes(perk)),
    ];
    console.log(perkOptions.map((perk) => PerkDisplayNames[perk]));
    const perks = rng.shuffleArray(perkOptions);
    return perks.slice(0, 3);
}

export { PERKS, PerkDisplayNames, getRandomPerks };
