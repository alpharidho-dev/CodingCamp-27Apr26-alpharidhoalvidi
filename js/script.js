// Expense & Budget Visualizer - Main JavaScript File
// This file will contain all application logic

// ============================================
// Global Variables
// ============================================
let transactions = [];
let chartInstance = null; // Store chart instance globally to destroy before recreating
let customCategories = []; // Store custom categories
let currentMonthFilter = 'all'; // Store current month filter state ('all' or 'YYYY-MM')
let currentSortBy = null; // Store current sort field ('amount', 'category', or null for date)
let currentSortDirection = 'asc'; // Store current sort direction ('asc' or 'desc')

// Default categories
const DEFAULT_CATEGORIES = ['Makanan', 'Transport', 'Hiburan'];

// Chart color palette
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

// ============================================
// Storage Service Functions
// ============================================

/**
 * Load custom categories from Local Storage
 * @returns {Array} Array of custom category strings
 */
function loadCustomCategories() {
  try {
    const storedData = localStorage.getItem('expense_categories');
    
    if (!storedData) {
      return [];
    }
    
    const parsedData = JSON.parse(storedData);
    
    // Validate that parsed data is an array
    if (!Array.isArray(parsedData)) {
      console.error('Invalid category data format in Local Storage');
      return [];
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error loading custom categories:', error);
    return [];
  }
}

/**
 * Save custom categories to Local Storage
 * @param {Array} categoriesArray - Array of custom category strings
 * @returns {boolean} Success status
 */
function saveCustomCategories(categoriesArray) {
  try {
    const jsonData = JSON.stringify(categoriesArray);
    localStorage.setItem('expense_categories', jsonData);
    return true;
  } catch (error) {
    console.error('Error saving custom categories:', error);
    if (error.name === 'QuotaExceededError') {
      alert('Penyimpanan penuh. Hapus beberapa kategori.');
    }
    return false;
  }
}

/**
 * Load transactions from Local Storage
 * @returns {Array} Array of transaction objects
 */
function loadTransactions() {
  try {
    const storedData = localStorage.getItem('expense_transactions');
    
    if (!storedData) {
      return [];
    }
    
    const parsedData = JSON.parse(storedData);
    
    // Validate that parsed data is an array
    if (!Array.isArray(parsedData)) {
      console.error('Invalid data format in Local Storage');
      return [];
    }
    
    return parsedData;
  } catch (error) {
    // Handle JSON parsing errors and other storage errors
    if (error instanceof SyntaxError) {
      console.error('JSON parsing error:', error);
    } else if (error.name === 'SecurityError') {
      console.error('Local Storage access denied:', error);
    } else {
      console.error('Error loading transactions:', error);
    }
    return [];
  }
}

/**
 * Save transactions to Local Storage
 * @param {Array} transactionsArray - Array of transaction objects to save
 * @returns {boolean} Success status
 */
function saveTransactions(transactionsArray) {
  try {
    const jsonData = JSON.stringify(transactionsArray);
    localStorage.setItem('expense_transactions', jsonData);
    return true;
  } catch (error) {
    // Handle storage errors
    if (error.name === 'QuotaExceededError') {
      console.error('Local Storage quota exceeded:', error);
      alert('Penyimpanan penuh. Hapus beberapa transaksi lama.');
    } else if (error.name === 'SecurityError') {
      console.error('Local Storage access denied:', error);
      alert('Local Storage tidak tersedia. Periksa pengaturan browser.');
    } else {
      console.error('Error saving transactions:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
    return false;
  }
}

/**
 * Generate unique ID for transactions
 * Format: timestamp-random (e.g., "1705315800000-a3f")
 * @returns {string} Unique transaction ID
 */
function generateId() {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 5);
  return `${timestamp}-${randomStr}`;
}

// ============================================
// Validation Service Functions
// ============================================

/**
 * Validate transaction data
 * @param {Object} transaction - Transaction object with name, amount, category
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateTransaction(transaction) {
  const errors = {};
  let isValid = true;

  // Validate name (non-empty, trimmed)
  const nameValidation = validateName(transaction.name);
  if (!nameValidation.valid) {
    errors.name = nameValidation.error;
    isValid = false;
  }

  // Validate amount (non-empty, numeric, positive)
  const amountValidation = validateAmount(transaction.amount);
  if (!amountValidation.valid) {
    errors.amount = amountValidation.error;
    isValid = false;
  }

  // Validate category (selected)
  const categoryValidation = validateCategory(transaction.category);
  if (!categoryValidation.valid) {
    errors.category = categoryValidation.error;
    isValid = false;
  }

  return {
    valid: isValid,
    errors: errors
  };
}

/**
 * Validate transaction name
 * @param {string} name - Transaction name
 * @returns {Object} Validation result
 */
function validateName(name) {
  const trimmedName = (name || '').trim();
  
  if (!trimmedName) {
    return {
      valid: false,
      error: 'Nama transaksi tidak boleh kosong'
    };
  }
  
  return {
    valid: true,
    error: ''
  };
}

/**
 * Validate transaction amount
 * @param {string|number} amount - Transaction amount
 * @returns {Object} Validation result
 */
function validateAmount(amount) {
  // Check if empty
  if (amount === '' || amount === null || amount === undefined) {
    return {
      valid: false,
      error: 'Jumlah tidak boleh kosong'
    };
  }
  
  // Check if numeric
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    return {
      valid: false,
      error: 'Jumlah harus berupa angka'
    };
  }
  
  // Check if positive
  if (numericAmount <= 0) {
    return {
      valid: false,
      error: 'Jumlah harus lebih besar dari 0'
    };
  }
  
  return {
    valid: true,
    error: ''
  };
}

/**
 * Validate transaction category
 * @param {string} category - Transaction category
 * @returns {Object} Validation result
 */
function validateCategory(category) {
  if (!category || category === '') {
    return {
      valid: false,
      error: 'Kategori harus dipilih'
    };
  }
  
  return {
    valid: true,
    error: ''
  };
}

/**
 * Validate custom category name
 * @param {string} categoryName - Category name to validate
 * @returns {Object} Validation result
 */
function validateCategoryName(categoryName) {
  const trimmedName = (categoryName || '').trim();
  
  // Check if empty
  if (!trimmedName) {
    return {
      valid: false,
      error: 'Nama kategori tidak boleh kosong'
    };
  }
  
  // Check if already exists in default or custom categories
  const allCategories = getAllCategories();
  if (allCategories.includes(trimmedName)) {
    return {
      valid: false,
      error: 'Kategori sudah ada'
    };
  }
  
  return {
    valid: true,
    error: ''
  };
}

/**
 * Display error message for a specific field
 * @param {string} fieldName - Name of the field (name, amount, category)
 * @param {string} message - Error message to display
 */
function showError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorElement.classList.add('hidden');
    }, 5000);
  }
}

