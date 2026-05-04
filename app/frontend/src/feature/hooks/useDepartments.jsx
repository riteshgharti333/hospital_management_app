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

// GET ALL with cursor pagination
export const useGetDepartments = (cursor) => {
  return useQuery({
    queryKey: ["department", cursor],
    queryFn: async () => {
      const { data } = await getAllDepartmentsAPI(cursor);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    enabled: true,
  });
};

// SEARCH with cursor
export const useSearchDepartments = (searchTerm, cursor) => {
  return useQuery({
    queryKey: ["department-search", searchTerm, cursor],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], pagination: {} };
      }
      const { data } = await searchDepartmentAPI(searchTerm, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    keepPreviousData: true,
  });
};

// FILTER with cursor
export const useFilterDepartments = (filters, cursor) => {
  return useQuery({
    queryKey: ["department-filter", filters, cursor],
    queryFn: async () => {
      const { data } = await filterDepartmentAPI(filters, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters && Object.keys(filters).length > 0,
    retry: 1,
    keepPreviousData: true,
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
        response?.data?.message || "Department created successfully",
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
        response?.data?.message || "Department updated successfully",
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
        response?.data?.message || "Department deleted successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["department"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
