'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import { useAuth } from '@/components/providers';
import { createSupportDiary } from '@/lib/firestore';
import { SupportDiaryFormData } from '@/types';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { Save, ArrowLeft } from 'lucide-react';

export default function NewSupportDiaryPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SupportDiaryFormData>({
    clientId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    wakeUpTime: '',
    bedTime: '',
    sleepQuality: 'good',
    breakfastIntake: 'full',
    breakfastNotes: '',
    lunchIntake: 'full',
    lunchNotes: '',
    dinnerIntake: 'full',
    dinnerNotes: '',
    urinationFrequency: 0,
    urinationNotes: '',
    defecationFrequency: 0,
    defecationCondition: 'normal',
    defecationNotes: '',
    temperature: 36.5,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    pulse: 70,
    vitalNotes: '',
    activities: '',
    mood: 'good',
    socialInteraction: '',
    specialNotes: '',
  });

  const { user } = useAuth();
  const router = useRouter();

  // 仮の利用者リスト（実際はFirestoreから取得）
  const clients = [
    { id: '1', name: '田中太郎' },
    { id: '2', name: '佐藤花子' },
    { id: '3', name: '山田次郎' },
  ];

  const handleInputChange = (field: keyof SupportDiaryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const selectedClient = clients.find(c => c.id === formData.clientId);
      if (!selectedClient) {
        alert('利用者を選択してください');
        return;
      }

      const diaryData = {
        clientId: formData.clientId,
        clientName: selectedClient.name,
        date: formData.date,
        staffId: user.uid,
        staffName: user.displayName || user.email || '',
        
        wakeUpTime: formData.wakeUpTime || undefined,
        bedTime: formData.bedTime || undefined,
        sleepQuality: formData.sleepQuality,
        
        breakfast: {
          intake: formData.breakfastIntake,
          notes: formData.breakfastNotes || undefined,
        },
        lunch: {
          intake: formData.lunchIntake,
          notes: formData.lunchNotes || undefined,
        },
        dinner: {
          intake: formData.dinnerIntake,
          notes: formData.dinnerNotes || undefined,
        },
        
        urination: {
          frequency: formData.urinationFrequency,
          notes: formData.urinationNotes || undefined,
        },
        defecation: {
          frequency: formData.defecationFrequency,
          condition: formData.defecationCondition,
          notes: formData.defecationNotes || undefined,
        },
        
        vitalSigns: {
          temperature: formData.temperature,
          bloodPressure: {
            systolic: formData.bloodPressureSystolic,
            diastolic: formData.bloodPressureDiastolic,
          },
          pulse: formData.pulse,
          notes: formData.vitalNotes || undefined,
        },
        
        activities: formData.activities || undefined,
        mood: formData.mood,
        socialInteraction: formData.socialInteraction || undefined,
        specialNotes: formData.specialNotes || undefined,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await createSupportDiary(diaryData);
      router.push('/support-diary');
    } catch (error) {
      console.error('Error creating support diary:', error);
      alert('支援日誌の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">支援日誌 - 新規作成</h1>
            <p className="text-gray-600">利用者の1日の様子を記録してください</p>
          </div>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">基本情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  利用者 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => handleInputChange('clientId', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  日付 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 起床・就寝 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">起床・就寝</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  起床時間
                </label>
                <input
                  type="time"
                  value={formData.wakeUpTime}
                  onChange={(e) => handleInputChange('wakeUpTime', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  就寝時間
                </label>
                <input
                  type="time"
                  value={formData.bedTime}
                  onChange={(e) => handleInputChange('bedTime', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  睡眠の質
                </label>
                <select
                  value={formData.sleepQuality}
                  onChange={(e) => handleInputChange('sleepQuality', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="good">良好</option>
                  <option value="fair">普通</option>
                  <option value="poor">不良</option>
                </select>
              </div>
            </div>
          </div>

          {/* 食事 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">食事</h2>
            <div className="space-y-4">
              {[
                { key: 'breakfast', label: '朝食', intakeKey: 'breakfastIntake', notesKey: 'breakfastNotes' },
                { key: 'lunch', label: '昼食', intakeKey: 'lunchIntake', notesKey: 'lunchNotes' },
                { key: 'dinner', label: '夕食', intakeKey: 'dinnerIntake', notesKey: 'dinnerNotes' },
              ].map((meal) => (
                <div key={meal.key} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {meal.label}摂取量
                    </label>
                    <select
                      value={formData[meal.intakeKey as keyof SupportDiaryFormData] as string}
                      onChange={(e) => handleInputChange(meal.intakeKey as keyof SupportDiaryFormData, e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="full">完食</option>
                      <option value="half">半分</option>
                      <option value="little">少量</option>
                      <option value="none">摂取なし</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {meal.label}メモ
                    </label>
                    <input
                      type="text"
                      value={formData[meal.notesKey as keyof SupportDiaryFormData] as string}
                      onChange={(e) => handleInputChange(meal.notesKey as keyof SupportDiaryFormData, e.target.value)}
                      placeholder="特記事項があれば入力"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 排泄 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">排泄</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    排尿回数
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.urinationFrequency}
                    onChange={(e) => handleInputChange('urinationFrequency', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    排尿メモ
                  </label>
                  <input
                    type="text"
                    value={formData.urinationNotes}
                    onChange={(e) => handleInputChange('urinationNotes', e.target.value)}
                    placeholder="特記事項があれば入力"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    排便回数
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.defecationFrequency}
                    onChange={(e) => handleInputChange('defecationFrequency', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    便の状態
                  </label>
                  <select
                    value={formData.defecationCondition}
                    onChange={(e) => handleInputChange('defecationCondition', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="normal">普通</option>
                    <option value="soft">軟便</option>
                    <option value="hard">硬便</option>
                    <option value="loose">下痢</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    排便メモ
                  </label>
                  <input
                    type="text"
                    value={formData.defecationNotes}
                    onChange={(e) => handleInputChange('defecationNotes', e.target.value)}
                    placeholder="特記事項があれば入力"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* バイタル */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">バイタルサイン</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  体温 (℃)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="45"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 36.5)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  収縮期血圧
                </label>
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={formData.bloodPressureSystolic}
                  onChange={(e) => handleInputChange('bloodPressureSystolic', parseInt(e.target.value) || 120)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  拡張期血圧
                </label>
                <input
                  type="number"
                  min="30"
                  max="150"
                  value={formData.bloodPressureDiastolic}
                  onChange={(e) => handleInputChange('bloodPressureDiastolic', parseInt(e.target.value) || 80)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  脈拍 (回/分)
                </label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  value={formData.pulse}
                  onChange={(e) => handleInputChange('pulse', parseInt(e.target.value) || 70)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                バイタルメモ
              </label>
              <input
                type="text"
                value={formData.vitalNotes}
                onChange={(e) => handleInputChange('vitalNotes', e.target.value)}
                placeholder="特記事項があれば入力"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 活動・様子 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">活動・様子</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  1日の活動内容
                </label>
                <textarea
                  value={formData.activities}
                  onChange={(e) => handleInputChange('activities', e.target.value)}
                  rows={3}
                  placeholder="どのような活動を行ったか、様子はどうだったかを記録してください"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    気分・様子
                  </label>
                  <select
                    value={formData.mood}
                    onChange={(e) => handleInputChange('mood', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="good">良好</option>
                    <option value="fair">普通</option>
                    <option value="anxious">不安</option>
                    <option value="irritable">イライラ</option>
                    <option value="depressed">落ち込み</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    社会的交流
                  </label>
                  <input
                    type="text"
                    value={formData.socialInteraction}
                    onChange={(e) => handleInputChange('socialInteraction', e.target.value)}
                    placeholder="他の利用者やスタッフとの関わりなど"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  特記事項
                </label>
                <textarea
                  value={formData.specialNotes}
                  onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                  rows={3}
                  placeholder="その他、特に記録しておきたい事項があれば入力してください"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}