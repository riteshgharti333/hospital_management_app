import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNurseAPI,
  deleteNurseAPI,
  getAllNursesAPI,
  getNurseByIdAPI,
  updateNurseAPI,
} from "../api/nurseApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// FETCH ALL NURSES
export const useGetNurses = () => {
  return useQuery({
    queryKey: ["nurse"],
    queryFn: async () => {
      const { data } = await getAllNursesAPI();
      return data?.data || [];
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// FETCH NURSE BY ID
export const useGetNurseById = (id) => {
  return useQuery({
    queryKey: ["nurse", id],
    queryFn: async () => {
      const { data } = await getNurseByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE NURSE
export const useCreateNurse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNurseAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Nurse created successfully");
      queryClient.invalidateQueries({ queryKey: ["nurse"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE NURSE
export const useUpdateNurse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateNurseAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.message || "Nurse updated successfully");
      queryClient.invalidateQueries({ queryKey: ["nurse"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE NURSE
export const useDeleteNurse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNurseAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Nurse deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["nurse"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
