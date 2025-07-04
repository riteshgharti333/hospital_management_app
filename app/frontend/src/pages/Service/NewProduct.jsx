import React, { useEffect, useState } from "react";
import { FaBoxes, FaTag, FaImage } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import { toast } from "sonner";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useCreateProduct } from "../../feature/itemHooks/useProduct";
import { productSchema } from "@hospital/schemas";

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

const NewProduct = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateProduct();
  const [previewImage, setPreviewImage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      productCode: "",
      parentCategory: "",
      subCategory: "",
      categoryLogo: undefined,
      description: "",
      unit: "",
      price: "",
      taxRate: "",
      status: "Active",
    },
  });

  const parentCategory = watch("parentCategory");
  const categoryLogoFile = watch("categoryLogo");

  useEffect(() => {
    setValue("subCategory", "");
  }, [parentCategory, setValue]);

  useEffect(() => {
    if (categoryLogoFile && categoryLogoFile.length > 0) {
      const file = categoryLogoFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage("");
    }
  }, [categoryLogoFile]);

  const [fileName, setFileName] = useState("");


  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name); // Just store the filename
      setValue("categoryLogo", file.name); // Store filename in form data
      
      // For preview (optional)
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
  console.log("Submitting:", data); // Will show filename string
  
  try {
    const response = await mutateAsync({
      ...data,
      categoryLogo: fileName || "" // Send the filename string
    });

    if (response?.data?.success) {
      toast.success("Product created successfully!");
      navigate(`/product/${response.data.data.id}`);
    }
  } catch (error) {
    console.log(error)
  }
};

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaTag className="mr-2 text-blue-500" />
              New Product
            </h2>
            <p className="text-gray-600 mt-1">
              Please enter all required details for the new product
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
                        className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white ${
                          error ? "border-red-500" : "border-gray-300"
                        } ${
                          field.dynamicOptions && !parentCategory
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={field.dynamicOptions && !parentCategory}
                      >
                        <option value="" disabled selected hidden>{field.placeholder}</option>
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
                        rows={3}
                        placeholder={field.placeholder}
                        className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          error ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    ) : field.type === "file" ? (
                      <div className="space-y-4">
                        <label
                          htmlFor={field.name}
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                            error ? "border-red-500" : "border-gray-300"
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
                        <input
    id="categoryLogo"
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
  />
                        </label>
                        {previewImage && !error && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Image Preview:
                            </p>
                            <div className="w-32 h-32 border border-gray-200 rounded-lg overflow-hidden p-1">
                              <img
                                src={previewImage}
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
                        placeholder={field.placeholder}
                        className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          error ? "border-red-500" : "border-gray-300"
                        }`}
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

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <LoadingButton isLoading={isPending} type="submit">
            Create Product
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewProduct;
