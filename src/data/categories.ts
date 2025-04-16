import { Truck, Box, MapPin } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  parentId: string;
}

export const categories: Category[] = [
  {
    id: 'events',
    name: 'المناسبات',
    icon: '🎉',
    description: 'خدمات تنظيم وإدارة المناسبات والحفلات',
    subcategories: [
      { id: 'wedding-halls', name: 'قاعات وصالات أفراح', parentId: 'events' },
      { id: 'resorts', name: 'استراحات', parentId: 'events' },
      { id: 'photography', name: 'تصوير مناسبات', parentId: 'events' },
      { id: 'coffee-service', name: 'خدمة قهوجي', parentId: 'events' },
      { id: 'wedding-services', name: 'خدمات أعراس', parentId: 'events' },
      { id: 'catering', name: 'ضيافة وبوفيهات', parentId: 'events' },
      { id: 'decoration', name: 'تنسيق وديكور', parentId: 'events' },
      { id: 'lighting', name: 'إضاءة وصوتيات', parentId: 'events' },
      { id: 'wedding-planning', name: 'تنظيم أعراس', parentId: 'events' }
    ]
  },
  {
    id: 'vehicles',
    name: 'السيارات',
    icon: '🚗',
    description: 'خدمات تأجير وصيانة المركبات بجميع أنواعها',
    subcategories: [
      { id: 'cars', name: 'سيارات', parentId: 'vehicles' },
      { id: 'luxury-cars', name: 'سيارات فاخرة', parentId: 'vehicles' },
      { id: 'buses', name: 'حافلات', parentId: 'vehicles' },
      { id: 'trucks', name: 'شاحنات', parentId: 'vehicles' },
      { id: 'motorcycles', name: 'دراجات نارية', parentId: 'vehicles' },
      { id: 'car-maintenance', name: 'صيانة سيارات', parentId: 'vehicles' }
    ]
  },
  {
    id: 'real-estate',
    name: 'العقارات',
    icon: '🏢',
    description: 'خدمات إيجار وإدارة العقارات السكنية والتجارية',
    subcategories: [
      { id: 'apartments', name: 'شقق سكنية', parentId: 'real-estate' },
      { id: 'villas', name: 'فلل وقصور', parentId: 'real-estate' },
      { id: 'offices', name: 'مكاتب تجارية', parentId: 'real-estate' },
      { id: 'shops', name: 'محلات تجارية', parentId: 'real-estate' },
      { id: 'warehouses', name: 'مستودعات', parentId: 'real-estate' },
      { id: 'lands', name: 'أراضي', parentId: 'real-estate' }
    ]
  },
  {
    id: 'home-services',
    name: 'خدمات المنزل',
    icon: '🏠',
    description: 'خدمات التنظيف والصيانة والديكور المنزلي',
    subcategories: [
      { id: 'cleaning', name: 'تنظيف منازل', parentId: 'home-services' },
      { id: 'maintenance', name: 'صيانة منزلية', parentId: 'home-services' },
      { id: 'furniture', name: 'أثاث منزلي', parentId: 'home-services' },
      { id: 'gardening', name: 'تنسيق حدائق', parentId: 'home-services' },
      { id: 'pest-control', name: 'مكافحة حشرات', parentId: 'home-services' },
      { id: 'decoration', name: 'ديكور وتصميم داخلي', parentId: 'home-services' }
    ]
  },
  {
    id: 'equipment',
    name: 'المعدات',
    icon: '🔧',
    description: 'تأجير وصيانة المعدات والأدوات المختلفة',
    subcategories: [
      { id: 'construction', name: 'معدات بناء', parentId: 'equipment' },
      { id: 'medical', name: 'معدات طبية', parentId: 'equipment' },
      { id: 'audio-visual', name: 'معدات صوتية ومرئية', parentId: 'equipment' },
      { id: 'camping', name: 'معدات تخييم', parentId: 'equipment' },
      { id: 'sports', name: 'معدات رياضية', parentId: 'equipment' },
      { id: 'tools', name: 'أدوات وعدد', parentId: 'equipment' }
    ]
  },
  {
    id: 'business-services',
    name: 'خدمات الأعمال',
    icon: '💼',
    description: 'خدمات احترافية للشركات والمؤسسات',
    subcategories: [
      { id: 'office-cleaning', name: 'تنظيف مكاتب', parentId: 'business-services' },
      { id: 'it-services', name: 'خدمات تقنية', parentId: 'business-services' },
      { id: 'accounting', name: 'محاسبة', parentId: 'business-services' },
      { id: 'legal', name: 'خدمات قانونية', parentId: 'business-services' },
      { id: 'marketing', name: 'تسويق وإعلان', parentId: 'business-services' },
      { id: 'translation', name: 'ترجمة', parentId: 'business-services' }
    ]
  },
  {
    id: 'personal-services',
    name: 'خدمات شخصية',
    icon: '👤',
    description: 'خدمات العناية الشخصية والصحة والجمال',
    subcategories: [
      { id: 'beauty', name: 'تجميل وعناية', parentId: 'personal-services' },
      { id: 'health', name: 'رعاية صحية', parentId: 'personal-services' },
      { id: 'fitness', name: 'لياقة بدنية', parentId: 'personal-services' },
      { id: 'education', name: 'تعليم وتدريب', parentId: 'personal-services' },
      { id: 'childcare', name: 'رعاية أطفال', parentId: 'personal-services' },
      { id: 'elderly-care', name: 'رعاية كبار السن', parentId: 'personal-services' }
    ]
  },
  {
    id: 'food',
    name: 'الطعام',
    icon: '🍽️',
    description: 'خدمات الطبخ والتوصيل وتقديم الطعام',
    subcategories: [
      { id: 'chefs', name: 'طباخين محترفين', parentId: 'food' },
      { id: 'catering-services', name: 'خدمات تموين', parentId: 'food' },
      { id: 'waiters', name: 'خدمة ضيافة وقرصون', parentId: 'food' },
      { id: 'food-delivery', name: 'توصيل طعام', parentId: 'food' },
      { id: 'cooking-classes', name: 'دروس طبخ', parentId: 'food' },
      { id: 'special-diets', name: 'أنظمة غذائية خاصة', parentId: 'food' }
    ]
  },
  {
    id: 'delivery',
    name: 'خدمات التوصيل',
    icon: '🚚',
    description: 'خدمات توصيل البضائع والطلبات داخل المدن وبين المدن',
    subcategories: [
      { id: 'local-delivery', name: 'توصيل داخل المدينة', parentId: 'delivery' },
      { id: 'intercity-delivery', name: 'توصيل بين المدن', parentId: 'delivery' },
      { id: 'express-delivery', name: 'توصيل سريع', parentId: 'delivery' },
      { id: 'heavy-delivery', name: 'توصيل البضائع الثقيلة', parentId: 'delivery' },
      { id: 'cold-delivery', name: 'توصيل مبرد', parentId: 'delivery' },
      { id: 'furniture-delivery', name: 'توصيل الأثاث', parentId: 'delivery' }
    ]
  }
];

export const getAllSubcategories = (): Subcategory[] => {
  return categories.flatMap(category => category.subcategories || []);
};

export const getSubcategoriesByParent = (parentId: string): Subcategory[] => {
  const category = categories.find(cat => cat.id === parentId);
  return category?.subcategories || [];
};