'use client';

import { useState, useEffect } from 'react';
import { channelsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiHash, FiUsers, FiLink } from 'react-icons/fi';

interface Channel {
  id: number;
  name: string;
  username: string;
  isMandatory: boolean;
  createdAt: string;
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [formData, setFormData] = useState({ name: '', username: '', isMandatory: true });

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const data = await channelsApi.getAll();
      setChannels(data);
    } catch {
      toast.error("Kanallarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingChannel) {
        await channelsApi.update(editingChannel.id, formData);
        toast.success("Kanal yangilandi!");
      } else {
        await channelsApi.create(formData);
        toast.success("Kanal qo'shildi!");
      }
      fetchChannels();
      closeModal();
    } catch {
      toast.error("Xatolik yuz berdi!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Kanalni o'chirmoqchimisiz?")) return;
    try {
      await channelsApi.delete(id);
      toast.success("Kanal o'chirildi!");
      fetchChannels();
    } catch {
      toast.error("O'chirishda xatolik!");
    }
  };

  const openModal = (channel?: Channel) => {
    if (channel) {
      setEditingChannel(channel);
      setFormData({ name: channel.name, username: channel.username, isMandatory: channel.isMandatory });
    } else {
      setEditingChannel(null);
      setFormData({ name: '', username: '', isMandatory: true });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingChannel(null);
    setFormData({ name: '', username: '', isMandatory: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const channelsArray = Array.isArray(channels) ? channels : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FiHash className="w-8 h-8" />
              Kanallar Boshqaruvi
            </h1>
            <p className="text-emerald-100 mt-2">Majburiy obuna kanallarini boshqaring</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold">{channelsArray.length}</div>
              <div className="text-xs text-emerald-100">Jami kanallar</div>
            </div>
            <button onClick={() => openModal()} className="bg-white text-emerald-600 px-5 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-lg">
              <FiPlus className="w-5 h-5" />
              Yangi kanal
            </button>
          </div>
        </div>
      </div>

      {/* Channels Grid */}
      {channelsArray.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <FiHash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">Kanallar yo'q</h3>
          <p className="text-gray-400 mt-2">Yangi kanal qo'shish uchun tugmani bosing</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channelsArray.map((channel) => (
            <div key={channel.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {channel.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(channel)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(channel.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{channel.name}</h3>
              <a href={`https://t.me/${channel.username}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mb-4">
                <FiLink className="w-4 h-4" />
                @{channel.username}
              </a>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${channel.isMandatory ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {channel.isMandatory ? 'Majburiy' : 'Ixtiyoriy'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(channel.createdAt).toLocaleDateString('uz-UZ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{editingChannel ? 'Kanalni tahrirlash' : 'Yangi kanal'}</h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kanal nomi</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" placeholder="Masalan: Hilal Edu" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                  <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" placeholder="username" required />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-800">Majburiy obuna</div>
                  <div className="text-sm text-gray-500">Botdan foydalanish uchun obuna shart</div>
                </div>
                <button type="button" onClick={() => setFormData({ ...formData, isMandatory: !formData.isMandatory })} className={`relative w-14 h-8 rounded-full transition-colors ${formData.isMandatory ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${formData.isMandatory ? 'right-1' : 'left-1'}`}></span>
                </button>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                  Bekor qilish
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:opacity-90 transition-opacity font-medium">
                  {editingChannel ? 'Saqlash' : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}