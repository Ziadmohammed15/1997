export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  location: string;
  category: string;
  subcategory?: string;
  features: string[];
  hasDelivery?: boolean;
  commission?: number;
  provider?: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
    verified?: boolean;
  };
  deliveryOptions?: {
    included: boolean;
    price?: number;
    areas: string[];
    estimatedTime: string;
    vehicleType: string;
  };
}

export const services: Service[] = [
  // المناسبات
  {
    id: 1,
    title: "قاعة أفراح الريان",
    description: "قاعة أفراح فاخرة تتسع لـ 500 شخص، مجهزة بأحدث التقنيات والديكورات. تشمل الخدمة كوشة العروسين، إضاءة متكاملة، نظام صوتي متطور، ومواقف سيارات.",
    price: 5000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "الرياض - حي النرجس",
    category: "events",
    subcategory: "wedding-halls",
    features: [
      "تتسع لـ 500 شخص",
      "كوشة فاخرة",
      "نظام صوتي وإضاءة",
      "مواقف خاصة",
      "خدمة ضيافة"
    ],
    hasDelivery: false,
    provider: {
      id: "provider-1",
      name: "مجموعة الريان للمناسبات",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      verified: true
    }
  },
  {
    id: 2,
    title: "استراحة النخيل",
    description: "استراحة فاخرة للمناسبات والأفراح، تحتوي على مسبح، جلسات خارجية، صالة مكيفة، ومطبخ مجهز. مناسبة للعائلات والتجمعات الخاصة.",
    price: 1500,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "الرياض - حي الملقا",
    category: "events",
    subcategory: "resorts",
    features: [
      "مسبح خاص",
      "جلسات خارجية",
      "مطبخ مجهز",
      "موقف خاص",
      "حديقة واسعة"
    ],
    hasDelivery: false,
    provider: {
      id: "provider-2",
      name: "مجموعة النخيل للاستراحات",
      rating: 4.8,
      verified: true
    }
  },

  // السيارات
  {
    id: 3,
    title: "مرسيدس S-Class 2024",
    description: "سيارة فاخرة للإيجار اليومي أو الأسبوعي. مناسبة للمناسبات والأعراس. تشمل الخدمة سائق محترف وخدمة توصيل السيارة.",
    price: 1000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "الرياض",
    category: "vehicles",
    subcategory: "luxury-cars",
    features: [
      "موديل 2024",
      "سائق محترف",
      "تأمين شامل",
      "خدمة 24 ساعة",
      "توصيل السيارة"
    ],
    hasDelivery: true,
    provider: {
      id: "provider-3",
      name: "النخبة لتأجير السيارات",
      rating: 4.9,
      verified: true
    }
  },

  // العقارات
  {
    id: 4,
    title: "فيلا فاخرة مفروشة",
    description: "فيلا حديثة مفروشة بالكامل في حي الياسمين. تتكون من 6 غرف نوم، مجلس، صالة، مطبخ مجهز، وحديقة خارجية. مناسبة للعائلات.",
    price: 15000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "الرياض - حي الياسمين",
    category: "real-estate",
    subcategory: "villas",
    features: [
      "6 غرف نوم",
      "مفروشة بالكامل",
      "حديقة خاصة",
      "مطبخ مجهز",
      "نظام أمن"
    ],
    hasDelivery: false,
    provider: {
      id: "provider-4",
      name: "الأصالة للعقارات",
      rating: 4.7,
      verified: true
    }
  },

  // خدمات المنزل
  {
    id: 5,
    title: "خدمة تنظيف شاملة",
    description: "خدمة تنظيف احترافية للمنازل والفلل. نستخدم أفضل المعدات ومواد التنظيف الآمنة. فريق محترف ومدرب.",
    price: 300,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "الرياض",
    category: "home-services",
    subcategory: "cleaning",
    features: [
      "تنظيف شامل",
      "معدات حديثة",
      "مواد آمنة",
      "فريق محترف",
      "ضمان الجودة"
    ],
    hasDelivery: true,
    provider: {
      id: "provider-5",
      name: "شركة النظافة المثالية",
      rating: 4.6,
      verified: true
    }
  },

  // المعدات
  {
    id: 6,
    title: "معدات تصوير احترافية",
    description: "تأجير معدات تصوير احترافية للمناسبات والأعراس. كاميرات، إضاءة، وأجهزة صوت عالية الجودة.",
    price: 500,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1542435503-956c469947f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "الرياض",
    category: "equipment",
    subcategory: "audio-visual",
    features: [
      "كاميرات احترافية",
      "معدات إضاءة",
      "أجهزة صوت",
      "دعم فني",
      "توصيل وتركيب"
    ],
    hasDelivery: true,
    provider: {
      id: "provider-6",
      name: "المحترف للمعدات",
      rating: 4.7,
      verified: true
    }
  },

  // خدمات الأعمال
  {
    id: 7,
    title: "خدمات تسويق رقمي",
    description: "خدمات تسويق رقمي متكاملة للشركات. إدارة وسائل التواصل الاجتماعي، إعلانات مدفوعة، تحسين محركات البحث.",
    price: 2000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "الرياض",
    category: "business-services",
    subcategory: "marketing",
    features: [
      "إدارة السوشيال ميديا",
      "إعلانات مدفوعة",
      "تحسين SEO",
      "تحليل البيانات",
      "تقارير شهرية"
    ],
    hasDelivery: false,
    provider: {
      id: "provider-7",
      name: "شركة التسويق الذكي",
      rating: 4.8,
      verified: true
    }
  },

  // خدمات شخصية
  {
    id: 8,
    title: "مدرب لياقة شخصي",
    description: "مدرب لياقة بدنية معتمد. برامج تدريب مخصصة، نظام غذائي، ومتابعة مستمرة. خبرة 10 سنوات في التدريب الشخصي.",
    price: 200,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "الرياض",
    category: "personal-services",
    subcategory: "fitness",
    features: [
      "برنامج مخصص",
      "نظام غذائي",
      "متابعة مستمرة",
      "تدريب منزلي",
      "قياسات دورية"
    ],
    hasDelivery: true,
    provider: {
      id: "provider-8",
      name: "أحمد المدرب",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      verified: true
    }
  },

  // الطعام
  {
    id: 9,
    title: "شيف منزلي محترف",
    description: "شيف متخصص في المأكولات العربية والعالمية. خدمة طبخ منزلي للمناسبات والحفلات. قائمة طعام متنوعة وخيارات صحية.",
    price: 500,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "الرياض",
    category: "food",
    subcategory: "chefs",
    features: [
      "مأكولات عربية وعالمية",
      "خيارات صحية",
      "تجهيز كامل",
      "خدمة تقديم",
      "معدات طبخ"
    ],
    hasDelivery: true,
    provider: {
      id: "provider-9",
      name: "الشيف محمد",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      verified: true
    }
  },
  
  // Add delivery service examples
  {
    id: 10,
    title: "توصيل داخل مدينة الرياض",
    description: "خدمة توصيل سريعة وموثوقة داخل مدينة الرياض. نقل البضائع والطرود بأمان وسرعة مع تتبع مباشر للشحنة.",
    price: 30,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "الرياض",
    category: "delivery",
    subcategory: "local-delivery",
    features: [
      "توصيل سريع خلال 3 ساعات",
      "تتبع مباشر للشحنة",
      "تأمين على الشحنة",
      "إشعارات لحظية",
      "خدمة 24/7"
    ],
    provider: {
      id: "provider-10",
      name: "شركة التوصيل السريع",
      rating: 4.8,
      verified: true
    },
    deliveryOptions: {
      included: true,
      areas: ["شمال الرياض", "جنوب الرياض", "شرق الرياض", "غرب الرياض", "وسط الرياض"],
      estimatedTime: "2-3 ساعات",
      vehicleType: "سيارة فان"
    }
  },
  {
    id: 11,
    title: "توصيل بين المدن الرئيسية",
    description: "خدمة توصيل بين المدن الرئيسية في المملكة. نقل البضائع والطرود بين الرياض، جدة، الدمام، مكة، المدينة.",
    price: 150,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "جميع المدن",
    category: "delivery",
    subcategory: "intercity-delivery",
    features: [
      "توصيل بين المدن الرئيسية",
      "تتبع الشحنة",
      "تأمين شامل",
      "خدمة عملاء 24/7",
      "استلام من الباب"
    ],
    provider: {
      id: "provider-11",
      name: "شركة النقل الوطنية",
      rating: 4.7,
      verified: true
    },
    deliveryOptions: {
      included: true,
      areas: ["الرياض", "جدة", "الدمام", "مكة", "المدينة"],
      estimatedTime: "24-48 ساعة",
      vehicleType: "شاحنة نقل"
    }
  },
  {
    id: 12,
    title: "توصيل مبرد للأطعمة",
    description: "خدمة توصيل مبرد متخصصة في نقل الأطعمة والمواد الغذائية مع الحفاظ على درجة الحرارة المناسبة.",
    price: 80,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1617347454763-7fd7f51eb7c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "الرياض",
    category: "delivery",
    subcategory: "cold-delivery",
    features: [
      "سيارات مبردة مخصصة",
      "مراقبة درجة الحرارة",
      "توصيل سريع",
      "تغليف خاص للأطعمة",
      "شهادات صحية معتمدة"
    ],
    provider: {
      id: "provider-12",
      name: "البرودة للتوصيل",
      rating: 4.9,
      verified: true
    },
    deliveryOptions: {
      included: true,
      areas: ["الرياض وضواحيها"],
      estimatedTime: "1-2 ساعة",
      vehicleType: "سيارة مبردة"
    }
  }
];