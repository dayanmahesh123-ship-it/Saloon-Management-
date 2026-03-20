// ═══════════════════════════════════════════════════════════════
// ✨ LUMINA SALON & SPA - COMPLETE BACKEND (Code.gs)
// ═══════════════════════════════════════════════════════════════
// Version: 3.0.0 | Full CRUD | Stock Sync | Email Alerts
// Sheets: 11 | Functions: 40+ | Triggers: 2
// ═══════════════════════════════════════════════════════════════

const OWNER_EMAIL = 'luminasalon@gmail.com'; // ⬅️ ඔයාගේ email දාන්න

// ─── Sheet Names ───
const SHEETS = {
  PRODUCTS: 'Products',
  TRANSACTIONS: 'Transactions',
  TRANSACTION_ITEMS: 'TransactionItems',
  WARRANTIES: 'Warranties',
  RETURNS: 'Returns',
  ALERTS: 'Alerts',
  RESTOCKS: 'Restocks',
  STAFF: 'Staff',
  APPOINTMENTS: 'Appointments',
  SETTINGS: 'Settings',
  LOG: 'ActivityLog'
};

// ─── Headers ───
const HEADERS = {
  Products: [
    'ID','Name','NameEn','Category','Price','Cost','Stock','MinStock',
    'Barcode','Warranty','Image','Status','CreatedAt','UpdatedAt'
  ],
  Transactions: [
    'ID','ReceiptNo','Date','CustomerName','CustomerPhone','Subtotal',
    'Discount','Total','PayMethod','StaffId','StaffName','Notes','CreatedAt'
  ],
  TransactionItems: [
    'TxnID','ProductID','ProductName','Qty','Price','Total'
  ],
  Warranties: [
    'ID','TxnID','ProductID','ProductName','CustomerName','CustomerPhone',
    'StartDate','EndDate','Months','Status','ClaimDate','ClaimNote','CreatedAt'
  ],
  Returns: [
    'ID','TxnID','ProductID','ProductName','Qty','RefundAmount','Reason',
    'CustomerName','CustomerPhone','Status','Date','CreatedAt'
  ],
  Alerts: [
    'ID','Type','Message','Date','Read','ProductID','CreatedAt'
  ],
  Restocks: [
    'ID','ProductID','ProductName','Qty','SupplierName','SupplierPhone',
    'UnitCost','TotalCost','Notes','Status','OrderDate','ReceivedDate','CreatedAt'
  ],
  Staff: [
    'ID','Name','NameEn','Phone','Role','Commission','Salary','JoinDate',
    'Status','AvatarColor','Skills','Rating','TotalSales','CreatedAt','UpdatedAt'
  ],
  Appointments: [
    'ID','CustomerName','CustomerPhone','ServiceID','ServiceName','StaffID',
    'StaffName','Date','Time','Duration','Price','Status','Notes',
    'CreatedAt','CompletedAt','CancelledAt'
  ],
  Settings: [
    'Key','Value','UpdatedAt'
  ],
  ActivityLog: [
    'Timestamp','Action','Details','User'
  ]
};

// ─── Sample Products ───
const SAMPLE_PRODUCTS = [
  ['P001','කෙරටින් ට්‍රීට්මන්ට්','Keratin Treatment','හිසකෙස් නිෂ්පාදන',8500,4500,25,5,'8901234001',0,'💇‍♀️','active'],
  ['P002','හෙයාර් කලර්','Hair Color Kit','හිසකෙස් නිෂ්පාදන',3200,1800,40,10,'8901234002',0,'🎨','active'],
  ['P003','ෆේෂල් කිට්','Facial Kit Premium','සම ආරක්ෂණ',4500,2200,30,8,'8901234003',0,'✨','active'],
  ['P004','නිය ආලේපන සෙට්','Nail Polish Set','නිය ආලේපන',2800,1400,50,12,'8901234004',0,'💅','active'],
  ['P005','හිසකෙස් වියළනය','Hair Dryer Pro','උපකරණ',12500,7500,8,3,'8901234005',12,'💨','active'],
  ['P006','ස්ට්‍රේට්නර්','Hair Straightener','උපකරණ',9800,5500,12,4,'8901234006',12,'🔥','active'],
  ['P007','ස්පා පැකේජ - ගෝල්ඩ්','Spa Package Gold','විශේෂ පැකේජ',15000,8000,999,0,'8901234007',0,'👑','active'],
  ['P008','බෝඩි ලෝෂන්','Body Lotion Premium','සම ආරක්ෂණ',1800,900,60,15,'8901234008',0,'🧴','active'],
  ['P009','මේකප් කිට්','Makeup Kit Deluxe','ආභරණ',6500,3500,20,5,'8901234009',0,'💄','active'],
  ['P010','හෙයාර් ඔයිල්','Hair Oil Herbal','හිසකෙස් නිෂ්පාදන',1200,600,80,20,'8901234010',0,'🫒','active'],
  ['P011','බ්‍රයිඩල් පැකේජ','Bridal Package','විශේෂ පැකේජ',35000,18000,999,0,'8901234011',0,'👰','active'],
  ['P012','ෂැම්පූ ප්‍රෝ','Shampoo Professional','හිසකෙස් නිෂ්පාදන',2200,1100,45,10,'8901234012',0,'🧴','active']
];

