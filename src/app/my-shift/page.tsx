'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/components/providers';
import { getShiftsByUser } from '@/lib/firestore';
import { Shift } from '@/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  Calendar, 
  Clock,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';

export default function MyShiftPage() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = format(currentDate, 'yyyy-MM');

  useEffect(() => {
    const fetchShifts = async () => {
      if (!user) return;
      
      try {
        const myShifts = await getShiftsByUser(user.uid, currentMonth);
        setShifts(myShifts);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [currentMonth, user]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getShiftForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return shifts.find(shift => shift.date === dateString);
  };

  const getShiftColor = (symbol: string) => {
    if (symbol.includes('夜勤')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (symbol === '希望休') return 'bg-red-100 text-red-800 border-red-200';
    if (symbol === '') return 'bg-gray-50 text-gray-500 border-gray-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getShiftTime = (shift: Shift) => {
    if (shift.startTime && shift.endTime) {
      return `${shift.startTime.substring(0, 5)}-${shift.endTime.substring(0, 5)}`;
    }
    if (shift.startTime) {
      return `${shift.startTime.substring(0, 5)}~`;
    }
    return '';
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getWeekDay = (date: Date) => {
    const day = getDay(date);
    return ['日', '月', '火', '水', '木', '金', '土'][day];
  };

  const isWeekend = (date: Date) => {
    const day = getDay(date);
    return day === 0 || day === 6;
  };

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
    <AuthGuard requiredRole="staff">
      <Layout>
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <User className="h-6 w-6 mr-2" />
                マイシフト
              </h1>
              <p className="text-gray-600">自分のシフト表確認</p>
            </div>
          </div>

          {/* 統計 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-gray-900">{shifts.length}</div>
                  <div className="text-sm text-gray-600">今月のシフト</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {shifts.filter(s => s.symbol.includes('夜勤')).length}
                  </div>
                  <div className="text-sm text-gray-600">夜勤シフト</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <User className="h-8 w-8 text-red-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {shifts.filter(s => s.symbol === '希望休').length}
                  </div>
                  <div className="text-sm text-gray-600">希望休</div>
                </div>
              </div>
            </div>
          </div>

          {/* シフトカレンダー */}
          <div className="bg-white rounded-lg border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {format(currentDate, 'yyyy年MM月', { locale: ja })}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-md"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-md"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {/* 曜日ヘッダー */}
                {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                  <div key={day} className={`bg-gray-50 p-2 text-center text-sm font-medium ${
                    index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {day}
                  </div>
                ))}
                
                {/* 日付セル */}
                {monthDays.map((date) => {
                  const shift = getShiftForDate(date);
                  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  const weekend = isWeekend(date);
                  
                  return (
                    <div
                      key={date.toISOString()}
                      className={`bg-white p-3 min-h-[120px] ${
                        isToday ? 'ring-2 ring-primary-500 bg-primary-50' : ''
                      }`}
                    >
                      <div className={`text-sm font-medium mb-2 ${
                        weekend ? (getDay(date) === 0 ? 'text-red-600' : 'text-blue-600') : 'text-gray-900'
                      }`}>
                        {format(date, 'd')}
                      </div>
                      
                      {shift && (
                        <div className={`text-xs px-2 py-1 rounded border ${getShiftColor(shift.symbol)}`}>
                          <div className="font-medium">{shift.symbol}</div>
                          {getShiftTime(shift) && (
                            <div className="mt-1">{getShiftTime(shift)}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 今月のシフト一覧 */}
          <div className="bg-white rounded-lg border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">今月のシフト詳細</h2>
            </div>
            <div className="p-6">
              {shifts.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">今月のシフトがありません</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {shifts
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((shift) => (
                      <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium text-gray-900">
                            {format(new Date(shift.date), 'M月d日(E)', { locale: ja })}
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getShiftColor(shift.symbol)}`}>
                            {shift.symbol}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {getShiftTime(shift)}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* 凡例 */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">シフト凡例</h3>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded mr-2"></div>
                一般シフト
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded mr-2"></div>
                夜勤
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 border border-red-200 rounded mr-2"></div>
                希望休
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary-50 border-2 border-primary-500 rounded mr-2"></div>
                今日
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}