import { axiosInstance } from '../utils/config';

export const checkSurveyExists = () => {
  return axiosInstance.get('/surveys/exists');
};

export const createSurvey = (formData) => {
  return axiosInstance.post('surveys', formData);
};

export const getSurvey = (id) => {
  return axiosInstance.get(`surveys/${id}`);
};

export const addChainage = (formData) => {
  return axiosInstance.post('surveys/chainage', formData);
};
