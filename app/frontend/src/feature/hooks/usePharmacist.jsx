import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPharmacistAPI,
  deletePharmacistAPI,
  getAllPharmacistsAPI,
  getPharmacistByIdAPI,
  updatePharmacistAPI,
} from "../api/pharmacistApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// GET ALL PHARMACISTS
export const useGetPharmacists = () => {
  return useQuery({
    queryKey: ["pharmacist"],
    queryFn: async () => {
      const { data } = await getAllPharmacistsAPI();
      return data?.data || [];
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// GET PHARMACIST BY ID
export const useGetPharmacistById = (id) => {
  return useQuery({
    queryKey: ["pharmacist", id],
    queryFn: async () => {
      const { data } = await getPharmacistByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE PHARMACIST
export const useCreatePharmacist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPharmacistAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Pharmacist created successfully");
      queryClient.invalidateQueries({ queryKey: ["pharmacist"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE PHARMACIST
export const useUpdatePharmacist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePharmacistAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Pharmacist updated successfully");
      queryClient.invalidateQueries({ queryKey: ["pharmacist"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE PHARMACIST
export const useDeletePharmacist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePharmacistAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Pharmacist deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pharmacist"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
