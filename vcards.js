/* ==========================================
   VCARDS PAGE - JavaScript (Real Backend)
   ========================================== */

const API_BASE = '../backend/api/vcards/';

let vcardsData = [];
let filteredData = [];
let currentView = 'table';
let currentPage = 1;
let pageSize = 10;
let selectedRows = new Set();
let deleteTargetId = null;
let bulkDeleteIds = null;

// ===== LOAD VCARDS FROM BACKEND =====
async function loadVcards() {
    const search = document.getElementById('vcardSearch')?.value || '';
    const status = document.getElementById('filterStatus')?.value || 'all';
    const sort = document.getElementById('filterSort')?.value || 'created_desc';

    try {
        const params = new URLSearchParams({ search, status, sort });
        const response = await fetch(`${API_BASE}list.php?${params}`, {
            credentials: 'include'
        });

        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }

        const result = await response.json();

        if (result.success) {
            vcardsData = result.data.vcards.map(v => ({
                id: v.id,
                name: v.vcard_name,
                title: v.title,
                avatar: v.avatar,
                previewUrl: v.url_alias,
                fullPreviewUrl: v.preview_url,
                viewCount: v.view_count,
                status: v.status,
                createdAt: v.created_at_formatted,
                timestamp: new Date(v.created_at)
            }));
            filteredData = [...vcardsData];
            render();
        } else {
            showToast(result.message || 'Failed to load vCards', 'error');
            render();
        }
    } catch (err) {
        console.error('Load error:', err);
        showToast('Connection error: ' + err.message, 'error');
        render();
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== RENDER TABLE VIEW =====
function renderTable() {
    const tbody = document.getElementById('vcardsTableBody');
    const noDataMsg = document.getElementById('noDataMsg');
    if (!tbody) return;

    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, filteredData.length);
    const pageData = filteredData.slice(start, end);

    if (pageData.length === 0) {
        tbody.innerHTML = '';
        document.querySelector('.vcards-table').style.display = 'none';
        if (noDataMsg) noDataMsg.style.display = 'block';
        updatePagination();
        return;
    }

    document.querySelector('.vcards-table').style.display = 'table';
    if (noDataMsg) noDataMsg.style.display = 'none';

    tbody.innerHTML = pageData.map(card => `
        <tr data-id="${card.id}" class="${selectedRows.has(card.id) ? 'selected' : ''}">
            <td class="th-checkbox">
                <input type="checkbox" class="row-checkbox" data-id="${card.id}"
                       ${selectedRows.has(card.id) ? 'checked' : ''}
                       onclick="toggleRow(${card.id})">
            </td>
            <td>
                <div class="vcard-cell">
                    <div class="vcard-avatar">${card.avatar}</div>
                    <div class="vcard-info">
                        <h4>${escapeHtml(card.name)}</h4>
                        <p>${escapeHtml(card.title)}</p>
                    </div>
                </div>
            </td>
            <td>
                <a href="${card.fullPreviewUrl}" target="_blank" class="preview-url">
                    ${card.fullPreviewUrl}
                    <button class="copy-btn" onclick="copyUrl(event, '${card.fullPreviewUrl}')" title="Copy URL">
                        <i class="fas fa-copy"></i>
                    </button>
                </a>
            </td>
            <td class="td-center">
                <span class="view-count">${card.viewCount}</span>
            </td>
            <td class="td-center">
                <label class="status-toggle">
                    <input type="checkbox" ${card.status ? 'checked' : ''} onchange="toggleStatus(${card.id}, this.checked)">
                    <span class="toggle-slider"></span>
                </label>
            </td>
            <td class="td-center">
                <span class="date-badge">${card.createdAt}</span>
            </td>
            <td class="td-center">
                <div class="action-buttons">
                    <button class="action-btn btn-analytics" title="Analytics" onclick="viewAnalytics(${card.id})">
                        <i class="fas fa-chart-line"></i>
                    </button>
                    <button class="action-btn btn-inquiries" title="Inquiries" onclick="viewInquiries(${card.id})">
                        <i class="fas fa-users"></i>
                    </button>
                    <button class="action-btn btn-contacts" title="Contacts" onclick="viewContacts(${card.id})">
                        <i class="fas fa-phone"></i>
                    </button>
                    <button class="action-btn btn-edit" title="Edit" onclick="editVcard(${card.id})">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="action-btn btn-delete" title="Delete" onclick="showDeleteModal(${card.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    updatePagination();
    updateBulkBar();
}

// ===== RENDER GRID VIEW =====
function renderGrid() {
    const grid = document.getElementById('vcardsGrid');
    if (!grid) return;

    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, filteredData.length);
    const pageData = filteredData.slice(start, end);

    if (pageData.length === 0) {
        grid.innerHTML = `
            <div class="no-data" style="grid-column: 1/-1;">
                <i class="fas fa-inbox"></i>
                <h3>No vCards Found</h3>
                <p>Click "+ New vCard" to create one</p>
            </div>
        `;
        updatePagination();
        return;
    }

    grid.innerHTML = pageData.map(card => `
        <div class="vcard-grid-item">
            <div class="grid-card-cover"></div>
            <div class="grid-card-body">
                <div class="grid-card-avatar">${card.avatar}</div>
                <h4 class="grid-card-name">${escapeHtml(card.name)}</h4>
                <p class="grid-card-title">${escapeHtml(card.title)}</p>
                <div class="grid-card-stats">
                    <div class="grid-stat">
                        <span class="grid-stat-value">${card.viewCount}</span>
                        <span class="grid-stat-label">Views</span>
                    </div>
                    <div class="grid-stat">
                        <span class="grid-stat-value">${card.status ? 'Active' : 'Inactive'}</span>
                        <span class="grid-stat-label">Status</span>
                    </div>
                </div>
                <div class="grid-card-actions">
                    <button class="action-btn btn-analytics" onclick="viewAnalytics(${card.id})"><i class="fas fa-chart-line"></i></button>
                    <button class="action-btn btn-edit" onclick="editVcard(${card.id})"><i class="fas fa-pen"></i></button>
                    <button class="action-btn btn-delete" onclick="showDeleteModal(${card.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `).join('');

    updatePagination();
}

function render() {
    if (currentView === 'table') renderTable();
    else renderGrid();
}

function switchView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    document.getElementById('tableView').style.display = view === 'table' ? 'block' : 'none';
    document.getElementById('gridView').style.display = view === 'grid' ? 'block' : 'none';
    render();
}

