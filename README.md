# Form Builder

A web-based form builder application with a hierarchical structure that allows users to create, edit, and manage forms with multiple pages and nested components.

## Current Status ✅

- **Backend**: Spring Boot application with complete CRUD API endpoints
- **Frontend**: React application with tree view and attribute editing interface  
- **Database**: H2 in-memory database with sample data auto-loading
- **Testing**: Unit tests for frontend/backend, E2E tests with Cypress
- **Documentation**: Comprehensive setup and testing instructions

### Working Features
- ✅ Hierarchical form structure (Forms → Pages → Components)
- ✅ Interactive tree view with click-to-select functionality
- ✅ Real-time attribute editing with form validation
- ✅ JSON attribute configuration for components
- ✅ Sample data auto-loading for immediate testing
- ✅ Responsive three-panel layout
- ✅ Test coverage for core functionality
- ✅ Pages identified by names instead of numbers for better usability
- ✅ **NEW**: Dual add buttons feature with comprehensive E2E testing (14/14 tests passing)
- ✅ **NEW**: Ultra-narrow expandable FormTree: component-level expand/collapse, 8px component height

## Architecture

- **Backend**: Spring Boot 3.2.2 with Java 17
- **Frontend**: React 19.1.0 with modern JavaScript
- **Database**: H2 (in-memory for development)
- **API**: RESTful APIs with JSON communication

## Features

### Current Implementation

#### Backend Features
- **Hierarchical Form Structure**: Forms → Pages → Components (with nested child components)
- **Named Pages**: Pages use descriptive names instead of numbers for better organization
- **JPA/Hibernate Data Models**: Complete entity relationships with cascading operations
- **REST API Endpoints**: Full CRUD operations for Forms, Pages, and Components
- **Advanced Component Operations**: Move, reorder, and nested component management
- **Sample Data Loading**: Automatic test data generation on startup
- **Exception Handling**: Custom exceptions for entity not found scenarios

#### Frontend Features
- **Three-Panel Layout**: Left tree navigation, center visual editor, right attributes panel
- **Interactive Tree View**: Hierarchical display with expand/collapse functionality
- **Visual Page Editor**: Component visualization with drag-and-drop style interactions
- **Named Page Management**: Create and edit pages with meaningful names
- **Comprehensive CRUD Operations**: 
  - ✅ **Add Pages**: Click ➕ on form nodes to add new pages with custom names
  - ✅ **Add Components**: Multiple ways to add components (page editor, tree view, nested)
  - ✅ **Delete Operations**: Delete pages/components with confirmation dialogs
  - ✅ **Move/Reorder**: Up/down arrows to reorder pages and components
  - ✅ **Nested Components**: Create child components within parent components
- **Real-time Synchronization**: All panels update automatically after operations
- **Action Button System**: Hover-activated buttons (➕ ⬆️ ⬇️ 🗑️) for quick actions
- **Form Validation**: Client-side validation for all create/edit operations
- **Visual Feedback**: Color-coded component types, selection states, hover effects

### Form Structure
- **Form**: Has one or many pages with name and description
- **Page**: Has a descriptive name and one or more components
- **Component**: Has one or more child components or fields with configurable attributes
- **CRUD Operations**: Full create, read, update, delete support for all entities
- **Tree Navigation**: Left panel shows form tree structure with action buttons
- **Visual Editor**: Center panel for page/component visualization and direct manipulation
- **Attribute Editing**: Right panel displays current node's attributes for editing

### CRUD Operations Guide

#### Adding Pages
1. **From Form Node**: Hover over form in tree → Click ➕ → Enter page name → Submit
2. **Descriptive Names**: Pages use meaningful names like "Personal Information", "Contact Details", etc.
3. **Immediate Selection**: Newly created pages are automatically selected and displayed

#### Adding Components  
1. **From Page Editor**: Click "Add Component" button in header → Fill form → Submit
2. **From Page Tree**: Hover over page → Click ➕ → Creates default component
3. **Dual Add Buttons** (NEW): Container components now have two distinct add buttons:
   - **📦➕ Add Sub-Component**: Creates container components (PANEL, FIELDSET, etc.) - Blue theme
   - **⚬➕ Add Field**: Creates field components (TEXT_INPUT, EMAIL_INPUT, etc.) - Green theme
4. **Empty Page Helper**: "Add First Component" button for pages with no components
5. **Smart UX**: Only container components show add buttons; field components cannot have children

