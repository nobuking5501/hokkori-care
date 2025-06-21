'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { useAuth } from '@/components/providers';
import { getSupportDiaries } from '@/lib/firestore';
import { SupportDiary } from '@/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Plus, Search, Calendar } from 'lucide-react';

export default function SupportDiaryPage() {
  const [diaries, setDiaries] = useState<SupportDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const fetchedDiaries = await getSupportDiaries(selectedDate);
        setDiaries(fetchedDiaries);
      } catch (error) {
        console.error('Error fetching support diaries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [selectedDate]);

  const filteredDiaries = diaries.filter(diary =>
    diary.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    diary.staffName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewDiary = () => {
    window.location.href = '/support-diary/new';
  };

  const handleEditDiary = (diaryId: string) => {
    window.location.href = `/support-diary/${diaryId}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">支援日誌</h1>
            <p className="text-gray-600">利用者の日々の様子を記録します</p>
          </div>
          <button
            onClick={handleNewDiary}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            新規作成
          </button>
        </div>

        {/* フィルター */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* 日付選択 */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* 検索 */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="利用者名またはスタッフ名で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* 日誌一覧 */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">読み込み中...</p>
            </div>
          ) : filteredDiaries.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                {searchQuery ? '検索結果が見つかりません' : 'この日の支援日誌はまだ作成されていません'}
              </p>
              <button
                onClick={handleNewDiary}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                支援日誌を作成
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredDiaries.map((diary) => (
                <div
                  key={diary.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleEditDiary(diary.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {diary.clientName}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {diary.staffName}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                        <span>
                          {format(new Date(diary.date), 'yyyy年MM月dd日', { locale: ja })}
                        </span>
                        {diary.mood && (
                          <span className="flex items-center">
                            気分: {diary.mood === 'good' ? '良好' : 
                                  diary.mood === 'fair' ? '普通' :
                                  diary.mood === 'anxious' ? '不安' :
                                  diary.mood === 'irritable' ? 'イライラ' : '落ち込み'}
                          </span>
                        )}
                        {diary.activities && (
                          <span className="truncate">
                            活動: {diary.activities.substring(0, 50)}...
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">
                        {format(diary.createdAt.toDate(), 'HH:mm')}
                      </span>
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}