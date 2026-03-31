import type { Level } from "../types";
import styles from "./MenuScreen.module.css";

interface Props {
  onStart: (level: Level) => void;
}

const levels: { value: Level; label: string; description: string }[] = [
  { value: "junior", label: "Junior", description: "配列・文字列・Objectの基本メソッド" },
  { value: "middle", label: "Middle", description: "flatMap・Promise・応用メソッド" },
];

export default function MenuScreen({ onStart }: Props) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>メソッド問題</h1>
      <p className={styles.subtitle}>
        咄嗟にコードが書けるエンジニアの思考を身につける
      </p>
      <div className={styles.levels}>
        {levels.map((level) => (
          <button
            key={level.value}
            className={styles.levelButton}
            onClick={() => onStart(level.value)}
          >
            <span className={styles.levelLabel}>{level.label}</span>
            <span className={styles.levelDesc}>{level.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
