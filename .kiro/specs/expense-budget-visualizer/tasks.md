# Implementation Plan: Expense & Budget Visualizer

## Overview

This implementation plan follows a 12-step incremental approach to build the Expense & Budget Visualizer application. The application is a client-side web app using HTML5, Vanilla JavaScript, Tailwind CSS, and Chart.js. Each step builds upon the previous one, ensuring a working application at each checkpoint.

**Key Implementation Notes:**
- Default categories: Makanan, Transport, Hiburan (only 3)
- Footer copyright with dynamic year via JavaScript
- NO test files (HTML or JS)
- NO terminal commands during implementation
- All code in: index.html, css/style.css, js/script.js

## Tasks

- [x] 1. Struktur Proyek & HTML Dasar (Semantic)
  - Create project directory structure: css/ and js/ folders
  - Create index.html with semantic HTML5 structure (header, main, footer, form, section)
  - Include Tailwind CSS CDN link in head
  - Include Chart.js CDN link before closing body tag
  - Add form with inputs for transaction name, amount, and category dropdown
  - Add container for transaction list display
  - Add container for balance display
  - Add canvas element for pie chart
  - Use semantic elements: header, main, footer, form, label, input, select, button, article
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 1.1_

- [x] 2. Styling dengan Tailwind CSS + Flexbox
  - Apply Tailwind utility classes to container for responsive layout
  - Style header with Tailwind classes (text size, padding, background)
  - Style footer with Tailwind classes (text size, padding, background)
  - Style form inputs and buttons with Tailwind classes (border, padding, focus states)
  - Style transaction list container with Flexbox using Tailwind classes
  - Style balance display with prominent typography using Tailwind classes
  - Style canvas container for chart with appropriate sizing
  - Ensure responsive design with Tailwind breakpoints (mobile-first)
  - _Requirements: 9.1, 9.3, 9.4, 9.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 2.3_

- [x] 3. Inisialisasi Data & Local Storage
  - Create js/script.js file
  - Declare global variables for transactions array
  - Implement loadTransactions() function to retrieve data from Local Storage
  - Implement saveTransactions() function to persist data to Local Storage
  - Implement generateId() function using timestamp + random string
  - Handle JSON parsing errors gracefully in loadTransactions()
  - Initialize transactions array on page load
  - _Requirements: 6.1, 6.5, 3.3_

- [x] 4. Form Submit & Validasi Profesional
  - Add event listener for form submit event
  - Implement validateTransaction() function to check name, amount, and category
  - Display error messages for empty name field
  - Display error messages for empty or non-numeric amount field
  - Display error messages for unselected category
  - Prevent form submission if validation fails
  - Clear error messages on successful submission
  - Create transaction object with id, name, amount, category, and date
  - Add validated transaction to transactions array
  - Call saveTransactions() after adding new transaction
  - _Requirements: 1.1, 1.5, 1.6, 1.7, 1.2, 1.3_

- [x] 5. Render Daftar Transaksi (dengan Flexbox)
  - Implement renderTransactionList() function
  - Display message when no transactions exist
  - Generate HTML for each transaction with name, amount, category
  - Add delete button for each transaction with data-id attribute
  - Use Flexbox layout for transaction items
  - Sort transactions by date (newest first) before rendering
  - Escape HTML in transaction names to prevent XSS
  - Implement event delegation for delete button clicks
  - Call renderTransactionList() after form submission
  - _Requirements: 2.1, 2.2, 2.4, 2.5, 3.1_

- [x] 6. Total Balance (Realtime)
  - Implement updateTotalBalance() function
  - Calculate balance as sum of all transaction amounts using Array.reduce()
  - Implement formatCurrency() function for Indonesian Rupiah format (Rp X.XXX)
  - Display formatted balance in balance container
  - Call updateTotalBalance() after adding transaction
  - Call updateTotalBalance() after deleting transaction
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 7. Pie Chart (Chart.js)
  - Implement calculateCategoryTotals() function using Map data structure
  - Implement updateChart() function to render or update Chart.js pie chart
  - Configure Chart.js with pie type, responsive settings, and legend
  - Use predefined color palette for categories (blue, green, amber)
  - Display empty state message when no transactions exist
  - Destroy previous chart instance before creating new one
  - Call updateChart() after adding transaction
  - Call updateChart() after deleting transaction
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 8. Integrasi Render
  - Implement renderAll() function that calls all render functions
  - Call renderTransactionList() from renderAll()
  - Call updateTotalBalance() from renderAll()
  - Call updateChart() from renderAll()
  - Call renderAll() on page load after loading transactions
  - Call renderAll() after adding transaction
  - Call renderAll() after deleting transaction
  - _Requirements: 2.2, 4.2, 4.3, 5.2, 5.3_

