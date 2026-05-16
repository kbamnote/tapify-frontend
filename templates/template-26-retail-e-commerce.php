<?php
// =====================================================
// Tapify vCard Template 26: Retail E-commerce
// CSS Class: vcard-twentysix
// CSS File: vcard26.css
// =====================================================
// Neeche variables mein apni info bharen:

$name          = 'Aapka Naam';
$occupation    = 'Aapka Profession';
$company       = 'Company Ka Naam';
$tagline       = 'Aapka Tagline';
$bio           = 'Apne baare mein likhein...';
$banner_image  = 'images/banner.jpg';
$profile_image = 'images/profile.jpg';
$phone1        = '+91 99999 99999';
$phone2        = '';
$email1        = 'aap@email.com';
$email2        = '';
$address       = 'Aapka Pata, Shehar, State';
$website       = 'https://aapkiwebsite.com';
$whatsapp      = '919999999999';
$facebook      = '';
$instagram     = '';
$twitter       = '';
$linkedin      = '';
$youtube       = '';
$template_id   = 26;
$template_class= 'vcard-twentysix';
$base_url      = 'https://tapifyworld.com';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php echo htmlspecialchars($name); ?> | vCard</title>
<link href="<?php echo $base_url; ?>/front/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="<?php echo $base_url; ?>/assets/css/vcard<?php echo $template_id; ?>.css">
<link rel="stylesheet" href="<?php echo $base_url; ?>/assets/css/slider/css/slick.css">
<link rel="stylesheet" href="<?php echo $base_url; ?>/assets/css/slider/css/slick-theme.min.css">
<link rel="stylesheet" href="<?php echo $base_url; ?>/assets/css/third-party.css">
<link rel="stylesheet" href="<?php echo $base_url; ?>/assets/css/style.css">
<link rel="stylesheet" href="<?php echo $base_url; ?>/assets/css/custom-vcard.css">
<link rel="stylesheet" href="<?php echo $base_url; ?>/assets/css/lightbox.css">
<link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
body{font-family:Poppins,sans-serif;margin:0;padding:0;}
.add-contact-btn{background:#007bff;color:#fff!important;padding:12px 30px;border-radius:50px;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:8px;}
.contact-btn{background:rgba(0,0,0,.06);border-radius:10px;padding:10px;text-decoration:none;color:inherit;display:flex;align-items:center;gap:8px;width:100%;margin-bottom:4px;}
.social-icon{width:42px;height:42px;border-radius:50%;background:rgba(0,0,0,.08);display:inline-flex;align-items:center;justify-content:center;text-decoration:none;color:inherit;font-size:16px;}
</style>
</head>
<body>
<div class="container p-0">
<div class="<?php echo $template_class; ?> main-content w-100 mx-auto overflow-hidden allSection">

<!-- BANNER + PROFILE -->
<div class="<?php echo $template_class; ?>__banner w-100 position-relative">
<?php if(!empty($banner_image)): ?>
<img src="<?php echo htmlspecialchars($banner_image); ?>" class="img-fluid banner-image w-100" alt="Banner" loading="lazy">
<?php endif; ?>
<div class="<?php echo $template_class; ?>__profile">
<div class="<?php echo $template_class; ?>__avatar">
<?php if(!empty($profile_image)): ?>
<img src="<?php echo htmlspecialchars($profile_image); ?>" class="img-fluid profile-image" alt="<?php echo htmlspecialchars($name); ?>">
<?php endif; ?>
</div>
<div class="<?php echo $template_class; ?>__position">
<h1><?php echo htmlspecialchars($name); ?></h1>
<p><?php echo htmlspecialchars($occupation); ?></p>
<?php if(!empty($company)): ?><p><?php echo htmlspecialchars($company); ?></p><?php endif; ?>
<?php if(!empty($tagline)): ?><p><em><?php echo htmlspecialchars($tagline); ?></em></p><?php endif; ?>
</div>
</div>
</div>

<!-- BIO -->
<?php if(!empty($bio)): ?>
<div class="<?php echo $template_class; ?>__about py-3 px-4">
<p class="text-center"><?php echo nl2br(htmlspecialchars($bio)); ?></p>
</div>
<?php endif; ?>

<!-- SOCIAL -->
<div class="<?php echo $template_class; ?>__social py-3 px-3">
<div class="d-flex flex-wrap justify-content-center gap-2">
<?php if(!empty($facebook)): ?><a href="<?php echo htmlspecialchars($facebook); ?>" class="social-icon" target="_blank"><i class="fab fa-facebook-f"></i></a><?php endif; ?>
<?php if(!empty($instagram)): ?><a href="<?php echo htmlspecialchars($instagram); ?>" class="social-icon" target="_blank"><i class="fab fa-instagram"></i></a><?php endif; ?>
<?php if(!empty($twitter)): ?><a href="<?php echo htmlspecialchars($twitter); ?>" class="social-icon" target="_blank"><i class="fab fa-x-twitter"></i></a><?php endif; ?>
<?php if(!empty($linkedin)): ?><a href="<?php echo htmlspecialchars($linkedin); ?>" class="social-icon" target="_blank"><i class="fab fa-linkedin-in"></i></a><?php endif; ?>
<?php if(!empty($youtube)): ?><a href="<?php echo htmlspecialchars($youtube); ?>" class="social-icon" target="_blank"><i class="fab fa-youtube"></i></a><?php endif; ?>
<?php if(!empty($whatsapp)): ?><a href="https://wa.me/<?php echo $whatsapp; ?>" class="social-icon" target="_blank"><i class="fab fa-whatsapp"></i></a><?php endif; ?>
</div>
</div>

<!-- CONTACT -->
<div class="<?php echo $template_class; ?>__contact py-4 px-4">
<h3 class="text-center mb-3">Contact</h3>
<div class="row g-2">
<?php if(!empty($phone1)): ?>
<div class="col-6"><a href="tel:<?php echo preg_replace('/[^0-9+]/','',$phone1); ?>" class="contact-btn"><i class="fas fa-phone-alt"></i><span><?php echo htmlspecialchars($phone1); ?></span></a></div>
<?php endif; ?>
<?php if(!empty($phone2)): ?>
<div class="col-6"><a href="tel:<?php echo preg_replace('/[^0-9+]/','',$phone2); ?>" class="contact-btn"><i class="fas fa-phone-alt"></i><span><?php echo htmlspecialchars($phone2); ?></span></a></div>
<?php endif; ?>
<?php if(!empty($email1)): ?>
<div class="col-6"><a href="mailto:<?php echo htmlspecialchars($email1); ?>" class="contact-btn"><i class="fas fa-envelope"></i><span><?php echo htmlspecialchars($email1); ?></span></a></div>
<?php endif; ?>
<?php if(!empty($email2)): ?>
<div class="col-6"><a href="mailto:<?php echo htmlspecialchars($email2); ?>" class="contact-btn"><i class="fas fa-envelope"></i><span><?php echo htmlspecialchars($email2); ?></span></a></div>
<?php endif; ?>
<?php if(!empty($address)): ?>
<div class="col-6"><a href="https://maps.google.com/?q=<?php echo urlencode($address); ?>" class="contact-btn" target="_blank"><i class="fas fa-map-marker-alt"></i><span><?php echo htmlspecialchars($address); ?></span></a></div>
<?php endif; ?>
<?php if(!empty($website)): ?>
<div class="col-6"><a href="<?php echo htmlspecialchars($website); ?>" class="contact-btn" target="_blank"><i class="fas fa-globe"></i><span><?php echo htmlspecialchars($website); ?></span></a></div>
<?php endif; ?>
<?php if(!empty($whatsapp)): ?>
<div class="col-6"><a href="https://wa.me/<?php echo $whatsapp; ?>" class="contact-btn" target="_blank"><i class="fab fa-whatsapp"></i><span>WhatsApp</span></a></div>
<?php endif; ?>
</div>
</div>

<!-- ADD TO CONTACT -->
<div class="py-4 text-center">
<a href="contact.vcf" download class="add-contact-btn"><i class="fas fa-address-card"></i> Add to Contact</a>
</div>

<!-- FOOTER -->
<div class="py-3 text-center" style="border-top:1px solid rgba(0,0,0,.1)">
<p class="text-muted small mb-0">&copy; <?php echo date('Y'); ?> <?php echo htmlspecialchars($name); ?></p>
</div>

</div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="<?php echo $base_url; ?>/front/js/bootstrap.bundle.min.js"></script>
<script src="<?php echo $base_url; ?>/assets/js/slider/js/slick.min.js"></script>
<script src="<?php echo $base_url; ?>/assets/js/front-third-party.js"></script>
<script src="<?php echo $base_url; ?>/assets/js/custom/helpers.js"></script>
<script src="<?php echo $base_url; ?>/assets/js/custom/custom.js"></script>
<script src="<?php echo $base_url; ?>/assets/js/vcards/vcard-view.js"></script>
<script src="<?php echo $base_url; ?>/assets/js/lightbox.js"></script>
</body>
</html>
