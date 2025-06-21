'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { AuthGuard } from '@/components/auth-guard';
import { getMessageTemplates } from '@/lib/firestore';
import { MessageTemplate } from '@/types';
import { 
  Settings, 
  MessageSquare, 
  Save, 
  Plus,
  Edit,
  Trash2,
  Building,
  Bell,
  Shield,
  Database
} from 'lucide-react';

export default function SettingsPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    content: '',
    category: 'general' as 'general' | 'emergency' | 'routine'
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templatesData = await getMessageTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // テンプレート作成機能は開発中
      console.log('Save template:', newTemplate);
      alert('テンプレート保存機能は開発中です。');
      setNewTemplate({ title: '', content: '', category: 'general' });
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'general': return '一般';
      case 'emergency': return '緊急';
      case 'routine': return '日常';
      default: return '不明';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'routine': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'templates', label: 'メッセージテンプレート', icon: MessageSquare },
    { id: 'facility', label: '施設設定', icon: Building },
    { id: 'notifications', label: '通知設定', icon: Bell },
    { id: 'security', label: 'セキュリティ', icon: Shield },
    { id: 'system', label: 'システム設定', icon: Database },
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
    <AuthGuard requiredRole="admin">
      <Layout>
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Settings className="h-6 w-6 mr-2" />
                システム設定
              </h1>
              <p className="text-gray-600">アプリケーションの設定と管理</p>
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* メッセージテンプレートタブ */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              {/* 新規テンプレート作成 */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">新規テンプレート作成</h2>
                <form onSubmit={handleSaveTemplate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">タイトル</label>
                      <input
                        type="text"
                        value={newTemplate.title}
                        onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">カテゴリ</label>
                      <select
                        value={newTemplate.category}
                        onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value as any })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="general">一般</option>
                        <option value="emergency">緊急</option>
                        <option value="routine">日常</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">内容</label>
                    <textarea
                      value={newTemplate.content}
                      onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      テンプレート保存
                    </button>
                  </div>
                </form>
              </div>

              {/* テンプレート一覧 */}
              <div className="bg-white rounded-lg border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">登録テンプレート一覧</h2>
                </div>
                <div className="p-6">
                  {templates.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">テンプレートが登録されていません</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-gray-900">{template.message.substring(0, 30)}...</h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(template.category)}`}>
                              {getCategoryLabel(template.category)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{template.message}</p>
                          <div className="flex justify-end space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 施設設定タブ */}
          {activeTab === 'facility' && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">施設情報設定</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">施設名</label>
                    <input
                      type="text"
                      defaultValue="ほっこり福祉会"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">連絡先電話番号</label>
                    <input
                      type="tel"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">住所</label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
                    <input
                      type="email"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                    <Save className="h-4 w-4 mr-2" />
                    設定を保存
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* その他のタブは開発中表示 */}
          {activeTab !== 'templates' && activeTab !== 'facility' && (
            <div className="bg-white rounded-lg border p-6">
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">開発中</h3>
                <p className="text-gray-500">この機能は現在開発中です。</p>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}