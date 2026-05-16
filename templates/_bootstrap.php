<?php
/**
 * Template bootstrap — loads registry entry and renders or includes legacy file.
 * Expects $vcard, $fullName, $vcardId, and related data from vcard.php.
 */
if (!isset($vcard, $fullName, $vcardId)) {
    http_response_code(500);
    die('<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:40px"><h1>Template Error</h1><p>Missing vCard context.</p></body></html>');
}

$slug = $TAPIFY_TEMPLATE_SLUG ?? 'vcard1';
$registry = require __DIR__ . '/_theme-registry.php';
$theme = $registry[$slug] ?? null;

if (!$theme) {
    http_response_code(500);
    echo '<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:40px">';
    echo '<h1>Unknown Template</h1><p>Template <code>' . htmlspecialchars($slug) . '</code> is not registered.</p>';
    echo '</body></html>';
    return;
}

$TAPIFY_THEME = $theme;
$TAPIFY_THEME['slug'] = $slug;

if (($theme['layout'] ?? '') === 'legacy' && !empty($theme['legacy'])) {
    $legacyFile = __DIR__ . '/' . preg_replace('/[^a-z0-9_-]/', '', $theme['legacy']) . '.php';
    if (is_file($legacyFile)) {
        include $legacyFile;
        return;
    }
    $TAPIFY_THEME['layout'] = 'classic';
    $TAPIFY_THEME['primary'] = $vcard['primary_color'] ?? '#8338ec';
    $TAPIFY_THEME['secondary'] = $vcard['secondary_color'] ?? '#a855f7';
    $TAPIFY_THEME['bg'] = $vcard['bg_color'] ?? '#ffffff';
    $TAPIFY_THEME['surface'] = '#f9fafb';
    $TAPIFY_THEME['font'] = 'poppins';
}

require __DIR__ . '/_render.php';
