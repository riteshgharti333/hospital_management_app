import axiosInstance from "../../utils/axiosInstance";

// CREATE EMPLOYEE
export const createEmployeeAPI = (data) =>
  axiosInstance.post("/transection/employee", data);

// GET ALL EMPLOYEES
export const getAllEmployeesAPI = () =>
  axiosInstance.get("/transection/employee");

// GET SINGLE EMPLOYEE BY ID
export const getEmployeeByIdAPI = (id) =>
  axiosInstance.get(`/transection/employee/${id}`);

// UPDATE EMPLOYEE
export const updateEmployeeAPI = (id, data) =>
  axiosInstance.patch(`/transection/employee/${id}`, data);

// DELETE EMPLOYEE
export const deleteEmployeeAPI = (id) =>
  axiosInstance.delete(`/transection/employee/${id}`);
