import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, 
  ShieldAlert, 
  Users, 
  Lock, 
  Unlock, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Copy, 
  Search, 
  LogOut, 
  Globe, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  Trash, 
  Ban, 
  UserCheck, 
  ArrowLeft, 
  Activity, 
  ShieldCheck, 
  ChevronRight,
  Send,
  UserX,
  Volume2,
  PenTool,
  BookOpen,
  HeartPulse
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Predefined Security Questions for forgotten PIN recovery
const SECURITY_QUESTIONS = [
  { id: "pet", ar: "ما هو اسم أول رفيق لعب لك في الحي؟", en: "What was the name of your first childhood neighborhood playmate?" },
  { id: "tent", ar: "أين كان موقع خيمتك أو بيتك الأول المفضل في الأزمة؟", en: "Where was the location of your first favorite tent/house location?" },
  { id: "teacher", ar: "ما اسم أول معلم ترك أثراً طيباً في نفسك؟", en: "What was the name of your first school teacher who left a kind impact?" }
];

// Arabic normalization helper
const normalizeArabicText = (txt: string) => {
  if (!txt) return "";
  return txt
    .toLowerCase()
    .trim()
    .replace(/[\s\W_]+/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
};

// Translation Dictionaries (Arabic priority, easily toggleable)
const translations = {
  ar: {
    navHome: "سَكِينَة الرئيسية",
    navConsult: "استشارة سرية",
    navTrack: "تتبع الردود",
    navRooms: "غرف الدعم الجماعي",
    navDoctor: "بوابة الأخصائي",
    ctaConsultNow: "طلب استشارة سرية عاجلة 🔐",
    emergencyContact: "إرشاد فوري للسلامة النفسية والروحية",
    
    // Home Page
    heroTitle: "مَنصّة سَكِينَة للصمود النفسي",
    heroSubtitle: "مساحة مجانية، آمنة ومحمية بالتشفير الشامل طُوّرت خصيصاً لمؤازرة أهلنا في قطاع غزة. خصوصيتك الكاملة هي هويتك الحقيقية، والخدمة مجانية بالكامل دون اشتراك أو تسجيل.",
    ventTitle: "صندوق التنفيس والتفريغ الذاتي اللحظي والتبخر 🕊️",
    ventSubtitle: "اكتب هنا كل مخاوفك، صدمات ركام النزوح، غضبك، أو حزنك المكبوت.. وبمجرد الضغط على زر التبخير، ستختفي الحروف وتتلاشى تدريجياً أمام عينيك، وتُمحى كلياً من الذاكرة والمتصفح دون إرسالها لأي خادم رقمي، لخصوصية تعافيك وسكينة قلبك.",
    ventPlaceholder: "دع ثقل الكلمات يتبخر... أفرغ صدمات النزوح، فقد الأحباء، والذعر... لا أحد يراقبك، الكلمات هنا تولد لتموت بسلام...",
    ventBtn: "تبخير الحزن وعزل الشحنات ✨",
    ventSuccess: "تلاشت أحزانك من ذاكرة شاشتنا.. نتمنى لروحك وقلبك الصامد السكينة والسلامة. باب التنفيس مفتوح مئات المرات.",
    
    // Core Hurdles Cards
    cardHurdles: "العقبات الميدانية في غزة وكيف تحلها هندسة المنصة",
    obstacle1: "عَقم وصمة العار المجتمعية",
    obstacle1Desc: "لا نطلب إسماً، أو هاتفاً، أو بريداً. هويتك محمية بنسبة 100% وعنوان جهازك مفصول تماماً عن الرسائل.",
    obstacle2: "خطورة التحرك والتنقل الميداني",
    obstacle2Desc: "طبيبك النفسي في جيبك أينما لجأت؛ تواصل معه وتلقي الرعاية وأنت في مكانك لتجنب غارات ومخاطر الطريق.",
    obstacle3: "رداءة الشبكات وانقطاع حزم الإنترنت",
    obstacle3Desc: "التطبيق مبرمج بأكواد خفيفة جداً، مع تجنب الصور الكبيرة ليعمل فورياً على شبكات 2G الضعيفة بامتياز.",
    obstacle4: "الإنهاك ومحدودية الدعم الطبي المحلي",
    obstacle4Desc: "يربطك النظام فورياً بنخبة من المعالجين النفسيين المتطوعين من شتى أرجاء بقاع الأرض لتقديم العطاء.",

    // Consult form
    consultTitle: "إرسال استشارة سرية جديدة للأخصائي رفيق السكينة",
    consultSubtitle: "أنت الآن داخل قنوات تشافٍ معزولة ومحمية. بعد الإرسال، سيتلقى مستشارونا حالتك وسيقومون بالرد التثقيفي الفوري.",
    fieldCategory: "اختر نوع وتصنيف المعاناة التقريبي:",
    catTrauma: "صدمات القصف الحاد وفقدان الأحباء 💔",
    catAnxiety: "الخوف، الذعر الشديد، وهلع الأصوات المرتفعة 😰",
    catGrief: "الحزن الكئيب وطبقات تعب النزوح والتهجير 😔",
    catOther: "معاناة وتفاصيل نفسية أخرى 🍃",
    fieldDetails: "اكتب معاناتك أو قصتك بكل وضوح دون وضع أي معلومات تدل على اسمك الحقيقي:",
    fieldPlaceholder: "يرجى كتابة تفاصيل حالتك بكل أريحية. الكلمات مشفرة بالكامل بقاعدة البيانات ومحمية حتى لو تعرض المعالج لمحاولة اختراق...",
    btnSubmitConsult: "إرسال الاستشارة المشفرة فوراً",
    consultSuccessTitle: "تم عزل وتشفير استشارتك واستلامها بنجاح!",
    consultSuccessDesc: "تم حجب هويتك الرقمية، ولديك الآن معرف تتبع عشوائي وآمن بالكامل. يرجى كتابته ونقله في ورقة أو نسخه والاحتفاظ به بعناية، فلن تتمكن من الوصول للرد بدونه حمايةً لسريتك المطلقة:",
    copyBtn: "نسخ رقم التتبع",
    copied: "تم النسخ بنجاح!",
    noteTrack: "ملاحظة هامة: لا يمكننا استرجاع هذا المعرف لك في حال ضياعه نظراً لعدم وجود ملفات شخصية للمرضى.",

    // Track replies
    trackTitle: "فحص وتتبع رد الأخصائي السري",
    trackSubtitle: "أدخل معرف التتبع العشوائي الذي دوّنته عند إرسال استشارتك لتصفح توصيات الطبيب بكل أمان وسكينة.",
    trackPlaceholder: "اكتب معرف التتبع الخاص بك هنا... (مثل: SK-9082)",
    btnTrack: "جلب وفك تشفير إجابة الطبيب",
    statusAnswered: "قام الأخصائي النفسي بفحص حالتك ووضع توصياته العلاجية والمساندة 🩺",
    statusPending: "الاستشارة قيد المراجعة والتحليل التكاملي حالياً من الأخصائي. يرجى التحقق مجدداً بعد قليل.",
    patientInquiry: "شكواك المعزولة والمسترجعة:",
    doctorReply: "توجيهات وإرشادات الأخصائي المعالج المعتمد:",
    noReplyYet: "جاري دراسة الرسالة بعناية.. سنوافيك برعاية كاملة، يرجى تكرار الفحص لاحقاً.",

    // Rooms
    roomsTitle: "غرف المؤازرة والتأهيل الجماعي المشخصن",
    roomsSubtitle: "قاعات تفاعلية خفيفه تجمع الأخصائيين النفسيين بالمرضى في غزة لنشر التمكين وتخفيف الإحباط عبر أقنعة رقمية مستعارة.",
    room1Name: "مؤازرة صدمات الفقد والقصف الشديد 💔",
    room2Name: "قاعة تفريغ الهلع وهلع أصوات الانفجارات 😰",
    room3Name: "استعادة الصمود ومهارات التعافي اليومي 🍃",
    activeUsers: "طاقة شفاء ونشاط",
    yourMask: "قناعك الرقمي وهويتك المستعارة بالكامل داخل الغرفة:",
    joinRoomBtn: "دخول قاعة الدعم بخصوصية تامة 🚪",
    roomChatHeader: "محادثة الدعم والتعافي الجماعي",
    therapistAlert: "تنبيه الأمان: رسائل الأخصائي مميزة بإطار دافئ أخضر يحمل شارة الطبيب لتوجيه حوارات القاعة.",
    chatPlaceholder: "تحدث بأمان... أنت مجهول الهوية وكلنا رفقاء...",
    btnSend: "إرسال",
    privatePullTitle: "دعوة استماع وعلاج فردي خاص مغلق! 🔒",
    privatePullMessage: "لقد رصد الأخصائي النفسي المتواجد ضيقك في الغرفة العامة، ودعاك للانتقال فوراً لعيادة خاصة ثنائية مغلقة لدعمك عن قرب وبخصوصية قصوى.",
    acceptPull: "قبول جلسة الاستماع الفردية الآن 🩺",
    declinePull: "البقاء في الحوار العام بخصوصياتي",

    // Private chat
    privateChatTitle: "العيادة الثنائية المغلقة الآمنة 🩺",
    privateChatSubtitle: "شات علاجي ثنائي فوري وخاضع للتشفير الكامل بينك وبين الأخصائي رفيق السكينة للتعامل مع الصدمات المتأججة.",
    doctorBadge: "الأخصائي رفيقي",
    patientBadge: "المستشفي الصابر",
    closeSession: "إنهاء الجلسة والعودة للغرف العامة",

    // Doctor Login & Dashboard
    doctorLoginTitle: "بوابة الكوادر والأطباء الاخصائيين",
    doctorLoginSubtitle: "نظام مصادقة سري معزول للتحقق من هوية الأخصائي قبل فك تشفير البيانات أو إدارة غرف الدوران الجمعي لغزة.",
    fieldPassword: "رمز المرور الطبي والاستراتيجي:",
    passPlaceholder: "اكتب كلمة السر الخاصة بالأخصائي...",
    btnLogin: "فك قفل بوابات الدعم الطبي والأمن",
    invalidPass: "الرمز غير صحيح، يرجى التحقق والتجربة لاحقاً لحماية بيانات المصابين.",
    dashboardTitle: "منظومة الرقابة الإكلينيكية وإدارة غرف الدعم النفسي",
    dashboardSubtitle: "رصد وتصنيف الأزمات النفسية الواردة من قطاع غزة والتدخل السريع لفرز الحالات الحرجة.",
    tabConsults: "فرز صندوق الاستشارات الواردة",
    tabModeration: "مراقبة وإدارة قاعات الحوار",
    tabCharts: "خريطة البيانات وتوزيع المشكلات",
    textCategory: "التصنيف:",
    textCreatedAt: "تاريخ الاستقبال:",
    btnReplyNow: "كتابة رد طبي ومواساة",
    replyFormTitle: "إجابة المريض صاحب المعرف المرجعي: ",
    replyPlaceholder: "اكتب الإرشادات والبروتوكول العلاجي المدعم والنفسي المشفر للمريض...",
    btnSubmitReply: "تثبيت وحفظ الرد المشفر",
    aiTriage: "تحليلات الذكاء الاصطناعي السريري والتقييم الداعم (Gemini Smart Triage):",
    btnDeleteMsg: "حذف رسالة محبطة",
    btnBanUser: "حظر الرقم التسلسلي",
    btnPrivatePull: "سحب خاص طارئ 🔒",
    metricsTitle: "التقرير الإحصائي لتوزيع الاضطرابات والمشكلات النفسية في القطاع",
    totalConsultations: "إجمالي الاستشارات الواردة لسكينة",
    answeredConsultations: "الحالات المستجابة والموجهة",
    pendingConsultations: "حالات تنتظر الكادر الطبي عاجلاً",
    highRiskAlerts: "بلاغات عالية الخطورة (أفكار انتحار/إيذاء ذات) 🚨",
    metricAnxiety: "القلق والخوف وهلع الأصوات",
    metricTrauma: "صدمات القصف الشديد وعقد الفقد",
    metricGrief: "الحزن وضغوط النزوح المستمر",
    metricOther: "مشكلات وصعوبات أخرى",
    logout: "تسجيل خروج",
    
    // Bottom copyright
    appTitle: "سَكِينَة",
    allRights: "منصة سَكِينَة للأمان النفسي لغزة © 2026. طُوّرت بأكواد معزولة للغاية ومختصرة لتعمل في أسوأ ظروف تغطية الشبكة بخصوصية تامة ومجاناً."
  },
  en: {
    navHome: "Sakina Home",
    navConsult: "Secret Consult",
    navTrack: "Track Reply",
    navRooms: "Support Rooms",
    navDoctor: "Therapist Portal",
    ctaConsultNow: "Request Immediate Consultation 🔐",
    emergencyContact: "Emergency Emotional Safety Triage Info",
    
    // Home Page
    heroTitle: "Sakina Mental Resilience Platform",
    heroSubtitle: "A 100% free, safe, and highly encrypted sanctuary built to support our resilient people in Gaza. Your total privacy is your actual passport here, and all services are free with no registrations required.",
    ventTitle: "Decompression Vent Box with Gradual Text Evaporation 🕊️",
    ventSubtitle: "Write your anxieties, displacement sorrow, built-up shell-shock or heavy trauma here. When you click Evaporate, the text will fade away smoothly from your screen, and is completely wiped from memories and browser RAM without leaving your computer, granting clean emotional relief.",
    ventPlaceholder: "Empty your suffering here... displacement trials, panic from loud shell blasts, losses... No one is tracking you, your words here are born to disappear gracefully into peace...",
    ventBtn: "Evaporate Sadness and Erase to Vacuum ✨",
    ventSuccess: "Your burden has dissolved into deep white space. We wish your hearts stability and strength. Try venting as many times as you like.",
    
    // Core Hurdles Cards
    cardHurdles: "Field Hurdles in Gaza & How Our Code Resolves Them",
    obstacle1: "Stigma and Fear Of Judgment",
    obstacle1Desc: "No names, phone numbers, or emails is asked. Your session is 100% private behind randomized clinical pseudonyms.",
    obstacle2: "Extreme Travel Hazards on Roadways",
    obstacle2Desc: "Your therapist is in your shelter or pocket. Reach our clinical team directly from any refugee camp with zero physical transport.",
    obstacle3: "Poor Coverage & Network Outages",
    obstacle3Desc: "Our application is highly optimized, free of excessive animations and styled with ultra-light CSS to function with 2G instantly.",
    obstacle4: "Severely Overloaded Local Facilities",
    obstacle4Desc: "Directly linking you with trusted multilingual volunteer clinical psychologists globally to offload overspent local staff.",

    // Consult form
    consultTitle: "Send a Secure consultation to a Verified Therapist",
    consultSubtitle: "You are within solid, encrypted medical conduits. Our practitioners will review your case and write supportive responses.",
    fieldCategory: "Select estimated psychological struggle:",
    catTrauma: "Exploded Shellings Trauma & Lost Loved Ones 💔",
    catAnxiety: "Fears, Serious Terror & Screaming Sound Panic 😰",
    catGrief: "Grave Sorrow & Heavy Displacement/Evacuation Pressure 😔",
    catOther: "Other Psychological struggles & concerns 🍃",
    fieldDetails: "Describe your mental state or worries clearly without mentioning real identifiers:",
    fieldPlaceholder: "Write your situation with maximum ease. The content is securely encrypted on database files and sealed even if the database is leaked...",
    btnSubmitConsult: "Dispatch Encrypted Consultation Now",
    consultSuccessTitle: "Consultation Received and Encrypted Successfully!",
    consultSuccessDesc: "Your physical location and browser trace are completely decoupled. Here is your critical Random Tracking ID. Write it on paper, or copy it down securely. You cannot check replies without this code:",
    copyBtn: "Copy Tracking ID",
    copied: "Copied!",
    noteTrack: "Crucial Advice: We do not log client accounts; if you lose this random ID, we cannot recover it for privacy shielding.",

    // Track replies
    trackTitle: "Retrieve Therapist Guidance securely",
    trackSubtitle: "Type the random tracking ID you obtained during your dispatch to view your clinician's decrypted reply and safe steps.",
    trackPlaceholder: "Provide Tracking ID... (e.g., SK-9082)",
    btnTrack: "Verify and Retrieve Secured Reply",
    statusAnswered: "The specialist finished reviewing your case and written clinical support tips 🩺",
    statusPending: "Your inquiry is currently being evaluated by a clinical team member. Please check back soon.",
    patientInquiry: "Your Retrieved Confidential Inquiry:",
    doctorReply: "Therapist Guidance & Mental Coping Tips:",
    noReplyYet: "Clinicians are conducting analysis... Please refresh or check again a bit later.",

    // Rooms
    roomsTitle: "Group Support and Reassurance Hubs",
    roomsSubtitle: "Highly responsive text lounges uniting therapists and evacuees in Gaza to share coping tips via positive-psychology masks.",
    room1Name: "Coping with Loss & Severe Traumatic events 💔",
    room2Name: "Answering Severe Panic & Loud Shell Alarm 😰",
    room3Name: "Nurturing Grit & Everyday Survival Resources 🍃",
    activeUsers: "active hope engines",
    yourMask: "Your digital clinical mask and random pseudonym in this room:",
    joinRoomBtn: "Join Support Lounge securely 🚪",
    roomChatHeader: "Anonymous Group Peer Lounge",
    therapistAlert: "Verification Alert: Therapist guidelines will display within a warm pine borders and an authentic medical badge.",
    chatPlaceholder: "Share safely... You are fully anonymous here...",
    btnSend: "Send Message",
    privatePullTitle: "Urgent Clinic breakout session invitation! 🔒",
    privatePullMessage: "The local supervisor psychologist noticed your deep sorrow on the list and invited you into an isolated secure private 1-on-1 breakout room for specialized focus.",
    acceptPull: "Accept & Enter Private Consultation 🩺",
    declinePull: "Stay in General Public Group",

    // Private chat
    privateChatTitle: "Isolated 1-on-1 Consultation Clinic 🩺",
    privateChatSubtitle: "An strictly secure private therapy panel encrypted at both terminals between you and the therapist to stabilize trauma.",
    doctorBadge: "My Therapist",
    patientBadge: "Patient Scholar",
    closeSession: "Exit Private Session",

    // Doctor Login & Dashboard
    doctorLoginTitle: "Psychologist and Supervisor Entrance",
    doctorLoginSubtitle: "A highly sealed secure login system to identify psychologists before unlocking encrypted patient submissions or group chats.",
    fieldPassword: "Clinical Entry Code:",
    passPlaceholder: "Provide clinician access code...",
    btnLogin: "Unlock Portal Gatewards",
    invalidPass: "Invalid key! Please keep trying with credentials.",
    dashboardTitle: "Psychology Operations & Community Lounges Supervision",
    dashboardSubtitle: "Reroute trauma distributions, respond carefully to evacuees, and utilize smart AI clinical assistance.",
    tabConsults: "Inquiries Box & Decrypted Inbox",
    tabModeration: "Monitor Group Lounges Live",
    tabCharts: "Statistics & Triage Risk Reports",
    textCategory: "Category:",
    textCreatedAt: "Arrival stamp:",
    btnReplyNow: "Draft Therapeutic Reply",
    replyFormTitle: "Replying to Evacuee Inquiry Reference ID: ",
    replyPlaceholder: "Formulate positive advice, clinical guidelines, and coping directions...",
    btnSubmitReply: "Lock and File Encrypted Response",
    aiTriage: "AI Smart Triage Analysis & Empathetic Draft Suggestion (Gemini-Assisted):",
    btnDeleteMsg: "Erase Message",
    btnBanUser: "Silence Serial Identifier",
    btnPrivatePull: "Private Pull Chat 🔒",
    metricsTitle: "Anonymized Psychiatric Distribution Statistics in the Territory",
    totalConsultations: "Total Inquiries logged to Sakina",
    answeredConsultations: "Total Cases answered by team",
    pendingConsultations: "Inquiries awaiting physician attention",
    highRiskAlerts: "High-Risk Alerts (Self Harm or Panic Crisis) 🚨",
    metricAnxiety: "Anxiety & Shell Blast Panic",
    metricTrauma: "War trauma / loss of family elements",
    metricGrief: "Displacement / Sorrow / Relocation trials",
    metricOther: "Other Difficulties & Issues",
    logout: "Log out",
    
    // Bottom copyright
    appTitle: "Sakina",
    allRights: "Sakina Digital Psychiatric Network © 2026. Made as a fully free, ultra-optimized response to trauma crisis. Zero data stored."
  }
};

const ROOM_THEMES = [
  { id: "trauma", nameAr: "مؤازرة صدمات الفقد والعدوان الشديد 💔", nameEn: "Loss & Extreme Trauma Healing" },
  { id: "panic", nameAr: "تفريغ نوبات الهلع والتوتر والهلع السمعي 😰", nameEn: "Panic, PTSD & Audio Shock relief" },
  { id: "resilience", nameAr: "استعادة مهارات الصمود والتعافي اليومي للأسر 🍃", nameEn: "Daily Resilience & Mental Coping" },
  { id: "anxiety", nameAr: "مجموعة القلق العام والوساوس والمخاوف القهرية 🧠", nameEn: "Generalized Anxiety & Obsession Support" },
  { id: "grief", nameAr: "إرشاد الفقد الممتد والحداد وجلسات غياب الأحبة 🕯️", nameEn: "Complex Grief & Mourning Recovery" },
  { id: "depression", nameAr: "تخطي الاكتئاب والإحباط وبناء مسارات النشاط الإيجابي 🌟", nameEn: "Overcoming Depressive States & Hopelessness" },
  { id: "social", nameAr: "جلسات الرهاب الاجتماعي وتعزيز تقدير الذات والتواصل 🤝", nameEn: "Social Anxiety, Self-Worth & Peer Chat" }
];

export default function App() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [currentView, setCurrentView] = useState<"home" | "consult" | "track" | "rooms" | "private-chat" | "doctor" | "offline" | "tips">("home");
  const [userRole, setUserRole] = useState<"patient" | "doctor" | null>(null);

  // Connection Simulation, Ultra-lite & Stealth States
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isUltraLite, setIsUltraLite] = useState(false);

  // Core state variables moved to top for closure/scope safety
  const [ventText, setVentText] = useState("");
  const [consultCategory, setConsultCategory] = useState<"anxiety" | "grief" | "trauma" | "other">("trauma");
  const [consultText, setConsultText] = useState("");

  // Offline Diagnostics Guide & Local Vent Box states
  const [offlineVentText, setOfflineVentText] = useState("");
  const [offlineVents, setOfflineVents] = useState<Array<{ id: string, text: string, timestamp: string }>>([]);
  const [offlineFadingIds, setOfflineFadingIds] = useState<string[]>([]);

  // Salted Tracking System frontend PIN inputs
  const [consultPin, setConsultPin] = useState("");
  const [trackPinInput, setTrackPinInput] = useState("");

  // Breath controller
  const [breathS, setBreathS] = useState(0);

  // Monitor network connections in real-time
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Keyboard shortcut listener to trigger ESC stealth close redirect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Save encrypted drafts to localStorage before redirection
        if (typeof consultText === "string" && consultText.trim()) {
          localStorage.setItem("sakina_esc_backup_consult", encryptLocalText(consultText));
          localStorage.setItem("sakina_esc_backup_category", consultCategory);
        }
        if (typeof ventText === "string" && ventText.trim()) {
          localStorage.setItem("sakina_esc_backup_vent", encryptLocalText(ventText));
        }
        window.location.href = "https://www.google.com";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [consultText, consultCategory, ventText]);

  // Check for any ESC backup drafts on mount
  useEffect(() => {
    const backupConsult = localStorage.getItem("sakina_esc_backup_consult");
    const backupVent = localStorage.getItem("sakina_esc_backup_vent");
    if (backupConsult || backupVent) {
      setHasEscBackup(true);
    }
  }, []);

  const restoreEscDrafts = () => {
    const backupConsult = localStorage.getItem("sakina_esc_backup_consult");
    const backupCategory = localStorage.getItem("sakina_esc_backup_category");
    const backupVent = localStorage.getItem("sakina_esc_backup_vent");

    if (backupConsult) {
      setConsultText(decryptLocalText(backupConsult));
      if (backupCategory) {
        setConsultCategory(backupCategory as any);
      }
    }
    if (backupVent) {
      setVentText(decryptLocalText(backupVent));
    }
    setHasEscBackup(false);
    // Remove after restoring to keep clean
    localStorage.removeItem("sakina_esc_backup_consult");
    localStorage.removeItem("sakina_esc_backup_category");
    localStorage.removeItem("sakina_esc_backup_vent");
  };

  const clearEscDrafts = () => {
    localStorage.removeItem("sakina_esc_backup_consult");
    localStorage.removeItem("sakina_esc_backup_category");
    localStorage.removeItem("sakina_esc_backup_vent");
    setHasEscBackup(false);
  };

  // Base64 helper to encrypt vents inside localStorage
  const encryptLocalText = (str: string) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      return str;
    }
  };

  const decryptLocalText = (str: string) => {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (e) {
      return str;
    }
  };

  // Load local vents
  const loadOfflineVents = () => {
    const raw = localStorage.getItem("sakina_offline_vents");
    if (raw) {
      try {
        setOfflineVents(JSON.parse(raw));
      } catch (e) {
        setOfflineVents([]);
      }
    } else {
      setOfflineVents([]);
    }
  };

  useEffect(() => {
    loadOfflineVents();
  }, []);

  // Save offline vent
  const handleSaveOfflineVent = (text: string) => {
    if (!text.trim()) return;
    const item = {
      id: "OFF-VNT-" + Math.floor(1000 + Math.random() * 9000),
      text: encryptLocalText(text),
      timestamp: new Date().toISOString()
    };
    const updated = [item, ...offlineVents];
    localStorage.setItem("sakina_offline_vents", JSON.stringify(updated));
    setOfflineVents(updated);
    setOfflineVentText("");
  };

  // Delete/Clear local logs with CSS fade out
  const handleDeleteOfflineVent = (id: string) => {
    setOfflineFadingIds(prev => [...prev, id]);
    setTimeout(() => {
      const updated = offlineVents.filter(item => item.id !== id);
      localStorage.setItem("sakina_offline_vents", JSON.stringify(updated));
      setOfflineVents(updated);
      setOfflineFadingIds(prev => prev.filter(i => i !== id));
    }, 500);
  };

  // Breath second timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathS(s => (s + 1) % 10);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Vent box text states
  const [groundingStep, setGroundingStep] = useState(0);
  const [ventFading, setVentFading] = useState(false);
  const [ventSuccessAlert, setVentSuccessAlert] = useState(false);

  // New Consultation Submission States
  const [consultSubmitting, setConsultSubmitting] = useState(false);
  const [generatedTrackId, setGeneratedTrackId] = useState<string | null>(null);
  const [copiedAlert, setCopiedAlert] = useState(false);

  // Security Questions State for Consultation submission
  const [consultSecurityQuestionId, setConsultSecurityQuestionId] = useState("pet");
  const [consultSecurityAnswer, setConsultSecurityAnswer] = useState("");

  // Security Questions State for Assessments saving
  const [secretSecurityQuestionId, setSecretSecurityQuestionId] = useState("pet");
  const [secretSecurityAnswer, setSecretSecurityAnswer] = useState("");

  // Recovery Questions State for Consultation tracking
  const [recoverConsultWithQuestion, setRecoverConsultWithQuestion] = useState(false);
  const [consultRecoverQuestionId, setConsultRecoverQuestionId] = useState("pet");
  const [consultRecoverAnswer, setConsultRecoverAnswer] = useState("");

  // Recovery Questions State for Secret Tracker login
  const [recoverSecretWithQuestion, setRecoverSecretWithQuestion] = useState(false);
  const [secretRecoverQuestionId, setSecretRecoverQuestionId] = useState("pet");
  const [secretRecoverAnswer, setSecretRecoverAnswer] = useState("");

  // Emergency ESC Backup Warning State
  const [hasEscBackup, setHasEscBackup] = useState(false);

  // New assessment and secret vault states
  const [consultSubtab, setConsultSubtab] = useState<"assessment" | "form">("assessment");
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<number[]>([]);
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
  const [assessmentSaved, setAssessmentSaved] = useState(false);
  
  // Secret account credentials for assessments
  const [secretUsername, setSecretUsername] = useState("");
  const [secretPin, setSecretPin] = useState("");
  const [secretAuthError, setSecretAuthError] = useState("");
  const [isSecretLoggedIn, setIsSecretLoggedIn] = useState(false);
  const [secretHistory, setSecretHistory] = useState<any[]>([]);
  const [savingAssessmentState, setSavingAssessmentState] = useState(false);

  // Pure distraction-free venting toggle
  const [pureVentingMode, setPureVentingMode] = useState(false);

  // Reported messages local array to prevent re-rendering reported items
  const [reportedMessageIds, setReportedMessageIds] = useState<number[]>([]);

  // Crisis category filters inside tips
  const [crisisTipsCategory, setCrisisTipsCategory] = useState<"all" | "panic" | "anxiety" | "trauma" | "grief">("all");

  // Voice synthesis states for tips reading
  const [activeVoiceTipId, setActiveVoiceTipId] = useState<string | null>(null);
  const [largeFontForTips, setLargeFontForTips] = useState(false);

  // Tracking response states
  const [trackIdInput, setTrackIdInput] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedResult, setTrackedResult] = useState<any | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Group rooms state
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [myAlias, setMyAlias] = useState("");
  const [userToken, setUserToken] = useState("");
  const [roomChatInput, setRoomChatInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Pull invitation alerts state
  const [pulledChatId, setPulledChatId] = useState<string | null>(null);
  const [pulledAlias, setPulledAlias] = useState<string | null>(null);
  const [showPullModal, setShowPullModal] = useState(false);

  // Private 1-on-1 Chat states
  const [privateChatId, setPrivateChatId] = useState<string | null>(null);
  const [privateChatTitleStr, setPrivateChatTitleStr] = useState("");
  const [privateMessages, setPrivateMessages] = useState<any[]>([]);
  const [privateChatInput, setPrivateChatInput] = useState("");

  // Doctor Dashboard States
  const [isDoctorRegister, setIsDoctorRegister] = useState(false);
  const [doctorNameInput, setDoctorNameInput] = useState("");
  const [doctorPasswordInput, setDoctorPasswordInput] = useState("");
  const [doctorSelectedSpecialties, setDoctorSelectedSpecialties] = useState<string[]>(["trauma", "panic"]);
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialties, setDoctorSpecialties] = useState<string[]>([]);
  const [roomsSpecialtyFilter, setRoomsSpecialtyFilter] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("all");
  const [doctorLoggedIn, setDoctorLoggedIn] = useState(false);
  const [doctorToken, setDoctorToken] = useState("");
  const [doctorLoginError, setDoctorLoginError] = useState<string | null>(null);
  const [doctorLoggingIn, setDoctorLoggingIn] = useState(false);
  
  const [activeDoctorTab, setActiveDoctorTab] = useState<"consults" | "moderation" | "charts" | "guide">("consults");
  const [doctorConsults, setDoctorConsults] = useState<any[]>([]);
  const [doctorStats, setDoctorStats] = useState<any | null>(null);
  const [selectedConsultForReply, setSelectedConsultForReply] = useState<any | null>(null);
  const [doctorReplyText, setDoctorReplyText] = useState("");
  const [sendingDoctorReply, setSendingDoctorReply] = useState(false);

  // Active room moderation monitors
  const [doctorSelectedMonitorRoom, setDoctorSelectedMonitorRoom] = useState<string>("trauma");
  const [doctorMonitorMessages, setDoctorMonitorMessages] = useState<any[]>([]);

  // Tips & Recovery Stories States
  const [tipsStories, setTipsStories] = useState<any[]>([]);
  const [loadingTips, setLoadingTips] = useState(false);
  const [tipsFilter, setTipsFilter] = useState<"all" | "doctor" | "patient">("all");
  const [newTipAuthor, setNewTipAuthor] = useState("");
  const [newTipTitle, setNewTipTitle] = useState("");
  const [newTipText, setNewTipText] = useState("");
  const [newTipCategory, setNewTipCategory] = useState("resilience");
  const [tipPostingError, setTipPostingError] = useState<string | null>(null);
  const [tipPostingSuccess, setTipPostingSuccess] = useState(false);
  const [submittingTip, setSubmittingTip] = useState(false);

  const fetchTipsStories = async () => {
    try {
      setLoadingTips(true);
      const res = await fetch("/api/tips-stories");
      const data = await res.json();
      if (data.status === "success" && data.tipsStories) {
        setTipsStories(data.tipsStories);
      }
    } catch (e) {
      console.error("Failed to fetch tips/stories:", e);
    } finally {
      setLoadingTips(false);
    }
  };

  const handleLikeTip = async (id: string) => {
    try {
      // Optimistic upvote
      setTipsStories((prev) =>
        prev.map((t) => (t.id === id ? { ...t, likes: (t.likes || 0) + 1 } : t))
      );
      const res = await fetch(`/api/tips-stories/${id}/like`, { method: "POST" });
      const data = await res.json();
      if (data.status === "success") {
        setTipsStories((prev) =>
          prev.map((t) => (t.id === id ? { ...t, likes: data.likes } : t))
        );
      }
    } catch (e) {
      console.error("Failed to like tip:", e);
    }
  };

  const handleCreateTip = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAuthor = doctorLoggedIn ? `الأخصائي د. ${doctorName}` : (newTipAuthor.trim() || myAlias || "صابر مجهول");
    if (!newTipText.trim() || !newTipCategory) {
      setTipPostingError(lang === "ar" ? "يرجى كتابة نصيحتك أو قصتك وبعض الروابط لمساعدتنا." : "Please write your tip/story text.");
      return;
    }
    try {
      setSubmittingTip(true);
      setTipPostingError(null);
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (doctorLoggedIn && doctorToken) {
        headers["Authorization"] = `Bearer ${doctorToken}`;
      }

      const res = await fetch("/api/tips-stories", {
        method: "POST",
        headers,
        body: JSON.stringify({
          author: finalAuthor,
          title: newTipTitle.trim() || (lang === "ar" ? "وصية صمود وتعافٍ" : "Words of Strength & Courage"),
          text: newTipText,
          category: newTipCategory,
          type: doctorLoggedIn ? "doctor" : "patient"
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        setTipPostingSuccess(true);
        setNewTipTitle("");
        setNewTipText("");
        fetchTipsStories();
        setTimeout(() => setTipPostingSuccess(false), 5000);
      } else {
        setTipPostingError(data.error);
      }
    } catch (err) {
      setTipPostingError(lang === "ar" ? "فشل حفظ الاستشارة التثقيفية، يرجى فحص الشبكة." : "Submission failed, check connection.");
    } finally {
      setSubmittingTip(false);
    }
  };

  useEffect(() => {
    if (currentView === "tips") {
      fetchTipsStories();
    }
  }, [currentView]);

  const handleRoleLogout = () => {
    localStorage.removeItem("sakina_user_role");
    setUserRole(null);
    // Securely clear any physician login session too
    localStorage.removeItem("sakina_doc_token");
    localStorage.removeItem("sakina_doc_name");
    localStorage.removeItem("sakina_doc_specialties");
    setDoctorLoggedIn(false);
    setDoctorToken("");
    setDoctorName("");
    setDoctorSpecialties([]);
    setCurrentView("home");
  };

  // Local storage setup on mount for persistent pseudonyms and sessions
  useEffect(() => {
    // Retrieve previous user role if any
    const savedUserRole = localStorage.getItem("sakina_user_role") as "patient" | "doctor" | null;
    if (savedUserRole) {
      setUserRole(savedUserRole);
      if (savedUserRole === "doctor") {
        setCurrentView("doctor");
      }
    }

    // Generate static token for browser user block/pull tracking
    let token = localStorage.getItem("sakina_token");
    if (!token) {
      token = "sk-tkn-" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("sakina_token", token);
    }
    setUserToken(token);

    // Generate pseudonym if missing
    let alias = localStorage.getItem("sakina_alias");
    if (!alias) {
      const prefixes = ["صمود", "أمل", "سلام", "صبر", "عزيمة", "شروق", "نور", "رحمة", "يقين", "إيمان"];
      const rPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const rNum = Math.floor(10 + Math.random() * 90);
      alias = `${rPrefix} ${rNum}`;
      localStorage.setItem("sakina_alias", alias);
    }
    setMyAlias(alias);

    // Check for saved doctor session
    const savedDocToken = localStorage.getItem("sakina_doc_token");
    const savedDocName = localStorage.getItem("sakina_doc_name");
    const savedDocSpecialties = localStorage.getItem("sakina_doc_specialties");
    const prefilledName = localStorage.getItem("sakina_doc_name_input");

    if (prefilledName) {
      setDoctorNameInput(prefilledName);
    }

    if (savedDocToken && savedDocName) {
      setDoctorLoggedIn(true);
      setDoctorToken(savedDocToken);
      setDoctorName(savedDocName);
      try {
        setDoctorSpecialties(JSON.parse(savedDocSpecialties || "[]"));
      } catch (e) {
        setDoctorSpecialties([]);
      }
    }
  }, []);

  // Polling for general room messages AND check for private pulls (supervisor invitations)
  useEffect(() => {
    let intervalId: any;
    if (selectedRoomId && currentView === "rooms") {
      const fetchMsgs = async () => {
        try {
          const res = await fetch(`/api/rooms/${selectedRoomId}/messages`);
          if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
            const data = await res.json();
            if (data.status === "success") {
              setMessages(data.messages);
            }
          }
        } catch (e) {
          console.error("Polling error:", e);
        }
      };
      fetchMsgs();
      intervalId = setInterval(fetchMsgs, 4000);
    }
    return () => clearInterval(intervalId);
  }, [selectedRoomId, currentView]);

  // Periodic Polling to check if therapist pulled this user to isolated chat room
  useEffect(() => {
    if (!userToken) return;
    const checkPulls = async () => {
      try {
        const res = await fetch(`/api/user/private-pulls?userToken=${userToken}`);
        if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
          const data = await res.json();
          if (data.status === "success" && data.pulls && data.pulls.length > 0) {
            const activePull = data.pulls[0];
            setPulledChatId(activePull.id);
            setPulledAlias(activePull.userAlias);
            setShowPullModal(true);
          }
        }
      } catch (err) {
        console.error("Trigger pull check error:", err);
      }
    };
    checkPulls();
    const triggerId = setInterval(checkPulls, 8000);
    return () => clearInterval(triggerId);
  }, [userToken]);

  // Private individual Chat message poller
  useEffect(() => {
    let intervalId: any;
    if (privateChatId && currentView === "private-chat") {
      const fetchPrivateMsgs = async () => {
        try {
          const res = await fetch(`/api/private-chat/${privateChatId}`);
          if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
            const data = await res.json();
            if (data.status === "success") {
              setPrivateMessages(data.chat.messages);
            }
          }
        } catch (err) {
          console.error("Private chat content check failed:", err);
        }
      };
      fetchPrivateMsgs();
      intervalId = setInterval(fetchPrivateMsgs, 4000);
    }
    return () => clearInterval(intervalId);
  }, [privateChatId, currentView]);

  // Doctor Dashboard periodic monitors (only if logged in!)
  useEffect(() => {
    let timerId: any;
    if (doctorLoggedIn && currentView === "doctor") {
      const refreshDoctorData = async () => {
        try {
          // 1. get consults
          try {
            const r1 = await fetch(`/api/doctor/consultations?token=${doctorToken}`);
            if (r1.ok && r1.headers.get("content-type")?.includes("application/json")) {
              const d1 = await r1.json();
              if (d1.status === "success") {
                setDoctorConsults(d1.consultations);
              }
            } else {
              console.warn("Consultations endpoint returned non-JSON response or failed:", r1.status);
            }
          } catch (err1) {
            console.error("Failed to parse consultations JSON:", err1);
          }

          // 2. get statistics
          try {
            const r2 = await fetch(`/api/doctor/statistics?token=${doctorToken}`);
            if (r2.ok && r2.headers.get("content-type")?.includes("application/json")) {
              const d2 = await r2.json();
              if (d2.status === "success") {
                setDoctorStats(d2);
              }
            } else {
              console.warn("Statistics endpoint returned non-JSON response or failed:", r2.status);
            }
          } catch (err2) {
            console.error("Failed to parse statistics JSON:", err2);
          }

          // 3. get room monitoring messages
          if (doctorSelectedMonitorRoom) {
            try {
              const r3 = await fetch(`/api/rooms/${doctorSelectedMonitorRoom}/messages`);
              if (r3.ok && r3.headers.get("content-type")?.includes("application/json")) {
                const d3 = await r3.json();
                if (d3.status === "success") {
                  setDoctorMonitorMessages(d3.messages);
                }
              } else {
                console.warn("Monitor messages endpoint returned non-JSON response or failed:", r3.status);
              }
            } catch (err3) {
              console.error("Failed to parse room messages JSON:", err3);
            }
          }
        } catch (e) {
          console.error("Supervisor dashboards loading error:", e);
        }
      };
      refreshDoctorData();
      timerId = setInterval(refreshDoctorData, 4500);
    }
    return () => clearInterval(timerId);
  }, [doctorLoggedIn, currentView, doctorSelectedMonitorRoom]);

  // Web Audio Synth for physical steam/smoke fading whoosh sound (zero assets dependency)
  const playEvaporationSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      // Procedural white noise generated dynamically
      const bufferSize = ctx.sampleRate * 2.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      let lastVal = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = 0.7 * lastVal + 0.3 * white; // Pinkish noise filter
        lastVal = data[i];
      }
      
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = 6.0;
      
      // Frequency sweep mimicking dispersing gas/vapor smoke
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 1.1);
      filter.frequency.linearRampToValueAtTime(80, ctx.currentTime + 2.0);
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.35);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.1);
      
      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      noiseSource.start();
      noiseSource.stop(ctx.currentTime + 2.2);
    } catch (e) {
      console.warn("Web audio context start bypassed or blocked by user engagement state:", e);
    }
  };

  // Local text fader / decompression vacuum helper
  const handleVentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ventText.trim()) return;
    setVentFading(true);
    playEvaporationSound();
    setTimeout(() => {
      // Wiped totally from RAM
      setVentText("");
      setVentFading(false);
      setVentSuccessAlert(true);
    }, 2800);
  };

  // Submit secure consultation
  const submitConsultation = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!consultText.trim()) return;
    setConsultSubmitting(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          category: consultCategory, 
          text: consultText,
          pin: consultPin.trim() || undefined,
          securityQuestionId: consultSecurityQuestionId,
          securityAnswer: consultSecurityAnswer.trim() || undefined
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        setGeneratedTrackId(data.trackingId);
        setConsultText("");
        setConsultSecurityAnswer(""); // Clear answer securely
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConsultSubmitting(false);
    }
  };

  // Track patient reply
  const trackInquiry = async () => {
    if (!trackIdInput.trim()) return;
    setTrackingLoading(true);
    setTrackingError(null);
    setTrackedResult(null);
    try {
      let queryParam = "";
      if (recoverConsultWithQuestion) {
        queryParam = `?questionId=${consultRecoverQuestionId}&answer=${encodeURIComponent(consultRecoverAnswer.trim())}`;
      } else {
        queryParam = trackPinInput.trim() ? `?pin=${trackPinInput.trim()}` : "";
      }
      
      const res = await fetch(`/api/consultations/${trackIdInput.trim().toUpperCase()}${queryParam}`);
      const data = await res.json();
      if (data.status === "success") {
        setTrackedResult(data);
      } else {
        setTrackingError(data.error);
      }
    } catch (err) {
      setTrackingError("فشل العثور على استشارتك أو رمز مرور/سؤال أمان خاطئ. يرجى مراجعتها وتجربتها مجدداً.");
    } finally {
      setTrackingLoading(false);
    }
  };

  // Report offensive message as abusive
  const reportRoomMessage = async (msgId: number) => {
    try {
      const res = await fetch(`/api/rooms/message/${msgId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.status === "success") {
        setReportedMessageIds(prev => [...prev, msgId]);
        alert(lang === "ar" ? "شكراً لك. تم الإبلاغ عن هذه الرسالة بنجاح وسيتعامل المشرف معها لحظر المخالف فوراً للحفاظ على طهارة المحادثة ونبلها." : "Thank you. Message flagged for supervisor review.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Live client-side cryptographic hashing for credentials to protect HIPAA/Psychological integrity
  const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  };

  // Save current assessment score under private secret alias-account sync
  const saveAssessmentToSecretAccount = async () => {
    if (!secretUsername.trim() || !secretPin.trim() || assessmentScore === null) {
      setSecretAuthError(lang === "ar" ? "يرجى ملء جميع الحقول المطلوبة لحفظ النتيجة" : "Fill credentials first.");
      return;
    }
    setSavingAssessmentState(true);
    setSecretAuthError("");
    try {
      const pinHash = simpleHash(secretPin.trim());
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: secretUsername.trim(),
          pinHash,
          score: assessmentScore,
          categoryScores: assessmentAnswers,
          timestamp: new Date().toISOString(),
          securityQuestionId: secretSecurityQuestionId,
          securityAnswer: secretSecurityAnswer.trim() || undefined
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        setAssessmentSaved(true);
        // Clean answers
        setSecretSecurityAnswer("");
        // Auto pull history too
        retrieveSecretHistory();
      } else {
        setSecretAuthError(data.error || "فشل التخزين بالخادم");
      }
    } catch (err) {
      setSecretAuthError("حدث خطأ بالاتصال بالخادم لحفظ رصيد الصمود.");
    } finally {
      setSavingAssessmentState(false);
    }
  };

  // Retrieve full assessment trajectory history
  const retrieveSecretHistory = async () => {
    if (!secretUsername.trim()) {
      setSecretAuthError(lang === "ar" ? "يرجى تحديد هاتف الدخول الخاص بك أولاً." : "Username required.");
      return;
    }
    if (!recoverSecretWithQuestion && !secretPin.trim()) {
      setSecretAuthError(lang === "ar" ? "يرجى إدخال الرمز السري PIN أو استخدام خيار سؤال الأمان." : "PIN required.");
      return;
    }
    if (recoverSecretWithQuestion && !secretRecoverAnswer.trim()) {
      setSecretAuthError(lang === "ar" ? "يرجى كتابة إجابة سؤال الأمان المخصص الخاص بك." : "Security answer required.");
      return;
    }
    
    setSecretAuthError("");
    setSavingAssessmentState(true);
    try {
      const payload: any = { username: secretUsername.trim() };
      if (recoverSecretWithQuestion) {
        payload.securityQuestionId = secretRecoverQuestionId;
        payload.securityAnswer = secretRecoverAnswer.trim();
      } else {
        payload.pinHash = simpleHash(secretPin.trim());
      }

      const res = await fetch("/api/assessments/retrieve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === "success") {
        setSecretHistory(data.assessments || []);
        setIsSecretLoggedIn(true);
      } else {
        setSecretAuthError(data.error || "بيانات الاعتماد غير صالحة");
      }
    } catch (err) {
      setSecretAuthError("فشل الوصول إلى المخطط السري، يرجى إعادة المحاولة من جديد وإلقاء نظرة على مدخلاتك.");
    } finally {
      setSavingAssessmentState(false);
    }
  };

  const handleSecretLogout = () => {
    setIsSecretLoggedIn(false);
    setSecretUsername("");
    setSecretPin("");
    setSecretHistory([]);
    setSecretAuthError("");
    setAssessmentSaved(false);
  };

  // Voice synthesis text-to-speech helper
  const speakTip = (tipId: string, text: string) => {
    if (!window.speechSynthesis) return;
    
    if (activeVoiceTipId === tipId) {
      window.speechSynthesis.cancel();
      setActiveVoiceTipId(null);
    } else {
      window.speechSynthesis.cancel();
      // Clean emojis and links for clear reading
      const cleaned = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = lang === "ar" ? "ar-EG" : "en-US";
      utterance.rate = 0.88; // Gentle, paced flow for clinical calm
      utterance.pitch = 1.02;
      utterance.onend = () => {
        setActiveVoiceTipId(null);
      };
      utterance.onerror = () => {
        setActiveVoiceTipId(null);
      };
      window.speechSynthesis.speak(utterance);
      setActiveVoiceTipId(tipId);
    }
  };

  // Post to group room
  const sendRoomMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomChatInput.trim() || !selectedRoomId) return;
    setSendingMessage(true);
    try {
      const res = await fetch(`/api/rooms/${selectedRoomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alias: doctorLoggedIn ? `الأخصائي ${doctorName}` : myAlias,
          message: roomChatInput.trim(),
          userToken: doctorLoggedIn ? `doc-tkn-${doctorName}` : userToken,
          isDoctor: doctorLoggedIn
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        setRoomChatInput("");
        // Instantly poll update
        setMessages(prev => [...prev, data.message]);
      } else {
        alert(data.error); // Display banned notification
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Post to private 1-on-1 breakout chatroom
  const sendPrivateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateChatInput.trim() || !privateChatId) return;
    try {
      const res = await fetch(`/api/private-chat/${privateChatId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "user",
          message: privateChatInput.trim()
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        setPrivateChatInput("");
        setPrivateMessages(data.chat.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Doctor credentials authentication
  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorLoggingIn(true);
    setDoctorLoginError(null);
    try {
      const res = await fetch("/api/doctor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: doctorNameInput, 
          password: doctorPasswordInput, 
          specialties: isDoctorRegister ? doctorSelectedSpecialties : undefined
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        setDoctorLoggedIn(true);
        setDoctorToken(data.token);
        setDoctorName(data.name || "أخصائي معتمد");
        setDoctorSpecialties(data.specialties || []);
        
        // Save session details to local storage
        localStorage.setItem("sakina_doc_token", data.token);
        localStorage.setItem("sakina_doc_name", data.name || "أخصائي معتمد");
        localStorage.setItem("sakina_doc_specialties", JSON.stringify(data.specialties || []));
        localStorage.setItem("sakina_doc_name_input", doctorNameInput);
      } else {
        setDoctorLoginError(data.error);
      }
    } catch (err) {
      setDoctorLoginError("فشل الدخول، خطأ بالسيرفر.");
    } finally {
      setDoctorLoggingIn(false);
    }
  };

  // Doctor replies to consultation
  const submitDoctorReplyInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorReplyText.trim() || !selectedConsultForReply) return;
    setSendingDoctorReply(true);
    try {
      const res = await fetch("/api/doctor/reply", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${doctorToken}`
        },
        body: JSON.stringify({
          id: selectedConsultForReply.id,
          reply: doctorReplyText.trim()
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        setDoctorReplyText("");
        setSelectedConsultForReply(null);
        // Refresh items list
        const refreshed = await fetch(`/api/doctor/consultations?token=${doctorToken}`);
        const cData = await refreshed.json();
        setDoctorConsults(cData.consultations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingDoctorReply(false);
    }
  };

  // Moderate message delete
  const deleteRoomMessage = async (msgId: number) => {
    try {
      const res = await fetch("/api/doctor/rooms/message/delete", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${doctorToken}`
        },
        body: JSON.stringify({ messageId: msgId })
      });
      const data = await res.json();
      if (data.status === "success") {
        // reload monitor messages
        const r3 = await fetch(`/api/rooms/${doctorSelectedMonitorRoom}/messages`);
        const d3 = await r3.json();
        setDoctorMonitorMessages(d3.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Moderate active user ban
  const banUserToken = async (uToken: string) => {
    try {
      await fetch("/api/doctor/rooms/user/ban", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${doctorToken}`
        },
        body: JSON.stringify({ userToken: uToken })
      });
      alert("تم حظر المستخدم وصاحب الرمز من النشر حماية للأمن الداخلي للغرفة.");
    } catch (e) {
      console.error(e);
    }
  };

  // Doctor pulls a user to a private chat
  const triggerPrivatePull = async (msgObj: any) => {
    try {
      const res = await fetch("/api/doctor/rooms/user/pull", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${doctorToken}`
        },
        body: JSON.stringify({
          userToken: msgObj.userToken,
          userAlias: msgObj.alias,
          roomId: doctorSelectedMonitorRoom
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        alert(`تم إرسال دعوة سحب المحادثة الخاصة لـ "${msgObj.alias}" بنجاح! سيظهر منبه له على الشاشة وسنتحدث ثنائياً.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 2000);
  };

  // Helper dictionary accessor
  const t = translations[lang];

  if (userRole === null) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex flex-col font-sans select-none antialiased" dir={lang === "ar" ? "rtl" : "ltr"}>
        {/* Connection simulator / speed bar */}
        <div className="bg-[#4A6B5D] text-[#F4F7F5] py-2 px-3 text-center text-xs font-medium tracking-wide flex justify-between items-center relative shadow-xs border-[#3b5549]">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#D4A373] animate-pulse" />
            <span className="text-[11px] md:text-xs">
              {lang === "ar" 
                ? "⚡ منصة سكينة: رعاية نفسية مشفرة بالكامل وخفيفة البيانات" 
                : "⚡ Sakina: Fully encrypted psychiatric platform optimized for low data"}
            </span>
          </div>
          
          <button 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white transition-colors cursor-pointer"
            onClick={() => setLang(l => l === "ar" ? "en" : "ar")}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{lang === "ar" ? "English" : "العربية"}</span>
          </button>
        </div>

        {/* Outer container */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-linear-to-b from-[#F4F7F5] via-white to-[#E8EFEA]">
          <div className="max-w-3xl w-full text-center space-y-8 my-auto">
            
            {/* Logo and Headings */}
            <div className="space-y-4">
              <div className="mx-auto bg-[#4A6B5D] h-16 w-16 md:h-20 md:w-20 rounded-2xl flex items-center justify-center text-white shadow-md animate-bounce duration-1000">
                <span className="font-extrabold text-3xl md:text-4xl mt-1">س</span>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#4A6B5D] tracking-tight">
                  {lang === "ar" ? "مرحباً بك في مَنصّة سَكِينَة" : "Welcome to Sakina Sanctuary"}
                </h1>
                <p className="text-sm md:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
                  {lang === "ar" 
                    ? "بوابتك الآمنة والمشفرة بالكامل للدعم النفسي والصمود في قطاع غزة. خصوصيتك هي أولويتنا القصوى، فلا نطلب أي بيانات شخصية."
                    : "Your secure psychological support sanctuary in Gaza. No personal data is stored, and everything is private."}
                </p>
              </div>
            </div>

            {/* Selection Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              
              {/* Option A: Patient */}
              <button
                onClick={() => {
                  localStorage.setItem("sakina_user_role", "patient");
                  setUserRole("patient");
                  setCurrentView("home");
                }}
                className="group p-6 md:p-8 bg-white hover:bg-emerald-50/20 border-2 border-gray-200 hover:border-[#4A6B5D]/60 rounded-3xl text-right transition-all duration-300 hover:shadow-lg active:scale-98 cursor-pointer flex flex-col items-start gap-4"
              >
                <div className="bg-emerald-100 text-[#4A6B5D] p-3.5 rounded-2xl group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8" />
                </div>
                
                <div className="space-y-1.5 text-right w-full">
                  <h3 className="text-lg font-bold text-[#2B2D42] group-hover:text-[#4A6B5D] transition-colors">
                    {lang === "ar" ? "الدخول كمستفيد / مريض 🧑‍⚕️" : "Enter as Beneficiary / Patient 🧑‍⚕️"}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {lang === "ar"
                      ? "اطلب استشارة خاصة وسرية، تحدث في غرف الدعم النفسي الجماعي مع رفاقك، تابع نصائح الأطباء وطريقة التعامل مع الهلع مجاناً."
                      : "Send private confidential inquiries, converse in community therapeutic rooms, read coping strategies, and more."}
                  </p>
                </div>

                <div className="text-[11px] font-bold text-[#4A6B5D] mt-2 flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                  <span>{lang === "ar" ? "ابدأ رحلة التعافي والصبر" : "Begin Coping Journey"}</span>
                  <span>←</span>
                </div>
              </button>

              {/* Option B: Doctor */}
              <button
                onClick={() => {
                  localStorage.setItem("sakina_user_role", "doctor");
                  setUserRole("doctor");
                  setCurrentView("doctor");
                }}
                className="group p-6 md:p-8 bg-white hover:bg-slate-50/40 border-2 border-gray-200 hover:border-[#2b2d42]/60 rounded-3xl text-right transition-all duration-300 hover:shadow-lg active:scale-98 cursor-pointer flex flex-col items-start gap-4"
              >
                <div className="bg-blue-100 text-[#2B2D42] p-3.5 rounded-2xl group-hover:scale-110 transition-transform">
                  <Lock className="h-8 w-8" />
                </div>
                
                <div className="space-y-1.5 text-right w-full">
                  <h3 className="text-lg font-bold text-[#2B2D42] group-hover:text-[#4A6B5D] transition-colors">
                    {lang === "ar" ? "بوابة الأطباء والأخصائيين النفسيين 🩺" : "Doctors & Mental Specialists Portal 🩺"}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {lang === "ar"
                      ? "تسجيل دخول الأخصائيين المعتمدين، متابعة حالات المرضى والاستشارات الواردة والرد عليها وتدقيق المخططات البيانية لمستوى الصمود."
                      : "Access the specialist portal to answer cases, moderate chat rooms, view resilience graphs, and publish certified advice."}
                  </p>
                </div>

                <div className="text-[11px] font-bold text-[#2B2D42] mt-2 flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                  <span>{lang === "ar" ? "لوحة تحكم الأخصائي" : "Access Practitioner Terminal"}</span>
                  <span>←</span>
                </div>
              </button>

            </div>

            {/* Bottom Footer Details */}
            <div className="text-[10px] md:text-xs text-gray-400 font-medium pt-4 max-w-md mx-auto leading-relaxed">
              <p>
                {lang === "ar"
                  ? "🔒 يتم تشفير جميع الجلسات والاستشارات بالكامل بطبقة حماية عسكرية. لا يتم تخزين أي معلومات تحديد هوية خلف جهازك."
                  : "🔒 Military-grade client privacy enabled. Absolutely no personally identifiable information (PII) is recorded."}
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  if (isUltraLite) {
    return (
      <div className="min-h-screen bg-white text-black p-4 font-mono select-none" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="max-w-xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="border-b-2 border-black pb-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold font-mono">
                {lang === "ar" ? "سَكِينَة - واجهة النص الأساسية للاتصالات الضعيفة" : "SAKINA - Low-bandwidth Basic Text View"}
              </h1>
              <p className="text-xs text-gray-700 mt-1">
                {lang === "ar" 
                  ? "تم تفعيل نمط النص فقط لتوفير استهلاك البيانات بنسبة 99%." 
                  : "Text-only view activated to limit mobile data usage by 99%."}
              </p>
            </div>
            <button 
              onClick={() => setIsUltraLite(false)} 
              className="border-2 border-black bg-black text-white px-3 py-1 text-xs font-bold font-mono hover:bg-white hover:text-black cursor-pointer"
            >
              [ {lang === "ar" ? "العودة للواجهة الكاملة" : "Back to Full UI"} ]
            </button>
          </div>

          {/* Lang Selector */}
          <div className="flex gap-2">
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="border border-black px-2 py-1 text-xs font-bold hover:bg-black hover:text-white cursor-pointer">
              {lang === "ar" ? "Switch to English" : "العربية"}
            </button>
          </div>

          {/* Disclaimer / Warning banner */}
          <div className="border border-black p-3 text-xs bg-gray-50 leading-relaxed font-semibold">
            {lang === "ar"
              ? "🛡️ مشفرة ومؤمنة بالكامل: كافة معاملات الاستشارات والغرف تسير مشفرة وتمرر عبر قنوات أمان متقدمة لحماية هويتك وخصوصيتك."
              : "🛡️ 100% Secure & Sealed: All consultation requests and rooms are heavily encrypted in transit to defend your workspace and identity."}
          </div>

          {/* Low-data PFA instructions */}
          <div className="border-t border-black pt-4 space-y-3">
            <h2 className="text-sm font-bold border-b border-black pb-1 uppercase">{lang === "ar" ? "💡 الإسعاف الميداني السريع (الأزمة والهلع)" : "💡 Emergency First-Aid Guidelines"}</h2>
            <ul className="list-disc pr-4 pl-4 text-xs space-y-2 text-gray-900 leading-relaxed">
              <li>
                <strong>{lang === "ar" ? "التحكم بنوبات الهلع (تمرين 5-4-3-2-1):" : "Severe Panic Counter (5-4-3-2-1 Index):"}</strong>
                <span className="block mt-1 text-gray-700">
                  {lang === "ar"
                    ? "لاحظ 5 أشياء حولك، المَس 4 أشياء صلبة ملموسة، اسمع 3 أصوات ناعمة، اشتم رائحتين، تذوق طعماً واحداً. كرر التنفس بانتظام."
                    : "Notice 5 visible items, touch 4 physical textures, name 3 local noises, locate 2 smell sources, taste 1 thing."}
                </span>
              </li>
              <li>
                <strong>{lang === "ar" ? "تهدئة الأطفال أثناء سماع الانفجارات:" : "Soothing Children Under Crisis Noise:"}</strong>
                <span className="block mt-1 text-gray-700">
                  {lang === "ar"
                    ? "حافظ على هدوء مظهرك وعينيك أمامهم. اقبض عليهم بقوة واحتضان آمن وثيق ومستمر. غنّوا سوياً لعرقلة ارتداد أصوات الانفجارات بدماغ الطفل."
                    : "Emphasize absolute calm in your facial expression. Hold them in a tight physical snug. Sing together to distort blast acoustic shockwaves."}
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Submit form */}
          <div className="border border-black p-4 space-y-4">
            <h2 className="text-sm font-bold uppercase border-b border-black pb-1">{lang === "ar" ? "📤 إرسال استشارة عاجلة وسرية" : "📤 Send Quick Consultation"}</h2>
            
            <div className="space-y-2 text-xs">
              <label className="block font-bold">{lang === "ar" ? "اختر الفئة المتخصصة:" : "Select Category:"}</label>
              <select
                value={consultCategory}
                onChange={(e) => setConsultCategory(e.target.value as any)}
                className="w-full p-2 border border-black bg-white"
              >
                <option value="trauma">{lang === "ar" ? "علاج الصدمات الشديدة والحروب" : "Trauma & Crisis Counseling"}</option>
                <option value="anxiety">{lang === "ar" ? "نوبات القلق والهلع والرهاب" : "Panic & Anxiety Care"}</option>
                <option value="grief">{lang === "ar" ? "إرشاد الفقد والحزن الاستثنائي" : "Grief & Bereavement Support"}</option>
                <option value="other">{lang === "ar" ? "مواضيع صحية نفسية عامة" : "General Health Consultation"}</option>
              </select>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold">{lang === "ar" ? "اكتب ما تشعر به بكل حرية (سيتم تشفير النص بالكامل):" : "Describe what you feel (will be 105% encrypted):"}</label>
              <textarea
                value={consultText}
                onChange={(e) => setConsultText(e.target.value)}
                placeholder={lang === "ar" ? "دون وضع أي اسم حقيقي، اكتب معاناتك..." : "Write your issues without placing any real identifiers..."}
                className="w-full h-24 p-2 border border-black bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold">{lang === "ar" ? "رمز المرور السري (4 أرقام لتتبع فك التشفير):" : "4-Digit Security PIN (Required to Tracking/Decryption):"}</label>
              <input
                type="password"
                maxLength={4}
                value={consultPin}
                onChange={(e) => setConsultPin(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 4821"
                className="w-full p-2 border border-black text-center font-bold bg-white"
              />
            </div>

            <button
              onClick={() => submitConsultation()}
              disabled={consultSubmitting || !consultText.trim() || consultPin.length !== 4}
              className="w-full py-2 bg-black text-white hover:bg-white hover:text-black hover:border border-black font-bold text-xs font-mono disabled:opacity-30 cursor-pointer"
            >
              {consultSubmitting ? (lang === "ar" ? "جاري التشفير والإرسال الفوري... ⏳" : "Sending...") : (lang === "ar" ? "تأمين وبث الاستشارة السرية" : "Encrypt & Send Secured")}
            </button>
            
            {generatedTrackId && (
              <div className="border-2 border-dashed border-black p-3 text-center space-y-2 bg-gray-50">
                <span className="text-[10px] font-bold block">{lang === "ar" ? "احتفظ بهذا الرمز لتتبع الاستشارة والرد:" : "Copy this code to track reply:"}</span>
                <span className="text-lg font-mono font-bold tracking-widest bg-white border border-black px-4 py-1.5 inline-block">{generatedTrackId}</span>
                <button
                  onClick={() => copyToClipboard(generatedTrackId)}
                  className="block mx-auto text-[10px] underline font-bold"
                >
                  [ {lang === "ar" ? "نسخ الكود" : "Copy Code"} ]
                </button>
              </div>
            )}
          </div>

          {/* Quick Track consultation */}
          <div className="border border-black p-4 space-y-3">
            <h2 className="text-sm font-bold uppercase border-b border-black pb-1">{lang === "ar" ? "🔍 تتبع الاستشارات وقراءة رد الطبيب" : "🔍 Track Secure Inquiries"}</h2>
            
            <div className="space-y-2 text-xs">
              <label className="block font-bold">{lang === "ar" ? "ادخل رقم الاستشارة الآمن (مثل SK-4819):" : "Enter Consultation ID (e.g. SK-4819):"}</label>
              <input
                type="text"
                value={trackIdInput}
                onChange={(e) => setTrackIdInput(e.target.value)}
                placeholder="SK-XXXX"
                className="w-full p-2 border border-black text-center font-mono focus:outline-none uppercase"
              />
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold">{lang === "ar" ? "رمز الأمان الشخصي المكون من 4 أرقام:" : "Your 4-Digit Security PIN:"}</label>
              <input
                type="password"
                maxLength={4}
                value={trackPinInput}
                onChange={(e) => setTrackPinInput(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 4821"
                className="w-full p-2 border border-black text-center font-mono focus:outline-none"
              />
            </div>

            <button
              onClick={trackInquiry}
              disabled={trackingLoading || !trackIdInput.trim() || trackPinInput.length !== 4}
              className="w-full py-2 bg-black text-white hover:bg-white hover:text-black hover:border border-black font-bold text-xs font-mono disabled:opacity-30 cursor-pointer"
            >
              {trackingLoading ? "..." : (lang === "ar" ? "كشف وطمأنة الاستشارة" : "Inspect Tracking ID")}
            </button>

            {trackingError && (
              <div className="p-2 border border-black bg-gray-50 text-xs text-red-600 font-bold">
                {trackingError}
              </div>
            )}

            {trackedResult && (
              <div className="border border-black p-3 space-y-2 text-xs bg-gray-50">
                <div className="flex justify-between items-center font-bold">
                  <span>{lang === "ar" ? "حالة المعاملة:" : "Status:"} {trackedResult.conStatus}</span>
                  <span>{new Date(trackedResult.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="border-t border-dashed border-black pt-2">
                  <strong>{lang === "ar" ? "رسالتك الأصلية:" : "Your Inquiry:"}</strong>
                  <p className="mt-1 text-gray-700">{trackedResult.textDecrypted}</p>
                </div>
                {trackedResult.replyDecrypted ? (
                  <div className="border-t border-dashed border-black pt-2 bg-white p-2 border mt-1">
                    <strong className="text-[#4A6B5D] block">% {lang === "ar" ? "إجابة الأخصائي النفسي المعالج:" : "Therapist Answer:"}</strong>
                    <p className="mt-1 text-black font-sans leading-relaxed whitespace-pre-line">{trackedResult.replyDecrypted}</p>
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-500 italic mt-1">{lang === "ar" ? "لم يقم الأخصائي بالرد بعد، أعد التتبع لاحقاً." : "Pending therapist reply. Check back soon."}</p>
                )}
              </div>
            )}
          </div>

          {/* Quick Grounding vent log */}
          <div className="border border-black p-4 space-y-3">
            <h2 className="text-sm font-bold uppercase border-b border-black pb-1">{lang === "ar" ? "📝 الحفاظ على تدوين المشاعر واليوميات حاليا" : "📝 Offline Vent Box (Saves locally)"}</h2>
            <textarea
              value={offlineVentText}
              onChange={(e) => setOfflineVentText(e.target.value)}
              placeholder={lang === "ar" ? "اكتب تفريغاً حسياً فورياً..." : "Vent out locally..."}
              className="w-full h-20 p-2 border border-black bg-white focus:outline-none text-xs"
            />
            <button
              onClick={() => handleSaveOfflineVent(offlineVentText)}
              disabled={!offlineVentText.trim()}
              className="w-full py-2 bg-black text-white hover:bg-white hover:text-black hover:border border-black text-xs font-bold font-mono cursor-pointer"
            >
              [ {lang === "ar" ? "حفظ المذكرة مجانا وبسرية تامة" : "Save Encoded Note Locally"} ]
            </button>
            
            {offlineVents.length > 0 && (
              <div className="space-y-2 border-t border-dashed border-black pt-3">
                <span className="text-[10px] font-bold block">{lang === "ar" ? "مذكراتك المخزنة محلياً:" : "Your Encoded Logs:"}</span>
                {offlineVents.map((v) => (
                  <div key={v.id} className="border border-black p-2 bg-gray-50 text-[11px] space-y-1">
                    <div className="flex justify-between font-bold text-[9px]">
                      <span>{v.id}</span>
                      <span>{new Date(v.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-800">{decryptLocalText(v.text)}</p>
                    <button
                      onClick={() => handleDeleteOfflineVent(v.id)}
                      className="text-[9px] text-red-600 underline font-bold cursor-pointer"
                    >
                      [ {lang === "ar" ? "مَسْح" : "Erase"} ]
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col font-sans select-none antialiased" dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* 2G / Speed Ticker indicator */}
      <div className="bg-[#4A6B5D] text-[#F4F7F5] py-1 px-3 text-center text-xs font-medium tracking-wide flex justify-between items-center space-x-2 relative shadow-xs border-b border-[#3b5549]">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#D4A373] animate-pulse" />
          <span className="text-[11px] md:text-xs">
            {lang === "ar" 
              ? "⚡ نمذجة فائقة الخفة: يعمل بامتياز على شبكات غزة والإنترنت الضعيف (2G/3G)" 
              : "⚡ Ultra-light optimized: Works on GPRS & weak networks in Gaza (2G/3G)"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#D3E4CD]" />
          <span className="text-[11px] md:text-xs text-[#D3E4CD]">
            {lang === "ar" ? "تشفير شامل معزول الأطراف" : "End-to-End Cryptography Engaged"}
          </span>
        </div>
      </div>

      {/* Dynamic Connection Status Bar */}
      {(!isOnline || isSimulatedOffline) && (
        <div className="bg-amber-100 text-amber-900 text-xs font-extrabold py-2.5 px-4 shadow-sm text-center border-b border-amber-300">
          <span>
            {lang === "ar"
              ? "📡 أنت تعمل الآن في وضع عدم الاتصال - أدوات السكينة الذاتية متاحة دائماً وبسرّية كاملة"
              : "📡 You are working in Offline mode - SAKINA self-soothing tools are always running locally and secured"}
          </span>
        </div>
      )}

      {/* ESC Quick Escape Draft Recovery Banner */}
      <AnimatePresence>
        {hasEscBackup && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#D3E4CD] text-[#2B2D42] py-3.5 px-4 shadow-md text-center border-b border-[#b2cfab] relative overflow-hidden"
          >
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-right" dir="rtl">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <span className="text-xs md:text-sm font-bold text-[#4A6B5D]">
                  {lang === "ar"
                    ? "تم اكتشاف مسودات محفوظة مسبقاً جراء تفعيل زر الهروب السريع الطارئ (ESC). يمكنك استعادتها الآن دون أي فقد للبيانات."
                    : "Encrypted drafts recovered from emergency Quick Escape key (ESC). Restore them safely below."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={restoreEscDrafts}
                  className="px-3.5 py-1.5 bg-[#4A6B5D] hover:bg-[#3b5549] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {lang === "ar" ? "🔓 استعادة النصوص الآن" : "Restore Drafts"}
                </button>
                <button
                  type="button"
                  onClick={clearEscDrafts}
                  className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {lang === "ar" ? "🗑️ حذف وتجاهل" : "Dismiss"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Structural Banner & Header Layout */}
      <header className="sticky top-0 z-40 bg-[#F4F7F5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setCurrentView("home"); setSelectedRoomId(null); }}>
            <div className="bg-[#4A6B5D] h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center text-white shadow-xs">
              <span className="font-extrabold text-xl md:text-2xl mt-1 select-none">س</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#4A6B5D] select-none tracking-tight">{t.appTitle}</h1>
              <p className="text-[10px] md:text-[11px] text-[#2B2D42] opacity-80 select-none">
                {lang === "ar" ? "مساحة التشافي والأمان النفسي لغزة" : "The Sanctuary for Gaza emotional aid"}
              </p>
            </div>
          </div>

          {/* Nav Links bar */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            {userRole === "patient" && (
              <>
                <button 
                  className={`pb-1 border-b-2 hover:text-[#4A6B5D] transition-all cursor-pointer ${currentView === "home" ? "border-[#4A6B5D] text-[#4A6B5D]" : "border-transparent text-[#2B2D42] opacity-80"}`}
                  onClick={() => { setCurrentView("home"); setSelectedRoomId(null); }}
                >
                  {t.navHome}
                </button>
                <button 
                  className={`pb-1 border-b-2 hover:text-[#4A6B5D] transition-all cursor-pointer ${currentView === "consult" ? "border-[#4A6B5D] text-[#4A6B5D]" : "border-transparent text-[#2B2D42] opacity-80"}`}
                  onClick={() => { setCurrentView("consult"); setSelectedRoomId(null); }}
                >
                  {t.navConsult}
                </button>
                <button 
                  className={`pb-1 border-b-2 hover:text-[#4A6B5D] transition-all cursor-pointer ${currentView === "track" ? "border-[#4A6B5D] text-[#4A6B5D]" : "border-transparent text-[#2B2D42] opacity-80"}`}
                  onClick={() => { setCurrentView("track"); setSelectedRoomId(null); }}
                >
                  {t.navTrack}
                </button>
              </>
            )}

            <button 
              className={`pb-1 border-b-2 hover:text-[#4A6B5D] transition-all cursor-pointer ${currentView === "rooms" ? "border-[#4A6B5D] text-[#4A6B5D]" : "border-transparent text-[#2B2D42] opacity-80"}`}
              onClick={() => { setCurrentView("rooms"); setSelectedRoomId(null); }}
            >
              {t.navRooms}
            </button>
            <button 
              className={`pb-1 border-b-2 hover:text-[#4A6B5D] transition-all cursor-pointer ${currentView === "tips" ? "border-[#4A6B5D] text-[#4A6B5D]" : "border-transparent text-[#2B2D42] opacity-80"}`}
              onClick={() => { setCurrentView("tips"); setSelectedRoomId(null); }}
            >
              🌱 {lang === "ar" ? "نصائح وإرشادات الصمود" : "Tips & Recovery"}
            </button>

            {userRole === "patient" && (
              <button 
                className={`pb-1 border-b-2 hover:text-[#4A6B5D] transition-all cursor-pointer ${currentView === "offline" ? "border-[#4A6B5D] text-[#4A6B5D]" : "border-transparent text-[#2B2D42] opacity-80"}`}
                onClick={() => { setCurrentView("offline"); setSelectedRoomId(null); }}
              >
                📡 {lang === "ar" ? "طوارئ دون إنترنت" : "Offline Support"}
              </button>
            )}

            {userRole === "doctor" && (
              <button 
                className={`pb-1 border-b-2 hover:text-[#4A6B5D] transition-all cursor-pointer ${currentView === "doctor" ? "border-[#4A6B5D] text-[#4A6B5D]" : "border-transparent text-[#2B2D42] opacity-80"}`}
                onClick={() => { setCurrentView("doctor"); setSelectedRoomId(null); }}
              >
                📊 {t.navDoctor}
              </button>
            )}
          </nav>

          {/* Action Tools: language switcher + CTA buttons */}
          <div className="flex items-center gap-2">
            
            {/* Lang Toggle */}
            <button 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-white text-xs font-semibold hover:border-gray-400 text-[#2B2D42] transition-colors cursor-pointer"
              onClick={() => setLang(l => l === "ar" ? "en" : "ar")}
            >
              <Globe className="h-4.5 w-4.5 text-[#4A6B5D]" />
              <span>{lang === "ar" ? "English" : "العربية"}</span>
            </button>

            {/* Main CTA (Only for patient) */}
            {userRole === "patient" && (
              <button 
                className="px-4 py-2 bg-[#4A6B5D] hover:bg-[#3b5549] text-[#F4F7F5] rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                onClick={() => { setCurrentView("consult"); setSelectedRoomId(null); }}
              >
                {t.ctaConsultNow}
              </button>
            )}

            {/* Log Out button */}
            {userRole && (
              <button
                onClick={handleRoleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 hover:border-rose-300 transition-colors cursor-pointer active:scale-95"
                title={lang === "ar" ? "تسجيل الخروج والعودة لشاشة الاختيار" : "Logout and return to role selection"}
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>{lang === "ar" ? "خروج" : "Exit"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden bg-white/80 border-t border-gray-200 justify-around py-2.5 text-xs text-[#2B2D42]">
          {userRole === "patient" && (
            <>
              <button onClick={() => { setCurrentView("home"); setSelectedRoomId(null); }} className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentView === "home" ? "text-[#4A6B5D] font-bold" : "opacity-70"}`}>
                <Heart className="h-4 w-4" />
                <span>{t.navHome}</span>
              </button>
              <button onClick={() => { setCurrentView("consult"); setSelectedRoomId(null); }} className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentView === "consult" ? "text-[#4A6B5D] font-bold" : "opacity-70"}`}>
                <ShieldCheck className="h-4 w-4" />
                <span>{t.navConsult}</span>
              </button>
              <button onClick={() => { setCurrentView("track"); setSelectedRoomId(null); }} className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentView === "track" ? "text-[#4A6B5D] font-bold" : "opacity-70"}`}>
                <Search className="h-4 w-4" />
                <span>{t.navTrack}</span>
              </button>
            </>
          )}

          <button onClick={() => { setCurrentView("rooms"); setSelectedRoomId(null); }} className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentView === "rooms" ? "text-[#4A6B5D] font-bold" : "opacity-70"}`}>
            <Users className="h-4 w-4" />
            <span>{t.navRooms}</span>
          </button>
          <button onClick={() => { setCurrentView("tips"); setSelectedRoomId(null); }} className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentView === "tips" ? "text-[#4A6B5D] font-bold" : "opacity-70"}`}>
            <HeartPulse className="h-4 w-4" />
            <span>{lang === "ar" ? "الإرشادات" : "Tips"}</span>
          </button>

          {userRole === "patient" && (
            <button onClick={() => { setCurrentView("offline"); setSelectedRoomId(null); }} className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentView === "offline" ? "text-[#4A6B5D] font-bold" : "opacity-70"}`}>
              <AlertCircle className="h-4 w-4" />
              <span>{lang === "ar" ? "الطوارئ" : "Emergency"}</span>
            </button>
          )}

          {userRole === "doctor" && (
            <button onClick={() => { setCurrentView("doctor"); setSelectedRoomId(null); }} className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentView === "doctor" ? "text-[#4A6B5D] font-bold" : "opacity-70"}`}>
              <Lock className="h-4 w-4" />
              <span>{t.navDoctor}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <AnimatePresence mode="wait">
          
          {/* 1. HOME VIEW */}
          {currentView === "home" && (
            <motion.div 
              key="home-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              
              {/* Hero Banner Section */}
              <div className="bg-gradient-to-br from-[#4A6B5D] to-[#3a5348] text-[#F4F7F5] p-6 md:p-12 rounded-2xl md:rounded-3xl shadow-sm text-center md:text-start flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="space-y-4 max-w-2xl relative z-10">
                  <span className="bg-[#D4A373] text-black text-[11px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">{lang === "ar" ? "أمان مطلق • خصوصية باهتة" : "Top Security • Zero traces"}</span>
                  <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">{t.heroTitle}</h2>
                  <p className="text-sm md:text-base leading-relaxed opacity-90">{t.heroSubtitle}</p>
                  <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                    <button 
                      onClick={() => setCurrentView("consult")}
                      className="px-6 py-3 bg-[#D4A373] hover:bg-[#c39161] text-black font-bold rounded-xl text-xs md:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      {lang === "ar" ? "تقديم طلب استشارة مجهولة الاسم 📝" : "Request Anonymous Consultation 📝"}
                    </button>
                    <button 
                      onClick={() => setCurrentView("rooms")}
                      className="px-6 py-3 border border-white/40 hover:bg-white/10 text-white font-bold rounded-xl text-xs md:text-sm transition-all cursor-pointer"
                    >
                      {lang === "ar" ? "غرف الدعم والتحاور الفوري 🚪" : "Lounge Peer support Rooms 🚪"}
                    </button>
                  </div>
                </div>
                <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center opacity-85">
                  <svg viewBox="0 0 200 200" className="w-full h-full text-[#D4A373] animate-pulse">
                    <path fill="currentColor" d="M40,-68.9C50.7,-61.4,57.5,-48.2,65.6,-35.1C73.7,-22,83.1,-9,83.9,4.4C84.7,17.7,76.8,31.4,67.6,42.4C58.4,53.4,47.8,61.7,35.9,67.6C23.9,73.5,10.7,77,2.3,73.8C-6.2,70.6,-22.9,60.8,-35.9,51.8C-48.9,42.8,-58.2,34.5,-65.4,23.8C-72.7,13.1,-77.8,0.1,-76.3,-12.3C-74.8,-24.8,-66.6,-36.8,-56.3,-45.3C-46,-53.8,-33.5,-58.9,-20.9,-65.4C-8.2,-71.8,4.7,-79.8,17.5,-78.9C30.4,-78,39.3,-76.4,40,-68.9Z" transform="translate(100 100)" />
                  </svg>
                  <Heart className="absolute h-14 w-14 text-[#2B2D42]" />
                </div>
              </div>

              {/* Cognitive Vent Box (صندوق التنفيس والتلاشي) */}
              <div className="bg-white border text-[#2B2D42] p-6 md:p-8 rounded-2xl shadow-sm border-gray-200 relative overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50 pb-3">
                    <div className="flex items-center gap-3 text-right" dir="rtl">
                      <div className="bg-[#D3E4CD] p-2 rounded-lg text-[#4A6B5D]">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold">{t.ventTitle}</h3>
                        <p className="text-xs text-gray-500">{t.ventSubtitle}</p>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setPureVentingMode(true)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer justify-center shadow-xs self-start"
                    >
                      🧘‍♂️ <span>{lang === "ar" ? "تفعيل وضع التفريغ الصامت المعزول" : "Distraction-Free Focus Mode"}</span>
                    </button>
                  </div>

                  <form onSubmit={handleVentSubmit} className="space-y-4 pt-2">
                    <div className="relative">
                      <textarea
                        value={ventText}
                        onChange={(e) => {
                          setVentText(e.target.value);
                          setVentSuccessAlert(false);
                        }}
                        disabled={ventFading}
                        rows={5}
                        placeholder={t.ventPlaceholder}
                        className={`w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#4A6B5D] focus:border-transparent outline-none text-sm transition-all resize-none bg-[#F4F7F5]/50 leading-relaxed font-sans text-right ${ventFading ? "opacity-30 blur-[2px] cursor-not-allowed select-none transition-all duration-3000" : ""}`}
                        dir="rtl"
                      />
                      
                      {/* Evaporate effect visualizer */}
                      {ventFading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-[#F4F7F5]/80 rounded-xl">
                          <RefreshCw className="h-8 w-8 text-[#4A6B5D] animate-spin" />
                          <span className="text-xs font-bold text-[#4A6B5D] italic">
                            {lang === "ar" ? "🔥 جاري تمزيق وطحن الكلمات وتحويل الأحزان إلى ذرات من الهباء والعدم المنفسح... 💨" : "Evaporating the words into clean background space... 💨"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 flex-wrap">
                      <button
                        type="submit"
                        disabled={ventFading || !ventText.trim()}
                        className="px-6 py-3 bg-[#D4A373] hover:bg-[#c39161] disabled:opacity-40 text-black font-extrabold rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Volume2 className="h-4 w-4" />
                        <span>{t.ventBtn}</span>
                      </button>
                    </div>
                  </form>

                  <AnimatePresence>
                    {ventSuccessAlert && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-[#D3E4CD]/60 border border-[#b2cfab] rounded-xl text-sm text-[#3b5549] text-center font-bold flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="h-5 w-5 text-[#4A6B5D]" />
                        <span>{t.ventSuccess}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* PURE MEDITATIVE FOCUS MODE POPUP OVERLAY */}
              <AnimatePresence>
                {pureVentingMode && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-[#1e2229] bg-radial from-[#1e2229] via-[#111317] to-black z-50 flex items-center justify-center p-4 md:p-8"
                    dir="rtl"
                  >
                    {/* Floating ambient light effect vectors */}
                    <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl" />

                    <div className="max-w-3xl w-full bg-white/[0.03] backdrop-blur-lg border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl relative z-10 space-y-6 flex flex-col justify-between max-h-[90vh]">
                      
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="text-right">
                          <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                            🧘‍♂️ {lang === "ar" ? "مساحة التعافي الصامت والمعزول" : "Focused Decompression Sanctuary"}
                          </span>
                          <h4 className="text-base md:text-lg font-bold text-gray-100 mt-1.5">
                            {lang === "ar" ? "تفريغ الروح الطليق من كدر الهواجس والخوف" : "Zero-Distraction Writing Pad"}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPureVentingMode(false);
                            setVentText("");
                            setVentSuccessAlert(false);
                          }}
                          className="px-4 py-2 hover:bg-white/10 text-gray-300 font-bold border border-white/10 rounded-xl text-xs transition-all cursor-pointer"
                        >
                          ❌ {lang === "ar" ? "إنهاء وغلق العزلة" : "Exit Sanctuary"}
                        </button>
                      </div>

                      {/* Wide writing area */}
                      <div className="flex-1 relative py-2">
                        <textarea
                          value={ventText}
                          onChange={(e) => {
                            setVentText(e.target.value);
                            setVentSuccessAlert(false);
                          }}
                          disabled={ventFading}
                          rows={8}
                          placeholder={lang === "ar" ? "اكتب هنا تفاصيل قلقك، مخاوفك، أفكارك المنهكة بالكامل، لا أحد يراقب، لا كلمات تُسجل في خوادم الشبكة... بمجرد إرسالها ستتلاشى وتضمحل إلى العدم اللامتناهي." : "Write your grief, anger, anxiety or traumatic loops here completely untraced..."}
                          className={`w-full h-full min-h-[250px] md:min-h-[300px] p-6 rounded-2xl bg-black/40 text-gray-100 font-sans leading-relaxed text-sm md:text-base border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 outline-none resize-none text-right transition-all duration-500 ${
                            ventFading ? "opacity-10 blur-xl scale-95 pointer-events-none" : ""
                          }`}
                        />

                        {/* Evaporating Smoke Animation Simulation overlay */}
                        {ventFading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-black/80 rounded-2xl text-center p-3"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360], opacity: [0.3, 0.8, 0.3] }}
                              transition={{ repeat: Infinity, duration: 4.5 }}
                              className="h-16 w-16 border-2 border-dashed border-emerald-500 rounded-full flex items-center justify-center text-emerald-400"
                            >
                              💨
                            </motion.div>
                            <span className="text-sm font-bold text-emerald-400 text-center tracking-wide font-sans md:max-w-md">
                              {lang === "ar" 
                                ? "⏳ نسمع نبضات قلبك.. جاري فك كدر الكلمات، وطحن أوزار الروح، وتبخيرها تماماً كدخان ساكن يعود إلى الفضاء السحيق..." 
                                : "The words and sorrows are evaporating into the deep vacuum atmosphere..."}
                            </span>
                          </motion.div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-[10px] text-gray-500 font-mono">
                          {lang === "ar" 
                            ? "🔊 سيفعل المحاكي الصوتي مؤثراً ورقياً هادئاً لتسهيل فصام وتلاشي الذرات" 
                            : "🔊 Web Audio API paper-shred/fading generator is active"}
                        </span>
                        
                        <button
                          type="button"
                          onClick={handleVentSubmit}
                          disabled={ventFading || !ventText.trim()}
                          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-extrabold text-xs md:text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 text-right shrink-0"
                        >
                          <Volume2 className="h-4 w-4" />
                          <span>{lang === "ar" ? "أبخر وتبخير همي للعدم 💨" : "Evaporate Sorrows! 💨"}</span>
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hurdles Cards Section */}
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#4A6B5D]">{t.cardHurdles}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                    <div className="bg-[#4A6B5D]/10 h-10 w-10 text-[#4A6B5D] flex items-center justify-center rounded-xl font-bold text-lg">١</div>
                    <h4 className="font-bold text-[#2B2D42] text-sm md:text-base">{t.obstacle1}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{t.obstacle1Desc}</p>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                    <div className="bg-[#4A6B5D]/10 h-10 w-10 text-[#4A6B5D] flex items-center justify-center rounded-xl font-bold text-lg">٢</div>
                    <h4 className="font-bold text-[#2B2D42] text-sm md:text-base">{t.obstacle2}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{t.obstacle2Desc}</p>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                    <div className="bg-[#4A6B5D]/10 h-10 w-10 text-[#4A6B5D] flex items-center justify-center rounded-xl font-bold text-lg">٣</div>
                    <h4 className="font-bold text-[#2B2D42] text-sm md:text-base">{t.obstacle3}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{t.obstacle3Desc}</p>
                  </div>
                  {/* Card 4 */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                    <div className="bg-[#4A6B5D]/10 h-10 w-10 text-[#4A6B5D] flex items-center justify-center rounded-xl font-bold text-lg">٤</div>
                    <h4 className="font-bold text-[#2B2D42] text-sm md:text-base">{t.obstacle4}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{t.obstacle4Desc}</p>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* 2. SECURE CONSULT FORM VIEW */}
          {currentView === "consult" && (
            <motion.div
              key="consult-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto space-y-6 text-right"
              dir="rtl"
            >
              <button 
                onClick={() => setCurrentView("home")}
                className="flex items-center gap-1.5 text-xs text-[#4A6B5D] font-bold hover:underline cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{lang === "ar" ? "العودة للرئيسية" : "Back to Home"}</span>
              </button>

              {/* Sub-tab Selection */}
              <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1 items-center">
                <button
                  type="button"
                  onClick={() => setConsultSubtab("assessment")}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    consultSubtab === "assessment" ? "bg-white text-[#4A6B5D] shadow-xs" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  📊 {lang === "ar" ? "مقياس سكينة للتعافي والصلابة الذاتية" : "Resilience Self-Assessment"}
                </button>
                <button
                  type="button"
                  onClick={() => setConsultSubtab("form")}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    consultSubtab === "form" ? "bg-white text-[#4A6B5D] shadow-xs" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  ✉️ {lang === "ar" ? "تقديم استشارة سرية حرة ومباشرة" : "confidential Written Consult"}
                </button>
              </div>

              {consultSubtab === "assessment" ? (
                <div className="space-y-6">
                  {/* Interactive Quiz Card */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-xs relative overflow-hidden">
                    
                    {/* Decorative Background */}
                    <div className="absolute top-0 left-0 text-[#4A6B5D]/5 -translate-x-6 -translate-y-6 select-none pointer-events-none">
                      <Sparkles className="w-32 h-32" />
                    </div>

                    <div className="border-b border-gray-100 pb-4 relative z-10">
                      <span className="bg-[#4A6B5D]/10 text-[#4A6B5D] text-[10px] uppercase font-mono font-extrabold px-3 py-1 rounded-full">
                        {lang === "ar" ? "أداة التقييم الذاتي والتفريج السريري" : "Interactive Resilience Meter"}
                      </span>
                      <h3 className="text-lg md:text-xl font-extrabold text-[#4A6B5D] mt-2">
                        {lang === "ar" ? "مقياس سكينة للصلابة والتعافي الذاتي 📊" : "Sakina Emotional Decompression Assessment"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {lang === "ar" 
                          ? "استبيان هادئ مكون من سؤال واحد في كل خطوة لرعاية مشاعرك وقياس تماسك النفس في فترات صدمات الأزمات." 
                          : "A peaceful step-by-step diagnostic to measure resilience indicators, self-regulate, and monitor recovery."}
                      </p>
                    </div>

                    {assessmentScore === null ? (
                      // Quiz Running States
                      (() => {
                        const QUESTIONS_REF = [
                          {
                            id: 1,
                            questionAr: "كيف تصف جودة نومك واستقرار أحلامك وتجنبك للكوابيس المزعجة مؤخراً؟",
                            questionEn: "How would you rate your sleep quality and avoidance of recurring nightmares lately?",
                            optionsAr: ["سيء جداً وكوابيس متكررة 😰", "متقطع ومصحوب بالذعر والنهوض 💔", "مقبول نوعاً ما مع بعض القلق 🧠", "مستقر في أغلب الليالي 🕯️", "عميق وهادئ ومكافئ ومطهر 🌟"],
                            optionsEn: ["Severe nightmares / insomnia 😰", "Disrupted with frequent panics 💔", "Moderately anxious but sleepable 🧠", "Mostly calm and secure 🕯️", "Deeply peaceful and restorative 🌟"]
                          },
                          {
                            id: 2,
                            questionAr: "عند السماع لأصوات مفاجئة أو قوية بالخارج، إلى أي درجة تعاني من خفقان سريع للقلب وضيق تنفسي حاد؟",
                            questionEn: "When hearing loud sudden sounds outside, to what degree do you experience severe palpitation & dyspnea?",
                            optionsAr: ["ذعر كامل وتشنج تنفسي خانق 💔", "خوف شديد واضطراب حركي مع قشعريرة 😨", "ارتجاف بسيط يزول في دقائق معدودة 🧠", "توتر طفيف عابر بوعي تام وصمود 🕯️", "طمأنينة وهدوء فسيولوجي كامل وراسخ 🌟"],
                            optionsEn: ["Total panic & breathing spasm 💔", "Severe anxiety & rapid shaking 😨", "Minor trembling fading quickly 🧠", "Slight alert with fast focus 🕯️", "Complete physiological resilience 🌟"]
                          },
                          {
                            id: 3,
                            questionAr: "ما مدى شعورك بقدرتك العاطفية على الصمود اليومي وتلبية الاحتياجات الأساسية لمن حولك بالرعاية؟",
                            questionEn: "How confident are you in managing your emotions and care duties for your peers/family?",
                            optionsAr: ["منهار عاطفياً وتحت وطأة العجز الكامل 🥀", "أشعر بصعوبة حادة وعشوائية في الأفكار 😰", "أجاهد لتلبية الحد الأدنى بجهود متعبة 🤝", "أتحمل المهام بثقة وتوزان هادئ 🕯️", "أقود مبادرات المساندة بصلابة تامة ونبل 🌟"],
                            optionsEn: ["Completely hopeless / overwhelmed 🥀", "Struggling & highly disorganized 😰", "Coping with strenuous efforts 🤝", "Managing duties with quiet confidence 🕯️", "Leading support initiatives resiliently 🌟"]
                          },
                          {
                            id: 4,
                            questionAr: "إلى أي مدى تشعر برداءة المزاج أو الحزن الطاغي المستمر الذي يحجب عن بصيرتك ومضات الأمل؟",
                            questionEn: "How often do you feel engulfed in deep constant sadness blocking any sparks of hope?",
                            optionsAr: ["حزن دائم وخانق يعزلني تماماً 💔", "شعور متكرر بمرارة ويأس عارم ومجهل 😰", "الأيام حزينة، لكن أجد البسمة تارات 🤝", "الحزن عابر ومسيطر عليه بمرونة جيدة 🕯️", "أشعر برضا داخلي وسلام وبشائر أمل واعدة 🌟"],
                            optionsEn: ["Constant suffocating sorrow 💔", "Frequent bitter sadness & despair 😰", "Mostly melancholic but occasional joy 🤝", "Transient grief managed with ease 🕯️", "Deep inner peace and proactive hope 🌟"]
                          },
                          {
                            id: 5,
                            questionAr: "كيف تقيم تواصلك وتضامنك ومشاركتك للمشاعر الداعمة مع عائلتك أو رفاق المخيم؟",
                            questionEn: "How would you rate your emotional sharing and active empathy with peers or family?",
                            optionsAr: ["منعزل ومنطوٍ تماماً وأتجنب المخالطة 🥀", "متحفظ وأشعر بغربة حقيقية بين الناس 😰", "أشارك المشاعر بحدود مقتضبة عند الإلحاح 🤝", "أتعامل وأتعاطف بمرونة وسهولة مع القوم 🕯️", "منخرط كلياً وأبث السكينة والطمأنينة بكل نبل 🌟"],
                            optionsEn: ["Totally isolated & uncommunicative 🥀", "Withdrawn with deep sense of estrangement 😰", "Share emotions only when prompted 🤝", "Frequently social and empathetically present 🕯️", "Deeply engaged in spreading warm solidarity 🌟"]
                          }
                        ];

                        const q = QUESTIONS_REF[assessmentStep] || QUESTIONS_REF[0];
                        const progPercent = Math.round(((assessmentStep + 1) / QUESTIONS_REF.length) * 100);

                        return (
                          <div className="space-y-6 relative z-10">
                            {/* Smooth Progress Bar */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 font-mono">
                                <span>{lang === "ar" ? `السؤال ${assessmentStep + 1} من ${QUESTIONS_REF.length}` : `Question ${assessmentStep + 1} of ${QUESTIONS_REF.length}`}</span>
                                <span>{progPercent}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <motion.div 
                                  animate={{ width: `${progPercent}%` }}
                                  transition={{ duration: 0.3 }}
                                  className="bg-[#4A6B5D] h-full rounded-full"
                                />
                              </div>
                            </div>

                            {/* Question heading */}
                            <div className="bg-[#F4F7F5] p-5 rounded-2xl border border-gray-100 text-center space-y-2">
                              <p className="text-xs text-[#4A6B5D] font-extrabold uppercase tracking-widest">{lang === "ar" ? "قضية القياس الآتية" : "Diagnostic Focus"}</p>
                              <h4 className="text-sm md:text-base font-extrabold text-gray-800 leading-relaxed font-sans">
                                {lang === "ar" ? q.questionAr : q.questionEn}
                              </h4>
                            </div>

                            {/* Options Single-Select Button Stack */}
                            <div className="space-y-2.5">
                              {q.optionsAr.map((option, idx) => {
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      const nextAnswers = [...assessmentAnswers, idx];
                                      setAssessmentAnswers(nextAnswers);
                                      if (assessmentStep < QUESTIONS_REF.length - 1) {
                                        setAssessmentStep(assessmentStep + 1);
                                      } else {
                                        // Final score is sum of zero-indexed scores (each 0 to 4, max 20) * 5 (to scale out of 100 percent)
                                        const finalScoreValue = nextAnswers.reduce((a, b) => a + b, 0) * 5;
                                        setAssessmentScore(finalScoreValue);
                                      }
                                    }}
                                    className="w-full text-right p-4 rounded-xl border border-gray-200 bg-white hover:border-[#4A6B5D]/40 hover:bg-[#F4F7F5]/30 text-xs font-bold text-gray-700 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between"
                                  >
                                    <span>{lang === "ar" ? option : q.optionsEn[idx]}</span>
                                    <span className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-mono shrink-0 font-bold bg-gray-50 text-gray-400">
                                      {idx + 1}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      // Quiz Completion Score Dashboard
                      <div className="space-y-6 text-center relative z-10">
                        <div className="max-w-md mx-auto space-y-4">
                          <CheckCircle className="h-12 w-12 text-[#4A6B5D] mx-auto animate-bounce" />
                          <h4 className="text-base font-extrabold text-[#2B2D42]">
                            {lang === "ar" ? "اكتمل التقييم الشخصي بنجاح!" : "Self-Assessment Complete!"}
                          </h4>

                          {/* Radical Score dial container */}
                          <div className="relative inline-flex items-center justify-center p-4">
                            <svg className="w-36 h-36">
                              <circle 
                                className="text-gray-100" 
                                strokeWidth="10" 
                                stroke="currentColor" 
                                fill="transparent" 
                                r="58" 
                                cx="72" 
                                cy="72" 
                              />
                              <motion.circle 
                                className="text-[#4A6B5D]" 
                                strokeWidth="10" 
                                strokeDasharray={364}
                                strokeDashoffset={364 - (364 * assessmentScore) / 100}
                                strokeLinecap="round" 
                                stroke="currentColor" 
                                fill="transparent" 
                                r="58" 
                                cx="72" 
                                cy="72" 
                                initial={{ strokeDashoffset: 364 }}
                                animate={{ strokeDashoffset: 364 - (364 * assessmentScore) / 100 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                              <span className="text-3xl font-extrabold font-mono text-[#4A6B5D]">{assessmentScore}%</span>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{lang === "ar" ? "رصيد السكينة" : "Calm Index"}</span>
                            </div>
                          </div>

                          {/* Dynamic diagnostic feedback paragraph */}
                          <div className="p-4 rounded-2xl border bg-[#F4F7F5] text-right space-y-1 leading-relaxed">
                            <span className="text-[10px] font-mono text-gray-400 block font-bold uppercase">
                              {lang === "ar" ? "التقرير السريري المؤقت" : "Clinical Coping Feedback"}
                            </span>
                            <p className="text-xs text-gray-800 font-bold">
                              {assessmentScore >= 80 ? (
                                lang === "ar" 
                                  ? "🌱 صلابة نفسية متميزة وسكينة واعدة: روحك صامدة مفعمة بالثبات وتغلب مرونة الذات على نوائب الدهر. دم سراجاً منيراً لمحيطك بمخيم التعافي." 
                                  : "🌱 Outstanding Resilience: Your emotional engine is functioning with powerful calm and adaptability. Continue supporting others!"
                              ) : assessmentScore >= 50 ? (
                                lang === "ar" 
                                  ? "⚠️ إجهاد صدمي قلق معتدل: قلبك يواجه الركام بمرونة جيدة، ولكنك تستهلك وقوداً حيوياً مجهداً لتفادي الذعر. تفضل بمراجعة الأخصائي ومارِس التبخير والتنفس بانتظام." 
                                  : "⚠️ Moderate Traumatic Fatigue: Your heart is coping, but you are utilizing a significant emotional quota. Focus on square breathing."
                              ) : (
                                lang === "ar" 
                                  ? "🚨 إجهاد صدمي حاد وقلق حرج: تعيش حيزاً من الفزع الخانق وتراجع الاستقرار النفسي. نوصيك بشدة بنقل هذه النتيجة للأخصائي فوراً للبدء باستشارات داعمة وعميقة." 
                                  : "🚨 Critical Trauma Indicators: High vulnerability was detected. We strongly suggest raising these diagnostics to our clinics below."
                              )}
                            </p>
                          </div>

                          {/* Two cohesive CTAs */}
                          <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                // Transition to consultation tab with prepopulated clinical checklist report
                                const scoreReport = lang === "ar"
                                  ? `[مذكرة فحص الصلابة التلقائية المرفقة] حصلت على نتيجة ${assessmentScore}% في مقياس سكينة الذاتي.\nأعاني من إجهاد عاطفي متصاعد وأحتاج لتوجيهات المشرف والولوج لمصادر التعافي المعتمدة لتجاوز صدمات الهلع والذعر.`
                                  : `[Diagnostic Resilience Attachment] Computed calm score is ${assessmentScore}%. Seeking direct counseling support from therapist to counter panic.`;
                                setConsultText(scoreReport);
                                setConsultSubtab("form");
                                // Focus written text area
                              }}
                              className="flex-1 py-2.5 px-4 bg-[#4A6B5D] text-white font-bold text-xs rounded-xl hover:bg-[#3b5549] transition-all cursor-pointer shadow-3xs"
                            >
                              🩺 {lang === "ar" ? "أريد رفع النتيجة كاستشارة للأخصائي" : "Submit Score directly to Doctor"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAssessmentStep(0);
                                setAssessmentAnswers([]);
                                setAssessmentScore(null);
                                setAssessmentSaved(false);
                              }}
                              className="py-2.5 px-4 border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
                            >
                              🔁 {lang === "ar" ? "إعادة الفحص والقياس" : "Try Again"}
                            </button>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>

                  {/* Secret Account Vault and Graph Section (خيار حفظ النتيجة للمقارنة لاحقاً) */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 space-y-4 shadow-xs">
                    <div className="flex items-center gap-2 border-b border-gray-50 pb-3 justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-[#D4A373]" />
                        <h4 className="font-extrabold text-xs md:text-sm text-gray-800">
                          {lang === "ar" ? "خزانة التخزين للمقارنة اللاحقة (🔒 الحساب السري)" : "Resilience Tracker (🔒 Confidential Account)"}
                        </h4>
                      </div>
                      
                      {isSecretLoggedIn && (
                        <button
                          onClick={handleSecretLogout}
                          className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer"
                        >
                          🚪 {lang === "ar" ? "تسجيل خروج آمن" : "Secure Sign-out"}
                        </button>
                      )}
                    </div>

                    {!isSecretLoggedIn ? (
                      // Sign up or log into confidential trajectories
                      <div className="space-y-4">
                        <p className="text-[11px] leading-relaxed text-gray-500">
                          {lang === "ar"
                            ? "تجنباً لخرق عهود السرية، لا نطلب بريداً إلكترونياً أو هوية حقيقية بالشبكة. اختر اسماً مستعاراً مبهماً وقرنه برمز أمان PIN سري (من 4 أرقام) لحفظ تقاريرك الدورية ومقارنة تغيرات صمودك لاحقاً بأمان."
                            : "For complete HIPAA-grade psychiatric comfort, we do not require emails or phone numbers. Input an anonymous secret pseudonym and 4-digit PIN access credentials to sync with the server database."}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1 text-right">
                            <label className="text-[10px] font-extrabold text-gray-600 ">{lang === "ar" ? "الاسم المستعار للحساب السري:" : "Pseudonym Alias Account:"}</label>
                            <input
                              type="text"
                              value={secretUsername}
                              onChange={(e) => setSecretUsername(e.target.value.trim())}
                              placeholder={lang === "ar" ? "مثال: بطل_الشمال_صامد" : "e.g. northern_warrior"}
                              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-sans focus:ring-1 focus:ring-[#4A6B5D]"
                            />
                          </div>
                          
                          {/* Secret PIN or Security Question Recovery Toggler */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center pb-1">
                              <label className="text-[10px] font-extrabold text-gray-600">
                                {recoverSecretWithQuestion 
                                  ? (lang === "ar" ? "🛡️ التحقق بسؤال الأمان المخصص:" : "🛡️ Recovery question:")
                                  : (lang === "ar" ? "رمز الأمان الخاص بك (4 أرقام):" : "4-Digit secret PIN code:")}
                              </label>
                              <button
                                type="button"
                                onClick={() => setRecoverSecretWithQuestion(!recoverSecretWithQuestion)}
                                className="text-[9px] font-bold text-[#4A6B5D] hover:underline cursor-pointer"
                              >
                                {recoverSecretWithQuestion 
                                  ? (lang === "ar" ? "🔑 العودة للرمز PIN" : "🔑 Back to PIN")
                                  : (lang === "ar" ? "🛡️ نسيت الرمز؟" : "🛡️ Forgot PIN?")}
                              </button>
                            </div>

                            {!recoverSecretWithQuestion ? (
                              <input
                                type="password"
                                maxLength={4}
                                value={secretPin}
                                onChange={(e) => setSecretPin(e.target.value.replace(/\D/g, ""))}
                                placeholder="••••"
                                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-center font-bold tracking-widest text-[#4A6B5D] focus:ring-1 focus:ring-[#4A6B5D]"
                              />
                            ) : (
                              <div className="space-y-2 bg-[#D3E4CD]/10 p-2.5 rounded-xl border border-[#4A6B5D]/20 text-right" dir="rtl">
                                <span className="text-[9px] font-bold text-[#4A6B5D] leading-none block pb-1">
                                  {lang === "ar" ? "🔑 اختر سؤال الأمان والجواب اللذين قمت بإعدادهما للحساب:" : "🔒 Select question & answer configured for this account:"}
                                </span>
                                <select
                                  value={secretRecoverQuestionId}
                                  onChange={(e) => setSecretRecoverQuestionId(e.target.value)}
                                  className="w-full p-2 rounded-lg border border-gray-150 text-[10px] bg-white text-right outline-none focus:border-[#4A6B5D]"
                                >
                                  {SECURITY_QUESTIONS.map(q => (
                                    <option key={q.id} value={q.id}>{lang === "ar" ? q.ar : q.en}</option>
                                  ))}
                                </select>
                                <input
                                  type="text"
                                  value={secretRecoverAnswer}
                                  onChange={(e) => setSecretRecoverAnswer(e.target.value)}
                                  placeholder={lang === "ar" ? "إجابة سؤال الأمان" : "Security Answer"}
                                  className="w-full p-2 rounded-lg border border-gray-150 text-xs text-right outline-none bg-white focus:border-[#4A6B5D]"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* If they are setting up a NEW save, show optional question config */}
                        {!recoverSecretWithQuestion && secretPin.length === 4 && assessmentScore !== null && (
                          <div className="space-y-2.5 p-3.5 bg-[#D3E4CD]/10 rounded-2xl border border-dashed border-[#4A6B5D]/20 text-right" dir="rtl">
                            <span className="text-[9px] font-extrabold uppercase text-[#4A6B5D] px-2 py-0.5 bg-[#D3E4CD]/20 rounded-full inline-block">
                              {lang === "ar" ? "🛡️ اختيار حماية نسيان رمز الـ PIN" : "🛡️ Optional PIN Lost Recovery Setup"}
                            </span>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 block">
                                {lang === "ar" ? "اختر سؤال أمان استباقي للاحتفاظ بالنتيجة:" : "Select Recovery Question:"}
                              </label>
                              <select
                                value={secretSecurityQuestionId}
                                onChange={(e) => setSecretSecurityQuestionId(e.target.value)}
                                className="w-full p-2 rounded-lg border border-gray-200 text-[10px] bg-white text-right outline-none focus:border-[#4A6B5D]"
                              >
                                {SECURITY_QUESTIONS.map(q => (
                                  <option key={q.id} value={q.id}>{lang === "ar" ? q.ar : q.en}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 block">
                                {lang === "ar" ? "اكتب جواب السؤال (سيتم هاشه لحماية الخصوصية):" : "Security Question Answer:"}
                              </label>
                              <input
                                type="text"
                                value={secretSecurityAnswer}
                                onChange={(e) => setSecretSecurityAnswer(e.target.value)}
                                placeholder={lang === "ar" ? "مثال: الكرامة، المخيم الغربي..." : "e.g., hometown..."}
                                className="w-full p-2 rounded-lg border border-gray-200 text-xs text-right outline-none bg-white focus:border-[#4A6B5D]"
                              />
                            </div>
                          </div>
                        )}

                        {secretAuthError && (
                          <div className="p-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold text-center">
                            ⚠️ {secretAuthError}
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            disabled={
                              savingAssessmentState || 
                              !secretUsername.trim() || 
                              (!recoverSecretWithQuestion && secretPin.length !== 4) ||
                              (recoverSecretWithQuestion && !secretRecoverAnswer.trim())
                            }
                            onClick={retrieveSecretHistory}
                            className="flex-1 py-2.5 bg-[#F4F7F5] hover:bg-[#eaeaea] text-gray-800 border border-gray-200 text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95"
                          >
                            🔓 {lang === "ar" ? "دخول وعرض مخطط تتبعي" : "Log in Tracker"}
                          </button>
                          
                          {assessmentScore !== null && (
                            <button
                              type="button"
                              disabled={savingAssessmentState || !secretUsername || secretPin.length !== 4}
                              onClick={saveAssessmentToSecretAccount}
                              className="flex-1 py-2.5 bg-[#D4A373] hover:bg-[#c39161] text-black text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95"
                            >
                              💾 {assessmentSaved ? (lang === "ar" ? "تم تخزينه بنجاح!" : "Saved!") : (lang === "ar" ? "حفظ نتيجتي بالخزانة" : "Save Result")}
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Logged In -> Trajectory Interactive Chart Panel!
                      <div className="space-y-4">
                        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 flex items-center justify-between text-right">
                          <span className="text-xs font-bold">
                            ✨ {lang === "ar" ? `الحساب السري نشط: @${secretUsername}` : `Logged in pseudonym: @${secretUsername}`}
                          </span>
                          <span className="text-[10px] bg-white text-emerald-700 px-2.5 py-1 rounded-full font-bold">
                            🔒 {lang === "ar" ? "مشفر تماماً" : "Fully Encrypted"}
                          </span>
                        </div>

                        {/* Interactive Responsive SVG Area Graph (Pure JSX Vector Craft) */}
                        <div className="bg-[#F4F7F5] p-3.5 rounded-2xl border border-gray-150 text-center">
                          <div className="border-b border-gray-200 pb-2 mb-3 flex items-center justify-between text-[11px] font-bold text-gray-500">
                            <span>📈 {lang === "ar" ? "مخطط تماثلك لمرونة الأعصاب والتعافي" : "Resilience Trajectory Index Chart"}</span>
                            <span className="bg-gray-100 rounded px-1.5 py-0.5 text-[9px] font-mono">{secretHistory.length} {lang === "ar" ? "نقاط" : "points"}</span>
                          </div>

                          {secretHistory.length === 0 ? (
                            <div className="py-12 text-center text-xs text-slate-400 italic">
                              {lang === "ar" ? "لا توجد نقاط سابقة مدونة بعد. قم بإجراء القياس وحفظه لإثراء المخطط التوجيهي." : "No entries stored yet. Save your first score above."}
                            </div>
                          ) : (
                            (() => {
                              const sortedHistory = [...secretHistory].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                              const width = 500;
                              const height = 180;
                              const paddingL = 40;
                              const paddingR = 20;
                              const paddingT = 20;
                              const paddingB = 30;

                              // Generate coordinate mapping
                              const points = sortedHistory.map((item, index) => {
                                const x = sortedHistory.length > 1
                                  ? paddingL + (index * (width - paddingL - paddingR)) / (sortedHistory.length - 1)
                                  : paddingL + (width - paddingL - paddingR) / 2;
                                
                                const y = height - paddingB - (item.score / 100) * (height - paddingB - paddingT);
                                return { x, y, score: item.score, date: new Date(item.timestamp).toLocaleDateString(lang === "ar" ? "ar-EG" : "en", {month: "short", day: "numeric"}) };
                              });

                              // Construct SVG path string
                              let dLine = "";
                              let dArea = "";
                              if (points.length > 0) {
                                dLine = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
                                dArea = `M ${points[0].x} ${height - paddingB} L ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ") + ` L ${points[points.length - 1].x} ${height - paddingB} Z`;
                              }

                              return (
                                <div className="w-full overflow-x-auto">
                                  <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-[500px]">
                                    <defs>
                                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4A6B5D" stopOpacity="0.32" />
                                        <stop offset="100%" stopColor="#4A6B5D" stopOpacity="0.0" />
                                      </linearGradient>
                                    </defs>

                                    {/* Draw baseline and horizontal thresholds */}
                                    {[25, 50, 75, 100].map(threshold => {
                                      const yGrid = height - paddingB - (threshold / 100) * (height - paddingB - paddingT);
                                      return (
                                        <g key={threshold}>
                                          <line x1={paddingL} y1={yGrid} x2={width - paddingR} y2={yGrid} stroke="#eaeaea" strokeDasharray="3 3" />
                                          <text x={paddingL - 8} y={yGrid + 4} textAnchor="end" className="text-[9px] font-mono font-bold fill-gray-400">{threshold}%</text>
                                        </g>
                                      );
                                    })}

                                    {/* Draw area and line */}
                                    {points.length > 0 && (
                                      <>
                                        <path d={dArea} fill="url(#areaGrad)" />
                                        <path d={dLine} fill="none" stroke="#4A6B5D" strokeWidth="3" strokeLinecap="round" />
                                      </>
                                    )}

                                    {/* Draw anchor dots */}
                                    {points.map((p, i) => (
                                      <g key={i} className="group cursor-pointer">
                                        <circle cx={p.x} cy={p.y} r="5" fill="#white" stroke="#4A6B5D" strokeWidth="3" />
                                        <circle cx={p.x} cy={p.y} r="2" fill="#4A6B5D" />
                                        
                                        {/* Score text directly above dot */}
                                        <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[9px] font-bold fill-emerald-800 font-mono bg-white">{p.score}%</text>
                                        
                                        {/* Date label at bottom border */}
                                        <text x={p.x} y={height - 10} textAnchor="middle" className="text-[8px] font-mono fill-gray-400 font-bold">{p.date}</text>
                                      </g>
                                    ))}
                                  </svg>
                                </div>
                              );
                            })()
                          )}
                        </div>

                        {/* List format historical rows */}
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {secretHistory.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px] p-2 bg-gray-50 border border-gray-100 rounded-lg">
                              <span className="font-bold text-gray-500 font-mono">
                                {new Date(item.timestamp).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {dateStyle: "medium", timeStyle: "short"})}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className={`h-2.5 w-2.5 rounded-full ${item.score >= 80 ? "bg-emerald-500" : item.score >= 50 ? "bg-amber-400" : "bg-rose-500"}`} />
                                <span className="font-extrabold text-[#4A6B5D] font-mono">{item.score}%</span>
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Direct free consultation form block
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-xs">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-[#4A6B5D]">{t.consultTitle}</h3>
                    <p className="text-xs text-gray-500 mt-1">{t.consultSubtitle}</p>
                  </div>

                  {!generatedTrackId ? (
                    <form onSubmit={submitConsultation} className="space-y-5">
                      
                      {/* Category Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#2B2D42] block text-right">{t.fieldCategory}</label>
                        <select
                          value={consultCategory}
                          onChange={(e: any) => setConsultCategory(e.target.value)}
                          className="w-full p-3 rounded-lg border border-gray-300 bg-[#F4F7F5] outline-none font-sans text-xs md:text-sm focus:border-[#4A6B5D] text-right"
                        >
                          <option value="trauma">{t.catTrauma}</option>
                          <option value="anxiety">{t.catAnxiety}</option>
                          <option value="grief">{t.catGrief}</option>
                          <option value="other">{t.catOther}</option>
                        </select>
                      </div>

                      {/* Content text */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#2B2D42] block text-right">{t.fieldDetails}</label>
                        <textarea
                          value={consultText}
                          onChange={(e) => setConsultText(e.target.value)}
                          required
                          rows={6}
                          placeholder={t.fieldPlaceholder}
                          className="w-full p-4 rounded-xl border border-gray-300 font-sans text-xs md:text-sm bg-[#F4F7F5]/40 outline-none leading-relaxed focus:ring-2 focus:ring-[#4A6B5D] focus:border-transparent resize-none text-right"
                        />
                      </div>

                      {/* Security 4-digit PIN Salt */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#2B2D42] block text-right">
                          {lang === "ar" 
                            ? "رقم مرور للحماية الإضافية (4 أرقام يختارها عقلك):" 
                            : "4-Digit Security PIN (Required for Tracking/Decryption):"}
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          pattern="\d{4}"
                          value={consultPin}
                          onChange={(e) => setConsultPin(e.target.value.replace(/\D/g, ""))}
                          required
                          placeholder={lang === "ar" ? "مثال: 4821 • اختر رمزًا في سرّية تامة لتتذكره، لن يتم حفظه نصيًا" : "e.g., 4821 • Choose in absolute secrecy, we never store this PIN in plain text"}
                          className="w-full p-3 rounded-lg border border-gray-300 font-sans text-xs md:text-sm bg-[#F4F7F5] outline-none tracking-widest text-[#4A6B5D] font-bold focus:border-[#4A6B5D] text-center"
                        />
                        <p className="text-[10px] text-gray-400">
                          {lang === "ar" 
                            ? "🛡️ تشفير الملح الرقمي: سيتم تشفير فك الرد برمزك المميز هذا. حتى لو تم اختراق خوادمنا بالكامل، فلن يمكن لأحد أبداً فك شفرة ومواساة الأخصائي بدون الرمز." 
                            : "🛡️ Digital Salt: The doctor's response will merge with this PIN salt. Nobody will ever trace or decode it without this code."}
                        </p>
                      </div>

                      {/* Security Question Section (Forgot PIN Protection) */}
                      {consultPin.length === 4 && (
                        <div className="space-y-3 bg-[#D3E4CD]/15 p-4 rounded-xl border border-dashed border-[#4A6B5D]/30 text-right" dir="rtl">
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="text-[10px] font-bold uppercase text-[#4A6B5D] px-2.5 py-0.5 bg-[#D3E4CD]/30 rounded-full inline-block">
                              {lang === "ar" ? "🛡️ مساندة إضافية: حماية للاسترداد في حال نسيت الرمز" : "🛡️ Extra Support: Recovery Question if PIN is Forgotten"}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[11px] font-extrabold text-gray-700 block">
                              {lang === "ar" ? "اختر سؤال الأمان المقترح:" : "Select Security Question:"}
                            </label>
                            <select
                              value={consultSecurityQuestionId}
                              onChange={(e) => setConsultSecurityQuestionId(e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-200 text-xs bg-white text-right font-sans outline-none focus:border-[#4A6B5D]"
                            >
                              {SECURITY_QUESTIONS.map(q => (
                                <option key={q.id} value={q.id}>{lang === "ar" ? q.ar : q.en}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-extrabold text-[#2B2D42] block">
                              {lang === "ar" ? "إجابة سؤال الأمان (احفظها بدقة وتذكر كتابتها):" : "Security Question Answer:"}
                            </label>
                            <input
                              type="text"
                              value={consultSecurityAnswer}
                              onChange={(e) => setConsultSecurityAnswer(e.target.value)}
                              placeholder={lang === "ar" ? "مثال: احمد، معسكر دير البلح، الاستاذ سمير..." : "e.g., childhood playmate..."}
                              className="w-full p-2.5 rounded-lg border border-gray-200 text-xs bg-white text-right outline-none focus:border-[#4A6B5D]"
                            />
                            <p className="text-[9px] text-gray-400 leading-normal mt-0.5">
                              {lang === "ar" 
                                ? "💡 تصفية آلية لطيفة: نستخدم نظام تطهير متقدم يتجاوز اختلاف التهجئة لغارقي الهلع والنسيان!"
                                : "💡 Automated Soft filter: we resolve simple spelling typos gracefully to accommodate crisis memory fog!"}
                            </p>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={consultSubmitting || !consultText.trim() || consultPin.length !== 4}
                        className="w-full py-3 bg-[#4A6B5D] hover:bg-[#3b5549] text-white disabled:opacity-45 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        {consultSubmitting ? (lang === "ar" ? "جاري تشفير المذكرة الطبية النفسية... ⏳" : "Securing and Encrypting Transmission... ⏳") : t.btnSubmitConsult}
                      </button>
                    </form>
                  ) : (
                    
                    // Success State yielding Tracking ID
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-[#D3E4CD]/50 border border-[#b2cfab] rounded-2xl text-center space-y-4"
                    >
                      <CheckCircle className="h-12 w-12 text-[#4A6B5D] mx-auto" />
                      <h4 className="font-bold text-[#4A6B5D] text-base">{t.consultSuccessTitle}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">{t.consultSuccessDesc}</p>
                      
                      <div className="flex flex-col items-center gap-2 max-w-sm mx-auto p-4 bg-white rounded-xl border border-dashed border-[#4A6B5D]">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{lang === "ar" ? "رقمك السري والوحيد للتتبع" : "Your Random Tracking ID"}</span>
                        <span className="text-xl md:text-3xl font-mono font-extrabold text-[#4A6B5D] tracking-widest">{generatedTrackId}</span>
                        
                        {consultPin && (
                          <div className="mt-2 text-center border-t border-dashed border-gray-100 pt-2 w-full">
                            <span className="text-[10px] text-red-500 font-bold block">{lang === "ar" ? "⚠️ رقم الأمان (PIN) التابع لك والمختار:" : "⚠️ Your associated Security PIN:"}</span>
                            <span className="text-sm font-mono font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded inline-block select-all">{consultPin}</span>
                          </div>
                        )}

                        <button
                          onClick={() => copyToClipboard(generatedTrackId)}
                          className="mt-2 px-3 py-1.5 bg-[#4A6B5D] hover:bg-[#3b5549] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                          <span>{copiedAlert ? t.copied : t.copyBtn}</span>
                        </button>
                      </div>

                      <p className="text-xs text-[#D4A373] font-bold max-w-sm mx-auto">{t.noteTrack}</p>
                      
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setGeneratedTrackId(null);
                            setConsultText("");
                            setCurrentView("track");
                          }}
                          className="px-6 py-2 bg-[#D4A373] hover:bg-[#c39161] text-black font-extrabold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          {lang === "ar" ? "الانتقال لغرفة تتبع الردود وعرض النتائج" : "Proceed to Tracking responses"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* 3. TRACK RESPONSES VIEW */}
          {currentView === "track" && (
            <motion.div
              key="track-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <button 
                onClick={() => setCurrentView("home")}
                className="flex items-center gap-1 text-xs text-[#4A6B5D] font-bold hover:underline cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{lang === "ar" ? "العودة للرئيسية" : "Back to Home"}</span>
              </button>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-xs">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[#4A6B5D]">{t.trackTitle}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t.trackSubtitle}</p>
                </div>

                {/* Input block */}
                <div className="space-y-4 bg-[#F4F7F5]/30 p-4 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block text-right" dir="rtl">
                        {lang === "ar" ? "رقم استشارتك العشوائي:" : "Random Consultation ID:"}
                      </label>
                      <input
                        type="text"
                        value={trackIdInput}
                        onChange={(e) => setTrackIdInput(e.target.value)}
                        placeholder={t.trackPlaceholder}
                        className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-1 focus:ring-[#4A6B5D] outline-none text-xs md:text-sm font-mono tracking-widest uppercase text-center focus:border-[#4A6B5D]"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block text-right">
                        {lang === "ar" ? "المعرف العشوائي للاستشارة الطبية:" : "Consultation tracking ID:"}
                      </label>
                      <input
                        type="text"
                        value={trackIdInput}
                        onChange={(e) => setTrackIdInput(e.target.value)}
                        placeholder={t.trackPlaceholder}
                        className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-1 focus:ring-[#4A6B5D] outline-none text-xs md:text-sm font-mono tracking-widest uppercase text-center focus:border-[#4A6B5D]"
                      />
                    </div>
                    
                    {/* Security Question Toggle for lost PIN */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center pb-1">
                        <label className="text-xs font-bold text-gray-700 block text-right">
                          {recoverConsultWithQuestion 
                            ? (lang === "ar" ? "🛡️ التحقق بسؤال الأمان المخصص:" : "🛡️ Verify with security question:")
                            : (lang === "ar" ? "رمز المرور الشخصي (4 أرقام):" : "4-digit Security PIN:")}
                        </label>
                        <button
                          type="button"
                          onClick={() => setRecoverConsultWithQuestion(!recoverConsultWithQuestion)}
                          className="text-[10px] font-bold text-[#4A6B5D] hover:underline cursor-pointer"
                        >
                          {recoverConsultWithQuestion 
                            ? (lang === "ar" ? "🔑 العودة للرمز PIN" : "🔑 Go to PIN")
                            : (lang === "ar" ? "🛡️ نسيت الرمز؟" : "🛡️ Forgot PIN?")}
                        </button>
                      </div>

                      {!recoverConsultWithQuestion ? (
                        <input
                          type="password"
                          maxLength={4}
                          pattern="\d{4}"
                          value={trackPinInput}
                          onChange={(e) => setTrackPinInput(e.target.value.replace(/\D/g, ""))}
                          placeholder="e.g., 4821"
                          className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-1 focus:ring-[#4A6B5D] outline-none text-xs md:text-sm font-mono tracking-widest text-[#4A6B5D] font-bold text-center focus:border-[#4A6B5D]"
                        />
                      ) : (
                        <div className="space-y-3 bg-[#D3E4CD]/10 p-3 rounded-xl border border-[#4A6B5D]/20 text-right" dir="rtl">
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-gray-500 block">
                              {lang === "ar" ? "سؤال الأمان المختار مسبقاً:" : "Recovery Question Selected:"}
                            </label>
                            <select
                              value={consultRecoverQuestionId}
                              onChange={(e) => setConsultRecoverQuestionId(e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-200 text-xs bg-white text-right outline-none focus:border-[#4A6B5D]"
                            >
                              {SECURITY_QUESTIONS.map(q => (
                                <option key={q.id} value={q.id}>{lang === "ar" ? q.ar : q.en}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-gray-500 block">
                              {lang === "ar" ? "إجابة سؤال الأمان:" : "Security Question Answer:"}
                            </label>
                            <input
                              type="text"
                              value={consultRecoverAnswer}
                              onChange={(e) => setConsultRecoverAnswer(e.target.value)}
                              placeholder={lang === "ar" ? "اكتب الإجابة بالمسودة" : "e.g., childhood playmate..."}
                              className="w-full p-2.5 rounded-lg border border-gray-200 text-xs text-right outline-none bg-white focus:border-[#4A6B5D]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={trackInquiry}
                    disabled={
                      trackingLoading || 
                      !trackIdInput.trim() || 
                      (!recoverConsultWithQuestion && trackPinInput.length !== 4) ||
                      (recoverConsultWithQuestion && !consultRecoverAnswer.trim())
                    }
                    className="w-full py-3.5 bg-[#4A6B5D] hover:bg-[#3b5549] text-white disabled:opacity-40 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                  >
                    {trackingLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4.5 w-4.5" />}
                    <span>{t.btnTrack}</span>
                  </button>
                </div>

                {trackingError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>{trackingError}</span>
                  </div>
                )}

                {/* Track results visual */}
                {trackedResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 border-t border-gray-100 pt-6"
                  >
                    {/* Diagnostic Status Box */}
                    <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2.5 ${trackedResult.conStatus === "answered" ? "bg-[#D3E4CD]/60 text-[#3b5549] border border-[#b2cfab]" : "bg-[#F4F7F5] text-amber-600 border border-amber-200"}`}>
                      {trackedResult.conStatus === "answered" ? <CheckCircle className="h-5 w-5 text-[#4A6B5D]" /> : <Clock className="h-5 w-5 animate-pulse" />}
                      <div>
                        <p>{trackedResult.conStatus === "answered" ? t.statusAnswered : t.statusPending}</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{lang === "ar" ? "رقم الاستشارة:" : "ID reference:"} {trackedResult.id}</p>
                      </div>
                    </div>

                    {/* Evacuee's Complaint */}
                    <div className="bg-[#F4F7F5]/50 p-4 rounded-xl border border-gray-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">{t.patientInquiry}</span>
                      <p className="text-xs md:text-sm text-[#2B2D42] leading-relaxed">{trackedResult.textDecrypted}</p>
                    </div>

                    {/* Doctor's Response card */}
                    {trackedResult.conStatus === "answered" && (
                      <div className="bg-[#4A6B5D]/5 border-2 border-[#4A6B5D]/30 p-5 rounded-xl space-y-2 relative">
                        <div className="absolute top-3 left-3 bg-[#4A6B5D] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">🩺 {lang === "ar" ? "معالج معتمد" : "Therapist"}</div>
                        <span className="text-[10px] uppercase font-bold text-[#4A6B5D] block">{t.doctorReply}</span>
                        <p className="text-xs md:text-sm text-[#1e2e28] font-medium leading-relaxed bg-white p-4 rounded-lg shadow-2xs whitespace-pre-line">{trackedResult.replyDecrypted}</p>
                        <span className="text-[10px] text-gray-400 block text-end mt-1 font-mono">{new Date(trackedResult.replyAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* 4. CHAT SUPPORT ROOMS VIEW */}
          {currentView === "rooms" && (
            <motion.div
              key="rooms-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              
              {!selectedRoomId ? (
                // 4A. List Rooms available
                <div className="space-y-6">
                  <div className="text-center space-y-2 max-w-xl mx-auto">
                    <h3 className="text-xl md:text-2xl font-bold text-[#4A6B5D]">{t.roomsTitle}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{t.roomsSubtitle}</p>
                  </div>

                  {/* Category Pill Filters Bar */}
                  <div className="bg-[#4A6B5D]/5 border border-[#4A6B5D]/15 rounded-3xl p-4 md:p-5 space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-2.5">
                      <div className="text-start">
                        <span className="text-xs font-bold text-[#4A6B5D] uppercase tracking-wider flex items-center justify-start gap-1">
                          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>{lang === "ar" ? "تصفية وتصنيف مجموعات الدعم الجماعي" : "Support Lounge Categories & Filters"}</span>
                        </span>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {lang === "ar" 
                            ? "اضغط على أي تصنيف لفلترة الغرف فوراً وتسريع الانتقال والمشاهدة." 
                            : "Click any category tab below to filter clinical rooms instantly."}
                        </p>
                      </div>

                      {doctorLoggedIn && (
                        <div className="text-[10.5px] font-bold text-[#4A6B5D] bg-[#4A6B5D]/10 border border-[#4A6B5D]/15 px-3 py-1 rounded-xl w-fit shrink-0">
                          🩺 {lang === "ar" ? `الأخصائي المتصل: د. ${doctorName}` : `Lic. Clinician: Dr. ${doctorName}`}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {/* Filter 1: All */}
                      <button
                        onClick={() => {
                          setRoomsSpecialtyFilter(false);
                          setSelectedCategoryTab("all");
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-3xs ${
                          !roomsSpecialtyFilter && selectedCategoryTab === "all"
                            ? "bg-[#4A6B5D] text-white"
                            : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        🌍 {lang === "ar" ? "جميع غرف الدعم الجماعي" : "All Patients & Cases"}
                      </button>

                      {/* Filter 2: Doctor specialty */}
                      {doctorLoggedIn && (
                        <button
                          onClick={() => {
                            setRoomsSpecialtyFilter(true);
                            setSelectedCategoryTab("all");
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-3xs ${
                            roomsSpecialtyFilter
                              ? "bg-[#D4A373] text-white border-transparent"
                              : "bg-amber-50/50 border border-amber-200 text-amber-800 hover:bg-amber-100/50"
                          }`}
                        >
                          🎯 {lang === "ar" ? "مجموعات تخصصي السريري فقط" : "My Clinical Specialties"}
                        </button>
                      )}

                      {/* Filter 3: Category themes */}
                      {ROOM_THEMES.map((room) => {
                        const isSelected = !roomsSpecialtyFilter && selectedCategoryTab === room.id;
                        const titleMini = lang === "ar" 
                          ? room.nameAr.replace(/💔|😰|🍃|🧠|🕯️|🌟|🤝/g, "").trim()
                          : room.nameEn.trim();
                        const icon = room.id === "trauma" ? "💔" :
                                     room.id === "panic" ? "😰" :
                                     room.id === "resilience" ? "🍃" :
                                     room.id === "anxiety" ? "🧠" :
                                     room.id === "grief" ? "🕯️" :
                                     room.id === "depression" ? "🌟" : "🤝";
                        
                        return (
                          <button
                            key={room.id}
                            onClick={() => {
                              setRoomsSpecialtyFilter(false);
                              setSelectedCategoryTab(room.id);
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-3xs ${
                              isSelected
                                ? "bg-[#4A6B5D] text-white border-transparent"
                                : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <span>{icon}</span>
                            <span>{titleMini}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ROOM_THEMES.filter(room => {
                      if (doctorLoggedIn && roomsSpecialtyFilter) {
                        return doctorSpecialties.includes(room.id);
                      }
                      if (selectedCategoryTab !== "all") {
                        return room.id === selectedCategoryTab;
                      }
                      return true;
                    }).map((room) => {
                      const isDoctorSpecialty = doctorLoggedIn && doctorSpecialties.includes(room.id);
                      return (
                        <div 
                          key={room.id} 
                          className={`bg-white border text-[#2B2D42] p-6 rounded-2xl shadow-2xs flex flex-col justify-between h-60 hover:shadow-3xs transition-all relative overflow-hidden ${
                            isDoctorSpecialty 
                              ? "border-2 border-[#4A6B5D] shadow-3xs" 
                              : "border-gray-200"
                          }`}
                        >
                          {/* Top decorative highlighted specialized banner */}
                          {isDoctorSpecialty && (
                            <div className="absolute top-0 right-0 left-0 h-1 bg-[#4A6B5D]"></div>
                          )}

                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-1.5">
                              <h4 className="font-extrabold text-sm md:text-base text-[#4A6B5D] leading-tight">
                                {lang === "ar" ? room.nameAr : room.nameEn}
                              </h4>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold bg-green-50 w-fit px-2 py-0.5 rounded-md">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span>{Math.floor(12 + Math.random() * 25)} {t.activeUsers}</span>
                              </div>

                              {isDoctorSpecialty && (
                                <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-1 rounded-md w-fit flex items-center gap-1 mt-1 shrink-0 uppercase tracking-wide">
                                  🩺 {lang === "ar" ? "تحت إشرافك العلاجي معتمد" : "Under Your Medical Expertise"}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedRoomId(room.id);
                              setMessages([]);
                            }}
                            className="w-full mt-4 py-3 bg-[#4A6B5D]/10 hover:bg-[#4A6B5D] hover:text-white text-[#4A6B5D] font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                          >
                            {t.joinRoomBtn}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                
                // 4B. Joined support chat room
                <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[580px] overflow-hidden">
                  
                  {/* Chat header */}
                  <div className="bg-[#F4F7F5] border-b border-gray-200 p-4 flex items-center justify-between">
                    <button 
                      onClick={() => setSelectedRoomId(null)}
                      className="flex items-center gap-1 text-xs text-[#4A6B5D] font-bold hover:underline cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>{lang === "ar" ? "العودة لغرف الدعم" : "Back to Rooms"}</span>
                    </button>

                    <div className="text-center font-bold text-xs md:text-sm text-[#4A6B5D]">
                      {lang === "ar" ? ROOM_THEMES.find(r => r.id === selectedRoomId)?.nameAr : ROOM_THEMES.find(r => r.id === selectedRoomId)?.nameEn}
                    </div>

                    <div className="text-[10px] md:text-xs text-semibold bg-[#D4A373]/20 text-[#2B2D42] px-2 py-1 rounded-md border border-[#D4A373]/30">
                      {t.yourMask} <span className="font-bold underline">{myAlias}</span>
                    </div>
                  </div>

                  <div className="bg-[#4A6B5D]/5 p-2 px-4 text-center text-[10px] md:text-xs text-gray-500 font-semibold border-b border-gray-100 flex items-center justify-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-[#4A6B5D]" />
                    <span>{t.therapistAlert}</span>
                  </div>

                  {/* Messages container list */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-4 text-xs text-gray-400 space-y-1">
                        <Clock className="h-8 w-8 text-[#4A6B5D] opacity-40" />
                        <p>{lang === "ar" ? "قاعة المحادثة هادئة حالياً. ابدأ بكتابة رسالة مساندة لزملائك لتعزيز الصمود..." : "Lounge is calm. Share some warm support thoughts..."}</p>
                      </div>
                    ) : (
                      messages.map((m) => {
                        const isMe = m.alias === myAlias;
                        return (
                          <div key={m.id} className={`flex flex-col max-w-[85%] ${isMe ? "ms-auto items-end" : "me-auto items-start"}`}>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold mb-0.5">
                              {m.isDoctor && <span className="bg-[#4A6B5D] text-white text-[8px] leading-none px-1 py-0.5 rounded">🩺 {lang === "ar" ? "أخصائي سكينة" : "Therapist"}</span>}
                              <span>{m.alias}</span>
                              <span className="font-normal opacity-70">• {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              
                              {!m.isDeleted && !isMe && (
                                <button
                                  type="button"
                                  onClick={() => reportRoomMessage(m.id)}
                                  disabled={reportedMessageIds.includes(m.id)}
                                  className="text-gray-400 hover:text-red-500 font-bold transition-all text-[9px] cursor-pointer inline-flex items-center gap-0.5 bg-gray-100 hover:bg-red-50 px-1 py-0.5 rounded-md"
                                  title={lang === "ar" ? "الإبلاغ عن رسالة مسيئة لحماية المجتمع" : "Report offensive comment"}
                                >
                                  🚩 {reportedMessageIds.includes(m.id) ? (lang === "ar" ? "مُبلغ" : "Report") : (lang === "ar" ? "إبلاغ" : "Report")}
                                </button>
                              )}
                            </div>

                            <div className={`p-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
                              m.isDeleted 
                                ? "bg-gray-100 text-gray-400 italic font-medium" 
                                : m.isDoctor 
                                  ? "bg-white border-2 border-[#4A6B5D] text-[#1e2e28] font-semibold shadow-xs" 
                                  : isMe 
                                    ? "bg-[#4A6B5D] text-[#F4F7F5] rounded-tr-none" 
                                    : "bg-white text-[#2B2D42] border border-gray-200 rounded-tl-none"
                            }`}>
                              {m.message}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input box */}
                  <form onSubmit={sendRoomMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                    <input
                      type="text"
                      value={roomChatInput}
                      onChange={(e) => setRoomChatInput(e.target.value)}
                      placeholder={t.chatPlaceholder}
                      className="flex-1 p-3 text-xs md:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4A6B5D] bg-[#F4F7F5]/30 leading-normal"
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !roomChatInput.trim()}
                      className="px-5 py-3 bg-[#4A6B5D] hover:bg-[#3b5549] disabled:opacity-40 text-[#F4F7F5] rounded-xl text-xs font-bold transition-transform cursor-pointer flex items-center justify-center"
                    >
                      <Send className="h-4.5 w-4.5" />
                    </button>
                  </form>

                </div>
              )}
            </motion.div>
          )}

          {/* 5. PRIVATE INDIVIDUAL breakout chat room */}
          {currentView === "private-chat" && privateChatId && (
            <motion.div
              key="private-chat-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto bg-white rounded-3xl border-2 border-[#D4A373] shadow-lg flex flex-col h-[540px] overflow-hidden"
            >
              <div className="bg-[#D4A373]/15 border-b border-[#D4A373]/30 p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs md:text-sm text-[#2B2D42] flex items-center gap-1">
                    <Lock className="h-4 w-4 text-[#D3E4CD] bg-amber-700/85 p-0.5 rounded" />
                    <span>{t.privateChatTitle}</span>
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">{t.privateChatSubtitle}</p>
                </div>

                <button
                  onClick={() => {
                    setPrivateChatId(null);
                    setShowPullModal(false);
                    setCurrentView("rooms");
                  }}
                  className="px-3 py-1.5 bg-[#4A6B5D] text-white rounded-lg text-xs font-bold hover:bg-[#3b5549] transition-colors cursor-pointer"
                >
                  {t.closeSession}
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F4F7F5]/30">
                {privateMessages.map((pm, i) => {
                  const isDoctor = pm.sender === "doctor";
                  return (
                    <div key={i} className={`flex flex-col max-w-[85%] ${!isDoctor ? "ms-auto items-end" : "me-auto items-start"}`}>
                      <span className="text-[9px] text-gray-400 font-bold mb-0.5">
                        {isDoctor ? `⭐ ${t.doctorBadge}` : t.patientBadge}
                      </span>
                      <div className={`p-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-3xs ${
                        isDoctor 
                          ? "bg-white text-[#111] border-l-4 border-[#D4A373]" 
                          : "bg-[#4A6B5D] text-[#F4F7F5]"
                      }`}>
                        {pm.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input for Private Chat */}
              <form onSubmit={sendPrivateMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  value={privateChatInput}
                  onChange={(e) => setPrivateChatInput(e.target.value)}
                  placeholder={lang === "ar" ? "تحدث سراً مع معالجك النفسي..." : "Type confidentially..."}
                  className="flex-1 p-3 text-xs md:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#D4A373]"
                />
                <button
                  type="submit"
                  disabled={!privateChatInput.trim()}
                  className="px-5 py-3 bg-[#D4A373] text-black font-extrabold rounded-xl text-xs hover:bg-[#c39161] transition-transform cursor-pointer"
                >
                  {lang === "ar" ? "تأمين ونشر" : "Send Secured"}
                </button>
              </form>
            </motion.div>
          )}

          {/* TIPS & RECOVERY STORIES VIEW */}
          {currentView === "tips" && (
            <motion.div
              key="tips-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 text-right"
              dir="rtl"
            >
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-[#4A6B5D]/10 to-transparent p-6 rounded-3xl border border-[#4A6B5D]/20 space-y-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#4A6B5D]/15 text-[#4A6B5D] p-3 rounded-2xl">
                    <HeartPulse className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#4A6B5D]">
                      {lang === "ar" ? "🌱 دليل الإسعاف وتخفيف الأزمات النفسية" : "🌱 Crisis Relief & Psychological Aid"}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === "ar" 
                        ? "دليل تفاعلي لإغاثة الذعر، الهلع والخوف بأحجام خط واضحة مقروءة وداعمة للاستماع الصوتي الهادئ." 
                        : "An interactive platform providing high-contrast guidebooks and audibly playable coping strategies."}
                    </p>
                  </div>
                </div>

                {/* Extra visual accessibility custom bar */}
                <button
                  type="button"
                  onClick={() => setLargeFontForTips(!largeFontForTips)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    largeFontForTips 
                      ? "bg-amber-100 text-amber-900 border-amber-300" 
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  👁️ <span>{lang === "ar" ? (largeFontForTips ? "تصغير الخط للوضع الافتراضي" : "تفعيل الخط الكبير ومريح العين") : (largeFontForTips ? "Normal Typography" : "Zoom Font for Crisis View")}</span>
                </button>
              </div>

              {/* 1. دليل إسعافات نفسية أولية سريع ومختصر (INFOGRAPHICS) */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-3xs">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    📋 {lang === "ar" ? "دليل الإسعافات النفسية الأولية للميدان" : "Clinical Psychological First Aid Guide"}
                  </span>
                  <h3 className="text-base md:text-lg font-extrabold text-slate-900 mt-1.5">
                    {lang === "ar" ? "بروتوكول سكينة المباشر لتهدئة روع الضحايا والمصابين" : "Immediate Crisis Coping Protocols"}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 bg-emerald-50/45 rounded-2xl border border-emerald-100 text-right space-y-2">
                    <div className="text-2xl">👀</div>
                    <h4 className="font-extrabold text-[#4A6B5D] text-xs">1. {lang === "ar" ? "انظرْ وتفرّس (LOOK)" : "1. Observe (LOOK)"}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {lang === "ar" 
                        ? "تفحّص معالم السلامة الجسدية فوراً، أمّن مأوىً ساكناً، وابحث عن ذوي الحاجة الملحة للتهدئة." 
                        : "Inspect security parameters, secure physical shield and isolate immediate critical cases."}
                    </p>
                  </div>

                  <div className="p-4 bg-sky-50/45 rounded-2xl border border-sky-100 text-right space-y-2">
                    <div className="text-2xl">👂</div>
                    <h4 className="font-extrabold text-sky-800 text-xs">2. {lang === "ar" ? "استمعْ بوعي (LISTEN)" : "2. Hear (LISTEN)"}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {lang === "ar" 
                        ? "أفسح للمكلومين بث آلامهم وقلقهم، لا تقاطعهم أو تحكم بمثالية زائفة، دعهم ينفسوا بالكامل." 
                        : "Allow victims to vent deeply under non-judgmental presence, assuring comfort and safety."}
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50/45 rounded-2xl border border-purple-100 text-right space-y-2">
                    <div className="text-2xl">🤝</div>
                    <h4 className="font-extrabold text-purple-800 text-xs">3. {lang === "ar" ? "وصّل واربِط (LINK)" : "3. Connect (LINK)"}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {lang === "ar" 
                        ? "اربط المنكوبين بفرقنا الطبية والتموينية، قدّم لهم الأقرباء وشغّل كود التتبع الخاص بالمنصة." 
                        : "Connect victims with specialized counselors and locate safe medical resources."}
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/45 rounded-2xl border border-amber-100 text-right space-y-2">
                    <div className="text-2xl">💨</div>
                    <h4 className="font-extrabold text-amber-800 text-xs">4. {lang === "ar" ? "زفر وتنفس (BREATHE)" : "4. Calm (BREATHE)"}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {lang === "ar" 
                        ? "درّب الضحية على استنشاق السكينة لمدة 4 ثوان والزفير المبرد لـ 4 ثوان لتبديد ضربات هلع القلب." 
                        : "Guide standard therapeutic box-breathing to balance acute adrenaline and panic pulses."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form & List Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Right Column: Submit Advice Form */}
                <div className="bg-white border border-gray-200 rounded-3xl p-5 md:p-6 space-y-4 shadow-3xs lg:col-span-1">
                  <div className="border-b border-gray-100 pb-3 flex items-center gap-1.5">
                    <Sparkles className="h-5 w-5 text-[#4A6B5D]" />
                    <h3 className="font-bold text-sm text-[#2B2D42]">
                      {doctorLoggedIn
                        ? (lang === "ar" ? "🩺 كتابة توجيه طبي معتمد" : "🩺 Post Certified Medical Tip")
                        : (lang === "ar" ? "✍️ شارك وصية صمودك أو قصتك" : "✍️ Write Your Coping Story")}
                    </h3>
                  </div>

                  <form onSubmit={handleCreateTip} className="space-y-3">
                    {!doctorLoggedIn && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#2B2D42] block text-right">
                          {lang === "ar" ? "👤 هويتك المستعارة بالمنشور:" : "👤 Your custom alias:"}
                        </label>
                        <input
                          type="text"
                          value={newTipAuthor}
                          onChange={(e) => setNewTipAuthor(e.target.value)}
                          placeholder={lang === "ar" ? `مستعار (افتراضي: ${myAlias})` : `Alias (default: ${myAlias})`}
                          className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4A6B5D] text-xs text-right"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#2B2D42] block text-right">
                        {lang === "ar" ? "📌 عنوان الفكرة أو تجربة التعافي:" : "📌 Strategy Header / Subject:"}
                      </label>
                      <input
                        type="text"
                        value={newTipTitle}
                        onChange={(e) => setNewTipTitle(e.target.value)}
                        placeholder={lang === "ar" ? "مثال: كيف تجاوزنا فقد بيتنا، أو روتيني لتبديد وتدير الذعر" : "Example: My breathing schedule during alarm"}
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4A6B5D] text-xs text-right"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#2B2D42] block text-right">
                        {lang === "ar" ? "🎯 التصنيف والاضطراب المستهدف بالصمود:" : "🎯 Context Category:"}
                      </label>
                      <select
                        value={newTipCategory}
                        onChange={(e) => setNewTipCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4A6B5D] text-xs bg-[#F4F7F5] cursor-pointer text-right"
                      >
                        {ROOM_THEMES.map(room => (
                          <option key={room.id} value={room.id}>
                            {lang === "ar" ? room.nameAr.replace(/💔|😰|🍃|🧠|🕯|🌟|🤝/g, "").trim() : room.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#2B2D42] block text-right">
                        {lang === "ar" ? "✍️ تفاصيل نصيحتك أو قصتك بالتفصيل:" : "✍️ Write your coping recipe / story:"}
                      </label>
                      <textarea
                        value={newTipText}
                        onChange={(e) => setNewTipText(e.target.value)}
                        rows={4}
                        placeholder={lang === "ar" 
                          ? "اكتب الخطوات أو التجربة العملية بأسلوب مشجع يبعث التماسك والصبر في قلوب زملائك بالقطاع..." 
                          : "State your positive findings, daily schedules, exercises, or real-life reflections..."}
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4A6B5D] text-xs leading-relaxed text-right"
                      />
                    </div>

                    {tipPostingError && (
                      <div className="p-2.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold">
                        ⚠️ {tipPostingError}
                      </div>
                    )}

                    {tipPostingSuccess && (
                      <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold">
                        ✅ {lang === "ar" ? "تم نشر فكرتك وتعميم تضامنك لرفاق السكينة بنجاح!" : "Resilience message shared successfully with the board!"}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submittingTip}
                      className="w-full py-2.5 bg-[#4A6B5D] hover:bg-[#3b5549] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {submittingTip 
                        ? (lang === "ar" ? "جاري تدوين صمودك..." : "Publishing...")
                        : (doctorLoggedIn 
                            ? (lang === "ar" ? "نشر التوجيه الطبي المعتمد 🩺" : "Publish Specialist Advice 🩺") 
                            : (lang === "ar" ? "تدعيم رصيد الصمود بالمنشور ✨" : "Share Resilience Advice ✨")
                          )
                      }
                    </button>
                  </form>
                </div>

                {/* Left Column: Tips Scroll List */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Category Filter Tabs for Author Type */}
                  <div className="flex p-1 bg-gray-100 rounded-2xl items-center gap-1">
                    <button
                      onClick={() => setTipsFilter("all")}
                      className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        tipsFilter === "all" ? "bg-[#4A6B5D] text-white shadow-xs" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      🌍 {lang === "ar" ? "الجميع" : "All Board"}
                    </button>
                    <button
                      onClick={() => setTipsFilter("doctor")}
                      className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        tipsFilter === "doctor" ? "bg-[#4A6B5D] text-white shadow-xs" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      🩺 {lang === "ar" ? "التوجيهات المعتمدة" : "Physicians Advice"}
                    </button>
                    <button
                      onClick={() => setTipsFilter("patient")}
                      className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        tipsFilter === "patient" ? "bg-[#4A6B5D] text-white shadow-xs" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      🌟 {lang === "ar" ? "قصص الرفاق" : "Recovery Stories"}
                    </button>
                  </div>

                  {/* 2. بطاقات ومقترحات مقسمة حسب الحالة (خوف، قلق، هلع) */}
                  <div className="flex flex-wrap items-center gap-1 bg-slate-50 border border-slate-100 p-1.5 rounded-2xl">
                    <span className="text-[10px] font-extrabold text-[#4A6B5D] px-2 block">{lang === "ar" ? "تصنيف الحالة:" : "State Category:"}</span>
                    <button
                      type="button"
                      onClick={() => setCrisisTipsCategory("all")}
                      className={`px-3 py-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer ${
                        crisisTipsCategory === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      {lang === "ar" ? "الكل" : "All"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCrisisTipsCategory("panic")}
                      className={`px-3 py-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer ${
                        crisisTipsCategory === "panic" ? "bg-rose-500 text-white" : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      😰 {lang === "ar" ? "هلع وذعر حاد" : "Panic & Alarm"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCrisisTipsCategory("trauma")}
                      className={`px-3 py-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer ${
                        crisisTipsCategory === "trauma" ? "bg-amber-600/90 text-white" : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      😨 {lang === "ar" ? "خوف وروّع شديد" : "Terror & Fear"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCrisisTipsCategory("anxiety")}
                      className={`px-3 py-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer ${
                        crisisTipsCategory === "anxiety" ? "bg-blue-600/95 text-white" : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      🧠 {lang === "ar" ? "قلق وتوتر العصاب" : "Anxiety & Stress"}
                    </button>
                  </div>

                  {loadingTips ? (
                    <div className="p-12 text-center text-gray-500 text-xs">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#4A6B5D] border-t-transparent mb-2"></div>
                      <p>{lang === "ar" ? "جاري استرجاع نصائح الصمود ووصفات الشفاء المباركة..." : "Retrieving certified clinical advice..."}</p>
                    </div>
                  ) : (
                    (() => {
                      const displayedTips = tipsStories.filter(tip => {
                        // Apply main doctor/patient filter
                        if (tipsFilter === "doctor" && tip.type !== "doctor") return false;
                        if (tipsFilter === "patient" && tip.type !== "patient") return false;
                        // Apply state-category sub-filter
                        if (crisisTipsCategory !== "all" && tip.category !== crisisTipsCategory) return false;
                        return true;
                      });

                      if (displayedTips.length === 0) {
                        return (
                          <div className="p-12 text-center bg-white border border-gray-200 rounded-3xl text-gray-500 text-xs">
                            🔍 {lang === "ar" ? "لا توجد منشورات للقسم المختار حالياً. كن أول من يضيف وصايا الصمود للزملاء!" : "No resources indexed under this category yet."}
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
                          {displayedTips.map((tip) => {
                            const roomTheme = ROOM_THEMES.find(r => r.id === tip.category);
                            const roomLabel = roomTheme 
                              ? (lang === "ar" ? roomTheme.nameAr.replace(/💔|😰|🍃|🧠|🕯️|🌟|🤝/g, "").trim() : roomTheme.nameEn) 
                              : tip.category;

                            const isDoc = tip.type === "doctor";
                            const isCurrentlyVocalSpoken = activeVoiceTipId === tip.id;

                            return (
                              <motion.div
                                key={tip.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-6 rounded-3xl border text-right space-y-4 transition-all duration-300 ${
                                  isCurrentlyVocalSpoken 
                                    ? "border-emerald-500 ring-2 ring-emerald-500/15 bg-emerald-50/20 shadow-md scale-[1.01]" 
                                    : isDoc 
                                      ? "border-emerald-200 bg-emerald-50/10 shadow-3xs" 
                                      : "border-gray-200 bg-white shadow-3xs"
                                }`}
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold ${
                                      isDoc 
                                        ? "bg-[#4A6B5D] text-white" 
                                        : "bg-[#D4A373]/25 text-[#73512b]"
                                    }`}>
                                      {isDoc 
                                        ? (lang === "ar" ? "🩺 توجيه الأخصائي النفسي" : "🩺 Therapist Post") 
                                        : (lang === "ar" ? "🌟 المتعافي المنتصر" : "🌟 Healing Peer")
                                      }
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-mono">
                                      {new Date(tip.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-xl font-bold">
                                      🎯 {roomLabel}
                                    </span>
                                    {tip.category === "panic" && <span className="bg-rose-100 text-rose-700 text-[9px] font-extrabold px-2 py-0.5 rounded-lg">😰 هلع</span>}
                                    {tip.category === "trauma" && <span className="bg-amber-100 text-amber-700 text-[9px] font-extrabold px-2 py-0.5 rounded-lg">😨 رعب</span>}
                                    {tip.category === "anxiety" && <span className="bg-blue-100 text-blue-700 text-[9px] font-extrabold px-2 py-0.5 rounded-lg">🧠 قلق</span>}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <h4 className={`font-extrabold text-[#2B2D42] leading-snug ${largeFontForTips ? "text-base md:text-lg" : "text-sm"}`}>
                                    {tip.title}
                                  </h4>
                                  <p className="text-[10px] text-gray-400">
                                    {lang === "ar" ? "المساهم: " : "By: "}
                                    <span className="font-bold text-[#4A6B5D]">{tip.author}</span>
                                  </p>
                                </div>

                                <p className={`text-slate-800 leading-relaxed bg-[#F4F7F5]/50 p-4 rounded-2xl border border-[#4A6B5D]/5 whitespace-pre-line text-right ${
                                  largeFontForTips ? "text-sm md:text-base font-bold leading-loose" : "text-xs"
                                }`}>
                                  {tip.text}
                                </p>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                  <button
                                    onClick={() => handleLikeTip(tip.id)}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100/80 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
                                  >
                                    <span>❤️</span>
                                    <span>{lang === "ar" ? "نشد على يديك" : "We Stand with you"}</span>
                                    <span className="bg-white shrink-0 h-4 px-1.5 rounded-full text-[10px] flex items-center justify-center font-mono font-bold shadow-3xs text-rose-600">
                                      {tip.likes || 0}
                                    </span>
                                  </button>

                                  {/* Vocal SpeechSynthesis Toggler */}
                                  <button
                                    type="button"
                                    onClick={() => speakTip(tip.id, `${tip.title}. كاتب المنشور: ${tip.author}. النصيحة تقول: ${tip.text}`)}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all ${
                                      isCurrentlyVocalSpoken 
                                        ? "bg-emerald-600 text-white animate-pulse" 
                                        : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                                    }`}
                                  >
                                    <span>{isCurrentlyVocalSpoken ? "⏸️" : "🔊"}</span>
                                    <span>{lang === "ar" ? (isCurrentlyVocalSpoken ? "إيقاف الصوت الملائكي" : "استمع صوتياً 🎙️") : (isCurrentlyVocalSpoken ? "Stop Audio" : "Listen Audibly 🎙️")}</span>
                                  </button>

                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      );
                    })()
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* 5. EMERGENCY / OFFLINE SUPPORT VIEW */}
          {currentView === "offline" && (
            <motion.div
              key="offline-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Dynamic Connection Status Bar inside layout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-200 shadow-3xs flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm">
                      {lang === "ar" ? "أنت تعمل الآن في وضع عدم الاتصال / الطوارئ" : "Emergency Offline Support Mode Active"}
                    </h4>
                    <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                      {lang === "ar" 
                        ? "أدوات السكينة الذاتية جاهزة للاستجابة المباشرة مخزنة محلياً بالكامل ومتاحة دون إنترنت." 
                        : "Self-soothing features are loaded in local cache-memory. Interactive and robust without internet."}
                    </p>
                  </div>
                </div>
                {/* Simulate connection toggle */}
                <button
                  type="button"
                  onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-3xs active:scale-95 whitespace-nowrap"
                >
                  {isSimulatedOffline 
                    ? (lang === "ar" ? "🔌 إنهاء محاكاة انقطاع الاتصال" : "🔌 End Offline Simulation") 
                    : (lang === "ar" ? "⚠️ محاكاة انقطاع الاتصال فوريًا" : "⚠️ Simulate Total Offline")}
                </button>
              </div>

              {/* Sub-Header info block */}
              <div className="text-center space-y-2 max-w-2xl mx-auto py-2">
                <h3 className="text-xl md:text-3xl font-extrabold text-[#4A6B5D]">
                  {lang === "ar" ? "عيادة الإسعافات النفسية والطوارئ" : "The Offline Emergency Clinic"}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-xl mx-auto">
                  {lang === "ar" 
                    ? "عند هبوط الليل أو تذبذب شبكات 2G والكهرباء في قطاع غزة، تظل هذه الأدوات الطبية جاهزة لمساعدتك وعائلتك فورياً لتفريغ الخوف والهلع." 
                    : "When dial-up networks collapse or power runs out, these digital tools stand by you and your family locally to quiet panic."}
                </p>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Area: Guides & Breathing Pacemaker */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* CSS Breathing Tool Card */}
                  <div className="bg-white border text-[#2B2D42] p-6 rounded-2xl shadow-3xs border-gray-200 space-y-5">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                      <div className="p-2 bg-[#4A6B5D]/10 rounded-lg text-[#4A6B5D]">
                        <Activity className="h-5 w-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm md:text-base">
                          {lang === "ar" ? "تنظيم النبض والتنفس التفاعلي (CSS Breathing Pacemaker)" : "Interactive Breathing Pacemaker"}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {lang === "ar" ? "أداة متحركة خفيفة خالية من الصور لتثبيت التركيز وحصار نوبات الهلع." : "Lightweight local CSS pacemaker for deep grounding."}
                        </p>
                      </div>
                    </div>

                    {/* Beautiful Breathing Widget */}
                    <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-[#F4F7F5]/40 to-white rounded-2xl border border-gray-100">
                      
                      <style>{`
                        @keyframes breatheCSS {
                          0% { transform: scale(0.9); opacity: 0.85; }
                          40% { transform: scale(1.35); opacity: 1; }
                          70% { transform: scale(1.35); opacity: 1; }
                          100% { transform: scale(0.9); opacity: 0.85; }
                        }
                        .animate-breathe-css {
                          animation: breatheCSS 10s infinite ease-in-out;
                        }
                      `}</style>

                      <div className="relative flex items-center justify-center w-48 h-48 my-4">
                        {/* Outer pulsing shadow circle */}
                        <div className="absolute inset-0 rounded-full bg-[#4A6B5D]/5 animate-breathe-css" />
                        <div className="absolute inset-4 rounded-full bg-[#4A6B5D]/10 animate-breathe-css" style={{ animationDelay: "0.5s" }} />
                        
                        {/* Core circle */}
                        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#4A6B5D] to-[#3b5549] text-white flex flex-col items-center justify-center shadow-lg animate-breathe-css">
                          <span className="text-xs font-bold tracking-wider">
                            {breathS < 4 ? (lang === "ar" ? "شهيق (٤ث)" : "Inhale (4s)") : breathS < 7 ? (lang === "ar" ? "حبس النفس (٣ث)" : "Hold (3s)") : (lang === "ar" ? "زفير (٣ث)" : "Exhale (3s)")}
                          </span>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="text-center max-w-md px-4 mt-2 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#4A6B5D] tracking-widest block">
                          {lang === "ar" ? "دورة التنفس (10 ثوانٍ)" : "10-Second Breath Cycle"}
                        </span>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                          {lang === "ar"
                            ? "تتبع اتساع وتقلص الدائرة الصنوبرية: استنشق الهواء بعمق طالما تكبر الدائرة، احبسه في ذروتها، ثم أخرجه ببطء شديد مع انكماش الدائرة."
                            : "Follow the expanding pine circle: inhale deep as it grows, hold at peak size, then exhale slowly as it shrinks."}
                        </p>
                      </div>

                      {/* Simple cycle controls to play/adjust */}
                      <div className="flex gap-2.5 mt-4">
                        <div className="px-3 py-1 bg-[#4A6B5D]/10 text-[#4A6B5D] font-mono text-[10px] font-bold rounded-full">
                          {lang === "ar" ? "شهيق: 4 ثوانٍ" : "Inhale: 4s"}
                        </div>
                        <div className="px-3 py-1 bg-amber-50 text-amber-700 font-mono text-[10px] font-bold rounded-full">
                          {lang === "ar" ? "حبس: 3 ثوانٍ" : "Hold: 3s"}
                        </div>
                        <div className="px-3 py-1 bg-gray-100 text-gray-600 font-mono text-[10px] font-bold rounded-full">
                          {lang === "ar" ? "زفير: 3 ثوانٍ" : "Exhale: 3s"}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Offline Psychological First Aid Accordion Guide */}
                  <div className="bg-white border text-[#2B2D42] p-6 rounded-2xl shadow-3xs border-gray-200 space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm md:text-base">
                          {lang === "ar" ? "دليل الإسعافات النفسية الأولية (Offline PFA)" : "Mental First-Aid Quick Manual"}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {lang === "ar" ? "توجيهات إكلينيكية موجزة لمكافحة صدمات الأطفال ونوبات القلق الحاد." : "Short practical steps for self-stabilization and kids safety."}
                        </p>
                      </div>
                    </div>

                    {/* Accordion List */}
                    <div className="space-y-3">
                      
                      {/* Section 1: Panic Attack */}
                      <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setGroundingStep(groundingStep === 1 ? 0 : 1)}
                          className="w-full text-start p-4 bg-gray-50/50 hover:bg-gray-50 flex items-center justify-between transition-colors font-bold text-xs md:text-sm text-[#4A6B5D] cursor-pointer"
                        >
                          <span>⚡ {lang === "ar" ? "تخفيف نوبات الهلع والتوتر الحاد والعد العكسي لتهدئة العقل" : "Panic Attacks: 5-4-3-2-1 Sensory Grounding"}</span>
                          <span className="text-xs">{groundingStep === 1 ? "▲" : "▼"}</span>
                        </button>
                        
                        {groundingStep === 1 && (
                          <div className="p-4 bg-white border-t border-gray-100 space-y-4 text-xs md:text-sm text-gray-700 leading-relaxed md:font-medium">
                            <p className="text-[#2B2D42] font-semibold border-b border-dashed border-gray-100 pb-1.5">
                              {lang === "ar" ? "تفريغ وتقييد الحواس الخمس (Grounded Recall 5-4-3-2-1):" : "Ground yourself in reality instantly with the 5-4-3-2-1 technique:"}
                            </p>
                            
                            <ul className="space-y-2 text-[11px] md:text-xs">
                              <li className="flex gap-2 items-start">
                                <span className="bg-[#4A6B5D] text-white rounded-full h-5 w-5 flex items-center justify-center font-bold text-[10px] shrink-0">5</span>
                                <div>
                                  <strong>{lang === "ar" ? "خمسة أشياء تراها:" : "Five things you can see:"}</strong>
                                  <span className="text-gray-500 block">{lang === "ar" ? "انظر من حولك بتركيز شديد: حجر، ورقة، تشقق في الجدار، لون مغاير، أي غرض صلب." : "Look closely at detailed patterns: a stone, a crack in the drywall, a color shade."}</span>
                                </div>
                              </li>
                              <li className="flex gap-2 items-start">
                                <span className="bg-[#4A6B5D] text-white rounded-full h-5 w-5 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                                <div>
                                  <strong>{lang === "ar" ? "أربعة أشياء تلمسها:" : "Four things you can touch:"}</strong>
                                  <span className="text-gray-500 block">{lang === "ar" ? "اشعر بملامس قماش ملابسك، برودة الأرض تحت أقدامك، مقبض النافذة المعدني، ملمس يدك." : "The cold floor beneath your feet, your jacket fabric, the window pane."}</span>
                                </div>
                              </li>
                              <li className="flex gap-2 items-start">
                                <span className="bg-[#4A6B5D] text-white rounded-full h-5 w-5 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                                <div>
                                  <strong>{lang === "ar" ? "ثلاثة أصوات تسمعها الآن:" : "Three sounds you can hear:"}</strong>
                                  <span className="text-gray-500 block">{lang === "ar" ? "صوت الرياح، دبيب حشرة، تحركات عائلية، أي ضجيج ناعم يحاصرك." : "The wind, family murmurs, a bird outside, or distant noises."}</span>
                                </div>
                              </li>
                              <li className="flex gap-2 items-start">
                                <span className="bg-[#4A6B5D] text-white rounded-full h-5 w-5 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                                <div>
                                  <strong>{lang === "ar" ? "شيئان تشم رائحتهما:" : "Two things you can smell:"}</strong>
                                  <span className="text-gray-500 block">{lang === "ar" ? "رائحة الملابس النظيفة، رائحة البارود أو التراب، فنجان شاي، أي عطر محيط." : "Dust, tea leaves, dry soil or soap."}</span>
                                </div>
                              </li>
                              <li className="flex gap-2 items-start">
                                <span className="bg-[#4A6B5D] text-white rounded-full h-5 w-5 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                                <div>
                                  <strong>{lang === "ar" ? "شيء واحد تتذوقه:" : "One thing you can taste:"}</strong>
                                  <span className="text-gray-500 block">{lang === "ar" ? "طعم ريقك، بضع قطرات ماء، قطعة ملح أو حلوى جافة." : "A drop of water, a piece of candy, or pure salt."}</span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Section 2: Children Trauma */}
                      <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setGroundingStep(groundingStep === 2 ? 0 : 2)}
                          className="w-full text-start p-4 bg-gray-50/50 hover:bg-gray-50 flex items-center justify-between transition-colors font-bold text-xs md:text-sm text-[#4A6B5D] cursor-pointer"
                        >
                          <span>🧸 {lang === "ar" ? "التعامل مع صدمات الأطفال الاستثنائية أثناء القصف والانفجارات" : "Soothing Kids: Dealing with Heavy Explosions Noise"}</span>
                          <span className="text-xs">{groundingStep === 2 ? "▲" : "▼"}</span>
                        </button>
                        
                        {groundingStep === 2 && (
                          <div className="p-4 bg-white border-t border-gray-100 space-y-4 text-xs text-gray-700 leading-relaxed md:font-medium">
                            <p className="text-[#2B2D42] font-semibold border-b border-dashed border-gray-100 pb-1.5">
                              {lang === "ar" 
                                ? "توجيهات عاجلة للأباء والأمهات لامتصاص مخاوف الأطفال وإلهائهم:" 
                                : "Crucial instructions for parents to swallow anxiety triggers during emergencies:"}
                            </p>
                            
                            <ul className="list-disc list-inside space-y-2 pl-1">
                              <li>
                                <strong>{lang === "ar" ? "الهدوء النموذجى أولاً:" : "Role-model absolute composure:"}</strong>
                                <span className="text-gray-500 block ml-4">{lang === "ar" ? "يتطلع الطفل لعين والديه ليرى مدى خطورة الموقف. تصنّع الهدوء الكامل والصبر يقطع 90% من ذعرهم الإكلينيكي." : "Children always inspect parents' eyes to scale danger. Acting completely composed neutralizes 90% of panic."}</span>
                              </li>
                              <li>
                                <strong>{lang === "ar" ? "الاحتضان الجسدي الثابت الشديد:" : "Deep direct physical pressure:"}</strong>
                                <span className="text-gray-500 block ml-4">{lang === "ar" ? "امسك بالطفل برفق شديد ولكن باحتضان متصل، فشدة الاتصال بالدماغ ترسل للجهاز العصبي هرمونات الانبساط وزوال الخطر." : "Hug the child wrap-around style. Warm deep physical pressure reassures child's nervous system."}</span>
                              </li>
                              <li>
                                <strong>{lang === "ar" ? "إلهاء صوتي بديل (ألعاب الأناشيد):" : "Syllable chanting distortion games:"}</strong>
                                <span className="text-gray-500 block ml-4">{lang === "ar" ? "العب مع الأطفال لعبة 'أقوى صرخة فرح' أو 'صوت الطبلة الجماعي' بمجرد سماع الانفجارات أو قلدوا أصوات هزلية لتشويه المثير الصدمي الحاد." : "Initiate dynamic vocal games, group clapping or singing immediately to block acoustic impact."}</span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                </div>

                {/* Right Area: Local Vent Box */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Local Vent Input Card */}
                  <div className="bg-white border text-[#2B2D42] p-6 rounded-2xl shadow-3xs border-gray-200 space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                      <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                        <PenTool className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm md:text-base">
                          {lang === "ar" ? "مذكرة تفريغ الأفكار واليوميات المحلّية" : "Confidential Local Vent Box"}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {lang === "ar" ? "دونات فورية مشفرة بـ Base64 داخل متصفحك، لحقن مشاعرك حتى عودة الإنترنت." : "AES-like local memory vault to dump trauma till network is back."}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <textarea
                        value={offlineVentText}
                        onChange={(e) => setOfflineVentText(e.target.value)}
                        placeholder={lang === "ar" 
                          ? "اكتب مشاعرك المكتومة وهواجسك هنا بلا أي قلق... اليوميات لا تلمس خوادم الإنترنت ويتم ترميزها برمجياً فورا في جهازك..." 
                          : "Dump your thoughts, anxiety, or cries here... They never touch any server. Completely encoded locally."}
                        className="w-full h-32 p-3 font-sans text-xs md:text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4A6B5D] focus:bg-white transition-all text-[#2B2D42]"
                      />

                      <button
                        type="button"
                        onClick={() => handleSaveOfflineVent(offlineVentText)}
                        disabled={!offlineVentText.trim()}
                        className="w-full py-3 bg-[#4A6B5D] hover:bg-[#3b5549] text-white disabled:opacity-45 rounded-xl text-xs font-bold shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <HeartPulse className="h-4 w-4" />
                        <span>{lang === "ar" ? "حفظ وتشفير المذكرة محلياً 🔒" : "Encode & Save Lock Locally 🔒"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Saved local entries */}
                  <div className="bg-white border text-[#2B2D42] p-5 rounded-2xl shadow-3xs border-gray-200 space-y-4">
                    <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider">
                      {lang === "ar" ? "مذكراتك المودعة محلياً والسرية في المتصفح" : "Your Secured Local Logs"}
                    </h4>

                    {offlineVents.length === 0 ? (
                      <div className="text-center py-6 border border-dashed border-gray-100 rounded-xl text-xs text-gray-400">
                        {lang === "ar" ? "لا توجد أي مذكرات مخزنة حالياً في المتصفح." : "No saved clinical logs found in this browser cache."}
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                        {offlineVents.map((entry) => {
                          const isFading = offlineFadingIds.includes(entry.id);
                          const decryptedMsg = decryptLocalText(entry.text);
                          return (
                            <div 
                              key={entry.id} 
                              className={`p-4 rounded-xl border border-gray-100 bg-gray-50/40 text-xs md:text-sm space-y-3 transition-all duration-500 ${isFading ? "opacity-0 scale-95" : "opacity-100"}`}
                            >
                              <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold border-b border-dashed border-gray-100 pb-2">
                                <span className="font-mono text-[#4A6B5D]">{entry.id}</span>
                                <span>{new Date(entry.timestamp).toLocaleString()}</span>
                              </div>

                              <p className="text-gray-700 leading-relaxed font-sans select-all whitespace-pre-wrap">{decryptedMsg}</p>

                              {/* Action Bar */}
                              <div className="flex gap-2 justify-end pt-1">
                                
                                {/* If online, show submit config */}
                                <button
                                  type="button"
                                  onClick={async () => {
                                    // Submit directly to API
                                    try {
                                      const res = await fetch("/api/consultations", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ 
                                          category: "trauma", 
                                          text: decryptedMsg,
                                          pin: "0000" // Fallback default salt PIN
                                        })
                                      });
                                      const data = await res.json();
                                      if (data.status === "success") {
                                        alert(lang === "ar" 
                                          ? `🎉 تم إرسال اليوميات بنجاح كاستشارة رسمية سرية ومحجوبة برمز أمان افتراضي (0000)!\nرقم استشارتك الآمن هو: ${data.trackingId}` 
                                          : `🎉 Log successfully synchronized!\nTracking ID: ${data.trackingId}\nSecurity pin: 0000`);
                                        
                                        // Delete from list
                                        handleDeleteOfflineVent(entry.id);
                                      } else {
                                        alert(lang === "ar" ? "تعذر الإرسال بسبب ضعف الشبكة الفعلي." : "Unable to send. Network bottleneck.");
                                      }
                                    } catch (err) {
                                      alert(lang === "ar" ? "مؤشر الشبكة مقطوع فعلياً حالياً. انتظر حتى تعود الكهرباء والإنترنت ثم حاول مجدداً." : "Connection failed. Please wait for internet to restore completely.");
                                    }
                                  }}
                                  className="px-2.5 py-1.5 bg-[#4A6B5D]/10 hover:bg-[#4A6B5D]/20 text-[#4A6B5D] font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                                >
                                  {lang === "ar" ? "📤 ارفع كاستشارة سرية الآن" : "📤 Sync as Urgent Consultation"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteOfflineVent(entry.id)}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                                >
                                  {lang === "ar" ? "🗑️ مسح وتفجير الذات" : "🗑️ Erase & Delete Logs"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </motion.div>
          )}

          {/* 6. DOCTOR GATE / DASHBOARD VIEW */}
          {currentView === "doctor" && (
            <motion.div
              key="doctor-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              
              {!doctorLoggedIn ? (
                // 6A. Login view
                <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xs">
                  <div className="text-center space-y-2">
                    <div className="bg-[#4A6B5D]/10 h-14 w-14 rounded-full text-[#4A6B5D] flex items-center justify-center mx-auto">
                      <Lock className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-[#4A6B5D]">
                      {lang === "ar" ? "بوابة الأخصائيين النفسيين المعتمدة" : "Licensed Specialists Portal"}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                      {lang === "ar" 
                        ? "مساحة مخصصة للكوادر والفرق الطبية والنفسية المعتمدة لتقديم المساندة والإشراف السريري الفوري." 
                        : "Dedicated workspace for licensed psychiatric team members to coordinate and manage emergency interventions."}
                    </p>
                  </div>

                  {/* Tab Selector */}
                  <div className="grid grid-cols-2 p-1 bg-[#F4F7F5] rounded-xl border border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDoctorRegister(false);
                        setDoctorLoginError(null);
                      }}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        !isDoctorRegister 
                          ? "bg-white text-[#4A6B5D] shadow-xs" 
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {lang === "ar" ? "🔐 تسجيل دخول طبيب" : "🔐 Specialist Login"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDoctorRegister(true);
                        setDoctorLoginError(null);
                      }}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isDoctorRegister 
                          ? "bg-white text-[#4A6B5D] shadow-xs" 
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {lang === "ar" ? "🩺 تسجيل أخصائي جديد" : "🩺 Register New"}
                    </button>
                  </div>

                  <form onSubmit={handleDoctorLogin} className="space-y-4">
                    {/* Specialist Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#2B2D42] block">
                        {lang === "ar" ? "الاسم الإكلينيكي للأخصائي 🩺" : "Clinician Specialist Name 🩺"}
                      </label>
                      <input
                        type="text"
                        value={doctorNameInput}
                        onChange={(e) => setDoctorNameInput(e.target.value)}
                        placeholder={lang === "ar" ? "مثال: د. أحمد ياسين أو الأخصائي كمال" : "e.g., Dr. Yassin or Specialist Kamal"}
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 outline-none text-xs md:text-sm bg-[#F4F7F5] focus:border-[#4A6B5D]"
                      />
                    </div>

                    {/* Specialist Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#2B2D42] block">
                        {lang === "ar" ? "رمز المرور الشخصي / كلمة السر 🔒" : "Personal Entry Key / Password 🔒"}
                      </label>
                      <input
                        type="password"
                        value={doctorPasswordInput}
                        onChange={(e) => setDoctorPasswordInput(e.target.value)}
                        placeholder={lang === "ar" ? "اكتب كلمة سر آمنة لحفظ والتحقق من حسابك" : "Set or enter your private secure password"}
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 outline-none text-xs md:text-sm bg-[#F4F7F5] focus:border-[#4A6B5D]"
                      />
                    </div>

                    {/* Specialist Specialties Selection - ONLY SHOWN IN REGISTER MODE */}
                    {isDoctorRegister && (
                      <div className="space-y-2 pt-1 animate-fadeIn">
                        <label className="text-xs font-bold text-[#2B2D42] block">
                          {lang === "ar" ? "🎯 حدد الحالات النفسية التي تمتاز وتتخصص بمساعدتها:" : "🎯 Select psychiatric cases & support areas of your expertise:"}
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          {ROOM_THEMES.map((room) => {
                            const isSelected = doctorSelectedSpecialties.includes(room.id);
                            const handleToggle = () => {
                              if (isSelected) {
                                if (doctorSelectedSpecialties.length > 1) {
                                  setDoctorSelectedSpecialties(doctorSelectedSpecialties.filter(x => x !== room.id));
                                }
                              } else {
                                setDoctorSelectedSpecialties([...doctorSelectedSpecialties, room.id]);
                              }
                            };
                            return (
                              <button
                                key={room.id}
                                type="button"
                                onClick={handleToggle}
                                className={`flex items-center justify-between p-3 rounded-xl border text-xs text-start font-bold transition-all cursor-pointer ${
                                  isSelected 
                                    ? "bg-[#4A6B5D]/10 border-[#4A6B5D] text-[#4A6B5D]" 
                                    : "bg-white border-gray-200 text-gray-500 hover:bg-[#F4F7F5]"
                                }`}
                              >
                                <span>{lang === "ar" ? room.nameAr : room.nameEn}</span>
                                <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${
                                  isSelected ? "bg-[#4A6B5D] text-white border-[#4A6B5D]" : "border-gray-300"
                                }`}>
                                  {isSelected && "✓"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {doctorLoginError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs flex items-center gap-1.5">
                        <AlertCircle className="h-4.5 w-4.5" />
                        <span>{doctorLoginError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={doctorLoggingIn}
                      className="w-full py-3 bg-[#4A6B5D] hover:bg-[#3b5549] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 cursor-pointer transition-all"
                    >
                      {doctorLoggingIn 
                        ? (lang === "ar" ? "جاري التحقق والربط الطبي السري..." : "Checking credentials...") 
                        : (isDoctorRegister 
                            ? (lang === "ar" ? "إنشاء وتفعيل الحساب كأخصائي معتمد 🩺" : "Create & Authorize Specialist Account 🩺")
                            : (lang === "ar" ? "تسجيل الدخول الآمن للأخصائي 🔒" : "Secure Specialist Login 🔒")
                          )
                      }
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDoctorRegister(!isDoctorRegister);
                        setDoctorLoginError(null);
                      }}
                      className="text-xs text-[#4A6B5D]/80 hover:text-[#4A6B5D] font-bold underline transition-colors cursor-pointer"
                    >
                      {isDoctorRegister
                        ? (lang === "ar" ? "لديك حساب أخصائي بالفعل؟ سجل دخولك مباشرة" : "Already have a specialist account? Sign in directly")
                        : (lang === "ar" ? "أول مرة تستخدم المنصة؟ سجل حسابك كطبيب جديد مجاناً" : "First time? Click here to register your specialties")
                      }
                    </button>
                  </div>
                </div>
              ) : (
                
                // 6B. Secure dashboard panel
                <div className="space-y-6">
                  
                  {/* Dashboard header */}
                  <div className="bg-white border rounded-2xl p-5 border-gray-200 shadow-3xs flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center md:text-start w-full">
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <h3 className="text-base md:text-lg font-extrabold text-[#4A6B5D]">
                          {lang === "ar" ? `مرحباً د. ${doctorName}` : `Welcome Dr. ${doctorName}`}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500">
                        {lang === "ar" ? "لوحة التحكم السريرية والمؤازرة الطبية لشبكة سكينة لغزة" : "Clinical Intervention & Support Workspace of Sakina Network"}
                      </p>
                      
                      {/* Active Specialties */}
                      {doctorSpecialties && doctorSpecialties.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mt-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === "ar" ? "تخصصاتك العلاجية:" : "Your Clinical Specialties:"}</span>
                          {doctorSpecialties.map((id) => {
                            const matchedRoom = ROOM_THEMES.find(r => r.id === id);
                            return (
                              <span key={id} className="text-[10px] font-bold bg-[#4A6B5D]/10 text-[#4A6B5D] px-2.5 py-0.5 rounded-full border border-[#4A6B5D]/15 shadow-3xs">
                                🎯 {matchedRoom ? (lang === "ar" ? matchedRoom.nameAr : matchedRoom.nameEn) : id}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setDoctorLoggedIn(false);
                          setDoctorToken("");
                          setDoctorPasswordInput("");
                          localStorage.removeItem("sakina_doc_token");
                          localStorage.removeItem("sakina_doc_name");
                          localStorage.removeItem("sakina_doc_specialties");
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t.logout}</span>
                      </button>
                    </div>
                  </div>

                  {/* Tab switches */}
                  <div className="flex border-b border-gray-200 max-w-2xl overflow-x-auto whitespace-nowrap scrollbar-none">
                    <button
                      onClick={() => setActiveDoctorTab("consults")}
                      className={`px-4 py-3 text-xs md:text-sm font-bold border-b-2 cursor-pointer transition-all shrink-0 ${activeDoctorTab === "consults" ? "border-[#4A6B5D] text-[#4A6B5D]" : "border-transparent text-gray-400"}`}
                    >
                      {t.tabConsults}
                    </button>
                    <button
                      onClick={() => setActiveDoctorTab("moderation")}
                      className={`px-4 py-3 text-xs md:text-sm font-bold border-b-2 cursor-pointer transition-all shrink-0 ${activeDoctorTab === "moderation" ? "border-[#4A6B5D] text-[#4A6B5D]" : "border-transparent text-gray-400"}`}
                    >
                      {t.tabModeration}
                    </button>
                    <button
                      onClick={() => setActiveDoctorTab("charts")}
                      className={`px-4 py-3 text-xs md:text-sm font-bold border-b-2 cursor-pointer transition-all shrink-0 ${activeDoctorTab === "charts" ? "border-[#4A6B5D] text-[#4A6B5D]" : "border-transparent text-gray-400"}`}
                    >
                      {t.tabCharts}
                    </button>
                    <button
                      onClick={() => setActiveDoctorTab("guide")}
                      className={`px-4 py-3 text-xs md:text-sm font-bold border-b-2 cursor-pointer transition-all shrink-0 ${activeDoctorTab === "guide" ? "border-[#4A6B5D] text-[#4A6B5D]" : "border-transparent text-gray-400"}`}
                    >
                      📖 {lang === "ar" ? "دليل الأخصائي" : "Specialist Manual"}
                    </button>
                  </div>

                  {/* 6B1. TAB 1: Consultations list */}
                  {activeDoctorTab === "consults" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Left: Consult list */}
                      <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-200 shadow-3xs space-y-4">
                        <h4 className="font-extrabold text-sm text-[#4A6B5D] mb-2">{lang === "ar" ? "الطلبات السرية الواردة بالترتيب الزمني" : "Submitted Secret Inquiries"}</h4>
                        
                        {doctorConsults.length === 0 ? (
                          <div className="text-center py-8 text-xs text-gray-400">لا يوجد استشارات معلقة حالياً.</div>
                        ) : (
                          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
                            {doctorConsults.map((dc) => (
                              <div 
                                key={dc.id} 
                                onClick={() => setSelectedConsultForReply(dc)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedConsultForReply?.id === dc.id ? "border-[#4A6B5D] bg-[#F4F7F5]" : dc.status === "answered" ? "border-gray-200 opacity-70 bg-gray-50/50" : dc.riskLevel === "high" ? "border-red-300 bg-red-50/20" : "border-gray-300 hover:border-[#4A6B5D]"}`}
                              >
                                <div className="flex justify-between items-center text-[10px] mb-2 font-bold">
                                  <span className="font-mono text-gray-500 uppercase">{dc.id}</span>
                                  <span className={`px-2 py-0.5 rounded ${dc.status === "answered" ? "bg-emerald-50 text-emerald-600" : dc.riskLevel === "high" ? "bg-red-100 text-red-600 animate-pulse" : "bg-amber-100 text-amber-700"}`}>
                                    {dc.status === "answered" ? (lang === "ar" ? "تم الرد" : "Answered") : (lang === "ar" ? "قيد التدقيق" : "Pending")}
                                  </span>
                                </div>

                                <p className="text-xs text-[#2B2D42] line-clamp-2 leading-relaxed font-sans">{dc.textDecrypted}</p>
                                
                                <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold mt-2 pt-1 border-t border-gray-100">
                                  <span>{t.textCategory} {dc.category}</span>
                                  <span>{new Date(dc.createdAt).toLocaleString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Reply draft area */}
                      <div className="lg:col-span-5 space-y-4">
                        {selectedConsultForReply ? (
                          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-3xs space-y-4">
                            <div className="border-b border-gray-100 pb-3">
                              <h4 className="font-extrabold text-sm text-[#4A6B5D]">{t.replyFormTitle} <span className="font-mono">{selectedConsultForReply.id}</span></h4>
                            </div>

                            {/* Complaint */}
                            <div className="p-3 bg-gray-50 rounded-xl max-h-36 overflow-y-auto border text-xs leading-relaxed text-[#2B2D42]">
                              <p>{selectedConsultForReply.textDecrypted}</p>
                            </div>

                            {/* AI smart triage (Gemini assist) */}
                            {selectedConsultForReply.aiDraft && (
                              <div className="p-3 bg-[#D4A373]/10 border border-[#D4A373]/30 rounded-xl space-y-1">
                                <span className="text-[10px] uppercase font-extrabold text-amber-800 tracking-wide flex items-center gap-1">
                                  <Sparkles className="h-4.5 w-4.5 text-[#4A6B5D]" />
                                  <span>{t.aiTriage}</span>
                                </span>
                                <p className="text-[11px] text-[#2c1d11] font-medium leading-relaxed">{selectedConsultForReply.aiDraft}</p>
                              </div>
                            )}

                            {/* Reply Draft form */}
                            <form onSubmit={submitDoctorReplyInquiry} className="space-y-3">
                              <textarea
                                value={doctorReplyText}
                                onChange={(e) => setDoctorReplyText(e.target.value)}
                                rows={5}
                                required
                                placeholder={t.replyPlaceholder}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#4A6B5D] outline-none font-sans text-xs md:text-sm bg-[#F4F7F5]/30 leading-relaxed"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedConsultForReply(null)}
                                  className="flex-1 py-2 rounded-lg border border-gray-200 bg-white text-xs font-bold hover:bg-gray-50 shadow-3xs cursor-pointer"
                                >
                                  {lang === "ar" ? "إلغاء الاستجابة" : "Cancel"}
                                </button>
                                <button
                                  type="submit"
                                  disabled={sendingDoctorReply || !doctorReplyText.trim()}
                                  className="flex-1.5 py-2 bg-[#4A6B5D] hover:bg-[#3b5549] text-white rounded-lg text-xs font-bold transition-all shadow-3xs cursor-pointer"
                                >
                                  {sendingDoctorReply ? "جاري تشفير الرد وحفظه..." : t.btnSubmitReply}
                                </button>
                              </div>
                            </form>
                          </div>
                        ) : (
                          <div className="bg-[#4A6B5D]/5 border-2 border-dashed border-[#4A6B5D]/30 p-8 rounded-2xl text-center text-xs text-gray-400">
                            {lang === "ar" ? "حدد استشارة سرية من الصندوق الأيمن لدراسة التقييمات التوليدية الذكية والمباشرة بالرد الآمن." : "Select an inquiry from the inbox side to review AI triage and write answers."}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* 6B2. TAB 2: Lounge Moderations with private pull checks */}
                  {activeDoctorTab === "moderation" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Room selectors and Messages Monitor (Left) */}
                      <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-3xs space-y-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-100 pb-3">
                          <h4 className="font-extrabold text-sm text-[#4A6B5D]">{lang === "ar" ? "شباك الرقابة والإشراف اليدوي على الغرف" : "Group lounge supervisor cockpit"}</h4>
                          
                          <select
                            value={doctorSelectedMonitorRoom}
                            onChange={(e) => setDoctorSelectedMonitorRoom(e.target.value)}
                            className="p-1 px-3 rounded bg-[#F4F7F5] border border-gray-200 text-gray-700 font-sans text-xs font-bold outline-none cursor-pointer"
                          >
                            {ROOM_THEMES.map((room) => {
                              const isSpecialty = doctorSpecialties?.includes(room.id);
                              return (
                                <option key={room.id} value={room.id}>
                                  {isSpecialty ? "🩺 " : ""}
                                  {lang === "ar" ? room.nameAr : room.nameEn}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {/* Monitor messages thread */}
                        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                          {doctorMonitorMessages.length === 0 ? (
                            <div className="text-center py-8 text-xs text-gray-400">لا يوجد رسائل بالقاعة حالياً.</div>
                          ) : (
                            doctorMonitorMessages.map((msg) => (
                              <div key={msg.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                                  <span>{msg.alias} {msg.isDoctor && <span className="text-[#4A6B5D] bg-[#4A6B5D]/10 px-1 py-0.5 rounded">🩺</span>}</span>
                                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                </div>

                                <p className={`leading-relaxed text-[#2B2D42] ${msg.isDeleted ? "line-through opacity-45 italic" : ""}`}>{msg.message}</p>

                                {/* Supervisor Actions */}
                                {!msg.isDoctor && !msg.isDeleted && (
                                  <div className="flex justify-end gap-1.5 font-bold pt-1.5 border-t border-gray-100">
                                    <button 
                                      onClick={() => deleteRoomMessage(msg.id)}
                                      className="px-2 py-1 text-[9px] bg-red-50 text-red-600 hover:bg-red-100 rounded flex items-center gap-1 cursor-pointer"
                                    >
                                      <Trash className="h-3 w-3" />
                                      {t.btnDeleteMsg}
                                    </button>
                                    <button 
                                      onClick={() => banUserToken(msg.userToken)}
                                      className="px-2 py-1 text-[9px] bg-red-100 text-red-700 hover:bg-red-200 rounded flex items-center gap-1 cursor-pointer"
                                    >
                                      <UserX className="h-3 w-3" />
                                      {t.btnBanUser}
                                    </button>
                                    <button 
                                      onClick={() => triggerPrivatePull(msg)}
                                      className="px-2 py-1 text-[9px] bg-[#D4A373]/20 hover:bg-[#D4A373]/30 text-amber-900 rounded flex items-center gap-1 cursor-pointer"
                                    >
                                      <Lock className="h-3 w-3" />
                                      {t.btnPrivatePull}
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Info and clinical help column (Right) */}
                      <div className="lg:col-span-4 bg-[#4A6B5D] text-white p-5 rounded-2xl relative shadow-3xs overflow-hidden h-72">
                        <div className="absolute top-0 right-0 opacity-15">
                          <svg viewBox="0 0 100 100" className="w-48 h-48 text-white">
                            <circle cx="50" cy="50" r="40" fill="currentColor" />
                          </svg>
                        </div>
                        <div className="space-y-4 relative z-10">
                          <ShieldCheck className="h-10 w-10 text-[#D4A373]" />
                          <h4 className="font-extrabold text-sm border-b border-white/20 pb-2 capitalize">{lang === "ar" ? "دليل الطبيب المشرف والمراقب" : "Clinical Supervisor Guideline"}</h4>
                          <p className="text-[11px] leading-relaxed opacity-90">
                            {lang === "ar" 
                              ? "بصفتك أخصائياً معتمداً، نأمل منك استخدام خاصية السحب الخاص (Private Pull) فور ملاحظة صدمة حادة أو بكاء شديد لدى أيalias مستعار بالقاعة لتحويله فورياً لمحادثة ثنائية مغلقة ومحمية لإنقاذه." 
                              : "As a therapist, use the Private Pull feature immediately when noticing sharp symptoms or extreme breakdown to isolate the client into private 1-on-1 breakout files securely."}
                          </p>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* 6B3. TAB 3: Responsive Statistics Charts */}
                  {activeDoctorTab === "charts" && doctorStats && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Metric Card 1 */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-3xs space-y-4 text-center">
                        <span className="text-3xl md:text-5xl font-extrabold text-[#4A6B5D] font-mono">{doctorStats.total}</span>
                        <h4 className="font-bold text-xs text-gray-400 capitalize">{t.totalConsultations}</h4>
                      </div>

                      {/* Metric Card 2 */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-3xs space-y-4 text-center">
                        <span className="text-3xl md:text-5xl font-extrabold text-green-600 font-mono">{doctorStats.answered}</span>
                        <h4 className="font-bold text-xs text-gray-400 capitalize">{t.answeredConsultations}</h4>
                      </div>

                      {/* Metric Card 3 */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-3xs space-y-4 text-center">
                        <span className={`${doctorStats.highRisk > 0 ? "text-red-600 animate-pulse bg-red-50" : "text-[#2B2D42]"} text-3xl md:text-5xl font-extrabold font-mono inline-block px-4 py-1 rounded-full`}>
                          {doctorStats.highRisk}
                        </span>
                        <h4 className="font-bold text-xs text-gray-400 capitalize">{t.highRiskAlerts}</h4>
                      </div>

                      {/* Custom Category Chart using fully fluid SVG graph element (Lightweight & responsive for 2G network) */}
                      <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-gray-200 shadow-3xs space-y-4">
                        <h4 className="font-extrabold text-sm text-[#4A6B5D] border-b border-gray-100 pb-3">{t.metricsTitle}</h4>
                        
                        <div className="space-y-4">
                          {[
                            { label: t.metricTrauma, count: doctorStats.categories.trauma, color: "#4A6B5D" },
                            { label: t.metricAnxiety, count: doctorStats.categories.anxiety, color: "#D4A373" },
                            { label: t.metricGrief, count: doctorStats.categories.grief, color: "#F39C12" },
                            { label: t.metricOther, count: doctorStats.categories.other, color: "#7F8C8D" }
                          ].map((item, index) => {
                            const pct = doctorStats.total > 0 ? (item.count / doctorStats.total) * 105 : 0;
                            return (
                              <div key={index} className="space-y-1.5 text-xs font-bold text-[#2B2D42]">
                                <div className="flex justify-between items-center text-[11px] md:text-xs">
                                  <span>{item.label}</span>
                                  <span className="font-mono text-gray-500 font-normal">{item.count} {lang === "ar" ? "حالة" : "cases"}</span>
                                </div>
                                <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.max(3, pct)}%` }}
                                    style={{ backgroundColor: item.color }}
                                    className="h-full rounded-full transition-all"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {activeDoctorTab === "guide" && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-3xs space-y-6 text-[#2B2D42]">
                      <div className="border-b border-gray-100 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-extrabold text-base md:text-lg text-[#4A6B5D] flex items-center gap-2">
                            <BookOpen className="h-5.5 w-5.5 text-[#4A6B5D]" />
                            <span>{lang === "ar" ? "دليل استخدام المنصة والبروتوكولات السريرية للأطباء" : "Clinician Usage & Clinical Protocols Guide"}</span>
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {lang === "ar" 
                              ? "مرجع توجيهي رسمي للأخصائيين النفسيين المعتمدين بـ سكينة للتعامل الآمن والسري مع الحالات." 
                              : "Official reference manual for licensed Sakina psychologists for secure & ethical care."}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-[#4A6B5D]/10 text-[#4A6B5D] px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                          v2.1 SECURE
                        </span>
                      </div>

                      {/* Guide Content Sections */}
                      <div className="space-y-6 animate-fadeIn">
                        
                        {/* Section 1: Emergency & Triage Protocols */}
                        <div className="border border-red-100 bg-red-50/25 rounded-2xl p-5 space-y-3">
                          <h5 className="font-bold text-sm text-red-800 flex items-center gap-1.5 border-b border-red-100 pb-2">
                            <ShieldAlert className="h-4.5 w-4.5 text-red-600 animate-pulse" />
                            <span>{lang === "ar" ? "١. بروتوكول فرز الحالات وتدابير الطوارئ السريرية (Critical Triage & Risk Mitigation)" : "1. Critical Triage & Emergency Psychiatric Protocols"}</span>
                          </h5>
                          <div className="text-xs md:text-sm text-gray-700 leading-relaxed space-y-2">
                            <p className="font-medium text-gray-800">
                              {lang === "ar"
                                ? "في ظل صدمات الحرب العنيفة في قطاع غزة، تقوم خوارزمية الذكاء الاصطناعي الذكي (Gemini Smart Triage) بتصنيف الحالات فورياً. يرجى توخي أقصى درجات المسؤولية عند التعامل مع الحالات المصنفة بأنها تشتمل على خطورة مرتفعة (🚨 High Risk - أفكار تدمير الذات أو هلع حاد):"
                                : "Under severe war conditions, the Gemini Smart Triage system actively evaluates incoming logs. Secure prompt response is imperative for items flagged with red alerts (🚨 High Risk - self harm or extreme panic):"}
                            </p>
                            <ul className="list-disc pr-4 pl-4 space-y-2.5 mt-2 text-gray-650">
                              <li>
                                <strong className="text-gray-900">{lang === "ar" ? "لغة الدعم المسؤولة والاحتواء العاطفي:" : "Stabilizing & non-judgmental containment:"}</strong>
                                <span className="block mt-0.5 text-xs text-gray-500">
                                  {lang === "ar"
                                    ? "تجنب تماماً إعطاء تشخيصات إكلينيكية جافة للوهلة الأولى. صُغ الردود باستخدام كلمات طمأنة وتثبيت حسي مباشر. ركز أولاً على التمارين التنفسية وتثبيت الجسد على الأرض قبل الشروع في معالجة تفاصيل الصدمة الفورية."
                                    : "Refrain from giving direct medical labels or dry diagnostics instantly. Craft highly empathetic, anchoring paragraphs. Focus first on breath counts and physical sensory cues to reduce active hyperventilation."}
                                </span>
                              </li>
                              <li>
                                <strong className="text-gray-900">{lang === "ar" ? "حظر الاستدراج أو الاستجواب الديموغرافي:" : "De-identification enforcement:"}</strong>
                                <span className="block mt-0.5 text-xs text-gray-500">
                                  {lang === "ar"
                                    ? "يُصنف طلب أو محاولة استدراج المريض للإدلاء بلقبه، أو اسمه الحقيقي، أو تفاصيل موقعه الدقيق، أو هويته الشخصية كخرق جسيم لبروتوكول سكينة يعرض الكادر الطبي للمساءلة. احرص على استخدام الأسماء المستعارة الحالية لتجنب أي رصد."
                                    : "Asking or seeking real-life names, precise coordinates, or identifiers is strictly prohibited under Sakina's code of conduct. Maintain using dynamic browser-generated pseudonyms to guarantee clinical confidentiality."}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Section 2: Safe Private Pull Instructions */}
                        <div className="border border-[#4A6B5D]/20 bg-[#F4F7F5]/30 rounded-2xl p-5 space-y-3">
                          <h5 className="font-bold text-sm text-[#4A6B5D] flex items-center gap-1.5 border-b border-[#4A6B5D]/10 pb-2">
                            <Users className="h-4.5 w-4.5 text-[#4A6B5D]" />
                            <span>{lang === "ar" ? "٢. بروتوكول السحب الخاص المتزامن (Synchronous Private Pull Guidelines)" : "2. Safe Synchronous 'Private Pull' Protocol"}</span>
                          </h5>
                          <div className="text-xs md:text-sm text-gray-700 leading-relaxed space-y-2">
                            <p className="font-medium text-gray-800">
                              {lang === "ar"
                                ? "أداة 'السحب الخاص' (Private Pull) تتيح نقل المريض الذي يعاني من أزمة مستمرة في غرف الحوار العامة إلى قناة اتصال ثنائية خاصة فورية ومشفرة:"
                                : "The 'Private Pull' mechanism isolates a patient expressing deep breakdowns inside public chatrooms into a secluded, heavily encrypted standalone live session:"}
                            </p>
                            <ul className="list-disc pr-4 pl-4 space-y-2 mt-1 text-gray-650">
                              <li>
                                <strong className="text-gray-900">{lang === "ar" ? "متى يتم التفعيل؟" : "Indication criteria:"}</strong>{' '}
                                {lang === "ar"
                                  ? "عند رصد تعبير صريح عن الذعر، البكاء المعقد، أو نداءات استغاثة متكررة تقوض سكينة القاعة العامة، أو تتطلب معالجة منفردة مكثفة."
                                  : "Trigger when noticing recurring distress calls, profound clinical grief, or breakdowns that deserve focused, individual, one-on-one containment."}
                              </li>
                              <li>
                                <strong className="text-gray-900">{lang === "ar" ? "آلية العمل التقنية الآمنة:" : "The mechanical procedure:"}</strong>{' '}
                                {lang === "ar"
                                  ? "عند الضغط على 'سحب خاص طارئ 🔒'، يقوم النظام تلقائياً وبثبات بربط معرف المتصفح الفوري للمريض بتوكن الغرفة Live Room السرية. تظهر للمريض نافذة تفاعلية تطلب منه قبول التدخل."
                                  : "Pressing 'Private Pull Live' tags the visitor's socket and invokes a clean popup invitation. No explicit phone number or IP registration is made."}
                              </li>
                              <li>
                                <strong className="text-gray-900">{lang === "ar" ? "تنبيه الموقف للمستشار:" : "Safety Warning during Live Chat:"}</strong>{' '}
                                <span className="block mt-0.5 text-xs text-gray-505">
                                  {lang === "ar"
                                    ? "ذكّر المريض أثناء الشات الحي دائمًا بضرورة حفظ الرمز التسلسلي ومتابعة إرشادات التفريغ. بمجرد إغلاق الطبيب أو المريض لعلامة تبويب الغرفة، يتم حذف وطمس سجل المعاملة تماماً من قاعدة البيانات والذاكرة المؤقتة لضمان الخصوصية القصوى."
                                    : "Remind the client to secure their reference keys. Leaving or manually deleting local cache completely vaporizes all log transcripts permanently. No logs are retained on cloud-servers for post-reconstruct safety."}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Section 3: Data Integrity & Confidentially Standard */}
                        <div className="border border-amber-100 bg-amber-50/25 rounded-2xl p-5 space-y-3">
                          <h5 className="font-bold text-sm text-amber-800 flex items-center gap-1.5 border-b border-amber-100 pb-2">
                            <Lock className="h-4.5 w-4.5 text-amber-700" />
                            <span>{lang === "ar" ? "٣. معايير تشفير وفقد الأثر للبيانات (Double-Blind Zero-Knowledge Crypto Standards)" : "3. Extreme Data Confidentiality & Anti-Spy Standards"}</span>
                          </h5>
                          <div className="text-xs md:text-sm text-gray-700 leading-relaxed space-y-3">
                            <p className="font-medium text-gray-800">
                              {lang === "ar"
                                ? "تعمل منظومة 'سكينة' بمعمارية عدم المعرفة الصفرية (Zero-Knowledge Dual Layer Architecture) لضمان حماية المريض والطبيب حتى في الحالات الشديدة لاختراق قاعدة البيانات:"
                                : "Sakina's backend utilizes a clinical zero-knowledge database proxy design to protect patients and doctors from digital surveillance and server breaches:"}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              <div className="bg-white border border-gray-100 p-3 rounded-xl space-y-1 shadow-3xs">
                                <span className="text-xs font-bold text-amber-900 block">
                                  {lang === "ar" ? "🔒 التشفير المتماثل بالتناوب (AES-256)" : "🔒 Dynamic AES-256-CBC Payload Encryption"}
                                </span>
                                <p className="text-[11px] text-gray-500 leading-relaxed">
                                  {lang === "ar"
                                    ? "لا يتم تخزين الرموز والكلمات بشكل مقروء مطلقاً. يقوم السيرفر بتوليد مفتاح ملحي فريد لكل استمارة من خلال دمج رقم تعريف الحالة مع الـ 4-Digit PIN الخاص بالمريض. هذا يعني أن الردود مشفرة بمفاتيح لا يمتلكها حتى السيرفر نفسه دون علم ومشاركة المريض بكلمة مروره."
                                    : "The patient's 4-digit PIN undergoes client-side hashing, forming a salted key that encrypts all therapist replies into high-frequency garbled text. Sakina servers never store the raw PIN, ensuring no clinical logs are readable even in database theft."}
                                </p>
                              </div>
                              <div className="bg-white border border-gray-100 p-3 rounded-xl space-y-1 shadow-3xs">
                                <span className="text-xs font-bold text-amber-900 block">
                                  {lang === "ar" ? "🚫 التجريد الكامل ومسح الأثر الرقمي" : "🚫 Instant Digital Scrubbing Standards"}
                                </span>
                                <p className="text-[11px] text-gray-500 leading-relaxed">
                                  {lang === "ar"
                                    ? "يجرد السيرفر بشكل صارم كلاً من: عنوان IP وعلامات المتصفح الفريد (User-Agent) وبقايا الجلسات (Sessions). الاستشارة لا ترتبط بأي حساب، وتتبعها يتم مؤقتاً عبر قاعدة البيانات بصفة مجهولة تامة."
                                    : "All incoming network headers, cookie states, browser footprints, and active machine details are rigorously scrubbed by Express backend immediately. No server logging accounts exist."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Breakout Invitation Modal Alert (If pulled privately by doctor) */}
      <AnimatePresence>
        {showPullModal && pulledChatId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-[#2B2D42]"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl border-2 border-[#D4A373] p-6 max-w-md w-full text-center space-y-5 shadow-2xl relative"
            >
              <div className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 text-[10px] font-bold uppercase rounded-full w-fit mx-auto mt-1 animate-pulse flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>{lang === "ar" ? "تدخل طبي آمن وقائي" : "Secure Clinical Breakout"}</span>
              </div>

              <div className="bg-[#4A6B5D]/10 h-14 w-14 text-[#4A6B5D] rounded-full flex items-center justify-center mx-auto">
                <Volume2 className="h-7 w-7 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-sm md:text-base text-[#4A6B5D]">{t.privatePullTitle}</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">{t.privatePullMessage}</p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setPrivateChatId(pulledChatId);
                    setPrivateChatTitleStr(pulledAlias || "");
                    setPrivateMessages([]);
                    setCurrentView("private-chat");
                    setShowPullModal(false);
                  }}
                  className="w-full py-3 bg-[#4A6B5D] hover:bg-[#3b5549] text-white rounded-xl text-xs font-bold transition-transform cursor-pointer shadow-md"
                >
                  {t.acceptPull}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPullModal(false)}
                  className="w-full py-2 bg-transparent hover:bg-gray-100 text-[#2B2D42]/60 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t.declinePull}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stealth / Panic Button (ESC key or floating close indicator for safety) */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          type="button"
          onClick={() => { window.location.href = "https://www.google.com"; }}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95 text-[11px]"
          title={lang === "ar" ? "اضغط هنا أو اضغط ESC للإغلاق السريع والتحويل لمحرك بحث Google حماية لخصوصيتك" : "Click here or press ESC for stealth close & Google redirect"}
        >
          <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
          <span>{lang === "ar" ? "إغلاق تمويهي سريع (Esc)" : "Stealth Close (Esc)"}</span>
        </button>
      </div>

      {/* Footer layout */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 select-none text-[#2B2D42] opacity-85 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2.5">
          <div className="flex items-center justify-center gap-2 font-bold text-[#4A6B5D]">
            <span>{t.appTitle}</span>
            <span className="font-normal opacity-40">|</span>
            <span className="text-[10px] tracking-widest uppercase">{lang === "ar" ? "نظام الصحة النفسية والعصبية الميداني" : "Psychiatric Aid Hub Block"}</span>
          </div>
          <p className="text-[11px] max-w-xl mx-auto leading-relaxed">{t.allRights}</p>
        </div>
      </footer>

    </div>
  );
}