#### Deleting Items
1. **Pages**: Hover over page → Click 🗑️ → Confirm deletion (deletes all components)
2. **Components**: Hover over component → Click 🗑️ → Confirm deletion (deletes children)
3. **Confirmation**: All deletions require user confirmation to prevent accidents
4. **Cascade Delete**: Deleting pages removes all components; deleting components removes children

#### Moving/Reordering
1. **Pages**: Use ⬆️ ⬇️ arrows to reorder pages within form
2. **Components**: Use ⬆️ ⬇️ arrows to reorder components within page or parent
3. **Smart Buttons**: Move buttons automatically disable at boundaries (first/last items)
4. **Real-time Updates**: Order changes reflect immediately in all panels

#### Ultra-Compact FormTree Display (NEW)

**Windows Explorer-Style Dense Layout**:
- **Minimal Vertical Spacing**: 16px line height for maximum density
- **Compact Indentation**: 12px indents for efficient space usage
- **Small UI Elements**: 11px fonts, 10px icons, tiny action buttons
- **Maximum Text Visibility**: More characters displayed per line

**Ultra-Narrow Expandable Design**:
- **Component-Level Expand/Collapse**: Every component with children can expand/collapse branches
- **8px Component Height**: Ultra-narrow component nodes for maximum density
- **Micro Elements**: 5px component expand arrows, 6px component icons, 6px indentation
- **Recursive Hierarchy**: Full tree structure with unlimited nesting levels

**Visual Hierarchy System**:
- **Level 0**: Form root (subtle background, 11px font)
- **Level 1**: Pages (minimal indent, compact expand arrows)
- **Level 2+**: Components (progressive 12px indents per level)

**Icon System** (Compact 11px):
- **Container Components**: 📦 PANEL/CONTAINER, 🗂️ FIELDSET, 📁 GROUP, 📋 SECTION, 🃏 CARD, 📑 TAB_PANEL, 🪗 ACCORDION
- **Input Components**: 📝 TEXT_INPUT, 📧 EMAIL_INPUT, 🔒 PASSWORD_INPUT, 📄 TEXT_AREA, 🔢 NUMBER_INPUT, 📅 DATE_INPUT, ⏰ TIME_INPUT, 📎 FILE_INPUT
- **Selection Components**: ☑️ CHECKBOX, 🔘 RADIO, 📋 SELECT  
- **Action Components**: 🔲 BUTTON, ✅ SUBMIT_BUTTON

**Density Features**:
- Information-dense layout showing more items per screen
- Hover-revealed micro action buttons (14px size)
- Ultra-small checkboxes (10px) for selection state
- Minimal visual noise, maximum content visibility

#### Component Types Supported

**Container Components** (can have child components):
- **PANEL** (Purple badge): General container for grouping components
- **CONTAINER** (Gray badge): Generic container component
- **FIELDSET** (Gray badge): HTML fieldset for form grouping
- **GROUP** (Dark badge): Logical grouping component
- **SECTION** (Gray badge): Section container component
- **CARD** (Future): Card-style container
- **TAB_PANEL** (Future): Tab panel container
- **ACCORDION** (Future): Accordion container

**Field Components** (leaf nodes - cannot have children):
- **TEXT_INPUT** (Green badge): Standard text input fields
- **EMAIL_INPUT** (Teal badge): Email validation input fields  
- **PASSWORD_INPUT** (Orange badge): Password input fields
- **TEXT_AREA** (Yellow badge): Multi-line text areas
- **NUMBER_INPUT** (Emerald badge): Numeric input fields
- **DATE_INPUT** (Pink badge): Date picker fields
- **CHECKBOX** (Orange badge): Checkbox input elements
- **RADIO** (Pink badge): Radio button elements
- **SELECT** (Purple badge): Dropdown selection fields
- **FILE_INPUT** (Red badge): File upload components
- **BUTTON** (Dark badge): Action buttons
- **SUBMIT_BUTTON** (Blue badge): Form submission buttons

