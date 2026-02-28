"use client";
import { useEffect, useState } from "react";
import { FiTrash2, FiMail, FiCheck, FiMessageSquare } from "react-icons/fi";
import { API_BASE_URL } from "../../../lib/api";

export default function AdminContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<any>(null); // For modal view

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/contact`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (data.success) {
                setContacts(data.contacts);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/contact/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setContacts(contacts.map((c: any) => c._id === id ? { ...c, status: newStatus, isRead: true } : c) as any);
                if (selectedContact && selectedContact._id === id) {
                    setSelectedContact({ ...selectedContact, status: newStatus, isRead: true });
                }
            }
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/contact/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await res.json();
            if (data.success) {
                setContacts(contacts.filter((c: any) => c._id !== id));
                if (selectedContact && selectedContact._id === id) {
                    setSelectedContact(null);
                }
            }
        } catch (error) {
            console.error("Error deleting contact", error);
        }
    };

    const viewMessage = (contact: any) => {
        setSelectedContact(contact);
        if (!contact.isRead || contact.status === 'new') {
            handleStatusChange(contact._id, 'read');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">الرسائل الواردة</h1>
                <p className="text-gray-600 mt-2">إدارة رسائل واستفسارات العملاء</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">المرسل</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">الموضوع</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">التاريخ</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">الحالة</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {contacts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">لا توجد رسائل حالياً</td>
                                </tr>
                            ) : contacts.map((contact: any) => (
                                <tr key={contact._id} className={`hover:bg-gray-50 transition-colors ${!contact.isRead ? 'bg-green-50/50' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">{contact.name}</div>
                                        <div className="text-xs text-gray-500">{contact.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 line-clamp-1 max-w-xs">{contact.subject || 'بدون موضوع'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(contact.createdAt).toLocaleDateString('ar-SA')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                contact.status === 'read' ? 'bg-gray-100 text-gray-800' :
                                                    contact.status === 'replied' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {contact.status === 'new' ? 'جديدة' : contact.status === 'read' ? 'مقروءة' : contact.status === 'replied' ? 'تم الرد' : 'مؤرشفة'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => viewMessage(contact)} className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg" title="عرض الرسالة">
                                                <FiMessageSquare className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleStatusChange(contact._id, 'replied')} className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg" title="تحديد كـ تم الرد">
                                                <FiCheck className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(contact._id)} className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg" title="حذف">
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Message Modal */}
            {selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">تفاصيل الرسالة</h2>
                            <button onClick={() => setSelectedContact(null)} className="text-gray-400 hover:text-gray-700 font-bold text-xl">&times;</button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4">
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">المرسل</p>
                                    <p className="font-semibold text-gray-900">{selectedContact.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">البريد الإلكتروني</p>
                                    <a href={`mailto:${selectedContact.email}`} className="font-semibold text-blue-600 hover:underline flex items-center gap-1" dir="ltr">
                                        <FiMail className="w-4 h-4" /> {selectedContact.email}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">التاريخ</p>
                                    <p className="font-semibold text-gray-900" dir="ltr">{new Date(selectedContact.createdAt).toLocaleString('ar-SA')}</p>
                                </div>
                                {selectedContact.phone && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">رقم الهاتف</p>
                                        <p className="font-semibold text-gray-900" dir="ltr">{selectedContact.phone}</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 border-t border-gray-100 mt-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">{selectedContact.subject || 'بدون موضوع'}</h3>
                                <div className="bg-gray-50 p-5 rounded-xl text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-100 shadow-inner">
                                    {selectedContact.message}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <a href={`mailto:${selectedContact.email}`} className="px-5 py-2.5 bg-[#0B3D2E] text-white rounded-lg hover:bg-green-800 transition-colors flex items-center gap-2 font-medium">
                                <FiMail /> رد عبر البريد
                            </a>
                            <button onClick={() => setSelectedContact(null)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