// ─── Sample Staff ───
const SAMPLE_STAFF = [
  ['STF001','කමලි පෙරේරා','Kamali Perera','0771234567','stylist',10,45000,'2022-03-15','active',0,'හිසකෙස් කැපීම,වර්ණ ගැන්වීම,කෙරටින්',4.8,285000],
  ['STF002','නිමාලි ද සිල්වා','Nimali De Silva','0779876543','beautician',12,40000,'2022-06-20','active',1,'ෆේෂල්,මේකප්,වැක්සින්',4.6,215000],
  ['STF003','සංජය රාජපක්ෂ','Sanjaya Rajapaksha','0712345678','therapist',15,50000,'2021-11-01','active',2,'ස්පා,මසාජ්,ආරෝග්‍ය',4.9,380000],
  ['STF004','ශානිකා ගුණවර්ධන','Shanika Gunawardena','0767654321','nail_tech',10,35000,'2023-01-10','active',3,'මැනිකියර්,පෙඩිකියර්,නේල් ආර්ට්',4.7,165000],
  ['STF005','රුවන් ප්‍රනාන්දු','Ruwan Fernando','0751112233','manager',5,65000,'2020-05-01','active',4,'කළමනාකරණය,POS,වාර්තා',4.5,120000],
  ['STF006','දිල්හානි ජයවර්ධන','Dilhani Jayawardena','0781122334','beautician',12,42000,'2023-04-01','active',5,'ෆේෂල්,බ්‍රයිඩල්,ස්කින් කෙයාර්',4.8,195000]
];


// ═══════════════════════════════════════════════════════
// 🔧 SETUP - Run ONCE to create all sheets
// ═══════════════════════════════════════════════════════
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const now = new Date().toISOString();

  // Create all sheets with headers
  Object.keys(HEADERS).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    const headers = HEADERS[sheetName];
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setBackground('#ec4899');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(10);
    headerRange.setHorizontalAlignment('center');
    headerRange.setBorder(true, true, true, true, true, true, '#be185d', SpreadsheetApp.BorderStyle.SOLID);

    sheet.setFrozenRows(1);

    for (let i = 1; i <= headers.length; i++) {
      sheet.setColumnWidth(i, 130);
    }
    // ID column wider
    sheet.setColumnWidth(1, 160);
  });

  // Insert Sample Products
  const prodSheet = ss.getSheetByName('Products');
  if (prodSheet.getLastRow() <= 1) {
    SAMPLE_PRODUCTS.forEach(row => {
      prodSheet.appendRow([...row, now, now]);
    });
    logActivity('SETUP', 'Sample products inserted: ' + SAMPLE_PRODUCTS.length);
  }

  // Insert Sample Staff
  const staffSheet = ss.getSheetByName('Staff');
  if (staffSheet.getLastRow() <= 1) {
    SAMPLE_STAFF.forEach(row => {
      staffSheet.appendRow([...row, now, now]);
    });
    logActivity('SETUP', 'Sample staff inserted: ' + SAMPLE_STAFF.length);
  }

  // Default Settings
  const settSheet = ss.getSheetByName('Settings');
  if (settSheet.getLastRow() <= 1) {
    const settings = [
      ['shop_name', 'Lumina Salon & Spa'],
      ['shop_phone', '011-2345678'],
      ['shop_address', 'කොළඹ, ශ්‍රී ලංකාව'],
      ['shop_email', OWNER_EMAIL],
      ['currency', 'LKR'],
      ['tax_rate', '0'],
      ['receipt_footer', '🙏 ස්තූතියි! නැවත එන්න! 💕'],
      ['low_stock_alert', 'true'],
      ['email_alerts', 'true']
    ];
    settings.forEach(([key, value]) => {
      settSheet.appendRow([key, value, now]);
    });
    logActivity('SETUP', 'Default settings created');
  }

  // Initial Alert
  const alertSheet = ss.getSheetByName('Alerts');
  if (alertSheet.getLastRow() <= 1) {
    alertSheet.appendRow(['A001', 'info', '✨ පද්ධතිය සාර්ථකව ස්ථාපනය කරන ලදී!', now, false, '', now]);
    logActivity('SETUP', 'Initial alert created');
  }

  // Delete default Sheet1
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }

  logActivity('SETUP', '✅ All sheets created successfully');

  // Format sheets with alternating colors
  Object.keys(HEADERS).forEach(sheetName => {
    try {
      const sheet = ss.getSheetByName(sheetName);
      if (sheet && sheet.getLastRow() > 1) {
        const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
        dataRange.setFontSize(9);
      }
    } catch(e) {}
  });

  SpreadsheetApp.getUi().alert('✅ Lumina Salon & Spa පද්ධතිය සාර්ථකව ස්ථාපනය කරන ලදී!\n\nSheets 11ක් නිර්මාණය කරන ලදී.\nSample products 12ක් එකතු කරන ලදී.\nSample staff 6ක් එකතු කරන ලදී.');
}


// ═══════════════════════════════════════════════════════
// 🌐 WEB APP ENTRY POINTS
// ═══════════════════════════════════════════════════════
function doGet(e) {
  const html = HtmlService.createHtmlOutputFromFile('index')
    .setTitle('✨ Lumina Salon & Spa')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  return html;
}

