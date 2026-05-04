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


// Normal birth records with cursor pagination
export const useGetBirthRecords = (cursor) => {
  return useQuery({
    queryKey: ["birth", cursor],
    queryFn: async () => {
      const { data } = await getAllBirthRecordsAPI(cursor);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    enabled: true,
  });
};

// Search birth records with cursor
export const useSearchBirthRecords = (searchTerm, cursor) => {
  return useQuery({
    queryKey: ["birth-search", searchTerm, cursor],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], pagination: {} };
      }
      const { data } = await searchBirthRecordsAPI(searchTerm, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    keepPreviousData: true,
  });
};

// Filter birth records with cursor
export const useFilterBirthRecords = (filters, cursor) => {
  return useQuery({
    queryKey: ["birth-filter", filters, cursor],
    queryFn: async () => {
      const { data } = await filterBirthRecordsAPI(filters, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters && Object.keys(filters).length > 0,
    retry: 1,
    keepPreviousData: true,
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

