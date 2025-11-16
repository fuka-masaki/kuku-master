# TICKET-003: 九九マスターデータの作成

## 📋 概要
1×1から9×9までの81問分の九九データと、7つのレベル設定をJSONファイルとして作成する。

## 🎯 目的
アプリケーションで使用する九九の問題データと読み仮名を正確に定義する。

## 📦 依存チケット
- **TICKET-001**: プロジェクトセットアップ（必須）
- **TICKET-002**: 型定義とデータ構造の設計（必須）

## 📝 詳細要件

### 1. 九九マスターデータの作成

#### `src/data/multiplicationProblems.json`
81問分のデータを作成（1×1 〜 9×9）

**データ形式:**
```json
[
  {
    "multiplicand": 1,
    "multiplier": 1,
    "answer": 1,
    "reading": {
      "multiplicand": "いん",
      "multiplier": "いち",
      "equals": "が",
      "answer": "いち"
    }
  },
  {
    "multiplicand": 1,
    "multiplier": 2,
    "answer": 2,
    "reading": {
      "multiplicand": "いん",
      "multiplier": "に",
      "equals": "が",
      "answer": "に"
    }
  }
  // ... 81問分
]
```

**読み仮名の規則:**

| 段 | 被乗数の読み | 備考 |
|---|------------|------|
| 1の段 | いん | 特殊（「いち」ではない） |
| 2の段 | に |  |
| 3の段 | さん |  |
| 4の段 | し |  |
| 5の段 | ご |  |
| 6の段 | ろく |  |
| 7の段 | しち |  |
| 8の段 | はち |  |
| 9の段 | く |  |

| 乗数 | 読み |
|-----|------|
| 1 | いち |
| 2 | に |
| 3 | さん |
| 4 | し |
| 5 | ご |
| 6 | ろく |
| 7 | しち |
| 8 | はち |
| 9 | く |

| 答え | 読み | 備考 |
|-----|------|------|
| 1-9 | 上記と同じ | |
| 10-19 | じゅう、じゅういち、... | |
| 20-29 | にじゅう、にじゅういち、... | |
| 30-39 | さんじゅう、さんじゅういち、... | |
| 40-49 | よんじゅう、よんじゅういち、... | 「し」ではなく「よん」 |
| 50-59 | ごじゅう、ごじゅういち、... | |
| 60-69 | ろくじゅう、ろくじゅういち、... | |
| 70-79 | ななじゅう、ななじゅういち、... | 「しち」ではなく「なな」 |
| 80-81 | はちじゅう、はちじゅういち | |

**完全なデータ例（一部）:**
```json
[
  {"multiplicand": 1, "multiplier": 1, "answer": 1, "reading": {"multiplicand": "いん", "multiplier": "いち", "equals": "が", "answer": "いち"}},
  {"multiplicand": 1, "multiplier": 2, "answer": 2, "reading": {"multiplicand": "いん", "multiplier": "に", "equals": "が", "answer": "に"}},
  {"multiplicand": 2, "multiplier": 4, "answer": 8, "reading": {"multiplicand": "に", "multiplier": "し", "equals": "が", "answer": "はち"}},
  {"multiplicand": 2, "multiplier": 5, "answer": 10, "reading": {"multiplicand": "に", "multiplier": "ご", "equals": "が", "answer": "じゅう"}},
  {"multiplicand": 3, "multiplier": 6, "answer": 18, "reading": {"multiplicand": "さん", "multiplier": "ろく", "equals": "が", "answer": "じゅうはち"}},
  {"multiplicand": 7, "multiplier": 8, "answer": 56, "reading": {"multiplicand": "しち", "multiplier": "はち", "equals": "が", "answer": "ごじゅうろく"}},
  {"multiplicand": 9, "multiplier": 9, "answer": 81, "reading": {"multiplicand": "く", "multiplier": "く", "equals": "が", "answer": "はちじゅういち"}}
]
```

### 2. レベル設定データの作成

