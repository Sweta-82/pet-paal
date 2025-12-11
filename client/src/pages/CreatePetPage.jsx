import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createPet, fetchPetDetails, updatePet } from '../redux/slices/petSlice';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur'];
const CATEGORIES = ['Dog', 'Cat', 'Other'];

const CreatePetPage = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error, pet } = useSelector((state) => state.pets);

  React.useEffect(() => {
    if (id) {
      if (!pet || pet._id !== id) {
        dispatch(fetchPetDetails(id));
      } else {
        setValue('name', pet.name);
        setValue('age', pet.age);
        setValue('breed', pet.breed);

        if (CATEGORIES.includes(pet.category)) {
          setValue('category', pet.category);
        } else {
          setValue('category', 'Other');
          setValue('customCategory', pet.category);
        }

        setValue('gender', pet.gender);
        setValue('size', pet.size);
        setValue('description', pet.description);

        if (CITIES.includes(pet.location)) {
          setValue('location', pet.location);
        } else {
          setValue('location', 'Other');
          setValue('customLocation', pet.location);
        }
      }
    }
  }, [dispatch, id, pet, setValue]);

  const submitHandler = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('age', data.age);
    formData.append('breed', data.breed);

    const finalCategory = data.category === 'Other' ? data.customCategory : data.category;
    formData.append('category', finalCategory);

    formData.append('gender', data.gender);
    formData.append('size', data.size);
    formData.append('description', data.description);

    const finalLocation = data.location === 'Other' ? data.customLocation : data.location;
    formData.append('location', finalLocation);

    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i]);
      }
    }

    if (id) {
      dispatch(updatePet({ id, petData: formData })).then((res) => {
        if (!res.error) {
          navigate(`/pets/${id}`);
        }
      });
    } else {
      dispatch(createPet(formData)).then((res) => {
        if (!res.error) {
          navigate('/dashboard');
        }
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{id ? 'Edit Pet' : 'List a New Pet'}</h1>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
            <input
              type="text"
              className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm p-2`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm p-2"
                {...register("category", { required: true })}
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {watch('category') === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specify Category</label>
                <input
                  type="text"
                  className={`w-full border ${errors.customCategory ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm p-2`}
                  {...register("customCategory", { required: "Please specify the category" })}
                />
                {errors.customCategory && <p className="text-red-500 text-xs mt-1">{errors.customCategory.message}</p>}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
              <input
                type="text"
                className={`w-full border ${errors.breed ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm p-2`}
                {...register("breed", { required: "Breed is required" })}
              />
              {errors.breed && <p className="text-red-500 text-xs mt-1">{errors.breed.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age (Years)</label>
              <input
                type="number"
                className={`w-full border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm p-2`}
                {...register("age", { required: "Age is required", min: 0 })}
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm p-2"
                {...register("gender", { required: true })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm p-2"
                {...register("size", { required: true })}
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                className={`w-full border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm p-2`}
                {...register("location", { required: "Location is required" })}
              >
                <option value="">Select Location</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Other">Other</option>
              </select>
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            </div>
          </div>

          {watch('location') === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specify Location</label>
              <input
                type="text"
                className={`w-full border ${errors.customLocation ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm p-2`}
                {...register("customLocation", { required: "Please specify the location" })}
              />
              {errors.customLocation && <p className="text-red-500 text-xs mt-1">{errors.customLocation.message}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows="4"
              className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm p-2`}
              {...register("description", { required: "Description is required" })}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pet Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className={`w-full border ${errors.images ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm p-2`}
              {...register("images")}
            />
            <p className="text-xs text-gray-500 mt-1">Upload one or more images (JPG, PNG, WebP)</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-green text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? (id ? 'Updating Pet...' : 'Adding Pet...') : (id ? 'Update Pet' : 'List Pet')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePetPage;