- [x] 9. Checkpoint - Ensure core functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implementasi 3 Fitur Opsional (Custom Categories, Monthly Summary, Sort Transactions)
  - [x] 10.1 Custom Categories Feature
    - Add button in UI to add new custom category
    - Implement addCategory() function to prompt for category name
    - Validate category name (non-empty, no duplicates)
    - Save custom categories to Local Storage separately
    - Load custom categories on page load
    - Update category dropdown to include custom categories
    - Display error message for invalid category names
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_
  
  - [x] 10.2 Monthly Summary Feature
    - Add date field to transaction object when creating transactions
    - Add month filter dropdown in UI (select month/year)
    - Implement filterByMonth() function to filter transactions by selected month
    - Update renderTransactionList() to accept filtered transactions
    - Update updateTotalBalance() to calculate from filtered transactions
    - Update updateChart() to display data from filtered transactions
    - Add "All Months" option to show all transactions
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
  
  - [x] 10.3 Sort Transactions Feature
    - Add sort buttons in UI (sort by amount, sort by category)
    - Implement sortByAmount() function with ascending/descending toggle
    - Implement sortByCategory() function with alphabetical/reverse toggle
    - Update sort button UI to indicate current sort direction
    - Apply sorting before rendering transaction list
    - Maintain sort state across renders
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [x] 11. Footer & Sentuhan Akhir
  - Add footer element with copyright text in index.html
  - Add span element with id="year" for dynamic year
  - Implement JavaScript to set current year in footer on page load
  - Use new Date().getFullYear() to get current year
  - Verify all semantic HTML elements are properly used
  - Verify all Tailwind classes are applied correctly
  - Verify responsive design works on mobile, tablet, and desktop
  - _Requirements: 7.4, 9.3_

- [x] 12. Create css/style.css for Custom Styles
  - Create css/style.css file
  - Add custom CSS for styles not covered by Tailwind CSS
  - Add any dark mode overrides if needed
  - Add custom transitions or animations if desired
  - Link style.css in index.html after Tailwind CDN
  - _Requirements: 9.2_

- [x] 13. Isi CODEBASE_GUIDE.md
  - Create CODEBASE_GUIDE.md in project root
  - Document technology stack (HTML5, Vanilla JS, Tailwind CSS, Chart.js)
  - Document project structure (folders and files)
  - Document how to run the application (open index.html in browser)
  - Document data flow (form input → validation → storage → render)
  - Document key functions and their purposes
  - Document Local Storage schema (transaction format, category format)
  - Document default categories (Makanan, Transport, Hiburan)
  - _Requirements: Technical Constraints_

- [x] 14. Final Checkpoint - Verify Complete Implementation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Prepare for Deployment
  - Verify all files are in correct directory structure
  - Verify index.html opens correctly in browser
  - Verify all CDN links are working
  - Verify Local Storage persistence works
  - Verify responsive design on different screen sizes
  - Verify all 3 optional features work correctly
  - Document GitHub repository name: CodingCamp-27Apr26-alpharidhoalvidi
  - Document deployment instructions for GitHub Pages in CODEBASE_GUIDE.md
  - _Requirements: Deployment Constraints_

## Notes

- This workflow creates planning artifacts only - implementation is done separately
- Each task builds incrementally on previous tasks
- Checkpoints ensure validation at key milestones
- All tasks reference specific requirements for traceability
- NO test files should be created (no HTML or JS test files)
- NO terminal commands should be run during implementation
- Focus on clean, semantic HTML and vanilla JavaScript
- Use Tailwind CSS utilities for all styling where possible
- Custom CSS file only for styles not covered by Tailwind
