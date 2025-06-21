'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout } from '@/components/layout';
import { AuthGuard } from '@/components/auth-guard';
import { ShiftCalendar } from '@/components/shift-calendar';
import { getShifts, getUsers, createShift, updateShift, deleteShift } from '@/lib/firestore';
import { Shift, User } from '@/types';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { ja } from 'date-fns/locale';
import { 
  Calendar, 
  Plus, 
  Users,
  Clock
} from 'lucide-react';

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddShift, setShowAddShift] = useState(false);
  const [newShift, setNewShift] = useState({
    userId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    symbol: '',
    startTime: '',
    endTime: '',
    notes: ''
  });
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const currentMonth = format(currentDate, 'yyyy-MM');

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        // 最小限のデータを並列取得（ユーザーは一度だけ）
        const shiftsData = await getShifts(currentMonth);
        if (users.length === 0) {
          const usersData = await getUsers();
          if (isMounted) {
            setUsers(usersData);
          }
        }
        
        if (!isMounted) return;
        
        setShifts(shiftsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [currentMonth, users.length]);

  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShift.userId || !newShift.date || !newShift.symbol) {
      alert('必須項目を入力してください。');
      return;
    }

    try {
      const user = users.find(u => u.uid === newShift.userId);
      const shiftData = {
        userId: newShift.userId,
        userName: user?.displayName || '',
        date: newShift.date,
        month: format(new Date(newShift.date), 'yyyy-MM'),
        symbol: newShift.symbol as any,
        startTime: newShift.startTime || '',
        endTime: newShift.endTime || '',
        isHoliday: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const newShiftId = await createShift(shiftData);
      
      // 楽観的更新（即座にUIを更新）
      const newShiftWithId = { ...shiftData, id: newShiftId, createdAt: new Date() as any, updatedAt: new Date() as any };
      setShifts(prev => [...prev, newShiftWithId]);
      
      setShowAddShift(false);
      setNewShift({
        userId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        symbol: '',
        startTime: '',
        endTime: '',
        notes: ''
      });
      
      alert('シフトが追加されました。');
    } catch (error) {
      console.error('Error creating shift:', error);
      alert('シフトの追加に失敗しました。');
    }
  };

  const handleEditShift = useCallback((shift: Shift) => {
    setEditingShift(shift);
    setShowEditModal(true);
  }, []);

  const handleCellClick = useCallback((date: Date, userId: string) => {
    setSelectedDate(date);
    setSelectedUserId(userId);
    setNewShift({
      userId: userId,
      date: format(date, 'yyyy-MM-dd'),
      symbol: '',
      startTime: '',
      endTime: '',
      notes: ''
    });
    setShowAddShift(true);
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const handleShiftDelete = useCallback(async (shiftId: string) => {
    if (!confirm('このシフトを削除しますか？')) return;

    try {
      await deleteShift(shiftId);
      // 楽観的更新（即座にUIを更新）
      setShifts(prev => prev.filter(shift => shift.id !== shiftId));
    } catch (error) {
      console.error('Error deleting shift:', error);
      alert('シフトの削除に失敗しました。');
      // エラー時は再取得
      const updatedShifts = await getShifts(currentMonth);
      setShifts(updatedShifts);
    }
  }, [currentMonth]);

  const handleUpdateShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShift) return;

    try {
      await updateShift(editingShift.id, {
        symbol: editingShift.symbol,
        startTime: editingShift.startTime,
        endTime: editingShift.endTime,
      });

      // 楽観的更新（即座にUIを更新）
      setShifts(prev => prev.map(shift => 
        shift.id === editingShift.id 
          ? { ...shift, symbol: editingShift.symbol, startTime: editingShift.startTime, endTime: editingShift.endTime }
          : shift
      ));

      setShowEditModal(false);
      setEditingShift(null);
      alert('シフトが更新されました。');
    } catch (error) {
      console.error('Error updating shift:', error);
      alert('シフトの更新に失敗しました。');
      // エラー時は再取得
      const updatedShifts = await getShifts(currentMonth);
      setShifts(updatedShifts);
    }
  };


  // 高速ローディング表示
  if (loading && shifts.length === 0) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                シフト管理
              </h1>
              <p className="text-gray-600">読み込み中...</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-8">
            <div className="flex items-center justify-center">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-300 h-6 w-6"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <AuthGuard requiredRole="manager">
      <Layout>
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                シフト管理
              </h1>
              <p className="text-gray-600">スタッフのシフト表作成と管理</p>
            </div>
            <button
              onClick={() => setShowAddShift(!showAddShift)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              シフト追加
            </button>
          </div>

          {/* 統計 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                  <div className="text-sm text-gray-600">登録スタッフ</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
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
                <Users className="h-8 w-8 text-red-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {shifts.filter(s => s.symbol === '希望休').length}
                  </div>
                  <div className="text-sm text-gray-600">希望休</div>
                </div>
              </div>
            </div>
          </div>

          {/* 新規シフト追加フォーム */}
          {showAddShift && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">新規シフト追加</h2>
              <form onSubmit={handleAddShift} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">スタッフ</label>
                    <select
                      value={newShift.userId}
                      onChange={(e) => setNewShift({ ...newShift, userId: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">スタッフを選択</option>
                      {users.map((user) => (
                        <option key={user.uid} value={user.uid}>
                          {user.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">日付</label>
                    <input
                      type="date"
                      value={newShift.date}
                      onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">シフト種別</label>
                    <select
                      value={newShift.symbol}
                      onChange={(e) => setNewShift({ ...newShift, symbol: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">種別を選択</option>
                      <option value="早番">早番</option>
                      <option value="遅番">遅番</option>
                      <option value="夜勤">夜勤</option>
                      <option value="日勤">日勤</option>
                      <option value="希望休">希望休</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">開始時間</label>
                    <input
                      type="time"
                      value={newShift.startTime}
                      onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">終了時間</label>
                    <input
                      type="time"
                      value={newShift.endTime}
                      onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">備考</label>
                    <input
                      type="text"
                      value={newShift.notes}
                      onChange={(e) => setNewShift({ ...newShift, notes: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="備考（任意）"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddShift(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    追加
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* カレンダー */}
          <ShiftCalendar
            currentDate={currentDate}
            onDateChange={handleDateChange}
            shifts={shifts}
            users={users}
            onShiftClick={handleEditShift}
            onCellClick={handleCellClick}
            onShiftDelete={handleShiftDelete}
          />

          {/* シフト編集モーダル */}
          {showEditModal && editingShift && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-medium text-gray-900 mb-4">シフト編集</h2>
                <form onSubmit={handleUpdateShift} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">スタッフ</label>
                    <input
                      type="text"
                      value={editingShift.userName}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">日付</label>
                    <input
                      type="date"
                      value={editingShift.date}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">シフト種別</label>
                    <select
                      value={editingShift.symbol}
                      onChange={(e) => setEditingShift({ ...editingShift, symbol: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">種別を選択</option>
                      <option value="早番">早番</option>
                      <option value="遅番">遅番</option>
                      <option value="夜勤">夜勤</option>
                      <option value="日勤">日勤</option>
                      <option value="希望休">希望休</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">開始時間</label>
                    <input
                      type="time"
                      value={editingShift.startTime || ''}
                      onChange={(e) => setEditingShift({ ...editingShift, startTime: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">終了時間</label>
                    <input
                      type="time"
                      value={editingShift.endTime || ''}
                      onChange={(e) => setEditingShift({ ...editingShift, endTime: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      更新
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </Layout>
    </AuthGuard>
  );
}