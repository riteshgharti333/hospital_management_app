import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPrescriptionAPI,
  deletePrescriptionAPI,
  getAllPrescriptionsAPI,
  getPrescriptionByIdAPI,
  updatePrescriptionAPI,
  filterPrescriptionsAPI,
  searchPrescriptionsAPI,
  getPrescriptionsByAdmissionIdAPI,
  uploadPrescriptionDocAPI,
} from "../api/prescriptionApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// GET ALL PRESCRIPTIONS (with pagination)
// GET ALL with cursor pagination
export const useGetPrescriptions = (cursor) => {
  return useQuery({
    queryKey: ["prescription", cursor],
    queryFn: async () => {
      const { data } = await getAllPrescriptionsAPI(cursor);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    enabled: true,
  });
};

// SEARCH with cursor
export const useSearchPrescriptions = (searchTerm, cursor) => {
  return useQuery({
    queryKey: ["prescription-search", searchTerm, cursor],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], pagination: {} };
      }
      const { data } = await searchPrescriptionsAPI(searchTerm, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    keepPreviousData: true,
  });
};

// FILTER with cursor
export const useFilterPrescriptions = (filters, cursor) => {
  return useQuery({
    queryKey: ["prescription-filter", filters, cursor],
    queryFn: async () => {
      const { data } = await filterPrescriptionsAPI(filters, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters && Object.keys(filters).length > 0,
    retry: 1,
    keepPreviousData: true,
  });
};

// FETCH PRESCRIPTION BY ID
export const useGetPrescriptionById = (id) => {
  return useQuery({
    queryKey: ["prescription", id],
    queryFn: async () => {
      const { data } = await getPrescriptionByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE PRESCRIPTION
export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPrescriptionAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Prescription created successfully");
      queryClient.invalidateQueries({ queryKey: ["prescription"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE PRESCRIPTION
export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePrescriptionAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Prescription updated successfully");
      queryClient.invalidateQueries({ queryKey: ["prescription"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE PRESCRIPTION
export const useDeletePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePrescriptionAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Prescription deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["prescription"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};



// GET PRESCRIPTIONS BY ADMISSION ID
export const useGetPrescriptionsByAdmissionId = (admissionId) => {
  return useQuery({
    queryKey: ["prescription", "admission", admissionId],
    queryFn: async () => {
      const { data } = await getPrescriptionsByAdmissionIdAPI(admissionId);
      return data?.data || [];
    },
    enabled: !!admissionId,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPLOAD PRESCRIPTION DOCUMENT
export const useUploadPrescriptionDoc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadPrescriptionDocAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Document uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["prescription"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};