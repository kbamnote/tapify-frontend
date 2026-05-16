<?php
// ========================================================
// Tapify WhatsApp Web Store Template 3: Restaurant
// CSS File: restaurant.css
// ========================================================
// SETUP INSTRUCTIONS:
// 1. PHP hosting server pe upload karein
// 2. Neeche variables mein apni shop details bharein
// 3. images/ folder mein logo.jpg aur banner.jpg upload karein
// 4. $products array mein apne products add karein
// 5. $categories array mein categories add karein
// ========================================================

// ---- SHOP INFORMATION ----
$shop_name      = 'Aapki Shop Ka Naam';
$shop_tagline   = 'Aapka Tagline Ya Slogan';
$logo           = 'images/logo.jpg';
$banner_image   = 'images/banner.jpg';
$whatsapp_no    = '919999999999';  // Country code + number (no + or spaces)
$phone          = '+91 99999 99999';
$email          = 'shop@email.com';
$address        = 'Aapka Pata, Shehar, State, PIN';
$currency       = '₹';  // Currency symbol

// ---- CATEGORIES ----
$categories = [
  ['id' => 1, 'name' => 'Category 1', 'image' => 'images/cat1.jpg'],
  ['id' => 2, 'name' => 'Category 2', 'image' => 'images/cat2.jpg'],
  ['id' => 3, 'name' => 'Category 3', 'image' => 'images/cat3.jpg'],
  ['id' => 4, 'name' => 'Category 4', 'image' => 'images/cat4.jpg'],
];

// ---- PRODUCTS ----
$products = [
  [
    'id'          => 1,
    'name'        => 'Product 1 Ka Naam',
    'description' => 'Product ki description yahan likhein.',
    'price'       => 999,
    'sale_price'  => 799,
    'image'       => 'images/product1.jpg',
    'category_id' => 1,
    'in_stock'    => true,
  ],
  [
    'id'          => 2,
    'name'        => 'Product 2 Ka Naam',
    'description' => 'Product ki description.',
    'price'       => 1499,
    'sale_price'  => 1199,
    'image'       => 'images/product2.jpg',
    'category_id' => 1,
    'in_stock'    => true,
  ],
  // Aur products add karein is tarah...
];

