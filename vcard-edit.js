/* ==========================================
   VCARD EDIT PAGE - JavaScript
   ========================================== */

// ===== TAB SWITCHING =====
document.querySelectorAll('.sub-nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const tab = item.dataset.tab;

        // Update active state
        document.querySelectorAll('.sub-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Show selected tab content
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const target = document.getElementById('tab-' + tab);
        if (target) target.classList.add('active');

        // Scroll to top of content area
        const contentArea = document.querySelector('.edit-content-area');
        if (contentArea) contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Close sub-sidebar on mobile
        if (window.innerWidth <= 991) {
            document.querySelector('.sub-nav').classList.remove('show');
        }
    });
});

// Inner tabs (Basic Details / Personal Details / Other Configurations)
document.querySelectorAll('.inner-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.inner;

        document.querySelectorAll('.inner-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.inner-tab-content').forEach(c => c.classList.remove('active'));
        const targetContent = document.getElementById('inner-' + target);
        if (targetContent) targetContent.classList.add('active');
    });
});

// Toggle sub-sidebar on mobile
function toggleSubSidebar() {
    document.querySelector('.sub-nav').classList.toggle('show');
}

// ===== URL ALIAS & PREVIEW =====
const urlAlias = document.getElementById('urlAlias');
if (urlAlias) {
    urlAlias.addEventListener('input', (e) => {
        let val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        e.target.value = val;
        document.getElementById('urlPreview').textContent = val || 'your-vcard';
    });
}

function regenerateUrl() {
    const adjectives = ['smart', 'pro', 'digital', 'modern', 'creative', 'tech'];
    const nouns = ['card', 'profile', 'connect', 'tap', 'link', 'biz'];
    const random = adjectives[Math.floor(Math.random() * adjectives.length)] + '-' +
                   nouns[Math.floor(Math.random() * nouns.length)] + '-' +
                   Math.floor(Math.random() * 9999);
    document.getElementById('urlAlias').value = random;
    document.getElementById('urlPreview').textContent = random;
    showToast('URL regenerated!', 'success');
}

// ===== RICH TEXT EDITOR =====
function formatText(command, value = null) {
    document.execCommand(command, false, value);
}

function generateAIDescription() {
    const editor = document.getElementById('description');
    const sample = `<p><strong>Welcome to your professional digital profile!</strong></p>
        <p>We are committed to delivering excellence through innovation, quality, and customer-focused solutions. Our team brings years of expertise to help you achieve your business goals.</p>
        <p>📞 Get in touch with us today to discuss how we can help transform your business networking experience.</p>`;

    showToast('Generating AI description...', 'success');
    setTimeout(() => {
        editor.innerHTML = sample;
        showToast('AI description generated!', 'success');
    }, 1500);
}

// ===== IMAGE UPLOAD (Real Backend - Phase 4) =====
function triggerFileInput(id) {
    document.getElementById(id).click();
}

const UPLOAD_API = '../backend/api/uploads/';

document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const id = input.id;
        const typeMap = {
            'coverImage': 'cover',
            'profileImage': 'profile',
            'faviconImage': 'favicon'
        };
        const previewMap = {
            'coverImage': 'coverPreview',
            'profileImage': 'profilePreview',
            'faviconImage': 'faviconPreview'
        };

        const uploadType = typeMap[id];
        const previewId = previewMap[id];

        if (!uploadType) return; // Unknown input

        // Validate file
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image too large. Max 5MB allowed', 'error');
            input.value = '';
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showToast('Invalid format. JPG, PNG, GIF, WebP only', 'error');
            input.value = '';
            return;
        }

        if (!currentVcardId) {
            showToast('Please save vCard basics first', 'error');
            input.value = '';
            return;
        }

        // Show preview immediately (optimistic UI)
        const preview = document.getElementById(previewId);
        const reader = new FileReader();
        reader.onload = (event) => {
            if (preview) {
                preview.innerHTML = `<img src="${event.target.result}" alt="Preview"><div class="upload-overlay"><i class="fas fa-spinner fa-spin"></i> Uploading...</div>`;
            }
        };
        reader.readAsDataURL(file);

        // Upload to backend
        const formData = new FormData();
        formData.append('file', file);
        formData.append('vcard_id', currentVcardId);
        formData.append('type', uploadType);

        try {
            const response = await fetch(UPLOAD_API + 'image.php', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (response.status === 401) {
                window.location.href = 'login.html';
                return;
            }

            const result = await response.json();

            if (result.success) {
                // Update preview with real URL
                if (preview) {
                    preview.innerHTML = `<img src="${result.data.url}?t=${Date.now()}" alt="Preview">`;
                }
                showToast(`✓ ${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} image uploaded!`, 'success');
            } else {
                showToast(result.message || 'Upload failed', 'error');
                // Revert preview
                if (currentVcardData) {
                    revertImagePreview(uploadType, previewId);
                }
            }
        } catch (err) {
            console.error('Upload error:', err);
            showToast('Connection error: ' + err.message, 'error');
            revertImagePreview(uploadType, previewId);
        }

        input.value = ''; // Reset for re-upload of same file
    });
});

function revertImagePreview(type, previewId) {
    const preview = document.getElementById(previewId);
    if (!preview || !currentVcardData) return;

    const fieldMap = {
        'cover': 'cover_image',
        'profile': 'profile_image',
        'favicon': 'favicon_image'
    };
    const field = fieldMap[type];
    const oldImage = currentVcardData[field];

    if (oldImage) {
        const url = oldImage.startsWith('http') ? oldImage : '/' + oldImage;
        preview.innerHTML = `<img src="${url}" alt="Preview">`;
    } else {
        if (type === 'cover') {
            preview.innerHTML = '<div class="cover-placeholder"><i class="fas fa-image"></i><p>Click to upload cover</p></div>';
        } else {
            preview.innerHTML = '<img src="images/tapify-logo-gold.png" alt="Preview">';
        }
    }
}

// Function to delete image (for use later)
async function deleteVcardImage(type, targetId = 0) {
    if (!confirm(`Delete this ${type} image?`)) return false;

    try {
        const response = await fetch(UPLOAD_API + 'delete-image.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                vcard_id: currentVcardId,
                type: type,
                target_id: targetId
            })
        });
        const result = await response.json();
        if (result.success) {
            showToast('Image deleted', 'success');
            return true;
        } else {
            showToast(result.message, 'error');
            return false;
        }
    } catch (err) {
        showToast('Delete failed', 'error');
        return false;
    }
}

// ===== SAVE & DISCARD =====
function saveAndNext(currentTab) {
    // Real save will be triggered by setupSaveButtons() handler
    // This function kept for backward compatibility - just trigger button click
    const btn = document.querySelector('.tab-content.active .btn-save, .inner-tab-content.active .btn-save');
    if (btn) btn.click();
}

function discardChanges() {
    if (confirm('Are you sure you want to discard all changes?')) {
        // Reload data from backend
        if (currentVcardId) {
            loadVcardData(currentVcardId);
        }
        showToast('Changes discarded', 'warning');
    }
}

// Old fake handler removed - real save handlers in setupSaveButtons()

// ===== COLOR PICKER SYNC =====
document.querySelectorAll('.color-input').forEach(group => {
    const picker = group.querySelector('.color-picker');
    const text = group.querySelector('.color-text');

    picker.addEventListener('input', () => {
        text.value = picker.value.toUpperCase();
        updateLivePreview();
    });

    text.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(text.value)) {
            picker.value = text.value;
            updateLivePreview();
        }
    });
});

function updateLivePreview() {
    const pickers = document.querySelectorAll('#tab-dynamic-vcard .color-picker');
    if (pickers.length < 7) return;

    const screen = document.querySelector('.phone-preview-screen');
    const cover = document.querySelector('.preview-cover');
    const avatar = document.querySelector('.preview-avatar');
    const name = document.querySelector('.preview-name');
    const title = document.querySelector('.preview-title');
    const desc = document.querySelector('.preview-desc');

    if (!screen) return;

    // Map color pickers (in order)
    const [primary, bgSecondary, bgColor, btnText, labelText, descText, cardsBg] = Array.from(pickers).map(p => p.value);

    if (screen) screen.style.background = `linear-gradient(180deg, ${bgColor}, ${cardsBg})`;
    if (cover) cover.style.background = `linear-gradient(135deg, ${primary}, ${bgSecondary})`;
    if (name) name.style.color = btnText;
    if (title) title.style.color = labelText;
    if (desc) desc.style.color = descText;
}

