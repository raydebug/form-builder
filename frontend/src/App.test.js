import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the API service
jest.mock('./services/api', () => ({
  getForm: jest.fn(),
  getAllForms: jest.fn(),
  updateForm: jest.fn(),
  updatePage: jest.fn(),
  updateComponent: jest.fn()
}));

import { getAllForms, getForm } from './services/api';

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Form Builder header', async () => {
    // Mock successful response with at least one form to avoid critical error state
    const mockForms = [{ id: 1, name: 'Test Form' }];
    const mockForm = {
      id: 1,
      name: 'Test Form',
      description: 'Test Description',
      pages: []
    };

    getAllForms.mockResolvedValue(mockForms);
    getForm.mockResolvedValue(mockForm);
    
    await act(async () => {
      render(<App />);
    });
    
    expect(screen.getByText('Form Builder')).toBeInTheDocument();
  });

  test('displays loading message when no forms available', async () => {
    getAllForms.mockResolvedValue([]);
    
    await act(async () => {
      render(<App />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/No forms available to display/)).toBeInTheDocument();
    });
  });

  test('loads and displays form when forms are available', async () => {
    const mockForms = [{ id: 1, name: 'Test Form' }];
    const mockForm = {
      id: 1,
      name: 'Test Form',
      description: 'Test Description',
      pages: []
    };

    getAllForms.mockResolvedValue(mockForms);
    getForm.mockResolvedValue(mockForm);
    
    await act(async () => {
      render(<App />);
    });
    
    await waitFor(() => {
      // Look for just the form name without ID display
      expect(screen.getByText('Test Form')).toBeInTheDocument();
    });
  });

  test('displays error message when API fails', async () => {
    getAllForms.mockRejectedValue(new Error('API Error'));
    
    await act(async () => {
      render(<App />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch initial list of forms/)).toBeInTheDocument();
    });
  });
});
