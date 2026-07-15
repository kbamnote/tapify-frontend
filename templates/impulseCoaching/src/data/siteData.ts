// ============================================
// Impulsse Career Institutions — Site Data
// Default/demo content is the Impulsse brochure.
// At runtime, backend-connected fields (identity+contact, social,
// gallery, courses) are overridden from api/public/vcard.php (see loadSiteData.ts).
// Fields still containing {{...}} fall back to the demo values inside each section.
// ============================================

export const siteData = {
  // --- Global / Header ---
  institute_name: "Impulsse Career Institutions",
  logo: "/assets/logo.png",
  tagline: "Driven by Vision, Defined by Success",
  phone: "09850332383",
  email: "impulsseinstitutions@gmail.com",
  address: "Impulsse-Gurukul, Plot No. 47, Chaitaneshwar Nagar, Kharbi Road, Wathoda, Nagpur-440034 (MH)",
  whatsapp: "919850332383",
  website: "https://www.impulsse.co.in",
  seo_description: "Impulsse Career Institutions, Nagpur — Central India's award-winning, most trusted coaching for IIT-JEE (Mains & Advanced), NEET (UG) & MHT-CET. 17 years of excellence.",
  seo_title: "Impulsse Career Institutions | IIT-JEE, NEET & MHT-CET Coaching, Nagpur",
  favicon: "/assets/logo.png",
  primary_color: "#1B3A6B",
  accent_color: "#F7941D",

  // --- Hero Section ---
  hero_background_image: "/assets/hero-bg.jpg",
  hero_student_image: "/assets/hero-student.jpg",
  hero_title: "You Have Dreams, We Turn Them Into Reality",
  hero_subtitle: "Central India's award-winning, most trusted & premier institution for IIT-JEE (Mains & Advanced), NEET (UG) & MHT-CET. An extraordinary learning experience for extraordinary students — 17 years of excellence.",
  admission_open_badge: "Admissions Open 2025-26",
  hero_cta_primary_text: "Enroll Now",
  hero_cta_primary_link: "#contact",
  hero_cta_secondary_text: "Explore Courses",
  hero_cta_secondary_link: "#courses",
  hero_whatsapp_text: "Chat on WhatsApp",
  hero_call_text: "Call Now",
  hero_brochure_url: "#materials",

  // --- About Section ---
  about_title: "About Impulsse",
  about_description: "IMPULSSE Career Institutions is a premier institution in the competitive segment, delivering quality education for Pre-Engineering (IIT-JEE / MHT-CET) & Pre-Medical (NEET-AIIMS) exams. Established in 2009, Impulsse has helped students explore their full potential and realise their dreams for over a decade — becoming the deserving destination for aspirants of IIT-JEE, MHT-CET, NEET & AIIMS. We stand firm to fill the supply-side gap of quality education and deliver the best results with complete honesty & integrity.",
  about_image: "/assets/about-img.jpg",
  vision_title: "Our Vision",
  vision_description: "To become India's most trusted destination for JEE and NEET preparation by transforming aspirations into achievements through academic excellence, innovation, and personalized guidance. We believe every dream deserves the right guidance to become reality.",
  mission_title: "Our Mission",
  mission_description: "Our mission is not only to help students secure admission into premier institutions but also to shape responsible leaders who create a positive impact on society. We are committed to building a strong foundation of knowledge, character, and leadership.",

  // --- Why Choose Us (Array) ---
  // NOTE: icon must be a key of the section's iconMap:
  // Users, BookOpen, Monitor, CalendarCheck, UserCheck, HelpCircle
  why_choose_us: [
    {
      icon: "UserCheck",
      title: "Personal Care & Mentorship",
      description: "Individual Rank Tracking & Promoting (RTP) with a personal record of every student's tests, attendance and progress — so no one is left behind.",
    },
    {
      icon: "Users",
      title: "Most Experienced Faculty",
      description: "IIT & Medical subject experts with 25–35 years of teaching experience across Physics, Chemistry, Mathematics & Biology under one roof.",
    },
    {
      icon: "BookOpen",
      title: "M-K-U-A Learning Strategy",
      description: "Our innovative Master–Know–Understand–Apply methodology with 360° teaching ensures every concept is truly absorbed, not just taught.",
    },
    {
      icon: "CalendarCheck",
      title: "Ekalavya Test Series",
      description: "7 types of tests (RACE, TWT, UWT, SRT, BPT, SAT, RAT) with 200+ online & offline tests and detailed rank analysis.",
    },
    {
      icon: "Monitor",
      title: "i-LEARN E-Learning",
      description: "The mini-school in your pocket — 1250+ explanation videos and 10,000+ practice MCQs on the Impulsse App / Edu-Tab.",
    },
    {
      icon: "HelpCircle",
      title: "360° Doubt Solving",
      description: "14 types of classes including daily doubt-solving and revision sessions, ensuring every question gets answered.",
    },
  ],

  // --- Courses (Array) ---
  courses: [
    {
      image: "/assets/course-1.jpg",
      name: "IIT-JEE (Mains & Advanced)",
      description: "Comprehensive Pre-Engineering coaching for IIT-JEE Mains & Advanced with our 360° teaching methodology and MKUA learning strategy.",
      duration: "2 Years (XI + XII)",
      fees: "Contact Us",
      eligibility: "Class 11 & 12",
      cta_text: "Enquire Now",
      cta_link: "#contact",
    },
    {
      image: "/assets/course-2.jpg",
      name: "NEET (UG)",
      description: "Pre-Medical NEET (UG) preparation for Govt. MBBS & AIIMS, led by expert Physics, Chemistry & Biology faculty.",
      duration: "2 Years (XI + XII)",
      fees: "Contact Us",
      eligibility: "Class 11 & 12",
      cta_text: "Enquire Now",
      cta_link: "#contact",
    },
    {
      image: "/assets/course-3.jpg",
      name: "MHT-CET & Foundation",
      description: "MHT-CET coaching plus a Foundation & Olympiad bridge program for Std. 6th–10th to build an early competitive edge in PCMB.",
      duration: "1–2 Years",
      fees: "Contact Us",
      eligibility: "Std. 6th – 12th",
      cta_text: "Enquire Now",
      cta_link: "#contact",
    },
  ],

  // --- Faculties (Array) ---
  faculties: [
    {
      photo: "/assets/faculty-1.jpg",
      name: "Nandkumar Kautkar",
      qualification: "M.Sc., B.Ed. (Mathematics) — Mathematics Expert",
      experience: "34 Years",
      subject: "Mathematics",
      bio: "Executive Director and Mathematics mentor, focused on speed, accuracy and problem-solving strategy for JEE Mains, Advanced & MHT-CET.",
    },
    {
      photo: "/assets/faculty-2.jpg",
      name: "Priti Dhande",
      qualification: "M.Sc., B.Ed. (Biology) — Biology Expert",
      experience: "18 Years",
      subject: "Biology",
      bio: "Executive Director and Biology mentor, guiding NEET aspirants with conceptual clarity and structured revision.",
    },
    {
      photo: "/assets/faculty-3.jpg",
      name: "Dr. Ranjeet Sinha",
      qualification: "M.Sc., Ph.D. (Chemistry), Ex-Faculty Super-30 Patna",
      experience: "28 Years",
      subject: "Chemistry",
      bio: "Executive Director and Chemistry mentor, renowned for making the toughest concepts simple for competitive-exam success.",
    },
  ],

  // --- Achievements --- (value is parsed as an int; icons are fixed by position)
  achievements: [
    { label: "Classroom Students", value: "10200", suffix: "+" },
    { label: "JEE / MHT-CET Selections", value: "6894", suffix: "+" },
    { label: "Years of Excellence", value: "17", suffix: "+" },
    { label: "NEET / PMT Selections", value: "1826", suffix: "+" },
  ],

  // --- Student Results (Array) ---
  results: [
    {
      photo: "/assets/result-1.jpg",
      name: "Swapnil Bagde",
      course: "IIT-JEE (Advanced)",
      score: "AIR 423",
      achievement: "IIT Kanpur",
    },
    {
      photo: "/assets/result-2.jpg",
      name: "Himanshi Giri",
      course: "NEET (UG)",
      score: "684 / 720",
      achievement: "Govt. MBBS",
    },
  ],

  // --- Testimonials (Array) --- representative student voices (replace with real reviews)
  testimonials: [
    {
      photo: "/assets/testimonial-1.jpg",
      name: "Rahul P. — IIT-JEE Aspirant",
      review: "The personal mentorship and Ekalavya test series at Impulsse kept me on track. Regular rank tracking showed me exactly where to improve.",
      rating: "5",
    },
    {
      photo: "/assets/testimonial-2.jpg",
      name: "Sneha K. — NEET Aspirant",
      review: "The Biology and Chemistry faculty are outstanding. The 360° teaching and daily doubt-solving made NEET preparation stress-free.",
      rating: "5",
    },
    {
      photo: "/assets/testimonial-3.jpg",
      name: "Aditya M. — MHT-CET Aspirant",
      review: "Impulsse's disciplined MKUA approach and i-LEARN app helped me practise thousands of questions. Truly an extraordinary learning experience.",
      rating: "5",
    },
  ],
  testimonials_auto_play: "true",
  testimonials_section_title: "What Our Students Say",

  // --- Gallery (Array) ---
  gallery: [
    { image: "/assets/gallery-1.jpg", alt: "Impulsse classroom session" },
    { image: "/assets/gallery-2.jpg", alt: "Students in a lecture" },
    { image: "/assets/gallery-3.jpg", alt: "Residential Gurukul mess & dining" },
    { image: "/assets/gallery-4.jpg", alt: "Sports & recreation activity" },
    { image: "/assets/gallery-5.jpg", alt: "Impulsse library & study hall" },
    { image: "/assets/gallery-6.jpg", alt: "Doubt-solving group study" },
  ],

  // --- Videos (Array) ---
  videos: [
    {
      youtube_id: "",
      title: "Impulsse Campus Tour",
      description: "Take a walkthrough of the Impulsse-Gurukul residential campus and facilities.",
    },
    {
      youtube_id: "",
      title: "i-LEARN — The Mini-School in Your Pocket",
      description: "See how the Impulsse i-LEARN app powers learning, testing and analysis.",
    },
  ],
  video_section_title: "Campus & Life at Impulsse",

  // --- Upcoming Batches (Array) ---
  batches: [
    {
      name: "IIT-JEE / NEET Integrated (XI + XII)",
      start_date: "Admissions Open",
      timing: "Mon–Sat, 10 AM – 8 PM",
      seats_left: "Limited Seats",
    },
    {
      name: "MHT-CET Focused Batch",
      start_date: "Admissions Open",
      timing: "Mon–Sat, 10 AM – 8 PM",
      seats_left: "Limited Seats",
    },
    {
      name: "Foundation & Olympiads (Std. 6th–10th)",
      start_date: "Admissions Open",
      timing: "Weekend & Weekday Batches",
      seats_left: "Limited Seats",
    },
  ],
  batches_section_title: "Registrations Open",

  // --- Study Materials / PDF ---
  pdf_cover: "/assets/book-cover.jpg",
  pdf_title: "Impulsse Success Journey — Prospectus",
  pdf_author: "Impulsse Career Institutions",
  pdf_pages: "16",
  pdf_size: "4.7 MB",
  pdf_url: "#",
  pdf_description: "The complete Impulsse prospectus — programs, methodology (MKUA & 360°), Ekalavya test series, results and admission details for IIT-JEE, NEET & MHT-CET aspirants.",
  pdf_read_online_text: "Read Online",
  pdf_download_text: "Download Prospectus",
  pdf_open_book_text: "Open Prospectus",

  // --- FAQ (Array) ---
  faqs: [
    {
      question: "Which courses does Impulsse offer?",
      answer: "We offer coaching for IIT-JEE (Mains & Advanced), NEET (UG), MHT-CET, and a Foundation & Olympiad program for Std. 6th–10th, including our Impulsse-Gurukul centralised residential program.",
    },
    {
      question: "What is the M-K-U-A Learning Strategy?",
      answer: "M-K-U-A (Master–Know–Understand–Apply) is our innovative concept combined with a 360° Teaching Methodology and 14 types of classes, designed so every student truly absorbs each concept.",
    },
    {
      question: "Do you provide a test series and study material?",
      answer: "Yes. Our Ekalavya Test Analysis Programme includes 7 types of tests with 200+ online & offline tests, plus the i-LEARN app with 1250+ explanation videos and 10,000+ practice MCQs.",
    },
    {
      question: "What are your timings and where are you located?",
      answer: "Our office is open 10 AM to 8 PM, Monday to Saturday (Sunday closed), at Impulsse-Gurukul, Plot No. 47, Chaitaneshwar Nagar, Kharbi Road, Wathoda, Nagpur. We also have a branch in Chhindwara (MP).",
    },
    {
      question: "How do I take admission?",
      answer: "Admissions are open. Call 09850332383 / 09112106000 or message us on WhatsApp to book a counselling session and secure your seat — seats are limited.",
    },
  ],
  faq_section_title: "Frequently Asked Questions",

  // --- Contact ---
  contact_phone: "09850332383",
  contact_whatsapp: "919850332383",
  contact_email: "impulsseinstitutions@gmail.com",
  contact_address: "Impulsse-Gurukul, Plot No. 47, Chaitaneshwar Nagar, Kharbi Road, Wathoda, Nagpur-440034 (MH)",
  contact_website: "https://www.impulsse.co.in",
  google_maps_embed_url: "",
  google_maps_static_image: "",
  contact_section_title: "Get In Touch",
  contact_form_title: "Admission Enquiry",

  // --- Social Links --- (overridden from backend; empty = section hides)
  social: {
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    telegram: "",
  },

  // --- Footer ---
  footer_quick_links: "About,Courses,Faculty,Results,Gallery,Contact",
  footer_copyright: "© 2025 Impulsse Career Institutions Pvt. Ltd. All Rights Reserved.",
  footer_description: "Impulsse Career Institutions, Nagpur — an innovative concept for IIT-JEE (Mains & Advanced), NEET (UG) & MHT-CET. Driven by Vision, Defined by Success.",

  // --- Floating Action Buttons ---
  fab_whatsapp_number: "919850332383",
  fab_phone_number: "09850332383",
  fab_share_title: "Impulsse Career Institutions",
  fab_share_text: "Check out Impulsse Career Institutions — IIT-JEE, NEET & MHT-CET coaching in Nagpur.",
  fab_location_url: "https://maps.google.com/?q=Impulsse+Career+Institutions+Wathoda+Nagpur",
  fab_admission_link: "#contact",
};

// Type export for TypeScript usage
export type SiteData = typeof siteData;
