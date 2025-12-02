import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllDepartmentsAPI,
  getDepartmentByIdAPI,
  createDepartmentAPI,
  updateDepartmentAPI,
  deleteDepartmentAPI,
  filterDepartmentAPI,
} from "../api/departmentApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// Normal list with pagination
export const useGetDepartments = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["department", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllDepartmentsAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// Filtered list
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

// FETCH A SINGLE DEPARTMENT BY ID
export const useGetDepartmentById = (id) => {
  return useQuery({
    queryKey: ["departments", id],
    queryFn: async () => {
      const { data } = await getDepartmentByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// ✅ CREATE A NEW DEPARTMENT
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepartmentAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Department created successfully");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

//  UPDATE AN EXISTING DEPARTMENT
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDepartmentAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.message || "Department updated successfully");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

//  DELETE A DEPARTMENT
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartmentAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Department deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
