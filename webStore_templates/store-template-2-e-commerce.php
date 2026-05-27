<?php
// ========================================================
// Tapify WhatsApp Web Store Template 2: E-Commerce
// CSS File: ecommerce.css
// ========================================================

// ---- SHOP INFORMATION ----
$shop_name      = 'Aapki Shop Ka Naam';
$shop_tagline   = 'Best Deals, Fast Delivery';
$logo           = 'images/logo.jpg';
$banner_image   = 'images/banner.jpg';
$whatsapp_no    = '919999999999';
$phone          = '+91 99999 99999';
$email          = 'shop@email.com';
$address        = 'Aapka Pata, Shehar, State, PIN';
$currency       = '₹';

// ---- CATEGORIES ----
$categories = [
  ['id' => 1, 'name' => 'Electronics',  'image' => 'images/cat1.jpg'],
  ['id' => 2, 'name' => 'Fashion',       'image' => 'images/cat2.jpg'],
  ['id' => 3, 'name' => 'Home & Living', 'image' => 'images/cat3.jpg'],
  ['id' => 4, 'name' => 'Sports',        'image' => 'images/cat4.jpg'],
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
    'description' => 'Product ki description yahan likhein.',
    'price'       => 1499,
    'sale_price'  => 1199,
    'image'       => 'images/product2.jpg',
    'category_id' => 2,
    'in_stock'    => true,
  ],
];