// ---- TEMPLATE INFO ----
$template_id  = 3;
$template_name= 'Restaurant';
$css_file     = 'restaurant';
$base_url     = 'https://tapifyworld.com';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo htmlspecialchars($shop_name); ?></title>
    <!-- Bootstrap -->
    <link href="<?php echo $base_url; ?>/front/css/bootstrap.min.css" rel="stylesheet">
    <!-- Template 3: Restaurant CSS -->
    <link rel="stylesheet" href="<?php echo $base_url; ?>/assets/css/whatsappp_store/<?php echo $css_file; ?>.css">
    <!-- Additional CSS -->
    <link rel="stylesheet" href="<?php echo $base_url; ?>/assets/css/whatsappp_store/custom.css">
    <link rel="stylesheet" href="<?php echo $base_url; ?>/assets/css/third-party.css">
    <link rel="stylesheet" href="<?php echo $base_url; ?>/assets/css/slider/css/slick.css">
    <link rel="stylesheet" href="<?php echo $base_url; ?>/assets/css/slider/css/slick-theme.min.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" rel="stylesheet">
    <style>
        body { font-family: Poppins, sans-serif; }
        .cart-icon { position:fixed; bottom:20px; right:20px; background:#25D366; color:#fff; width:55px; height:55px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:22px; text-decoration:none; z-index:1000; box-shadow:0 4px 15px rgba(0,0,0,.3); }
        .cart-badge { position:absolute; top:-5px; right:-5px; background:#ff4444; color:#fff; width:20px; height:20px; border-radius:50%; font-size:11px; display:flex; align-items:center; justify-content:center; font-weight:700; }
        .product-card { border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,.08); transition:all .3s; cursor:pointer; }
        .product-card:hover { transform:translateY(-3px); box-shadow:0 5px 20px rgba(0,0,0,.15); }
        .product-img { width:100%; aspect-ratio:1; object-fit:cover; }
        .btn-whatsapp { background:#25D366; color:#fff !important; border:none; border-radius:50px; padding:10px 24px; font-weight:600; display:inline-flex; align-items:center; gap:8px; }
        .price-original { text-decoration:line-through; color:#999; font-size:.85em; }
        .price-sale { color:#e44; font-weight:700; }
        .category-card { text-align:center; cursor:pointer; transition:all .2s; }
        .category-card img { border-radius:50%; width:70px; height:70px; object-fit:cover; }
    </style>
</head>
<body>

<!-- ========== NAVBAR ========== -->
<nav class="navbar navbar-expand-lg px-3 sticky-top bg-white shadow-sm">
    <div class="container-fluid p-0">
        <a class="navbar-brand d-flex align-items-center gap-2" href="#">
            <img src="<?php echo $logo; ?>" alt="<?php echo htmlspecialchars($shop_name); ?>" style="height:40px; width:40px; object-fit:cover; border-radius:50%;">
            <span class="fw-bold"><?php echo htmlspecialchars($shop_name); ?></span>
        </a>
        <div class="d-flex align-items-center gap-2">
            <a href="https://wa.me/<?php echo $whatsapp_no; ?>" target="_blank" class="btn btn-sm btn-success d-flex align-items-center gap-1">
                <i class="fab fa-whatsapp"></i> Order
            </a>
        </div>
    </div>
</nav>

<div class="main-content mx-auto w-100 overflow-hidden">

    <!-- ========== BANNER ========== -->
    <section class="banner-section position-relative">
        <div class="banner-img">
            <img src="<?php echo $banner_image; ?>" class="w-100 object-fit-cover" style="max-height:300px;" alt="Banner" loading="lazy">
        </div>
    </section>

    <!-- ========== CATEGORIES ========== -->
    <section class="category-section position-relative mb-3 px-3 pt-3">
        <h5 class="fw-bold mb-3">Choose your Category</h5>
        <div class="row g-2">
            <?php foreach($categories as $cat): ?>
            <div class="col-3">
                <div class="category-card" onclick="filterCategory(<?php echo $cat['id']; ?>)">
                    <img src="<?php echo htmlspecialchars($cat['image']); ?>" alt="<?php echo htmlspecialchars($cat['name']); ?>">
                    <p class="small mt-1 mb-0"><?php echo htmlspecialchars($cat['name']); ?></p>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- ========== PRODUCTS ========== -->
    <section class="product-section position-relative px-3 py-3">
        <h5 class="fw-bold mb-3">Choose your Product</h5>
        <div class="row g-3" id="productGrid">
            <?php foreach($products as $product): ?>
            <div class="col-6 product-item" data-category="<?php echo $product['category_id']; ?>">
                <div class="product-card">
                    <img src="<?php echo htmlspecialchars($product['image']); ?>" class="product-img" alt="<?php echo htmlspecialchars($product['name']); ?>" loading="lazy">
                    <div class="p-2">
                        <p class="small fw-600 mb-1"><?php echo htmlspecialchars($product['name']); ?></p>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <?php if(!empty($product['sale_price'])): ?>
                            <span class="price-original"><?php echo $currency . $product['price']; ?></span>
                            <span class="price-sale"><?php echo $currency . $product['sale_price']; ?></span>
                            <?php else: ?>
                            <span class="fw-bold"><?php echo $currency . $product['price']; ?></span>
                            <?php endif; ?>
                        </div>
                        <a href="https://wa.me/<?php echo $whatsapp_no; ?>?text=<?php echo urlencode('Hi, I want to order: ' . $product['name'] . ' at ' . $currency . ($product['sale_price'] ?: $product['price'])); ?>" 
                           class="btn btn-sm btn-whatsapp w-100" target="_blank">
                            <i class="fab fa-whatsapp"></i> Add
                        </a>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- ========== BUSINESS HOURS ========== -->
    <section class="businesshour-section px-3 py-3">
        <h5 class="fw-bold mb-3">Business Hours</h5>
        <table class="table table-sm">
            <tr><td>Monday - Friday</td><td>9:00 AM - 6:00 PM</td></tr>
            <tr><td>Saturday</td><td>10:00 AM - 4:00 PM</td></tr>
            <tr><td>Sunday</td><td>Closed</td></tr>
        </table>
    </section>

    <!-- ========== FOOTER ========== -->
    <footer class="text-center pt-3 pb-4 mt-3" style="border-top:1px solid rgba(0,0,0,.1);">
        <p class="text-muted small mb-1"><?php echo htmlspecialchars($shop_name); ?></p>
        <?php if(!empty($address)): ?>
        <p class="text-muted small mb-1"><i class="fas fa-map-marker-alt"></i> <?php echo htmlspecialchars($address); ?></p>
        <?php endif; ?>
        <?php if(!empty($phone)): ?>
        <p class="text-muted small mb-1"><a href="tel:<?php echo preg_replace('/[^0-9+]/','',$phone); ?>"><i class="fas fa-phone"></i> <?php echo htmlspecialchars($phone); ?></a></p>
        <?php endif; ?>
        <?php if(!empty($email)): ?>
        <p class="text-muted small mb-1"><a href="mailto:<?php echo htmlspecialchars($email); ?>"><i class="fas fa-envelope"></i> <?php echo htmlspecialchars($email); ?></a></p>
        <?php endif; ?>
        <p class="text-muted" style="font-size:11px;">&copy; <?php echo date('Y'); ?> <?php echo htmlspecialchars($shop_name); ?></p>
    </footer>

</div><!-- end main-content -->

<!-- Floating WhatsApp Button -->
<a href="https://wa.me/<?php echo $whatsapp_no; ?>" class="cart-icon" target="_blank" title="WhatsApp Order">
    <i class="fab fa-whatsapp"></i>
</a>

<!-- JavaScript -->
<script src="<?php echo $base_url; ?>/assets/js/vcard11/jquery.min.js"></script>
<script src="<?php echo $base_url; ?>/front/js/bootstrap.bundle.min.js"></script>
<script src="<?php echo $base_url; ?>/assets/js/slider/js/slick.min.js"></script>
<script src="<?php echo $base_url; ?>/assets/js/front-third-party-vcard11.js"></script>
<script src="<?php echo $base_url; ?>/assets/js/custom/helpers.js"></script>
<script src="<?php echo $base_url; ?>/assets/js/whatsapp_store_template.js"></script>

<script>
// Category Filter
function filterCategory(catId) {
    const items = document.querySelectorAll('.product-item');
    items.forEach(item => {
        if(catId === 0 || item.dataset.category == catId) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Category Slider
$(document).ready(function(){
    if($('.category-slider').length) {
        $('.category-slider').slick({
            dots: false, infinite: true, slidesToShow: 4, slidesToScroll: 1,
            autoplay: true, arrows: false
        });
    }
});
</script>

</body>
</html>