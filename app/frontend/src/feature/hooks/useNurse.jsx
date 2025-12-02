import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNurseAPI,
  deleteNurseAPI,
  getAllNursesAPI,
  getNurseByIdAPI,
  updateNurseAPI,
  filterNurseAPI,
} from "../api/nurseApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// Normal nurses list

export const useGetNurses = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["nurse", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllNursesAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// Filtered nurses list
export const useFilterNurses = (filters) => {
  return useQuery({
    queryKey: ["nurse-filter", filters],
    queryFn: async () => {
      const { data } = await filterNurseAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
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
