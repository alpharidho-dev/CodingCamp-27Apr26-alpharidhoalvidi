# Requirements Document

## Introduction

Expense & Budget Visualizer adalah aplikasi web berbasis browser untuk mengelola dan memvisualisasikan pengeluaran pribadi. Aplikasi ini memungkinkan pengguna untuk mencatat transaksi pengeluaran, melihat total saldo, dan memvisualisasikan distribusi pengeluaran per kategori menggunakan grafik pie chart. Data disimpan secara persisten di browser menggunakan Local Storage.

## Glossary

- **Application**: Aplikasi web Expense & Budget Visualizer
- **Transaction**: Satu catatan pengeluaran yang berisi nama, jumlah, kategori, dan tanggal
- **Local_Storage**: Mekanisme penyimpanan data browser untuk persistensi data
- **Balance**: Total akumulasi dari semua jumlah transaksi
- **Category**: Klasifikasi jenis pengeluaran (contoh: Makanan, Transport, Hiburan)
- **Pie_Chart**: Visualisasi grafik berbentuk lingkaran yang menampilkan proporsi pengeluaran per kategori
- **Form**: Formulir input untuk menambahkan transaksi baru
- **Transaction_List**: Daftar tampilan semua transaksi yang telah dicatat
- **User**: Pengguna aplikasi yang mencatat dan mengelola pengeluaran
- **Custom_Category**: Kategori baru yang ditambahkan oleh pengguna
- **Monthly_Filter**: Filter untuk menampilkan transaksi berdasarkan bulan tertentu
- **Sort_Control**: Kontrol untuk mengurutkan transaksi berdasarkan kriteria tertentu
- **Limit_Warning**: Peringatan visual ketika total pengeluaran melebihi batas yang ditentukan
- **Theme_Mode**: Mode tampilan aplikasi (terang atau gelap)

## Requirements

### Requirement 1: Input Transaksi Pengeluaran

**User Story:** As a User, I want to input expense transactions, so that I can record my spending activities.

#### Acceptance Criteria

1. THE Form SHALL contain input fields for transaction name, amount, and category
2. WHEN the User submits a valid transaction, THE Application SHALL add the transaction to the Transaction_List
3. WHEN the User submits a valid transaction, THE Application SHALL save the transaction to Local_Storage
4. WHEN the User submits a valid transaction, THE Application SHALL clear the Form inputs
5. IF the amount field is empty or non-numeric, THEN THE Application SHALL display an error message and prevent submission
6. IF the name field is empty, THEN THE Application SHALL display an error message and prevent submission
7. IF no category is selected, THEN THE Application SHALL display an error message and prevent submission

### Requirement 2: Tampilan Daftar Transaksi

**User Story:** As a User, I want to view all my transactions, so that I can review my spending history.

#### Acceptance Criteria

1. THE Transaction_List SHALL display all transactions with name, amount, and category
2. WHEN a new transaction is added, THE Transaction_List SHALL update immediately to show the new transaction
3. THE Transaction_List SHALL use Flexbox for layout
4. WHEN no transactions exist, THE Transaction_List SHALL display a message indicating no transactions are available
5. THE Transaction_List SHALL display transactions in reverse chronological order (newest first)

### Requirement 3: Hapus Transaksi

**User Story:** As a User, I want to delete transactions, so that I can remove incorrect or unwanted entries.

#### Acceptance Criteria

1. THE Transaction_List SHALL display a delete button for each transaction
2. WHEN the User clicks a delete button, THE Application SHALL remove the corresponding transaction from the Transaction_List
3. WHEN the User clicks a delete button, THE Application SHALL remove the corresponding transaction from Local_Storage
4. WHEN a transaction is deleted, THE Application SHALL update the Balance immediately
5. WHEN a transaction is deleted, THE Application SHALL update the Pie_Chart immediately

### Requirement 4: Perhitungan Total Balance

**User Story:** As a User, I want to see my total spending, so that I can understand my overall expenses.

#### Acceptance Criteria

1. THE Application SHALL calculate the Balance as the sum of all transaction amounts
2. WHEN a transaction is added, THE Application SHALL update the Balance immediately
3. WHEN a transaction is deleted, THE Application SHALL update the Balance immediately
4. THE Application SHALL display the Balance in a prominent location
5. THE Application SHALL format the Balance as currency with appropriate decimal places

### Requirement 5: Visualisasi Pie Chart

**User Story:** As a User, I want to see a pie chart of my expenses by category, so that I can understand my spending distribution.

#### Acceptance Criteria

1. THE Pie_Chart SHALL display the proportion of expenses for each Category
2. WHEN a transaction is added, THE Pie_Chart SHALL update immediately to reflect the new data
3. WHEN a transaction is deleted, THE Pie_Chart SHALL update immediately to reflect the updated data
4. THE Pie_Chart SHALL use Chart.js library for rendering
5. WHEN no transactions exist, THE Pie_Chart SHALL display a message or empty state
6. THE Pie_Chart SHALL use distinct colors for each Category

### Requirement 6: Persistensi Data

**User Story:** As a User, I want my transactions to be saved, so that I can access them when I return to the application.

#### Acceptance Criteria

1. WHEN the Application loads, THE Application SHALL retrieve all transactions from Local_Storage
2. WHEN the Application loads, THE Application SHALL display all retrieved transactions in the Transaction_List
3. WHEN the Application loads, THE Application SHALL calculate and display the Balance from retrieved transactions
4. WHEN the Application loads, THE Application SHALL render the Pie_Chart from retrieved transactions
5. THE Application SHALL store transactions in Local_Storage as JSON format

