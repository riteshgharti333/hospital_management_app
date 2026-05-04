import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPatientRecordAPI,
  deletePatientRecordAPI,
  filterPatientAPI,
  getAllPatientsAPI,
  getPatientRecordByIdAPI,
  searchPatientAPI,
  updatePatientRecordAPI,
} from "../api/patientApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// Normal patients with cursor pagination
export const useGetPatients = (cursor) => {
  return useQuery({
    queryKey: ["patient", cursor],
    queryFn: async () => {
      const { data } = await getAllPatientsAPI(cursor);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    enabled: true,
  });
};

// Search patients with cursor
export const useSearchPatients = (searchTerm, cursor) => {
  return useQuery({
    queryKey: ["patient-search", searchTerm, cursor],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], pagination: {} };
      }
      const { data } = await searchPatientAPI(searchTerm, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    keepPreviousData: true,
  });
};

// Filter patients with cursor
export const useFilterPatients = (filters, cursor) => {
  return useQuery({
    queryKey: ["patient-filter", filters, cursor],
    queryFn: async () => {
      const { data } = await filterPatientAPI(filters, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters && Object.keys(filters).length > 0,
    retry: 1,
    keepPreviousData: true,
  });
};
//  Fetch a single patient record by ID
export const useGetPatientById = (id) => {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      const { data } = await getPatientRecordByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

//  Create a new patient record
export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPatientRecordAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Patient record created successfully");
      queryClient.invalidateQueries({ queryKey: ["patient"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

//  Update an existing patient record
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePatientRecordAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.message || "Patient record updated successfully");
      queryClient.invalidateQueries({ queryKey: ["patient"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

//  Delete a patient record
export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePatientRecordAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Patient record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["patient"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};