#### `src/data/levelConfigs.json`
```json
[
  {
    "id": 1,
    "title": "1～5のだん",
    "description": "じゅんばん・よみあり",
    "totalQuestions": 90,
    "questionsPerRound": 45,
    "timePerQuestion": 3,
    "totalTime": 270,
    "targetTime": 270,
    "hasReading": true,
    "isRandom": false,
    "range": {
      "min": 1,
      "max": 5
    },
    "isHoleQuestion": false
  },
  {
    "id": 2,
    "title": "6～9のだん",
    "description": "じゅんばん・よみあり",
    "totalQuestions": 72,
    "questionsPerRound": 36,
    "timePerQuestion": 3,
    "totalTime": 216,
    "targetTime": 210,
    "hasReading": true,
    "isRandom": false,
    "range": {
      "min": 6,
      "max": 9
    },
    "isHoleQuestion": false
  },
  {
    "id": 3,
    "title": "81問チャレンジ",
    "description": "じゅんばん・よみあり",
    "totalQuestions": 162,
    "questionsPerRound": 81,
    "timePerQuestion": 2.5,
    "totalTime": 405,
    "targetTime": 360,
    "hasReading": true,
    "isRandom": false,
    "range": {
      "min": 1,
      "max": 9
    },
    "isHoleQuestion": false
  },
  {
    "id": 4,
    "title": "81問チャレンジ",
    "description": "じゅんばん・よみなし",
    "totalQuestions": 162,
    "questionsPerRound": 81,
    "timePerQuestion": 2.5,
    "totalTime": 405,
    "targetTime": 360,
    "hasReading": false,
    "isRandom": false,
    "range": {
      "min": 1,
      "max": 9
    },
    "isHoleQuestion": false
  },
  {
    "id": 5,
    "title": "81問チャレンジ",
    "description": "ランダム・よみあり",
    "totalQuestions": 162,
    "questionsPerRound": 81,
    "timePerQuestion": 2.5,
    "totalTime": 405,
    "targetTime": 360,
    "hasReading": true,
    "isRandom": true,
    "range": {
      "min": 1,
      "max": 9
    },
    "isHoleQuestion": false
  },
  {
    "id": 6,
    "title": "81問チャレンジ",
    "description": "ランダム・よみなし",
    "totalQuestions": 162,
    "questionsPerRound": 81,
    "timePerQuestion": 2.5,
    "totalTime": 405,
    "targetTime": 360,
    "hasReading": false,
    "isRandom": true,
    "range": {
      "min": 1,
      "max": 9
    },
    "isHoleQuestion": false
  },
  {
    "id": 7,
    "title": "あなあきチャレンジ",
    "description": "ランダム",
    "totalQuestions": 162,
    "questionsPerRound": 81,
    "timePerQuestion": 2.5,
    "totalTime": 405,
    "targetTime": 360,
    "hasReading": false,
    "isRandom": true,
    "range": {
      "min": 1,
      "max": 9
    },
    "isHoleQuestion": true
  }
]
```

### 3. データローダーの作成

#### `src/data/dataLoader.ts`
```typescript
import { MultiplicationProblem, LevelConfig } from '@/types';
import multiplicationProblemsData from './multiplicationProblems.json';
import levelConfigsData from './levelConfigs.json';

/**
 * 九九の問題データを取得
 */
export function getMultiplicationProblems(): MultiplicationProblem[] {
  return multiplicationProblemsData as MultiplicationProblem[];
}

/**
 * 特定の範囲の問題を取得
 */
export function getProblemsByRange(min: number, max: number): MultiplicationProblem[] {
  const allProblems = getMultiplicationProblems();
  return allProblems.filter(
    (p) => p.multiplicand >= min && p.multiplicand <= max
  );
}

/**
 * レベル設定を取得
 */
export function getLevelConfigs(): LevelConfig[] {
  return levelConfigsData as LevelConfig[];
}

/**
 * 特定のレベル設定を取得
 */
export function getLevelConfig(levelId: number): LevelConfig | undefined {
  const configs = getLevelConfigs();
  return configs.find((config) => config.id === levelId);
}
```