#### Visual Interaction Features
- **Smart Component Actions**: Add buttons appear only on container components that can have children
- **Component Type Distinction**: Container components (📦) vs Field components (⚬) with different icons
- **Contextual Add Buttons**: Field components don't show add buttons since they can't contain children
- **Hover Actions**: Action buttons appear on hover over tree nodes and page editor components
- **Selection Sync**: Selecting items in any panel updates all other panels
- **Color Coding**: Component types have distinct color badges for easy identification (containers vs fields)
- **Expand/Collapse**: Tree view supports expanding/collapsing of pages and nested components
- **Visual Hierarchy**: Indentation and dotted lines show parent-child relationships
- **Empty Container States**: Empty containers show helpful messages with "Add First Component" buttons
- **Component Type Groups**: Creation forms organize components into "Field Components" and "Container Components"
- **Cascade Deletion**: Deleting containers removes all child components; deleting fields only removes the field
- **Component Validation**: Prevents adding children to field components with appropriate user feedback

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- npm or yarn package manager

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```
The backend will start on `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will start on `http://localhost:3000`

## Testing Guide

### 1. Manual Testing (Full Application)

#### Quick Start Testing
1. **Start Backend**: `cd backend && ./mvnw spring-boot:run`
2. **Start Frontend**: `cd frontend && npm install && npm start`
3. **Open Browser**: Navigate to `http://localhost:3000`

#### Testing Scenarios
- **Form Tree Display**: Verify "Test Form 1" shows with hierarchical structure including "Personal Information" page
- **Node Selection**: Click different nodes (form, page, components) and verify selection
- **Attribute Editing**: 
  - Select form → Edit name/description → Save → Verify changes
  - Select page → Edit page name → Save → Verify changes  
  - Select component → Edit label/type/attributes → Save → Verify changes
- **Page Creation**: Add new pages with custom names like "Contact Information", "Survey Questions"
- **Nested Components**: Test parent-child component relationships
- **JSON Validation**: Try invalid JSON in component attributes (should show error)

### 2. Frontend Unit Testing

#### Run Tests
```bash
cd frontend
npm test
```

#### Run Tests with Coverage
```bash
cd frontend
npm test -- --coverage --watchAll=false
```

#### Test Files Created
- `frontend/src/components/FormTree.test.js` - Tests tree rendering and selection
- Additional component tests can be added following the same pattern

### 3. Backend Unit Testing

#### Run Spring Boot Tests
```bash
cd backend
./mvnw test
```

#### Run Tests with Reports
```bash
cd backend
./mvnw test jacoco:report
```

#### Test Files Created
- `backend/src/test/java/com/formbuilder/backend/controllers/FormControllerTest.java` - API endpoint tests
- Coverage reports available at `backend/target/site/jacoco/index.html`

### 4. End-to-End Testing with Cypress

#### Comprehensive E2E Test Coverage ✅

Our E2E tests now provide complete coverage of all CRUD operations and user interaction flows with named pages:

**Test Structure - 115+ Test Cases Total:**

**Basic Layout Tests (2 tests)**
- Three-panel layout verification
- Responsive panel sizing validation

**Form Tree Navigation (4 tests)**  
- Complete hierarchy display with action buttons including named pages
- Visual indentation and hover effects
- Node selection with cross-panel synchronization
- Action button visibility and interaction

**CRUD Operations - Create (8 tests)**
- Create pages with custom names from form tree with validation
- Create components from page editor
- Create components from tree view
- Create nested components within parents
- Handle empty page states with helper buttons
- Form validation and error handling
- Cancel operations and form cleanup

**CRUD Operations - Delete (4 tests)**
- Delete named pages with confirmation dialogs
- Delete components from tree and page editor
- Cancel deletion operations
- Cascade deletion verification

**Move/Reorder Operations (8 tests)**
- Move pages up/down with proper button states
- Move components within pages and parents
- Disable move buttons at boundaries
- Visual feedback during move operations
- Reorder operations in both tree and page editor

**Page Editor CRUD Features (6 tests)**
- Add component button functionality
- Component action buttons on hover
- Nested component creation from page editor
- Component type selection and validation
- Visual component representation
- Empty state handling

**Cross-Panel Integration (6 tests)**
- Selection synchronization after CRUD operations
- Automatic selection of newly created items
- Clear selection after deletion
- Maintain page context during component operations
- Real-time updates across all panels

**Form Validation and Error Handling (6 tests)**
- Input validation for all forms including page names
- JSON attribute validation
- API error handling
- Required field validation
- Form submission prevention for invalid data

**Visual Feedback and UX (8 tests)**
- Loading states during operations
- Success feedback for completed operations
- UI responsiveness during async operations
- Hover effects and visual states
- Component type color coding
- Action button state management