// Style buttons
document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Toggle button group (Sticky Button position)
document.querySelectorAll('.btn-group-toggle .btn-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.parentElement.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ===== TEMPLATES (42 Real Templates from tapifyworld.com/vcard-templates) =====
const templates = [
    { id: 'vcard42', name: 'Social Vcard 2', category: 'Social', image: 'https://tapifyworld.com/assets/img/templates/vcard42.png', demoUrl: 'https://tapifyworld.com/vcard42' },
    { id: 'vcard41', name: 'Social Vcard', category: 'Social', image: 'https://tapifyworld.com/assets/img/templates/vcard41.png', demoUrl: 'https://tapifyworld.com/vcard41' },
    { id: 'vcard40', name: 'Bio White', category: 'Biography', image: 'https://tapifyworld.com/assets/img/templates/vcard40.png', demoUrl: 'https://tapifyworld.com/vcard40' },
    { id: 'vcard39', name: 'Bio Black', category: 'Biography', image: 'https://tapifyworld.com/assets/img/templates/vcard39.png', demoUrl: 'https://tapifyworld.com/vcard39' },
    { id: 'vcard38', name: 'Architecture', category: 'Architect', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard38.png', demoUrl: 'https://tapifyworld.com/vcard38' },
    { id: 'vcard37', name: 'Flower Garden', category: 'Florist', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard37.png', demoUrl: 'https://tapifyworld.com/flower-garden' },
    { id: 'vcard36', name: 'Travel Agency', category: 'Travel', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard36.png', demoUrl: 'https://tapifyworld.com/travel-agency' },
    { id: 'vcard35', name: 'Real Estate', category: 'Property', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard35.png', demoUrl: 'https://tapifyworld.com/real-estate' },
    { id: 'vcard34', name: 'Photographer', category: 'Photography', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard34.png', demoUrl: 'https://tapifyworld.com/photographer' },
    { id: 'vcard33', name: 'Musician', category: 'Music', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard33.png', demoUrl: 'https://tapifyworld.com/musician' },
    { id: 'vcard32', name: 'Interior Designer', category: 'Design', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard32.png', demoUrl: 'https://tapifyworld.com/interior-designer' },
    { id: 'vcard31', name: 'Handyman Services', category: 'Services', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard31.png', demoUrl: 'https://tapifyworld.com/handyman' },
    { id: 'vcard30', name: 'Taxi Service', category: 'Transport', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard30.png', demoUrl: 'https://tapifyworld.com/taxi-service-vcard' },
    { id: 'vcard29', name: 'Marriage', category: 'Wedding', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard29.png', demoUrl: 'https://tapifyworld.com/marriage' },
    { id: 'vcard28', name: 'Pet Clinic', category: 'Veterinary', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard28.png', demoUrl: 'https://tapifyworld.com/petclinic' },
    { id: 'vcard27', name: 'Pet Shop', category: 'Pet Store', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard27.png', demoUrl: 'https://tapifyworld.com/petshop' },
    { id: 'vcard26', name: 'Retail E-commerce', category: 'Retail', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard26.png', demoUrl: 'https://tapifyworld.com/retailer' },
    { id: 'vcard25', name: 'Social Services', category: 'NGO', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard25.png', demoUrl: 'https://tapifyworld.com/social-services-template' },
    { id: 'vcard24', name: 'School Templates', category: 'Education', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard24.png', demoUrl: 'https://tapifyworld.com/teacher-template' },
    { id: 'vcard23', name: 'Consulting Services', category: 'Consulting', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard23.png', demoUrl: 'https://tapifyworld.com/consultant' },
    { id: 'vcard22', name: 'Dynamic vCard', category: 'Customizable', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard22.png', demoUrl: 'https://tapifyworld.com/dynamic', featured: true },
    { id: 'vcard21', name: 'Social Media', category: 'Influencer', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard21.png', demoUrl: 'https://tapifyworld.com/social-influencers-vcard' },
    { id: 'vcard20', name: 'Culinary Food Services', category: 'Food', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard20.png', demoUrl: 'https://tapifyworld.com/chef-vcard' },
    { id: 'vcard19', name: 'Fashion Beauty', category: 'Beauty', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard19.png', demoUrl: 'https://tapifyworld.com/artist-makeup' },
    { id: 'vcard18', name: 'CEO/CXO', category: 'Executive', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard18.png', demoUrl: 'https://tapifyworld.com/ceo-vcard' },
    { id: 'vcard17', name: 'Programmer', category: 'Tech', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard17.png', demoUrl: 'https://tapifyworld.com/developer' },
    { id: 'vcard16', name: 'Lawyer', category: 'Legal', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard16.png', demoUrl: 'https://tapifyworld.com/lawyer' },
    { id: 'vcard15', name: 'Salon', category: 'Beauty', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard15.png', demoUrl: 'https://tapifyworld.com/stylish-salon' },
    { id: 'vcard14', name: 'Event Management', category: 'Events', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard14.png', demoUrl: 'https://tapifyworld.com/event-planner' },
    { id: 'vcard13', name: 'Hospital', category: 'Medical', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard13.png', demoUrl: 'https://tapifyworld.com/doctor' },
    { id: 'vcard12', name: 'Gym', category: 'Fitness', image: 'https://tapifyworld.com/assets/img/new_vcard_templates/vcard12.png', demoUrl: 'https://tapifyworld.com/trainer-gym' },
    { id: 'vcard11', name: 'Portfolio', category: 'Personal', image: 'https://tapifyworld.com/assets/img/templates/vcard11.png', demoUrl: 'https://tapifyworld.com/portfolio' },
    { id: 'vcard10', name: 'Pro Network', category: 'Professional', image: 'https://tapifyworld.com/assets/img/templates/vcard10.png', demoUrl: 'https://tapifyworld.com/pro-network-vcard' },
    { id: 'vcard9', name: 'Corporate Identity', category: 'Corporate', image: 'https://tapifyworld.com/assets/img/templates/vcard9.png', demoUrl: 'https://tapifyworld.com/corporate-identity-vcard' },
    { id: 'vcard8', name: 'Corporate Classic', category: 'Corporate', image: 'https://tapifyworld.com/assets/img/templates/vcard8.png', demoUrl: 'https://tapifyworld.com/corporate-classic-vcard' },
    { id: 'vcard7', name: 'Business Beacon', category: 'Marketing', image: 'https://tapifyworld.com/assets/img/templates/vcard7.png', demoUrl: 'https://tapifyworld.com/digital-marketing' },
    { id: 'vcard6', name: 'Modern Edge', category: 'Modern', image: 'https://tapifyworld.com/assets/img/templates/vcard6.png', demoUrl: 'https://tapifyworld.com/modern-edge' },
    { id: 'vcard5', name: 'Corporate Connect', category: 'Corporate', image: 'https://tapifyworld.com/assets/img/templates/vcard5.png', demoUrl: 'https://tapifyworld.com/cor-connect' },
    { id: 'vcard4', name: 'Professional', category: 'Professional', image: 'https://tapifyworld.com/assets/img/templates/vcard4.png', demoUrl: 'https://tapifyworld.com/professional' },
    { id: 'vcard3', name: 'Clean Canvas', category: 'Minimal', image: 'https://tapifyworld.com/assets/img/templates/vcard3.png', demoUrl: 'https://tapifyworld.com/Clean-Canvas' },
    { id: 'vcard2', name: 'Executive Profile', category: 'Executive', image: 'https://tapifyworld.com/assets/img/templates/vcard2.png', demoUrl: 'https://tapifyworld.com/vcard2' },
    { id: 'vcard1', name: 'Simple Contact', category: 'Basic', image: 'https://tapifyworld.com/assets/img/templates/vcard1.png', demoUrl: 'https://tapifyworld.com/vcard1' }
];

function renderTemplates() {
    const grid = document.getElementById('templatesGrid');
    if (!grid) return;

    grid.innerHTML = templates.map((t, i) => `
        <div class="template-card ${i === 0 ? 'selected' : ''}" data-template="${i}" onclick="selectTemplate(${i})">
            <div class="template-preview-img">
                <img src="${t.image}" alt="${t.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'template-fallback\\'>${t.name}</div>'">
                ${t.featured ? '<span class="template-badge">★ Featured</span>' : ''}
                <a href="${t.demoUrl}" target="_blank" class="template-demo-btn" onclick="event.stopPropagation()">
                    <i class="fas fa-eye"></i> View Demo
                </a>
            </div>
            <div class="template-info">
                <h5>${t.name}</h5>
                <span>${t.category}</span>
            </div>
        </div>
    `).join('');
}

function selectTemplate(idx) {
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.template-card[data-template="${idx}"]`).classList.add('selected');
    showToast(`"${templates[idx].name}" template selected`, 'success');
}

// Template search functionality
function setupTemplateSearch() {
    const search = document.getElementById('templateSearch');
    if (!search) return;

    search.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.template-card');
        let visibleCount = 0;

        cards.forEach((card, i) => {
            const t = templates[i];
            const matches = !q ||
                t.name.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q) ||
                t.id.toLowerCase().includes(q);

            card.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
        });

        const counter = document.getElementById('templateCount');
        if (counter) {
            counter.textContent = q ? `${visibleCount} found` : `${templates.length} Templates`;
        }
    });
}

// ===== BUSINESS HOURS =====
const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const defaultHours = {
    MONDAY: { open: true, from: '10:30 AM', to: '07:30 PM' },
    TUESDAY: { open: true, from: '10:30 AM', to: '07:30 PM' },
    WEDNESDAY: { open: true, from: '12:00 AM', to: '07:30 PM' },
    THURSDAY: { open: true, from: '10:30 AM', to: '07:30 PM' },
    FRIDAY: { open: true, from: '10:30 AM', to: '07:30 PM' },
    SATURDAY: { open: true, from: '10:30 AM', to: '07:30 PM' },
    SUNDAY: { open: false, from: '', to: '' }
};

function generateTimeOptions() {
    const times = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
            const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
            const ampm = h < 12 ? 'AM' : 'PM';
            const minStr = m.toString().padStart(2, '0');
            times.push(`${hour12.toString().padStart(2, '0')}:${minStr} ${ampm}`);
        }
    }
    return times;
}

function renderBusinessHours() {
    const list = document.getElementById('businessHoursList');
    if (!list) return;

    const timeOptions = generateTimeOptions();
    const timeSelectHTML = (selected) => timeOptions.map(t =>
        `<option value="${t}" ${t === selected ? 'selected' : ''}>${t}</option>`
    ).join('');

    list.innerHTML = days.map(day => {
        const data = defaultHours[day];
        return `
            <div class="day-row ${!data.open ? 'closed' : ''}" data-day="${day}">
                <div class="day-toggle">
                    <label class="status-toggle">
                        <input type="checkbox" ${data.open ? 'checked' : ''} onchange="toggleDay('${day}')">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="day-name">${day}</span>
                </div>
                <div class="time-input-group">
                    ${data.open ? `
                        <span class="from-to-label">From</span>
                        <select class="time-select">${timeSelectHTML(data.from)}</select>
                        <span class="from-to-label">To</span>
                        <select class="time-select">${timeSelectHTML(data.to)}</select>
                    ` : `
                        <span class="closed-label"><i class="fas fa-times"></i> Closed</span>
                    `}
                </div>
                <div></div>
            </div>
        `;
    }).join('');
}

function toggleDay(day) {
    defaultHours[day].open = !defaultHours[day].open;
    renderBusinessHours();
}

// ===== APPOINTMENTS =====
const appointmentDays = {
    MONDAY: { open: true, slots: [{ from: '10:00 AM', to: '06:00 PM' }] },
    TUESDAY: { open: true, slots: [{ from: '10:00 AM', to: '06:00 PM' }] },
    WEDNESDAY: { open: true, slots: [{ from: '10:00 AM', to: '06:00 PM' }] },
    THURSDAY: { open: true, slots: [{ from: '10:00 AM', to: '06:00 PM' }] },
    FRIDAY: { open: true, slots: [
        { from: '10:00 AM', to: '12:15 PM' },
        { from: '01:00 PM', to: '03:00 PM' },
        { from: '04:00 PM', to: '07:30 PM' }
    ]},
    SATURDAY: { open: true, slots: [{ from: '10:00 AM', to: '02:00 PM' }] },
    SUNDAY: { open: false, slots: [{ from: '12:00 AM', to: '12:15 AM' }] }
};

function renderAppointments() {
    const container = document.getElementById('appointmentDays');
    if (!container) return;

    const timeOptions = generateTimeOptions();
    const timeSelectHTML = (selected) => timeOptions.map(t =>
        `<option value="${t}" ${t === selected ? 'selected' : ''}>${t}</option>`
    ).join('');

    container.innerHTML = days.map(day => {
        const data = appointmentDays[day];
        const slotsHTML = data.slots.map((slot, i) => `
            <div class="time-input-group" style="margin-bottom: 8px;">
                <span class="from-to-label">From</span>
                <select class="time-select">${timeSelectHTML(slot.from)}</select>
                <span class="from-to-label">To</span>
                <select class="time-select">${timeSelectHTML(slot.to)}</select>
                <button class="btn-icon-action" onclick="removeAppointmentSlot('${day}', ${i})" title="Remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        return `
            <div class="day-row ${!data.open ? 'closed' : ''}" style="grid-template-columns: 130px 1fr auto;">
                <div class="day-toggle">
                    <label class="status-toggle">
                        <input type="checkbox" ${data.open ? 'checked' : ''} onchange="toggleAppointmentDay('${day}')">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="day-name">${day}</span>
                </div>
                <div>${slotsHTML}</div>
                <div>
                    <button class="btn-icon-action btn-add-icon" onclick="addAppointmentSlot('${day}')" title="Add Slot">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn-icon-action btn-add-icon" title="Copy">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function toggleAppointmentDay(day) {
    appointmentDays[day].open = !appointmentDays[day].open;
    renderAppointments();
}

function addAppointmentSlot(day) {
    appointmentDays[day].slots.push({ from: '10:00 AM', to: '06:00 PM' });
    renderAppointments();
}

function removeAppointmentSlot(day, idx) {
    if (appointmentDays[day].slots.length > 1) {
        appointmentDays[day].slots.splice(idx, 1);
        renderAppointments();
    } else {
        showToast('At least one slot is required', 'warning');
    }
}

// ===== SERVICES / PRODUCTS / etc. (sample data) =====
const sampleServices = [
    { name: 'Premium QR & NFC Review Standee', url: 'https://wa.link/fibnre' },
    { name: 'Premium NFC Business Card', url: 'https://wa.link/dkvhlv' },
    { name: 'AI Smart NFC Google Review Card', url: 'https://wa.link/kt5xet' },
    { name: 'Smart NFC Keychain', url: 'https://wa.link/3iuhte' },
    { name: 'Smart NFC Tags', url: 'https://wa.link/gkgg3b' },
    { name: 'Tapify NFC Kit', url: 'https://wa.link/q33dol' },
    { name: 'Tapify Mini Website', url: 'https://wa.link/mwt4kn' }
];

const sampleProducts = [
    { name: 'Tapify Mini Website', url: 'https://wa.link/mwt4kn', price: '₹10,000' },
    { name: 'Tapify NFC Kit', url: 'https://wa.link/q33dol', price: '₹15,000' },
    { name: 'Smart NFC Tags', url: 'https://wa.link/gkgg3b', price: '₹300' },
    { name: 'Smart NFC Keychain', url: 'https://wa.link/3iuhte', price: '₹1,000' },
    { name: 'AI Smart NFC Google Review Card', url: 'https://wa.link/kt5xet', price: '₹2,000' },
    { name: 'Premium NFC Business Card', url: 'https://wa.link/dkvhlv', price: '₹1,000' },
    { name: 'Premium QR & NFC Review Standee', url: 'https://wa.link/fibnre', price: '₹2,000' }
];

const sampleBlogs = [
    { title: 'NFC आधारित डिजिटल बिजनेस कार्ड Tapify कैसे पारंपरिक विजिटिंग कार्ड की जगह ले रहे हैं' },
    { title: 'How NFC-Based Digital Business Cards Like Tapify Are Replacing Traditional Visiting Cards' },
    { title: 'How NFC & Smart QR Technology is Transforming Modern Business Networking' }
];

const sampleTestimonials = [
    { name: 'Neha R.', desc: 'Excellent product and quick service.' },
    { name: 'Anil M.', desc: 'Very innovative concept, loved it.' },
    { name: 'Priya K.', desc: 'Perfect for modern networking!' },
    { name: 'Rahul S.', desc: 'Highly recommended for businesses.' }
];

const sampleCustomLinks = [
    { name: 'Review Us', url: 'https://share.google/PShuhYDESwb6SwjtP', button: true, newTab: true },
    { name: 'Find Us', url: 'https://share.google/PShuhYDESwb6SwjtP', button: true, newTab: true },
    { name: 'Enquiry on WhatsApp', url: 'https://wa.link/f482d6', button: true, newTab: true }
];

const sampleInstaEmbed = [
    { type: 'Post', tag: '<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DT...">' },
    { type: 'Reel', tag: '<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/...">' },
    { type: 'Post', tag: '<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/...">' },
    { type: 'Reel', tag: '<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/...">' }
];

const sampleGalleries = [
    { type: 'Image', link: 'https://tapifyworld.com/uploads/vcards/gallery/1373/untitled-design-(1).png' },
    { type: 'Image', link: 'https://tapifyworld.com/uploads/vcards/gallery/1364/4422952056064...' },
    { type: 'Image', link: 'https://tapifyworld.com/uploads/vcards/gallery/1363/4917528013...' },
    { type: 'Image', link: 'https://tapifyworld.com/uploads/vcards/gallery/1362/4923054_...' },
    { type: 'Image', link: 'https://tapifyworld.com/uploads/vcards/gallery/1361/4913544...' },
    { type: 'Image', link: 'https://tapifyworld.com/uploads/vcards/gallery/1360/4910902...' }
];

const sampleIframes = [
    { url: 'https://youtu.be/H6vY2lVYk9c?si=clSg5X3i2lZr6chA' }
];

const socialPlatforms = [
    { name: 'Website', icon: 'fa-globe', color: '#8338ec', value: 'https://tapifyworld.com/tapify' },
    { name: 'Twitter', icon: 'fa-twitter', color: '#1DA1F2', value: '' },
    { name: 'Facebook', icon: 'fa-facebook-f', color: '#1877F2', value: 'https://www.facebook.com/share/16vsgFHRBE/' },
    { name: 'Instagram', icon: 'fa-instagram', color: '#E4405F', value: 'https://www.instagram.com/tapifyofficial' },
    { name: 'Reddit', icon: 'fa-reddit', color: '#FF4500', value: '' },
    { name: 'Tumblr', icon: 'fa-tumblr', color: '#36465D', value: '' },
    { name: 'Youtube', icon: 'fa-youtube', color: '#FF0000', value: '' },
    { name: 'LinkedIn', icon: 'fa-linkedin-in', color: '#0077B5', value: '' },
    { name: 'WhatsApp', icon: 'fa-whatsapp', color: '#25D366', value: 'https://wa.link/q33dol' },
    { name: 'Pinterest', icon: 'fa-pinterest-p', color: '#E60023', value: '' },
    { name: 'TikTok', icon: 'fa-tiktok', color: '#000000', value: '' },
    { name: 'Snapchat', icon: 'fa-snapchat-ghost', color: '#FFFC00', value: '' }
];

// ===== SERVICES (Real Backend) =====
let servicesData = [];

async function renderServicesTable() {
    const tbody = document.getElementById('servicesTableBody');
    if (!tbody) return;

    if (!currentVcardId) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:30px;color:var(--text-gray)">Save vCard first to add services</td></tr>';
        return;
    }

    try {
        const response = await fetch(`../backend/api/services/list.php?vcard_id=${currentVcardId}`, {
            credentials: 'include'
        });
        const result = await response.json();

        if (result.success) {
            servicesData = result.data.services;

            if (servicesData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:30px;color:var(--text-gray)"><i class="fas fa-briefcase" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:10px;"></i>No services yet. Click "+ Add Service" to add one.</td></tr>';
                return;
            }

            tbody.innerHTML = servicesData.map(s => `
                <tr data-id="${s.id}">
                    <td><div class="item-icon">${escapeHtml(s.name).charAt(0)}</div></td>
                    <td>${escapeHtml(s.name)}</td>
                    <td>${s.service_url ? `<a href="${escapeHtml(s.service_url)}" target="_blank" style="color: var(--primary); text-decoration: none;">${escapeHtml(s.service_url)}</a>` : '<span style="color:#999">No URL</span>'}</td>
                    <td class="td-center">
                        <button class="action-btn-sm action-edit" onclick="editService(${s.id})" title="Edit"><i class="fas fa-pen"></i></button>
                        <button class="action-btn-sm action-delete" onclick="deleteService(${s.id}, '${escapeHtml(s.name).replace(/'/g, "\\'")}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:30px;color:#ef4444">${escapeHtml(result.message)}</td></tr>`;
        }
    } catch (err) {
        console.error('Services load error:', err);
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:30px;color:#ef4444">Failed to load services</td></tr>';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showAddService() {
    if (!currentVcardId) {
        showToast('Please save vCard basics first', 'error');
        return;
    }
    showServiceModal();
}

function editService(id) {
    const service = servicesData.find(s => s.id == id);
    if (service) showServiceModal(service);
}

function showServiceModal(service = null) {
    const isEdit = service !== null;

    const modalHtml = `
        <div class="modal-overlay show" id="serviceModal" onclick="if(event.target===this)closeServiceModal()">
            <div class="modal-box" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>${isEdit ? '✏️ Edit Service' : '➕ Add Service'}</h3>
                    <button class="modal-close" onclick="closeServiceModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Service Name <span style="color:#ef4444">*</span></label>
                        <input type="text" id="srvName" value="${service ? escapeHtml(service.name) : ''}" placeholder="e.g., Web Design, Consulting" maxlength="200">
                    </div>
                    <div class="form-group">
                        <label>Service URL (optional)</label>
                        <input type="url" id="srvUrl" value="${service ? escapeHtml(service.service_url || '') : ''}" placeholder="https://example.com">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-modal-cancel" onclick="closeServiceModal()">Cancel</button>
                    <button class="btn-modal-confirm" onclick="saveService(${service ? service.id : 0})">
                        <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Service
                    </button>
                </div>
            </div>
        </div>
    `;

    const old = document.getElementById('serviceModal');
    if (old) old.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    setTimeout(() => document.getElementById('srvName')?.focus(), 100);
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) modal.remove();
}

async function saveService(id) {
    const name = document.getElementById('srvName').value.trim();
    const url = document.getElementById('srvUrl').value.trim();

    if (!name) {
        showToast('Service name is required', 'error');
        return;
    }

    try {
        const response = await fetch('../backend/api/services/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                id: id || 0,
                vcard_id: currentVcardId,
                name: name,
                service_url: url
            })
        });
        const result = await response.json();

        if (result.success) {
            showToast(id ? 'Service updated!' : 'Service added!', 'success');
            closeServiceModal();
            renderServicesTable();
        } else {
            showToast(result.message, 'error');
        }
    } catch (err) {
        showToast('Failed to save', 'error');
    }
}

async function deleteService(id, name) {
    if (!confirm(`Delete service "${name}"?`)) return;

    try {
        const response = await fetch('../backend/api/services/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: id, vcard_id: currentVcardId })
        });
        const result = await response.json();

        if (result.success) {
            showToast('Service deleted', 'success');
            renderServicesTable();
        } else {
            showToast(result.message, 'error');
        }
    } catch (err) {
        showToast('Delete failed', 'error');
    }
}

// ===== PRODUCTS (Real Backend) =====
let productsData = [];

async function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (!currentVcardId) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--text-gray)">Save vCard first to add products</td></tr>';
        return;
    }

    try {
        const response = await fetch(`../backend/api/products/list.php?vcard_id=${currentVcardId}`, {
            credentials: 'include'
        });
        const result = await response.json();

        if (result.success) {
            productsData = result.data.products;

            if (productsData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--text-gray)"><i class="fas fa-box" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:10px;"></i>No products yet. Click "+ Add Product" to add one.</td></tr>';
                return;
            }

            tbody.innerHTML = productsData.map(p => {
                const priceText = p.price !== null ? `${p.currency || 'INR'} ${p.price}` : '-';
                return `
                    <tr data-id="${p.id}">
                        <td><div class="item-icon">${escapeHtml(p.name).charAt(0)}</div></td>
                        <td>${escapeHtml(p.name)}</td>
                        <td>${p.product_url ? `<a href="${escapeHtml(p.product_url)}" target="_blank" style="color: var(--primary); text-decoration: none;">${escapeHtml(p.product_url.substring(0, 40))}${p.product_url.length > 40 ? '...' : ''}</a>` : '<span style="color:#999">No URL</span>'}</td>
                        <td class="td-center"><strong>${priceText}</strong></td>
                        <td class="td-center">
                            <button class="action-btn-sm action-edit" onclick="editProduct(${p.id})" title="Edit"><i class="fas fa-pen"></i></button>
                            <button class="action-btn-sm action-delete" onclick="deleteProduct(${p.id}, '${escapeHtml(p.name).replace(/'/g, "\\'")}')" title="Delete"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            }).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:#ef4444">${escapeHtml(result.message)}</td></tr>`;
        }
    } catch (err) {
        console.error('Products load error:', err);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:30px;color:#ef4444">Failed to load products</td></tr>';
    }
}

function showAddProduct() {
    if (!currentVcardId) {
        showToast('Please save vCard basics first', 'error');
        return;
    }
    showProductModal();
}

function editProduct(id) {
    const product = productsData.find(p => p.id == id);
    if (product) showProductModal(product);
}

function showProductModal(product = null) {
    const isEdit = product !== null;

    const modalHtml = `
        <div class="modal-overlay show" id="productModal" onclick="if(event.target===this)closeProductModal()">
            <div class="modal-box" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>${isEdit ? '✏️ Edit Product' : '➕ Add Product'}</h3>
                    <button class="modal-close" onclick="closeProductModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Product Name <span style="color:#ef4444">*</span></label>
                        <input type="text" id="prdName" value="${product ? escapeHtml(product.name) : ''}" placeholder="e.g., Tapify NFC Card" maxlength="200">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="prdDesc" rows="3" placeholder="Brief description...">${product ? escapeHtml(product.description || '') : ''}</textarea>
                    </div>
                    <div style="display:grid; grid-template-columns: 100px 1fr; gap: 12px;">
                        <div class="form-group">
                            <label>Currency</label>
                            <select id="prdCurrency">
                                <option value="INR" ${product && product.currency === 'INR' ? 'selected' : ''}>INR ₹</option>
                                <option value="USD" ${product && product.currency === 'USD' ? 'selected' : ''}>USD $</option>
                                <option value="EUR" ${product && product.currency === 'EUR' ? 'selected' : ''}>EUR €</option>
                                <option value="GBP" ${product && product.currency === 'GBP' ? 'selected' : ''}>GBP £</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Price</label>
                            <input type="number" id="prdPrice" step="0.01" min="0" value="${product && product.price !== null ? product.price : ''}" placeholder="999.00">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Product URL (optional)</label>
                        <input type="url" id="prdUrl" value="${product ? escapeHtml(product.product_url || '') : ''}" placeholder="https://example.com/product">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-modal-cancel" onclick="closeProductModal()">Cancel</button>
                    <button class="btn-modal-confirm" onclick="saveProduct(${product ? product.id : 0})">
                        <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Product
                    </button>
                </div>
            </div>
        </div>
    `;

    const old = document.getElementById('productModal');
    if (old) old.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    setTimeout(() => document.getElementById('prdName')?.focus(), 100);
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.remove();
}

async function saveProduct(id) {
    const name = document.getElementById('prdName').value.trim();
    const desc = document.getElementById('prdDesc').value.trim();
    const currency = document.getElementById('prdCurrency').value;
    const price = document.getElementById('prdPrice').value;
    const url = document.getElementById('prdUrl').value.trim();

    if (!name) {
        showToast('Product name is required', 'error');
        return;
    }

    try {
        const response = await fetch('../backend/api/products/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                id: id || 0,
                vcard_id: currentVcardId,
                name: name,
                description: desc,
                currency: currency,
                price: price,
                product_url: url
            })
        });
        const result = await response.json();

        if (result.success) {
            showToast(id ? 'Product updated!' : 'Product added!', 'success');
            closeProductModal();
            renderProductsTable();
        } else {
            showToast(result.message, 'error');
        }
    } catch (err) {
        showToast('Failed to save', 'error');
    }
}

async function deleteProduct(id, name) {
    if (!confirm(`Delete product "${name}"?`)) return;

    try {
        const response = await fetch('../backend/api/products/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: id, vcard_id: currentVcardId })
        });
        const result = await response.json();

        if (result.success) {
            showToast('Product deleted', 'success');
            renderProductsTable();
        } else {
            showToast(result.message, 'error');
        }
    } catch (err) {
        showToast('Delete failed', 'error');
    }
}

// ===== BLOGS (Real Backend) =====
let blogsData = [];

async function renderBlogsTable() {
    const tbody = document.getElementById('blogsTableBody');
    if (!tbody) return;

    if (!currentVcardId) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:30px;color:var(--text-gray)">Save vCard first to add blogs</td></tr>';
        return;
    }

    try {
        const response = await fetch(`../backend/api/blogs/list.php?vcard_id=${currentVcardId}`, { credentials: 'include' });
        const result = await response.json();

        if (result.success) {
            blogsData = result.data.blogs;
            if (blogsData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:30px;color:var(--text-gray)"><i class="fas fa-blog" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:10px;"></i>No blogs yet. Click "+ Add Blog"</td></tr>';
                return;
            }

            tbody.innerHTML = blogsData.map(b => `
                <tr data-id="${b.id}">
                    <td><div class="item-icon">B</div></td>
                    <td>${escapeHtml(b.title)}</td>
                    <td class="td-center">
                        <button class="action-btn-sm action-edit" onclick="editBlog(${b.id})"><i class="fas fa-pen"></i></button>
                        <button class="action-btn-sm action-delete" onclick="deleteBlog(${b.id}, '${escapeHtml(b.title).replace(/'/g, "\\'")}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="3" style="color:#ef4444;text-align:center;padding:20px">${escapeHtml(result.message)}</td></tr>`;
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="3" style="color:#ef4444;text-align:center;padding:20px">Failed to load blogs</td></tr>';
    }
}

function showAddBlog() {
    if (!currentVcardId) { showToast('Save vCard basics first', 'error'); return; }
    showBlogModal();
}

function editBlog(id) {
    const blog = blogsData.find(b => b.id == id);
    if (blog) showBlogModal(blog);
}

function showBlogModal(blog = null) {
    const isEdit = blog !== null;
    const html = `
        <div class="modal-overlay show" id="blogModal" onclick="if(event.target===this)closeBlogModal()">
            <div class="modal-box" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>${isEdit ? '✏️ Edit Blog' : '➕ Add Blog'}</h3>
                    <button class="modal-close" onclick="closeBlogModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Blog Title <span style="color:#ef4444">*</span></label>
                        <input type="text" id="blogTitle" value="${blog ? escapeHtml(blog.title) : ''}" maxlength="255">
                    </div>
                    <div class="form-group">
                        <label>Content</label>
                        <textarea id="blogContent" rows="6" placeholder="Write your blog content...">${blog ? escapeHtml(blog.content || '') : ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Published Date</label>
                        <input type="date" id="blogDate" value="${blog ? blog.published_date || '' : ''}">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-modal-cancel" onclick="closeBlogModal()">Cancel</button>
                    <button class="btn-modal-confirm" onclick="saveBlog(${blog ? blog.id : 0})"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Blog</button>
                </div>
            </div>
        </div>`;
    const old = document.getElementById('blogModal');
    if (old) old.remove();
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(() => document.getElementById('blogTitle')?.focus(), 100);
}

function closeBlogModal() {
    const m = document.getElementById('blogModal'); if (m) m.remove();
}

async function saveBlog(id) {
    const title = document.getElementById('blogTitle').value.trim();
    const content = document.getElementById('blogContent').value.trim();
    const date = document.getElementById('blogDate').value;

    if (!title) { showToast('Title is required', 'error'); return; }

    try {
        const response = await fetch('../backend/api/blogs/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: id || 0, vcard_id: currentVcardId, title, content, published_date: date })
        });
        const result = await response.json();
        if (result.success) {
            showToast(id ? 'Blog updated!' : 'Blog added!', 'success');
            closeBlogModal();
            renderBlogsTable();
        } else showToast(result.message, 'error');
    } catch (err) { showToast('Save failed', 'error'); }
}

async function deleteBlog(id, title) {
    if (!confirm(`Delete blog "${title}"?`)) return;
    try {
        const response = await fetch('../backend/api/blogs/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id, vcard_id: currentVcardId })
        });
        const result = await response.json();
        if (result.success) { showToast('Blog deleted', 'success'); renderBlogsTable(); }
        else showToast(result.message, 'error');
    } catch (err) { showToast('Delete failed', 'error'); }
}

// ===== TESTIMONIALS (Real Backend) =====
let testimonialsData = [];

async function renderTestimonialsTable() {
    const tbody = document.getElementById('testimonialsTableBody');
    if (!tbody) return;

    if (!currentVcardId) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:30px;color:var(--text-gray)">Save vCard first</td></tr>';
        return;
    }

    try {
        const response = await fetch(`../backend/api/testimonials/list.php?vcard_id=${currentVcardId}`, { credentials: 'include' });
        const result = await response.json();

        if (result.success) {
            testimonialsData = result.data.testimonials;
            if (testimonialsData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:30px;color:var(--text-gray)"><i class="fas fa-quote-left" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:10px;"></i>No testimonials yet</td></tr>';
                return;
            }

            tbody.innerHTML = testimonialsData.map(t => {
                const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
                return `
                    <tr data-id="${t.id}">
                        <td><div class="item-icon">${escapeHtml(t.name).charAt(0)}</div></td>
                        <td>
                            <strong>${escapeHtml(t.name)}</strong> <span style="color:#FFD700; font-size:0.85rem;">${stars}</span><br>
                            <small style="color:var(--text-gray)">${escapeHtml(t.designation || '')} ${t.company ? '@ ' + escapeHtml(t.company) : ''}</small>
                        </td>
                        <td class="td-center">
                            <button class="action-btn-sm action-edit" onclick="editTestimonial(${t.id})"><i class="fas fa-pen"></i></button>
                            <button class="action-btn-sm action-delete" onclick="deleteTestimonial(${t.id}, '${escapeHtml(t.name).replace(/'/g, "\\'")}')"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="3" style="color:#ef4444;text-align:center;padding:20px">Failed to load</td></tr>';
    }
}

function showAddTestimonial() {
    if (!currentVcardId) { showToast('Save vCard basics first', 'error'); return; }
    showTestimonialModal();
}

function editTestimonial(id) {
    const t = testimonialsData.find(x => x.id == id);
    if (t) showTestimonialModal(t);
}

function showTestimonialModal(t = null) {
    const isEdit = t !== null;
    const rating = t ? t.rating : 5;
    const html = `
        <div class="modal-overlay show" id="testimonialModal" onclick="if(event.target===this)closeTestimonialModal()">
            <div class="modal-box" style="max-width: 550px;">
                <div class="modal-header">
                    <h3>${isEdit ? '✏️ Edit Testimonial' : '➕ Add Testimonial'}</h3>
                    <button class="modal-close" onclick="closeTestimonialModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Customer Name <span style="color:#ef4444">*</span></label>
                        <input type="text" id="testName" value="${t ? escapeHtml(t.name) : ''}" maxlength="150">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group">
                            <label>Designation</label>
                            <input type="text" id="testDesignation" value="${t ? escapeHtml(t.designation || '') : ''}" placeholder="e.g., CEO">
                        </div>
                        <div class="form-group">
                            <label>Company</label>
                            <input type="text" id="testCompany" value="${t ? escapeHtml(t.company || '') : ''}" placeholder="e.g., ABC Corp">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Rating</label>
                        <select id="testRating">
                            <option value="5" ${rating == 5 ? 'selected' : ''}>★★★★★ (5 - Excellent)</option>
                            <option value="4" ${rating == 4 ? 'selected' : ''}>★★★★☆ (4 - Good)</option>
                            <option value="3" ${rating == 3 ? 'selected' : ''}>★★★☆☆ (3 - Average)</option>
                            <option value="2" ${rating == 2 ? 'selected' : ''}>★★☆☆☆ (2 - Below Average)</option>
                            <option value="1" ${rating == 1 ? 'selected' : ''}>★☆☆☆☆ (1 - Poor)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Testimonial Message <span style="color:#ef4444">*</span></label>
                        <textarea id="testMessage" rows="4" placeholder="What they said about your service...">${t ? escapeHtml(t.message || '') : ''}</textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-modal-cancel" onclick="closeTestimonialModal()">Cancel</button>
                    <button class="btn-modal-confirm" onclick="saveTestimonial(${t ? t.id : 0})"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'}</button>
                </div>
            </div>
        </div>`;
    const old = document.getElementById('testimonialModal');
    if (old) old.remove();
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(() => document.getElementById('testName')?.focus(), 100);
}

function closeTestimonialModal() {
    const m = document.getElementById('testimonialModal'); if (m) m.remove();
}

async function saveTestimonial(id) {
    const name = document.getElementById('testName').value.trim();
    const designation = document.getElementById('testDesignation').value.trim();
    const company = document.getElementById('testCompany').value.trim();
    const rating = parseInt(document.getElementById('testRating').value);
    const message = document.getElementById('testMessage').value.trim();

    if (!name || !message) { showToast('Name and message required', 'error'); return; }

    try {
        const response = await fetch('../backend/api/testimonials/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: id || 0, vcard_id: currentVcardId, name, designation, company, rating, message })
        });
        const result = await response.json();
        if (result.success) {
            showToast(id ? 'Testimonial updated!' : 'Testimonial added!', 'success');
            closeTestimonialModal();
            renderTestimonialsTable();
        } else showToast(result.message, 'error');
    } catch (err) { showToast('Save failed', 'error'); }
}

async function deleteTestimonial(id, name) {
    if (!confirm(`Delete testimonial from "${name}"?`)) return;
    try {
        const response = await fetch('../backend/api/testimonials/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id, vcard_id: currentVcardId })
        });
        const result = await response.json();
        if (result.success) { showToast('Deleted', 'success'); renderTestimonialsTable(); }
        else showToast(result.message, 'error');
    } catch (err) { showToast('Delete failed', 'error'); }
}

// ===== CUSTOM LINKS (Real Backend) =====
let customLinksData = [];

async function renderCustomLinksTable() {
    const tbody = document.getElementById('customLinksTableBody');
    if (!tbody) return;

    if (!currentVcardId) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--text-gray)">Save vCard first</td></tr>';
        return;
    }

    try {
        const response = await fetch(`../backend/api/custom-links/list.php?vcard_id=${currentVcardId}`, { credentials: 'include' });
        const result = await response.json();

        if (result.success) {
            customLinksData = result.data.links;
            if (customLinksData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--text-gray)"><i class="fas fa-link" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:10px;"></i>No custom links yet</td></tr>';
                return;
            }

            tbody.innerHTML = customLinksData.map(l => `
                <tr data-id="${l.id}">
                    <td><strong>${escapeHtml(l.label)}</strong></td>
                    <td><a href="${escapeHtml(l.url)}" target="_blank" style="color: var(--primary); text-decoration: none;">${escapeHtml(l.url.length > 50 ? l.url.substring(0, 50) + '...' : l.url)}</a></td>
                    <td class="td-center"><i class="fas ${escapeHtml(l.icon || 'fa-link')}" style="color: var(--primary)"></i></td>
                    <td class="td-center">-</td>
                    <td class="td-center">
                        <button class="action-btn-sm action-edit" onclick="editCustomLink(${l.id})"><i class="fas fa-pen"></i></button>
                        <button class="action-btn-sm action-delete" onclick="deleteCustomLink(${l.id}, '${escapeHtml(l.label).replace(/'/g, "\\'")}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" style="color:#ef4444;text-align:center;padding:20px">Failed to load</td></tr>';
    }
}

function showAddCustomLink() {
    if (!currentVcardId) { showToast('Save vCard basics first', 'error'); return; }
    showCustomLinkModal();
}

function editCustomLink(id) {
    const l = customLinksData.find(x => x.id == id);
    if (l) showCustomLinkModal(l);
}

function showCustomLinkModal(link = null) {
    const isEdit = link !== null;
    const icons = ['fa-link', 'fa-globe', 'fa-shopping-cart', 'fa-phone', 'fa-envelope', 'fa-calendar', 'fa-download', 'fa-play', 'fa-music', 'fa-camera', 'fa-video', 'fa-file-pdf'];
    const iconOpts = icons.map(i => `<option value="${i}" ${link && link.icon === i ? 'selected' : ''}>${i.replace('fa-', '').replace('-', ' ')}</option>`).join('');

    const html = `
        <div class="modal-overlay show" id="customLinkModal" onclick="if(event.target===this)closeCustomLinkModal()">
            <div class="modal-box" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>${isEdit ? '✏️ Edit Link' : '➕ Add Custom Link'}</h3>
                    <button class="modal-close" onclick="closeCustomLinkModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Button Label <span style="color:#ef4444">*</span></label>
                        <input type="text" id="linkLabel" value="${link ? escapeHtml(link.label) : ''}" placeholder="e.g., Visit Website" maxlength="200">
                    </div>
                    <div class="form-group">
                        <label>URL <span style="color:#ef4444">*</span></label>
                        <input type="url" id="linkUrl" value="${link ? escapeHtml(link.url) : ''}" placeholder="https://example.com">
                    </div>
                    <div class="form-group">
                        <label>Icon</label>
                        <select id="linkIcon">${iconOpts}</select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-modal-cancel" onclick="closeCustomLinkModal()">Cancel</button>
                    <button class="btn-modal-confirm" onclick="saveCustomLink(${link ? link.id : 0})"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Link</button>
                </div>
            </div>
        </div>`;
    const old = document.getElementById('customLinkModal');
    if (old) old.remove();
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(() => document.getElementById('linkLabel')?.focus(), 100);
}

function closeCustomLinkModal() {
    const m = document.getElementById('customLinkModal'); if (m) m.remove();
}

async function saveCustomLink(id) {
    const label = document.getElementById('linkLabel').value.trim();
    const url = document.getElementById('linkUrl').value.trim();
    const icon = document.getElementById('linkIcon').value;

    if (!label || !url) { showToast('Label and URL required', 'error'); return; }

    try {
        const response = await fetch('../backend/api/custom-links/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: id || 0, vcard_id: currentVcardId, label, url, icon })
        });
        const result = await response.json();
        if (result.success) {
            showToast(id ? 'Link updated!' : 'Link added!', 'success');
            closeCustomLinkModal();
            renderCustomLinksTable();
        } else showToast(result.message, 'error');
    } catch (err) { showToast('Save failed', 'error'); }
}

async function deleteCustomLink(id, label) {
    if (!confirm(`Delete "${label}"?`)) return;
    try {
        const response = await fetch('../backend/api/custom-links/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id, vcard_id: currentVcardId })
        });
        const result = await response.json();
        if (result.success) { showToast('Deleted', 'success'); renderCustomLinksTable(); }
        else showToast(result.message, 'error');
    } catch (err) { showToast('Delete failed', 'error'); }
}

// ===== INSTAEMBED (Demo only - Phase 4) =====
function renderInstaembedTable() {
    const tbody = document.getElementById('instaembedTableBody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:30px;color:var(--text-gray)"><i class="fas fa-info-circle"></i> Instagram embed coming in Phase 4</td></tr>';
}

// ===== GALLERIES (Real Backend - basic) =====
let galleriesData = [];

async function renderGalleriesTable() {
    const tbody = document.getElementById('galleriesTableBody');
    if (!tbody) return;

    if (!currentVcardId) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:30px;color:var(--text-gray)">Save vCard first</td></tr>';
        return;
    }

    try {
        const response = await fetch(`../backend/api/galleries/list.php?vcard_id=${currentVcardId}`, { credentials: 'include' });
        const result = await response.json();

        if (result.success) {
            galleriesData = result.data.galleries;
            if (galleriesData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:30px;color:var(--text-gray)"><i class="fas fa-images" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:10px;"></i>No galleries yet. Click "+ Add Gallery"<br><small>(Image upload coming Phase 4)</small></td></tr>';
                return;
            }

            tbody.innerHTML = galleriesData.map(g => `
                <tr data-id="${g.id}">
                    <td><strong>${escapeHtml(g.name)}</strong></td>
                    <td><span class="badge" style="background: var(--primary); color: white; padding: 4px 10px; border-radius: 50px; font-size: 0.78rem;">${g.image_count} image(s)</span></td>
                    <td class="td-center">
                        <button class="action-btn-sm action-edit" onclick="editGallery(${g.id})"><i class="fas fa-pen"></i></button>
                        <button class="action-btn-sm action-delete" onclick="deleteGallery(${g.id}, '${escapeHtml(g.name).replace(/'/g, "\\'")}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="3" style="color:#ef4444;text-align:center;padding:20px">Failed to load</td></tr>';
    }
}

function showAddGallery() {
    if (!currentVcardId) { showToast('Save vCard basics first', 'error'); return; }
    showGalleryModal();
}

function editGallery(id) {
    const g = galleriesData.find(x => x.id == id);
    if (g) showGalleryModal(g);
}

function showGalleryModal(gallery = null) {
    const isEdit = gallery !== null;
    const html = `
        <div class="modal-overlay show" id="galleryModal" onclick="if(event.target===this)closeGalleryModal()">
            <div class="modal-box" style="max-width: 450px;">
                <div class="modal-header">
                    <h3>${isEdit ? '✏️ Edit Gallery' : '➕ Add Gallery'}</h3>
                    <button class="modal-close" onclick="closeGalleryModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Gallery Name <span style="color:#ef4444">*</span></label>
                        <input type="text" id="galName" value="${gallery ? escapeHtml(gallery.name) : ''}" placeholder="e.g., Wedding Photos, Portfolio" maxlength="200">
                    </div>
                    <p style="color: var(--text-gray); font-size: 0.85rem; margin: 10px 0; padding: 10px; background: rgba(131,56,236,0.05); border-radius: 8px;">
                        <i class="fas fa-info-circle"></i> Image uploads coming in Phase 4. Right now you can create gallery names.
                    </p>
                </div>
                <div class="modal-footer">
                    <button class="btn-modal-cancel" onclick="closeGalleryModal()">Cancel</button>
                    <button class="btn-modal-confirm" onclick="saveGallery(${gallery ? gallery.id : 0})"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Gallery</button>
                </div>
            </div>
        </div>`;
    const old = document.getElementById('galleryModal');
    if (old) old.remove();
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(() => document.getElementById('galName')?.focus(), 100);
}

function closeGalleryModal() {
    const m = document.getElementById('galleryModal'); if (m) m.remove();
}

async function saveGallery(id) {
    const name = document.getElementById('galName').value.trim();
    if (!name) { showToast('Name required', 'error'); return; }

    try {
        const response = await fetch('../backend/api/galleries/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: id || 0, vcard_id: currentVcardId, name })
        });
        const result = await response.json();
        if (result.success) {
            showToast(id ? 'Gallery updated!' : 'Gallery added!', 'success');
            closeGalleryModal();
            renderGalleriesTable();
        } else showToast(result.message, 'error');
    } catch (err) { showToast('Save failed', 'error'); }
}

async function deleteGallery(id, name) {
    if (!confirm(`Delete gallery "${name}"? All images inside will also be deleted.`)) return;
    try {
        const response = await fetch('../backend/api/galleries/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id, vcard_id: currentVcardId })
        });
        const result = await response.json();
        if (result.success) { showToast('Deleted', 'success'); renderGalleriesTable(); }
        else showToast(result.message, 'error');
    } catch (err) { showToast('Delete failed', 'error'); }
}

// ===== IFRAMES (Demo - Phase 4) =====
function renderIframesTable() {
    const tbody = document.getElementById('iframesTableBody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;padding:30px;color:var(--text-gray)"><i class="fas fa-info-circle"></i> Iframes feature coming in Phase 4</td></tr>';
}

// ===== SOCIAL LINKS (Real Backend - bulk save) =====
async function renderSocialLinks() {
    const grid = document.getElementById('socialLinksGrid');
    if (!grid) return;

    // Render UI first with default platforms
    grid.innerHTML = socialPlatforms.map(p => `
        <div class="social-link-item">
            <div class="social-icon-circle" style="background: ${p.color}">
                <i class="fab ${p.icon}"></i>
            </div>
            <input type="url" placeholder="${p.name} URL" data-platform="${p.name}" value="">
        </div>
    `).join('');

    // Add Save button if not exists
    let saveBtn = document.getElementById('saveSocialBtn');
    if (!saveBtn) {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'margin-top: 20px; text-align: right;';
        wrap.innerHTML = '<button id="saveSocialBtn" class="btn-save" onclick="saveSocialLinks()" style="background: linear-gradient(135deg, var(--primary), var(--primary-light)); color:white; padding: 10px 28px; border:none; border-radius:8px; font-weight:700; cursor:pointer;"><i class="fas fa-save"></i> Save Social Links</button>';
        grid.parentElement.appendChild(wrap);
    }

    // Load existing values from backend
    if (!currentVcardId) return;

    try {
        const response = await fetch(`../backend/api/social/list.php?vcard_id=${currentVcardId}`, { credentials: 'include' });
        const result = await response.json();
        if (result.success && result.data.links.length > 0) {
            result.data.links.forEach(link => {
                const input = grid.querySelector(`input[data-platform="${link.platform}"]`);
                if (input) input.value = link.url;
            });
        }
    } catch (err) {
        console.warn('Could not load social links');
    }
}

async function saveSocialLinks() {
    if (!currentVcardId) { showToast('Save vCard basics first', 'error'); return; }

    const grid = document.getElementById('socialLinksGrid');
    const inputs = grid.querySelectorAll('input[data-platform]');
    const links = [];
    inputs.forEach(input => {
        const url = input.value.trim();
        if (url) {
            links.push({ platform: input.dataset.platform, url: url });
        }
    });

    try {
        const response = await fetch('../backend/api/social/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ vcard_id: currentVcardId, links })
        });
        const result = await response.json();
        if (result.success) showToast('Social links saved!', 'success');
        else showToast(result.message, 'error');
    } catch (err) { showToast('Save failed', 'error'); }
}

function addSocialLink() {
    showToast('Default platforms cover most needs - just fill URLs above!', 'success');
}

// ===== ADD MODAL =====
let currentModalType = null;

function openAddModal(type) {
    currentModalType = type;
    const modal = document.getElementById('addModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    const configs = {
        service: {
            title: 'New Service',
            body: `
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label>Name *</label>
                        <input type="text" class="form-control" placeholder="Enter Service Name">
                    </div>
                    <div class="form-group full-width">
                        <label>Service URL *</label>
                        <input type="url" class="form-control" placeholder="https://...">
                    </div>
                    <div class="form-group full-width">
                        <label>Service Icon *</label>
                        <div class="image-upload"><div class="upload-preview" style="height: 100px;"><i class="fas fa-image" style="font-size: 2rem; color: #ccc;"></i></div></div>
                        <small class="form-hint">Allowed: png, jpg, jpeg</small>
                    </div>
                </div>
            `
        },
        product: {
            title: 'New Product',
            body: `
                <div class="form-grid">
                    <div class="form-group">
                        <label>Name *</label>
                        <input type="text" class="form-control" placeholder="Product Name">
                    </div>
                    <div class="form-group">
                        <label>Currency</label>
                        <select class="form-control">
                            <option value="INR">₹ INR</option>
                            <option value="USD">$ USD</option>
                            <option value="EUR">€ EUR</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Price</label>
                        <input type="number" class="form-control" placeholder="Enter Price">
                    </div>
                    <div class="form-group">
                        <label>Product URL</label>
                        <input type="url" class="form-control" placeholder="https://...">
                    </div>
                    <div class="form-group full-width">
                        <label>Description</label>
                        <textarea class="form-control" rows="4" placeholder="Short description..."></textarea>
                    </div>
                </div>
            `
        },
        blog: {
            title: 'New Blog',
            body: `
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label>Title *</label>
                        <input type="text" class="form-control" placeholder="Enter Blog Title">
                    </div>
                    <div class="form-group full-width">
                        <label>Description *</label>
                        <textarea class="form-control" rows="6" placeholder="Blog content..."></textarea>
                    </div>
                </div>
            `
        },
        testimonial: {
            title: 'New Testimonial',
            body: `
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label>Name *</label>
                        <input type="text" class="form-control" placeholder="Person Name">
                    </div>
                    <div class="form-group full-width">
                        <label>Description *</label>
                        <textarea class="form-control" rows="4" placeholder="Testimonial..."></textarea>
                    </div>
                </div>
            `
        },
        gallery: {
            title: 'New Gallery',
            body: `
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label>Type *</label>
                        <select class="form-control">
                            <option>Image</option>
                            <option>YouTube</option>
                            <option>File</option>
                            <option>Video</option>
                            <option>Audio</option>
                        </select>
                    </div>
                    <div class="form-group full-width">
                        <label>Upload File *</label>
                        <div class="image-upload"><div class="upload-preview" style="height: 100px;"><i class="fas fa-image" style="font-size: 2rem; color: #ccc;"></i></div></div>
                    </div>
                </div>
            `
        },
        iframe: {
            title: 'New Iframe',
            body: `
                <div class="form-group full-width">
                    <label>URL *</label>
                    <input type="url" class="form-control" placeholder="Add Iframe URL">
                </div>
            `
        },
        instaembed: {
            title: 'Add Embed-Tag',
            body: `
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label>Type *</label>
                        <select class="form-control">
                            <option>Select Type</option>
                            <option>Post</option>
                            <option>Reel</option>
                        </select>
                    </div>
                    <div class="form-group full-width">
                        <label>Embed-Tag *</label>
                        <textarea class="form-control" rows="4" placeholder="Paste Instagram embed code..."></textarea>
                    </div>
                </div>
            `
        },
        customLink: {
            title: 'New Custom Link',
            body: `
                <div class="form-grid">
                    <div class="form-group">
                        <label>Link Name *</label>
                        <input type="text" class="form-control" placeholder="Link Name">
                    </div>
                    <div class="form-group">
                        <label>URL *</label>
                        <input type="url" class="form-control" placeholder="https://...">
                    </div>
                    <div class="form-group">
                        <label class="status-toggle-row">
                            <span>Show as Button</span>
                            <label class="status-toggle">
                                <input type="checkbox" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </label>
                    </div>
                    <div class="form-group">
                        <label class="status-toggle-row">
                            <span>Open in New Tab</span>
                            <label class="status-toggle">
                                <input type="checkbox" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </label>
                    </div>
                </div>
            `
        }
    };

    const config = configs[type] || { title: 'Add Item', body: '' };
    title.textContent = config.title;
    body.innerHTML = config.body;
    modal.classList.add('show');
}

function closeAddModal() {
    document.getElementById('addModal').classList.remove('show');
    currentModalType = null;
}

function saveModalItem() {
    showToast(`${currentModalType} added successfully!`, 'success');
    closeAddModal();
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.id === 'addModal') closeAddModal();
});

// ===== PASSWORD TOGGLE =====
function togglePasswordView(id) {
    const input = document.getElementById(id);
    const btn = input.nextElementSibling;
    const icon = btn.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? 'fa-check-circle' :
                 type === 'error' ? 'fa-exclamation-circle' :
                 'fa-exclamation-triangle';

    const title = type === 'success' ? 'Success' :
                  type === 'error' ? 'Error' :
                  'Warning';

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="toast-content">
            <p class="toast-title">${title}</p>
            <p class="toast-msg">${message}</p>
        </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Get vCard ID from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        document.getElementById('editPageTitle').textContent = `Edit vCard #${id}`;
        currentVcardId = parseInt(id);
        // Load real data from backend
        loadVcardData(id);
    } else {
        document.getElementById('editPageTitle').textContent = 'New vCard';
        showToast('No vCard ID provided. Please open from vCards list.', 'error');
    }

    // Render all sections
    renderTemplates();
    setupTemplateSearch();
    renderBusinessHours();
    renderAppointments();
    renderServicesTable();
    renderProductsTable();
    renderBlogsTable();
    renderTestimonialsTable();
    renderCustomLinksTable();
    renderInstaembedTable();
    renderGalleriesTable();
    renderIframesTable();
    renderSocialLinks();

    // Setup save buttons with real backend
    setupSaveButtons();

    console.log('%c✏️ vCard Edit Page (Real Backend)', 'color: #8338ec; font-size: 14px; font-weight: bold;');
});

// ============================================================
// REAL BACKEND INTEGRATION
// ============================================================

const VCARD_API = '../backend/api/vcards/';
let currentVcardId = null;
let currentVcardData = null;

// Map of input field IDs/selectors to database field names
const FIELD_MAP_BASIC = {
    'urlAlias': 'url_alias',
    'vcardName': 'vcard_name',
    'occupation': 'occupation',
    'description': 'description'  // contenteditable
};

// Load vCard data from backend
async function loadVcardData(id) {
    try {
        const response = await fetch(`${VCARD_API}get.php?id=${id}`, {
            credentials: 'include'
        });

        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }

        const result = await response.json();

        if (!result.success) {
            showToast(result.message || 'Failed to load vCard', 'error');
            return;
        }

        currentVcardData = result.data.vcard;
        populateForm(currentVcardData);

    } catch (err) {
        console.error('Load vCard error:', err);
        showToast('Connection error: ' + err.message, 'error');
    }
}

// Populate form with vCard data
function populateForm(vcard) {
    // === Basic Details ===
    setVal('urlAlias', vcard.url_alias);
    setVal('vcardName', vcard.vcard_name);
    setVal('occupation', vcard.occupation);

    // Description (contenteditable)
    const desc = document.getElementById('description');
    if (desc && vcard.description) desc.innerHTML = vcard.description;

    // URL preview
    const urlPreview = document.getElementById('urlPreview');
    if (urlPreview) urlPreview.textContent = vcard.url_alias;

    // === Image Previews (Phase 4) ===
    if (vcard.cover_image) {
        const coverPreview = document.getElementById('coverPreview');
        if (coverPreview) coverPreview.innerHTML = `<img src="/${vcard.cover_image}?t=${Date.now()}" alt="Cover">`;
    }
    if (vcard.profile_image) {
        const profPreview = document.getElementById('profilePreview');
        if (profPreview) profPreview.innerHTML = `<img src="/${vcard.profile_image}?t=${Date.now()}" alt="Profile">`;
    }
    if (vcard.favicon_image) {
        const favPreview = document.getElementById('faviconPreview');
        if (favPreview) favPreview.innerHTML = `<img src="/${vcard.favicon_image}?t=${Date.now()}" alt="Favicon">`;
    }

    // === Personal Details === (using positional matching since some don't have IDs)
    const personalTab = document.getElementById('inner-personal');
    if (personalTab) {
        const inputs = personalTab.querySelectorAll('input.form-control, textarea.form-control, select.form-control');
        // Match by order: First Name, Last Name, Email, Phone, Alt Email, Alt Phone, Location, Loc Type, Loc URL, DOB, Company, Made By, Made By URL, Job Title, Default Lang, Cover Type
        const personalValues = [
            vcard.first_name,
            vcard.last_name,
            vcard.email,
            vcard.phone,
            vcard.alternate_email,
            vcard.alternate_phone,
            vcard.location,
            vcard.location_type,
            vcard.location_url,
            vcard.dob,
            vcard.company,
            vcard.made_by,
            vcard.made_by_url,
            vcard.job_title,
            vcard.default_language,
            vcard.cover_type
        ];

        inputs.forEach((input, idx) => {
            if (idx < personalValues.length && personalValues[idx] !== null && personalValues[idx] !== undefined) {
                input.value = personalValues[idx];
                input.dataset.fieldName = [
                    'first_name', 'last_name', 'email', 'phone',
                    'alternate_email', 'alternate_phone', 'location', 'location_type',
                    'location_url', 'dob', 'company', 'made_by', 'made_by_url',
                    'job_title', 'default_language', 'cover_type'
                ][idx];
            }
        });
    }

    // === Templates ===
    const templateIdx = templates.findIndex(t => t.id === vcard.template_id);
    if (templateIdx >= 0) {
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
        const card = document.querySelector(`.template-card[data-template="${templateIdx}"]`);
        if (card) card.classList.add('selected');
    }

    // === Business Hours ===
    if (vcard.business_hours && vcard.business_hours.length > 0) {
        // Update internal hours object and re-render
        vcard.business_hours.forEach(bh => {
            if (typeof defaultHours !== 'undefined' && defaultHours[bh.day_name]) {
                defaultHours[bh.day_name] = {
                    open: bh.is_open == 1,
                    from: bh.open_time,
                    to: bh.close_time
                };
            }
        });
        if (typeof renderBusinessHours === 'function') renderBusinessHours();
    }

    showToast(`vCard "${vcard.vcard_name}" loaded`, 'success');
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (el && value !== null && value !== undefined) {
        el.value = value;
    }
}

// ============================================================
// SAVE BUTTONS - Real Backend Integration
// ============================================================

function setupSaveButtons() {
    // Override the universal save handler
    document.removeEventListener('click', dummyHandler);

    document.addEventListener('click', async (e) => {
        if (!e.target.classList.contains('btn-save')) return;
        if (e.target.dataset.saving === '1') return;

        e.preventDefault();
        e.target.dataset.saving = '1';

        try {
            // Determine which tab is active
            const activeMainTab = document.querySelector('.tab-content.active');
            const activeInnerTab = document.querySelector('.inner-tab-content.active');

            let saveResult = false;

            if (activeInnerTab && activeInnerTab.id === 'inner-basic') {
                saveResult = await saveBasicDetails();
            } else if (activeInnerTab && activeInnerTab.id === 'inner-personal') {
                saveResult = await savePersonalDetails();
            } else if (activeInnerTab && activeInnerTab.id === 'inner-other') {
                saveResult = await saveOtherConfigurations();
            } else if (activeMainTab && activeMainTab.id === 'tab-vcard-templates') {
                saveResult = await saveTemplate();
            } else if (activeMainTab && activeMainTab.id === 'tab-business-hours') {
                saveResult = await saveBusinessHours();
            } else if (activeMainTab && activeMainTab.id === 'tab-dynamic-vcard') {
                saveResult = await saveDynamicConfig();
            } else {
                showToast('This section save is coming in next phase', 'warning');
                saveResult = true; // Allow next-tab navigation
            }

            // If save successful, navigate to next inner tab (for inner tabs)
            if (saveResult && activeInnerTab) {
                const innerTabs = document.querySelectorAll('.inner-tab');
                const activeIndex = Array.from(innerTabs).findIndex(t => t.classList.contains('active'));
                if (activeIndex >= 0 && activeIndex < innerTabs.length - 1) {
                    setTimeout(() => innerTabs[activeIndex + 1].click(), 800);
                }
            }
        } catch (err) {
            console.error('Save error:', err);
            showToast('Save failed: ' + err.message, 'error');
        } finally {
            setTimeout(() => delete e.target.dataset.saving, 500);
        }
    });
}

function dummyHandler() {} // Placeholder for old handler

// Save Basic Details
async function saveBasicDetails() {
    if (!currentVcardId) {
        showToast('No vCard loaded', 'error');
        return false;
    }

    const data = {
        id: currentVcardId,
        url_alias: document.getElementById('urlAlias')?.value || '',
        vcard_name: document.getElementById('vcardName')?.value || '',
        occupation: document.getElementById('occupation')?.value || '',
        description: document.getElementById('description')?.innerHTML || ''
    };

    if (!data.vcard_name.trim()) {
        showToast('vCard name is required', 'error');
        return false;
    }

    return await callUpdateAPI(data, 'Basic details');
}

// Save Personal Details
async function savePersonalDetails() {
    if (!currentVcardId) return false;

    const personalTab = document.getElementById('inner-personal');
    if (!personalTab) return false;

    const inputs = personalTab.querySelectorAll('input.form-control, textarea.form-control, select.form-control');

    const fieldNames = [
        'first_name', 'last_name', 'email', 'phone',
        'alternate_email', 'alternate_phone', 'location', 'location_type',
        'location_url', 'dob', 'company', 'made_by', 'made_by_url',
        'job_title', 'default_language', 'cover_type'
    ];

    const data = { id: currentVcardId };

    inputs.forEach((input, idx) => {
        if (idx < fieldNames.length) {
            data[fieldNames[idx]] = input.value;
        }
    });

    return await callUpdateAPI(data, 'Personal details');
}

// Save Other Configurations
async function saveOtherConfigurations() {
    if (!currentVcardId) return false;

    const data = {
        id: currentVcardId,
        qr_download_size: parseInt(document.getElementById('qrSize')?.value || 200)
    };

    // Collect all checkbox toggles in this tab
    const otherTab = document.getElementById('inner-other');
    if (otherTab) {
        const toggles = otherTab.querySelectorAll('input[type="checkbox"]');
        const toggleFields = [
            'display_inquiry_form', 'display_qr_section', 'display_download_qr',
            'display_add_contact', 'display_whatsapp_share', 'display_language_selector',
            'hide_sticky_bar'
        ];
        toggles.forEach((toggle, idx) => {
            if (idx < toggleFields.length) {
                data[toggleFields[idx]] = toggle.checked ? 1 : 0;
            }
        });
    }

    return await callUpdateAPI(data, 'Configuration');
}

// Save Selected Template
async function saveTemplate() {
    if (!currentVcardId) return false;

    const selected = document.querySelector('.template-card.selected');
    if (!selected) {
        showToast('Please select a template', 'error');
        return false;
    }

    const idx = parseInt(selected.dataset.template);
    const template = templates[idx];

    return await callUpdateAPI({
        id: currentVcardId,
        template_id: template.id
    }, `Template "${template.name}"`);
}

// Save Business Hours
async function saveBusinessHours() {
    if (!currentVcardId) return false;

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const business_hours = days.map(day => ({
        day_name: day,
        is_open: defaultHours[day]?.open ? 1 : 0,
        open_time: defaultHours[day]?.from || '10:00 AM',
        close_time: defaultHours[day]?.to || '06:00 PM'
    }));

    return await callUpdateAPI({
        id: currentVcardId,
        business_hours: business_hours
    }, 'Business hours');
}

// Save Dynamic vCard configuration (colors, button styles)
async function saveDynamicConfig() {
    if (!currentVcardId) return false;

    const dynamicTab = document.getElementById('tab-dynamic-vcard');
    if (!dynamicTab) return false;

    const data = { id: currentVcardId };

    // Collect color inputs
    const colorInputs = dynamicTab.querySelectorAll('input[type="color"]');
    const colorFields = [
        'primary_color', 'secondary_color', 'bg_color', 'cards_bg_color',
        'button_text_color', 'label_text_color', 'description_text_color', 'social_icon_color'
    ];
    colorInputs.forEach((input, idx) => {
        if (idx < colorFields.length) {
            data[colorFields[idx]] = input.value;
        }
    });

    return await callUpdateAPI(data, 'Dynamic vCard');
}

// Generic update API call
async function callUpdateAPI(data, sectionName) {
    try {
        const response = await fetch(`${VCARD_API}update.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (response.status === 401) {
            window.location.href = 'login.html';
            return false;
        }

        const result = await response.json();

        if (result.success) {
            showToast(`✓ ${sectionName} saved successfully!`, 'success');
            return true;
        } else {
            showToast(result.message || `Failed to save ${sectionName}`, 'error');
            return false;
        }
    } catch (err) {
        console.error('Update API error:', err);
        showToast('Connection error: ' + err.message, 'error');
        return false;
    }
}
