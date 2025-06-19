import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBirthRecordAPI,
  deleteBirthRecordAPI,
  getAllBirthRecordsAPI,
  getBirthRecordByIdAPI,
  updateBirthRecordAPI,
} from "../api/birthApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// ✅ Fetch all birth records
export const useGetBirthRecords = () => {
  return useQuery({
    queryKey: ["birth"],
    queryFn: async () => {
      const { data } = await getAllBirthRecordsAPI();
      return data?.data || [];
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// ✅ Fetch a single birth record by ID
export const useGetBirthRecordById = (id) => {
  return useQuery({
    queryKey: ["birth", id],
    queryFn: async () => {
      const { data } = await getBirthRecordByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// ✅ Create a new birth record
export const useCreateBirthRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBirthRecordAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Birth record created successfully");
      queryClient.invalidateQueries({ queryKey: ["birth"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// ✅ Update a birth record
export const useUpdateBirthRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBirthRecordAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.message || "Birth record updated successfully");
      queryClient.invalidateQueries({ queryKey: ["birth"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// ✅ Delete a birth record
export const useDeleteBirthRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBirthRecordAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Birth record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["birth"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
