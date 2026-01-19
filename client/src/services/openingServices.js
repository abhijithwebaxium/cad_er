import { axiosInstance } from "../utils/config";

export const createOpening = async (data) => {
  return await axiosInstance.post("/openings", data);
};

export const getAllOpenings = async () => {
  return await axiosInstance.get("/openings");
};