/**
 * Clear all error messages
 */
function clearErrors() {
  const errorElements = ['name-error', 'amount-error', 'category-error'];
  errorElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = '';
      element.classList.add('hidden');
    }
  });
}

/**
 * Clear form inputs
 */
function clearForm() {
  const form = document.getElementById('transaction-form');
  if (form) {
    form.reset();
  }
}

// ============================================
// Category Management Functions
// ============================================

/**
 * Get all categories (default + custom)
 * @returns {Array} Array of all category names
 */
function getAllCategories() {
  return [...DEFAULT_CATEGORIES, ...customCategories];
}

/**
 * Check if category exists
 * @param {string} categoryName - Category name to check
 * @returns {boolean} True if category exists
 */
function categoryExists(categoryName) {
  const allCategories = getAllCategories();
  return allCategories.includes(categoryName);
}

/**
 * Add a new custom category
 * @param {string} categoryName - Name of the category to add
 * @returns {Object} Result with success flag and error message
 */
function addCategory(categoryName) {
  // Validate category name
  const validation = validateCategoryName(categoryName);
  
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error
    };
  }
  
  // Add to custom categories array
  customCategories.push(categoryName.trim());
  
  // Save to Local Storage
  const saved = saveCustomCategories(customCategories);
  
  if (!saved) {
    // Remove from array if save failed
    customCategories.pop();
    return {
      success: false,
      error: 'Gagal menyimpan kategori'
    };
  }
  
  return {
    success: true,
    error: ''
  };
}

