# 苦情処理記録プロンプト

## 基本指示
障害者施設における苦情・要望処理システムを開発する際に使用するプロンプトです。利用者・保護者からの苦情を適切に受け付け、迅速かつ誠実な対応を行い、サービス向上につなげるシステムを構築してください。

## 主要な開発要件

### 1. 苦情受付機能
- 多様な受付チャネル（電話・メール・面談・アプリ内フォーム・書面）
- 匿名・実名選択可能な投稿機能
- 緊急度・重要度の自動判定機能
- 受付確認の自動送信機能
- 担当者への即座通知機能
- 苦情内容の自動分類機能

### 2. 対応管理機能
- 対応状況の追跡・管理
- 担当者アサイン機能
- 対応期限設定・アラート機能
- 対応履歴の詳細記録
- 関係者間の情報共有機能
- エスカレーション機能

### 3. 分析・統計機能
- 苦情類型別統計
- 発生頻度・傾向分析
- 対応時間の分析
- 満足度調査結果の集計
- 再発防止効果の測定
- サービス改善効果の可視化

### 4. 改善・フォローアップ機能
- 改善策の策定・管理
- 実施状況の追跡
- 効果測定・評価機能
- 類似苦情の予防策提案
- 定期的フォローアップ機能
- 報告書自動生成機能

## 障害者施設特有の考慮事項

### 利用者・保護者の特性への配慮
- 知的障害者本人からの苦情への適切な対応
- コミュニケーション方法の多様性への対応
- 保護者・家族の心理的負担への配慮
- 文化的・宗教的背景への理解
- 年齢層の幅広さへの対応

### 福祉サービス特有の課題
- 支援の質・内容に関する苦情
- スタッフの対応・態度に関する苦情
- 施設環境・設備に関する苦情
- 他の利用者とのトラブル
- 送迎・交通に関する苦情
- 料金・費用に関する苦情

### 法的・制度的要件
- 障害者総合支援法に基づく苦情対応義務
- 各自治体の苦情処理要綱への対応
- 第三者委員会・苦情解決委員会との連携
- 都道府県・市区町村への報告義務
- 情報開示請求への対応

## 苦情分類システム

### 主要カテゴリ
- サービス提供（支援内容・質・方法）
- スタッフ対応（態度・技術・コミュニケーション）
- 施設環境（清潔・安全・設備・アクセシビリティ）
- 利用者間関係（トラブル・いじめ・差別）
- 家族対応（連絡・報告・面談・参加行事）
- 運営管理（ルール・手続き・時間・料金）
- 緊急対応（事故・病気・災害時の対応）

### 緊急度分類
- 緊急（24時間以内対応）：安全に関わる重大な問題
- 高（3日以内対応）：サービス提供に大きく影響する問題
- 中（1週間以内対応）：改善が必要だが緊急性は低い問題
- 低（1ヶ月以内対応）：要望・提案レベルの問題

### 対応難易度分類
- A：即座に解決可能（謝罪・説明で解決）
- B：短期間で改善可能（ルール変更・研修で解決）
- C：中期的改善が必要（制度・システム変更が必要）
- D：構造的問題（根本的な見直しが必要）

## 対応プロセス設計

### 初期対応（24時間以内）
1. 苦情内容の正確な記録
2. 苦情者への受付確認
3. 緊急度・重要度の判定
4. 担当者の決定・通知
5. 管理者への報告
6. 初期調査の実施

### 調査・分析段階
1. 関係者からの事情聴取
2. 客観的事実の確認
3. 原因分析（直接・間接要因）
4. 類似事例の調査
5. 改善策の検討
6. 対応方針の決定

### 対応・実施段階
1. 苦情者への中間報告
2. 改善策の実施
3. 関係者への周知
4. 実施状況のモニタリング
5. 効果の測定・評価
6. 最終報告書の作成

### フォローアップ段階
1. 満足度の確認
2. 継続的な状況確認
3. 再発防止策の定着確認
4. 他の類似事例への予防策適用
5. 定期報告（月次・年次）
6. システム改善への反映

## 記録管理システム

### 基本記録項目
- 受付日時・方法・担当者
- 苦情者情報（匿名化オプション）
- 苦情内容（5W1H形式）
- 関係する利用者・スタッフ・場所
- 緊急度・重要度・分類
- 対応担当者・期限設定

### 対応記録項目
- 調査内容・結果
- 関係者証言・客観的事実
- 原因分析結果
- 改善策・対応方針
- 実施内容・時期
- 効果測定結果

### 完了記録項目
- 最終対応内容
- 苦情者の満足度
- 学んだ教訓・改善点
- 再発防止策
- 他事例への応用可能性
- 制度・システムへの反映事項

## 品質管理・改善機能

### 対応品質の管理
- 対応時間の測定・目標管理
- 対応内容の品質評価
- 苦情者満足度の測定
- 再発率の追跡
- スタッフの対応スキル評価

### 継続的改善
- 苦情傾向の分析と対策
- システム・制度の見直し
- スタッフ研修の企画・実施
- 予防的改善の実施
- 他施設との事例共有

## セキュリティ・プライバシー

### 情報保護
- 苦情内容の機密保持
- 匿名性の確保
- アクセス制限（関係者のみ）
- データの適切な保存期間管理
- 情報漏洩防止対策

### 透明性の確保
- 対応プロセスの公開
- 統計情報の定期公表
- 改善実績の報告
- 第三者評価への対応

## チェックリスト
- [ ] 多様な受付チャネルの整備
- [ ] 迅速な初期対応システム
- [ ] 適切な分類・優先度付け機能
- [ ] 対応進捗の可視化・管理
- [ ] 関係者間の情報共有機能
- [ ] 統計・分析機能の充実
- [ ] 改善策の効果測定機能
- [ ] プライバシー保護機能
- [ ] 法的要件への対応
- [ ] 継続的改善システム

## 継続的改善のポイント
- 苦情を「改善の源泉」として活用
- スタッフの苦情対応スキル向上
- 予防的な改善活動の推進
- 利用者・保護者との信頼関係構築
- 透明性と説明責任の向上