// ---- TEMPLATE INFO ----
$template_id  = 2;
$template_name= 'E-Commerce';
$css_file     = 'ecommerce';
$base_url     = 'https://tapifyworld.com';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo htmlspecialchars($shop_name); ?> – Online Store</title>
    <link href="<?php echo $base_url; ?>/front/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?php echo $base_url; ?>/assets/css/whatsappp_store/<?php echo $css_file; ?>.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --accent:#1565c0; --accent-light:#e3f2fd; }
        *, *::before, *::after { box-sizing:border-box; }
        body { font-family:'Poppins',sans-serif; background:#f5f5f5; margin:0; color:#333; }
        a { text-decoration:none; }
        .fw-600 { font-weight:600; }

        /* ── NAVBAR ── */
        .store-nav { background:#fff; box-shadow:0 2px 12px rgba(0,0,0,.08); position:sticky; top:0; z-index:200; }
        .nav-inner { max-width:1320px; margin:0 auto; padding:10px 20px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
        .nav-brand { display:flex; align-items:center; gap:12px; }
        .nav-logo { width:46px; height:46px; border-radius:50%; object-fit:cover; border:2.5px solid var(--accent); flex-shrink:0; }
        .nav-title { font-weight:700; font-size:1.05rem; color:#222; line-height:1.2; }
        .nav-tagline { font-size:.7rem; color:#999; display:none; }
        .nav-links { display:none; gap:28px; }
        .nav-links a { color:#555; font-weight:500; font-size:.88rem; transition:color .2s; }
        .nav-links a:hover { color:var(--accent); }
        .btn-wa { background:#25D366; color:#fff !important; border:none; border-radius:50px; padding:9px 20px; font-weight:600; font-size:.85rem; display:inline-flex; align-items:center; gap:7px; transition:background .2s; white-space:nowrap; }
        .btn-wa:hover { background:#1da851; }
        .btn-wa-full { display:none; }
        @media(min-width:576px){ .btn-wa-full{display:inline;} .btn-wa-short{display:none;} }
        @media(min-width:768px){ .nav-tagline{display:block;} }
        @media(min-width:992px){ .nav-links{display:flex;} }

        /* ── BANNER ── */
        .banner-wrap { position:relative; overflow:hidden; background:#111; }
        .banner-img { width:100%; height:210px; object-fit:cover; object-position:center; display:block; }
        .banner-overlay { display:none; position:absolute; inset:0; background:linear-gradient(to right,rgba(0,0,0,.68) 0%,rgba(0,0,0,0) 65%); align-items:center; padding:40px 48px; }
        .banner-overlay h1 { color:#fff; font-size:2rem; font-weight:700; line-height:1.25; margin-bottom:8px; text-shadow:0 2px 10px rgba(0,0,0,.4); }
        .banner-overlay p { color:rgba(255,255,255,.85); font-size:1rem; margin-bottom:22px; }
        @media(min-width:576px){ .banner-img{height:280px;} }
        @media(min-width:768px){ .banner-img{height:370px;} .banner-overlay{display:flex;} .banner-overlay h1{font-size:2.4rem;} }
        @media(min-width:992px){ .banner-img{height:470px;} .banner-overlay h1{font-size:2.8rem;} }

        /* ── CONTAINER ── */
        .store-wrap { max-width:1320px; margin:0 auto; }
        .sec { padding:28px 20px; }
        @media(min-width:768px){ .sec{padding:36px 28px;} }
        @media(min-width:992px){ .sec{padding:44px 0;} }

        /* ── SECTION TITLE ── */
        .sec-title { font-weight:700; font-size:1.15rem; color:#1a1a1a; margin-bottom:16px; }
        .sec-title span { color:var(--accent); }
        @media(min-width:768px){ .sec-title{font-size:1.4rem; margin-bottom:22px;} }

        /* ── CATEGORY STRIP ── */
        .cat-strip { display:flex; gap:14px; overflow-x:auto; padding-bottom:6px; scrollbar-width:none; }
        .cat-strip::-webkit-scrollbar { display:none; }
        .cat-item { display:flex; flex-direction:column; align-items:center; cursor:pointer; flex-shrink:0; transition:transform .2s; }
        .cat-item:hover { transform:translateY(-3px); }
        .cat-img { width:64px; height:64px; border-radius:50%; object-fit:cover; border:2.5px solid #e0e0e0; transition:border-color .2s, box-shadow .2s; }
        .cat-item.active .cat-img, .cat-item:hover .cat-img { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-light); }
        .cat-all { width:64px; height:64px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center; border:2.5px solid var(--accent); }
        .cat-item span { font-size:.7rem; margin-top:5px; text-align:center; color:#555; font-weight:500; line-height:1.2; max-width:72px; }
        @media(min-width:768px){ .cat-img,.cat-all{width:78px; height:78px;} .cat-item span{font-size:.75rem;} }

        /* ── PRODUCT CARDS ── */
        .product-card { border-radius:14px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.07); background:#fff; height:100%; display:flex; flex-direction:column; transition:transform .3s, box-shadow .3s; }
        .product-card:hover { transform:translateY(-5px); box-shadow:0 10px 28px rgba(0,0,0,.13); }
        .prod-img-box { position:relative; overflow:hidden; }
        .prod-img { width:100%; aspect-ratio:1/1; object-fit:cover; display:block; transition:transform .35s; }
        .product-card:hover .prod-img { transform:scale(1.06); }
        .badge-oos { position:absolute; top:8px; left:8px; background:rgba(0,0,0,.62); color:#fff; font-size:.66rem; padding:3px 9px; border-radius:50px; }
        .badge-sale { position:absolute; top:8px; right:8px; background:#e63946; color:#fff; font-size:.66rem; padding:3px 9px; border-radius:50px; font-weight:600; }
        .prod-body { padding:11px 12px 14px; flex:1; display:flex; flex-direction:column; }
        .pname { font-weight:600; font-size:.87rem; color:#222; line-height:1.35; margin-bottom:4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .pdesc { font-size:.75rem; color:#777; line-height:1.4; margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; flex:1; }
        .price-row { margin-bottom:10px; }
        .price-old { text-decoration:line-through; color:#bbb; font-size:.78rem; margin-right:4px; }
        .price-new { color:#e63946; font-weight:700; font-size:.96rem; }
        .price-reg { color:#1a1a1a; font-weight:700; font-size:.96rem; }
        .btn-order { background:#25D366; color:#fff !important; border:none; border-radius:50px; padding:8px 14px; font-weight:600; font-size:.8rem; display:flex; align-items:center; justify-content:center; gap:6px; transition:background .2s; width:100%; cursor:pointer; }
        .btn-order:hover { background:#1da851; }

        /* ── INFO CARDS ── */
        .info-card { background:#fff; border-radius:14px; padding:22px; box-shadow:0 2px 10px rgba(0,0,0,.06); height:100%; }
        .hours-list { list-style:none; padding:0; margin:0; }
        .hours-list li { display:flex; justify-content:space-between; padding:9px 0; border-bottom:1px solid #f2f2f2; font-size:.88rem; }
        .hours-list li:last-child { border-bottom:none; }
        .contact-list { list-style:none; padding:0; margin:0; }
        .contact-list li { display:flex; align-items:flex-start; gap:10px; padding:8px 0; font-size:.88rem; color:#555; border-bottom:1px solid #f2f2f2; }
        .contact-list li:last-child { border-bottom:none; }
        .ci { color:var(--accent); width:18px; margin-top:2px; flex-shrink:0; text-align:center; }

        /* ── FLOAT BUTTON ── */
        .float-wa { position:fixed; bottom:24px; right:24px; background:#25D366; color:#fff; width:58px; height:58px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:26px; z-index:999; box-shadow:0 4px 20px rgba(37,211,102,.55); animation:wapulse 2.5s infinite; }
        @keyframes wapulse { 0%,100%{box-shadow:0 4px 20px rgba(37,211,102,.55)} 50%{box-shadow:0 4px 32px rgba(37,211,102,.85)} }

        /* ── FOOTER ── */
        .store-footer { background:#1a1a1a; color:#bbb; padding:44px 0 0; margin-top:48px; }
        .footer-inner { max-width:1320px; margin:0 auto; padding:0 20px 32px; }
        .store-footer h6 { color:#fff; font-weight:600; font-size:.95rem; margin-bottom:14px; }
        .store-footer p, .store-footer li { font-size:.82rem; margin-bottom:7px; }
        .store-footer ul { list-style:none; padding:0; margin:0; }
        .store-footer a { color:#aaa; }
        .store-footer a:hover { color:#25D366; }
        .footer-divider { border-top:1px solid #2d2d2d; padding:14px 20px; text-align:center; font-size:.77rem; color:#555; max-width:1320px; margin:0 auto; }
    </style>
</head>
<body>

<!-- NAVBAR -->
<nav class="store-nav">
    <div class="nav-inner">
        <div class="nav-brand">
            <img src="<?php echo $logo; ?>" class="nav-logo" alt="<?php echo htmlspecialchars($shop_name); ?>">
            <div>
                <div class="nav-title"><?php echo htmlspecialchars($shop_name); ?></div>
                <div class="nav-tagline"><?php echo htmlspecialchars($shop_tagline); ?></div>
            </div>
        </div>
        <div class="nav-links">
            <a href="#products">Products</a>
            <a href="#hours">Hours</a>
            <a href="#contact">Contact</a>
        </div>
        <a href="https://wa.me/<?php echo $whatsapp_no; ?>" target="_blank" class="btn-wa">
            <i class="fab fa-whatsapp"></i>
            <span class="btn-wa-full">Order on WhatsApp</span>
            <span class="btn-wa-short">Order</span>
        </a>
    </div>
</nav>

<!-- BANNER -->
<div class="banner-wrap">
    <img src="<?php echo $banner_image; ?>" class="banner-img" alt="<?php echo htmlspecialchars($shop_name); ?>" loading="lazy">
    <div class="banner-overlay">
        <div>
            <h1><?php echo htmlspecialchars($shop_name); ?></h1>
            <p><?php echo htmlspecialchars($shop_tagline); ?></p>
            <a href="https://wa.me/<?php echo $whatsapp_no; ?>" target="_blank" class="btn-wa">
                <i class="fab fa-whatsapp"></i> Shop on WhatsApp
            </a>
        </div>
    </div>
</div>

<!-- MAIN CONTENT -->
<div class="store-wrap">

    <!-- CATEGORIES -->
    <section class="sec" id="categories">
        <h2 class="sec-title">Browse <span>Categories</span></h2>
        <div class="cat-strip">
            <div class="cat-item active" onclick="filterCategory(0,this)">
                <div class="cat-all"><i class="fas fa-th-large text-white" style="font-size:1.2rem;"></i></div>
                <span>All</span>
            </div>
            <?php foreach($categories as $cat): ?>
            <div class="cat-item" onclick="filterCategory(<?php echo $cat['id']; ?>,this)">
                <img src="<?php echo htmlspecialchars($cat['image']); ?>" class="cat-img" alt="<?php echo htmlspecialchars($cat['name']); ?>">
                <span><?php echo htmlspecialchars($cat['name']); ?></span>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- PRODUCTS -->
    <section class="sec" id="products" style="padding-top:0;">
        <h2 class="sec-title">Featured <span>Products</span></h2>
        <div class="row g-3 g-md-4" id="productGrid">
            <?php foreach($products as $product): ?>
            <div class="col-6 col-md-4 col-lg-3 product-item" data-category="<?php echo $product['category_id']; ?>">
                <div class="product-card">
                    <div class="prod-img-box">
                        <img src="<?php echo htmlspecialchars($product['image']); ?>" class="prod-img" alt="<?php echo htmlspecialchars($product['name']); ?>" loading="lazy">
                        <?php if(!$product['in_stock']): ?><span class="badge-oos">Out of Stock</span><?php endif; ?>
                        <?php if(!empty($product['sale_price'])): ?><span class="badge-sale">SALE</span><?php endif; ?>
                    </div>
                    <div class="prod-body">
                        <p class="pname"><?php echo htmlspecialchars($product['name']); ?></p>
                        <?php if(!empty($product['description'])): ?>
                        <p class="pdesc"><?php echo htmlspecialchars($product['description']); ?></p>
                        <?php endif; ?>
                        <div class="price-row">
                            <?php if(!empty($product['sale_price'])): ?>
                            <span class="price-old"><?php echo $currency.$product['price']; ?></span>
                            <span class="price-new"><?php echo $currency.$product['sale_price']; ?></span>
                            <?php else: ?>
                            <span class="price-reg"><?php echo $currency.$product['price']; ?></span>
                            <?php endif; ?>
                        </div>
                        <a href="https://wa.me/<?php echo $whatsapp_no; ?>?text=<?php echo urlencode('Hi! I want to order: '.$product['name'].' – '.$currency.($product['sale_price'] ?: $product['price'])); ?>"
                           class="btn-order" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            <?php echo $product['in_stock'] ? 'Buy Now' : 'Enquire'; ?>
                        </a>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- HOURS + CONTACT -->
    <section class="sec" id="hours">
        <div class="row g-4">
            <div class="col-12 col-md-6">
                <div class="info-card">
                    <h2 class="sec-title">Store <span>Hours</span></h2>
                    <ul class="hours-list">
                        <li><span>Monday – Friday</span><span class="fw-600" style="color:#2e7d32;">9:00 AM – 6:00 PM</span></li>
                        <li><span>Saturday</span><span class="fw-600" style="color:#2e7d32;">10:00 AM – 4:00 PM</span></li>
                        <li><span>Sunday</span><span class="fw-600" style="color:#e63946;">Closed</span></li>
                    </ul>
                </div>
            </div>
            <div class="col-12 col-md-6" id="contact">
                <div class="info-card">
                    <h2 class="sec-title">Get in <span>Touch</span></h2>
                    <ul class="contact-list">
                        <?php if(!empty($address)): ?>
                        <li><i class="fas fa-map-marker-alt ci"></i><span><?php echo htmlspecialchars($address); ?></span></li>
                        <?php endif; ?>
                        <?php if(!empty($phone)): ?>
                        <li><i class="fas fa-phone ci"></i><a href="tel:<?php echo preg_replace('/[^0-9+]/','',$phone); ?>" style="color:#333;"><?php echo htmlspecialchars($phone); ?></a></li>
                        <?php endif; ?>
                        <?php if(!empty($email)): ?>
                        <li><i class="fas fa-envelope ci"></i><a href="mailto:<?php echo htmlspecialchars($email); ?>" style="color:#333;"><?php echo htmlspecialchars($email); ?></a></li>
                        <?php endif; ?>
                        <li><i class="fab fa-whatsapp ci"></i><a href="https://wa.me/<?php echo $whatsapp_no; ?>" target="_blank" style="color:#25D366;font-weight:600;">Chat on WhatsApp</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

</div>

<!-- FOOTER -->
<footer class="store-footer">
    <div class="footer-inner">
        <div class="row g-4">
            <div class="col-12 col-sm-6 col-lg-4">
                <h6><?php echo htmlspecialchars($shop_name); ?></h6>
                <p style="color:#aaa;"><?php echo htmlspecialchars($shop_tagline); ?></p>
                <a href="https://wa.me/<?php echo $whatsapp_no; ?>" target="_blank" class="btn-wa" style="margin-top:6px; width:fit-content;">
                    <i class="fab fa-whatsapp"></i> WhatsApp Us
                </a>
            </div>
            <div class="col-12 col-sm-6 col-lg-4">
                <h6>Contact Info</h6>
                <ul>
                    <?php if(!empty($address)): ?><li><i class="fas fa-map-marker-alt me-2" style="color:var(--accent);"></i><?php echo htmlspecialchars($address); ?></li><?php endif; ?>
                    <?php if(!empty($phone)): ?><li><i class="fas fa-phone me-2" style="color:var(--accent);"></i><a href="tel:<?php echo preg_replace('/[^0-9+]/','',$phone); ?>"><?php echo htmlspecialchars($phone); ?></a></li><?php endif; ?>
                    <?php if(!empty($email)): ?><li><i class="fas fa-envelope me-2" style="color:var(--accent);"></i><a href="mailto:<?php echo htmlspecialchars($email); ?>"><?php echo htmlspecialchars($email); ?></a></li><?php endif; ?>
                </ul>
            </div>
            <div class="col-12 col-sm-6 col-lg-4">
                <h6>Store Hours</h6>
                <ul>
                    <li>Mon – Fri: 9:00 AM – 6:00 PM</li>
                    <li>Saturday: 10:00 AM – 4:00 PM</li>
                    <li>Sunday: Closed</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="footer-divider">&copy; <?php echo date('Y'); ?> <?php echo htmlspecialchars($shop_name); ?> &nbsp;|&nbsp; Powered by Tapify</div>
</footer>

<a href="https://wa.me/<?php echo $whatsapp_no; ?>" class="float-wa" target="_blank" title="Order on WhatsApp">
    <i class="fab fa-whatsapp"></i>
</a>

<script src="<?php echo $base_url; ?>/assets/js/vcard11/jquery.min.js"></script>
<script src="<?php echo $base_url; ?>/front/js/bootstrap.bundle.min.js"></script>
<script>
function filterCategory(catId, el) {
    document.querySelectorAll('.cat-item').forEach(function(c){ c.classList.remove('active'); });
    if(el) el.classList.add('active');
    document.querySelectorAll('.product-item').forEach(function(item){
        item.style.display = (catId === 0 || item.dataset.category == catId) ? '' : 'none';
    });
}
</script>
</body>
</html>
