import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormTree from './FormTree';

const mockForm = {
  id: 1,
  name: 'Test Form',
  description: 'Test Description',
  pages: [
    {
      id: 1,
      name: 'Personal Information',
      components: [
        {
          id: 1,
          label: 'First Name',
          componentType: 'TEXT_INPUT',
          childComponents: []
        }
      ]
    }
  ]
};

describe('FormTree Component', () => {
  const mockOnSelectNode = jest.fn();

  beforeEach(() => {
    mockOnSelectNode.mockClear();
  });

  test('renders form tree with form name', () => {
    render(
      <FormTree 
        form={mockForm} 
        onSelectNode={mockOnSelectNode}
        selectedNodeId={null}
        selectedNodeType={null}
      />
    );

    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  test('calls onSelectNode when form is clicked', () => {
    render(
      <FormTree 
        form={mockForm} 
        onSelectNode={mockOnSelectNode}
        selectedNodeId={null}
        selectedNodeType={null}
      />
    );

    const formNode = screen.getByText('Test Form');
    fireEvent.click(formNode);

    expect(mockOnSelectNode).toHaveBeenCalledWith(mockForm, 'form');
  });

  test('applies selected styling when form is selected', () => {
    render(
      <FormTree 
        form={mockForm} 
        onSelectNode={mockOnSelectNode}
        selectedNodeId={1}
        selectedNodeType="form"
      />
    );

    const formNode = screen.getByText('Test Form').closest('.form-node');
    expect(formNode).toHaveClass('selected-node');
  });

  test('displays placeholder message when form is null', () => {
    render(
      <FormTree 
        form={null} 
        onSelectNode={mockOnSelectNode}
        selectedNodeId={null}
        selectedNodeType={null}
      />
    );

    expect(screen.getByText('No form data available.')).toBeInTheDocument();
  });
}); 