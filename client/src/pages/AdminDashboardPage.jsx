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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'users' ? 'text-forest-green border-b-2 border-forest-green' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'pets' ? 'text-forest-green border-b-2 border-forest-green' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('pets')}
        >
          Pets
        </button>
      </div>

      {loading && !deleteLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {activeTab === 'users' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'shelter' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        disabled={deleteLoading === user._id}
                      >
                        {deleteLoading === user._id ? (
                          <span className="text-xs">Deleting...</span>
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shelter</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pets.map((pet) => (
                  <tr key={pet._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pet.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.shelter?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeletePet(pet._id)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        disabled={deleteLoading === pet._id}
                      >
                        {deleteLoading === pet._id ? (
                          <span className="text-xs">Deleting...</span>
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
