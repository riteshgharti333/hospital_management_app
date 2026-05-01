import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNurseRecordAPI,
  deleteNurseRecordAPI,
  getAllNurseRecordsAPI,
  getNurseRecordByIdAPI,
  updateNurseRecordAPI,
  filterNurseRecordsAPI,
  searchNurseRecordsAPI,
} from "../api/nurseApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// Normal nurse records list
export const useGetNurseRecords = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["nurse", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllNurseRecordsAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: false,
    staleTime: 0,          
    retry: 1,
  });
};

// Filter nurse records
export const useFilterNurseRecords = (filters) => {
  return useQuery({
    queryKey: ["nurse-filter", filters],
    queryFn: async () => {
      const { data } = await filterNurseRecordsAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// FETCH NURSE RECORD BY ID
export const useGetNurseRecordById = (id) => {
  return useQuery({
    queryKey: ["nurse", id],
    queryFn: async () => {
      const { data } = await getNurseRecordByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE NURSE RECORD
export const useCreateNurseRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNurseRecordAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Nurse record created successfully");
      queryClient.invalidateQueries({ queryKey: ["nurse"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE NURSE RECORD
export const useUpdateNurseRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateNurseRecordAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Nurse record updated successfully");
      queryClient.invalidateQueries({ queryKey: ["nurse"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE NURSE RECORD
export const useDeleteNurseRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNurseRecordAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Nurse record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["nurse"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// SEARCH NURSE RECORDS
export const useSearchNurseRecords = (searchTerm) => {
  return useQuery({
    queryKey: ["nurse-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchNurseRecordsAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};