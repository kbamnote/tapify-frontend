/* ==========================================
   TAPIFY ADMIN PANEL - Main JavaScript
   ========================================== */

// ===== SIDEBAR TOGGLE =====
function toggleSidebar() {
    const body = document.body;
    const overlay = document.getElementById('sidebarOverlay');

    if (window.innerWidth <= 991) {
        // Mobile: toggle sidebar-open class
        body.classList.toggle('sidebar-open');
        if (overlay) overlay.classList.toggle('show');
    } else {
        // Desktop: toggle sidebar-collapsed class
        body.classList.toggle('sidebar-collapsed');
    }
}

// ===== DROPDOWN TOGGLE =====
function toggleDropdown(id) {
    // Close all other dropdowns first
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu.id !== id) menu.classList.remove('show');
    });

    const dropdown = document.getElementById(id);
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

// ===== THEME TOGGLE (Dark Mode) =====
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');

    body.classList.toggle('dark-theme');

    if (body.classList.contains('dark-theme')) {
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        localStorage.setItem('tapify_theme', 'dark');
    } else {
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        localStorage.setItem('tapify_theme', 'light');
    }

    // Update chart colors if exists
    if (window.analyticsChartInstance) {
        updateChartTheme();
    }
}

// Apply saved theme on load
function applySavedTheme() {
    const savedTheme = localStorage.getItem('tapify_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
}

// ===== ANALYTICS CHART =====
function initAnalyticsChart() {
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;

    // Generate dummy data for last 8 days
    const dates = [];
    const today = new Date();
    for (let i = 7; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        dates.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    // Sample visitor data (you can replace with real data later)
    const vCardVisitors = [12, 19, 15, 25, 22, 30, 28, 35];
    const storeVisitors = [5, 8, 6, 10, 12, 9, 15, 18];

    window.analyticsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'vCard Visitors',
                    data: vCardVisitors,
                    borderColor: '#8338ec',
                    backgroundColor: 'rgba(131, 56, 236, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#8338ec',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'WhatsApp Store Visitors',
                    data: storeVisitors,
                    borderColor: '#25D366',
                    backgroundColor: 'rgba(37, 211, 102, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#25D366',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(26, 32, 53, 0.95)',
                    titleColor: '#FFD700',
                    bodyColor: '#fff',
                    borderColor: '#8338ec',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                    displayColors: true,
                    boxPadding: 5
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6c757d',
                        font: { size: 11, family: 'Poppins' }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)',
                        borderDash: [5, 5]
                    },
                    ticks: {
                        color: '#6c757d',
                        font: { size: 11, family: 'Poppins' }
                    }
                }
            }
        }
    });
}

function updateChartTheme() {
    if (!window.analyticsChartInstance) return;

    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#a8b3cf' : '#6c757d';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    window.analyticsChartInstance.options.scales.x.ticks.color = textColor;
    window.analyticsChartInstance.options.scales.y.ticks.color = textColor;
    window.analyticsChartInstance.options.scales.y.grid.color = gridColor;
    window.analyticsChartInstance.update();
}

// ===== PROFILE ACTIONS =====
function changePassword() {
    alert('Change Password feature will be available in next update.\n\nDemo: This will open a modal in production version.');
}

function changeLanguage() {
    alert('Language feature: Currently set to English.\nFull multi-language support coming soon!');
}

// ===== SIDEBAR SEARCH FILTER =====
function setupSidebarSearch() {
    const searchInput = document.getElementById('sidebarSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');

        navItems.forEach(item => {
            const text = item.querySelector('span').textContent.toLowerCase();
            if (query === '' || text.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// ===== AUTHENTICATION CHECK =====
function checkAuth() {
    const user = localStorage.getItem('tapify_user') || sessionStorage.getItem('tapify_user');
    // Demo: If no user logged in, redirect to login
    // Uncomment in production:
    // if (!user && !window.location.pathname.includes('login.html')) {
    //     window.location.href = 'login.html';
    // }
}

// ===== HANDLE WINDOW RESIZE =====
window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
        document.body.classList.remove('sidebar-open');
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) overlay.classList.remove('show');
    }
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const search = document.getElementById('sidebarSearch');
        if (search) search.focus();
    }

    // Escape to close dropdowns
    if (e.key === 'Escape') {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

// ===== LOGOUT =====
async function logout() {
    try {
        await fetch('../backend/api/logout.php', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (err) {
        console.error('Logout error:', err);
    }
    localStorage.removeItem('tapify_user');
    sessionStorage.removeItem('tapify_user');
    window.location.href = 'login.html';
}

// ===== ANIMATE STATS COUNTERS =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        if (isNaN(target) || target === 0) return;

        let current = 0;
        const increment = target / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 30);
    });
}

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();
    initAnalyticsChart();
    setupSidebarSearch();
    checkAuth();

    // Animate counters after a small delay
    setTimeout(animateCounters, 300);

    console.log('%c🚀 Tapify Admin Panel Loaded', 'color: #8338ec; font-size: 14px; font-weight: bold;');
});
