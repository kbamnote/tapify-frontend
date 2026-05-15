<?php
/**
 * LAWYER TEMPLATE - Professional Dark with Gold Accents
 * Best for: Lawyers, Consultants, Financial Advisors
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($fullName) ?> - <?= htmlspecialchars($vcard['occupation'] ?? '') ?></title>
    <meta name="description" content="<?= htmlspecialchars(strip_tags($vcard['description'] ?? '')) ?>">
    <link rel="icon" type="image/png" href="<?= $vcard['favicon_image'] ? imgUrl($vcard['favicon_image']) : '/images/tapify-logo-gold.png' ?>">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        :root { --primary: #C9A765; --dark: #1a1a2e; --bg: #0f0f1e; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background: #000; min-height: 100vh; color: #e5e7eb; }
        .vcard-container { max-width: 480px; margin: 0 auto; background: var(--bg); min-height: 100vh; box-shadow: 0 0 80px rgba(201,167,101,0.2); position: relative; }
        .cover-section { height: 250px; background: linear-gradient(135deg, var(--dark), #2a2a4e); position: relative; overflow: hidden; }
        .cover-section::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--primary), transparent); }
        .cover-section img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
        .profile-section { text-align: center; margin-top: -70px; padding: 0 30px 30px; position: relative; z-index: 5; }
        .profile-photo { width: 140px; height: 140px; border-radius: 50%; border: 4px solid var(--primary); box-shadow: 0 0 40px rgba(201,167,101,0.3); background: var(--dark); margin: 0 auto 20px; overflow: hidden; }
        .profile-photo img { width: 100%; height: 100%; object-fit: cover; }
        .profile-photo .placeholder { width: 100%; height: 100%; background: var(--primary); color: var(--dark); display: flex; align-items: center; justify-content: center; font-size: 3rem; font-family: 'Playfair Display'; font-weight: 900; }
        .profile-name { font-family: 'Playfair Display'; font-size: 2rem; font-weight: 700; color: var(--primary); margin-bottom: 5px; letter-spacing: 1px; }
        .profile-title { color: #d1d5db; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 12px; }
        .profile-divider { width: 60px; height: 2px; background: var(--primary); margin: 15px auto; }
        .profile-company { color: var(--primary); font-size: 0.95rem; font-weight: 600; margin-bottom: 15px; }
        .profile-desc { color: #9ca3af; font-size: 0.9rem; line-height: 1.7; margin-bottom: 25px; font-style: italic; }
        .save-contact-btn { background: linear-gradient(135deg, var(--primary), #d4b878); color: var(--dark); padding: 14px 35px; border: none; border-radius: 0; font-size: 0.85rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 30px rgba(201,167,101,0.3); text-decoration: none; display: inline-flex; align-items: center; gap: 10px; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s; }
        .save-contact-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(201,167,101,0.5); }
        .quick-actions { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; padding: 0 30px 30px; }
        .quick-action { background: var(--dark); border: 1px solid rgba(201,167,101,0.3); border-radius: 0; padding: 16px 8px; text-align: center; text-decoration: none; color: var(--primary); display: flex; flex-direction: column; align-items: center; gap: 6px; transition: all 0.3s; }
        .quick-action:hover { border-color: var(--primary); background: rgba(201,167,101,0.1); }
        .quick-action i { font-size: 1.3rem; }
        .quick-action span { font-size: 0.7rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; }
        .section { padding: 30px; border-top: 1px solid rgba(201,167,101,0.15); }
        .section-title { font-family: 'Playfair Display'; font-size: 1.4rem; font-weight: 700; color: var(--primary); margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
        .section-title::before { content: ''; width: 30px; height: 2px; background: var(--primary); }
        .section-title i { color: var(--primary); font-size: 1.1rem; }
        .services-list { display: flex; flex-direction: column; gap: 10px; }
        .service-item { background: var(--dark); border: 1px solid rgba(201,167,101,0.2); padding: 16px; display: flex; align-items: center; gap: 12px; text-decoration: none; color: #e5e7eb; transition: all 0.3s; }
        .service-item:hover { border-color: var(--primary); transform: translateX(5px); }
        .service-icon { width: 42px; height: 42px; background: var(--primary); color: var(--dark); display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: 'Playfair Display'; flex-shrink: 0; }
        .products-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .product-card { background: var(--dark); border: 1px solid rgba(201,167,101,0.2); overflow: hidden; text-decoration: none; color: #e5e7eb; transition: all 0.3s; }
        .product-card:hover { border-color: var(--primary); }
        .product-image { width: 100%; aspect-ratio: 1; background: #111; display: flex; align-items: center; justify-content: center; color: var(--primary); overflow: hidden; }
        .product-image img { width: 100%; height: 100%; object-fit: cover; }
        .product-info { padding: 12px; }
        .product-name { font-weight: 600; font-size: 0.88rem; margin-bottom: 5px; }
        .product-price { color: var(--primary); font-weight: 700; font-family: 'Playfair Display'; font-size: 1rem; }
        .hours-list { background: var(--dark); border: 1px solid rgba(201,167,101,0.2); }
        .hours-row { display: flex; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid rgba(201,167,101,0.1); font-size: 0.9rem; }
        .hours-row:last-child { border-bottom: none; }
        .hours-row.closed { color: #6b7280; }
        .hours-day { color: var(--primary); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 0.82rem; }
        .testimonial { background: var(--dark); padding: 22px; margin-bottom: 14px; border-left: 3px solid var(--primary); position: relative; }
        .testimonial::before { content: '"'; position: absolute; top: -10px; left: 15px; font-family: 'Playfair Display'; font-size: 4rem; color: var(--primary); opacity: 0.3; }
        .testimonial-stars { color: var(--primary); margin-bottom: 8px; }
        .testimonial-msg { font-size: 0.95rem; line-height: 1.7; color: #d1d5db; font-style: italic; margin-bottom: 12px; font-family: 'Playfair Display'; }
        .testimonial-author { font-weight: 700; font-size: 0.9rem; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }
        .testimonial-meta { color: #9ca3af; font-size: 0.78rem; margin-top: 3px; }
        .blog-card { background: var(--dark); margin-bottom: 14px; border: 1px solid rgba(201,167,101,0.15); }
        .blog-image { width: 100%; height: 160px; overflow: hidden; }
        .blog-image img { width: 100%; height: 100%; object-fit: cover; }
        .blog-info { padding: 16px; }
        .blog-title { font-family: 'Playfair Display'; font-weight: 700; font-size: 1.1rem; color: var(--primary); margin-bottom: 6px; }
        .blog-date { color: #9ca3af; font-size: 0.78rem; }
        .gallery { margin-bottom: 18px; }
        .gallery-name { font-family: 'Playfair Display'; font-weight: 600; margin-bottom: 12px; color: var(--primary); }
        .gallery-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
        .gallery-img { aspect-ratio: 1; overflow: hidden; background: var(--dark); cursor: pointer; }
        .gallery-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .gallery-img:hover img { transform: scale(1.1); }
        .custom-link { background: var(--dark); border: 1px solid rgba(201,167,101,0.2); padding: 16px 20px; display: flex; align-items: center; gap: 14px; text-decoration: none; color: #e5e7eb; margin-bottom: 8px; transition: all 0.3s; }
        .custom-link:hover { border-color: var(--primary); transform: translateX(5px); }
        .custom-link i { color: var(--primary); font-size: 1.2rem; }
        .custom-link span { font-weight: 600; }
        .social-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .social-icon { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; color: var(--dark); font-size: 1.4rem; text-decoration: none; background: var(--primary); transition: all 0.3s; }
        .social-icon:hover { background: #d4b878; transform: translateY(-3px); }
        .inquiry-form { background: var(--dark); padding: 24px; border: 1px solid rgba(201,167,101,0.2); }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 0.78rem; font-weight: 600; margin-bottom: 8px; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px 14px; border: 1px solid rgba(201,167,101,0.3); background: #000; color: #e5e7eb; font-family: inherit; font-size: 0.9rem; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--primary); }
        .submit-btn { background: var(--primary); color: var(--dark); padding: 14px 24px; border: none; font-weight: 700; cursor: pointer; width: 100%; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s; }
        .submit-btn:hover { background: #d4b878; }
        .vcard-footer { text-align: center; padding: 30px; color: #6b7280; font-size: 0.78rem; border-top: 1px solid rgba(201,167,101,0.2); }
        .vcard-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }
        .view-counter { display: inline-flex; align-items: center; gap: 6px; color: var(--primary); margin-bottom: 15px; font-weight: 600; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; }
    </style>
</head>
<body>
<div class="vcard-container">
    <div class="cover-section">
        <?php if ($vcard['cover_image']): ?><img src="<?= imgUrl($vcard['cover_image']) ?>" alt="Cover"><?php endif; ?>
    </div>

    <div class="profile-section">
        <div class="profile-photo">
            <?php if ($vcard['profile_image']): ?>
                <img src="<?= imgUrl($vcard['profile_image']) ?>" alt="<?= htmlspecialchars($fullName) ?>">
            <?php else: ?>
                <div class="placeholder"><?= strtoupper(substr($fullName, 0, 1)) ?></div>
            <?php endif; ?>
        </div>
        <h1 class="profile-name"><?= htmlspecialchars($fullName) ?></h1>
        <?php if (!empty($vcard['occupation'])): ?><p class="profile-title"><?= htmlspecialchars($vcard['occupation']) ?></p><?php endif; ?>
        <div class="profile-divider"></div>
        <?php if (!empty($vcard['company'])): ?><p class="profile-company"><?= htmlspecialchars($vcard['company']) ?></p><?php endif; ?>
        <?php if (!empty($vcard['description'])): ?><div class="profile-desc"><?= $vcard['description'] ?></div><?php endif; ?>

        <a href="javascript:saveContact()" class="save-contact-btn"><i class="fas fa-user-plus"></i> Save Contact</a>
    </div>

    <div class="quick-actions">
        <?php if (!empty($vcard['phone'])): ?>
            <a href="tel:<?= htmlspecialchars($vcard['phone']) ?>" class="quick-action"><i class="fas fa-phone"></i><span>Call</span></a>
            <a href="https://wa.me/<?= preg_replace('/\D/', '', $vcard['phone']) ?>" target="_blank" class="quick-action"><i class="fab fa-whatsapp"></i><span>WhatsApp</span></a>
        <?php endif; ?>
        <?php if (!empty($vcard['email'])): ?>
            <a href="mailto:<?= htmlspecialchars($vcard['email']) ?>" class="quick-action"><i class="fas fa-envelope"></i><span>Email</span></a>
        <?php endif; ?>
        <?php if (!empty($vcard['location_url']) || !empty($vcard['location'])): ?>
            <a href="<?= !empty($vcard['location_url']) ? htmlspecialchars($vcard['location_url']) : 'https://maps.google.com/?q=' . urlencode($vcard['location']) ?>" target="_blank" class="quick-action"><i class="fas fa-map-marker-alt"></i><span>Office</span></a>
        <?php endif; ?>
        <a href="javascript:shareCard()" class="quick-action"><i class="fas fa-share-alt"></i><span>Share</span></a>
    </div>

    <?php include __DIR__ . '/_sections.php'; ?>

    <div class="vcard-footer">
        <div class="view-counter"><i class="fas fa-eye"></i> <?= number_format((int)$vcard['view_count']) ?> Profile Views</div>
        <p>Powered by <a href="/">Tapify</a></p>
        <p style="margin-top:5px;font-size:0.7rem;">© <?= date('Y') ?> All Rights Reserved</p>
    </div>
</div>

<?php include __DIR__ . '/_shared-scripts.php'; ?>
</body>
</html>
