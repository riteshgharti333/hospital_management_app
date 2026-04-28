import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDepartmentAPI,
  deleteDepartmentAPI,
  getAllDepartmentsAPI,
  getDepartmentByIdAPI,
  updateDepartmentAPI,
  filterDepartmentAPI,
  searchDepartmentAPI,
} from "../api/departmentApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// GET ALL
export const useGetDepartments = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["department", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllDepartmentsAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: false,
    staleTime: 0,
    retry: 1,
  });
};

// FILTER
export const useFilterDepartments = (filters) => {
  return useQuery({
    queryKey: ["department-filter", filters],
    queryFn: async () => {
      const { data } = await filterDepartmentAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// SEARCH
export const useSearchDepartments = (searchTerm) => {
  return useQuery({
    queryKey: ["department-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchDepartmentAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

// GET BY ID
export const useGetDepartmentById = (id) => {
  return useQuery({
    queryKey: ["department", id],
    queryFn: async () => {
      const { data } = await getDepartmentByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepartmentAPI,
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Department created successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["department"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDepartmentAPI(id, data),
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Department updated successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["department"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartmentAPI,
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Department deleted successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["department"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};