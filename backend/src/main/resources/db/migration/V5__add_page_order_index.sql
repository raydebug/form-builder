-- Add order_index column to pages table for page ordering
ALTER TABLE pages ADD COLUMN order_index INTEGER DEFAULT 0;

-- Update existing pages to have proper order indices based on their current order
UPDATE pages SET order_index = (
    SELECT COUNT(*) - 1 
    FROM pages p2 
    WHERE p2.form_id = pages.form_id 
    AND p2.id <= pages.id
);

-- Add index for better performance when ordering pages
CREATE INDEX idx_pages_form_order ON pages(form_id, order_index); 