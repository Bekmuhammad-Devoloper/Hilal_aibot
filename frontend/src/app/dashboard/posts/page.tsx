'use client';

import { useState, useEffect } from 'react';
import { postsApi, channelsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiFileText, FiSend, FiImage, FiClock, FiCheck } from 'react-icons/fi';

interface Channel {
  id: number;
  name: string;
  username: string;
}

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  channelId: number;
  channel?: Channel;
  isPublished: boolean;
  scheduledAt?: string;
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({ content: '', imageUrl: '', channelId: 0, isPublished: false, scheduledAt: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postsData, channelsData] = await Promise.all([postsApi.getAll(), channelsApi.getAll()]);
      setPosts(postsData);
      setChannels(channelsData);
    } catch {
      toast.error("Ma'lumotlarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...formData, channelId: Number(formData.channelId) };
      if (editingPost) {
        await postsApi.update(editingPost.id, data);
        toast.success("Post yangilandi!");
      } else {
        await postsApi.create(data);
        toast.success("Post yaratildi!");
      }
      fetchData();
      closeModal();
    } catch {
      toast.error("Xatolik yuz berdi!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Postni o'chirmoqchimisiz?")) return;
    try {
      await postsApi.delete(id);
      toast.success("Post o'chirildi!");
      fetchData();
    } catch {
      toast.error("O'chirishda xatolik!");
    }
  };

  const handlePublish = async (post: Post) => {
    try {
      await postsApi.update(post.id, { ...post, isPublished: true });
      toast.success("Post nashr qilindi!");
      fetchData();
    } catch {
      toast.error("Nashr qilishda xatolik!");
    }
  };

  const openModal = (post?: Post) => {
    const channelsArray = Array.isArray(channels) ? channels : [];
    if (post) {
      setEditingPost(post);
      setFormData({ content: post.content, imageUrl: post.imageUrl || '', channelId: post.channelId, isPublished: post.isPublished, scheduledAt: post.scheduledAt || '' });
    } else {
      setEditingPost(null);
      setFormData({ content: '', imageUrl: '', channelId: channelsArray[0]?.id || 0, isPublished: false, scheduledAt: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setFormData({ content: '', imageUrl: '', channelId: 0, isPublished: false, scheduledAt: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  const postsArray = Array.isArray(posts) ? posts : [];
  const publishedCount = postsArray.filter(p => p.isPublished).length;
  const draftCount = postsArray.filter(p => !p.isPublished).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FiFileText className="w-8 h-8" />
              Postlar Boshqaruvi
            </h1>
            <p className="text-purple-100 mt-2">Kanallarga post yarating va boshqaring</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold">{publishedCount}</div>
              <div className="text-xs text-purple-100">Nashr qilingan</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold">{draftCount}</div>
              <div className="text-xs text-purple-100">Qoralama</div>
            </div>
            <button onClick={() => openModal()} className="bg-white text-purple-600 px-5 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg">
              <FiPlus className="w-5 h-5" />
              Yangi post
            </button>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {postsArray.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">Postlar yo'q</h3>
          <p className="text-gray-400 mt-2">Yangi post yaratish uchun tugmani bosing</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsArray.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
              {post.imageUrl && (
                <div className="h-40 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {post.isPublished ? 'Nashr qilingan' : 'Qoralama'}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(post)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Tahrirlash">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="O'chirish">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-purple-600 font-medium">@{post.channel?.username || 'Noma\'lum'}</span>
                  {!post.isPublished && (
                    <button onClick={() => handlePublish(post)} className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium" title="Nashr qilish">
                      <FiSend className="w-4 h-4" />
                      Nashr qilish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{editingPost ? 'Postni tahrirlash' : 'Yangi post'}</h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Yopish">
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kanal</label>
                <select value={formData.channelId} onChange={(e) => setFormData({ ...formData, channelId: Number(e.target.value) })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" required>
                  <option value="">Kanal tanlang</option>
                  {(Array.isArray(channels) ? channels : []).map((ch) => (
                    <option key={ch.id} value={ch.id}>{ch.name} (@{ch.username})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post matni</label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none" placeholder="Post matnini kiriting..." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiImage className="w-4 h-4 inline mr-1" />
                  Rasm URL (ixtiyoriy)
                </label>
                <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="https://example.com/image.jpg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiClock className="w-4 h-4 inline mr-1" />
                  Rejali vaqt (ixtiyoriy)
                </label>
                <input type="datetime-local" value={formData.scheduledAt} onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-800 flex items-center gap-2">
                    <FiCheck className="w-4 h-4" />
                    Darhol nashr qilish
                  </div>
                  <div className="text-sm text-gray-500">Postni hoziroq kanalga yuborish</div>
                </div>
                <button type="button" onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })} className={`relative w-14 h-8 rounded-full transition-colors ${formData.isPublished ? 'bg-purple-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${formData.isPublished ? 'right-1' : 'left-1'}`}></span>
                </button>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                  Bekor qilish
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity font-medium">
                  {editingPost ? 'Saqlash' : 'Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}