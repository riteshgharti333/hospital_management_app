import axiosInstance from "../../utils/axiosInstance";

// CREATE
export const createAppointmentAPI = (data) =>
  axiosInstance.post("/appointment", data);

// GET ALL (paginated)
export const getAllAppointmentsAPI = (cursor, limit) =>
  axiosInstance.get("/appointment", {
    params: {
      cursor: cursor ? encodeURIComponent(cursor) : undefined,
      limit,
    },
  });

// FILTER
export const filterAppointmentAPI = (filters) =>
  axiosInstance.get("/appointment/filter", {
    params: filters,
  });

// SEARCH
export const searchAppointmentAPI = (searchTerm) =>
  axiosInstance.get("/appointment/search", {
    params: { query: searchTerm },
  });

// GET BY ID
export const getAppointmentByIdAPI = (id) =>
  axiosInstance.get(`/appointment/${id}`);

// GET APPOINTMENTS BY DOCTOR
export const getAppointmentsByDoctorAPI = (doctorId) =>
  axiosInstance.get(`/appointment/doctor/${doctorId}`);

// GET AVAILABLE SLOTS
export const getAvailableSlotsAPI = (doctorId, date) =>
  axiosInstance.get(`/appointment/doctor/${doctorId}/available-slots`, {
    params: { date },
  });

// UPDATE
export const updateAppointmentAPI = (id, data) =>
  axiosInstance.put(`/appointment/${id}`, data);

// CANCEL APPOINTMENT
export const cancelAppointmentAPI = (id) =>
  axiosInstance.patch(`/appointment/${id}/cancel`);

// DELETE
export const deleteAppointmentAPI = (id) =>
  axiosInstance.delete(`/appointment/${id}`);

// UPDATE EXPIRED (Admin only)
export const updateExpiredAppointmentsAPI = () =>
  axiosInstance.post("/appointment/expired/update");