import React, { useState, useEffect } from "react";
import { FaBox, FaImage } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../../components/BackButton/BackButton";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useCreateBrand } from "../../feature/itemHooks/useBrand";
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
        required: true,
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
const NewBrand = () => {
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState("");
  const { mutateAsync, isPending } = useCreateBrand();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      brandName: "",
      brandLogo: undefined,
      description: "",
      status: "Active",
    },
  });

  // 1. Get the file input ref and props
  const {
    ref: fileRef,
    onChange: fileOnChange,
    ...fileRest
  } = register("brandLogo");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setValue("brandLogo", file, { shouldValidate: true });

      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setValue("brandLogo", undefined, { shouldValidate: true }); // ✅ important
      setLogoPreview("");
    }
  };

  // 3. Combine props for file input
  const fileInputProps = {
    ...fileRest,
    ref: (e) => {
      fileRef(e);
      // You can save the ref if needed
    },
    onChange: (e) => {
      fileOnChange(e); // RHForm's onChange
      handleFileChange(e); // Our custom handler
    },
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const formData = new FormData();
      formData.append("brandName", data.brandName);
      formData.append("description", data.description);
      formData.append("status", data.status);

      if (data.brandLogo) {
        formData.append("brandLogo", data.brandLogo);
      }

      const response = await mutateAsync(formData);

      if (response?.data?.success) {
        toast.success("Brand created successfully!");
        navigate(`/item/brand/${response.data.data.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // In your file input JSX, replace with:

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaBox className="mr-2 text-blue-500" />
              New Brand
            </h2>
            <p className="text-gray-600 mt-1">
              Please enter all required details for the new brand
            </p>
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
              {section.fields.map((field, fieldIndex) => (
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
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
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
                      placeholder={field.placeholder}
                      rows="3"
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  ) : field.type === "file" ? (
                    <div className="flex items-center">
                      <label
                        htmlFor="brandLogo"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                          errors[field.name]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FaImage className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, SVG (MAX. 5MB)
                          </p>
                        </div>
                      </label>

                      <input
                        id="brandLogo"
                        type="file"
                        accept="image/*"
                        {...fileInputProps}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <input
                      id={field.name}
                      type={field.type}
                      {...register(field.name)}
                      placeholder={field.placeholder}
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  )}
                  {errors[field.name] && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <LoadingButton type="submit" isLoading={isPending}>
            Create Brand
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewBrand;
