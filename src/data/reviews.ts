export interface Review {
  id: number;
  serviceId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export const reviews: Review[] = [
  {
    id: 1,
    serviceId: 1,
    userName: "أحمد محمد",
    rating: 5,
    comment: "خدمة ممتازة وفريق عمل محترف. المنزل أصبح نظيفاً تماماً وبرائحة منعشة. سأستخدم الخدمة مرة أخرى بالتأكيد.",
    date: "15 ديسمبر 2024"
  },
  {
    id: 2,
    serviceId: 1,
    userName: "سارة علي",
    rating: 4,
    comment: "خدمة جيدة جداً، لكن كان هناك بعض الزوايا التي تحتاج إلى اهتمام أكثر. بشكل عام أنا راضية عن النتيجة.",
    date: "10 ديسمبر 2024"
  },
  {
    id: 3,
    serviceId: 1,
    userName: "خالد عبدالله",
    rating: 5,
    comment: "فريق محترف ودقيق في العمل. أنجزوا المهمة بسرعة وكفاءة عالية. أنصح بهم بشدة.",
    date: "5 ديسمبر 2024"
  },
  {
    id: 4,
    serviceId: 2,
    userName: "نورة سعد",
    rating: 5,
    comment: "الطعام كان لذيذاً جداً والتقديم رائع. الطباخ محترف ويستخدم مكونات طازجة وعالية الجودة.",
    date: "20 ديسمبر 2024"
  },
  {
    id: 5,
    serviceId: 2,
    userName: "فهد العمري",
    rating: 4,
    comment: "الوجبات كانت شهية ومتنوعة. أعجبني الاهتمام بالتفاصيل والنكهات المميزة.",
    date: "18 ديسمبر 2024"
  },
  {
    id: 6,
    serviceId: 3,
    userName: "عبدالرحمن محمد",
    rating: 4,
    comment: "الفني كان محترفاً وأصلح المكيف بسرعة. الخدمة كانت في الموعد المحدد تماماً.",
    date: "12 ديسمبر 2024"
  },
  {
    id: 7,
    serviceId: 4,
    userName: "لمياء خالد",
    rating: 5,
    comment: "تم تنسيق الحديقة بشكل رائع. المهندس قدم اقتراحات مميزة وتنفيذ احترافي.",
    date: "8 ديسمبر 2024"
  },
  {
    id: 8,
    serviceId: 5,
    userName: "سلطان العتيبي",
    rating: 4,
    comment: "السجاد أصبح نظيفاً تماماً والبقع القديمة اختفت. خدمة ممتازة وسعر معقول.",
    date: "25 ديسمبر 2024"
  }
];