**🆕 Component vs Field Distinction (8 tests)**
- Add buttons only appear on container components
- Different icons for container (📦) vs field (⚬) components
- Proper CSS classes applied (container-component vs field-component)
- Prevent adding children to field components
- Empty container state messages and helper buttons
- Component type groups in creation dropdowns
- Nested component creation in containers
- Visual styling differences in both tree and page editor

**🆕 Container Component Functionality (3 tests)**
- Multiple nested components in containers
- Proper visual indentation for hierarchy
- Cascade deletion of containers and children

**🆕 Field Component Functionality (4 tests)**
- No add buttons on field components
- Appropriate deletion confirmations
- Proper styling and visual indicators
- No empty container states for fields

**🆕 Component Type Validation (2 tests)**
- Correct categorization in dropdown groups
- Type classification verification after creation

#### Advanced E2E Test Scenarios

**CRUD Workflow Tests:**
- ✅ Complete page creation with names → component addition → editing workflow
- ✅ Complex nested component hierarchies creation and management
- ✅ Mixed operations: create + move + delete sequences
- ✅ Error recovery and operation rollback scenarios
- ✅ Rapid sequential operations and race condition handling

**Integration Test Coverage:**
- ✅ Form tree ↔ Page editor synchronization
- ✅ Page editor ↔ Attributes panel coordination  
- ✅ Tree navigation ↔ Page display alignment
- ✅ Selection state management across all panels
- ✅ Real-time data updates and refresh handling

**User Experience Tests:**
- ✅ Action button hover states and transitions
- ✅ Component type badge color consistency
- ✅ Expand/collapse animations and states
- ✅ Form validation feedback and error messages
- ✅ Confirmation dialog interactions
- ✅ Keyboard navigation support

#### Run E2E Tests

**Open Cypress Test Runner:**
```bash
cd frontend
npm run cypress:open
```

**Run Tests Headlessly:**
```bash
cd frontend
npm run cypress:run
```

**Prerequisites for E2E Testing:**
1. **Backend Running**: `cd backend && ./mvnw spring-boot:run`
2. **Frontend Running**: `cd frontend && npm start`
3. **Both Accessible**: Backend on :8080, Frontend on :3000

#### E2E Test Organization

The E2E tests are organized into logical groups:

1. **Layout and Structure**: Basic UI layout and responsiveness
2. **Tree Navigation**: Left panel form tree functionality with named pages
3. **CRUD Operations**: All create, read, update, delete operations including page naming
4. **Page Editor**: Center panel component visualization and interaction
5. **Attributes Panel**: Right panel property editing
6. **Integration**: Cross-panel synchronization and data flow
7. **Validation**: Form validation and error handling
8. **User Experience**: Visual feedback and interaction states
9. **Dual Add Buttons**: Comprehensive testing of new dual add button feature (📦➕ and ⚬➕)
   - API Tests: 31/31 passing ✅
   - Dual Add Buttons Tests: 14/14 passing ✅

Each test group covers both positive and negative test cases, ensuring robust coverage of all user flows and edge cases.

#### Dual Add Buttons Test Coverage (100% ✅)
The `dual-add-buttons.cy.js` test suite provides comprehensive coverage:
- **Button Visibility**: Container vs field component button display
- **Form Functionality**: Opening, submitting, canceling forms
- **Component Creation**: Sub-components vs fields validation
- **Form Exclusivity**: Mutual form closing behavior
- **UX Testing**: Tooltips, titles, labels, distinct styling (blue/green themes)
- **Error Handling**: Edge cases and validation scenarios

## API Endpoints

### Forms
- `GET /api/forms/` - Get all forms
- `GET /api/forms/{id}` - Get form by ID (with full hierarchy)
- `POST /api/forms/` - Create new form
- `PUT /api/forms/{id}` - Update form
- `DELETE /api/forms/{id}` - Delete form
- `PUT /api/forms/{id}/pages/reorder` - Reorder pages within form

### Pages
- `GET /api/pages/{id}` - Get page by ID
- `POST /api/forms/{formId}/pages` - Create new page in form (with name)
- `PUT /api/pages/{id}` - Update page (including name changes)
- `DELETE /api/pages/{id}` - Delete page
- `PUT /api/pages/{id}/components/reorder` - Reorder components in page

### Components
- `GET /api/components/{id}` - Get component by ID
- `POST /api/pages/{pageId}/components` - Create component in page
- `POST /api/components/{parentId}/components` - Create nested component
- `PUT /api/components/{id}` - Update component
- `DELETE /api/components/{id}` - Delete component
- `PUT /api/components/{id}/move` - Move component to different page/parent
- `PUT /api/components/{parentId}/components/reorder` - Reorder nested components

