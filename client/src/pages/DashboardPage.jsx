import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../redux/slices/authSlice';
import { fetchMyApplications, fetchShelterApplications, updateApplicationStatus } from '../redux/slices/applicationSlice';
import { useForm } from 'react-hook-form';

const DashboardPage = () => {
  const { userInfo, loading: authLoading } = useSelector((state) => state.auth);
  const { applications, loading: appLoading } = useSelector((state) => state.applications);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue } = useForm();

  // Local state for specific application status updates
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setValue('name', userInfo.name);
      setValue('email', userInfo.email);
      setValue('bio', userInfo.bio);
      setValue('location', userInfo.location);
      setValue('phone', userInfo.phone);

      if (userInfo.role === 'adopter') {
        dispatch(fetchMyApplications());
      } else if (userInfo.role === 'shelter') {
        dispatch(fetchShelterApplications());
      }
    }
  }, [navigate, userInfo, setValue, dispatch]);

  const onUpdateProfile = (data) => {
    dispatch(updateProfile(data));
  };

  const handleStatusUpdate = async (id, status) => {
    setStatusUpdatingId(id);
    await dispatch(updateApplicationStatus({ id, status }));
    setStatusUpdatingId(null);
  };

  if (!userInfo) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, {userInfo.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-forest-green">Profile Details</h2>
          <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" {...register('name')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-green focus:ring-forest-green sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" {...register('email')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-green focus:ring-forest-green sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="text" {...register('phone')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-green focus:ring-forest-green sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" {...register('location')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-green focus:ring-forest-green sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea {...register('bio')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-green focus:ring-forest-green sm:text-sm border p-2" rows="3"></textarea>
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-forest-green text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {authLoading ? 'Updating Profile...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Role Specific Section */}
        <div className="md:col-span-2 space-y-8">
          {userInfo.role === 'adopter' ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-forest-green">My Applications</h2>
                {applications.length === 0 ? (
                  <p className="text-gray-500">You haven't submitted any adoption applications yet.</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app._id} className="border p-4 rounded-md flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{app.pet?.name || 'Unknown Pet'}</h3>
                          <p className="text-sm text-gray-600">Shelter: {app.shelter?.name}</p>
                          <p className="text-sm text-gray-500 mt-1">Status: <span className={`font-medium ${app.status === 'Approved' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{app.status}</span></p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-forest-green">Favorite Pets</h2>
                <p className="text-gray-500">No favorites yet. Go browse some pets!</p>
                {/* Placeholder for favorites list */}
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-forest-green">Manage Pets</h2>
                <p className="text-gray-500">You haven't listed any pets yet.</p>
                <button onClick={() => navigate('/create-pet')} className="mt-4 bg-terracotta text-white py-2 px-4 rounded-md hover:bg-red-400 transition-colors">Add New Pet</button>
                {/* Placeholder for pet management */}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-forest-green">Incoming Applications</h2>
                {applications.length === 0 ? (
                  <p className="text-gray-500">No new applications.</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app._id} className="border p-4 rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">For: {app.pet?.name}</h3>
                            <p className="text-sm text-gray-600">Applicant: {app.adopter?.name} ({app.adopter?.email})</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${app.status === 'Approved' ? 'bg-green-100 text-green-800' : app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{app.status}</span>
                        </div>
                        <p className="text-gray-700 text-sm bg-gray-50 p-2 rounded mb-3">"{app.message}"</p>
                        {app.status === 'Pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(app._id, 'Approved')}
                              disabled={statusUpdatingId === app._id}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                              {statusUpdatingId === app._id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                              disabled={statusUpdatingId === app._id}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                            >
                              {statusUpdatingId === app._id ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
