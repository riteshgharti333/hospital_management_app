import React, { useState, useEffect } from "react";
import { FaBox, FaImage, FaEdit, FaTrash, FaSave } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import BackButton from "../../components/BackButton/BackButton";
import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import {
  EditButton,
  DeleteButton,
  CancelButton,
  SaveButton,
} from "../../components/ActionButtons/ActionButtons";

import {
  useGetBrandById,
  useUpdateBrand,
  useDeleteBrand,
} from "../../feature/itemHooks/useBrand";
import { brandSchema } from "@hospital/schemas";

const formFields = [
  {
    section: "Brand Information",
    icon: <FaBox className="text-blue-500" />,
    fields: [
      {
        label: "Brand Name",
        type: "text",
        name: "brandName",
        placeholder: "Enter brand name",
        required: true,
      },
      {
        label: "Brand Logo",
        type: "file",
        name: "brandLogo",
        accept: "image/*",
        required: false, // Not required for updates
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        placeholder: "Enter brand description",
        required: true,
      },
    ],
  },
  {
    section: "Status",
    icon: <FaBox className="text-blue-500" />,
    fields: [
      {
        label: "Status",
        type: "select",
        name: "status",
        options: ["Active", "Inactive"],
        required: true,
      },
    ],
  },
];

const EditBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  const { data: brandData, isLoading } = useGetBrandById(id);
  const { mutateAsync: updateBrand, isPending: isUpdating } = useUpdateBrand();
  const { mutateAsync: deleteBrand, isPending: isDeleting } = useDeleteBrand();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(brandSchema),
  });

  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "bg-white";

  useEffect(() => {
    if (brandData) {
      reset(brandData);
      if (brandData.brandLogo) {
        setLogoPreview(brandData.brandLogo);
      }
    }
  }, [brandData, reset]);

  const { ref: fileRef, ...fileRest } = register("brandLogo");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("brandLogo", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("brandName", data.brandName);
    formData.append("description", data.description);
    formData.append("status", data.status);

    // Only append the logo if it's a new file object
    if (data.brandLogo && data.brandLogo instanceof File) {
      formData.append("brandLogo", data.brandLogo);
    }

    try {
      const response = await updateBrand({ id, data: formData });
      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update brand");
    }
  };

  const handleCancel = () => {
    reset(brandData);
    if (brandData?.brandLogo) {
      setLogoPreview(brandData.brandLogo);
    }
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteBrand(id);
      if (data && data.message) {
        toast.success(data.message);
        navigate("/company-creation");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete brand");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!brandData) return <NoData />;

  return (
    <div className="mx-auto">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BackButton />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center ml-2">
              <FaBox className="mr-2 text-blue-500" />
              {editMode ? "Edit Brand" : "View Brand"}
            </h2>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        noValidate
      >
        {formFields.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className={`p-6 ${
              sectionIndex !== 0 ? "border-t border-gray-100" : ""
            }`}
          >
            <div className="flex items-center mb-6">
              {section.icon}
              <h3 className="ml-2 text-lg font-semibold text-gray-800">
                {section.section}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field) => (
                <div
                  key={field.name}
                  className={`space-y-1 ${
                    field.type === "textarea" || field.type === "file"
                      ? "md:col-span-2"
                      : ""
                  }`}
                >
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.name}
                      {...register(field.name)}
                      disabled={!editMode}
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${getDisabledStyles(!editMode)}`}
                    >
                      {field.options.map((option, i) => (
                        <option key={i} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      {...register(field.name)}
                      disabled={!editMode}
                      placeholder={field.placeholder}
                      rows="3"
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${getDisabledStyles(!editMode)}`}
                    />
                  ) : field.type === "file" ? (
                    <div>
                      <label
                        htmlFor="brandLogoInput"
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg bg-gray-50 ${
                          editMode
                            ? "cursor-pointer hover:bg-gray-100"
                            : "cursor-default"
                        } ${
                          errors.brandLogo
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Brand Logo Preview"
                            className="h-full w-auto object-contain p-2"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FaImage className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, SVG
                            </p>
                          </div>
                        )}
                      </label>
                      <input
                        id="brandLogoInput"
                        type="file"
                        accept="image/*"
                        {...fileRest}
                        ref={fileRef}
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={!editMode}
                      />
                    </div>
                  ) : (
                    <input
                      id={field.name}
                      type={field.type}
                      {...register(field.name)}
                      disabled={!editMode}
                      placeholder={field.placeholder}
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${getDisabledStyles(!editMode)}`}
                    />
                  )}
                  {errors[field.name] && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors[field.name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {!editMode ? (
            <>
              <DeleteButton onClick={() => setShowDeleteModal(true)} />
              <EditButton onClick={() => setEditMode(true)} />
            </>
          ) : (
            <>
              <CancelButton onClick={handleCancel} />
              <SaveButton type="submit" isLoading={isUpdating} />
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditBrand;