function doPost(e) {
  try {
    const data = typeof e === 'string' ? JSON.parse(e) : e;
    const action = data.action;

    const handlers = {
      // Products
      'getProducts': () => getProducts(),
      'saveProduct': () => saveProduct(data.product),
      'deleteProduct': () => deleteProduct(data.id),

      // Transactions
      'getTransactions': () => getTransactions(),
      'saveTransaction': () => saveTransaction(data.transaction),

      // Warranties
      'getWarranties': () => getWarranties(),
      'updateWarranty': () => updateWarranty(data.id, data.updates),

      // Returns
      'getReturns': () => getReturns(),
      'saveReturn': () => saveReturn(data.returnData),

      // Alerts
      'getAlerts': () => getAlerts(),
      'markAlertRead': () => markAlertRead(data.id),
      'markAllAlertsRead': () => markAllAlertsRead(),

      // Restocks
      'getRestocks': () => getRestocks(),
      'saveRestock': () => saveRestock(data.restock),

      // Staff
      'getStaff': () => getStaff(),
      'saveStaff': () => saveStaff(data.staff),
      'deleteStaff': () => deleteStaff(data.id),

      // Appointments
      'getAppointments': () => getAppointments(),
      'saveAppointment': () => saveAppointment(data.appointment),
      'updateAppointment': () => updateAppointmentStatus(data.id, data.status),
      'deleteAppointment': () => deleteAppointment(data.id),

      // Settings
      'getSettings': () => getSettings(),
      'saveSettings': () => saveSettings(data.settings),

      // Dashboard
      'getDashboardData': () => getDashboardData()
    };

    const handler = handlers[action];
    if (handler) {
      return jsonResponse(handler());
    }

    return jsonResponse({ success: false, error: 'Unknown action: ' + action });
  } catch(error) {
    logActivity('ERROR', error.toString());
    return jsonResponse({ success: false, error: error.toString() });
  }
}


// ═══════════════════════════════════════════════════════
// 🔧 HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════
function jsonResponse(data) {
  return JSON.stringify(data);
}

function generateId(prefix) {
  const ts = new Date().getTime().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
  return prefix + ts + rnd;
}

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    setupSheets();
    sheet = ss.getSheetByName(name);
  }
  return sheet;
}

function sheetToObjects(sheetName) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];
  const objects = [];
  for (let i = 1; i < data.length; i++) {
    const obj = {};
    headers.forEach((h, j) => {
      let val = data[i][j];
      // Convert Date objects to ISO strings
      if (val instanceof Date) {
        val = val.toISOString();
      }
      obj[h] = val;
    });
    objects.push(obj);
  }
  return objects;
}

function findRowByColumn(sheet, colIndex, value) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][colIndex]) === String(value)) {
      return i + 1;
    }
  }
  return -1;
}

function logActivity(action, details) {
  try {
    const sheet = getSheet('ActivityLog');
    sheet.appendRow([new Date().toISOString(), action, details, 'System']);

    // Keep only last 500 log entries
    const lastRow = sheet.getLastRow();
    if (lastRow > 502) {
      sheet.deleteRows(2, lastRow - 502);
    }
  } catch(e) {
    console.log('Log error: ' + e);
  }
}

// Safe value getter
function sv(obj, ...keys) {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return '';
}

function svNum(obj, ...keys) {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return parseFloat(obj[key]) || 0;
  }
  return 0;
}

function svInt(obj, ...keys) {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return parseInt(obj[key]) || 0;
  }
  return 0;
}


