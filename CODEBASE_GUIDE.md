# Codebase Guide - Expense & Budget Visualizer

## Technology Stack

- **HTML5**: Semantic markup for structure and accessibility
- **Vanilla JavaScript**: Pure JavaScript without frameworks for simplicity
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **Chart.js**: JavaScript charting library for pie chart visualization

## Project Structure

```
ExpenseBudgetVisualizer/
├── index.html              # Main HTML file with semantic structure
├── css/
│   └── style.css          # Custom CSS for styles not covered by Tailwind
├── js/
│   └── script.js          # All application logic and functionality
├── .kiro/
│   └── specs/             # Specification documents
└── CODEBASE_GUIDE.md      # This file
```

## How to Run the Application

1. **Open in Browser**: Simply open `index.html` in any modern web browser
2. **No Build Required**: The application runs directly without compilation or build steps
3. **No Server Needed**: All functionality works client-side using Local Storage

**Supported Browsers:**
- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 15+
- Mobile browsers (iOS Safari 10+, Chrome Mobile 51+)

## Data Flow

### 1. Form Input → Validation → Storage → Render

```
User fills form
    ↓
validateTransaction() checks name, amount, category
    ↓
Valid? → addTransaction() creates object with ID and date
    ↓
saveTransactions() persists to Local Storage
    ↓
renderAll() updates all UI components
```

### 2. Delete Transaction Flow

```
User clicks delete button
    ↓
deleteTransaction() removes from array
    ↓
saveTransactions() updates Local Storage
    ↓
renderAll() refreshes UI
```

### 3. Filter and Sort Flow

```
User selects month filter or sort option
    ↓
getFilteredTransactions() applies month filter
    ↓
applySorting() applies sort (amount/category)
    ↓
renderTransactionList() displays filtered & sorted data
```

## Key Functions and Their Purposes

### Storage Functions

- **`loadTransactions()`**: Retrieves transactions from Local Storage on page load
- **`saveTransactions(transactionsArray)`**: Persists transactions to Local Storage
- **`loadCustomCategories()`**: Retrieves custom categories from Local Storage
- **`saveCustomCategories(categoriesArray)`**: Persists custom categories to Local Storage
- **`generateId()`**: Creates unique IDs using timestamp + random string

### Validation Functions

- **`validateTransaction(transaction)`**: Validates all transaction fields
- **`validateName(name)`**: Checks name is non-empty
- **`validateAmount(amount)`**: Checks amount is numeric and positive
- **`validateCategory(category)`**: Checks category is selected
- **`validateCategoryName(categoryName)`**: Validates custom category (non-empty, no duplicates)

### Category Management Functions

- **`getAllCategories()`**: Returns merged default + custom categories
- **`addCategory(categoryName)`**: Adds new custom category with validation
- **`populateCategoryDropdown()`**: Updates category dropdown with all categories
- **`handleAddCategory()`**: Handles "+ Kategori" button click

### Transaction Management Functions

- **`addTransaction(transactionData)`**: Creates and saves new transaction
- **`deleteTransaction(transactionId)`**: Removes transaction by ID
- **`handleFormSubmit(event)`**: Processes form submission with validation

### Filter and Sort Functions

- **`filterByMonth(transactionsArray, year, month)`**: Filters transactions by specific month
- **`getFilteredTransactions()`**: Returns transactions based on current month filter
- **`generateMonthOptions()`**: Extracts unique months from transactions
- **`formatMonthDisplay(monthString)`**: Formats month as "Januari 2024"
- **`sortByAmount(transactionsArray, direction)`**: Sorts by amount (asc/desc)
- **`sortByCategory(transactionsArray, direction)`**: Sorts by category (alphabetical)
- **`sortByDate(transactionsArray, direction)`**: Sorts by date (newest/oldest)
- **`applySorting(transactionsArray)`**: Applies current sort state

### UI Rendering Functions

- **`renderAll()`**: Orchestrates all UI updates (list, balance, chart, filters)
- **`renderTransactionList()`**: Displays filtered and sorted transactions
- **`updateTotalBalance()`**: Calculates and displays total from filtered transactions
- **`updateChart()`**: Renders pie chart from filtered transactions
- **`escapeHtml(text)`**: Prevents XSS attacks by escaping HTML

### Balance and Chart Functions

- **`formatCurrency(amount)`**: Formats numbers as Indonesian Rupiah (Rp X.XXX)
- **`calculateCategoryTotals(transactionsArray)`**: Groups transactions by category using Map

## Local Storage Schema

### Transaction Storage

**Key**: `expense_transactions`

**Format**: JSON array of transaction objects

```json
[
  {
    "id": "1714500000000-a3f",
    "name": "Makan Siang",
    "amount": 35000,
    "category": "Makanan",
    "date": "2024-04-30T10:30:00.000Z"
  },
  {
    "id": "1714510000000-b7k",
    "name": "Bensin",
    "amount": 50000,
    "category": "Transport",
    "date": "2024-04-30T12:45:00.000Z"
  }
]
```

### Custom Categories Storage

**Key**: `expense_categories`

**Format**: JSON array of category strings

