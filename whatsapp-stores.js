/* WhatsApp Stores List Page - Real Backend (Phase 7A) */

const STORES_API = '../backend/api/stores/';
let storesData = [];
let deleteTargetId = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🏪 WhatsApp Stores Page (Real Backend)', 'color: #25D366; font-size: 14px; font-weight: bold;');
    loadStores();

    // Search debounce
    const searchInput = document.querySelector('.list-search input');
    if (searchInput) {
        let timeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(loadStores, 400);
        });
    }
});

async function loadStores() {
    const tbody = document.getElementById('storesTableBody');
    const noData = document.getElementById('noDataMsg');
    const table = document.querySelector('.vcards-table');

    if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px"><i class="fas fa-spinner fa-spin"></i> Loading stores...</td></tr>';

    try {
        const search = document.querySelector('.list-search input')?.value || '';
        const url = `${STORES_API}list.php?search=${encodeURIComponent(search)}`;

        const response = await fetch(url, { credentials: 'include' });
        if (response.status === 401) { window.location.href = 'login.html'; return; }

        const result = await response.json();

        if (result.success) {
            storesData = result.data.stores;
            renderStores();
        } else {
            showToast(result.message || 'Failed to load', 'error');
            if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:#ef4444">${result.message}</td></tr>`;
        }
    } catch (err) {
        console.error('Load error:', err);
        showToast('Connection error: ' + err.message, 'error');
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#ef4444">Failed to load. Check backend.</td></tr>';
    }
}

function renderStores() {
    const tbody = document.getElementById('storesTableBody');
    const noData = document.getElementById('noDataMsg');
    const table = document.querySelector('.vcards-table');

    if (storesData.length === 0) {
        if (tbody) tbody.innerHTML = '';
        if (table) table.style.display = 'none';
        if (noData) noData.style.display = 'block';
        return;
    }

    if (table) table.style.display = 'table';
    if (noData) noData.style.display = 'none';

    tbody.innerHTML = storesData.map(s => `
        <tr data-id="${s.id}">
            <td>
                <div class="vcard-cell">
                    <div class="vcard-avatar" style="background: linear-gradient(135deg, #25D366, #128C7E); color: white;">
                        ${s.logo_url ? `<img src="${s.logo_url}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">` : `<i class="fab fa-whatsapp"></i>`}
                    </div>
                    <div class="vcard-info">
                        <h4>${escapeHtml(s.store_name)}</h4>
                        <p><a href="${s.preview_url}" target="_blank" style="color: var(--primary); text-decoration: none;">${s.preview_url}</a>
                        <button class="copy-btn" onclick="copyStoreUrl('${s.preview_url}')" style="margin-left: 5px;" title="Copy URL">
                            <i class="fas fa-copy"></i>
                        </button>
                        </p>
                    </div>
                </div>
            </td>
            <td class="td-center">
                <strong style="color: #25D366;">+${s.whatsapp_number}</strong>
            </td>
            <td class="td-center">
                <span style="background:rgba(37,211,102,0.1);color:#25D366;padding:4px 10px;border-radius:50px;font-size:0.78rem;font-weight:600">
                    <i class="fas fa-shopping-bag"></i> ${s.order_count}
                </span>
            </td>
            <td class="td-center">
                <span style="color:#6b7280;font-size:0.85rem">
                    <i class="fas fa-eye"></i> ${s.view_count.toLocaleString()}
                </span>
            </td>
            <td class="td-center">
                <label class="status-toggle">
                    <input type="checkbox" ${s.status ? 'checked' : ''} onchange="toggleStatus(${s.id}, this.checked)">
                    <span class="toggle-slider"></span>
                </label>
            </td>
            <td class="td-center">
                <button class="action-btn-sm action-view" onclick="window.open('${s.preview_url}', '_blank')" title="View"><i class="fas fa-eye"></i></button>
                <button class="action-btn-sm action-edit" onclick="window.location='whatsapp-stores-edit.html?id=${s.id}'" title="Edit"><i class="fas fa-pen"></i></button>
                <button class="action-btn-sm action-delete" onclick="confirmDelete(${s.id}, '${escapeHtml(s.store_name).replace(/'/g, "\\'")}')" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

async function toggleStatus(id, status) {
    try {
        const response = await fetch(`${STORES_API}toggle-status.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id, status: status ? 1 : 0 })
        });
        const result = await response.json();
        if (result.success) {
            showToast(`Store ${status ? 'activated' : 'deactivated'}`, 'success');
            const store = storesData.find(s => s.id === id);
            if (store) store.status = status;
        } else {
            showToast(result.message, 'error');
            renderStores(); // Revert
        }
    } catch (err) {
        showToast('Failed to toggle status', 'error');
    }
}

function confirmDelete(id, name) {
    deleteTargetId = id;
    if (confirm(`Delete store "${name}"? This will also delete all products and orders. Cannot be undone!`)) {
        deleteStore();
    }
}

async function deleteStore() {
    if (!deleteTargetId) return;
    try {
        const response = await fetch(`${STORES_API}delete.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: deleteTargetId })
        });
        const result = await response.json();
        if (result.success) {
            showToast('Store deleted', 'success');
            loadStores();
        } else {
            showToast(result.message, 'error');
        }
    } catch (err) {
        showToast('Delete failed', 'error');
    } finally {
        deleteTargetId = null;
    }
}

function copyStoreUrl(url) {
    navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard!', 'success');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const title = type === 'success' ? 'Success' : 'Error';
    toast.innerHTML = `<i class="fas ${icon}"></i><div class="toast-content"><p class="toast-title">${title}</p><p class="toast-msg">${message}</p></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
}