// ═══════════════════════════════════════════════════════
// 📦 PRODUCTS CRUD
// ═══════════════════════════════════════════════════════
function getProducts() {
  try {
    const products = sheetToObjects('Products');
    return { success: true, data: products };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function saveProduct(product) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheet('Products');
    const now = new Date().toISOString();
    const id = sv(product, 'id', 'ID');

    if (id) {
      const row = findRowByColumn(sheet, 0, id);
      if (row > 0) {
        const vals = [
          id,
          sv(product, 'name', 'Name'),
          sv(product, 'nameEn', 'NameEn'),
          sv(product, 'category', 'Category'),
          svNum(product, 'price', 'Price'),
          svNum(product, 'cost', 'Cost'),
          svInt(product, 'stock', 'Stock'),
          svInt(product, 'minStock', 'MinStock'),
          sv(product, 'barcode', 'Barcode'),
          svInt(product, 'warranty', 'Warranty'),
          sv(product, 'image', 'Image') || '📦',
          sv(product, 'status', 'Status') || 'active',
          sheet.getRange(row, 13).getValue(), // keep original createdAt
          now
        ];
        sheet.getRange(row, 1, 1, vals.length).setValues([vals]);
        logActivity('PRODUCT_UPDATE', 'Updated: ' + id);
        return { success: true, data: product, message: 'Product updated' };
      }
    }

    // Create new
    const newId = id || generateId('P');
    sheet.appendRow([
      newId,
      sv(product, 'name', 'Name'),
      sv(product, 'nameEn', 'NameEn'),
      sv(product, 'category', 'Category'),
      svNum(product, 'price', 'Price'),
      svNum(product, 'cost', 'Cost'),
      svInt(product, 'stock', 'Stock'),
      svInt(product, 'minStock', 'MinStock'),
      sv(product, 'barcode', 'Barcode'),
      svInt(product, 'warranty', 'Warranty'),
      sv(product, 'image', 'Image') || '📦',
      sv(product, 'status', 'Status') || 'active',
      now, now
    ]);

    logActivity('PRODUCT_CREATE', 'Created: ' + newId);
    return { success: true, data: { ...product, id: newId }, message: 'Product created' };
  } catch(e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteProduct(id) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheet('Products');
    const row = findRowByColumn(sheet, 0, id);
    if (row > 0) {
      sheet.deleteRow(row);
      logActivity('PRODUCT_DELETE', 'Deleted: ' + id);
      return { success: true, message: 'Product deleted' };
    }
    return { success: false, error: 'Product not found' };
  } catch(e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}


// ═══════════════════════════════════════════════════════
// 💰 TRANSACTIONS (Stock Sync + Auto Warranty)
// ═══════════════════════════════════════════════════════
function getTransactions() {
  try {
    const txns = sheetToObjects('Transactions');
    const items = sheetToObjects('TransactionItems');
    txns.forEach(txn => {
      txn.items = items.filter(item => item.TxnID === txn.ID);
    });
    return { success: true, data: txns };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function saveTransaction(txn) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const now = new Date().toISOString();
    const txnSheet = getSheet('Transactions');
    const itemSheet = getSheet('TransactionItems');
    const prodSheet = getSheet('Products');

    const txnId = sv(txn, 'id', 'ID') || generateId('TXN');
    const receiptNo = sv(txn, 'receiptNo', 'ReceiptNo') || 'R' + Date.now().toString().slice(-8);

    // Save transaction header
    txnSheet.appendRow([
      txnId, receiptNo,
      sv(txn, 'date') || now,
      sv(txn, 'customerName', 'CustomerName'),
      sv(txn, 'customerPhone', 'CustomerPhone'),
      svNum(txn, 'subtotal', 'Subtotal'),
      svNum(txn, 'discount', 'Discount'),
      svNum(txn, 'total', 'Total'),
      sv(txn, 'payMethod', 'PayMethod') || 'cash',
      sv(txn, 'staffId', 'StaffId'),
      sv(txn, 'staffName', 'StaffName'),
      sv(txn, 'notes', 'Notes'),
      now
    ]);

    // Save items + Stock sync
    const items = txn.items || [];
    items.forEach(item => {
      const productId = sv(item, 'productId', 'ProductID');
      const qty = svInt(item, 'qty', 'Qty') || 1;
      const price = svNum(item, 'price', 'Price');

      itemSheet.appendRow([
        txnId, productId,
        sv(item, 'name', 'ProductName'),
        qty, price, qty * price
      ]);

      // ─── Stock Sync ───
      if (productId) {
        const prodRow = findRowByColumn(prodSheet, 0, productId);
        if (prodRow > 0) {
          const currentStock = parseInt(prodSheet.getRange(prodRow, 7).getValue()) || 0;
          const newStock = Math.max(0, currentStock - qty);
          prodSheet.getRange(prodRow, 7).setValue(newStock);

          // Low stock check
          const minStock = parseInt(prodSheet.getRange(prodRow, 8).getValue()) || 0;
          const prodName = prodSheet.getRange(prodRow, 2).getValue();
          if (newStock <= minStock && minStock > 0) {
            createAlert('low_stock', '⚠️ ' + prodName + ' තොග අඩුයි (' + newStock + ')', productId);
            sendLowStockEmail(prodName, newStock, minStock);
          }

          // ─── Auto Warranty ───
          const warrantyMonths = parseInt(prodSheet.getRange(prodRow, 10).getValue()) || 0;
          if (warrantyMonths > 0) {
            createWarranty(
              txnId, productId, prodName,
              sv(txn, 'customerName', 'CustomerName'),
              sv(txn, 'customerPhone', 'CustomerPhone'),
              warrantyMonths
            );
          }
        }
      }
    });

    // ─── Staff Sales Update ───
    const staffId = sv(txn, 'staffId', 'StaffId');
    if (staffId) {
      const staffSheet = getSheet('Staff');
      const staffRow = findRowByColumn(staffSheet, 0, staffId);
      if (staffRow > 0) {
        const currentSales = parseFloat(staffSheet.getRange(staffRow, 13).getValue()) || 0;
        staffSheet.getRange(staffRow, 13).setValue(currentSales + svNum(txn, 'total', 'Total'));
      }
    }

    logActivity('TRANSACTION', 'Sale: ' + receiptNo + ' | Rs.' + svNum(txn, 'total', 'Total'));
    return { success: true, data: { ...txn, id: txnId, receiptNo: receiptNo }, message: 'Transaction saved' };
  } catch(e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}


// ═══════════════════════════════════════════════════════
// 🛡️ WARRANTIES
// ═══════════════════════════════════════════════════════
function getWarranties() {
  try { return { success: true, data: sheetToObjects('Warranties') }; }
  catch(e) { return { success: false, error: e.toString() }; }
}

function createWarranty(txnId, productId, productName, customerName, customerPhone, months) {
  const sheet = getSheet('Warranties');
  const now = new Date();
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + months);
  const wId = generateId('W');

  sheet.appendRow([
    wId, txnId, productId, productName,
    customerName, customerPhone,
    now.toISOString(), endDate.toISOString(), months,
    'active', '', '', now.toISOString()
  ]);

  logActivity('WARRANTY_CREATE', wId + ' for ' + productName + ' (' + months + ' months)');
  return wId;
}

function updateWarranty(id, updates) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheet('Warranties');
    const row = findRowByColumn(sheet, 0, id);
    if (row > 0) {
      if (updates.status || updates.Status) sheet.getRange(row, 10).setValue(updates.status || updates.Status);
      if (updates.claimDate || updates.ClaimDate) sheet.getRange(row, 11).setValue(updates.claimDate || updates.ClaimDate);
      if (updates.claimNote || updates.ClaimNote) sheet.getRange(row, 12).setValue(updates.claimNote || updates.ClaimNote);
      logActivity('WARRANTY_CLAIM', id);
      return { success: true, message: 'Warranty updated' };
    }
    return { success: false, error: 'Warranty not found' };
  } catch(e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}


