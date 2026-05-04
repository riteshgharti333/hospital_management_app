import axiosInstance from "../../utils/axiosInstance";

// CREATE
export const createAppointmentAPI = (data) =>
  axiosInstance.post("/appointment", data);


// GET ALL (paginated)
export const getAllAppointmentsAPI = (cursor) =>
  axiosInstance.get("/appointment", {
    params: {
      cursor: cursor || undefined,
    },
  });

// SEARCH
export const searchAppointmentAPI = (searchTerm, cursor) =>
  axiosInstance.get("/appointment/search", {
    params: {
      query: searchTerm,
      cursor: cursor || undefined,
    },
  });

// FILTER
export const filterAppointmentAPI = (filters, cursor) =>
  axiosInstance.get("/appointment/filter", {
    params: {
      ...filters,
      cursor: cursor || undefined,
    },
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