# Design Document: Expense & Budget Visualizer

## Overview

The Expense & Budget Visualizer is a client-side web application built with HTML5, Vanilla JavaScript, Tailwind CSS, and Chart.js. The application enables users to track personal expenses through an intuitive interface that provides transaction management, balance calculation, and visual analytics via pie charts. All data is persisted locally in the browser using the Local Storage API, ensuring privacy and offline functionality.

### Key Design Principles

1. **Simplicity**: Pure vanilla JavaScript without frameworks for minimal complexity and fast load times
2. **Responsiveness**: Mobile-first design using Tailwind CSS utilities and Flexbox
3. **Data Persistence**: Local Storage for client-side data persistence without backend dependencies
4. **Visual Feedback**: Real-time updates to UI components when data changes
5. **Accessibility**: Semantic HTML5 elements for better screen reader support

## Architecture

### High-Level Architecture

The application follows a **Model-View-Controller (MVC)** pattern adapted for vanilla JavaScript:

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│  (HTML + Tailwind CSS + Custom CSS)                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│                   Controller Layer                       │
│  - Event Handlers                                        │
│  - Input Validation                                      │
│  - UI Update Orchestration                               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│                     Model Layer                          │
│  - Transaction Management                                │
│  - Balance Calculation                                   │
│  - Category Management                                   │
│  - Data Validation                                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│                  Storage Layer                           │
│  - Local Storage Interface                               │
│  - JSON Serialization/Deserialization                    │
└─────────────────────────────────────────────────────────┘
```

### Component Architecture

The application is organized into the following logical components:

1. **TransactionManager**: Manages CRUD operations for transactions
2. **StorageService**: Handles all Local Storage interactions
3. **BalanceCalculator**: Computes total and filtered balances
4. **ChartRenderer**: Manages Chart.js pie chart rendering
5. **UIController**: Coordinates UI updates and event handling
6. **ValidationService**: Validates user inputs
7. **CategoryManager**: Manages default and custom categories
8. **FilterService**: Handles monthly filtering and sorting (optional features)

## Components and Interfaces

### 1. TransactionManager

**Responsibility**: Central component for managing transaction lifecycle.

**Interface**:
```javascript
class TransactionManager {
  constructor(storageService)
  
  // Core operations
  addTransaction(transaction) // Returns: transaction with generated ID
  deleteTransaction(transactionId) // Returns: boolean success
  getAllTransactions() // Returns: Array<Transaction>
  getTransactionById(id) // Returns: Transaction | null
  
  // Filtering (optional)
  getTransactionsByMonth(year, month) // Returns: Array<Transaction>
  
  // Sorting (optional)
  sortTransactions(transactions, sortBy, direction) // Returns: Array<Transaction>
}
```

**Key Behaviors**:
- Generates unique IDs for new transactions (using timestamp + random)
- Delegates storage operations to StorageService
- Maintains transaction integrity

### 2. StorageService

**Responsibility**: Abstracts Local Storage operations and handles serialization.

**Interface**:
```javascript
class StorageService {
  // Transaction storage
  saveTransactions(transactions) // Returns: boolean success
  loadTransactions() // Returns: Array<Transaction>
  
  // Category storage (optional)
  saveCategories(categories) // Returns: boolean success
  loadCategories() // Returns: Array<string>
  