// ═══════════════════════════════════════════════════════
// 🔄 RETURNS (Stock Restore)
// ═══════════════════════════════════════════════════════
function getReturns() {
  try { return { success: true, data: sheetToObjects('Returns') }; }
  catch(e) { return { success: false, error: e.toString() }; }
}

function saveReturn(ret) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheet('Returns');
    const now = new Date().toISOString();
    const retId = sv(ret, 'id') || generateId('RET');
    const qty = svInt(ret, 'qty') || 1;

    sheet.appendRow([
      retId, sv(ret, 'txnId'), sv(ret, 'productId'),
      sv(ret, 'productName'), qty,
      svNum(ret, 'refundAmount'), sv(ret, 'reason'),
      sv(ret, 'customerName'), sv(ret, 'customerPhone'),
      sv(ret, 'status') || 'completed',
      sv(ret, 'date') || now, now
    ]);

    // Restore stock
    const productId = sv(ret, 'productId');
    if (productId) {
      const prodSheet = getSheet('Products');
      const prodRow = findRowByColumn(prodSheet, 0, productId);
      if (prodRow > 0) {
        const currentStock = parseInt(prodSheet.getRange(prodRow, 7).getValue()) || 0;
        prodSheet.getRange(prodRow, 7).setValue(currentStock + qty);
      }
    }

    logActivity('RETURN', retId + ' | Refund: Rs.' + svNum(ret, 'refundAmount'));
    return { success: true, data: { ...ret, id: retId }, message: 'Return processed' };
  } catch(e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}


// ═══════════════════════════════════════════════════════
// 🔔 ALERTS
// ═══════════════════════════════════════════════════════
function getAlerts() {
  try { return { success: true, data: sheetToObjects('Alerts') }; }
  catch(e) { return { success: false, error: e.toString() }; }
}

function createAlert(type, message, productId) {
  const sheet = getSheet('Alerts');
  const now = new Date().toISOString();
  const alertId = generateId('A');
  sheet.appendRow([alertId, type, message, now, false, productId || '', now]);
  return alertId;
}

function markAlertRead(id) {
  try {
    const sheet = getSheet('Alerts');
    const row = findRowByColumn(sheet, 0, id);
    if (row > 0) { sheet.getRange(row, 5).setValue(true); return { success: true }; }
    return { success: false, error: 'Alert not found' };
  } catch(e) { return { success: false, error: e.toString() }; }
}

function markAllAlertsRead() {
  try {
    const sheet = getSheet('Alerts');
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const range = sheet.getRange(2, 5, lastRow - 1, 1);
      range.setValues(range.getValues().map(() => [true]));
    }
    return { success: true };
  } catch(e) { return { success: false, error: e.toString() }; }
}


// ═══════════════════════════════════════════════════════
// 🚚 RESTOCKS (Stock Update on Receive)
// ═══════════════════════════════════════════════════════
function getRestocks() {
  try { return { success: true, data: sheetToObjects('Restocks') }; }
  catch(e) { return { success: false, error: e.toString() }; }
}

function saveRestock(restock) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheet('Restocks');
    const now = new Date().toISOString();

    if (restock._update && restock.id) {
      const row = findRowByColumn(sheet, 0, restock.id);
      if (row > 0) {
        if (restock.status) sheet.getRange(row, 10).setValue(restock.status);
        if (restock.status === 'received') {
          sheet.getRange(row, 12).setValue(now);

          const productId = sv(restock, 'productId') || sheet.getRange(row, 2).getValue();
          const qty = svInt(restock, 'qty') || parseInt(sheet.getRange(row, 4).getValue()) || 0;
          if (productId && qty > 0) {
            const prodSheet = getSheet('Products');
            const prodRow = findRowByColumn(prodSheet, 0, productId);
            if (prodRow > 0) {
              const currentStock = parseInt(prodSheet.getRange(prodRow, 7).getValue()) || 0;
              prodSheet.getRange(prodRow, 7).setValue(currentStock + qty);
            }
          }
          logActivity('RESTOCK_RECEIVED', restock.id + ' | Qty: ' + qty);
        }
        return { success: true, message: 'Restock updated' };
      }
    }

    const rsId = sv(restock, 'id') || generateId('RS');
    sheet.appendRow([
      rsId, sv(restock, 'productId'), sv(restock, 'productName'),
      svInt(restock, 'qty'), sv(restock, 'supplierName'), sv(restock, 'supplierPhone'),
      svNum(restock, 'unitCost'), svNum(restock, 'totalCost'),
      sv(restock, 'notes'), sv(restock, 'status') || 'ordered',
      sv(restock, 'orderDate') || now, '', now
    ]);

    logActivity('RESTOCK_ORDER', rsId);
    return { success: true, data: { ...restock, id: rsId }, message: 'Restock order created' };
  } catch(e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}