// ===== TOGGLE STATUS =====
async function toggleStatus(id, newStatus) {
    try {
        const response = await fetch(`${API_BASE}toggle-status.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id, status: newStatus ? 1 : 0 })
        });
        const result = await response.json();

        if (result.success) {
            showToast(`vCard ${newStatus ? 'activated' : 'deactivated'}`, 'success');
            const card = vcardsData.find(c => c.id === id);
            if (card) card.status = newStatus;
        } else {
            showToast(result.message, 'error');
            loadVcards();
        }
    } catch (err) {
        showToast('Failed to update status', 'error');
        loadVcards();
    }
}

// ===== ROW SELECTION =====
function toggleRow(id) {
    if (selectedRows.has(id)) selectedRows.delete(id);
    else selectedRows.add(id);
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) row.classList.toggle('selected', selectedRows.has(id));
    updateBulkBar();
    updateSelectAllCheckbox();
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, filteredData.length);
    const pageData = filteredData.slice(start, end);
    if (selectAll.checked) pageData.forEach(c => selectedRows.add(c.id));
    else pageData.forEach(c => selectedRows.delete(c.id));
    render();
}

function updateSelectAllCheckbox() {
    const selectAll = document.getElementById('selectAll');
    if (!selectAll) return;
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, filteredData.length);
    const pageData = filteredData.slice(start, end);
    selectAll.checked = pageData.length > 0 && pageData.every(c => selectedRows.has(c.id));
}

function updateBulkBar() {
    const bar = document.getElementById('bulkActionsBar');
    const count = document.getElementById('selectedCount');
    if (!bar) return;
    if (selectedRows.size > 0) {
        bar.classList.add('show');
        count.textContent = selectedRows.size;
    } else {
        bar.classList.remove('show');
    }
}

function clearSelection() {
    selectedRows.clear();
    render();
}

// ===== BULK ACTIONS =====
async function bulkActivate() {
    for (const id of selectedRows) {
        await fetch(`${API_BASE}toggle-status.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id, status: 1 })
        });
    }
    showToast(`${selectedRows.size} vCard(s) activated`, 'success');
    selectedRows.clear();
    loadVcards();
}

