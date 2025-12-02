import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPatientRecordAPI,
  deletePatientRecordAPI,
  filterPatientAPI,
  getAllPatientsAPI,
  getPatientRecordByIdAPI,
  updatePatientRecordAPI,
} from "../api/patientApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetPatients = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["patient", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllPatientsAPI(cursor, limit);
      return data || { data: [], pagination: {} }; // normalized like admissions
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// 🔹 Filter Patient List
export const useFilterPatients = (filters) => {
  return useQuery({
    queryKey: ["patient-filter", filters],
    queryFn: async () => {
      const { data } = await filterPatientAPI(filters);
      return data || { data: [], pagination: {} }; // same structure
    },
    enabled: !!filters,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
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