// ═══════════════════════════════════════════════════════
// 👨‍💼 STAFF MANAGEMENT
// ═══════════════════════════════════════════════════════
function getStaff() {
  try {
    const staffList = sheetToObjects('Staff');
    staffList.forEach(s => {
      s.skills = (typeof s.Skills === 'string' && s.Skills) ? s.Skills.split(',').map(sk => sk.trim()) : [];
    });
    return { success: true, data: staffList };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function saveStaff(member) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheet('Staff');
    const now = new Date().toISOString();
    const id = sv(member, 'id', 'ID');
    const skills = Array.isArray(member.skills) ? member.skills.join(',') : (sv(member, 'skills', 'Skills') || '');

    if (id) {
      const row = findRowByColumn(sheet, 0, id);
      if (row > 0) {
        const vals = [
          id, sv(member, 'name', 'Name'), sv(member, 'nameEn', 'NameEn'),
          sv(member, 'phone', 'Phone'), sv(member, 'role', 'Role') || 'stylist',
          svNum(member, 'commission', 'Commission'), svNum(member, 'salary', 'Salary'),
          sv(member, 'joinDate', 'JoinDate') || sheet.getRange(row, 8).getValue(),
          sv(member, 'status', 'Status') || 'active',
          member.avatarColor !== undefined ? member.avatarColor : sheet.getRange(row, 10).getValue(),
          skills,
          member.rating !== undefined ? member.rating : sheet.getRange(row, 12).getValue(),
          member.totalSales !== undefined ? member.totalSales : sheet.getRange(row, 13).getValue(),
          sheet.getRange(row, 14).getValue(), // keep createdAt
          now
        ];
        sheet.getRange(row, 1, 1, vals.length).setValues([vals]);
        logActivity('STAFF_UPDATE', id);
        return { success: true, data: member, message: 'Staff updated' };
      }
    }

    const newId = id || generateId('STF');
    sheet.appendRow([
      newId, sv(member, 'name'), sv(member, 'nameEn'),
      sv(member, 'phone'), sv(member, 'role') || 'stylist',
      svNum(member, 'commission') || 10, svNum(member, 'salary'),
      sv(member, 'joinDate') || now.split('T')[0],
      sv(member, 'status') || 'active',
      member.avatarColor || 0, skills,
      member.rating || 0, 0, now, now
    ]);

    logActivity('STAFF_CREATE', newId);
    return { success: true, data: { ...member, id: newId }, message: 'Staff created' };
  } catch(e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteStaff(id) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheet('Staff');
    const row = findRowByColumn(sheet, 0, id);
    if (row > 0) {
      sheet.deleteRow(row);
      logActivity('STAFF_DELETE', id);
      return { success: true, message: 'Staff deleted' };
    }
    return { success: false, error: 'Staff not found' };
  } catch(e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}


// ═══════════════════════════════════════════════════════
// 📅 APPOINTMENTS
// ═══════════════════════════════════════════════════════
function getAppointments() {
  try { return { success: true, data: sheetToObjects('Appointments') }; }
  catch(e) { return { success: false, error: e.toString() }; }
}

function saveAppointment(appt) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheet('Appointments');
    const now = new Date().toISOString();

    if (appt._update && appt.id) {
      const row = findRowByColumn(sheet, 0, appt.id);
      if (row > 0) {
        const fields = {
          2: 'customerName', 3: 'customerPhone', 4: 'serviceId',
          5: 'serviceName', 6: 'staffId', 7: 'staffName',
          8: 'date', 9: 'time', 12: 'status', 13: 'notes'
        };
        Object.entries(fields).forEach(([col, key]) => {
          if (appt[key] !== undefined) sheet.getRange(row, parseInt(col)).setValue(appt[key]);
        });
        logActivity('APPOINTMENT_UPDATE', appt.id);
        return { success: true, message: 'Appointment updated' };
      }
    }

    const id = sv(appt, 'id') || generateId('APT');
    sheet.appendRow([
      id, sv(appt, 'customerName'), sv(appt, 'customerPhone'),
      sv(appt, 'serviceId'), sv(appt, 'serviceName'),
      sv(appt, 'staffId'), sv(appt, 'staffName'),
      sv(appt, 'date'), sv(appt, 'time'),
      svInt(appt, 'duration') || 30, svNum(appt, 'price'),
      sv(appt, 'status') || 'pending', sv(appt, 'notes'),
      now, '', ''
    ]);

    logActivity('APPOINTMENT_CREATE', id + ' | ' + sv(appt, 'date') + ' ' + sv(appt, 'time'));
    return { success: true, data: { ...appt, id: id }, message: 'Appointment created' };
  } catch(e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function updateAppointmentStatus(id, status) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheet('Appointments');
    const row = findRowByColumn(sheet, 0, id);
    if (row > 0) {
      sheet.getRange(row, 12).setValue(status);
      const now = new Date().toISOString();
      if (status === 'completed') sheet.getRange(row, 15).setValue(now);
      if (status === 'cancelled') sheet.getRange(row, 16).setValue(now);
      logActivity('APPOINTMENT_STATUS', id + ' → ' + status);
      return { success: true, message: 'Status updated' };
    }
    return { success: false, error: 'Appointment not found' };
  } catch(e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteAppointment(id) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheet('Appointments');
    const row = findRowByColumn(sheet, 0, id);
    if (row > 0) {
      sheet.deleteRow(row);
      logActivity('APPOINTMENT_DELETE', id);
      return { success: true, message: 'Appointment deleted' };
    }
    return { success: false, error: 'Appointment not found' };
  } catch(e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}


