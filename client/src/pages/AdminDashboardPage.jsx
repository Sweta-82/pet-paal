import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, fetchAdminPets, deletePetAdmin } from '../redux/slices/adminSlice';
import { FaTrash, FaUser, FaPaw } from 'react-icons/fa';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { users, pets, loading, error } = useSelector((state) => state.admin);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (activeTab === 'users') {
      dispatch(fetchUsers());
    } else {
      dispatch(fetchAdminPets());
    }
  }, [dispatch, activeTab]);

  const [deleteLoading, setDeleteLoading] = useState(null); // ID of item being deleted

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setDeleteLoading(id);
      await dispatch(deleteUser(id));
      setDeleteLoading(null);
    }
  };

  const handleDeletePet = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      setDeleteLoading(id);
      await dispatch(deletePetAdmin(id));
      setDeleteLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen pt-32 transition-colors duration-500">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 drop-shadow-sm" style={{ fontFamily: '"BBH Bartle Static", sans-serif' }}>Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-pastel-pink/20">
        <button
          className={`pb-2 px-4 font-medium transition-colors text-lg ${activeTab === 'users' ? 'text-pastel-purple border-b-2 border-pastel-purple font-bold' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`pb-2 px-4 font-medium transition-colors text-lg ${activeTab === 'pets' ? 'text-pastel-purple border-b-2 border-pastel-purple font-bold' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('pets')}
        >
          Pets
        </button>
      </div>

      {loading && !deleteLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-purple"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center bg-white/50 p-4 rounded-xl">{error}</div>
      ) : (
        <div className="bg-white/60 backdrop-blur-xl shadow-2xl shadow-pastel-purple/10 border border-white/60 sm:rounded-3xl overflow-hidden">
          {activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-pastel-pink/10">
                <thead className="bg-pastel-purple/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pastel-pink/10 bg-transparent">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${user.role === 'admin' ? 'bg-pastel-purple/20 text-pastel-purple border-pastel-purple/30' : user.role === 'shelter' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-all disabled:opacity-50"
                          disabled={deleteLoading === user._id}
                        >
                          {deleteLoading === user._id ? (
                            <div className="animate-spin h-4 w-4 border-b-2 border-red-500 rounded-full"></div>
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-pastel-pink/10">
                <thead className="bg-pastel-purple/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Pet Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Shelter</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pastel-pink/10 bg-transparent">
                  {pets.map((pet) => (
                    <tr key={pet._id} className="hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{pet.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pet.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pet.shelter?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeletePet(pet._id)}
                          className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-all disabled:opacity-50"
                          disabled={deleteLoading === pet._id}
                        >
                          {deleteLoading === pet._id ? (
                            <div className="animate-spin h-4 w-4 border-b-2 border-red-500 rounded-full"></div>
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
