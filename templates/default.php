<?php
/**
 * DEFAULT TEMPLATE - Purple gradient
 * Used as fallback for vcard1, vcard2 and any unknown templates
 */
$primaryColor = $vcard['primary_color'] ?? '#8338ec';
$bgColor = $vcard['bg_color'] ?? '#ffffff';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($fullName) ?> - <?= htmlspecialchars($vcard['occupation'] ?? '') ?></title>
    <meta name="description" content="<?= htmlspecialchars(strip_tags($vcard['description'] ?? '')) ?>">
    <link rel="icon" type="image/png" href="<?= $vcard['favicon_image'] ? imgUrl($vcard['favicon_image']) : '/images/tapify-logo-gold.png' ?>">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">

    <style>
        :root { --primary: <?= $primaryColor ?>; --bg: <?= $bgColor ?>; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh; color: #1a2035; }
        .vcard-container { max-width: 480px; margin: 0 auto; background: var(--bg); min-height: 100vh; box-shadow: 0 0 60px rgba(0,0,0,0.1); position: relative; overflow: hidden; }
        .cover-section { height: 220px; background: linear-gradient(135deg, var(--primary), #a855f7); position: relative; overflow: hidden; }
        .cover-section img { width: 100%; height: 100%; object-fit: cover; }
        .profile-section { text-align: center; margin-top: -60px; padding: 0 25px 25px; position: relative; z-index: 5; }
        .profile-photo { width: 130px; height: 130px; border-radius: 50%; border: 5px solid white; box-shadow: 0 10px 30px rgba(0,0,0,0.15); background: white; margin: 0 auto 15px; overflow: hidden; }
        .profile-photo img { width: 100%; height: 100%; object-fit: cover; }
        .profile-photo .placeholder { width: 100%; height: 100%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: 700; }
        .profile-name { font-size: 1.6rem; font-weight: 700; color: #1a2035; margin-bottom: 5px; }
        .profile-title { color: #6b7280; font-size: 1rem; margin-bottom: 8px; }
        .profile-company { color: var(--primary); font-size: 0.95rem; font-weight: 600; margin-bottom: 15px; }
        .profile-desc { color: #4b5563; font-size: 0.9rem; line-height: 1.6; margin-bottom: 20px; }
        .save-contact-btn { background: linear-gradient(135deg, var(--primary), #a855f7); color: white; padding: 14px 30px; border: none; border-radius: 50px; font-size: 1rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 25px rgba(131, 56, 236, 0.3); text-decoration: none; display: inline-flex; align-items: center; gap: 10px; transition: all 0.3s; }
        .save-contact-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(131, 56, 236, 0.4); }
        .quick-actions { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; padding: 0 25px 25px; }
        .quick-action { background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 14px; padding: 14px 8px; text-align: center; cursor: pointer; text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center; gap: 6px; transition: all 0.3s; }
        .quick-action:hover { border-color: var(--primary); background: rgba(131, 56, 236, 0.05); transform: translateY(-3px); }
        .quick-action i { font-size: 1.4rem; color: var(--primary); }
        .quick-action span { font-size: 0.72rem; font-weight: 600; color: #4b5563; }
        .quick-action.whatsapp i { color: #25D366; }
        .quick-action.call i { color: #3b82f6; }
        .quick-action.email i { color: #ef4444; }
        .quick-action.location i { color: #10b981; }
        .section { padding: 25px; border-top: 1px solid #f3f4f6; }
        .section-title { font-size: 1.1rem; font-weight: 700; color: #1a2035; margin-bottom: 18px; display: flex; align-items: center; gap: 10px; }
        .section-title i { color: var(--primary); }
        .services-list { display: flex; flex-direction: column; gap: 10px; }
        .service-item { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit; transition: all 0.3s; }
        .service-item:hover { border-color: var(--primary); background: rgba(131,56,236,0.05); transform: translateX(5px); }
        .service-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
        .products-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .product-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; text-decoration: none; color: inherit; transition: all 0.3s; }
        .product-card:hover { border-color: var(--primary); transform: translateY(-3px); }
        .product-image { width: 100%; aspect-ratio: 1; background: #e5e7eb; display: flex; align-items: center; justify-content: center; color: #9ca3af; overflow: hidden; }
        .product-image img { width: 100%; height: 100%; object-fit: cover; }
        .product-info { padding: 12px; }
        .product-name { font-weight: 600; font-size: 0.88rem; margin-bottom: 5px; }
        .product-price { color: var(--primary); font-weight: 700; }
        .hours-list { background: #f9fafb; border-radius: 12px; overflow: hidden; }
        .hours-row { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-size: 0.9rem; }
        .hours-row:last-child { border-bottom: none; }
        .hours-row.closed { color: #9ca3af; }
        .testimonial { background: #f9fafb; border-radius: 14px; padding: 18px; margin-bottom: 12px; border-left: 4px solid var(--primary); }
        .testimonial-stars { color: #fbbf24; margin-bottom: 8px; }
        .testimonial-msg { font-size: 0.92rem; line-height: 1.6; color: #4b5563; font-style: italic; margin-bottom: 10px; }
        .testimonial-author { font-weight: 700; font-size: 0.9rem; }
        .testimonial-meta { color: #6b7280; font-size: 0.78rem; }
        .blog-card { background: #f9fafb; border-radius: 14px; overflow: hidden; margin-bottom: 12px; border: 1px solid #e5e7eb; }
        .blog-image { width: 100%; height: 150px; background: linear-gradient(135deg, var(--primary), #a855f7); overflow: hidden; }
        .blog-image img { width: 100%; height: 100%; object-fit: cover; }
        .blog-info { padding: 14px; }
        .blog-title { font-weight: 700; font-size: 1rem; margin-bottom: 5px; }
        .blog-date { color: #6b7280; font-size: 0.78rem; }
        .gallery { margin-bottom: 18px; }
        .gallery-name { font-weight: 600; margin-bottom: 10px; }
        .gallery-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
        .gallery-img { aspect-ratio: 1; border-radius: 8px; overflow: hidden; background: #e5e7eb; cursor: pointer; }
        .gallery-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .gallery-img:hover img { transform: scale(1.1); }
        .custom-link { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 14px; text-decoration: none; color: inherit; margin-bottom: 8px; transition: all 0.3s; }
        .custom-link:hover { border-color: var(--primary); transform: translateX(5px); }
        .custom-link i { color: var(--primary); font-size: 1.2rem; }
        .custom-link span { font-weight: 600; }
        .social-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .social-icon { aspect-ratio: 1; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.4rem; text-decoration: none; transition: all 0.3s; }
        .social-icon:hover { transform: translateY(-5px) scale(1.1); }
        .social-Facebook { background: #1877F2; } .social-Instagram { background: linear-gradient(45deg,#f09433,#dc2743,#bc1888); } .social-Twitter { background: #1DA1F2; } .social-LinkedIn { background: #0077B5; } .social-WhatsApp { background: #25D366; } .social-YouTube { background: #FF0000; } .social-Pinterest { background: #E60023; } .social-TikTok { background: #000; } .social-Snapchat { background: #FFFC00; color: #000; }
        .inquiry-form { background: #f9fafb; border-radius: 14px; padding: 20px; }
        .form-group { margin-bottom: 14px; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; }
        .form-group input, .form-group textarea { width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-family: inherit; font-size: 0.9rem; background: white; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(131,56,236,0.1); }
        .submit-btn { background: linear-gradient(135deg, var(--primary), #a855f7); color: white; padding: 12px 24px; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; width: 100%; font-size: 0.95rem; transition: all 0.3s; }
        .submit-btn:hover { transform: translateY(-2px); }
        .vcard-footer { text-align: center; padding: 25px; color: #9ca3af; font-size: 0.78rem; border-top: 1px solid #f3f4f6; }
        .vcard-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }
        .view-counter { display: inline-flex; align-items: center; gap: 6px; background: rgba(131,56,236,0.08); padding: 4px 12px; border-radius: 50px; font-size: 0.75rem; color: var(--primary); margin-bottom: 12px; font-weight: 600; }
        @media (max-width: 480px) { .vcard-container { box-shadow: none; } }
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
        <?php if (!empty($vcard['company'])): ?><p class="profile-company"><i class="fas fa-building"></i> <?= htmlspecialchars($vcard['company']) ?></p><?php endif; ?>
        <?php if (!empty($vcard['description'])): ?><div class="profile-desc"><?= $vcard['description'] ?></div><?php endif; ?>

        <a href="javascript:saveContact()" class="save-contact-btn"><i class="fas fa-user-plus"></i> Save to Contacts</a>
    </div>

    <div class="quick-actions">
        <?php if (!empty($vcard['phone'])): ?>
            <a href="tel:<?= htmlspecialchars($vcard['phone']) ?>" class="quick-action call"><i class="fas fa-phone"></i><span>Call</span></a>
            <a href="https://wa.me/<?= preg_replace('/\D/', '', $vcard['phone']) ?>" target="_blank" class="quick-action whatsapp"><i class="fab fa-whatsapp"></i><span>WhatsApp</span></a>
        <?php endif; ?>
        <?php if (!empty($vcard['email'])): ?>
            <a href="mailto:<?= htmlspecialchars($vcard['email']) ?>" class="quick-action email"><i class="fas fa-envelope"></i><span>Email</span></a>
        <?php endif; ?>
        <?php if (!empty($vcard['location_url']) || !empty($vcard['location'])): ?>
            <a href="<?= !empty($vcard['location_url']) ? htmlspecialchars($vcard['location_url']) : 'https://maps.google.com/?q=' . urlencode($vcard['location']) ?>" target="_blank" class="quick-action location"><i class="fas fa-map-marker-alt"></i><span>Location</span></a>
        <?php endif; ?>
        <a href="javascript:shareCard()" class="quick-action"><i class="fas fa-share-alt"></i><span>Share</span></a>
    </div>

    <?php include __DIR__ . '/_sections.php'; ?>

    <div class="vcard-footer">
        <div class="view-counter"><i class="fas fa-eye"></i> <?= number_format((int)$vcard['view_count']) ?> views</div>
        <p>Powered by <a href="/">Tapify</a></p>
        <p style="margin-top:5px;font-size:0.7rem;">© <?= date('Y') ?></p>
    </div>
</div>

<?php include __DIR__ . '/_shared-scripts.php'; ?>
</body>
</html>
