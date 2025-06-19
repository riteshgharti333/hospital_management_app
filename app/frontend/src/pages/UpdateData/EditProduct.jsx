import React, { useState, useEffect } from "react";
import { FaBoxes, FaTag, FaImage, FaEdit, FaTimes, FaSave, FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import { toast } from "sonner";
import {
  useUpdateProduct,
  useDeleteProduct,
  useGetProductById,
} from "../../feature/itemHooks/useProduct";
import { productSchema } from "@hospital/schemas";
import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import {
  EditButton,
  DeleteButton,
  CancelButton,
  SaveButton,
} from "../../components/ActionButtons/ActionButtons";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const parentCategories = [
  "Medical Equipment",
  "Pharmaceuticals",
  "Disposables",
  "Diagnostic",
  "Surgical",
  "Furniture",
];

const subCategories = {
  "Medical Equipment": ["Patient Monitoring", "Therapeutic", "Laboratory"],
  Pharmaceuticals: ["Drugs", "Vaccines", "Injectables"],
  Disposables: ["Gloves", "Masks", "Syringes"],
  Diagnostic: ["Imaging", "Test Kits", "Pathology"],
  Surgical: ["Instruments", "Sutures", "Implants"],
  Furniture: ["Hospital Beds", "Chairs", "Cabinets"],
};

const formFields = [
  {
    section: "Product Information",
    icon: <FaTag className="text-blue-500" />,
    fields: [
      {
        label: "Product Name",
        type: "text",
        name: "productName",
        placeholder: "Enter product name",
        required: true,
      },
      {
        label: "Product Code",
        type: "text",
        name: "productCode",
        placeholder: "Enter product code",
        required: true,
      },
      {
        label: "Parent Category",
        type: "select",
        name: "parentCategory",
        placeholder: "Select parent category",
        options: parentCategories,
        required: true,
      },
      {
        label: "Sub Category",
        type: "select",
        name: "subCategory",
        placeholder: "Select sub category",
        dynamicOptions: (watch) =>
          watch("parentCategory") ? subCategories[watch("parentCategory")] : [],
        required: true,
      },
    ],
  },
  {
    section: "Product Details",
    icon: <FaBoxes className="text-blue-500" />,
    fields: [
      {
        label: "Product Image",
        type: "file",
        name: "categoryLogo",
        accept: "image/*",
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        placeholder: "Enter product description",
      },
    ],
  },
  {
    section: "Pricing & Status",
    icon: <FaTag className="text-blue-500" />,
    fields: [
      {
        label: "Unit",
        type: "text",
        name: "unit",
        placeholder: "e.g., pieces, boxes",
        required: true,
      },
      {
        label: "Price",
        type: "number",
        name: "price",
        placeholder: "Enter product price",
        required: true,
      },
      {
        label: "Tax Rate (%)",
        type: "number",
        name: "taxRate",
        placeholder: "Enter tax rate",
        required: true,
      },
      {
        label: "Status",
        type: "select",
        name: "status",
        placeholder: "Select product status",
        options: ["Active", "Inactive"],
        required: true,
      },
    ],
  },
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileName, setFileName] = useState("");

  const { data: productData, isLoading } = useGetProductById(id);
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const parentCategory = watch("parentCategory");
  const categoryLogoFile = watch("categoryLogo");

  // Reusable function for disabled styles
  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "";

  // Set form values when data loads
  useEffect(() => {
    if (productData) {
      reset({
        ...productData,
        categoryLogo: productData.categoryLogo || undefined,
      });
      if (productData.categoryLogo) {
        setPreviewImage(productData.categoryLogo);
      }
    }
  }, [productData, reset]);

  useEffect(() => {
    setValue("subCategory", "");
  }, [parentCategory, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue("categoryLogo", file.name);

      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFileName("");
      setValue("categoryLogo", "");
      setPreviewImage("");
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await updateProduct({
        id,
        data: {
          ...data,
          categoryLogo: fileName || productData?.categoryLogo || "",
        },
      });

      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update product");
    }
  };

  const handleCancel = () => {
    reset(productData);
    setEditMode(false);
    setFileName("");
    if (productData?.categoryLogo) {
      setPreviewImage(productData.categoryLogo);
    } else {
      setPreviewImage("");
    }
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteProduct(id);
      if (data && data.message) {
        toast.success(data.message);
        navigate("/products");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete product");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!productData) return <NoData />;

  return (
    <div className="mx-auto">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BackButton />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center ml-2">
              <FaTag className="mr-2 text-blue-600" />
              {editMode ? "Edit Product" : "View Product"}
            </h2>
          </div>
        </div>
      </div>

      {/* Form */}
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
              {section.fields.map((field, fieldIndex) => {
                const error = errors[field.name];
                const options = field.dynamicOptions
                  ? field.dynamicOptions(watch)
                  : field.options || [];

                return (
                  <div
                    key={fieldIndex}
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
                        disabled={!editMode || (field.dynamicOptions && !parentCategory)}
                        className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white ${
                          error ? "border-red-500" : "border-gray-300"
                        } ${getDisabledStyles(!editMode)}`}
                      >
                        <option value="" disabled hidden>
                          {field.placeholder}
                        </option>
                        {options.map((option, i) => (
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
                        rows={3}
                        placeholder={field.placeholder}
                        className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          error ? "border-red-500" : "border-gray-300"
                        } ${getDisabledStyles(!editMode)}`}
                      />
                    ) : field.type === "file" ? (
                      <div className="space-y-4">
                        <label
                          htmlFor={field.name}
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                            error ? "border-red-500" : "border-gray-300"
                          } ${!editMode ? "cursor-not-allowed opacity-70" : ""}`}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FaImage className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                {editMode ? "Click to upload" : "Current image"}
                              </span>{" "}
                              {editMode && "or drag and drop"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {editMode ? "PNG, JPG, SVG (MAX. 5MB)" : productData?.categoryLogo || "No image"}
                            </p>
                          </div>
                          {editMode && (
                            <input
                              id="categoryLogo"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          )}
                        </label>
                        {(previewImage || productData?.categoryLogo) && !error && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Image Preview:
                            </p>
                            <div className="w-32 h-32 border border-gray-200 rounded-lg overflow-hidden p-1">
                              <img
                                src={previewImage || productData?.categoryLogo}
                                alt="Product preview"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        id={field.name}
                        type={field.type}
                        {...register(field.name, {
                          valueAsNumber: field.type === "number",
                        })}
                        disabled={!editMode}
                        placeholder={field.placeholder}
                        className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          error ? "border-red-500" : "border-gray-300"
                        } ${getDisabledStyles(!editMode)}`}
                      />
                    )}
                    {error && (
                      <p className="text-red-600 text-sm mt-1">
                        {error.message}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {!editMode ? (
            <>
              <DeleteButton
                type="button"
                onClick={() => setShowDeleteModal(true)}
              />
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

export default EditProduct;