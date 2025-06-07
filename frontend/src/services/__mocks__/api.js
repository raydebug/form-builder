// Mock implementation for testing
export const getForm = jest.fn();
export const getAllForms = jest.fn();
export const updateForm = jest.fn();
export const updatePage = jest.fn();
export const updateComponent = jest.fn();

const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

export default mockApiClient; 