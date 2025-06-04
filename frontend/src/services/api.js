import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Adjust if your backend runs elsewhere

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches a single form with its full structure.
 * NOTE: This assumes the backend endpoint /api/forms/{formId} returns
 * the form with all its pages, and those pages with all their components,
 * including nested components. If not, this needs adjustment or backend changes.
 * @param {number} formId The ID of the form to fetch.
 * @returns {Promise<object>} A promise that resolves to the form data.
 */
export const getForm = async (formId) => {
  try {
    const response = await apiClient.get(`/forms/${formId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching form with id ${formId}:`, error);
    throw error;
  }
};

/**
 * Fetches all forms.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of forms.
 */
export const getAllForms = async () => {
  try {
    const response = await apiClient.get('/forms/'); // Note: trailing slash matches FormController
    return response.data;
  } catch (error) {
    console.error('Error fetching all forms:', error);
    throw error;
  }
};

export const updateForm = async (formId, formData) => {
  try {
    const response = await apiClient.put(`/forms/${formId}`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error updating form ${formId}:`, error);
    throw error;
  }
};

export const updatePage = async (pageId, pageData) => {
  try {
    const response = await apiClient.put(`/pages/${pageId}`, pageData);
    return response.data;
  } catch (error) {
    console.error(`Error updating page ${pageId}:`, error);
    throw error;
  }
};

export const updateComponent = async (componentId, componentData) => {
  try {
    const response = await apiClient.put(`/components/${componentId}`, componentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating component ${componentId}:`, error);
    throw error;
  }
};


// Add other API functions as needed (create, delete for forms, pages, components)
// For now, focusing on what's needed for the tree view and attribute editing.

export default apiClient;
