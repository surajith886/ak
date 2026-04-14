import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { mapMedicine, mapNotification, mapOrder } from "@/lib/mappers";
import { Medicine, Notification, Order, OrderStatus } from "@/types";

interface MedicineQuery {
  category?: string;
  keyword?: string;
}

export const useMedicines = (query?: MedicineQuery) =>
  useQuery({
    queryKey: ["medicines", query],
    queryFn: async () => {
      const response = await api.get("/medicines", { params: query });
      return response.data.map(mapMedicine) as Medicine[];
    },
  });

export const useCreateMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Medicine, "id">) => {
      const response = await api.post("/medicines", payload);
      return mapMedicine(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ medicineId, payload }: { medicineId: string; payload: Omit<Medicine, "id"> }) => {
      const response = await api.put(`/medicines/${medicineId}`, payload);
      return mapMedicine(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (medicineId: string) => {
      await api.delete(`/medicines/${medicineId}`);
      return medicineId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      items: Order["items"];
      total: number;
      prescriptionUrl?: string;
      prescriptionRequired: boolean;
    }) => {
      const response = await api.post("/orders", payload);
      return mapOrder(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get("/orders");
      return response.data.map(mapOrder) as Order[];
    },
  });

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return mapOrder(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useNotifications = () =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get("/notifications");
      return response.data.map(mapNotification) as Notification[];
    },
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return mapNotification(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
