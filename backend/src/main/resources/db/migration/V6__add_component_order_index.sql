-- Add order_index column to components table for component ordering
ALTER TABLE components ADD COLUMN order_index INTEGER DEFAULT 0;

-- Update existing components to have proper order indices based on their current order
-- Order components within each page by ID (components with lower IDs get lower order indices)
UPDATE components SET order_index = (
    SELECT COUNT(*) - 1 
    FROM components c2 
    WHERE c2.page_id = components.page_id 
    AND c2.parent_component_id IS NULL 
    AND c2.id <= components.id
) WHERE parent_component_id IS NULL;

-- Order nested components within each parent component
UPDATE components SET order_index = (
    SELECT COUNT(*) - 1 
    FROM components c2 
    WHERE c2.parent_component_id = components.parent_component_id 
    AND c2.id <= components.id
) WHERE parent_component_id IS NOT NULL;

-- Add index for better performance when ordering components
CREATE INDEX idx_components_page_order ON components(page_id, order_index);
CREATE INDEX idx_components_parent_order ON components(parent_component_id, order_index); 