async function bulkDeactivate() {
    for (const id of selectedRows) {
        await fetch(`${API_BASE}toggle-status.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id, status: 0 })
        });
    }
    showToast(`${selectedRows.size} vCard(s) deactivated`, 'success');
    selectedRows.clear();
    loadVcards();
}

function bulkDelete() {
    bulkDeleteIds = Array.from(selectedRows);
    deleteTargetId = null;
    document.getElementById('deleteMessage').textContent =
        `Are you sure you want to delete ${bulkDeleteIds.length} vCard(s)? This action cannot be undone.`;
    document.getElementById('deleteModal').classList.add('show');
}

// ===== ACTIONS =====
function viewAnalytics(id) {
    showToast('Analytics module coming soon', 'success');
}

function viewInquiries(id) {
    window.location.href = `inquiries.html?vcard_id=${id}`;
}

function viewContacts(id) {
    showToast('Contacts module coming soon', 'success');
}

function editVcard(id) {
    window.location.href = `vcards-edit.html?id=${id}`;
}

// ===== DELETE MODAL =====
function showDeleteModal(id) {
    deleteTargetId = id;
    bulkDeleteIds = null;
    const card = vcardsData.find(c => c.id === id);
    document.getElementById('deleteMessage').textContent =
        `Are you sure you want to delete "${card.name}"? This action cannot be undone.`;
    document.getElementById('deleteModal').classList.add('show');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    deleteTargetId = null;
    bulkDeleteIds = null;
}

async function confirmDelete() {
    if (bulkDeleteIds) {
        for (const id of bulkDeleteIds) {
            await fetch(`${API_BASE}delete.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id })
            });
        }
        showToast(`${bulkDeleteIds.length} vCard(s) deleted`, 'success');
        selectedRows.clear();
    } else if (deleteTargetId) {
        try {
            const response = await fetch(`${API_BASE}delete.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: deleteTargetId })
            });
            const result = await response.json();
            if (result.success) {
                showToast(result.message, 'success');
            } else {
                showToast(result.message, 'error');
            }
        } catch (err) {
            showToast('Delete failed', 'error');
        }
    }
    closeDeleteModal();
    loadVcards();
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeDeleteModal();
});

// ===== COPY URL =====
function copyUrl(event, url) {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard.writeText(url).then(() => {
        showToast('URL copied to clipboard!', 'success');
    }).catch(() => {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('URL copied!', 'success');
    });
}

// ===== FILTER =====
function toggleFilterPanel() {
    document.getElementById('filterPanel').classList.toggle('show');
}

function applyFilters() {
    loadVcards();
    showToast('Filters applied', 'success');
}

function resetFilters() {
    document.getElementById('filterStatus').value = 'all';
    document.getElementById('filterDate').value = 'all';
    document.getElementById('filterSort').value = 'created_desc';
    document.getElementById('vcardSearch').value = '';
    loadVcards();
    showToast('Filters reset', 'success');
}

// ===== PAGINATION =====
function updatePagination() {
    const total = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);
    document.getElementById('showingFrom').textContent = start;
    document.getElementById('showingTo').textContent = end;
    document.getElementById('totalCount').textContent = total;

    const pagination = document.getElementById('pagination');
    let html = `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})"><i class="fas fa-chevron-left"></i></button>`;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
    if (startPage > 1) {
        html += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) html += `<span class="page-btn" style="border:none;background:transparent;cursor:default;">...</span>`;
    }
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += `<span class="page-btn" style="border:none;background:transparent;cursor:default;">...</span>`;
        html += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})"><i class="fas fa-chevron-right"></i></button>`;
    pagination.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function changePageSize() {
    pageSize = parseInt(document.getElementById('pageSize').value);
    currentPage = 1;
    render();
}

// ===== TOAST =====
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-check-circle' :
                 type === 'error' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle';
    const title = type === 'success' ? 'Success' :
                  type === 'error' ? 'Error' : 'Warning';
    toast.innerHTML = `<i class="fas ${icon}"></i><div class="toast-content"><p class="toast-title">${title}</p><p class="toast-msg">${message}</p></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
}

// ===== SEARCH (debounced) =====
let searchDebounce;
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('vcardSearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => loadVcards(), 300);
        });
    }
    loadVcards();
});

console.log('%c📇 vCards Page (Real Backend)', 'color: #8338ec; font-size: 14px; font-weight: bold;');
