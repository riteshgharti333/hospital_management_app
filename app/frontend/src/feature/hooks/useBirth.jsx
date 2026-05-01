import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBirthRecordAPI,
  deleteBirthRecordAPI,
  getAllBirthRecordsAPI,
  getBirthRecordByIdAPI,
  updateBirthRecordAPI,
  filterBirthRecordsAPI,
  searchBirthRecordsAPI,
} from "../api/birthApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// Normal birth records list
export const useGetBirthRecords = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["birth", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllBirthRecordsAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: false,
    staleTime: 0,          
    retry: 1,
  });
};

// Filter birth records
export const useFilterBirthRecords = (filters) => {
  return useQuery({
    queryKey: ["birth-filter", filters],
    queryFn: async () => {
      const { data } = await filterBirthRecordsAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// FETCH BIRTH RECORD BY ID
export const useGetBirthRecordById = (id) => {
  return useQuery({
    queryKey: ["birth", id],
    queryFn: async () => {
      const { data } = await getBirthRecordByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE BIRTH RECORD
export const useCreateBirthRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBirthRecordAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Birth record created successfully");
      queryClient.invalidateQueries({ queryKey: ["birth"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE BIRTH RECORD
export const useUpdateBirthRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBirthRecordAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Birth record updated successfully");
      queryClient.invalidateQueries({ queryKey: ["birth"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE BIRTH RECORD
export const useDeleteBirthRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBirthRecordAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Birth record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["birth"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// SEARCH BIRTH RECORDS
export const useSearchBirthRecords = (searchTerm) => {
  return useQuery({
    queryKey: ["birth-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchBirthRecordsAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};