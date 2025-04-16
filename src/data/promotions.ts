export interface Promotion {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  expiryDate?: string;
}

export const promotions: Promotion[] = [
  {
    id: 1,
    title: "خصم 20% على خدمات التنظيف",
    description: "استمتع بخصم حصري على جميع خدمات التنظيف المنزلي لفترة محدودة",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/category/home-services",
    backgroundColor: "from-blue-500 to-cyan-400",
    textColor: "text-white",
    buttonText: "احجز الآن",
    expiryDate: "2025-02-28"
  },
  {
    id: 2,
    title: "عروض مميزة على تأجير السيارات",
    description: "أسعار تنافسية على تأجير السيارات الفاخرة لقضاء عطلة مميزة",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/category/vehicles",
    backgroundColor: "from-purple-500 to-indigo-500",
    textColor: "text-white",
    buttonText: "اكتشف العروض",
    expiryDate: "2025-03-15"
  },
  {
    id: 3,
    title: "باقات متكاملة لتنظيم الأعراس",
    description: "دع فريقنا المحترف يتولى تنظيم حفل زفافك بأسعار مناسبة",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/category/events",
    backgroundColor: "from-pink-500 to-rose-400",
    textColor: "text-white",
    buttonText: "احجز موعدك",
    expiryDate: "2025-04-10"
  },
  {
    id: 4,
    title: "خدمات صيانة منزلية شاملة",
    description: "فريق متخصص لجميع أعمال الصيانة المنزلية بضمان الجودة",
    image: "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/category/home-services",
    backgroundColor: "from-amber-500 to-orange-400",
    textColor: "text-white",
    buttonText: "تواصل معنا",
    expiryDate: "2025-03-30"
  }
];