  // Utility
  clearAllData() // Returns: boolean success
}
```

**Storage Keys**:
- `expense_transactions`: Array of transaction objects
- `expense_categories`: Array of custom category strings

**Data Format**:
```javascript
// Transaction storage format
{
  "expense_transactions": [
    {
      "id": "1234567890123-abc",
      "name": "Grocery Shopping",
      "amount": 50000,
      "category": "Makanan",
      "date": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. BalanceCalculator

**Responsibility**: Performs balance calculations with filtering support.

**Interface**:
```javascript
class BalanceCalculator {
  calculateTotal(transactions) // Returns: number
  calculateByCategory(transactions) // Returns: Map<string, number>
  formatCurrency(amount) // Returns: string (e.g., "Rp 50.000")
}
```

**Key Algorithms**:
- **Total Balance**: Sum of all transaction amounts using `Array.reduce()`
- **Category Totals**: Group by category and sum using `Map` data structure
- **Currency Formatting**: Indonesian Rupiah format with thousand separators

### 4. ChartRenderer

**Responsibility**: Manages Chart.js pie chart lifecycle and updates.

**Interface**:
```javascript
class ChartRenderer {
  constructor(canvasElement)
  
  renderChart(categoryData) // categoryData: Map<string, number>
  updateChart(categoryData)
  destroyChart()
  showEmptyState()
}
```

**Chart Configuration**:
- **Type**: Pie chart
- **Colors**: Predefined color palette for categories
- **Responsive**: Maintains aspect ratio on resize
- **Legend**: Positioned at bottom with category labels
- **Tooltips**: Show category name, amount, and percentage

**Color Palette**:
```javascript
const CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316'  // Orange
];
```

### 5. UIController

**Responsibility**: Orchestrates all UI updates and event handling.

**Interface**:
```javascript
class UIController {
  constructor(transactionManager, balanceCalculator, chartRenderer)
  
  // Initialization
  init()
  
  // Event handlers
  handleFormSubmit(event)
  handleDeleteTransaction(transactionId)
  handleAddCategory() // Optional
  handleMonthFilter(year, month) // Optional
  handleSort(sortBy) // Optional
  
  // UI updates
  renderTransactionList(transactions)
  updateBalance(balance)
  updateChart(transactions)
  showError(message)
  clearForm()
}
```

**Event Bindings**:
- Form submission → `handleFormSubmit`
- Delete button clicks → `handleDeleteTransaction`
- Add category button → `handleAddCategory` (optional)
- Month filter change → `handleMonthFilter` (optional)
- Sort button clicks → `handleSort` (optional)

### 6. ValidationService

**Responsibility**: Validates all user inputs before processing.

**Interface**:
```javascript
class ValidationService {
  validateTransaction(transaction) // Returns: { valid: boolean, errors: Array<string> }
  validateAmount(amount) // Returns: { valid: boolean, error: string }
  validateName(name) // Returns: { valid: boolean, error: string }
  validateCategory(category) // Returns: { valid: boolean, error: string }
  validateCategoryName(name) // Returns: { valid: boolean, error: string } (optional)
}
```

**Validation Rules**:
- **Name**: Non-empty string, trimmed
- **Amount**: Positive number, numeric only
- **Category**: Must be selected from available options
- **Custom Category**: Non-empty, unique, no duplicates (optional)

### 7. CategoryManager (Optional Feature)

**Responsibility**: Manages default and custom categories.

**Interface**:
```javascript
class CategoryManager {
  constructor(storageService)
  
  getDefaultCategories() // Returns: Array<string>
  getCustomCategories() // Returns: Array<string>
  getAllCategories() // Returns: Array<string>
  addCategory(categoryName) // Returns: { success: boolean, error: string }
  categoryExists(categoryName) // Returns: boolean
}
```

**Default Categories**:
```javascript
const DEFAULT_CATEGORIES = [
  'Makanan',
  'Transport',
  'Hiburan'
];
```

### 8. FilterService (Optional Feature)

**Responsibility**: Handles transaction filtering and sorting.

**Interface**:
```javascript
class FilterService {
  filterByMonth(transactions, year, month) // Returns: Array<Transaction>
  sortByAmount(transactions, direction) // direction: 'asc' | 'desc'
  sortByCategory(transactions, direction) // direction: 'asc' | 'desc'
  sortByDate(transactions, direction) // direction: 'asc' | 'desc'
}
```

## Data Models

### Transaction Model

```javascript
{
  id: string,           // Unique identifier (timestamp-random)
  name: string,         // Transaction description
  amount: number,       // Amount in Rupiah (integer)
  category: string,     // Category name
  date: string          // ISO 8601 date string (optional feature)
}
```

**Example**:
```javascript
{
  id: "1705315800000-a3f",
  name: "Makan Siang",
  amount: 35000,
  category: "Makanan",
  date: "2024-01-15T10:30:00.000Z"
}
```

### Category Model

Categories are stored as simple strings. For custom categories (optional feature):

```javascript
{
  expense_categories: [
    "Investasi",
    "Hobi",
    "Hadiah"
  ]
}
```

### Chart Data Model

Data structure passed to Chart.js:

```javascript
{
  labels: Array<string>,      // Category names
  datasets: [{
    data: Array<number>,      // Amounts per category
    backgroundColor: Array<string>, // Colors
    borderWidth: number
  }]
}
```

## Key Algorithms and Logic Flows

### 1. Add Transaction Flow

```
User fills form → User clicks submit
    ↓
Validate inputs (ValidationService)
    ↓
Valid? → No → Show error message → Return
    ↓ Yes
Create transaction object with ID and date
    ↓
Add to TransactionManager
    ↓
Save to Local Storage (StorageService)
    ↓
Update UI:
  - Render transaction list
  - Update balance display
  - Update pie chart
  - Clear form inputs
```

**Algorithm**:
```javascript
function handleAddTransaction(formData) {
  // 1. Validate
  const validation = validationService.validate(formData);
  if (!validation.valid) {
    showErrors(validation.errors);
    return;
  }
  
  // 2. Create transaction
  const transaction = {
    id: generateId(),
    name: formData.name.trim(),
    amount: parseFloat(formData.amount),
    category: formData.category,
    date: new Date().toISOString()
  };
  
  // 3. Add and save
  transactionManager.addTransaction(transaction);
  
  // 4. Update UI
  refreshUI();
  clearForm();
}
```

### 2. Delete Transaction Flow

```
User clicks delete button
    ↓
Get transaction ID from button data attribute
    ↓
Confirm deletion (optional)
    ↓
Delete from TransactionManager
    ↓
Update Local Storage
    ↓
Update UI:
  - Re-render transaction list
  - Update balance
  - Update pie chart
```

### 3. Calculate Balance Algorithm

```javascript
function calculateBalance(transactions) {
  return transactions.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);
}
```

**Time Complexity**: O(n) where n is the number of transactions

### 4. Calculate Category Totals Algorithm

```javascript
function calculateCategoryTotals(transactions) {
  const categoryMap = new Map();
  
  transactions.forEach(transaction => {
    const current = categoryMap.get(transaction.category) || 0;
    categoryMap.set(transaction.category, current + transaction.amount);
  });
  
  return categoryMap;
}
```

**Time Complexity**: O(n) where n is the number of transactions

### 5. Render Transaction List Algorithm

```javascript
function renderTransactionList(transactions) {
  const container = document.getElementById('transaction-list');
  
  // Handle empty state
  if (transactions.length === 0) {
    container.innerHTML = '<p class="text-gray-500">Belum ada transaksi</p>';
    return;
  }
  
  // Sort by date (newest first)
  const sorted = [...transactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  // Generate HTML
  container.innerHTML = sorted.map(transaction => `
    <article class="transaction-item" data-id="${transaction.id}">
      <div class="transaction-info">
        <h3>${escapeHtml(transaction.name)}</h3>
        <span class="category">${escapeHtml(transaction.category)}</span>
      </div>
      <div class="transaction-amount">
        <span>${formatCurrency(transaction.amount)}</span>
        <button class="delete-btn" data-id="${transaction.id}">Hapus</button>
      </div>
    </article>
  `).join('');
  
  // Attach event listeners
  attachDeleteListeners();
}
```

### 6. Update Chart Algorithm

```javascript
function updateChart(transactions) {
  // Calculate category totals
  const categoryTotals = calculateCategoryTotals(transactions);
  
  // Handle empty state
  if (categoryTotals.size === 0) {
    chartRenderer.showEmptyState();
    return;
  }
  
  // Prepare chart data
  const labels = Array.from(categoryTotals.keys());
  const data = Array.from(categoryTotals.values());
  const colors = labels.map((_, index) => CHART_COLORS[index % CHART_COLORS.length]);
  
  // Update or create chart
  chartRenderer.updateChart({
    labels,
    datasets: [{
      data,
      backgroundColor: colors,
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  });
}
```

### 7. Monthly Filter Algorithm (Optional)

```javascript
function filterByMonth(transactions, year, month) {
  return transactions.filter(transaction => {
    const date = new Date(transaction.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}
```

**Time Complexity**: O(n) where n is the number of transactions

### 8. Sort Transactions Algorithm (Optional)

```javascript
function sortTransactions(transactions, sortBy, direction) {
  const sorted = [...transactions];
  
  const comparators = {
    amount: (a, b) => a.amount - b.amount,
    category: (a, b) => a.category.localeCompare(b.category),
    date: (a, b) => new Date(a.date) - new Date(b.date)
  };
  
  sorted.sort(comparators[sortBy]);
  
  if (direction === 'desc') {
    sorted.reverse();
  }
  
  return sorted;
}
```

**Time Complexity**: O(n log n) where n is the number of transactions

## UI/UX Design Considerations

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                        Header                            │
│              Expense & Budget Visualizer                 │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                     Main Content                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Balance Display                       │  │
│  │           Total: Rp 1.250.000                      │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Transaction Input Form                   │  │
│  │  [Name] [Amount] [Category ▼] [Add Button]        │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌─────────────────────┬─────────────────────────────┐  │
│  │  Transaction List   │      Pie Chart              │  │
│  │  • Item 1           │      [Chart.js Canvas]      │  │
│  │  • Item 2           │                             │  │
│  │  • Item 3           │                             │  │
│  └─────────────────────┴─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                        Footer                            │
│         © <span id="year"></span> Your Name              │
│         (Year populated via JavaScript)                  │
└─────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

Using Tailwind CSS responsive utilities:

- **Mobile (< 640px)**: Single column layout, stacked components
- **Tablet (640px - 1024px)**: Two-column layout for list and chart
- **Desktop (> 1024px)**: Optimized spacing, wider content area

### Color Scheme

**Primary Colors**:
- Primary: `#3B82F6` (Blue-500)
- Success: `#10B981` (Green-500)
- Danger: `#EF4444` (Red-500)
- Warning: `#F59E0B` (Amber-500)

**Neutral Colors**:
- Background: `#F9FAFB` (Gray-50)
- Surface: `#FFFFFF` (White)
- Text Primary: `#111827` (Gray-900)
- Text Secondary: `#6B7280` (Gray-500)
- Border: `#E5E7EB` (Gray-200)

### Typography

Using Tailwind CSS default font stack (system fonts):

- **Headings**: `text-2xl` to `text-4xl`, `font-bold`
- **Body**: `text-base`, `font-normal`
- **Small**: `text-sm`, for labels and secondary info
- **Currency**: `text-lg` to `text-3xl`, `font-semibold`

### Interactive Elements

**Buttons**:
- Primary: Blue background, white text, hover effect
- Danger: Red background for delete actions
- Disabled: Gray background, reduced opacity

**Form Inputs**:
- Border on focus with blue accent
- Error state with red border
- Placeholder text in gray

**Transitions**:
- Smooth transitions for hover states (150ms)
- Fade-in for new transactions (300ms)
- Chart updates with animation (500ms)

### Accessibility Features

1. **Semantic HTML**: Proper use of `<header>`, `<main>`, `<footer>`, `<form>`, `<article>`
2. **Labels**: All form inputs have associated `<label>` elements
3. **ARIA Attributes**: 
   - `aria-label` for icon buttons
   - `aria-live` for balance updates
   - `role="alert"` for error messages
4. **Keyboard Navigation**: All interactive elements accessible via Tab key
5. **Focus Indicators**: Visible focus rings on interactive elements
6. **Color Contrast**: WCAG AA compliant contrast ratios

### Error Handling and User Feedback

**Error Messages**:
- Display below form inputs
- Red text color with icon
- Clear, actionable messages in Indonesian

**Success Feedback**:
- Brief animation when transaction added
- Updated balance highlights briefly
- Chart animates on update

**Empty States**:
- Friendly message when no transactions exist
- Guidance on how to add first transaction
- Empty chart shows placeholder message

### Loading States

Since all operations are synchronous with Local Storage:
- No loading spinners needed
- Instant feedback on all actions
- Smooth transitions between states

## Error Handling

### Input Validation Errors

**Error Types**:
1. Empty name field
2. Empty or non-numeric amount
3. No category selected
4. Duplicate category name (optional feature)

**Error Display**:
```javascript
function showError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorElement.classList.add('hidden');
  }, 5000);
}
```

### Storage Errors

**Scenarios**:
1. Local Storage quota exceeded
2. Local Storage disabled by user
3. JSON parse errors

**Handling Strategy**:
```javascript
function handleStorageError(error) {
  console.error('Storage error:', error);
  
  if (error.name === 'QuotaExceededError') {
    alert('Penyimpanan penuh. Hapus beberapa transaksi lama.');
  } else if (error.name === 'SecurityError') {
    alert('Local Storage tidak tersedia. Periksa pengaturan browser.');
  } else {
    alert('Terjadi kesalahan saat menyimpan data.');
  }
}
```

### Chart Rendering Errors

**Scenarios**:
1. Chart.js library fails to load
2. Canvas element not found
3. Invalid data format

**Handling Strategy**:
```javascript
function initChart() {
  try {
    if (typeof Chart === 'undefined') {
      throw new Error('Chart.js not loaded');
    }
    
    const canvas = document.getElementById('expense-chart');
    if (!canvas) {
      throw new Error('Canvas element not found');
    }
    
    chartRenderer = new ChartRenderer(canvas);
  } catch (error) {
    console.error('Chart initialization error:', error);
    document.getElementById('chart-container').innerHTML = 
      '<p class="text-red-500">Grafik tidak dapat dimuat</p>';
  }
}
```

## Testing Strategy

This application uses **example-based testing** and **integration testing** rather than property-based testing, as it primarily involves UI interactions, DOM manipulation, and Local Storage operations.

### Unit Testing

**Test Framework**: Jest or Vitest (recommended for vanilla JS)

**Test Coverage**:

1. **TransactionManager Tests**:
   - Adding a valid transaction creates correct object with ID
   - Deleting a transaction removes it from the list
   - Getting all transactions returns correct array
   - Getting transaction by ID returns correct object or null

2. **BalanceCalculator Tests**:
   - Calculate total with empty array returns 0
   - Calculate total with multiple transactions returns correct sum
   - Calculate by category groups correctly
   - Format currency displays Indonesian Rupiah format

3. **ValidationService Tests**:
   - Empty name is invalid
   - Non-numeric amount is invalid
   - Negative amount is invalid
   - Valid transaction passes validation
   - Duplicate category name is invalid (optional)

4. **StorageService Tests**:
   - Save transactions stores correct JSON
   - Load transactions retrieves correct data
   - Load with no data returns empty array
   - Handle JSON parse errors gracefully

5. **CategoryManager Tests** (Optional):
   - Get all categories includes defaults and custom
   - Add category succeeds with valid name
   - Add duplicate category fails
   - Category exists check works correctly

6. **FilterService Tests** (Optional):
   - Filter by month returns only matching transactions
   - Sort by amount orders correctly (asc/desc)
   - Sort by category orders alphabetically

### Integration Testing

**Test Scenarios**:

1. **Complete Transaction Flow**:
   - User adds transaction → appears in list → balance updates → chart updates → data persists

2. **Delete Transaction Flow**:
   - User deletes transaction → removed from list → balance updates → chart updates → storage updated

3. **Page Reload**:
   - Add transactions → reload page → transactions still visible → balance correct → chart correct

4. **Form Validation**:
   - Submit empty form → errors shown → no transaction added
   - Submit valid form → success → form cleared

5. **Monthly Filter** (Optional):
   - Select month → list filtered → balance filtered → chart filtered
   - Select "All" → full list restored

6. **Sorting** (Optional):
   - Click sort by amount → list reordered
   - Click again → reversed order
   - Sort indicator updates

### Manual Testing Checklist

**Functionality**:
- [ ] Add transaction with all fields
- [ ] Add transaction with missing fields (should fail)
- [ ] Delete transaction
- [ ] Balance calculates correctly
- [ ] Chart displays correct proportions
- [ ] Data persists after page reload
- [ ] Custom category can be added (optional)
- [ ] Monthly filter works (optional)
- [ ] Sorting works in both directions (optional)

**Responsive Design**:
- [ ] Mobile view (320px width)
- [ ] Tablet view (768px width)
- [ ] Desktop view (1024px+ width)
- [ ] Layout adapts correctly at breakpoints

**Browser Compatibility**:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

**Accessibility**:
- [ ] Keyboard navigation works
- [ ] Screen reader announces form labels
- [ ] Focus indicators visible
- [ ] Error messages announced
- [ ] Color contrast sufficient

### Test Data

**Sample Transactions**:
```javascript
const testTransactions = [
  { name: "Makan Siang", amount: 35000, category: "Makanan" },
  { name: "Bensin", amount: 50000, category: "Transport" },
  { name: "Nonton Film", amount: 45000, category: "Hiburan" },
  { name: "Belanja Bulanan", amount: 500000, category: "Makanan" },
  { name: "Grab", amount: 75000, category: "Transport" }
];
```

**Edge Cases**:
- Empty transaction list
- Single transaction
- Large number of transactions (100+)
- Very large amounts (billions)
- Very small amounts (< 1000)
- Long transaction names
- Special characters in names

## Implementation Notes

### Footer Dynamic Year

The footer copyright year should be populated dynamically using JavaScript to ensure it always displays the current year:

**HTML Structure**:
```html
<footer>
  <p>&copy; <span id="year"></span> Your Name</p>
</footer>
```

**JavaScript Implementation**:
```javascript
// Set on page load
document.getElementById('year').textContent = new Date().getFullYear();
```

This ensures the year updates automatically without manual code changes.

### Initialization Sequence

```javascript
// 1. Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // 2. Set dynamic footer year
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // 3. Initialize services
  const storageService = new StorageService();
  const transactionManager = new TransactionManager(storageService);
  const balanceCalculator = new BalanceCalculator();
  const chartRenderer = new ChartRenderer(document.getElementById('expense-chart'));
  const validationService = new ValidationService();
  const categoryManager = new CategoryManager(storageService); // Optional
  
  // 4. Initialize UI controller
  const uiController = new UIController(
    transactionManager,
    balanceCalculator,
    chartRenderer,
    validationService,
    categoryManager
  );
  
  // 5. Load data and render initial UI
  uiController.init();
});
```

### Performance Considerations

1. **Debouncing**: Not needed for this application (no real-time search/filter)
2. **Lazy Loading**: Not applicable (single page, small data set)
3. **Memoization**: Not needed (calculations are fast with small data sets)
4. **Virtual Scrolling**: Not needed unless transaction count exceeds 1000+

**Expected Performance**:
- Transaction add/delete: < 50ms
- Balance calculation: < 10ms for 100 transactions
- Chart update: < 500ms (Chart.js animation)
- Page load: < 1s (including CDN resources)

### Security Considerations

1. **XSS Prevention**: Escape all user input before rendering to DOM
2. **Input Sanitization**: Trim and validate all form inputs
3. **Local Storage**: Data is client-side only, no server transmission
4. **No Sensitive Data**: Application doesn't handle passwords or personal info

**HTML Escaping Function**:
```javascript
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

### Browser Compatibility

**Minimum Requirements**:
- ES6 support (const, let, arrow functions, classes)
- Local Storage API
- Canvas API (for Chart.js)
- Flexbox support

**Supported Browsers**:
- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 15+
- iOS Safari 10+
- Chrome Mobile 51+

### Deployment Considerations

**GitHub Pages Setup**:
1. Repository must be public
2. Enable GitHub Pages in repository settings
3. Select main branch as source
4. Access via `https://username.github.io/repository-name/`

**CDN Resources**:
- Tailwind CSS: `https://cdn.tailwindcss.com`
- Chart.js: `https://cdn.jsdelivr.net/npm/chart.js`

**File Size Estimates**:
- index.html: ~5 KB
- style.css: ~2 KB
- script.js: ~15-20 KB
- Total (excluding CDN): ~25 KB

### Future Enhancements

Potential features for future iterations:

1. **Export/Import**: Export transactions as CSV or JSON
2. **Budget Limits**: Set monthly budget limits with warnings
3. **Dark Mode**: Toggle between light and dark themes
4. **Multi-Currency**: Support for different currencies
5. **Recurring Transactions**: Auto-add monthly recurring expenses
6. **Search**: Search transactions by name or category
7. **Date Range Filter**: Filter by custom date ranges
8. **Statistics**: More detailed analytics and trends
9. **Backup**: Cloud backup integration
10. **PWA**: Progressive Web App with offline support

## Conclusion

This design provides a solid foundation for building the Expense & Budget Visualizer application. The architecture is simple yet extensible, allowing for easy addition of optional features while maintaining code quality and user experience. The use of vanilla JavaScript ensures minimal dependencies and fast performance, while Tailwind CSS and Chart.js provide professional styling and visualization capabilities.

The modular component structure allows for independent testing and future enhancements without major refactoring. The focus on semantic HTML and accessibility ensures the application is usable by a wide range of users and devices.



## tambahan
Kiro, design approved. 

Sebelum mulai koding, tolong sesuaikan 2 hal:
1. Default categories hanya 3: Makanan, Transport, Hiburan (bukan 7)
2. Footer copyright pakai tahun dinamis

Setelah itu, generate code step by step:
- Step 1: index.html dengan semantic HTML5 + Tailwind CDN + Chart.js CDN
- Step 2: css/style.css untuk dark mode override
- Step 3: js/script.js dengan struktur class seperti di desain
- Step 4: CODEBASE_GUIDE.md

Kerjakan Step 1 dulu, lalu laporkan.