'use client';

import { useState, memo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, getDay, isSameMonth, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { Shift, User } from '@/types';

interface ShiftCalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  shifts: Shift[];
  users: User[];
  onShiftClick: (shift: Shift) => void;
  onCellClick: (date: Date, userId: string) => void;
  onShiftDelete: (shiftId: string) => void;
}

function ShiftCalendarComponent({
  currentDate,
  onDateChange,
  shifts,
  users,
  onShiftClick,
  onCellClick,
  onShiftDelete
}: ShiftCalendarProps) {
  const [selectedUser, setSelectedUser] = useState<string>('all');

  // 最小限の計算のみ
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // シンプルなフィルタリング
  const filteredUsers = selectedUser === 'all' ? users : users.filter(user => user.uid === selectedUser);

  // シンプルなシフト検索
  const getShiftsForDate = (date: Date, userId: string) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return shifts.filter(shift => shift.date === dateString && shift.userId === userId);
  };

  const getShiftColor = (symbol: string) => {
    if (symbol.includes('夜勤')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (symbol === '希望休') return 'bg-red-100 text-red-800 border-red-200';
    if (symbol === '') return 'bg-gray-50 text-gray-500 border-gray-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const previousMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="bg-white rounded-lg border">
      {/* ヘッダー */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            {format(currentDate, 'yyyy年MM月', { locale: ja })} シフトカレンダー
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* スタッフフィルター */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">表示:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">全スタッフ</option>
            {users.map((user) => (
              <option key={user.uid} value={user.uid}>
                {user.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* カレンダーグリッド */}
      <div className="p-6">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 mb-2">
          {weekdays.map((day, index) => (
            <div key={day} className={`text-center text-sm font-medium py-2 ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {day}
            </div>
          ))}
        </div>

        {/* カレンダー本体 */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date) => {
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isToday = isSameDay(date, today);
            const dayOfWeek = getDay(date);
            
            return (
              <div
                key={date.toISOString()}
                className={`min-h-[120px] border border-gray-200 rounded-lg p-2 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'ring-2 ring-primary-500' : ''}`}
              >
                {/* 日付ヘッダー */}
                <div className={`text-sm font-medium mb-2 ${
                  isCurrentMonth 
                    ? dayOfWeek === 0 ? 'text-red-600' : dayOfWeek === 6 ? 'text-blue-600' : 'text-gray-900'
                    : 'text-gray-400'
                }`}>
                  {format(date, 'd')}
                </div>

                {/* シフト表示 */}
                <div className="space-y-1">
                  {filteredUsers.map((user) => {
                    const userShifts = getShiftsForDate(date, user.uid);
                    
                    return (
                      <div key={user.uid}>
                        {userShifts.length > 0 ? (
                          userShifts.map((shift) => (
                            <div
                              key={shift.id}
                              className={`group relative text-xs px-2 py-1 rounded border cursor-pointer hover:opacity-80 transition-opacity ${getShiftColor(shift.symbol)}`}
                              onClick={() => onShiftClick(shift)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate">
                                  {selectedUser === 'all' && (
                                    <span className="font-medium">{user.displayName.substring(0, 3)}</span>
                                  )}
                                  {selectedUser === 'all' && ' '}
                                  {shift.symbol}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onShiftDelete(shift.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 ml-1 text-red-600 hover:text-red-800 transition-opacity"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                              {shift.startTime && (
                                <div className="text-xs opacity-75">
                                  {shift.startTime.substring(0, 5)}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          selectedUser !== 'all' && isCurrentMonth && (
                            <div
                              className="text-xs text-gray-400 px-2 py-1 rounded border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => onCellClick(date, user.uid)}
                            >
                              <Plus className="h-3 w-3 mx-auto" />
                            </div>
                          )
                        )}
                      </div>
                    );
                  })}
                  
                  {/* 全スタッフ表示時の空きセルクリック */}
                  {selectedUser === 'all' && isCurrentMonth && (
                    <div
                      className="text-xs text-gray-400 px-2 py-1 rounded border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors opacity-0 hover:opacity-100"
                      onClick={() => onCellClick(date, '')}
                    >
                      <Plus className="h-3 w-3 mx-auto" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 凡例 */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded mr-2"></div>
            一般シフト
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded mr-2"></div>
            夜勤
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-2"></div>
            希望休
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white border-2 border-primary-500 rounded mr-2"></div>
            今日
          </div>
        </div>
      </div>
    </div>
  );
}

// メモ化されたコンポーネントをエクスポート
export const ShiftCalendar = memo(ShiftCalendarComponent);