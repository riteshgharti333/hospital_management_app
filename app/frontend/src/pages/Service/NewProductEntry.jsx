import React from "react";
import { FaBox, FaTrash, FaPlus } from "react-icons/fa";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../../components/BackButton/BackButton";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useCreateProductEntry } from "../../feature/itemHooks/useSubProduct";

import { materialSpecSchema } from "@hospital/schemas";
import { productMaterialSchema } from "@hospital/schemas";

const NewProductEntry = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateProductEntry();

  // Sample data - in a real app, this would likely come from an API
  const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];
  const categories = ["Medicines", "Equipment", "Disposables", "Surgical"];
  const gstOptions = ["0", "5", "12", "18", "28"];
  const uomOptions = ["Nos", "Box", "Kg", "Ltr", "Meter", "Set"];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productMaterialSchema),
    defaultValues: {
      brand: "",
      category: "",
      productName: "",
      shortDescription: "",
      hsnCode: "",
      gstPercentage: "",
      status: "Active",
      specifications: [
        {
          uom: "",
          description: "",
          alterUnit: "",
          alterUnitValue: "",
          serialUniqueNo: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });

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
    console.log(data)
    if (data.specifications && data.specifications.every(spec => 
    !spec.uom && !spec.description && !spec.alterUnit && 
    !spec.alterUnitValue && !spec.serialUniqueNo
  )) {
    data.specifications = undefined;
  }
    const response = await mutateAsync(data);
    if (response?.data?.success) {
      const newEntryId = response.data.data.id;
      navigate(`/product-entry/${newEntryId}`);
    }
  };

  const renderError = (error) =>
    error && <p className="text-red-600 text-sm mt-1">{error.message}</p>;

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaBox className="mr-2 text-blue-500" />
              New Product Entry
            </h2>
            <p className="text-gray-600 mt-1">
              Enter product details and material specifications
            </p>
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
                Brand <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("brand")}
                className={`block w-full px-4 py-2 border rounded-lg bg-white ${
                  errors.brand ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled selected hidden>
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
                Category <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("category")}
                className={`block w-full px-4 py-2 border rounded-lg bg-white ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled selected hidden>Select Category</option>
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
                Product Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register("productName")}
                placeholder="Enter product name"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.productName ? "border-red-500" : "border-gray-300"
                }`}
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
                placeholder="Enter short description"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.shortDescription ? "border-red-500" : "border-gray-300"
                }`}
              />
              {renderError(errors.shortDescription)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                HSN Code <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register("hsnCode")}
                placeholder="Enter HSN code"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.hsnCode ? "border-red-500" : "border-gray-300"
                }`}
              />
              {renderError(errors.hsnCode)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                GST(%) <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("gstPercentage")}
                className={`block w-full px-4 py-2 border rounded-lg bg-white ${
                  errors.gstPercentage ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled selected hidden>
                  Select GST %
                </option>
                {gstOptions.map((gst) => (
  <option key={gst} value={gst}> {/* Convert to string */}
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
                className={`block w-full px-4 py-2 border rounded-lg bg-white ${
                  errors.status ? "border-red-500" : "border-gray-300"
                }`}
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
            <button
              type="button"
              onClick={addMaterial}
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <FaPlus className="mr-1" /> Add Material
            </button>
          </div>
          {renderError(errors.specifications?.root)}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 p-4 bg-gray-50 rounded-lg border"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  UOM <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  {...register(`specifications.${index}.uom`)}
                  className={`block w-full px-3 py-2 border rounded-lg bg-white text-sm ${
                    errors.specifications?.[index]?.uom
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="" disabled selected hidden>
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
                  placeholder="Description"
                  className={`block w-full px-3 py-2 border rounded-lg text-sm ${
                    errors.specifications?.[index]?.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {renderError(errors.specifications?.[index]?.description)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alter Unit
                </label>
                <select
                  {...register(`specifications.${index}.alterUnit`)}
                  className={`block w-full px-3 py-2 border rounded-lg bg-white text-sm ${
                    errors.specifications?.[index]?.alterUnit
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="" disabled selected hidden>
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
    valueAsNumber: true // Convert to number
  })}
  placeholder="Value"
  className={`block w-full px-3 py-2 border rounded-lg text-sm ${
    errors.specifications?.[index]?.alterUnitValue
      ? "border-red-500"
      : "border-gray-300"
  }`}
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
                    placeholder="Serial No"
                    className={`block w-full px-3 py-2 border rounded-l-lg text-sm ${
                      errors.specifications?.[index]?.serialUniqueNo
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {fields.length > 1 && (
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

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <LoadingButton type="submit" isLoading={isPending}>
            Save Product Entry
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewProductEntry;
