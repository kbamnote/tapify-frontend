<?php
/**
 * Unified vCard template renderer — unique layout per theme via CSS + structure variants.
 */
$theme = $TAPIFY_THEME;
$layout = $theme['layout'] ?? 'classic';
$isDark = !empty($theme['dark']);

$primary = $vcard['primary_color'] ?? ($theme['primary'] ?? '#8338ec');
$secondary = $vcard['secondary_color'] ?? ($theme['secondary'] ?? '#a855f7');
$bg = $vcard['bg_color'] ?? ($theme['bg'] ?? '#ffffff');
$surface = $theme['surface'] ?? ($isDark ? '#1f2937' : '#f9fafb');
$text = $isDark ? '#f3f4f6' : '#1a2035';
$muted = $isDark ? '#9ca3af' : '#6b7280';

$fonts = [
    'poppins' => 'Poppins:wght@300;400;500;600;700;800',
    'inter' => 'Inter:wght@300;400;500;600;700',
    'montserrat' => 'Montserrat:wght@300;400;500;600;700',
    'raleway' => 'Raleway:wght@300;400;500;600;700',
    'playfair' => 'Playfair+Display:wght@400;600;700',
    'lora' => 'Lora:wght@400;500;600;700',
    'oswald' => 'Oswald:wght@400;500;600;700',
    'merriweather' => 'Merriweather:wght@300;400;700',
    'cormorant' => 'Cormorant+Garamond:wght@400;500;600;700',
    'nunito' => 'Nunito:wght@300;400;600;700',
    'open-sans' => 'Open+Sans:wght@300;400;600;700',
    'roboto' => 'Roboto:wght@300;400;500;700',
];
$fontKey = $theme['font'] ?? 'poppins';
$fontQuery = $fonts[$fontKey] ?? $fonts['poppins'];
$headingFont = in_array($fontKey, ['playfair', 'cormorant', 'merriweather', 'lora'], true) ? "'{$fontKey}', serif" : "'Poppins', sans-serif";

$coverH = match ($layout) {
    'luxury', 'legacy', 'photo' => '280px',
    'minimal', 'bio-light', 'bio-dark' => '120px',
    'bold', 'wave' => '260px',
    default => '220px',
};

$profileClass = match ($layout) {
    'portfolio', 'photo', 'architect' => 'profile-photo shape-square',
    'soft', 'playful', 'nature' => 'profile-photo shape-rounded',
    default => 'profile-photo shape-circle',
};

$containerExtra = 'layout-' . preg_replace('/[^a-z0-9-]/', '', $layout);
if ($isDark) $containerExtra .= ' theme-dark';

$badgeHtml = '';
if ($layout === 'clinic') {
    $badgeHtml = '<span class="profile-badge"><i class="fas fa-paw"></i> Pet Care</span>';
} elseif ($layout === 'education') {
    $badgeHtml = '<span class="profile-badge"><i class="fas fa-graduation-cap"></i> Education</span>';
} elseif ($layout === 'tech') {
    $badgeHtml = '<span class="profile-badge"><i class="fas fa-code"></i> Developer</span>';
} elseif ($layout === 'wedding') {
    $badgeHtml = '<span class="profile-badge"><i class="fas fa-heart"></i> Events</span>';
}

$saveLabel = match ($layout) {
    'luxury', 'legacy' => 'Save Contact',
    'transport' => 'Book Ride',
    'retail' => 'Shop Now',
    default => 'Save to Contacts',
};
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($fullName) ?> - <?= htmlspecialchars($vcard['occupation'] ?? $theme['name'] ?? '') ?></title>
    <meta name="description" content="<?= htmlspecialchars(strip_tags($vcard['description'] ?? '')) ?>">
    <link rel="icon" type="image/png" href="<?= $vcard['favicon_image'] ? imgUrl($vcard['favicon_image']) : '/images/tapify-logo-gold.png' ?>">
    <link href="https://fonts.googleapis.com/css2?family=<?= $fontQuery ?>&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --primary: <?= htmlspecialchars($primary) ?>;
            --secondary: <?= htmlspecialchars($secondary) ?>;
            --bg: <?= htmlspecialchars($bg) ?>;
            --surface: <?= htmlspecialchars($surface) ?>;
            --text: <?= htmlspecialchars($text) ?>;
            --muted: <?= htmlspecialchars($muted) ?>;
            --cover-h: <?= $coverH ?>;
            --font-heading: <?= $headingFont ?>;
        }
<?php
echo file_get_contents(__DIR__ . '/_theme-base.css');
echo file_get_contents(__DIR__ . '/_theme-layouts.css');
?>
        <?= $vcard['custom_css'] ?? '' ?>
    </style>
