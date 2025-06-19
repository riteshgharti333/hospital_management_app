import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllVouchersAPI,
  getVoucherByIdAPI,
  createVoucherAPI,
  updateVoucherAPI,
  deleteVoucherAPI,
} from "../transectionApi/voucherApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

//  FETCH ALL VOUCHERS
export const useGetVouchers = () => {
  return useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => {
      const { data } = await getAllVouchersAPI();
      return data?.data || [];
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// FETCH A SINGLE VOUCHER BY ID
export const useGetVoucherById = (id) => {
  return useQuery({
    queryKey: ["vouchers", id],
    queryFn: async () => {
      const { data } = await getVoucherByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE A NEW VOUCHER
export const useCreateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVoucherAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Voucher created successfully");
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

//  UPDATE AN EXISTING VOUCHER
export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateVoucherAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Voucher updated successfully");
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

//  DELETE A VOUCHER
export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVoucherAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Voucher deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
