'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { useAuth } from '@/components/providers';
import { getShifts, getMessageTemplates, getSupportDiaries } from '@/lib/firestore';
import { Shift, MessageTemplate, SupportDiary } from '@/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  Calendar, 
  BookOpen, 
  ClipboardList, 
  Users, 
  Heart,
  TrendingUp,
  AlertCircle 
} from 'lucide-react';

export default function DashboardPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [todayDiaries, setTodayDiaries] = useState<SupportDiary[]>([]);
  const [encouragementMessage, setEncouragementMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAuth();

  const today = new Date();
  const currentMonth = format(today, 'yyyy-MM');
  const todayString = format(today, 'yyyy-MM-dd');

  // ねぎらいメッセージリスト
  const encouragementMessages = [
    'いつもお疲れさまです！あなたの優しさが利用者の笑顔を作っています。',
    '今日も一日、心を込めてお仕事をされていることに感謝いたします。',
    'あなたの存在が、この施設をより温かい場所にしています。',
    '利用者の方々も、あなたの温かいサポートを心から喜んでいることでしょう。',
    '小さな気遣いが大きな安心につながります。いつもありがとうございます。',
    '今日も素晴らしい一日になりますように。あなたの笑顔が皆を元気にします。',
    'あなたのプロフェッショナルな姿勢が、チーム全体を支えています。',
    '毎日の丁寧なケアが、利用者の生活の質を向上させています。',
    'あなたの献身的な働きぶりは、本当に素晴らしいものです。',
    '今日という日が、あなたにとって充実した一日となりますように。',
    '利用者の方々の幸せのために働くあなたを、心から尊敬しています。',
    'あなたの温かい心遣いが、施設全体に良い雰囲気を作り出しています。',
    '困難な状況でも前向きに取り組むあなたの姿勢は、みんなの手本です。',
    '今日も安全で快適な環境作りをありがとうございます。',
    'あなたの細やかな配慮が、利用者の日々の安心につながっています。',
    '一人ひとりに寄り添うあなたの姿勢は、真のプロフェッショナルです。',
    '今日も元気に頑張りましょう！あなたの力が必要です。',
    'あなたの笑顔と優しさが、この場所を特別な場所にしています。',
    '日々の努力が積み重なって、大きな成果となって現れています。',
    '今日もお疲れさまです。あなたのおかげで、多くの方が安心して過ごせています。',
    '困ったときは一人で抱え込まず、チーム一丸となって乗り越えましょう。',
    'あなたの経験と知識が、後輩スタッフの成長を支えています。',
    '利用者の小さな変化に気づくあなたの観察力は、本当に素晴らしいです。',
    '今日も新しい発見があることを願っています。学び続ける姿勢が素敵です。',
    'あなたの頑張りは必ず誰かの役に立っています。自信を持ってください。',
    '忙しい中でも心を込めて働くあなたに、深く感謝しています。',
    '今日という日を大切に、一つ一つの瞬間を大事にしていきましょう。',
    'あなたの仕事に対する情熱が、周りの人たちにも良い影響を与えています。',
    '利用者の方々の笑顔を見るとき、あなたの努力が報われていることを感じます。',
    '今日も一日、あなたらしく輝いて過ごしてください。応援しています！'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ランダムなねぎらいメッセージを選択（即座に表示）
        const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
        setEncouragementMessage(encouragementMessages[randomIndex]);
        
        // 基本的なロード完了
        setLoading(false);
        
        // データは非同期で取得（UIはすぐ表示）
        setTimeout(async () => {
          try {
            // 必要最小限のデータのみ取得
            const [todayShifts, diariesData] = await Promise.all([
              // 今日のシフトのみ取得（月全体ではなく）
              getShifts(todayString), 
              getSupportDiaries(todayString),
            ]);

            setShifts(todayShifts);
            setTodayDiaries(diariesData);
          } catch (error) {
            console.error('Error fetching dashboard data:', error);
          }
        }, 100);
      } catch (error) {
        console.error('Error in dashboard initialization:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [todayString]);

  // 今月のカレンダーデータを生成
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 自分のシフトのみ表示（スタッフの場合）
  const displayShifts = userRole === 'staff' 
    ? shifts.filter(shift => shift.userId === user?.uid)
    : shifts;

  // 今日の自分のシフトを取得
  const todayShift = displayShifts.find(
    shift => shift.date === todayString && shift.userId === user?.uid
  );

  const getShiftSymbolForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return displayShifts.find(shift => shift.date === dateString)?.symbol || '';
  };

  const getShiftColor = (symbol: string) => {
    if (symbol.includes('夜勤')) return 'bg-purple-100 text-purple-800';
    if (symbol === '希望休') return 'bg-red-100 text-red-800';
    if (symbol === '') return 'bg-red-50 border border-red-200 text-red-600';
    return 'bg-blue-100 text-blue-800';
  };

  const quickStats = [
    {
      title: '今日の支援日誌',
      value: todayDiaries.length.toString(),
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '今日のシフト',
      value: todayShift ? '1' : '0',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'ユーザー',
      value: user ? '1' : '0',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'ステータス',
      value: 'OK',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* ウェルカムメッセージ */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="h-12 w-12 rounded-full border-2 border-white"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">
                おはようございます、{user?.displayName}さん
              </h1>
              <p className="text-white text-opacity-90">
                {format(today, 'yyyy年MM月dd日（E）', { locale: ja })}
              </p>
              {todayShift && (
                <p className="text-white text-opacity-90 text-sm">
                  今日のシフト: {todayShift.symbol}
                  {todayShift.startTime && todayShift.endTime && 
                    ` (${todayShift.startTime} - ${todayShift.endTime})`
                  }
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ねぎらいメッセージ */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Heart className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">今日のメッセージ</h3>
              <p className="text-gray-700">{encouragementMessage}</p>
            </div>
          </div>
        </div>

        {/* クイック統計 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className={`${stat.bgColor} rounded-lg p-4`}>
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.title}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 今日のシフト情報（簡素化） */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              今日のシフト情報
            </h2>
            {todayShift ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">シフト: {todayShift.symbol}</div>
                    {todayShift.startTime && todayShift.endTime && (
                      <div className="text-sm text-gray-500">
                        時間: {todayShift.startTime} - {todayShift.endTime}
                      </div>
                    )}
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <a
                    href={userRole === 'staff' ? '/my-shift' : '/shifts'}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    シフト管理
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">今日のシフトが未登録です</p>
                <a
                  href={userRole === 'staff' ? '/my-shift' : '/shifts'}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
                >
                  シフト管理
                </a>
              </div>
            )}
          </div>

          {/* 今日の支援日誌 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">今日の支援日誌</h2>
              <a
                href="/support-diary/new"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                新規作成
              </a>
            </div>
            {todayDiaries.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">今日の支援日誌はまだ作成されていません</p>
                <a
                  href="/support-diary/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
                >
                  支援日誌を作成
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {todayDiaries.slice(0, 3).map((diary) => (
                  <div
                    key={diary.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{diary.clientName}</div>
                      <div className="text-sm text-gray-500">
                        担当: {diary.staffName}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(diary.createdAt.toDate(), 'HH:mm')}
                    </div>
                  </div>
                ))}
                {todayDiaries.length > 3 && (
                  <div className="text-center">
                    <a
                      href="/support-diary"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      すべて見る ({todayDiaries.length}件)
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* クイックアクション */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">クイックアクション</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/support-diary/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">支援日誌作成</div>
                <div className="text-sm text-gray-500">新しい支援日誌を作成</div>
              </div>
            </a>
            <a
              href="/work-diary"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ClipboardList className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">業務日誌</div>
                <div className="text-sm text-gray-500">今日の業務を記録</div>
              </div>
            </a>
            <a
              href="/communication"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">連絡帳</div>
                <div className="text-sm text-gray-500">家族との連絡</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}