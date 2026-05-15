/* WhatsApp Store Edit Page - Real Backend (Phase 7B) */

const API = '../backend/api/';
let currentStoreId = null;
let currentStore = null;
let categoriesData = [];
let productsData = [];

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id || id === 'new') {
        window.location.href = 'whatsapp-stores-create.html';
        return;
    }

    currentStoreId = parseInt(id);
    document.getElementById('urlPrefix').textContent = window.location.host + '/';
    loadStore();
});

async function loadStore() {
    try {
        const response = await fetch(`${API}stores/get.php?id=${currentStoreId}`, { credentials: 'include' });
        if (response.status === 401) { window.location.href = 'login.html'; return; }

        const result = await response.json();
        if (!result.success) {
            showToast(result.message || 'Failed to load', 'error');
            return;
        }

        currentStore = result.data.store;
        populateForm(currentStore);
        loadCategories();
        loadProducts();
    } catch (err) {
        showToast('Connection error: ' + err.message, 'error');
    }
}

function populateForm(s) {
    document.getElementById('storeTitle').textContent = `Edit ${s.store_name}`;
    document.getElementById('storeNameDisplay').textContent = s.store_name;
    document.getElementById('previewLink').href = s.preview_url;
    document.getElementById('viewCount').textContent = s.view_count.toLocaleString();
    document.getElementById('orderCount').textContent = s.order_count;

    setVal('storeName', s.store_name);
    setVal('urlAlias', s.url_alias);
    setVal('ownerName', s.owner_name);
    setVal('whatsappNumber', s.whatsapp_number);
    setVal('email', s.email);
    setVal('phone', s.phone);
    setVal('tagline', s.tagline);
    setVal('description', s.description);
    setVal('address', s.address);
    setVal('location', s.location);
    setVal('locationUrl', s.location_url);
    setVal('currency', s.currency);
    setVal('currencySymbol', s.currency_symbol);
    setVal('minOrderAmount', s.min_order_amount);
    setVal('deliveryCharge', s.delivery_charge);
    setVal('orderTemplate', s.order_message_template);
    setVal('primaryColor', s.primary_color);
    setVal('secondaryColor', s.secondary_color);

    document.getElementById('codAvailable').checked = !!s.cod_available;
    document.getElementById('showSearch').checked = !!s.show_search;
    document.getElementById('showCategories').checked = !!s.show_categories;
    document.getElementById('showFeatured').checked = !!s.show_featured;

    // Image previews
    if (s.logo_url) document.getElementById('logoPreview').innerHTML = `<img src="${s.logo_url}?t=${Date.now()}">`;
    if (s.cover_url) document.getElementById('coverPreview').innerHTML = `<img src="${s.cover_url}?t=${Date.now()}">`;
    if (s.favicon_url) document.getElementById('faviconPreview').innerHTML = `<img src="${s.favicon_url}?t=${Date.now()}">`;
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== null && val !== undefined) el.value = val;
}

function showTab(name) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('tab-' + name).classList.add('active');
}

// =================== SAVE BASIC INFO ===================
async function saveBasicInfo() {
    const data = {
        id: currentStoreId,
        store_name: document.getElementById('storeName').value,
        url_alias: document.getElementById('urlAlias').value,
        owner_name: document.getElementById('ownerName').value,
        whatsapp_number: document.getElementById('whatsappNumber').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        tagline: document.getElementById('tagline').value,
        description: document.getElementById('description').value,
        address: document.getElementById('address').value,
        location: document.getElementById('location').value,
        location_url: document.getElementById('locationUrl').value,
    };

    if (!data.store_name) { showToast('Store name required', 'error'); return; }
    if (!data.whatsapp_number) { showToast('WhatsApp number required', 'error'); return; }

    await callUpdate(data, 'Basic info');
}

async function saveBranding() {
    await callUpdate({
        id: currentStoreId,
        primary_color: document.getElementById('primaryColor').value,
        secondary_color: document.getElementById('secondaryColor').value,
    }, 'Theme colors');
}