/**
 * Populate category dropdown with default and custom categories
 */
function populateCategoryDropdown() {
  const categorySelect = document.getElementById('transaction-category');
  
  if (!categorySelect) {
    console.error('Category select element not found');
    return;
  }
  
  // Get all categories
  const allCategories = getAllCategories();
  
  // Clear existing options except the first placeholder option
  categorySelect.innerHTML = '<option value="">-- Pilih Kategori --</option>';
  
  // Add all categories as options
  allCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

/**
 * Handle add category button click
 */
function handleAddCategory() {
  // Prompt user for category name
  const categoryName = prompt('Masukkan nama kategori baru:');
  
  // User cancelled
  if (categoryName === null) {
    return;
  }
  
  // Add category
  const result = addCategory(categoryName);
  
  if (!result.success) {
    // Show error message
    alert(result.error);
    return;
  }
  
  // Update dropdown
  populateCategoryDropdown();
  
  // Show success feedback
  console.log('Custom category added:', categoryName.trim());
}

// ============================================
// Transaction Management Functions
// ============================================

/**
 * Filter transactions by month
 * @param {Array} transactionsArray - Array of transaction objects
 * @param {number} year - Year to filter (e.g., 2024)
 * @param {number} month - Month to filter (0-11, where 0 is January)
 * @returns {Array} Filtered array of transactions
 */
function filterByMonth(transactionsArray, year, month) {
  return transactionsArray.filter(transaction => {
    const date = new Date(transaction.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}

/**
 * Get filtered transactions based on current filter state
 * @returns {Array} Filtered transactions array
 */
function getFilteredTransactions() {
  // If filter is 'all', return all transactions
  if (currentMonthFilter === 'all') {
    return transactions;
  }
  
  // Parse year and month from filter value (format: 'YYYY-MM')
  const [year, month] = currentMonthFilter.split('-').map(Number);
  
  // Filter transactions by selected month (month is 1-12, need to convert to 0-11)
  return filterByMonth(transactions, year, month - 1);
}

/**
 * Generate month options from existing transaction dates
 * @returns {Array} Array of unique month strings in format 'YYYY-MM'
 */
function generateMonthOptions() {
  if (transactions.length === 0) {
    return [];
  }
  
  // Extract unique year-month combinations
  const monthSet = new Set();
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Convert 0-11 to 01-12
    monthSet.add(`${year}-${month}`);
  });
  
  // Convert to array and sort in descending order (newest first)
  return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
}

/**
 * Format month string for display
 * @param {string} monthString - Month string in format 'YYYY-MM'
 * @returns {string} Formatted month string (e.g., 'Januari 2024')
 */
function formatMonthDisplay(monthString) {
  const [year, month] = monthString.split('-');
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const monthIndex = parseInt(month) - 1;
  return `${monthNames[monthIndex]} ${year}`;
}

/**
 * Populate month filter dropdown
 */
function populateMonthFilter() {
  const monthFilter = document.getElementById('month-filter');
  
  if (!monthFilter) {
    console.error('Month filter element not found');
    return;
  }
  
  // Generate month options from transactions
  const monthOptions = generateMonthOptions();
  
  // Clear existing options except "Semua Bulan"
  monthFilter.innerHTML = '<option value="all">Semua Bulan</option>';
  
  // Add month options
  monthOptions.forEach(monthString => {
    const option = document.createElement('option');
    option.value = monthString;
    option.textContent = formatMonthDisplay(monthString);
    monthFilter.appendChild(option);
  });
  
  // Set current filter value
  monthFilter.value = currentMonthFilter;
}

/**
 * Handle month filter change
 * @param {Event} event - Change event from month filter dropdown
 */
function handleMonthFilterChange(event) {
  // Update current filter state
  currentMonthFilter = event.target.value;
  
  // Re-render all UI components with filtered data
  renderAll();
  
  console.log('Month filter changed to:', currentMonthFilter);
}

// ============================================
// Sort Functions
// ============================================

/**
 * Sort transactions by amount
 * @param {Array} transactionsArray - Array of transaction objects
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted array of transactions
 */
function sortByAmount(transactionsArray, direction) {
  const sorted = [...transactionsArray];
  
  sorted.sort((a, b) => {
    if (direction === 'asc') {
      return a.amount - b.amount;
    } else {
      return b.amount - a.amount;
    }
  });
  
  return sorted;
}

/**
 * Sort transactions by category
 * @param {Array} transactionsArray - Array of transaction objects
 * @param {string} direction - Sort direction ('asc' for alphabetical, 'desc' for reverse)
 * @returns {Array} Sorted array of transactions
 */
function sortByCategory(transactionsArray, direction) {
  const sorted = [...transactionsArray];
  
  sorted.sort((a, b) => {
    if (direction === 'asc') {
      return a.category.localeCompare(b.category);
    } else {
      return b.category.localeCompare(a.category);
    }
  });
  
  return sorted;
}

/**
 * Sort transactions by date
 * @param {Array} transactionsArray - Array of transaction objects
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted array of transactions
 */
function sortByDate(transactionsArray, direction) {
  const sorted = [...transactionsArray];
  
  sorted.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (direction === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
  
  return sorted;
}

/**
 * Apply current sort to transactions
 * @param {Array} transactionsArray - Array of transaction objects
 * @returns {Array} Sorted array of transactions
 */
function applySorting(transactionsArray) {
  // If no sort is active, sort by date (newest first) - default behavior
  if (!currentSortBy) {
    return sortByDate(transactionsArray, 'desc');
  }
  
  // Apply the current sort
  if (currentSortBy === 'amount') {
    return sortByAmount(transactionsArray, currentSortDirection);
  } else if (currentSortBy === 'category') {
    return sortByCategory(transactionsArray, currentSortDirection);
  }
  
  // Fallback to date sort
  return sortByDate(transactionsArray, 'desc');
}

/**
 * Handle sort button click
 * @param {Event} event - Click event from sort button
 */
function handleSortClick(event) {
  const button = event.target.closest('.sort-btn');
  
  if (!button) return;
  
  const sortBy = button.getAttribute('data-sort-by');
  
  // Toggle direction if clicking the same sort button
  if (currentSortBy === sortBy) {
    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    // New sort field, start with ascending
    currentSortBy = sortBy;
    currentSortDirection = 'asc';
  }
  
  // Update sort button UI
  updateSortButtonUI();
  
  // Re-render transaction list with new sort
  renderTransactionList();
  
  console.log(`Sort changed to: ${currentSortBy} ${currentSortDirection}`);
}

/**
 * Update sort button UI to show active sort and direction
 */
function updateSortButtonUI() {
  // Get all sort buttons
  const sortButtons = document.querySelectorAll('.sort-btn');
  
  sortButtons.forEach(button => {
    const sortBy = button.getAttribute('data-sort-by');
    const indicator = button.querySelector('.sort-indicator');
    
    if (!indicator) return;
    
    // Check if this button is the active sort
    if (currentSortBy === sortBy) {
      // Add active styling
      button.classList.add('bg-blue-50', 'border-blue-500', 'text-blue-700');
      button.classList.remove('text-gray-700');
      
      // Show direction indicator
      if (currentSortDirection === 'asc') {
        indicator.textContent = '↑';
      } else {
        indicator.textContent = '↓';
      }
    } else {
      // Remove active styling
      button.classList.remove('bg-blue-50', 'border-blue-500', 'text-blue-700');
      button.classList.add('text-gray-700');
      
      // Clear direction indicator
      indicator.textContent = '';
    }
  });
}

/**
 * Add a new transaction
 * @param {Object} transactionData - Transaction data from form
 * @returns {boolean} Success status
 */
function addTransaction(transactionData) {
  // Create transaction object with ID and date
  const transaction = {
    id: generateId(),
    name: transactionData.name.trim(),
    amount: parseFloat(transactionData.amount),
    category: transactionData.category,
    date: new Date().toISOString()
  };
  
  // Add to transactions array
  transactions.push(transaction);
  
  // Save to Local Storage
  const saved = saveTransactions(transactions);
  
  return saved;
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
  // Prevent default form submission
  event.preventDefault();
  
  // Clear previous errors
  clearErrors();
  
  // Get form data
  const form = event.target;
  const formData = {
    name: form.elements['name'].value,
    amount: form.elements['amount'].value,
    category: form.elements['category'].value
  };
  
  // Validate transaction
  const validation = validateTransaction(formData);
  
  // If validation fails, show errors and prevent submission
  if (!validation.valid) {
    // Display error messages
    if (validation.errors.name) {
      showError('name', validation.errors.name);
    }
    if (validation.errors.amount) {
      showError('amount', validation.errors.amount);
    }
    if (validation.errors.category) {
      showError('category', validation.errors.category);
    }
    return;
  }
  
  // Add transaction
  const success = addTransaction(formData);
  
  if (success) {
    // Clear form on successful submission
    clearForm();
    
    // Clear any remaining error messages
    clearErrors();
    
    // Update all UI components
    renderAll();
    
    console.log('Transaction added successfully');
    console.log(`Total transactions: ${transactions.length}`);
  }
}

// ============================================
// Balance Calculation Functions
// ============================================

/**
 * Format number as Indonesian Rupiah currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string (e.g., "Rp 1.234.567")
 */
function formatCurrency(amount) {
  // Convert to string and add thousand separators
  const formatted = amount.toLocaleString('id-ID');
  return `Rp ${formatted}`;
}

/**
 * Update total balance display
 * Calculates sum of all transaction amounts and updates the balance display
 * Uses filtered transactions based on current month filter
 */
function updateTotalBalance() {
  // Get filtered transactions
  const filteredTransactions = getFilteredTransactions();
  
  // Calculate total using Array.reduce()
  const total = filteredTransactions.reduce((sum, transaction) => {
    return sum + transaction.amount;
  }, 0);
  
  // Format and display the balance
  const balanceDisplay = document.getElementById('balance-display');
  if (balanceDisplay) {
    balanceDisplay.textContent = formatCurrency(total);
  }
}

// ============================================
// Chart Rendering Functions
// ============================================

/**
 * Calculate category totals using Map data structure
 * @param {Array} transactionsArray - Array of transaction objects
 * @returns {Map} Map with category names as keys and total amounts as values
 */
function calculateCategoryTotals(transactionsArray) {
  const categoryMap = new Map();
  
  transactionsArray.forEach(transaction => {
    const category = transaction.category;
    const currentTotal = categoryMap.get(category) || 0;
    categoryMap.set(category, currentTotal + transaction.amount);
  });
  
  return categoryMap;
}

/**
 * Update or render Chart.js pie chart
 * Displays proportion of expenses for each category
 * Uses filtered transactions based on current month filter
 */
function updateChart() {
  const canvas = document.getElementById('expense-chart');
  const chartContainer = document.getElementById('chart-container');
  
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }
  
  // Get filtered transactions
  const filteredTransactions = getFilteredTransactions();
  
  // Calculate category totals from filtered transactions
  const categoryTotals = calculateCategoryTotals(filteredTransactions);
  
  // Handle empty state - no transactions
  if (categoryTotals.size === 0 || filteredTransactions.length === 0) {
    // Destroy existing chart if any
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    
    // Show empty state message
    if (chartContainer) {
      chartContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Belum ada data untuk ditampilkan</p>';
    }
    return;
  }
  
  // Restore canvas if it was replaced by empty state message
  if (!canvas.getContext) {
    chartContainer.innerHTML = '<canvas id="expense-chart" class="max-w-full max-h-[400px]"></canvas>';
    const newCanvas = document.getElementById('expense-chart');
    if (!newCanvas) return;
  }
  
  // Prepare chart data
  const labels = Array.from(categoryTotals.keys());
  const data = Array.from(categoryTotals.values());
  const colors = labels.map((_, index) => CHART_COLORS[index % CHART_COLORS.length]);
  
  // Destroy previous chart instance before creating new one
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  
  // Create new chart instance
  try {
    chartInstance = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: Rp ${value.toLocaleString('id-ID')} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating chart:', error);
    if (chartContainer) {
      chartContainer.innerHTML = '<p class="text-red-500 text-center py-8">Grafik tidak dapat dimuat</p>';
    }
  }
}

// ============================================
// UI Rendering Functions
// ============================================

/**
 * Render all UI components
 * Convenience function that orchestrates all UI updates
 * Ensures all components (transaction list, balance, chart, month filter) stay in sync
 */
function renderAll() {
  populateMonthFilter();
  renderTransactionList();
  updateTotalBalance();
  updateChart();
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML string
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Render transaction list
 * Displays all transactions with name, amount, category, and delete button
 * Uses filtered transactions based on current month filter
 */
function renderTransactionList() {
  const container = document.getElementById('transaction-list');
  
  if (!container) {
    console.error('Transaction list container not found');
    return;
  }
  
  // Get filtered transactions
  const filteredTransactions = getFilteredTransactions();
  
  // Handle empty state
  if (filteredTransactions.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">Belum ada transaksi</p>';
    return;
  }
  
  // Apply sorting to transactions
  const sortedTransactions = applySorting(filteredTransactions);
  
  // Generate HTML for each transaction
  const transactionsHtml = sortedTransactions.map(transaction => `
    <article class="transaction-item" data-id="${transaction.id}">
      <div class="transaction-info">
        <h3>${escapeHtml(transaction.name)}</h3>
        <span class="category">${escapeHtml(transaction.category)}</span>
      </div>
      <div class="transaction-amount">
        <span>Rp ${transaction.amount.toLocaleString('id-ID')}</span>
        <button class="delete-btn" data-id="${transaction.id}">Hapus</button>
      </div>
    </article>
  `).join('');
  
  // Update container with transaction HTML
  container.innerHTML = transactionsHtml;
}

/**
 * Delete transaction by ID
 * @param {string} transactionId - ID of transaction to delete
 */
function deleteTransaction(transactionId) {
  // Find index of transaction
  const index = transactions.findIndex(t => t.id === transactionId);
  
  if (index === -1) {
    console.error('Transaction not found:', transactionId);
    return;
  }
  
  // Remove transaction from array
  transactions.splice(index, 1);
  
  // Save updated transactions to Local Storage
  saveTransactions(transactions);
  
  // Update all UI components
  renderAll();
  
  console.log('Transaction deleted:', transactionId);
}

/**
 * Handle delete button clicks using event delegation
 * @param {Event} event - Click event
 */
function handleDeleteClick(event) {
  // Check if clicked element is a delete button
  if (event.target.classList.contains('delete-btn')) {
    const transactionId = event.target.getAttribute('data-id');
    
    if (transactionId) {
      deleteTransaction(transactionId);
    }
  }
}

// ============================================
// Application Initialization
// ============================================

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set dynamic footer year
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Load transactions from Local Storage
  transactions = loadTransactions();
  
  // Load custom categories from Local Storage
  customCategories = loadCustomCategories();
  
  // Populate category dropdown with default and custom categories
  populateCategoryDropdown();
  
  // Add event listener for form submit
  const form = document.getElementById('transaction-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  // Add event listener for add category button
  const addCategoryBtn = document.getElementById('add-category-btn');
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', handleAddCategory);
  }
  
  // Add event delegation for delete buttons
  const transactionList = document.getElementById('transaction-list');
  if (transactionList) {
    transactionList.addEventListener('click', handleDeleteClick);
  }
  
  // Add event listener for month filter
  const monthFilter = document.getElementById('month-filter');
  if (monthFilter) {
    monthFilter.addEventListener('change', handleMonthFilterChange);
  }
  
  // Add event listeners for sort buttons
  const sortByAmountBtn = document.getElementById('sort-by-amount-btn');
  if (sortByAmountBtn) {
    sortByAmountBtn.addEventListener('click', handleSortClick);
  }
  
  const sortByCategoryBtn = document.getElementById('sort-by-category-btn');
  if (sortByCategoryBtn) {
    sortByCategoryBtn.addEventListener('click', handleSortClick);
  }
  
  // Initial render of all UI components
  renderAll();
  
  console.log('Expense & Budget Visualizer initialized');
  console.log(`Loaded ${transactions.length} transactions from Local Storage`);
  console.log(`Loaded ${customCategories.length} custom categories from Local Storage`);
});
