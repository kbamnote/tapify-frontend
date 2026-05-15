<?php
/**
 * RESTAURANT TEMPLATE - Warm Food Theme
 * Best for: Restaurants, Cafes, Food Businesses, Chefs
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
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        :root { --primary: #d97706; --primary-dark: #b45309; --accent: #fef3c7; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #fef3c7, #fed7aa); min-height: 100vh; color: #292524; }
        .vcard-container { max-width: 480px; margin: 0 auto; background: #fffbeb; min-height: 100vh; box-shadow: 0 0 60px rgba(217,119,6,0.2); }
        .cover-section { height: 240px; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); position: relative; overflow: hidden; }
        .cover-section::before { content: '\f2e7'; font-family: 'Font Awesome 6 Free'; font-weight: 900; position: absolute; right: -20px; top: -20px; font-size: 200px; color: white; opacity: 0.1; transform: rotate(-15deg); }
        .cover-section img { width: 100%; height: 100%; object-fit: cover; }
        .profile-section { text-align: center; margin-top: -60px; padding: 0 25px 25px; position: relative; z-index: 5; }
        .profile-photo { width: 140px; height: 140px; border-radius: 50%; border: 6px solid #fffbeb; box-shadow: 0 10px 30px rgba(217,119,6,0.3); background: white; margin: 0 auto 15px; overflow: hidden; }
        .profile-photo img { width: 100%; height: 100%; object-fit: cover; }
        .profile-photo .placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; display: flex; align-items: center; justify-content: center; font-size: 3rem; font-family: 'Pacifico'; }
        .profile-name { font-family: 'Pacifico'; font-size: 2.2rem; color: var(--primary); margin-bottom: 5px; }
        .profile-title { color: #78350f; font-size: 0.95rem; font-weight: 600; margin-bottom: 8px; }
        .profile-company { background: var(--accent); color: var(--primary-dark); padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin-bottom: 15px; }
        .profile-desc { color: #57534e; font-size: 0.9rem; line-height: 1.6; margin-bottom: 22px; }
        .save-contact-btn { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 14px 32px; border: none; border-radius: 50px; font-size: 1rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 25px rgba(217,119,6,0.3); text-decoration: none; display: inline-flex; align-items: center; gap: 10px; transition: all 0.3s; }
        .save-contact-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(217,119,6,0.4); }
        .quick-actions { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; padding: 0 25px 25px; }
        .quick-action { background: white; border: 2px dashed var(--accent); border-radius: 14px; padding: 14px 8px; text-align: center; text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center; gap: 6px; transition: all 0.3s; }
        .quick-action:hover { border-color: var(--primary); background: var(--accent); transform: translateY(-3px); }
        .quick-action i { font-size: 1.4rem; color: var(--primary); }
        .quick-action span { font-size: 0.72rem; font-weight: 600; color: #78350f; }
        .section { padding: 25px; border-top: 2px dashed var(--accent); }
        .section-title { font-family: 'Pacifico'; font-size: 1.6rem; color: var(--primary); margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
        .section-title i { color: var(--primary); font-size: 1.2rem; }
        .services-list, .products-grid { display: flex; flex-direction: column; gap: 10px; }
        .products-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .service-item { background: white; border: 2px solid var(--accent); border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit; transition: all 0.3s; }
        .service-item:hover { border-color: var(--primary); transform: translateX(5px); }
        .service-icon { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
        .product-card { background: white; border-radius: 14px; overflow: hidden; text-decoration: none; color: inherit; box-shadow: 0 4px 10px rgba(217,119,6,0.1); transition: all 0.3s; }
        .product-card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(217,119,6,0.2); }
        .product-image { width: 100%; aspect-ratio: 1; background: var(--accent); display: flex; align-items: center; justify-content: center; color: var(--primary); overflow: hidden; }
        .product-image img { width: 100%; height: 100%; object-fit: cover; }
        .product-info { padding: 12px; }
        .product-name { font-weight: 600; font-size: 0.88rem; margin-bottom: 5px; }
        .product-price { color: var(--primary); font-weight: 700; font-size: 1rem; }
        .hours-list { background: white; border: 2px solid var(--accent); border-radius: 14px; overflow: hidden; }
        .hours-row { display: flex; justify-content: space-between; padding: 14px 18px; border-bottom: 1px dashed var(--accent); font-size: 0.9rem; }
        .hours-row:last-child { border-bottom: none; }
        .hours-row.closed { color: #a8a29e; }
        .hours-day { font-weight: 600; color: var(--primary); }
        .testimonial { background: white; border-radius: 14px; padding: 20px; margin-bottom: 12px; border-left: 4px solid var(--primary); box-shadow: 0 4px 10px rgba(217,119,6,0.08); }
        .testimonial-stars { color: #fbbf24; margin-bottom: 8px; font-size: 1.1rem; }
        .testimonial-msg { font-size: 0.92rem; line-height: 1.6; color: #57534e; font-style: italic; margin-bottom: 10px; }
        .testimonial-author { font-weight: 700; font-size: 0.9rem; color: var(--primary); }
        .testimonial-meta { color: #78716c; font-size: 0.78rem; }
        .blog-card { background: white; border-radius: 14px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 4px 10px rgba(217,119,6,0.08); }
        .blog-image { width: 100%; height: 160px; background: var(--accent); overflow: hidden; }
        .blog-image img { width: 100%; height: 100%; object-fit: cover; }
        .blog-info { padding: 16px; }
        .blog-title { font-family: 'Pacifico'; font-weight: 400; font-size: 1.3rem; color: var(--primary); margin-bottom: 5px; }
        .blog-date { color: #78716c; font-size: 0.78rem; }
        .gallery { margin-bottom: 18px; }
        .gallery-name { font-family: 'Pacifico'; font-size: 1.2rem; color: var(--primary); margin-bottom: 12px; }
        .gallery-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
        .gallery-img { aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: var(--accent); cursor: pointer; }
        .gallery-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .gallery-img:hover img { transform: scale(1.1); }
        .custom-link { background: white; border: 2px solid var(--accent); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 14px; text-decoration: none; color: inherit; margin-bottom: 8px; transition: all 0.3s; }
        .custom-link:hover { border-color: var(--primary); transform: translateX(5px); }
        .custom-link i { color: var(--primary); font-size: 1.2rem; }
        .custom-link span { font-weight: 600; }
        .social-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .social-icon { aspect-ratio: 1; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.4rem; text-decoration: none; transition: all 0.3s; }
        .social-icon:hover { transform: translateY(-5px) scale(1.1); }
        .social-Facebook { background: #1877F2; } .social-Instagram { background: linear-gradient(45deg,#f09433,#dc2743); } .social-Twitter { background: #1DA1F2; } .social-LinkedIn { background: #0077B5; } .social-WhatsApp { background: #25D366; } .social-YouTube { background: #FF0000; } .social-Pinterest { background: #E60023; } .social-TikTok { background: #000; } .social-Snapchat { background: #FFFC00; color: #000; }
        .inquiry-form { background: white; border-radius: 14px; padding: 22px; box-shadow: 0 4px 10px rgba(217,119,6,0.1); }
        .form-group { margin-bottom: 14px; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--primary-dark); }
        .form-group input, .form-group textarea { width: 100%; padding: 11px 14px; border: 2px solid var(--accent); border-radius: 10px; font-family: inherit; font-size: 0.9rem; background: #fffbeb; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--primary); }
        .submit-btn { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 14px 24px; border: none; border-radius: 50px; font-weight: 700; cursor: pointer; width: 100%; font-size: 0.95rem; transition: all 0.3s; }
        .submit-btn:hover { transform: translateY(-2px); }
        .vcard-footer { text-align: center; padding: 25px; color: #a8a29e; font-size: 0.78rem; border-top: 2px dashed var(--accent); }
        .vcard-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }
        .view-counter { display: inline-flex; align-items: center; gap: 6px; background: var(--accent); padding: 4px 12px; border-radius: 50px; font-size: 0.75rem; color: var(--primary-dark); margin-bottom: 12px; font-weight: 600; }
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
        <?php if (!empty($vcard['occupation'])): ?><p class="profile-title"><i class="fas fa-utensils"></i> <?= htmlspecialchars($vcard['occupation']) ?></p><?php endif; ?>
        <?php if (!empty($vcard['company'])): ?><p class="profile-company"><?= htmlspecialchars($vcard['company']) ?></p><?php endif; ?>
        <?php if (!empty($vcard['description'])): ?><div class="profile-desc"><?= $vcard['description'] ?></div><?php endif; ?>

        <a href="javascript:saveContact()" class="save-contact-btn"><i class="fas fa-bookmark"></i> Save Contact</a>
    </div>

    <div class="quick-actions">
        <?php if (!empty($vcard['phone'])): ?>
            <a href="tel:<?= htmlspecialchars($vcard['phone']) ?>" class="quick-action"><i class="fas fa-phone"></i><span>Call</span></a>
            <a href="https://wa.me/<?= preg_replace('/\D/', '', $vcard['phone']) ?>" target="_blank" class="quick-action"><i class="fab fa-whatsapp"></i><span>Order</span></a>
        <?php endif; ?>
        <?php if (!empty($vcard['email'])): ?>
            <a href="mailto:<?= htmlspecialchars($vcard['email']) ?>" class="quick-action"><i class="fas fa-envelope"></i><span>Email</span></a>
        <?php endif; ?>
        <?php if (!empty($vcard['location_url']) || !empty($vcard['location'])): ?>
            <a href="<?= !empty($vcard['location_url']) ? htmlspecialchars($vcard['location_url']) : 'https://maps.google.com/?q=' . urlencode($vcard['location']) ?>" target="_blank" class="quick-action"><i class="fas fa-map-marker-alt"></i><span>Visit</span></a>
        <?php endif; ?>
        <a href="javascript:shareCard()" class="quick-action"><i class="fas fa-share-alt"></i><span>Share</span></a>
    </div>

    <?php include __DIR__ . '/_sections.php'; ?>

    <div class="vcard-footer">
        <div class="view-counter"><i class="fas fa-eye"></i> <?= number_format((int)$vcard['view_count']) ?> hungry visitors</div>
        <p>Powered by <a href="/">Tapify</a></p>
        <p style="margin-top:5px;font-size:0.7rem;">© <?= date('Y') ?></p>
    </div>
</div>

<?php include __DIR__ . '/_shared-scripts.php'; ?>
</body>
</html>