async function saveSettings() {
    await callUpdate({
        id: currentStoreId,
        currency: document.getElementById('currency').value,
        currency_symbol: document.getElementById('currencySymbol').value,
        min_order_amount: parseFloat(document.getElementById('minOrderAmount').value) || 0,
        delivery_charge: parseFloat(document.getElementById('deliveryCharge').value) || 0,
        cod_available: document.getElementById('codAvailable').checked,
        show_search: document.getElementById('showSearch').checked,
        show_categories: document.getElementById('showCategories').checked,
        show_featured: document.getElementById('showFeatured').checked,
        order_message_template: document.getElementById('orderTemplate').value,
    }, 'Settings');
}

async function callUpdate(data, label) {
    try {
        const response = await fetch(`${API}stores/update.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) showToast(`✓ ${label} saved!`, 'success');
        else showToast(result.message, 'error');
    } catch (err) {
        showToast('Save failed: ' + err.message, 'error');
    }
}

// =================== IMAGE UPLOAD ===================
async function uploadStoreImage(type, input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Max 5MB allowed', 'error'); return; }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('store_id', currentStoreId);
    formData.append('type', type);

    const previewEl = document.getElementById(type + 'Preview');
    previewEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const response = await fetch(`${API}store-products/upload-image.php`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            previewEl.innerHTML = `<img src="${result.data.url}?t=${Date.now()}">`;
            showToast(`✓ ${type} uploaded!`, 'success');
        } else {
            previewEl.innerHTML = '<i class="fas fa-image"></i>';
            showToast(result.message, 'error');
        }
    } catch (err) {
        previewEl.innerHTML = '<i class="fas fa-image"></i>';
        showToast('Upload failed', 'error');
    }
    input.value = '';
}

// =================== CATEGORIES ===================
async function loadCategories() {
    const container = document.getElementById('categoriesContainer');
    try {
        const response = await fetch(`${API}store-categories/list.php?store_id=${currentStoreId}`, { credentials: 'include' });
        const result = await response.json();
        if (result.success) {
            categoriesData = result.data.categories;
            renderCategories();
        }
    } catch (err) {
        container.innerHTML = '<p style="color:#ef4444;text-align:center">Failed to load</p>';
    }
}

function renderCategories() {
    const container = document.getElementById('categoriesContainer');
    if (categoriesData.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-folder"></i><p>No categories yet. Add your first category!</p></div>';
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead><tr><th>Name</th><th>Description</th><th class="th-center">Products</th><th class="th-center">Actions</th></tr></thead>
            <tbody>
                ${categoriesData.map(c => `
                    <tr>
                        <td><strong>${escapeHtml(c.name)}</strong></td>
                        <td style="color:#6b7280;font-size:0.85rem">${escapeHtml(c.description || '-').substring(0, 60)}</td>
                        <td class="td-center"><span style="background:#25D366;color:white;padding:2px 10px;border-radius:50px;font-size:0.78rem;font-weight:600">${c.product_count}</span></td>
                        <td class="td-center">
                            <button class="action-btn-sm action-edit" onclick="editCategory(${c.id})"><i class="fas fa-pen"></i></button>
                            <button class="action-btn-sm action-delete" onclick="deleteCategory(${c.id}, '${escapeHtml(c.name).replace(/'/g, "\\'")}')"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

function showCategoryModal(cat = null) {
    const isEdit = cat !== null;
    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal-overlay show" id="catModal" onclick="if(event.target===this)closeCatModal()">
            <div class="modal-box" style="max-width:500px">
                <div class="modal-header">
                    <h3>${isEdit ? '✏️ Edit Category' : '➕ Add Category'}</h3>
                    <button class="modal-close" onclick="closeCatModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Name *</label>
                        <input type="text" id="catName" value="${cat ? escapeHtml(cat.name) : ''}" maxlength="150">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="catDesc" rows="3">${cat ? escapeHtml(cat.description || '') : ''}</textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-modal-cancel" onclick="closeCatModal()">Cancel</button>
                    <button class="btn-modal-confirm" onclick="saveCategory(${cat ? cat.id : 0})"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'}</button>
                </div>
            </div>
        </div>`);
    setTimeout(() => document.getElementById('catName').focus(), 100);
}

function closeCatModal() { document.getElementById('catModal')?.remove(); }

function editCategory(id) {
    const cat = categoriesData.find(c => c.id == id);
    if (cat) showCategoryModal(cat);
}

async function saveCategory(id) {
    const name = document.getElementById('catName').value.trim();
    const desc = document.getElementById('catDesc').value.trim();
    if (!name) { showToast('Name required', 'error'); return; }

    try {
        const response = await fetch(`${API}store-categories/save.php`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
            body: JSON.stringify({ id, store_id: currentStoreId, name, description: desc })
        });
        const result = await response.json();
        if (result.success) {
            showToast(id ? 'Category updated' : 'Category added', 'success');
            closeCatModal();
            loadCategories();
        } else showToast(result.message, 'error');
    } catch (err) { showToast('Save failed', 'error'); }
}

async function deleteCategory(id, name) {
    if (!confirm(`Delete category "${name}"? Products will keep but lose category.`)) return;
    try {
        const response = await fetch(`${API}store-categories/delete.php`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
            body: JSON.stringify({ id, store_id: currentStoreId })
        });
        const result = await response.json();
        if (result.success) { showToast('Deleted', 'success'); loadCategories(); }
        else showToast(result.message, 'error');
    } catch (err) { showToast('Delete failed', 'error'); }
}

// =================== PRODUCTS ===================
async function loadProducts() {
    try {
        const response = await fetch(`${API}store-products/list.php?store_id=${currentStoreId}`, { credentials: 'include' });
        const result = await response.json();
        if (result.success) {
            productsData = result.data.products;
            renderProducts();
        }
    } catch (err) {
        document.getElementById('productsContainer').innerHTML = '<p style="color:#ef4444;text-align:center">Failed to load</p>';
    }
}

function renderProducts() {
    const container = document.getElementById('productsContainer');
    if (productsData.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-box"></i><p>No products yet. Add your first product!</p></div>';
        return;
    }

    const currency = currentStore?.currency_symbol || '₹';

    container.innerHTML = `
        <table class="data-table">
            <thead><tr><th></th><th>Name</th><th>Price</th><th>Category</th><th class="th-center">Actions</th></tr></thead>
            <tbody>
                ${productsData.map(p => {
                    const effPrice = p.discount_price || p.price;
                    return `
                    <tr>
                        <td><div class="item-thumb">${p.image_url ? `<img src="${p.image_url}">` : `<i class="fas fa-image"></i>`}</div></td>
                        <td>
                            <strong>${escapeHtml(p.name)}</strong>
                            ${p.is_featured ? '<span class="featured-badge">Featured</span>' : ''}
                            ${!p.in_stock ? '<span class="out-of-stock-badge">Out of Stock</span>' : ''}
                        </td>
                        <td class="price-cell">
                            <strong>${currency}${effPrice.toFixed(2)}</strong>
                            ${p.discount_price ? `<span class="original">${currency}${p.price.toFixed(2)}</span>` : ''}
                        </td>
                        <td style="color:#6b7280;font-size:0.85rem">${escapeHtml(p.category_name || '-')}</td>
                        <td class="td-center">
                            <label style="cursor:pointer;display:inline-block;margin-right:6px" title="Upload Image">
                                <input type="file" accept="image/*" style="display:none" onchange="uploadProductImage(${p.id}, this)">
                                <span class="action-btn-sm" style="display:inline-flex;align-items:center;justify-content:center"><i class="fas fa-camera"></i></span>
                            </label>
                            <button class="action-btn-sm action-edit" onclick="editProduct(${p.id})"><i class="fas fa-pen"></i></button>
                            <button class="action-btn-sm action-delete" onclick="deleteProduct(${p.id}, '${escapeHtml(p.name).replace(/'/g, "\\'")}')"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>`;
}

function showProductModal(prod = null) {
    const isEdit = prod !== null;
    const currency = currentStore?.currency_symbol || '₹';

    const catOptions = categoriesData.map(c =>
        `<option value="${c.id}" ${prod && prod.category_id == c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`
    ).join('');

    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal-overlay show" id="prodModal" onclick="if(event.target===this)closeProdModal()">
            <div class="modal-box" style="max-width:600px">
                <div class="modal-header">
                    <h3>${isEdit ? '✏️ Edit Product' : '➕ Add Product'}</h3>
                    <button class="modal-close" onclick="closeProdModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Name *</label>
                        <input type="text" id="prodName" value="${prod ? escapeHtml(prod.name) : ''}" maxlength="255">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="prodDesc" rows="3">${prod ? escapeHtml(prod.description || '') : ''}</textarea>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                        <div class="form-group">
                            <label>Price (${currency}) *</label>
                            <input type="number" id="prodPrice" step="0.01" min="0" value="${prod ? prod.price : ''}">
                        </div>
                        <div class="form-group">
                            <label>Discount Price (${currency})</label>
                            <input type="number" id="prodDiscount" step="0.01" min="0" value="${prod && prod.discount_price !== null ? prod.discount_price : ''}" placeholder="Optional">
                        </div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                        <div class="form-group">
                            <label>SKU</label>
                            <input type="text" id="prodSku" value="${prod ? escapeHtml(prod.sku || '') : ''}" placeholder="Optional">
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select id="prodCategory">
                                <option value="">No Category</option>
                                ${catOptions}
                            </select>
                        </div>
                    </div>
                    <div class="checkbox-row">
                        <input type="checkbox" id="prodFeatured" ${prod && prod.is_featured ? 'checked' : ''}>
                        <label for="prodFeatured">Mark as Featured</label>
                    </div>
                    <div class="checkbox-row">
                        <input type="checkbox" id="prodInStock" ${!prod || prod.in_stock ? 'checked' : ''}>
                        <label for="prodInStock">In Stock</label>
                    </div>
                    ${isEdit ? '<p style="font-size:0.85rem;color:#6b7280;margin-top:10px">💡 To upload product image, save first then click camera icon in product list</p>' : ''}
                </div>
                <div class="modal-footer">
                    <button class="btn-modal-cancel" onclick="closeProdModal()">Cancel</button>
                    <button class="btn-modal-confirm" onclick="saveProduct(${prod ? prod.id : 0})"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'}</button>
                </div>
            </div>
        </div>`);
    setTimeout(() => document.getElementById('prodName').focus(), 100);
}

function closeProdModal() { document.getElementById('prodModal')?.remove(); }

function editProduct(id) {
    const prod = productsData.find(p => p.id == id);
    if (prod) showProductModal(prod);
}

async function saveProduct(id) {
    const data = {
        id,
        store_id: currentStoreId,
        name: document.getElementById('prodName').value.trim(),
        description: document.getElementById('prodDesc').value.trim(),
        price: parseFloat(document.getElementById('prodPrice').value) || 0,
        discount_price: document.getElementById('prodDiscount').value || null,
        sku: document.getElementById('prodSku').value.trim(),
        category_id: document.getElementById('prodCategory').value || null,
        is_featured: document.getElementById('prodFeatured').checked,
        in_stock: document.getElementById('prodInStock').checked,
    };

    if (!data.name) { showToast('Name required', 'error'); return; }
    if (data.price < 0) { showToast('Invalid price', 'error'); return; }

    try {
        const response = await fetch(`${API}store-products/save.php`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showToast(id ? 'Product updated' : 'Product added', 'success');
            closeProdModal();
            loadProducts();
        } else showToast(result.message, 'error');
    } catch (err) { showToast('Save failed', 'error'); }
}

async function deleteProduct(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
        const response = await fetch(`${API}store-products/delete.php`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
            body: JSON.stringify({ id, store_id: currentStoreId })
        });
        const result = await response.json();
        if (result.success) { showToast('Deleted', 'success'); loadProducts(); }
        else showToast(result.message, 'error');
    } catch (err) { showToast('Delete failed', 'error'); }
}

async function uploadProductImage(productId, input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Max 5MB', 'error'); return; }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('store_id', currentStoreId);
    formData.append('type', 'product');
    formData.append('target_id', productId);

    showToast('Uploading...', 'success');
    try {
        const response = await fetch(`${API}store-products/upload-image.php`, {
            method: 'POST', credentials: 'include', body: formData
        });
        const result = await response.json();
        if (result.success) {
            showToast('✓ Image uploaded', 'success');
            loadProducts();
        } else showToast(result.message, 'error');
    } catch (err) { showToast('Upload failed', 'error'); }
    input.value = '';
}

// =================== UTILS ===================
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
    toast.innerHTML = `<i class="fas ${icon}"></i><div class="toast-content"><p class="toast-title">${type === 'success' ? 'Success' : 'Error'}</p><p class="toast-msg">${message}</p></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
}
