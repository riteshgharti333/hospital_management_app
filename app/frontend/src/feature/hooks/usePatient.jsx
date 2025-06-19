import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPatientRecordAPI,
  deletePatientRecordAPI,
  getAllPatientRecordsAPI,
  getPatientRecordByIdAPI,
  updatePatientRecordAPI,
} from "../api/patientApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// Fetch all patient records
export const useGetPatients = () => {
  return useQuery({
    queryKey: ["patient"],
    queryFn: async () => {
      const { data } = await getAllPatientRecordsAPI();
     
      return data?.data || [];
    },
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
