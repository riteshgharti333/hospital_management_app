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

// Normal nurse records with cursor pagination
export const useGetNurseRecords = (cursor) => {
  return useQuery({
    queryKey: ["nurse", cursor],
    queryFn: async () => {
      const { data } = await getAllNurseRecordsAPI(cursor);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    enabled: true,
  });
};

// Search nurse records with cursor
export const useSearchNurseRecords = (searchTerm, cursor) => {
  return useQuery({
    queryKey: ["nurse-search", searchTerm, cursor],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], pagination: {} };
      }
      const { data } = await searchNurseRecordsAPI(searchTerm, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    keepPreviousData: true,
  });
};

// Filter nurse records with cursor
export const useFilterNurseRecords = (filters, cursor) => {
  return useQuery({
    queryKey: ["nurse-filter", filters, cursor],
    queryFn: async () => {
      const { data } = await filterNurseRecordsAPI(filters, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters && Object.keys(filters).length > 0,
    retry: 1,
    keepPreviousData: true,
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
      toast.success(
        response?.data?.message || "Nurse record created successfully",
      );
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
      toast.success(
        response?.data?.message || "Nurse record updated successfully",
      );
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
      toast.success(
        response?.data?.message || "Nurse record deleted successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["nurse"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
