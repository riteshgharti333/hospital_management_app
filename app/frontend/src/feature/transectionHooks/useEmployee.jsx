import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEmployeeAPI,
  getAllEmployeesAPI,
  getEmployeeByIdAPI,
  updateEmployeeAPI,
  deleteEmployeeAPI,
} from "../transectionApi/employeeApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// GET ALL EMPLOYEES
export const useGetEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data } = await getAllEmployeesAPI();
      return data?.data || [];
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// GET EMPLOYEE BY ID
export const useGetEmployeeById = (id) => {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: async () => {
      const { data } = await getEmployeeByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE EMPLOYEE
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployeeAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Employee created successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE EMPLOYEE
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateEmployeeAPI(id, data),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Employee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE EMPLOYEE
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployeeAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Employee deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
