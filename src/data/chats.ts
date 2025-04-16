export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  messages: Message[];
  serviceId?: number;
}

export interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  read: boolean;
  isCurrentUser: boolean;
}

export const chats: Chat[] = [
  {
    id: 1,
    name: "أحمد محمد",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    lastMessage: "متى يمكنني حجز موعد للأسبوع القادم؟",
    lastMessageTime: "منذ 5 دقائق",
    unreadCount: 2,
    online: true,
    serviceId: 1,
    messages: [
      {
        id: 1,
        senderId: 2,
        text: "مرحباً، أود الاستفسار عن خدمة تنظيف المنزل",
        timestamp: "10:30 ص",
        read: true,
        isCurrentUser: false
      },
      {
        id: 2,
        senderId: 1,
        text: "أهلاً بك، كيف يمكنني مساعدتك؟",
        timestamp: "10:32 ص",
        read: true,
        isCurrentUser: true
      },
      {
        id: 3,
        senderId: 2,
        text: "هل الخدمة متوفرة يوم الخميس القادم؟",
        timestamp: "10:33 ص",
        read: true,
        isCurrentUser: false
      },
      {
        id: 4,
        senderId: 1,
        text: "نعم، لدينا مواعيد متاحة يوم الخميس. ما هو الوقت المناسب لك؟",
        timestamp: "10:35 ص",
        read: true,
        isCurrentUser: true
      },
      {
        id: 5,
        senderId: 2,
        text: "رائع! أفضل الفترة الصباحية، حوالي الساعة 10 صباحاً",
        timestamp: "10:40 ص",
        read: false,
        isCurrentUser: false
      }
    ]
  },
  {
    id: 2,
    name: "سارة علي",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    lastMessage: "شكراً جزيلاً على الخدمة الممتازة!",
    lastMessageTime: "منذ ساعة",
    unreadCount: 0,
    online: false,
    serviceId: 2,
    messages: [
      {
        id: 1,
        senderId: 2,
        text: "مرحباً، هل يمكنني الاستفسار عن خدمة الطبخ؟",
        timestamp: "أمس، 14:20 م",
        read: true,
        isCurrentUser: false
      },
      {
        id: 2,
        senderId: 1,
        text: "بالتأكيد، كيف يمكنني مساعدتك؟",
        timestamp: "أمس، 14:25 م",
        read: true,
        isCurrentUser: true
      },
      {
        id: 3,
        senderId: 2,
        text: "أريد حجز طباخ لحفلة عائلية يوم السبت القادم",
        timestamp: "أمس، 14:30 م",
        read: true,
        isCurrentUser: false
      },
      {
        id: 4,
        senderId: 1,
        text: "ممتاز، كم عدد الضيوف المتوقع؟",
        timestamp: "أمس، 14:35 م",
        read: true,
        isCurrentUser: true
      },
      {
        id: 5,
        senderId: 2,
        text: "حوالي 15 شخص",
        timestamp: "أمس، 14:40 م",
        read: true,
        isCurrentUser: false
      },
      {
        id: 6,
        senderId: 1,
        text: "تمام، يمكننا توفير طباخ محترف مع مساعد. هل لديك تفضيلات معينة للأطباق؟",
        timestamp: "أمس، 14:45 م",
        read: true,
        isCurrentUser: true
      },
      {
        id: 7,
        senderId: 2,
        text: "نفضل المأكولات الشرقية التقليدية",
        timestamp: "أمس، 15:00 م",
        read: true,
        isCurrentUser: false
      },
      {
        id: 8,
        senderId: 2,
        text: "شكراً جزيلاً على الخدمة الممتازة!",
        timestamp: "منذ ساعة",
        read: true,
        isCurrentUser: false
      }
    ]
  },
  {
    id: 3,
    name: "خالد العتيبي",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    lastMessage: "هل يمكنكم توفير خدمة صيانة المكيفات غداً؟",
    lastMessageTime: "منذ 3 ساعات",
    unreadCount: 1,
    online: true,
    serviceId: 3,
    messages: [
      {
        id: 1,
        senderId: 2,
        text: "مرحباً، أحتاج إلى صيانة للمكيفات في منزلي",
        timestamp: "اليوم، 09:00 ص",
        read: true,
        isCurrentUser: false
      },
      {
        id: 2,
        senderId: 1,
        text: "أهلاً بك، ما هي المشكلة التي تواجهها مع المكيفات؟",
        timestamp: "اليوم، 09:10 ص",
        read: true,
        isCurrentUser: true
      },
      {
        id: 3,
        senderId: 2,
        text: "المكيف الرئيسي لا يبرد بشكل جيد، وهناك صوت مزعج",
        timestamp: "اليوم، 09:15 ص",
        read: true,
        isCurrentUser: false
      },
      {
        id: 4,
        senderId: 1,
        text: "حسناً، يمكننا إرسال فني متخصص لفحص المشكلة. متى يناسبك الموعد؟",
        timestamp: "اليوم، 09:20 ص",
        read: true,
        isCurrentUser: true
      },
      {
        id: 5,
        senderId: 2,
        text: "هل يمكنكم توفير خدمة صيانة المكيفات غداً؟",
        timestamp: "منذ 3 ساعات",
        read: false,
        isCurrentUser: false
      }
    ]
  }
];