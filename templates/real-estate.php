<?php
/**
 * REAL ESTATE TEMPLATE - Luxury Elegant
 * Best for: Real Estate Agents, Brokers, Property Consultants
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($fullName) ?></title>
    <meta name="description" content="<?= htmlspecialchars(strip_tags($vcard['description'] ?? '')) ?>">
    <link rel="icon" type="image/png" href="<?= $vcard['favicon_image'] ? imgUrl($vcard['favicon_image']) : '/images/tapify-logo-gold.png' ?>">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        :root { --primary: #0f172a; --accent: #b8860b; --bg: #f8fafc; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; background: #e2e8f0; min-height: 100vh; color: #0f172a; }
        .vcard-container { max-width: 480px; margin: 0 auto; background: white; min-height: 100vh; box-shadow: 0 0 80px rgba(15,23,42,0.15); }
        .cover-section { height: 280px; background: linear-gradient(135deg, var(--primary), #1e293b); position: relative; overflow: hidden; }
        .cover-section::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, transparent, rgba(15,23,42,0.4)); }
        .cover-section img { width: 100%; height: 100%; object-fit: cover; }
        .top-badge { position: absolute; top: 20px; left: 20px; right: 20px; display: flex; justify-content: space-between; z-index: 5; }
        .agent-badge { background: var(--accent); color: white; padding: 6px 14px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
        .luxury-tag { background: rgba(255,255,255,0.95); color: var(--primary); padding: 6px 14px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
        .profile-section { text-align: center; margin-top: -70px; padding: 0 30px 30px; position: relative; z-index: 5; background: white; }
        .profile-photo { width: 140px; height: 140px; border-radius: 0; border: 6px solid white; box-shadow: 0 10px 40px rgba(15,23,42,0.2); background: white; margin: 0 auto 20px; overflow: hidden; }
        .profile-photo img { width: 100%; height: 100%; object-fit: cover; }
        .profile-photo .placeholder { width: 100%; height: 100%; background: var(--primary); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 3rem; font-family: 'Cormorant Garamond'; font-weight: 700; }
        .profile-name { font-family: 'Cormorant Garamond'; font-size: 2rem; font-weight: 600; color: var(--primary); margin-bottom: 5px; letter-spacing: 1px; }
        .profile-title { color: var(--accent); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 12px; font-weight: 600; }
        .profile-divider { width: 80px; height: 1px; background: var(--accent); margin: 18px auto; position: relative; }
        .profile-divider::before { content: '◆'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; color: var(--accent); padding: 0 8px; font-size: 0.7rem; }
        .profile-company { color: #475569; font-size: 0.9rem; margin-bottom: 15px; }
        .profile-desc { color: #475569; font-size: 0.92rem; line-height: 1.7; margin-bottom: 25px; font-family: 'Cormorant Garamond'; font-size: 1.1rem; font-style: italic; }
        .save-contact-btn { background: var(--primary); color: white; padding: 14px 35px; border: 1px solid var(--accent); border-radius: 0; font-size: 0.78rem; font-weight: 700; cursor: pointer; box-shadow: 0 8px 20px rgba(15,23,42,0.2); text-decoration: none; display: inline-flex; align-items: center; gap: 12px; text-transform: uppercase; letter-spacing: 3px; transition: all 0.3s; }
        .save-contact-btn:hover { background: var(--accent); border-color: var(--accent); transform: translateY(-2px); }
        .quick-actions { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; padding: 0; background: #e2e8f0; }
        .quick-action { background: white; padding: 18px 8px; text-align: center; text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.3s; }
        .quick-action:hover { background: var(--primary); color: white; }
        .quick-action:hover i { color: var(--accent); }
        .quick-action i { font-size: 1.3rem; color: var(--primary); }
        .quick-action span { font-size: 0.65rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
        .quick-action:hover span { color: white; }
        .section { padding: 30px; border-top: 1px solid #e2e8f0; }
        .section-title { font-family: 'Cormorant Garamond'; font-size: 1.6rem; font-weight: 600; color: var(--primary); margin-bottom: 20px; text-align: center; position: relative; padding-bottom: 12px; }
        .section-title::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 40px; height: 2px; background: var(--accent); }
        .section-title i { display: none; }
        .services-list { display: flex; flex-direction: column; gap: 12px; }
        .service-item { background: var(--bg); padding: 18px; display: flex; align-items: center; gap: 14px; text-decoration: none; color: inherit; transition: all 0.3s; border-left: 3px solid transparent; }
        .service-item:hover { border-left-color: var(--accent); background: white; box-shadow: 0 4px 15px rgba(15,23,42,0.08); }
        .service-icon { width: 44px; height: 44px; background: var(--primary); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: 'Cormorant Garamond'; flex-shrink: 0; }
        .products-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .product-card { background: var(--bg); overflow: hidden; text-decoration: none; color: inherit; transition: all 0.3s; }
        .product-card:hover { box-shadow: 0 10px 25px rgba(15,23,42,0.12); }
        .product-image { width: 100%; aspect-ratio: 4/3; background: #cbd5e1; display: flex; align-items: center; justify-content: center; color: #94a3b8; overflow: hidden; }
        .product-image img { width: 100%; height: 100%; object-fit: cover; }
        .product-info { padding: 14px; }
        .product-name { font-weight: 600; font-size: 0.9rem; margin-bottom: 5px; color: var(--primary); }
        .product-price { color: var(--accent); font-weight: 700; font-family: 'Cormorant Garamond'; font-size: 1.2rem; }
        .hours-list { background: var(--bg); }
        .hours-row { display: flex; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 0.88rem; }
        .hours-row:last-child { border-bottom: none; }
        .hours-row.closed { color: #94a3b8; }
        .hours-day { font-weight: 600; color: var(--primary); text-transform: uppercase; font-size: 0.78rem; letter-spacing: 1px; }
        .testimonial { background: var(--bg); padding: 25px; margin-bottom: 14px; position: relative; border: 1px solid #e2e8f0; }
        .testimonial::before { content: '"'; position: absolute; top: -20px; left: 20px; font-family: 'Cormorant Garamond'; font-size: 5rem; color: var(--accent); }
        .testimonial-stars { color: var(--accent); margin-bottom: 10px; }
        .testimonial-msg { font-family: 'Cormorant Garamond'; font-size: 1.1rem; line-height: 1.6; color: #334155; font-style: italic; margin-bottom: 12px; }
        .testimonial-author { font-weight: 700; font-size: 0.85rem; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }
        .testimonial-meta { color: #64748b; font-size: 0.78rem; margin-top: 3px; }
        .blog-card { background: var(--bg); margin-bottom: 14px; overflow: hidden; }
        .blog-image { width: 100%; height: 180px; overflow: hidden; }
        .blog-image img { width: 100%; height: 100%; object-fit: cover; }
        .blog-info { padding: 18px; }
        .blog-title { font-family: 'Cormorant Garamond'; font-weight: 600; font-size: 1.3rem; color: var(--primary); margin-bottom: 6px; }
        .blog-date { color: #64748b; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; }
        .gallery { margin-bottom: 18px; }
        .gallery-name { font-family: 'Cormorant Garamond'; font-weight: 600; font-size: 1.2rem; margin-bottom: 12px; color: var(--primary); }
        .gallery-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
        .gallery-img { aspect-ratio: 1; overflow: hidden; background: var(--bg); cursor: pointer; }
        .gallery-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .gallery-img:hover img { transform: scale(1.1); }
        .custom-link { background: var(--bg); padding: 16px 20px; display: flex; align-items: center; gap: 14px; text-decoration: none; color: inherit; margin-bottom: 8px; transition: all 0.3s; border-left: 3px solid transparent; }
        .custom-link:hover { border-left-color: var(--accent); }
        .custom-link i { color: var(--accent); font-size: 1.2rem; }
        .custom-link span { font-weight: 600; }
        .social-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: #e2e8f0; }
        .social-icon { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.3rem; text-decoration: none; transition: all 0.3s; }
        .social-icon:hover { transform: scale(1.05); }
        .social-Facebook { background: #1877F2; } .social-Instagram { background: linear-gradient(45deg,#f09433,#dc2743); } .social-Twitter { background: #1DA1F2; } .social-LinkedIn { background: #0077B5; } .social-WhatsApp { background: #25D366; } .social-YouTube { background: #FF0000; } .social-Pinterest { background: #E60023; } .social-TikTok { background: #000; } .social-Snapchat { background: #FFFC00; color: #000; }
        .inquiry-form { background: var(--bg); padding: 30px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 0.72rem; font-weight: 700; margin-bottom: 8px; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; background: white; font-family: inherit; font-size: 0.9rem; border-radius: 0; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--accent); }
        .submit-btn { background: var(--primary); color: white; padding: 14px 24px; border: 1px solid var(--accent); font-weight: 700; cursor: pointer; width: 100%; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 3px; transition: all 0.3s; }
        .submit-btn:hover { background: var(--accent); border-color: var(--accent); }
        .vcard-footer { text-align: center; padding: 30px; color: #94a3b8; font-size: 0.78rem; border-top: 1px solid #e2e8f0; }
        .vcard-footer a { color: var(--accent); text-decoration: none; font-weight: 600; }
        .view-counter { display: inline-flex; align-items: center; gap: 8px; color: var(--accent); margin-bottom: 15px; font-weight: 700; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 2px; }
    </style>
</head>
<body>
<div class="vcard-container">
    <div class="cover-section">
        <?php if ($vcard['cover_image']): ?><img src="<?= imgUrl($vcard['cover_image']) ?>" alt="Cover"><?php endif; ?>
        <div class="top-badge">
            <span class="agent-badge">Realtor</span>
            <span class="luxury-tag">Luxury</span>
        </div>
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
        <?php if (!empty($vcard['company'])): ?><p class="profile-company"><i class="fas fa-building"></i> <?= htmlspecialchars($vcard['company']) ?></p><?php endif; ?>
        <?php if (!empty($vcard['description'])): ?><div class="profile-desc"><?= $vcard['description'] ?></div><?php endif; ?>

        <a href="javascript:saveContact()" class="save-contact-btn"><i class="fas fa-bookmark"></i> Save Contact</a>
    </div>

    <div class="quick-actions">
        <?php if (!empty($vcard['phone'])): ?>
            <a href="tel:<?= htmlspecialchars($vcard['phone']) ?>" class="quick-action"><i class="fas fa-phone"></i><span>Call</span></a>
            <a href="https://wa.me/<?= preg_replace('/\D/', '', $vcard['phone']) ?>" target="_blank" class="quick-action"><i class="fab fa-whatsapp"></i><span>Chat</span></a>
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
        <div class="view-counter"><i class="fas fa-eye"></i> <?= number_format((int)$vcard['view_count']) ?> Views</div>
        <p>Powered by <a href="/">Tapify</a></p>
        <p style="margin-top:5px;font-size:0.7rem;">© <?= date('Y') ?> | All Rights Reserved</p>
    </div>
</div>

<?php include __DIR__ . '/_shared-scripts.php'; ?>
</body>
</html>
