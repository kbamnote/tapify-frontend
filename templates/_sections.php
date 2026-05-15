<?php
/**
 * SHARED SECTIONS - Used by templates
 * Includes: Services, Products, Hours, Testimonials, Blogs, Galleries, Custom Links, Social, Inquiry Form
 */
?>

<?php if (count($services) > 0): ?>
<div class="section">
    <h3 class="section-title"><i class="fas fa-briefcase"></i> Services</h3>
    <div class="services-list">
        <?php foreach ($services as $s): ?>
            <a href="<?= htmlspecialchars($s['service_url'] ?: '#') ?>" <?= $s['service_url'] ? 'target="_blank"' : '' ?> class="service-item">
                <div class="service-icon"><?= strtoupper(substr($s['name'], 0, 1)) ?></div>
                <div><?= htmlspecialchars($s['name']) ?></div>
            </a>
        <?php endforeach; ?>
    </div>
</div>
<?php endif; ?>

<?php if (count($products) > 0): ?>
<div class="section">
    <h3 class="section-title"><i class="fas fa-shopping-bag"></i> Products</h3>
    <div class="products-grid">
        <?php foreach ($products as $p): ?>
            <a href="<?= htmlspecialchars($p['product_url'] ?: '#') ?>" <?= $p['product_url'] ? 'target="_blank"' : '' ?> class="product-card">
                <div class="product-image">
                    <?php if (!empty($p['image'])): ?>
                        <img src="<?= imgUrl($p['image']) ?>" alt="<?= htmlspecialchars($p['name']) ?>">
                    <?php else: ?>
                        <i class="fas fa-image" style="font-size:2rem;"></i>
                    <?php endif; ?>
                </div>
                <div class="product-info">
                    <div class="product-name"><?= htmlspecialchars($p['name']) ?></div>
                    <?php if ($p['price'] !== null): ?>
                        <div class="product-price"><?= htmlspecialchars($p['currency'] ?: 'INR') ?> <?= number_format((float)$p['price'], 2) ?></div>
                    <?php endif; ?>
                </div>
            </a>
        <?php endforeach; ?>
    </div>
</div>
<?php endif; ?>

<?php if (count($businessHours) > 0): ?>
<div class="section">
    <h3 class="section-title"><i class="fas fa-clock"></i> Business Hours</h3>
    <div class="hours-list">
        <?php foreach ($businessHours as $bh): ?>
            <div class="hours-row <?= $bh['is_open'] ? '' : 'closed' ?>">
                <span class="hours-day"><?= ucfirst(strtolower($bh['day_name'])) ?></span>
                <span><?= $bh['is_open'] ? htmlspecialchars($bh['open_time'] . ' - ' . $bh['close_time']) : 'Closed' ?></span>
            </div>
        <?php endforeach; ?>
    </div>
</div>
<?php endif; ?>

<?php if (count($testimonials) > 0): ?>
<div class="section">
    <h3 class="section-title"><i class="fas fa-quote-left"></i> What People Say</h3>
    <?php foreach ($testimonials as $t): ?>
        <div class="testimonial">
            <div class="testimonial-stars"><?= str_repeat('★', $t['rating']) . str_repeat('☆', 5 - $t['rating']) ?></div>
            <p class="testimonial-msg">"<?= htmlspecialchars($t['message']) ?>"</p>
            <div class="testimonial-author"><?= htmlspecialchars($t['name']) ?></div>
            <?php if (!empty($t['designation']) || !empty($t['company'])): ?>
                <div class="testimonial-meta"><?= htmlspecialchars(trim(($t['designation'] ?? '') . (!empty($t['company']) ? ' @ ' . $t['company'] : ''), ' @')) ?></div>
            <?php endif; ?>
        </div>
    <?php endforeach; ?>
</div>
<?php endif; ?>

<?php if (count($blogs) > 0): ?>
<div class="section">
    <h3 class="section-title"><i class="fas fa-blog"></i> Latest from Blog</h3>
    <?php foreach ($blogs as $b): ?>
        <div class="blog-card">
            <?php if (!empty($b['image'])): ?>
                <div class="blog-image"><img src="<?= imgUrl($b['image']) ?>" alt="<?= htmlspecialchars($b['title']) ?>"></div>
            <?php endif; ?>
            <div class="blog-info">
                <h4 class="blog-title"><?= htmlspecialchars($b['title']) ?></h4>
                <?php if (!empty($b['published_date'])): ?>
                    <div class="blog-date"><i class="fas fa-calendar"></i> <?= date('M d, Y', strtotime($b['published_date'])) ?></div>
                <?php endif; ?>
            </div>
        </div>
    <?php endforeach; ?>
</div>
<?php endif; ?>