// ═══════════════════════════════════════════════════════
// ⚙️ SETTINGS
// ═══════════════════════════════════════════════════════
function getSettings() {
  try {
    const settings = sheetToObjects('Settings');
    const obj = {};
    settings.forEach(s => { obj[s.Key] = s.Value; });
    return { success: true, data: obj };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function saveSettings(settings) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheet('Settings');
    const now = new Date().toISOString();

    Object.keys(settings).forEach(key => {
      const row = findRowByColumn(sheet, 0, key);
      if (row > 0) {
        sheet.getRange(row, 2).setValue(settings[key]);
        sheet.getRange(row, 3).setValue(now);
      } else {
        sheet.appendRow([key, settings[key], now]);
      }
    });

    logActivity('SETTINGS_UPDATE', Object.keys(settings).join(', '));
    return { success: true, message: 'Settings saved' };
  } catch(e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}


// ═══════════════════════════════════════════════════════
// 📊 DASHBOARD DATA
// ═══════════════════════════════════════════════════════
function getDashboardData() {
  try {
    const products = sheetToObjects('Products');
    const txns = sheetToObjects('Transactions');
    const appointments = sheetToObjects('Appointments');

    const today = new Date().toISOString().split('T')[0];
    const todayTxns = txns.filter(t => {
      try { return new Date(t.Date || t.date).toISOString().split('T')[0] === today; }
      catch(e) { return false; }
    });

    const todaySales = todayTxns.reduce((s, t) => s + (parseFloat(t.Total || t.total || 0)), 0);
    const lowStock = products.filter(p => parseInt(p.Stock || 0) <= parseInt(p.MinStock || 0) && parseInt(p.MinStock || 0) > 0);
    const todayAppts = appointments.filter(a => (a.Date || a.date) === today);

    return {
      success: true,
      data: {
        todaySales, todayTransactions: todayTxns.length,
        totalProducts: products.length, lowStockCount: lowStock.length,
        lowStockProducts: lowStock.slice(0, 10),
        todayAppointments: todayAppts.length
      }
    };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}


// ═══════════════════════════════════════════════════════
// 📧 EMAIL ALERTS
// ═══════════════════════════════════════════════════════
function sendLowStockEmail(productName, currentStock, minStock) {
  try {
    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: '⚠️ Lumina Salon - තොග අඩු: ' + productName,
      htmlBody: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;border:1px solid #fce7f3;border-radius:16px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#ec4899,#a855f7);padding:20px;text-align:center">
            <h1 style="color:white;margin:0;font-size:18px">✨ Lumina Salon & Spa</h1>
            <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:11px">තොග අඩු දැනුම්දීම</p>
          </div>
          <div style="padding:20px">
            <div style="background:#fff1f2;border-radius:12px;padding:15px;margin-bottom:15px;border-left:4px solid #ef4444">
              <h2 style="color:#e11d48;margin:0 0 4px;font-size:15px">⚠️ තොග අඩුයි!</h2>
              <p style="color:#9f1239;margin:0;font-size:16px;font-weight:bold">${productName}</p>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <tr><td style="padding:8px;color:#6b7280;border-bottom:1px solid #fce7f3">දැනට ඇති තොග</td>
                  <td style="padding:8px;font-weight:bold;text-align:right;color:#e11d48;border-bottom:1px solid #fce7f3;font-size:18px">${currentStock}</td></tr>
              <tr><td style="padding:8px;color:#6b7280;border-bottom:1px solid #fce7f3">අවම තොග මට්ටම</td>
                  <td style="padding:8px;font-weight:bold;text-align:right;border-bottom:1px solid #fce7f3">${minStock}</td></tr>
              <tr><td style="padding:8px;color:#6b7280">දිනය</td>
                  <td style="padding:8px;text-align:right">${new Date().toLocaleDateString('si-LK')}</td></tr>
            </table>
            <div style="margin-top:15px;padding:12px;background:#fef3c7;border-radius:8px;font-size:12px;color:#92400e">
              💡 කරුණාකර ඉක්මනින් නැවත තොග ඇණවුම් කරන්න.
            </div>
          </div>
          <div style="background:#fdf2f8;padding:10px;text-align:center;font-size:10px;color:#9ca3af">
            Lumina Salon & Spa Management System © ${new Date().getFullYear()}
          </div>
        </div>`
    });
    logActivity('EMAIL_SENT', 'Low stock: ' + productName);
  } catch(e) {
    console.log('Email error: ' + e);
  }
}

function sendDailySummaryEmail() {
  try {
    const data = getDashboardData();
    if (!data.success) return;
    const d = data.data;

    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: '📊 Lumina Salon - දෛනික සාරාංශය | ' + new Date().toLocaleDateString('si-LK'),
      htmlBody: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;border:1px solid #fce7f3;border-radius:16px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#ec4899,#8b5cf6);padding:20px;text-align:center">
            <h1 style="color:white;margin:0;font-size:18px">✨ Lumina Salon & Spa</h1>
            <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:11px">දෛනික සාරාංශය - ${new Date().toLocaleDateString('si-LK')}</p>
          </div>
          <div style="padding:20px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:15px;background:#f0fdf4;border-radius:12px;text-align:center;width:50%">
                  <div style="font-size:22px;font-weight:bold;color:#16a34a">Rs. ${d.todaySales.toLocaleString()}</div>
                  <div style="font-size:11px;color:#4ade80">💰 මුළු ආදායම</div>
                </td>
                <td style="width:10px"></td>
                <td style="padding:15px;background:#eff6ff;border-radius:12px;text-align:center;width:50%">
                  <div style="font-size:22px;font-weight:bold;color:#2563eb">${d.todayTransactions}</div>
                  <div style="font-size:11px;color:#60a5fa">🧾 ගනුදෙනු</div>
                </td>
              </tr>
            </table>
            <div style="margin-top:12px;display:flex;gap:8px">
              <div style="flex:1;background:#fdf2f8;padding:10px;border-radius:8px;text-align:center;font-size:12px;color:#be185d">
                📅 වේලාවන්: <strong>${d.todayAppointments}</strong>
              </div>
              <div style="flex:1;background:#fef3c7;padding:10px;border-radius:8px;text-align:center;font-size:12px;color:#92400e">
                ⚠️ තොග අඩු: <strong>${d.lowStockCount}</strong>
              </div>
            </div>
          </div>
          <div style="background:#fdf2f8;padding:10px;text-align:center;font-size:10px;color:#9ca3af">
            Auto-generated by Lumina Management System
          </div>
        </div>`
    });
    logActivity('EMAIL_SENT', 'Daily summary');
  } catch(e) {
    console.log('Daily summary error: ' + e);
  }
}