### 4. データ検証ユーティリティの作成

#### `src/data/validator.ts`
```typescript
import { MultiplicationProblem } from '@/types';

/**
 * 九九データの整合性をチェック
 */
export function validateMultiplicationData(
  problems: MultiplicationProblem[]
): boolean {
  // 81問あるかチェック
  if (problems.length !== 81) {
    console.error(`Expected 81 problems, but got ${problems.length}`);
    return false;
  }

  // 各問題の整合性をチェック
  for (const problem of problems) {
    const { multiplicand, multiplier, answer } = problem;

    // 計算結果が正しいかチェック
    if (multiplicand * multiplier !== answer) {
      console.error(
        `Invalid calculation: ${multiplicand} × ${multiplier} should be ${multiplicand * multiplier}, but got ${answer}`
      );
      return false;
    }

    // 読み仮名が存在するかチェック
    if (!problem.reading || !problem.reading.multiplicand || !problem.reading.multiplier || !problem.reading.answer) {
      console.error(`Missing reading for ${multiplicand} × ${multiplier}`);
      return false;
    }
  }

  return true;
}
```

## 🔍 実装手順

1. `src/data/multiplicationProblems.json` を作成
   - 1×1から9×9まで81問のデータを入力
   - 読み仮名を正確に記載

2. `src/data/levelConfigs.json` を作成
   - 7つのレベルの設定を定義

3. `src/data/dataLoader.ts` を作成
   - データ読み込み関数を実装

4. `src/data/validator.ts` を作成
   - データ検証関数を実装

5. バリデーションを実行
   ```typescript
   // 開発時に実行してデータの正確性を確認
   const problems = getMultiplicationProblems();
   const isValid = validateMultiplicationData(problems);
   console.log('Data validation:', isValid ? 'PASS' : 'FAIL');
   ```

## ✅ 受け入れ基準

- [ ] `multiplicationProblems.json` に81問のデータが正確に記載されている
- [ ] 全ての計算結果が正しい（例: 2×4=8）
- [ ] 全ての読み仮名が正しい（例: に・し・が・はち）
- [ ] `levelConfigs.json` に7つのレベル設定が記載されている
- [ ] 目標タイムが要件通り（レベル①: 270秒、レベル②: 210秒）
- [ ] `dataLoader.ts` が正しくデータを読み込める
- [ ] `validator.ts` による検証が全てパスする
- [ ] TypeScriptの型エラーがない

## 🔧 技術的詳細

### JSONファイルのインポート
`tsconfig.json` に以下が設定されていることを確認：
```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

### 読み仮名の正確性
- 九九の一般的な読み方に準拠
- 小学校の教科書で使用される読み方を参考
- 1の段は「いんいちがいち」（「いち」ではなく「いん」）

## ⚠️ 注意事項

1. **データの正確性**: 読み仮名は小学生が実際に使う読み方にする
2. **計算ミス**: 各問題の答えが正しいか必ず確認
3. **完全性**: 81問全てのデータが必要（抜けがないように）
4. **文字コード**: UTF-8で保存する
5. **JSON形式**: 正しいJSON形式であることを確認（カンマの位置など）

## 📊 見積もり工数
**約3〜4時間**
- データ入力: 2〜3時間
- 検証・修正: 1時間

## 🔗 関連ドキュメント
- [九九の読み方（文部科学省）](https://www.mext.go.jp/)
- [JSON公式サイト](https://www.json.org/)

## 📎 次のチケットへの引き継ぎ事項
- このデータを使って問題を生成する（TICKET-006）
- レベル選択画面でレベル設定を表示する（TICKET-005）

## 🎯 データ入力の優先順位
1. まず1の段から5の段まで（レベル①用）
2. 次に6の段から9の段まで（レベル②用）
3. 最後に全体の検証
