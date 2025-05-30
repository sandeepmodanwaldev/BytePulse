import React from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-2xl  dark:bg-gray-900 rounded-lg broder brodar-gray-200 w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-base-300 text-black dark:text-white">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Create New Playlist
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-800 dark:text-white">
                Playlist Name
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-white dark:bg-gray-800 border border-gray-700 dark:border-gray-200 placeholder:text-gray-700 dark:placeholder:text-gray-200"
              placeholder="Enter playlist name"
              {...register("name", { required: "Playlist name is required" })}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.name.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-800 dark:text-white">
                Description
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 bg-white dark:bg-gray-800 border border-gray-700 dark:border-gray-200 placeholder:text-gray-700 dark:placeholder:text-gray-200"
              placeholder="Enter playlist description"
              {...register("description")}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
