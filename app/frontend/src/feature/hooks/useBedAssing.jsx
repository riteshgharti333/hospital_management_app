import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBedAssignmentAPI,
  deleteBedAssignmentAPI,
  getAllBedAssignmentsAPI,
  getBedAssignmentByIdAPI,
  updateBedAssignmentAPI,
  dischargePatientAPI,
} from "../api/bedAssignApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// FETCH ALL BED ASSIGNMENTS
export const useGetBedAssignments = () => {
  return useQuery({
    queryKey: ["bed-assign"],
    queryFn: async () => {
      const { data } = await getAllBedAssignmentsAPI();
      return data?.data || [];
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// FETCH BED ASSIGNMENT BY ID
export const useGetBedAssignmentById = (id) => {
  return useQuery({
    queryKey: ["bed-assign", id],
    queryFn: async () => {
      const { data } = await getBedAssignmentByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE BED ASSIGNMENT
export const useCreateBedAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBedAssignmentAPI,
    onSuccess: (response) => {
      console.log("hello")
      
      console.log(response)
      toast.success(response?.message || "Bed assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["bed-assign"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE BED ASSIGNMENT
export const useUpdateBedAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBedAssignmentAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.message || "Bed assignment updated");
      queryClient.invalidateQueries({ queryKey: ["bed-assign"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE BED ASSIGNMENT
export const useDeleteBedAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBedAssignmentAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Bed assignment deleted");
      queryClient.invalidateQueries({ queryKey: ["bed-assign"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DISCHARGE PATIENT
export const useDischargePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dischargePatientAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Patient discharged successfully");
      queryClient.invalidateQueries({ queryKey: ["bed-assign"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