<?php if (count($galleries) > 0): ?>
<div class="section">
    <h3 class="section-title"><i class="fas fa-images"></i> Gallery</h3>
    <?php foreach ($galleries as $g): ?>
        <?php if (count($g['images']) > 0): ?>
        <div class="gallery">
            <div class="gallery-name"><?= htmlspecialchars($g['name']) ?></div>
            <div class="gallery-images">
                <?php foreach ($g['images'] as $img): ?>
                    <div class="gallery-img" onclick="window.open('/<?= htmlspecialchars($img['image_url']) ?>', '_blank')">
                        <img src="/<?= htmlspecialchars($img['image_url']) ?>" alt="">
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>
    <?php endforeach; ?>
</div>
<?php endif; ?>

<?php if (count($customLinks) > 0): ?>
<div class="section">
    <h3 class="section-title"><i class="fas fa-link"></i> Quick Links</h3>
    <?php foreach ($customLinks as $l): ?>
        <a href="<?= htmlspecialchars($l['url']) ?>" target="_blank" class="custom-link">
            <i class="fas <?= htmlspecialchars($l['icon'] ?: 'fa-link') ?>"></i>
            <span><?= htmlspecialchars($l['label']) ?></span>
        </a>
    <?php endforeach; ?>
</div>
<?php endif; ?>

<?php if (count($socialLinks) > 0): ?>
<div class="section">
    <h3 class="section-title"><i class="fas fa-share-nodes"></i> Connect</h3>
    <div class="social-grid">
        <?php
        $iconMap = [
            'Facebook' => 'fab fa-facebook-f', 'Instagram' => 'fab fa-instagram',
            'Twitter' => 'fab fa-twitter', 'LinkedIn' => 'fab fa-linkedin-in',
            'WhatsApp' => 'fab fa-whatsapp', 'YouTube' => 'fab fa-youtube',
            'Pinterest' => 'fab fa-pinterest-p', 'TikTok' => 'fab fa-tiktok',
            'Snapchat' => 'fab fa-snapchat-ghost'
        ];
        foreach ($socialLinks as $sl):
            $iconClass = $iconMap[$sl['platform']] ?? 'fas fa-link';
        ?>
            <a href="<?= htmlspecialchars($sl['url']) ?>" target="_blank" class="social-icon social-<?= htmlspecialchars($sl['platform']) ?>" title="<?= htmlspecialchars($sl['platform']) ?>">
                <i class="<?= $iconClass ?>"></i>
            </a>
        <?php endforeach; ?>
    </div>
</div>
<?php endif; ?>

<?php if (($vcard['display_inquiry_form'] ?? 1)): ?>
<div class="section">
    <h3 class="section-title"><i class="fas fa-paper-plane"></i> Get in Touch</h3>
    <form class="inquiry-form" onsubmit="submitInquiry(event)">
        <input type="hidden" name="vcard_id" value="<?= $vcardId ?>">
        <div class="form-group">
            <label>Name *</label>
            <input type="text" name="name" required placeholder="Your name">
        </div>
        <div class="form-group">
            <label>Email *</label>
            <input type="email" name="email" required placeholder="you@example.com">
        </div>
        <div class="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" placeholder="+91 9876543210">
        </div>
        <div class="form-group">
            <label>Message *</label>
            <textarea name="message" rows="3" required placeholder="Your message..."></textarea>
        </div>
        <button type="submit" class="submit-btn">
            <i class="fas fa-paper-plane"></i> Send Message
        </button>
    </form>
</div>
<?php endif; ?>

<?php if (($vcard['show_appointments'] ?? 1)): ?>
<div class="section">
    <h3 class="section-title"><i class="fas fa-calendar-check"></i> Book Appointment</h3>
    <form class="inquiry-form" onsubmit="submitAppointment(event)">
        <input type="hidden" name="vcard_id" value="<?= $vcardId ?>">
        <div class="form-group">
            <label>Your Name *</label>
            <input type="text" name="name" required placeholder="Your name">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div class="form-group">
                <label>Phone *</label>
                <input type="tel" name="phone" required placeholder="9876543210">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="optional">
            </div>
        </div>
        <?php if (count($services) > 0): ?>
        <div class="form-group">
            <label>Service</label>
            <select name="service" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-family:inherit;font-size:0.9rem;background:white">
                <option value="">Choose a service</option>
                <?php foreach ($services as $s): ?>
                    <option value="<?= htmlspecialchars($s['name']) ?>"><?= htmlspecialchars($s['name']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <?php else: ?>
        <div class="form-group">
            <label>Service / Reason</label>
            <input type="text" name="service" placeholder="What service do you need?">
        </div>
        <?php endif; ?>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div class="form-group">
                <label>Date *</label>
                <input type="date" name="date" required min="<?= date('Y-m-d') ?>">
            </div>
            <div class="form-group">
                <label>Time *</label>
                <input type="time" name="time" required>
            </div>
        </div>
        <div class="form-group">
            <label>Notes</label>
            <textarea name="notes" rows="2" placeholder="Any specific requirements..."></textarea>
        </div>
        <button type="submit" class="submit-btn">
            <i class="fas fa-calendar-plus"></i> Book Appointment
        </button>
    </form>
</div>
<?php endif; ?>
