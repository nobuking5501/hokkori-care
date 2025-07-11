# 勤務体制表PDF/Excel生成プロンプト

## 基本指示
障害者施設における勤務体制表・各種スケジュール表のPDF/Excel出力機能を開発する際に使用するプロンプとです。自治体提出用、内部管理用、スタッフ配布用など、目的に応じた多様な形式での出力に対応したシステムを構築してください。

## 主要な開発要件

### 1. 出力形式・レイアウト機能
- PDF形式（印刷最適化、電子署名対応）
- Excel形式（編集可能、計算式組み込み）
- CSV形式（データ連携用）
- 印刷サイズ対応（A4、A3、B4等）
- カスタムテンプレート機能
- ロゴ・施設情報の自動挿入

### 2. 勤務体制表生成機能
- 月間勤務表（スタッフ別・日別表示）
- 週間勤務表（詳細シフト・時間表示）
- 日別勤務表（時間割・担当者明記）
- 年間勤務カレンダー（休日・研修日表示）
- 勤務統計表（労働時間・残業時間集計）
- 有給消化表・残日数管理表

### 3. 提出用書類生成機能
- 自治体指定様式への自動変換
- 人員配置基準適合確認表
- 勤務実績報告書
- 労働条件通知書
- 研修実施計画・実績表
- 緊急時対応体制表

### 4. 分析・集計機能
- スタッフ別勤務時間統計
- 時間帯別人員配置グラフ
- 有資格者配置状況表
- 労働基準法適合性チェック表
- コスト分析表（人件費計算）
- 勤務効率性分析レポート

## 障害者施設特有の要件

### 人員配置基準対応
- 障害者支援施設基準（利用者：支援員 = 4:1等）
- サービス管理責任者配置確認
- 有資格者（社会福祉士、介護福祉士等）配置状況
- 看護師・医師配置（医療的ケア対応）
- 夜勤体制・宿直体制の明記

### 法的書類要件
- 都道府県・市区町村提出様式対応
- 労働基準監督署提出書類対応
- 集団指導・実地指導用資料
- 第三者評価用資料
- 運営規程記載事項との整合性確認

### 利用者安全配慮
- 利用者特性に応じた職員配置表示
- 緊急時対応可能スタッフの明記
- 医療的ケア対応者の配置状況
- 行動援護対応者の配置状況
- 送迎対応可能者の配置状況

## テンプレート設計

### 月間勤務表テンプレート
```
施設名・作成日・承認者欄
カレンダー形式での日別勤務者表示
早番・日勤・遅番・夜勤の区別
有給・研修・欠勤等の記号表示
月間合計労働時間・残業時間
備考欄（特記事項・変更履歴）
```

### 週間詳細勤務表テンプレート
```
週間カレンダー（時間軸付き）
スタッフ別タイムライン表示
業務内容・担当利用者の記載
休憩時間・引継ぎ時間の明記
オンコール・緊急連絡体制
交通費・各種手当の記録
```

### 自治体提出用様式テンプレート
```
法定記載事項の自動入力
人員配置基準適合性の確認
資格者数・配置状況の集計
勤務実績の統計データ
変更届・報告事項の記載
電子印・電子署名対応
```

## データ連携・自動化機能

### シフト管理システム連携
- 勤務予定データの自動取得
- 実際の出退勤データとの照合
- 変更・調整履歴の反映
- 承認フローとの連動
- 通知・アラート機能との連携

### 人事・給与システム連携
- スタッフ基本情報の自動取得
- 資格・研修情報の反映
- 給与計算データとの連動
- 労働時間集計の自動化
- 各種手当計算との連携

### 外部システム連携
- 自治体システムへの直接送信
- 労務管理ソフトとの連携
- 会計システムとの連動
- バックアップシステムとの同期

## 品質管理・検証機能

### データ整合性チェック
- 勤務時間の論理チェック
- 人員配置基準の自動確認
- 労働基準法適合性チェック
- ダブルブッキング検出
- 必要資格者配置確認

### 出力品質管理
- レイアウト崩れ検出
- 印刷品質確認機能
- 文字化け防止機能
- ファイル破損チェック
- バージョン管理機能

## セキュリティ・機密保持

### アクセス制御
- 出力権限の階層管理
- データアクセスログ記録
- 電子透かし・ウォーターマーク
- パスワード保護機能
- 印刷制限機能

### データ保護
- 個人情報保護対応
- データ暗号化機能
- 安全な送信機能
- 適切な保存期間管理
- 廃棄時の完全削除

## パフォーマンス最適化

### 高速生成機能
- 大量データでの高速処理
- バックグラウンド生成機能
- 生成進捗表示機能
- 一括出力機能
- 差分更新機能

### メモリ・ストレージ最適化
- 効率的なデータ処理
- 一時ファイルの適切な管理
- キャッシュ機能の活用
- 圧縮機能の実装

## カスタマイズ機能

### テンプレートカスタマイズ
- 施設独自項目の追加
- レイアウト変更機能
- 色・フォントの変更
- ロゴ・画像の挿入
- 多言語対応

### 出力項目カスタマイズ
- 表示項目の選択機能
- 集計方法の変更
- 並び順の変更
- フィルタリング機能
- 条件付き書式設定

## チェックリスト
- [ ] 多様な出力形式への対応
- [ ] 自治体様式への自動変換機能
- [ ] 人員配置基準適合性確認
- [ ] 労働基準法適合性チェック
- [ ] 高品質な印刷出力対応
- [ ] セキュリティ・機密保持機能
- [ ] カスタマイズ機能の充実
- [ ] 外部システム連携機能
- [ ] 品質管理・検証機能
- [ ] パフォーマンス最適化

## 継続的改善のポイント
- 自治体様式変更への迅速対応
- 法改正に伴う出力項目の更新
- 利用者からの改善要望への対応
- 新しい出力形式・機能の追加
- セキュリティ機能の継続的強化