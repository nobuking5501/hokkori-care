'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { AuthGuard } from '@/components/auth-guard';
import { getResidents, createResident, updateResident, deleteResident, getRooms, getResidentStatistics } from '@/lib/firestore-residents';
import { Resident, Room } from '@/types/resident';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Home,
  Clock,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertCircle,
  Bed,
  UserCheck
} from 'lucide-react';

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [filter, setFilter] = useState<'all' | 'stay-home' | 'day-service'>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'discharged' | 'all'>('active');
  
  const [formData, setFormData] = useState({
    name: '',
    displayCode: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: '',
    phoneNumber: '',
    roomNumber: '',
    contractType: 'stay-home' as 'stay-home' | 'day-service' | 'both',
    admissionDate: format(new Date(), 'yyyy-MM-dd'),
    allergies: '',
    medications: '',
    medicalHistory: '',
    disabilities: '',
    careLevel: '',
    
    // 家族連絡先（簡易版）
    familyName: '',
    familyRelationship: '',
    familyPhone: '',
    familyEmail: '',
    
    // 緊急連絡先
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      const [residentsData, roomsData, statsData] = await Promise.all([
        getResidents(statusFilter === 'all' ? undefined : statusFilter),
        getRooms(),
        getResidentStatistics()
      ]);
      
      setResidents(residentsData);
      setRooms(roomsData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const residentData = {
        name: formData.name,
        displayCode: formData.displayCode,
        dateOfBirth: formData.dateOfBirth,
        age: new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear(),
        gender: formData.gender,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        admissionDate: formData.admissionDate,
        roomNumber: formData.roomNumber,
        contractType: formData.contractType,
        medicalInfo: {
          allergies: formData.allergies.split(',').map(s => s.trim()).filter(s => s),
          medications: formData.medications.split(',').map(s => s.trim()).filter(s => s),
          medicalHistory: formData.medicalHistory.split(',').map(s => s.trim()).filter(s => s),
          disabilities: formData.disabilities.split(',').map(s => s.trim()).filter(s => s),
          careLevel: formData.careLevel || undefined,
        },
        familyContacts: formData.familyName ? [{
          id: '1',
          name: formData.familyName,
          relationship: formData.familyRelationship,
          phoneNumber: formData.familyPhone,
          email: formData.familyEmail || undefined,
          isPrimary: true,
          canReceiveNotifications: true,
        }] : [],
        emergencyContact: {
          name: formData.emergencyName,
          relationship: formData.emergencyRelationship,
          phoneNumber: formData.emergencyPhone,
        },
        status: 'active' as const,
        notes: formData.notes,
        createdBy: 'current-user', // TODO: 実際のユーザーIDを使用
      };

      if (editingResident) {
        await updateResident(editingResident.id, residentData);
      } else {
        await createResident(residentData);
      }

      await fetchData();
      resetForm();
      alert(editingResident ? '利用者情報を更新しました' : '利用者を追加しました');
    } catch (error) {
      console.error('Error saving resident:', error);
      alert('保存に失敗しました');
    }
  };

  const handleEdit = (resident: Resident) => {
    setEditingResident(resident);
    setFormData({
      name: resident.name,
      displayCode: resident.displayCode,
      dateOfBirth: resident.dateOfBirth,
      gender: resident.gender,
      address: resident.address,
      phoneNumber: resident.phoneNumber || '',
      roomNumber: resident.roomNumber,
      contractType: resident.contractType,
      admissionDate: resident.admissionDate,
      allergies: resident.medicalInfo.allergies.join(', '),
      medications: resident.medicalInfo.medications.join(', '),
      medicalHistory: resident.medicalInfo.medicalHistory.join(', '),
      disabilities: resident.medicalInfo.disabilities.join(', '),
      careLevel: resident.medicalInfo.careLevel || '',
      familyName: resident.familyContacts[0]?.name || '',
      familyRelationship: resident.familyContacts[0]?.relationship || '',
      familyPhone: resident.familyContacts[0]?.phoneNumber || '',
      familyEmail: resident.familyContacts[0]?.email || '',
      emergencyName: resident.emergencyContact.name,
      emergencyRelationship: resident.emergencyContact.relationship,
      emergencyPhone: resident.emergencyContact.phoneNumber,
      notes: resident.notes || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (residentId: string) => {
    if (!confirm('この利用者を削除しますか？')) return;
    
    try {
      await deleteResident(residentId);
      await fetchData();
      alert('利用者を削除しました');
    } catch (error) {
      console.error('Error deleting resident:', error);
      alert('削除に失敗しました');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      displayCode: '',
      dateOfBirth: '',
      gender: 'male',
      address: '',
      phoneNumber: '',
      roomNumber: '',
      contractType: 'stay-home',
      admissionDate: format(new Date(), 'yyyy-MM-dd'),
      allergies: '',
      medications: '',
      medicalHistory: '',
      disabilities: '',
      careLevel: '',
      familyName: '',
      familyRelationship: '',
      familyPhone: '',
      familyEmail: '',
      emergencyName: '',
      emergencyRelationship: '',
      emergencyPhone: '',
      notes: ''
    });
    setEditingResident(null);
    setShowAddModal(false);
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case 'stay-home': return '24時間ステイホーム';
      case 'day-service': return '放課後デイサービス';
      case 'both': return '両方';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'discharged': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResidents = residents.filter(resident => {
    if (filter === 'all') return true;
    if (filter === 'stay-home') return ['stay-home', 'both'].includes(resident.contractType);
    if (filter === 'day-service') return ['day-service', 'both'].includes(resident.contractType);
    return true;
  });

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
                <Users className="h-6 w-6 mr-2" />
                利用者管理
              </h1>
              <p className="text-gray-600">24時間ステイホーム・放課後デイサービス利用者の管理</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              新規利用者
            </button>
          </div>

          {/* 統計情報 */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-gray-900">{statistics.activeResidents}</div>
                    <div className="text-sm text-gray-600">利用者数</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center">
                  <Home className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-gray-900">{statistics.stayHomeUsers}</div>
                    <div className="text-sm text-gray-600">ステイホーム</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-gray-900">{statistics.dayServiceUsers}</div>
                    <div className="text-sm text-gray-600">デイサービス</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center">
                  <Bed className="h-8 w-8 text-orange-600" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-gray-900">{statistics.currentOccupancy}/{statistics.totalCapacity}</div>
                    <div className="text-sm text-gray-600">部屋利用状況</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* フィルター */}
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">サービス:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1"
              >
                <option value="all">すべて</option>
                <option value="stay-home">ステイホーム</option>
                <option value="day-service">デイサービス</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">状態:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1"
              >
                <option value="active">利用中</option>
                <option value="inactive">休止中</option>
                <option value="discharged">退所</option>
                <option value="all">すべて</option>
              </select>
            </div>
          </div>

          {/* 利用者一覧 */}
          <div className="bg-white rounded-lg border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                利用者一覧 ({filteredResidents.length}名)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      利用者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      コード
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      部屋
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      契約種別
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      緊急連絡先
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResidents.map((resident) => (
                    <tr key={resident.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{resident.name}</div>
                            <div className="text-sm text-gray-500">
                              {resident.age}歳 | 入所: {format(new Date(resident.admissionDate), 'yyyy/MM/dd')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {resident.displayCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {resident.roomNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getContractTypeLabel(resident.contractType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{resident.emergencyContact.name}</div>
                        <div className="text-sm text-gray-500">{resident.emergencyContact.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(resident.status)}`}>
                          {resident.status === 'active' ? '利用中' : resident.status === 'inactive' ? '休止中' : '退所'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(resident)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(resident.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 利用者追加・編集モーダル */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">
                    {editingResident ? '利用者情報編集' : '新規利用者登録'}
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 基本情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">氏名 *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">表示コード *</label>
                        <input
                          type="text"
                          value={formData.displayCode}
                          onChange={(e) => setFormData({ ...formData, displayCode: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="A, B, C等"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">生年月日 *</label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">性別 *</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="male">男性</option>
                          <option value="female">女性</option>
                          <option value="other">その他</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">部屋番号 *</label>
                        <select
                          value={formData.roomNumber}
                          onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="">部屋を選択</option>
                          {rooms.map((room) => (
                            <option key={room.id} value={room.roomNumber}>
                              {room.roomNumber} ({room.currentOccupancy}/{room.capacity})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">契約種別 *</label>
                        <select
                          value={formData.contractType}
                          onChange={(e) => setFormData({ ...formData, contractType: e.target.value as any })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="stay-home">24時間ステイホーム</option>
                          <option value="day-service">放課後デイサービス</option>
                          <option value="both">両方</option>
                        </select>
                      </div>
                    </div>

                    {/* 連絡先情報 */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">連絡先情報</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">住所</label>
                          <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">電話番号</label>
                          <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 家族連絡先 */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">家族連絡先</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">家族氏名</label>
                          <input
                            type="text"
                            value={formData.familyName}
                            onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">続柄</label>
                          <input
                            type="text"
                            value={formData.familyRelationship}
                            onChange={(e) => setFormData({ ...formData, familyRelationship: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="父、母、兄弟等"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">家族電話番号</label>
                          <input
                            type="tel"
                            value={formData.familyPhone}
                            onChange={(e) => setFormData({ ...formData, familyPhone: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">家族メールアドレス</label>
                          <input
                            type="email"
                            value={formData.familyEmail}
                            onChange={(e) => setFormData({ ...formData, familyEmail: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 緊急連絡先 */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">緊急連絡先</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">緊急連絡先氏名 *</label>
                          <input
                            type="text"
                            value={formData.emergencyName}
                            onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">続柄 *</label>
                          <input
                            type="text"
                            value={formData.emergencyRelationship}
                            onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">緊急連絡先電話番号 *</label>
                          <input
                            type="tel"
                            value={formData.emergencyPhone}
                            onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* 医療・ケア情報 */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">医療・ケア情報</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">アレルギー</label>
                          <input
                            type="text"
                            value={formData.allergies}
                            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="カンマ区切りで入力"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">服薬</label>
                          <input
                            type="text"
                            value={formData.medications}
                            onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="カンマ区切りで入力"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">障害等</label>
                          <input
                            type="text"
                            value={formData.disabilities}
                            onChange={(e) => setFormData({ ...formData, disabilities: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="カンマ区切りで入力"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">介護度</label>
                          <input
                            type="text"
                            value={formData.careLevel}
                            onChange={(e) => setFormData({ ...formData, careLevel: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 備考 */}
                    <div className="border-t pt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">備考</label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* ボタン */}
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        キャンセル
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      >
                        {editingResident ? '更新' : '登録'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}