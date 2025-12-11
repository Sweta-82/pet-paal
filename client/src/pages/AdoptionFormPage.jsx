import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createApplication, resetSuccess } from '../redux/slices/applicationSlice';
import { fetchPetDetails } from '../redux/slices/petSlice';

const AdoptionFormPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { pet } = useSelector((state) => state.pets);
  const { loading, error, success } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchPetDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      dispatch(resetSuccess());
      navigate('/dashboard');
    }
  }, [success, navigate, dispatch]);

  const submitHandler = (data) => {
    dispatch(createApplication({ petId: id, message: data.message }));
  };

  if (!pet) return <div className="text-center py-10">Loading pet details...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Adopt {pet.name}</h1>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <img src={pet.images[0]} alt={pet.name} className="w-20 h-20 object-cover rounded-full mr-4" />
          <div>
            <h2 className="text-xl font-semibold">{pet.name}</h2>
            <p className="text-gray-600">{pet.breed} • {pet.age} years old</p>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to adopt {pet.name}?</label>
            <textarea
              rows="6"
              className={`w-full border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm p-2`}
              placeholder="Tell us about your home, lifestyle, and experience with pets..."
              {...register("message", { required: "Please provide a reason for adoption" })}
            ></textarea>
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-green text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdoptionFormPage;
