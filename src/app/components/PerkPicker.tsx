import { useState } from "react";
import styles from "./PerkPicker.module.css";
import { PerkDisplayNames, PERKS } from "../controller/Perks";

interface PerkPickerProps {
    options: PERKS[];
    onSelect: (option: PERKS) => void;
}

export default function PerkPicker({ options, onSelect }: PerkPickerProps) {
    function handleSelect(option: PERKS) {
        onSelect(option);
    }

    return (
        <div className={styles.perkPicker}>
            <div className={styles.modal}>
                <div className={styles.modalBody}>
                    {options.map((option) => (
                        <button
                            key={option}
                            className={styles.option}
                            onClick={() => handleSelect(option)}
                        >
                            {PerkDisplayNames[option]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
