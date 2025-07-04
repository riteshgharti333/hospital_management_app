import React, { useState, useEffect } from "react";
import { FaBox, FaTrash, FaPlus, FaEdit, FaSave } from "react-icons/fa";
import { useForm, useFieldArray } from "react-hook-form";
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
  useGetProductEntryById,
  useUpdateProductEntry,
  useDeleteProductEntry,
} from "../../feature/itemHooks/useSubProduct";
import { productMaterialSchema } from "@hospital/schemas";

const EditProductEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sample data - in a real app, this would come from an API
  const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];
  const categories = ["Medicines", "Equipment", "Disposables", "Surgical"];
  const gstOptions = ["0", "5", "12", "18", "28"];
  const uomOptions = ["Nos", "Box", "Kg", "Ltr", "Meter", "Set"];

  const { data: productData, isLoading } = useGetProductEntryById(id);
  const { mutateAsync: updateProductEntry, isPending: isUpdating } =
    useUpdateProductEntry();
  const { mutateAsync: deleteProductEntry, isPending: isDeleting } =
    useDeleteProductEntry();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productMaterialSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });

  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "bg-white";

  useEffect(() => {
    if (productData) {
      reset(productData);
    }
  }, [productData, reset]);

  const addMaterial = () => {
    append({
      uom: "",
      description: "",
      alterUnit: "",
      alterUnitValue: "",
      serialUniqueNo: "",
    });
  };

  const removeMaterial = (index) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("At least one material specification is required.");
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await updateProductEntry({ id, data });
      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    reset(productData);
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteProductEntry(id);
      if (data && data.message) {
        toast.success(data.message);
        navigate("/product-entries");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const renderError = (error) =>
    error && <p className="text-red-600 text-sm mt-1">{error.message}</p>;

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

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BackButton />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center ml-2">
              <FaBox className="mr-2 text-blue-500" />
              {editMode ? "Edit Product Entry" : "View Product Entry"}
            </h2>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        noValidate
      >
        <div className="p-6">
          <div className="flex items-center mb-6">
            <FaBox className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Product Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Brand<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("brand")}
                disabled={!editMode}
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.brand ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              >
                <option value="" disabled hidden>
                  Select Brand
                </option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              {renderError(errors.brand)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("category")}
                disabled={!editMode}
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.category ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              >
                <option value="" disabled hidden>
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {renderError(errors.category)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register("productName")}
                disabled={!editMode}
                placeholder="Enter product name"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.productName ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              />
              {renderError(errors.productName)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Short Description
              </label>
              <input
                type="text"
                {...register("shortDescription")}
                disabled={!editMode}
                placeholder="Enter short description"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.shortDescription ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              />
              {renderError(errors.shortDescription)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                HSN Code<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register("hsnCode")}
                disabled={!editMode}
                placeholder="Enter HSN code"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.hsnCode ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              />
              {renderError(errors.hsnCode)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                GST(%)<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("gstPercentage")}
                disabled={!editMode}
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.gstPercentage ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              >
                <option value="" disabled hidden>
                  Select GST %
                </option>
                {gstOptions.map((gst) => (
                  <option key={gst} value={gst}>
                    {gst}%
                  </option>
                ))}
              </select>
              {renderError(errors.gstPercentage)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                {...register("status")}
                disabled={!editMode}
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.status ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {renderError(errors.status)}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaBox className="text-blue-500" />
              <h3 className="ml-2 text-lg font-semibold text-gray-800">
                Material Specifications
              </h3>
            </div>
            {editMode && (
              <button
                type="button"
                onClick={addMaterial}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <FaPlus className="mr-1" /> Add Material
              </button>
            )}
          </div>
          {renderError(errors.specifications?.root)}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 p-4 bg-gray-50 rounded-lg border"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  UOM<span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  {...register(`specifications.${index}.uom`)}
                  disabled={!editMode}
                  className={`block w-full px-3 py-2 border rounded-lg text-sm ${
                    errors.specifications?.[index]?.uom
                      ? "border-red-500"
                      : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                >
                  <option value="" disabled hidden>
                    Select
                  </option>
                  {uomOptions.map((uom) => (
                    <option key={uom} value={uom}>
                      {uom}
                    </option>
                  ))}
                </select>
                {renderError(errors.specifications?.[index]?.uom)}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  {...register(`specifications.${index}.description`)}
                  disabled={!editMode}
                  placeholder="Description"
                  className={`block w-full px-3 py-2 border rounded-lg text-sm ${
                    errors.specifications?.[index]?.description
                      ? "border-red-500"
                      : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                />
                {renderError(errors.specifications?.[index]?.description)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alter Unit
                </label>
                <select
                  {...register(`specifications.${index}.alterUnit`)}
                  disabled={!editMode}
                  className={`block w-full px-3 py-2 border rounded-lg text-sm ${
                    errors.specifications?.[index]?.alterUnit
                      ? "border-red-500"
                      : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                >
                  <option value="" disabled hidden>
                    Select
                  </option>
                  {uomOptions.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                {renderError(errors.specifications?.[index]?.alterUnit)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alter Unit Value
                </label>
                <input
                  type="number"
                  {...register(`specifications.${index}.alterUnitValue`, {
                    valueAsNumber: true,
                  })}
                  disabled={!editMode}
                  placeholder="Value"
                  className={`block w-full px-3 py-2 border rounded-lg text-sm ${
                    errors.specifications?.[index]?.alterUnitValue
                      ? "border-red-500"
                      : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                />
                {renderError(errors.specifications?.[index]?.alterUnitValue)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Serial/Unique No
                </label>
                <div className="flex">
                  <input
                    type="text"
                    {...register(`specifications.${index}.serialUniqueNo`)}
                    disabled={!editMode}
                    placeholder="Serial No"
                    className={`block w-full px-3 py-2 border rounded-l-lg text-sm ${
                      errors.specifications?.[index]?.serialUniqueNo
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${getDisabledStyles(!editMode)}`}
                  />
                  {editMode && fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMaterial(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-r-lg hover:bg-red-600 focus:outline-none"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  )}
                </div>
                {renderError(errors.specifications?.[index]?.serialUniqueNo)}
              </div>
            </div>
          ))}
        </div>

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

export default EditProductEntry;
