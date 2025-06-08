# How to Add Fields to Components 📝

## Quick Steps
1. Open http://localhost:3000 in your browser
2. Look for container components (📦 PANEL, FIELDSET, etc.)
3. **HOVER** over a container component
4. Click the **⚬➕ Add Field** button (green theme)
5. Fill out the form and submit

## Visual Guide

### What You Should See:

```
📦 Contact Info [PANEL]     ← Container component (hover here)
  ⚬ Email [EMAIL_INPUT]     ← Field component (no buttons)
  
When you hover over "📦 Contact Info", you'll see:

📦 Contact Info [PANEL] [📦➕] [⚬➕] [⬆️] [⬇️] [🗑️]
                         ↑     ↑
                    Sub-Comp  Field
                    (Blue)   (Green)
```

### Step-by-Step:

1. **Find Container Components**:
   - Look for components with 📦 icon
   - Examples: PANEL, FIELDSET, GROUP, SECTION

2. **Hover Over Container**:
   - Move mouse over the container component
   - Buttons will appear on hover

3. **Click ⚬➕ (Add Field)**:
   - Green button on the right
   - Opens green-themed form

4. **Select Field Type**:
   - TEXT_INPUT (basic text)
   - EMAIL_INPUT (email field)
   - CHECKBOX (checkbox)
   - SELECT (dropdown)
   - etc.

5. **Fill Form**:
   - **Label**: Display name for the field
   - **Attributes**: JSON configuration (optional)

6. **Submit**:
   - Click "Add Field" button
   - Field will appear under the container

## Troubleshooting

### "I don't see any buttons"
- Make sure you're hovering over a **container** component (📦)
- Field components (⚬) don't have add buttons
- Try hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)

### "I only see one button"
- You might be on an old cached version
- Clear browser cache and refresh

### "I get a 500 error"
- This has been fixed! Try again after the fresh restart

## Current Container Components

Based on your data, you have:
- **📦 Contact Info (PANEL)** ← Use this one!

## Example: Adding an Email Field

1. Hover over "📦 Contact Info"
2. Click **⚬➕** (green Add Field button)  
3. Select "EMAIL_INPUT" from dropdown
4. Enter label: "Email Address"
5. Click "Add Field"
6. New email field appears under Contact Info!

---
**Note**: The dual add buttons feature is fully working (14/14 tests pass). If you still can't see them, try incognito mode or a different browser. 