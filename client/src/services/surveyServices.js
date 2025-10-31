import { axiosInstance } from '../utils/config';

export const checkSurveyExists = () => {
  return axiosInstance.get('surveys/exists');
};

export const getAllSurvey = () => {
  return axiosInstance.get('surveys');
};

export const createSurvey = (formData) => {
  return axiosInstance.post('surveys', formData);
};

export const getSurvey = (id) => {
  return axiosInstance.get(`surveys/${id}`);
};

export const updateSurvey = (id) => {
  return axiosInstance.patch(`surveys/${id}`);
};

export const deleteSurvey = (id) => {
  return axiosInstance.delete(`surveys/${id}`);
};

export const addSurveyRow = (id, formData) => {
  return axiosInstance.post(`surveys/${id}/rows`, formData);
};

export const endSurvey = (id) => {
  return axiosInstance.patch(`surveys/${id}/end`);
};

export const updateSurveyRow = (id, rowId) => {
  return axiosInstance.patch(`surveys/${id}/rows/${rowId}`);
};

export const deleteSurveyRow = (id) => {
  return axiosInstance.delete(`surveys/${id}/rows/${rowId}`);
};
