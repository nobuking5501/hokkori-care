'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { AuthGuard } from '@/components/auth-guard';
import { getUsers, getMessageTemplates } from '@/lib/firestore';
import { User, MessageTemplate } from '@/types';
import { 
  MessageSquare, 
  Send, 
  Users,
  Plus,
  Search,
  Mail,
  Calendar,
  Bell,
  Filter,
  Download
} from 'lucide-react';

export default function CommunicationPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('send');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [message, setMessage] = useState({
    subject: '',
    content: '',
    template: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, templatesData] = await Promise.all([
          getUsers(),
          getMessageTemplates()
        ]);
        setUsers(usersData);
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Send message:', { ...message, recipients: selectedUsers });
      alert('メッセージ送信機能は開発中です。');
      setMessage({ subject: '', content: '', template: '', priority: 'normal' });
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessage({
        ...message,
        subject: template.message,
        content: template.message,
        template: templateId
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return '低';
      case 'normal': return '通常';
      case 'high': return '高';
      case 'urgent': return '至急';
      default: return '通常';
    }
  };

  const tabs = [
    { id: 'send', label: 'メッセージ送信', icon: Send },
    { id: 'history', label: '送信履歴', icon: Calendar },
    { id: 'notifications', label: '通知設定', icon: Bell },
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
    <AuthGuard requiredRole="manager">
      <Layout>
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="h-6 w-6 mr-2" />
                連絡・コミュニケーション
              </h1>
              <p className="text-gray-600">スタッフ間の連絡とメッセージ管理</p>
            </div>
          </div>

          {/* 統計 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                  <div className="text-sm text-gray-600">登録ユーザー</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-gray-900">{templates.length}</div>
                  <div className="text-sm text-gray-600">テンプレート</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">今日の送信</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-red-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">未読通知</div>
                </div>
              </div>
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

          {/* メッセージ送信タブ */}
          {activeTab === 'send' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 宛先選択 */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">宛先選択</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <label key={user.uid} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.uid)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.uid]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.uid));
                          }
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center">
                        {user.photoURL ? (
                          <img className="h-6 w-6 rounded-full" src={user.photoURL} alt="" />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                            <Users className="h-3 w-3 text-gray-600" />
                          </div>
                        )}
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
                          <div className="text-xs text-gray-500">{user.role}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  選択中: {selectedUsers.length}名
                </div>
              </div>

              {/* メッセージ作成 */}
              <div className="lg:col-span-2 bg-white rounded-lg border p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">メッセージ作成</h2>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">テンプレート</label>
                      <select
                        value={message.template}
                        onChange={(e) => handleTemplateSelect(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">テンプレートを選択</option>
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.message}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">優先度</label>
                      <select
                        value={message.priority}
                        onChange={(e) => setMessage({ ...message, priority: e.target.value as any })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="low">低</option>
                        <option value="normal">通常</option>
                        <option value="high">高</option>
                        <option value="urgent">至急</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">件名</label>
                    <input
                      type="text"
                      value={message.subject}
                      onChange={(e) => setMessage({ ...message, subject: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">メッセージ内容</label>
                    <textarea
                      value={message.content}
                      onChange={(e) => setMessage({ ...message, content: e.target.value })}
                      rows={8}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(message.priority)}`}>
                      優先度: {getPriorityLabel(message.priority)}
                    </span>
                    <button
                      type="submit"
                      disabled={selectedUsers.length === 0}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      送信 ({selectedUsers.length}名)
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* その他のタブは開発中表示 */}
          {activeTab !== 'send' && (
            <div className="bg-white rounded-lg border p-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
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