```json
[
  "Investasi",
  "Hobi",
  "Hadiah"
]
```

## Default Categories

The application comes with 3 default categories:
1. **Makanan** - Food and dining expenses
2. **Transport** - Transportation costs
3. **Hiburan** - Entertainment expenses

Users can add custom categories via the "+ Kategori" button.

## Features

### Core Features

1. **Add Transaction**: Form with validation for name, amount, and category
2. **View Transactions**: List displays all transactions with name, amount, category
3. **Delete Transaction**: Each transaction has a delete button
4. **Total Balance**: Real-time calculation of total expenses
5. **Pie Chart**: Visual representation of expenses by category
6. **Data Persistence**: All data saved to Local Storage

### Optional Features

1. **Custom Categories**: Add new categories beyond the 3 defaults
2. **Monthly Summary**: Filter transactions by month with dropdown
3. **Sort Transactions**: Sort by amount or category (ascending/descending)

## Responsive Design

The application uses Tailwind CSS with mobile-first approach:

- **Mobile (< 640px)**: Single column layout, stacked components
- **Tablet (640px - 1024px)**: Two-column layout for list and chart
- **Desktop (> 1024px)**: Optimized spacing, wider content area

## Color Scheme

### Primary Colors
- **Primary**: #3B82F6 (Blue-500)
- **Success**: #10B981 (Green-500)
- **Danger**: #EF4444 (Red-500)
- **Warning**: #F59E0B (Amber-500)

### Chart Colors
The pie chart uses 8 distinct colors that cycle through categories:
1. Blue (#3B82F6)
2. Green (#10B981)
3. Amber (#F59E0B)
4. Red (#EF4444)
5. Purple (#8B5CF6)
6. Pink (#EC4899)
7. Teal (#14B8A6)
8. Orange (#F97316)

## Error Handling

### Input Validation Errors
- Empty name: "Nama transaksi tidak boleh kosong"
- Empty amount: "Jumlah tidak boleh kosong"
- Non-numeric amount: "Jumlah harus berupa angka"
- Negative amount: "Jumlah harus lebih besar dari 0"
- No category: "Kategori harus dipilih"
- Empty category name: "Nama kategori tidak boleh kosong"
- Duplicate category: "Kategori sudah ada"

### Storage Errors
- **QuotaExceededError**: "Penyimpanan penuh. Hapus beberapa transaksi lama."
- **SecurityError**: "Local Storage tidak tersedia. Periksa pengaturan browser."
- **Generic errors**: "Terjadi kesalahan saat menyimpan data."

## Security

### XSS Prevention
All user input is escaped before rendering to DOM using `escapeHtml()` function:

```javascript
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

This prevents malicious scripts from being executed through transaction names or categories.

## Deployment

### GitHub Repository
**Repository Name**: `CodingCamp-27Apr26-alpharidhoalvidi`

### GitHub Pages Deployment

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Expense & Budget Visualizer"
   git branch -M main
   git remote add origin https://github.com/username/CodingCamp-27Apr26-alpharidhoalvidi.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Navigate to "Pages" section
   - Select "main" branch as source
   - Click "Save"

3. **Access Application**:
   - URL: `https://username.github.io/CodingCamp-27Apr26-alpharidhoalvidi/`
   - Wait 1-2 minutes for deployment to complete

### CDN Resources

The application uses these CDN resources:
- **Tailwind CSS**: `https://cdn.tailwindcss.com`
- **Chart.js**: `https://cdn.jsdelivr.net/npm/chart.js`

Both are loaded from CDN, so no local installation is required.

## Development Notes

### No Build Process
- Pure vanilla JavaScript - no transpilation needed
- Tailwind CSS via CDN - no compilation required
- Chart.js via CDN - no bundling needed

### No Test Files
This project does not include test files. All functionality can be verified by:
1. Opening `index.html` in a browser
2. Manually testing each feature
3. Checking browser console for errors
4. Inspecting Local Storage in DevTools

### Code Organization
All JavaScript code is in a single file (`js/script.js`) organized into sections:
1. Global Variables
2. Storage Service Functions
3. Validation Service Functions
4. Category Management Functions
5. Transaction Management Functions
6. Filter and Sort Functions
7. Balance Calculation Functions
8. Chart Rendering Functions
9. UI Rendering Functions
10. Application Initialization

## Troubleshooting

### Transactions Not Persisting
- Check if Local Storage is enabled in browser settings
- Check browser console for SecurityError messages
- Try clearing Local Storage and reloading

### Chart Not Displaying
- Verify Chart.js CDN is loading (check Network tab)
- Check browser console for Chart.js errors
- Ensure canvas element exists in DOM

### Styling Issues
- Verify Tailwind CSS CDN is loading
- Check if custom CSS file is linked correctly
- Clear browser cache and reload

## Future Enhancements

Potential features for future versions:
- Export/Import transactions as CSV or JSON
- Budget limits with warnings
- Dark mode toggle
- Multi-currency support
- Recurring transactions
- Search functionality
- Date range filters
- Advanced statistics and trends
- Cloud backup integration
- Progressive Web App (PWA) support

---

**Last Updated**: April 30, 2026
**Version**: 1.0.0
