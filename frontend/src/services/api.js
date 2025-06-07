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
 * Fetches all forms available.
 * @returns {Promise<Array>} A promise that resolves to an array of forms.
 */
export const getAllForms = async () => {
  try {
    const response = await apiClient.get('/forms/');
    return response.data;
  } catch (error) {
    console.error('Error fetching all forms:', error);
    throw error;
  }
};

/**
 * Updates a form with new data.
 * @param {number} formId The ID of the form to update.
 * @param {object} formData The updated form data.
 * @returns {Promise<object>} A promise that resolves to the updated form.
 */
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

// ===== NEW: CREATE OPERATIONS =====

/**
 * Creates a new page in a form.
 * @param {number} formId The ID of the form to add the page to.
 * @param {object} pageData The page data (pageNumber, etc.).
 * @returns {Promise<object>} A promise that resolves to the created page.
 */
export const createPage = async (formId, pageData) => {
  try {
    const response = await apiClient.post(`/forms/${formId}/pages`, pageData);
    return response.data;
  } catch (error) {
    console.error(`Error creating page in form ${formId}:`, error);
    throw error;
  }
};

/**
 * Creates a new component in a page.
 * @param {number} pageId The ID of the page to add the component to.
 * @param {object} componentData The component data (type, label, attributes, etc.).
 * @returns {Promise<object>} A promise that resolves to the created component.
 */
export const createComponent = async (pageId, componentData) => {
  try {
    const response = await apiClient.post(`/pages/${pageId}/components`, componentData);
    return response.data;
  } catch (error) {
    console.error(`Error creating component in page ${pageId}:`, error);
    throw error;
  }
};

/**
 * Creates a new nested component inside a parent component.
 * @param {number} parentComponentId The ID of the parent component.
 * @param {object} componentData The component data (type, label, attributes, etc.).
 * @returns {Promise<object>} A promise that resolves to the created component.
 */
export const createNestedComponent = async (parentComponentId, componentData) => {
  try {
    const response = await apiClient.post(`/components/${parentComponentId}/components`, componentData);
    return response.data;
  } catch (error) {
    console.error(`Error creating nested component in component ${parentComponentId}:`, error);
    throw error;
  }
};

// ===== NEW: DELETE OPERATIONS =====

/**
 * Deletes a page by ID.
 * @param {number} pageId The ID of the page to delete.
 * @returns {Promise<void>} A promise that resolves when the page is deleted.
 */
export const deletePage = async (pageId) => {
  try {
    await apiClient.delete(`/pages/${pageId}`);
  } catch (error) {
    console.error(`Error deleting page ${pageId}:`, error);
    throw error;
  }
};

/**
 * Deletes a component by ID.
 * @param {number} componentId The ID of the component to delete.
 * @returns {Promise<void>} A promise that resolves when the component is deleted.
 */
export const deleteComponent = async (componentId) => {
  try {
    await apiClient.delete(`/components/${componentId}`);
  } catch (error) {
    console.error(`Error deleting component ${componentId}:`, error);
    throw error;
  }
};

// ===== NEW: MOVE/REORDER OPERATIONS =====

/**
 * Moves a component to a different page or parent component.
 * @param {number} componentId The ID of the component to move.
 * @param {object} moveData The move data { targetPageId?, targetParentComponentId? }.
 * @returns {Promise<object>} A promise that resolves to the moved component.
 */
export const moveComponent = async (componentId, moveData) => {
  try {
    const response = await apiClient.put(`/components/${componentId}/move`, moveData);
    return response.data;
  } catch (error) {
    console.error(`Error moving component ${componentId}:`, error);
    throw error;
  }
};

/**
 * Reorders pages within a form.
 * @param {number} formId The ID of the form.
 * @param {Array<number>} pageIds Array of page IDs in the desired order.
 * @returns {Promise<object>} A promise that resolves to the updated form.
 */
export const reorderPages = async (formId, pageIds) => {
  try {
    const response = await apiClient.put(`/forms/${formId}/pages/reorder`, { pageIds });
    return response.data;
  } catch (error) {
    console.error(`Error reordering pages in form ${formId}:`, error);
    throw error;
  }
};

/**
 * Reorders components within a page or parent component.
 * @param {number} containerId The ID of the page or parent component.
 * @param {string} containerType Either 'page' or 'component'.
 * @param {Array<number>} componentIds Array of component IDs in the desired order.
 * @returns {Promise<object>} A promise that resolves to the updated container.
 */
export const reorderComponents = async (containerId, containerType, componentIds) => {
  try {
    const endpoint = containerType === 'page' 
      ? `/pages/${containerId}/components/reorder`
      : `/components/${containerId}/components/reorder`;
    const response = await apiClient.put(endpoint, { componentIds });
    return response.data;
  } catch (error) {
    console.error(`Error reordering components in ${containerType} ${containerId}:`, error);
    throw error;
  }
};

// Add other API functions as needed (create, delete for forms, pages, components)
// For now, focusing on what's needed for the tree view and attribute editing.

export default apiClient;