## Data Models

### Form
- `id` (Long) - Primary key
- `name` (String) - Form name
- `description` (String) - Form description
- `pages` (List<Page>) - Associated pages

### Page
- `id` (Long) - Primary key
- `name` (String) - Descriptive page name (e.g., "Personal Information", "Contact Details")
- `form` (Form) - Parent form
- `components` (List<Component>) - Page components

### Component
- `id` (Long) - Primary key
- `componentType` (String) - Type (TEXT_INPUT, CHECKBOX_GROUP, etc.)
- `label` (String) - Display label
- `attributes` (String) - JSON configuration
- `page` (Page) - Parent page
- `parentComponent` (Component) - Parent component (for nesting)
- `childComponents` (List<Component>) - Child components

## Usage

### 🏗️ **Dual Panel Architecture**

The form builder uses a **separation of concerns** design with two main panels:

#### 📁 **Left Form Tree Panel** - Page Management
- **Purpose**: Form and page-level operations only
- **Features**:
  - ➕ Add new pages to forms
  - 🗑️ Delete pages 
  - ⬆️⬇️ Move pages up/down
  - 📁 Expand/collapse page structure
  - View basic component hierarchy
- **Design**: Clean, focused interface for structural navigation

#### 📝 **Page Editor Panel** - Component Management  
- **Purpose**: Detailed component operations and editing
- **Features**:
  - **Dual Add Buttons** for container components:
    - 📦➕ Add Sub-Component (containers like PANEL, FIELDSET)
    - ⚬➕ Add Field (inputs like TEXT_INPUT, CHECKBOX)
  - 🗑️ Delete components
  - ⬆️⬇️ Move components within pages
  - 📝 Edit component properties and attributes
  - View complete component hierarchy with nesting

### 🎯 **Workflow**
1. **Start both backend and frontend** as described in setup instructions
2. **Form Tree**: Use left panel to manage pages and navigate structure
3. **Page Editor**: Click a page in tree to activate detailed editing in right panel
4. **Component Operations**: Use page editor for all component add/edit/delete operations
5. **Attributes Panel**: Further right panel for detailed property editing
6. **Save Changes**: All modifications are auto-saved via API

## Development Notes

- **Sample Data**: The application automatically loads test data on first run with "Personal Information" page
- **Live Updates**: Changes are reflected immediately in the tree view
- **JSON Validation**: Component attributes are validated as JSON before saving
- **Error Handling**: User-friendly error messages for common issues
- **Responsive Design**: Works on desktop and tablet screen sizes
- **Page Naming**: Pages use descriptive names for better organization and user experience

## Technology Stack

### Backend Dependencies
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- H2 Database
- Spring Boot Starter Test

### Frontend Dependencies
- React 19.1.0
- React DOM 19.1.0
- React Scripts 5.0.1
- Axios (for API communication)
- Testing Library React

## Next Steps for Development

### Immediate Priorities
1. **Enhanced Form Validation**: Add client-side and server-side validation rules for page names
2. **Drag & Drop Interface**: Implement drag-and-drop for component arrangement
3. **Form Preview Mode**: Add ability to preview forms as end-users would see them
4. **Page Templates**: Pre-defined page templates for common use cases

### Short-term Enhancements
1. **Component Library**: Pre-built components (buttons, inputs, dropdowns, etc.)
2. **Form Templates**: Save and reuse common form structures
3. **Export/Import**: JSON export/import for form definitions
4. **Better Error Handling**: More granular error messages and recovery
5. **Page Ordering**: Optional ordering system for pages if needed

### Long-term Features
1. **Form Rendering Engine**: Render forms for end-user completion
2. **Form Submission Handling**: Collect and store form responses
3. **User Management**: Multi-user support with permissions
4. **Database Integration**: PostgreSQL/MySQL for production use
5. **Form Logic**: Conditional fields and validation rules
6. **Styling System**: Custom themes and component styling
7. **API Documentation**: Swagger/OpenAPI integration
8. **Performance Optimization**: Lazy loading, caching, pagination

### Technical Improvements
1. **State Management**: Consider Redux/Zustand for complex state
2. **TypeScript Migration**: Add type safety across the application
3. **Microservices**: Split into smaller, focused services
4. **Docker Containerization**: Easy deployment and scaling
5. **CI/CD Pipeline**: Automated testing and deployment
6. **Monitoring**: Application performance and error tracking