### Requirement 7: Semantic HTML dan Struktur

**User Story:** As a developer, I want to use semantic HTML, so that the application is accessible and well-structured.

#### Acceptance Criteria

1. THE Application SHALL use semantic HTML5 elements including header, main, footer, section, form, label, input, select, button, and article
2. THE Application SHALL include a header element containing the application title
3. THE Application SHALL include a main element containing the primary content
4. THE Application SHALL include a footer element with copyright information
5. THE Form SHALL use label elements associated with input elements
6. THE Transaction_List SHALL use article elements for individual transactions

### Requirement 8: Responsive Design

**User Story:** As a User, I want the application to work on mobile devices, so that I can track expenses on the go.

#### Acceptance Criteria

1. THE Application SHALL be responsive and functional on mobile screen sizes (minimum 320px width)
2. THE Application SHALL be responsive and functional on tablet screen sizes
3. THE Application SHALL be responsive and functional on desktop screen sizes
4. THE Application SHALL use Flexbox for the main layout
5. THE Application SHALL use Tailwind CSS utility classes for responsive design
6. WHEN viewed on mobile, THE Application SHALL display elements in a single column layout where appropriate

### Requirement 9: Styling dan Desain

**User Story:** As a User, I want a clean and professional interface, so that the application is pleasant to use.

#### Acceptance Criteria

1. THE Application SHALL use Tailwind CSS via CDN for primary styling
2. THE Application SHALL include a custom CSS file for styles not covered by Tailwind CSS
3. THE Application SHALL use a consistent color scheme throughout
4. THE Application SHALL have appropriate spacing and padding for readability
5. THE Application SHALL use clear typography with appropriate font sizes

### Requirement 10: Custom Categories (Fitur Opsional 1)

**User Story:** As a User, I want to add custom categories, so that I can classify expenses according to my needs.

#### Acceptance Criteria

1. THE Application SHALL provide a button to add a new Custom_Category
2. WHEN the User clicks the add category button, THE Application SHALL prompt for a category name
3. WHEN the User provides a valid category name, THE Application SHALL add the Custom_Category to Local_Storage
4. WHEN the User provides a valid category name, THE Application SHALL update the category dropdown to include the new Custom_Category
5. THE Application SHALL load saved Custom_Categories from Local_Storage when the Application loads
6. IF the category name is empty, THEN THE Application SHALL display an error message and not add the category
7. IF the category name already exists, THEN THE Application SHALL display an error message and not add the duplicate category

### Requirement 11: Monthly Summary (Fitur Opsional 2)

**User Story:** As a User, I want to filter transactions by month, so that I can analyze my spending patterns over time.

#### Acceptance Criteria

1. WHEN a transaction is created, THE Application SHALL include the current date with the Transaction
2. THE Application SHALL provide a Monthly_Filter control to select a specific month
3. WHEN the User selects a month in the Monthly_Filter, THE Transaction_List SHALL display only transactions from that month
4. WHEN the User selects a month in the Monthly_Filter, THE Application SHALL display the total Balance for that month
5. WHEN the User selects a month in the Monthly_Filter, THE Pie_Chart SHALL display data only from that month
6. THE Application SHALL provide an option to view all transactions regardless of month

### Requirement 12: Sort Transactions (Fitur Opsional 3)

**User Story:** As a User, I want to sort transactions, so that I can organize my spending data in different ways.

#### Acceptance Criteria

1. THE Application SHALL provide Sort_Control buttons to sort transactions by amount
2. THE Application SHALL provide Sort_Control buttons to sort transactions by category
3. WHEN the User clicks sort by amount, THE Transaction_List SHALL reorder transactions in ascending order by amount
4. WHEN the User clicks sort by amount again, THE Transaction_List SHALL reorder transactions in descending order by amount
5. WHEN the User clicks sort by category, THE Transaction_List SHALL reorder transactions alphabetically by category name
6. WHEN the User clicks sort by category again, THE Transaction_List SHALL reorder transactions in reverse alphabetical order by category name
7. THE Sort_Control SHALL indicate the current sort direction (ascending or descending)

## Technical Constraints

### Technology Stack

1. THE Application SHALL use HTML5 for markup
2. THE Application SHALL use Tailwind CSS via CDN for styling
3. THE Application SHALL use Vanilla JavaScript without any JavaScript frameworks
4. THE Application SHALL use Chart.js via CDN for chart visualization
5. THE Application SHALL include one custom CSS file in the css/ folder for styles not covered by Tailwind CSS
6. THE Application SHALL include one JavaScript file in the js/ folder

### Project Structure

1. THE Application SHALL follow this directory structure:
   ```
   ExpenseBudgetVisualizer/
   ├── index.html
   ├── css/
   │   └── style.css
   ├── js/
   │   └── script.js
   ├── .kiro/
   └── CODEBASE_GUIDE.md
   ```

### Code Quality

1. THE Application SHALL use clean, well-organized code
2. THE Application SHALL include concise comments explaining key functionality
3. THE Application SHALL implement proper error handling for user inputs
4. THE Application SHALL validate all form inputs before processing

### Deployment

1. THE Application SHALL be pushed to a GitHub repository named "CodingCamp-27Apr26-alpharidhoalvidi"
2. THE Application SHALL be deployed using GitHub Pages