// ═══════════════════════════════════════════════════════
// ⏰ SCHEDULED TRIGGERS
// ═══════════════════════════════════════════════════════
function createTriggers() {
  // Remove existing
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  // Daily summary at 9 PM
  ScriptApp.newTrigger('sendDailySummaryEmail')
    .timeBased().everyDays(1).atHour(21).create();

  // Weekly warranty check on Monday 9 AM
  ScriptApp.newTrigger('checkExpiringWarranties')
    .timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(9).create();

  // Daily appointment reminder at 7 AM
  ScriptApp.newTrigger('sendAppointmentReminders')
    .timeBased().everyDays(1).atHour(7).create();

  SpreadsheetApp.getUi().alert('✅ Triggers 3ක් සාර්ථකව නිර්මාණය කරන ලදී!\n\n1. Daily Summary Email (9 PM)\n2. Warranty Check (Monday 9 AM)\n3. Appointment Reminders (7 AM)');
}

function checkExpiringWarranties() {
  try {
    const warranties = sheetToObjects('Warranties');
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    warranties.forEach(w => {
      if (w.Status === 'active' || w.status === 'active') {
        const endDate = new Date(w.EndDate || w.endDate);
        if (endDate <= thirtyDays && endDate > now) {
          const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
          createAlert('warranty', '🛡️ ' + (w.ProductName || w.productName) + ' වගකීම දින ' + daysLeft + ' කින් කල් ඉකුත් වේ', w.ProductID || w.productId);
        }
        if (endDate <= now) {
          const sheet = getSheet('Warranties');
          const row = findRowByColumn(sheet, 0, w.ID || w.id);
          if (row > 0) sheet.getRange(row, 10).setValue('expired');
        }
      }
    });
    logActivity('WARRANTY_CHECK', 'Completed');
  } catch(e) {
    console.log('Warranty check error: ' + e);
  }
}

function sendAppointmentReminders() {
  try {
    const appointments = sheetToObjects('Appointments');
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.filter(a =>
      (a.Date || a.date) === today &&
      (a.Status || a.status) !== 'cancelled' &&
      (a.Status || a.status) !== 'completed'
    );

    if (todayAppts.length > 0) {
      createAlert('appointment', '📅 අද වේලාවන් ' + todayAppts.length + 'ක් ඇත', '');
    }

    logActivity('APPOINTMENT_REMINDER', 'Today: ' + todayAppts.length + ' appointments');
  } catch(e) {
    console.log('Reminder error: ' + e);
  }
}


// ═══════════════════════════════════════════════════════
// 📋 CUSTOM MENU
// ═══════════════════════════════════════════════════════
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('✨ Lumina Salon')
    .addItem('🔧 Setup All Sheets', 'setupSheets')
    .addItem('⏰ Create Triggers', 'createTriggers')
    .addSeparator()
    .addItem('📊 Today\'s Dashboard', 'showDashboardAlert')
    .addItem('📧 Send Daily Summary Now', 'sendDailySummaryEmail')
    .addItem('🔍 Check Warranties', 'checkExpiringWarranties')
    .addItem('🔔 Check Appointments', 'sendAppointmentReminders')
    .addSeparator()
    .addItem('🗑️ Clear Activity Log', 'clearActivityLog')
    .addItem('ℹ️ About', 'showAbout')
    .addToUi();
}

function showDashboardAlert() {
  const data = getDashboardData();
  if (data.success) {
    const d = data.data;
    SpreadsheetApp.getUi().alert(
      '✨ Lumina Salon & Spa - Dashboard\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '💰 අද විකුණුම්: Rs. ' + d.todaySales.toLocaleString() + '\n' +
      '🧾 ගනුදෙනු: ' + d.todayTransactions + '\n' +
      '📦 නිෂ්පාදන: ' + d.totalProducts + '\n' +
      '⚠️ තොග අඩු: ' + d.lowStockCount + '\n' +
      '📅 අද වේලාවන්: ' + d.todayAppointments + '\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );
  }
}

function clearActivityLog() {
  const sheet = getSheet('ActivityLog');
  if (sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
    SpreadsheetApp.getUi().alert('✅ Activity Log cleared!');
  }
}

function showAbout() {
  SpreadsheetApp.getUi().alert(
    '✨ Lumina Salon & Spa\n' +
    'Management System v3.0.0\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
    '📦 Products Management\n' +
    '💰 Point of Sale (POS)\n' +
    '👨‍💼 Staff Management\n' +
    '📅 Appointment Booking\n' +
    '📊 Reports & Analytics\n' +
    '🛡️ Warranty Tracking\n' +
    '🔄 Returns Management\n' +
    '🔔 Smart Alerts\n' +
    '🚚 Restock Orders\n' +
    '🌙 Dark Mode\n' +
    '📱 Mobile Responsive\n' +
    '💬 WhatsApp Integration\n' +
    '📧 Email Alerts\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '© 2024 Lumina Salon & Spa'
  );
}
