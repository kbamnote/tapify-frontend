<?php
/**
 * SHARED SCRIPTS - Included at end of every template
 * Provides: Save Contact (.vcf), Share, Inquiry submit, Toast
 */
?>
<script>
const VCARD_DATA = {
    name: <?= json_encode($fullName) ?>,
    firstName: <?= json_encode($vcard['first_name'] ?? '') ?>,
    lastName: <?= json_encode($vcard['last_name'] ?? '') ?>,
    occupation: <?= json_encode($vcard['occupation'] ?? '') ?>,
    company: <?= json_encode($vcard['company'] ?? '') ?>,
    email: <?= json_encode($vcard['email'] ?? '') ?>,
    phone: <?= json_encode($vcard['phone'] ?? '') ?>,
    altEmail: <?= json_encode($vcard['alternate_email'] ?? '') ?>,
    altPhone: <?= json_encode($vcard['alternate_phone'] ?? '') ?>,
    location: <?= json_encode($vcard['location'] ?? '') ?>,
    url: window.location.href
};

function saveContact() {
    const vcf = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${VCARD_DATA.name}`,
        VCARD_DATA.firstName ? `N:${VCARD_DATA.lastName};${VCARD_DATA.firstName};;;` : '',
        VCARD_DATA.occupation ? `TITLE:${VCARD_DATA.occupation}` : '',
        VCARD_DATA.company ? `ORG:${VCARD_DATA.company}` : '',
        VCARD_DATA.email ? `EMAIL;TYPE=WORK:${VCARD_DATA.email}` : '',
        VCARD_DATA.altEmail ? `EMAIL;TYPE=HOME:${VCARD_DATA.altEmail}` : '',
        VCARD_DATA.phone ? `TEL;TYPE=CELL:${VCARD_DATA.phone}` : '',
        VCARD_DATA.altPhone ? `TEL;TYPE=WORK:${VCARD_DATA.altPhone}` : '',
        VCARD_DATA.location ? `ADR;TYPE=WORK:;;${VCARD_DATA.location};;;;` : '',
        `URL:${VCARD_DATA.url}`,
        'END:VCARD'
    ].filter(Boolean).join('\n');

    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${VCARD_DATA.name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✓ Contact saved!', 'success');
}

async function shareCard() {
    if (navigator.share) {
        try {
            await navigator.share({
                title: VCARD_DATA.name,
                text: `Check out ${VCARD_DATA.name}'s digital business card`,
                url: VCARD_DATA.url
            });
        } catch(e) {}
    } else {
        navigator.clipboard.writeText(VCARD_DATA.url);
        showToast('✓ Link copied to clipboard!', 'success');
    }
}

async function submitInquiry(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
        const response = await fetch('/inquiry-submit.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showToast('✓ Message sent! We will get back to you soon.', 'success');
            form.reset();
        } else {
            showToast(result.message || 'Failed to send', 'error');
        }
    } catch (err) {
        showToast('Connection error', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function submitAppointment(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

    try {
        const response = await fetch('/appointment-submit.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showToast('✓ Appointment booked! We will confirm shortly.', 'success');
            form.reset();
        } else {
            showToast(result.message || 'Failed to book', 'error');
        }
    } catch (err) {
        showToast('Connection error', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

function showToast(msg, type = 'success') {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
}
</script>

<style>
.toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: #1a2035;
    color: white;
    padding: 14px 24px;
    border-radius: 50px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    transition: transform 0.4s;
    z-index: 9999;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    max-width: 90%;
}
.toast.show { transform: translateX(-50%) translateY(0); }
.toast.success { background: #10b981; }
.toast.error { background: #ef4444; }
</style>
