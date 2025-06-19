import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAmbulanceAPI,
  deleteAmbulanceAPI,
  getAllAmbulancesAPI,
  getAmbulanceByIdAPI,
  updateAmbulanceAPI,
} from "../api/ambulanceApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetAmbulances = () => {
  return useQuery({
    queryKey: ["ambulance"],
    queryFn: async () => {
      const { data } = await getAllAmbulancesAPI();
      return data?.data || [];
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetAmbulanceById = (id) => {
  return useQuery({
    queryKey: ["ambulance", id],
    queryFn: async () => {
      const { data } = await getAmbulanceByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useCreateAmbulance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAmbulanceAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Ambulance created successfully");
      queryClient.invalidateQueries({ queryKey: ["ambulance"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateAmbulance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAmbulanceAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.message || "Ambulance updated successfully");
      queryClient.invalidateQueries({ queryKey: ["ambulance"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteAmbulance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAmbulanceAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Ambulance deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["ambulance"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
