// Bank Fraud Detection System - Main Application
class FraudDetectionApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'login';
        this.sampleData = this.initializeSampleData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoginPage();
    }

    initializeSampleData() {
        return {
            users: [
                { id: 1, username: 'police1', password: 'pass123', role: 'POLICE', name: 'Inspector Sharma', station: 'Central Police Station' },
                { id: 2, username: 'admin1', password: 'pass123', role: 'ADMIN', name: 'Sarah Johnson', department: 'Central Authority' },
                { id: 3, username: 'bank1', password: 'pass123', role: 'BANK', name: 'Michael Chen', bank: 'State Bank of India' }
            ],
            banks: ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Punjab National Bank', 'Bank of Baroda'],
            crimeTypes: ['Online Scam', 'Phishing', 'Money Laundering', 'Fake Investment', 'Identity Theft', 'Other'],
            reports: [
                {
                    id: 'RPT001',
                    accountNo: '1234567890',
                    holderName: 'John Doe',
                    bank: 'State Bank of India',
                    branch: 'Mumbai Central',
                    ifsc: 'SBIN0001234',
                    firNo: 'FIR/2024/001',
                    crimeType: 'Online Scam',
                    description: 'Victim transferred money to this account after receiving fake investment call',
                    reportedBy: 'Inspector Sharma',
                    reportedDate: '2024-01-15',
                    status: 'pending',
                    riskScore: 0.87,
                    riskLevel: 'high',
                    evidence: ['document1.jpg', 'screenshot1.png']
                },
                {
                    id: 'RPT002',
                    accountNo: '9876543210',
                    holderName: 'Jane Smith',
                    bank: 'HDFC Bank',
                    branch: 'Delhi South',
                    ifsc: 'HDFC0001234',
                    firNo: 'FIR/2024/002',
                    crimeType: 'Phishing',
                    description: 'Multiple victims reported transferring money after phishing SMS',
                    reportedBy: 'Inspector Sharma',
                    reportedDate: '2024-01-14',
                    status: 'under-review',
                    riskScore: 0.65,
                    riskLevel: 'medium',
                    evidence: ['sms_screenshot.jpg']
                }
            ]
        };
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-item')) {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigateTo(page);
            }
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        // Find user
        const user = this.sampleData.users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            this.showMainLayout();
            errorDiv.classList.remove('show');
        } else {
            errorDiv.textContent = 'Invalid username or password';
            errorDiv.classList.add('show');
        }
    }

    handleLogout() {
        this.currentUser = null;
        this.showLoginPage();
    }

    showLoginPage() {
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('mainLayout').classList.add('hidden');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('loginError').classList.remove('show');
    }

    showMainLayout() {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('mainLayout').classList.remove('hidden');
        
        this.updateUserInfo();
        this.generateNavigation();
        this.navigateTo('dashboard');
    }

    updateUserInfo() {
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userRole').textContent = this.currentUser.role.toLowerCase();
    }

    generateNavigation() {
        const sidebar = document.querySelector('.sidebar-nav');
        const navItems = this.getNavigationItems();

        sidebar.innerHTML = navItems.map(item => `
            <a href="#" class="nav-item" data-page="${item.page}">
                <i class="${item.icon}"></i>
                ${item.text}
            </a>
        `).join('');

        // Set first item as active
        sidebar.querySelector('.nav-item').classList.add('active');
    }

    getNavigationItems() {
        const navItems = {
            'POLICE': [
                { page: 'dashboard', icon: 'fas fa-home', text: 'Dashboard' },
                { page: 'new-report', icon: 'fas fa-plus-circle', text: 'New Report' },
                { page: 'my-reports', icon: 'fas fa-list', text: 'My Reports' }
            ],
            'ADMIN': [
                { page: 'dashboard', icon: 'fas fa-home', text: 'Dashboard' },
                { page: 'all-reports', icon: 'fas fa-file-alt', text: 'All Reports' },
                { page: 'high-risk', icon: 'fas fa-exclamation-triangle', text: 'High Risk Accounts' },
                { page: 'banks', icon: 'fas fa-university', text: 'Banks' }
            ],
            'BANK': [
                { page: 'dashboard', icon: 'fas fa-home', text: 'Dashboard' },
                { page: 'freeze-requests', icon: 'fas fa-lock', text: 'Freeze Requests' },
                { page: 'history', icon: 'fas fa-history', text: 'History' }
            ]
        };

        return navItems[this.currentUser.role];
    }

    navigateTo(page) {
        // Update active navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

        // Load page content
        this.currentPage = page;
        this.loadPageContent(page);
    }

    loadPageContent(page) {
        const contentArea = document.getElementById('contentArea');
        
        switch(page) {
            case 'dashboard':
                contentArea.innerHTML = this.generateDashboard();
                break;
            case 'new-report':
                contentArea.innerHTML = this.generateNewReportPage();
                this.setupNewReportHandlers();
                break;
            case 'my-reports':
                contentArea.innerHTML = this.generateMyReportsPage();
                break;
            case 'all-reports':
                contentArea.innerHTML = this.generateAllReportsPage();
                break;
            case 'high-risk':
                contentArea.innerHTML = this.generateHighRiskPage();
                break;
            case 'freeze-requests':
                contentArea.innerHTML = this.generateFreezeRequestsPage();
                break;
            default:
                contentArea.innerHTML = this.generateDashboard();
        }
    }

    generateDashboard() {
        const role = this.currentUser.role;
        
        if (role === 'POLICE') {
            return this.generatePoliceDashboard();
        } else if (role === 'ADMIN') {
            return this.generateAdminDashboard();
        } else if (role === 'BANK') {
            return this.generateBankDashboard();
        }
    }

    generatePoliceDashboard() {
        const userReports = this.sampleData.reports.filter(r => r.reportedBy === this.currentUser.name);
        const totalReports = userReports.length;
        const pendingReports = userReports.filter(r => r.status === 'pending').length;
        const approvedReports = userReports.filter(r => r.status === 'approved').length;
        const rejectedReports = userReports.filter(r => r.status === 'rejected').length;

        return `
            <div class="page-header">
                <h1 class="page-title">Police Dashboard</h1>
                <p class="page-description">Monitor your fraud reports and case status</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-title">Total Reports Filed</span>
                        <div class="stat-card-icon blue">
                            <i class="fas fa-file-alt"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${totalReports}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-title">Pending Reports</span>
                        <div class="stat-card-icon yellow">
                            <i class="fas fa-clock"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${pendingReports}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-title">Approved for Freeze</span>
                        <div class="stat-card-icon green">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${approvedReports}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-title">Rejected Reports</span>
                        <div class="stat-card-icon red">
                            <i class="fas fa-times-circle"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${rejectedReports}</div>
                </div>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h2 class="table-title">Recent Reports</h2>
                    <a href="#" class="btn btn-primary" data-page="new-report">
                        <i class="fas fa-plus"></i>
                        File New Report
                    </a>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Report ID</th>
                            <th>Account No</th>
                            <th>Bank</th>
                            <th>Status</th>
                            <th>Risk Level</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userReports.map(report => `
                            <tr>
                                <td>${report.id}</td>
                                <td>${report.accountNo}</td>
                                <td>${report.bank}</td>
                                <td><span class="status-badge ${report.status}">${report.status.replace('-', ' ')}</span></td>
                                <td><span class="risk-badge ${report.riskLevel}">${report.riskLevel}</span></td>
                                <td>${report.reportedDate}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    generateAdminDashboard() {
        const totalReports = this.sampleData.reports.length;
        const highRiskReports = this.sampleData.reports.filter(r => r.riskLevel === 'high').length;
        const approvedReports = this.sampleData.reports.filter(r => r.status === 'approved').length;
        const frozenAccounts = this.sampleData.reports.filter(r => r.status === 'frozen').length;

        return `
            <div class="page-header">
                <h1 class="page-title">Admin Dashboard</h1>
                <p class="page-description">Central monitoring and case management</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-title">Total Reports</span>
                        <div class="stat-card-icon blue">
                            <i class="fas fa-file-alt"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${totalReports}</div>
                    <div class="stat-card-change positive">
                        <i class="fas fa-arrow-up"></i>
                        +12% from last week
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-title">High Risk Reports</span>
                        <div class="stat-card-icon red">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${highRiskReports}</div>
                    <div class="stat-card-change negative">
                        <i class="fas fa-arrow-down"></i>
                        -5% from last week
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-title">Approved for Freeze</span>
                        <div class="stat-card-icon green">
                            <i class="fas fa-lock"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${approvedReports}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-title">Total Frozen Accounts</span>
                        <div class="stat-card-icon blue">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${frozenAccounts}</div>
                </div>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h2 class="table-title">Recent High-Risk Reports</h2>
                    <div class="table-filters">
                        <select class="filter-select">
                            <option>All Banks</option>
                            ${this.sampleData.banks.map(bank => `<option>${bank}</option>`).join('')}
                        </select>
                        <input type="text" class="search-input" placeholder="Search accounts...">
                    </div>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Report ID</th>
                            <th>Account No</th>
                            <th>Bank</th>
                            <th>Risk Score</th>
                            <th>Status</th>
                            <th>Reported By</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.sampleData.reports.map(report => `
                            <tr>
                                <td>${report.id}</td>
                                <td>${report.accountNo}</td>
                                <td>${report.bank}</td>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span class="risk-badge ${report.riskLevel}">${report.riskLevel}</span>
                                        <span style="font-size: 12px; color: #64748b;">${report.riskScore}</span>
                                    </div>
                                </td>
                                <td><span class="status-badge ${report.status}">${report.status.replace('-', ' ')}</span></td>
                                <td>${report.reportedBy}</td>
                                <td>${report.reportedDate}</td>
                                <td>
                                    <button class="btn btn-sm btn-primary">Review</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    generateBankDashboard() {
        const pendingRequests = 3;
        const completedRequests = 12;
        const failedRequests = 1;

        return `
            <div class="page-header">
                <h1 class="page-title">Bank Dashboard</h1>
                <p class="page-description">Manage account freeze requests - ${this.currentUser.bank}</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-title">Freeze Requests Pending</span>
                        <div class="stat-card-icon yellow">
                            <i class="fas fa-clock"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${pendingRequests}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-title">Freeze Completed</span>
                        <div class="stat-card-icon green">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${completedRequests}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-title">Requests Failed</span>
                        <div class="stat-card-icon red">
                            <i class="fas fa-times-circle"></i>
                        </div>
                    </div>
                    <div class="stat-card-value">${failedRequests}</div>
                </div>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h2 class="table-title">Pending Freeze Requests</h2>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Report ID</th>
                            <th>Account No</th>
                            <th>Risk Level</th>
                            <th>Status</th>
                            <th>Admin Remark</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>RPT001</td>
                            <td>1234567890</td>
                            <td><span class="risk-badge high">high</span></td>
                            <td><span class="status-badge pending">pending</span></td>
                            <td>Multiple fraud reports received</td>
                            <td>2024-01-15</td>
                            <td>
                                <button class="btn btn-sm btn-success">Process</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    generateNewReportPage() {
        return `
            <div class="page-header">
                <h1 class="page-title">File New Fraud Report</h1>
                <p class="page-description">Report suspicious bank accounts with OCR-powered data extraction</p>
            </div>

            <form id="newReportForm">
                <div class="form-grid">
                    <div class="form-section">
                        <h2 class="form-section-title">Account Details</h2>
                        <div class="form-group">
                            <label for="accountNo">Account Number *</label>
                            <input type="text" id="accountNo" name="accountNo" required>
                        </div>
                        <div class="form-group">
                            <label for="holderName">Account Holder Name *</label>
                            <input type="text" id="holderName" name="holderName" required>
                        </div>
                        <div class="form-group">
                            <label for="bank">Bank *</label>
                            <select id="bank" name="bank" required>
                                <option value="">Select Bank</option>
                                ${this.sampleData.banks.map(bank => `<option value="${bank}">${bank}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="branch">Branch</label>
                            <input type="text" id="branch" name="branch">
                        </div>
                        <div class="form-group">
                            <label for="ifsc">IFSC/SWIFT Code</label>
                            <input type="text" id="ifsc" name="ifsc">
                        </div>
                    </div>

                    <div class="form-section">
                        <h2 class="form-section-title">Complaint Details</h2>
                        <div class="form-group">
                            <label for="firNo">FIR/Case Number *</label>
                            <input type="text" id="firNo" name="firNo" required>
                        </div>
                        <div class="form-group">
                            <label for="crimeType">Crime Type *</label>
                            <select id="crimeType" name="crimeType" required>
                                <option value="">Select Crime Type</option>
                                ${this.sampleData.crimeTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="description">Description *</label>
                            <textarea id="description" name="description" required placeholder="Provide detailed description of the fraud case..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h2 class="form-section-title">Evidence & OCR Section</h2>
                    <div class="file-upload-area" id="fileUploadArea">
                        <div class="file-upload-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div class="file-upload-text">Upload document or photo containing bank account details</div>
                        <div class="file-upload-subtext">Supports JPEG, PNG files up to 10MB</div>
                        <input type="file" id="fileInput" accept="image/*" multiple style="display: none;">
                    </div>
                    <div class="uploaded-files" id="uploadedFiles"></div>
                    
                    <div class="ocr-section" id="ocrSection" style="display: none;">
                        <div class="ocr-header">
                            <span class="ocr-title">OCR Processing</span>
                            <span class="ocr-status ready" id="ocrStatus">Ready to extract</span>
                        </div>
                        <button type="button" class="btn btn-secondary" id="runOcrBtn">
                            <i class="fas fa-search"></i>
                            Run OCR to Extract Details
                        </button>
                        <div class="extracted-data" id="extractedData" style="display: none;">
                            <div class="extracted-data-title">Extracted Data (Please verify and edit if needed)</div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Extracted Account Number</label>
                                    <input type="text" id="extractedAccountNo" readonly>
                                </div>
                                <div class="form-group">
                                    <label>Extracted Name</label>
                                    <input type="text" id="extractedName" readonly>
                                </div>
                                <div class="form-group">
                                    <label>Extracted Bank</label>
                                    <input type="text" id="extractedBank" readonly>
                                </div>
                                <div class="form-group">
                                    <label>Extracted IFSC</label>
                                    <input type="text" id="extractedIfsc" readonly>
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary" id="useExtractedBtn">
                                <i class="fas fa-check"></i>
                                Use Extracted Data
                            </button>
                        </div>
                    </div>
                </div>

                <div class="risk-assessment" id="riskAssessment" style="display: none;">
                    <h2 class="form-section-title">ANN Fraud Risk Assessment</h2>
                    <div class="risk-score">
                        <div class="risk-gauge high" id="riskGauge">0.87</div>
                        <div class="risk-details">
                            <h3 id="riskLevel">High Risk</h3>
                            <p>Based on ANN analysis of account patterns</p>
                            <span class="risk-badge high" id="riskBadge">High Risk - 87%</span>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 16px; justify-content: flex-end; margin-top: 32px;">
                    <button type="button" class="btn btn-secondary">
                        <i class="fas fa-undo"></i>
                        Reset
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i>
                        Submit Report
                    </button>
                </div>
            </form>
        `;
    }

    generateMyReportsPage() {
        const userReports = this.sampleData.reports.filter(r => r.reportedBy === this.currentUser.name);

        return `
            <div class="page-header">
                <h1 class="page-title">My Reports</h1>
                <p class="page-description">Track status of your submitted fraud reports</p>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h2 class="table-title">All Reports</h2>
                    <div class="table-filters">
                        <select class="filter-select">
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Under Review</option>
                            <option>Approved</option>
                            <option>Rejected</option>
                        </select>
                        <select class="filter-select">
                            <option>All Banks</option>
                            ${this.sampleData.banks.map(bank => `<option>${bank}</option>`).join('')}
                        </select>
                        <input type="text" class="search-input" placeholder="Search reports...">
                    </div>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Report ID</th>
                            <th>Account No</th>
                            <th>Bank</th>
                            <th>Status</th>
                            <th>Risk Level</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userReports.map(report => `
                            <tr>
                                <td>${report.id}</td>
                                <td>${report.accountNo}</td>
                                <td>${report.bank}</td>
                                <td><span class="status-badge ${report.status}">${report.status.replace('-', ' ')}</span></td>
                                <td><span class="risk-badge ${report.riskLevel}">${report.riskLevel}</span></td>
                                <td>${report.reportedDate}</td>
                                <td>
                                    <button class="btn btn-sm btn-secondary">View Details</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    generateAllReportsPage() {
        return `
            <div class="page-header">
                <h1 class="page-title">All Reports</h1>
                <p class="page-description">Review and manage all fraud reports</p>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h2 class="table-title">Fraud Reports</h2>
                    <div class="table-filters">
                        <select class="filter-select">
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Under Review</option>
                            <option>Approved</option>
                            <option>Rejected</option>
                        </select>
                        <select class="filter-select">
                            <option>All Risk Levels</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                        <input type="text" class="search-input" placeholder="Search by account number...">
                    </div>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Report ID</th>
                            <th>Account No</th>
                            <th>Account Holder</th>
                            <th>Bank</th>
                            <th>Risk Score</th>
                            <th>Status</th>
                            <th>Reported By</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.sampleData.reports.map(report => `
                            <tr>
                                <td>${report.id}</td>
                                <td>${report.accountNo}</td>
                                <td>${report.holderName}</td>
                                <td>${report.bank}</td>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span class="risk-badge ${report.riskLevel}">${report.riskLevel}</span>
                                        <span style="font-size: 12px; color: #64748b;">${report.riskScore}</span>
                                    </div>
                                </td>
                                <td><span class="status-badge ${report.status}">${report.status.replace('-', ' ')}</span></td>
                                <td>${report.reportedBy}</td>
                                <td>${report.reportedDate}</td>
                                <td>
                                    <button class="btn btn-sm btn-primary">Review</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    generateHighRiskPage() {
        const highRiskReports = this.sampleData.reports.filter(r => r.riskLevel === 'high');

        return `
            <div class="page-header">
                <h1 class="page-title">High Risk Accounts</h1>
                <p class="page-description">Accounts flagged as high risk by ANN analysis</p>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h2 class="table-title">High Risk Reports</h2>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Report ID</th>
                            <th>Account No</th>
                            <th>Bank</th>
                            <th>Risk Score</th>
                            <th>Crime Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${highRiskReports.map(report => `
                            <tr>
                                <td>${report.id}</td>
                                <td>${report.accountNo}</td>
                                <td>${report.bank}</td>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span class="risk-badge ${report.riskLevel}">${report.riskLevel}</span>
                                        <span style="font-weight: 600;">${report.riskScore}</span>
                                    </div>
                                </td>
                                <td>${report.crimeType}</td>
                                <td><span class="status-badge ${report.status}">${report.status.replace('-', ' ')}</span></td>
                                <td>
                                    <button class="btn btn-sm btn-success">Approve Freeze</button>
                                    <button class="btn btn-sm btn-danger">Reject</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    generateFreezeRequestsPage() {
        return `
            <div class="page-header">
                <h1 class="page-title">Freeze Requests</h1>
                <p class="page-description">Manage account freeze requests for ${this.currentUser.bank}</p>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h2 class="table-title">Pending Freeze Requests</h2>
                    <div class="table-filters">
                        <select class="filter-select">
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Initiated</option>
                            <option>Completed</option>
                            <option>Failed</option>
                        </select>
                    </div>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Freeze ID</th>
                            <th>Report ID</th>
                            <th>Account No</th>
                            <th>Risk Score</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>FRZ001</td>
                            <td>RPT001</td>
                            <td>1234567890</td>
                            <td><span class="risk-badge high">High - 0.87</span></td>
                            <td><span class="status-badge pending">Pending</span></td>
                            <td>2024-01-15</td>
                            <td>
                                <button class="btn btn-sm btn-success">Process</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    setupNewReportHandlers() {
        // File upload handling
        const fileUploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('fileInput');
        const uploadedFiles = document.getElementById('uploadedFiles');
        const ocrSection = document.getElementById('ocrSection');
        const runOcrBtn = document.getElementById('runOcrBtn');
        const riskAssessment = document.getElementById('riskAssessment');

        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

        runOcrBtn.addEventListener('click', () => {
            this.simulateOCR();
        });

        // Form submission
        document.getElementById('newReportForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewReportSubmit();
        });
    }

    handleFileUpload(files) {
        const uploadedFilesDiv = document.getElementById('uploadedFiles');
        const ocrSection = document.getElementById('ocrSection');

        for (let file of files) {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'uploaded-file';
            fileDiv.innerHTML = `
                <div class="uploaded-file-info">
                    <i class="fas fa-image uploaded-file-icon"></i>
                    <div>
                        <div class="uploaded-file-name">${file.name}</div>
                        <div class="uploaded-file-size">${(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                </div>
                <button type="button" class="remove-file">
                    <i class="fas fa-times"></i>
                </button>
            `;

            fileDiv.querySelector('.remove-file').addEventListener('click', () => {
                fileDiv.remove();
                if (uploadedFilesDiv.children.length === 0) {
                    ocrSection.style.display = 'none';
                }
            });

            uploadedFilesDiv.appendChild(fileDiv);
        }

        if (files.length > 0) {
            ocrSection.style.display = 'block';
        }
    }

    simulateOCR() {
        const ocrStatus = document.getElementById('ocrStatus');
        const extractedData = document.getElementById('extractedData');
        const runOcrBtn = document.getElementById('runOcrBtn');
        const riskAssessment = document.getElementById('riskAssessment');

        // Simulate processing
        ocrStatus.textContent = 'Processing...';
        ocrStatus.className = 'ocr-status processing';
        runOcrBtn.disabled = true;

        setTimeout(() => {
            // Simulate extracted data
            document.getElementById('extractedAccountNo').value = '1234567890';
            document.getElementById('extractedName').value = 'JOHN DOE';
            document.getElementById('extractedBank').value = 'State Bank of India';
            document.getElementById('extractedIfsc').value = 'SBIN0001234';

            ocrStatus.textContent = 'Extraction Completed';
            ocrStatus.className = 'ocr-status completed';
            extractedData.style.display = 'block';
            runOcrBtn.disabled = false;

            // Setup use extracted data button
            document.getElementById('useExtractedBtn').addEventListener('click', () => {
                document.getElementById('accountNo').value = document.getElementById('extractedAccountNo').value;
                document.getElementById('holderName').value = document.getElementById('extractedName').value;
                document.getElementById('bank').value = document.getElementById('extractedBank').value;
                document.getElementById('ifsc').value = document.getElementById('extractedIfsc').value;

                // Show risk assessment
                riskAssessment.style.display = 'block';
            });
        }, 2000);
    }

    handleNewReportSubmit() {
        // Simulate form submission
        alert('Report submitted successfully! Report ID: RPT003');
        this.navigateTo('my-reports');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FraudDetectionApp();
});