</head>
<body class="<?= $isDark ? 'body-dark' : '' ?>">
<div class="vcard-container <?= htmlspecialchars($containerExtra) ?>" data-template="<?= htmlspecialchars($theme['slug']) ?>">

    <?php if ($layout === 'split'): ?>
    <div class="split-header">
        <div class="split-cover cover-section">
            <?php if ($vcard['cover_image']): ?><img src="<?= imgUrl($vcard['cover_image']) ?>" alt="Cover"><?php endif; ?>
        </div>
        <div class="split-profile profile-section">
    <?php elseif ($layout === 'sidebar'): ?>
    <div class="sidebar-accent"></div>
    <div class="cover-section"><?php if ($vcard['cover_image']): ?><img src="<?= imgUrl($vcard['cover_image']) ?>" alt="Cover"><?php endif; ?></div>
    <div class="profile-section">
    <?php elseif ($layout === 'minimal' || $layout === 'bio-light' || $layout === 'bio-dark'): ?>
    <div class="cover-section cover-minimal"></div>
    <div class="profile-section profile-minimal">
    <?php elseif ($layout === 'social' || $layout === 'social-grid'): ?>
    <div class="social-hero">
        <div class="cover-section"><?php if ($vcard['cover_image']): ?><img src="<?= imgUrl($vcard['cover_image']) ?>" alt="Cover"><?php endif; ?></div>
    </div>
    <div class="profile-section">
    <?php else: ?>
    <div class="cover-section">
        <?php if ($vcard['cover_image']): ?><img src="<?= imgUrl($vcard['cover_image']) ?>" alt="Cover"><?php endif; ?>
        <?php if ($layout === 'luxury'): ?>
        <div class="top-badge"><span class="agent-badge">Premium</span><span class="luxury-tag"><?= htmlspecialchars($vcard['occupation'] ?: 'Professional') ?></span></div>
        <?php endif; ?>
    </div>
    <div class="profile-section <?= $layout === 'floating' ? 'profile-floating' : '' ?>">
    <?php endif; ?>

        <div class="<?= $profileClass ?>">
            <?php if ($vcard['profile_image']): ?>
                <img src="<?= imgUrl($vcard['profile_image']) ?>" alt="<?= htmlspecialchars($fullName) ?>">
            <?php else: ?>
                <div class="placeholder"><?= strtoupper(substr($fullName, 0, 1)) ?></div>
            <?php endif; ?>
        </div>
        <?= $badgeHtml ?>
        <h1 class="profile-name"><?= htmlspecialchars($fullName) ?></h1>
        <?php if (!empty($vcard['occupation'])): ?><p class="profile-title"><?= htmlspecialchars($vcard['occupation']) ?></p><?php endif; ?>
        <?php if (!empty($vcard['company'])): ?><p class="profile-company"><i class="fas fa-building"></i> <?= htmlspecialchars($vcard['company']) ?></p><?php endif; ?>
        <?php if (!empty($vcard['description'])): ?><div class="profile-desc"><?= $vcard['description'] ?></div><?php endif; ?>

        <a href="javascript:saveContact()" class="save-contact-btn"><i class="fas fa-user-plus"></i> <?= htmlspecialchars($saveLabel) ?></a>
    </div>

    <?php if ($layout === 'split'): ?></div><?php endif; ?>

    <div class="quick-actions <?= in_array($layout, ['social-stack', 'transport'], true) ? 'quick-actions-row' : '' ?>">
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

    <?php if ($layout === 'social-stack' && count($socialLinks) > 0): ?>
    <div class="section social-highlight">
        <h3 class="section-title"><i class="fas fa-share-nodes"></i> Follow</h3>
        <div class="social-grid social-grid-large">
            <?php
            $iconMap = ['Facebook'=>'fab fa-facebook-f','Instagram'=>'fab fa-instagram','Twitter'=>'fab fa-twitter','LinkedIn'=>'fab fa-linkedin-in','WhatsApp'=>'fab fa-whatsapp','YouTube'=>'fab fa-youtube'];
            foreach ($socialLinks as $sl):
                $iconClass = $iconMap[$sl['platform']] ?? 'fas fa-link';
            ?>
            <a href="<?= htmlspecialchars($sl['url']) ?>" target="_blank" class="social-icon social-<?= htmlspecialchars($sl['platform']) ?>"><i class="<?= $iconClass ?>"></i></a>
            <?php endforeach; ?>
        </div>
    </div>
    <?php endif; ?>

    <?php include __DIR__ . '/_sections.php'; ?>

    <div class="vcard-footer">
        <div class="view-counter"><i class="fas fa-eye"></i> <?= number_format((int)$vcard['view_count']) ?> views</div>
        <?php if (empty($vcard['remove_branding'])): ?>
        <p>Powered by <a href="/">Tapify</a></p>
        <?php endif; ?>
        <p class="footer-year">© <?= date('Y') ?></p>
    </div>
</div>

<?php include __DIR__ . '/_shared-scripts.php'; ?>
<?= $vcard['custom_js'] ?? '' ?>
</body>
</html>