## Future Enhancements

- Form preview and rendering functionality
- Drag-and-drop interface for component arrangement
- Component library with pre-built field types
- Form validation rules and logic
- Export/import functionality
- Multi-user support with authentication
- Real database integration (PostgreSQL/MySQL)
- Component styling and theming options
- Page templates and wizards for quick form creation

## Current Status

**✅ WORKING** - The form-builder application is now fully functional with both frontend and backend running correctly.

### Recent Updates Applied ✅

#### Named Pages Implementation ✅
- **Changed from page numbers to page names** for better user experience
- Updated Page entity model to use `String name` instead of `Integer pageNumber`
- Modified all controllers, services, and frontend components to handle page names
- Updated sample data to include "Personal Information" page name
- Enhanced UI to show meaningful page names in tree view and page editor

#### Backend Changes ✅
- Updated `Page.java` entity to use `name` field instead of `pageNumber`
- Modified `PageController.java` to handle name-based operations
- Updated `DataLoader.java` with sample page name "Personal Information"
- Fixed all backend tests to use page names instead of numbers

#### Frontend Changes ✅
- Updated `FormTree.js` to use text input for page names in creation form
- Modified `PageEditor.js` to display page names in headers and titles
- Updated `AttributePanel.js` to edit page names instead of numbers
- Fixed all E2E tests to expect page names instead of numbers
- Updated footer display to show page names properly

#### CORS Configuration ✅
- Added `CorsConfig.java` to allow frontend (localhost:3000) to access backend API (localhost:8080)
- Configured to allow all HTTP methods and headers for development

#### JSON Serialization Issue ✅
- **Fixed infinite recursion in REST API responses**
- Added Jackson annotations to prevent circular references:
  - `@JsonManagedReference("form-pages")` on Form.pages
  - `@JsonBackReference("form-pages")` on Page.form
  - `@JsonManagedReference("page-components")` on Page.components
  - `@JsonBackReference("page-components")` on Component.page
  - Existing parent-child component annotations maintained

#### Dual Add Buttons Feature ✅
- **Implemented sophisticated dual add button system**
- Container components now have two distinct add buttons:
  - 📦➕ Add Sub-Component (blue theme) - Creates container components
  - ⚬➕ Add Field (green theme) - Creates field components
- **Fixed 500 error**: Updated handleCreateComponent to handle both 'nested' and 'field' types
- **Enhanced UX**: Form exclusivity, distinct styling, proper tooltips and validation
- **Comprehensive testing**: 14/14 E2E tests passing with 100% feature coverage

#### Testing Status
- **Frontend**: 8/8 unit tests passing ✅
- **Backend**: Tests updated for page names ✅
- **E2E**: Cypress tests updated for named pages ✅
- **API Endpoints**: All working correctly with page names ✅

## Quick Start

### Prerequisites
- Java 17+
- Node.js 16+
- Maven 3.6+

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs on: http://localhost:8080

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

## Project Overview

A dynamic form builder application built with Spring Boot 3.2.2 (backend) and React 19.1.0 (frontend).

### Architecture
- **Hierarchical Structure**: Forms → Named Pages → Components (with component nesting support)
- **Three-Panel UI**: Sidebar navigation, tree view, and attribute panel
- **RESTful API**: Complete CRUD operations for all entities

### Models
- **Form**: Container for multiple pages with metadata
- **Page**: Named logical grouping of components within a form (e.g., "Personal Information", "Contact Details")
- **Component**: Form elements (TEXT_INPUT, EMAIL_INPUT, PANEL, etc.) with parent-child relationships

### Backend Features
- Spring Boot 3.2.2 with Spring Data JPA
- H2 in-memory database with data loading
- Entity graphs for optimized querying
- Jackson annotations for proper JSON serialization
- CORS configuration for frontend integration

### Frontend Features
- React 19.1.0 with functional components and hooks
- Tree component for hierarchical form visualization with named pages
- Attribute panel for editing properties including page names
- Real-time form updates via API calls
- Responsive design

## API Documentation

### Forms
- `GET /api/forms/` - Get all forms
- `GET /api/forms/{id}` - Get specific form with pages and components
- `PUT /api/forms/{id}` - Update form metadata

### Pages  
- `PUT /api/pages/{id}` - Update page properties including name

### Components
- `PUT /api/components/{id}` - Update component properties

## Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
cd frontend
npx cypress run
```

## Development Notes

### Key Files
- `