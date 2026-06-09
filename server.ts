import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const app = express();

app.use(express.json());

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY || "";
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Security Configuration
const DOCTOR_PASSWORD = process.env.DOCTOR_PASSWORD || "Sakina2026";
const ENCRYPTION_KEY = crypto.createHash('sha256').update(process.env.CRYPTO_SECRET || "SakinaSecureSecretCryptoSessionKey2026").digest();
const IV_LENGTH = 16;

// Encryption assistance
function encryptText(text: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    return text;
  }
}

function decryptText(text: string): string {
  try {
    if (!text.includes(":")) return text;
    const parts = text.split(":");
    const iv = Buffer.from(parts.shift() || "", "hex");
    const encryptedText = parts.join(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    return "[فشل فك التشفير - المحتوى محمي]";
  }
}

// Arabic Text Normalization helper for secure answer comparisons
function normalizeArabicText(txt: string): string {
  if (!txt) return "";
  return txt
    .toLowerCase()
    .trim()
    .replace(/[\s\W_]+/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
}

// Salted cryptographic helpers for PIN-based reply safety
function encryptReply(text: string, pinHash: string): string {
  try {
    const derivedKey = crypto.createHash("sha256").update(ENCRYPTION_KEY.toString("hex") + pinHash).digest();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", derivedKey, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption of reply failed:", error);
    return text;
  }
}

function decryptReply(text: string, pinHash: string): string {
  try {
    if (!text.includes(":")) return text;
    const derivedKey = crypto.createHash("sha256").update(ENCRYPTION_KEY.toString("hex") + pinHash).digest();
    const parts = text.split(":");
    const iv = Buffer.from(parts.shift() || "", "hex");
    const encryptedText = parts.join(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", derivedKey, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption of reply failed:", error);
    return "[فشل فك التفريد بموجب الملح الرقمي]";
  }
}

// database schema
interface Consultation {
  id: string; // e.g., SK-7F9A2B (randomly generated)
  category: "anxiety" | "grief" | "trauma" | "other";
  textEncrypted: string;
  createdAt: string;
  status: "pending" | "answered";
  replyEncrypted?: string;
  replyAt?: string;
  riskLevel: "normal" | "high";
  aiDraft?: string;
  pinHash?: string; // Stored SHA-256 hash of the patient's 4-digit PIN, ensuring the plain PIN is never kept
  securityQuestionId?: string; // Stored ID/Value of the selected safety security question
  securityAnswerHash?: string; // Stored SHA-256 hash of the normalized security question answer
}

interface ChatMessage {
  id: number;
  roomId: string;
  alias: string;
  userToken: string; // unique browser session token used for tracking individual block states
  message: string;
  timestamp: string;
  isDoctor: boolean;
  isDeleted: boolean;
  isReported?: boolean;
  reportCount?: number;
}

interface PrivateChat {
  id: string; // e.g. PC-XXX
  userToken: string;
  userAlias: string;
  roomId: string; // source room
  messages: Array<{
    sender: "doctor" | "user";
    message: string;
    timestamp: string;
  }>;
  status: "active" | "closed";
}

interface Doctor {
  name: string;
  passwordHash: string;
  specialties: string[];
  createdAt: string;
}

interface TipStory {
  id: string; // e.g. TS-101
  type: "doctor" | "patient";
  author: string;
  title: string;
  text: string;
  category: string;
  likes: number;
  createdAt: string;
}

interface Database {
  consultations: Consultation[];
  messages: ChatMessage[];
  blockedTokens: string[];
  privateChats: PrivateChat[];
  doctors?: Doctor[];
  tipsStories?: TipStory[];
  assessments?: any[];
}

const DB_FILE = path.join(process.cwd(), "db.json");

function getInitialDB(): Database {
  return {
    consultations: [
      {
        id: "SK-9082",
        category: "trauma",
        textEncrypted: encryptText("أعاني من كوابيس لا تنتهي بعد هدم بيتنا، ولا أستطيع النوم. أشعر بالذنب لأن عائلتي لا تزال هناك وأنا بعيد."),
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: "answered",
        replyEncrypted: encryptText("أهلاً بك يا بطل. هذه مشاعر طبيعية بعد المرور بحدث صدمي كبير. لا تلم نفسك، فالناجي لديه رسالة ليقدمها. حاول ممارسة تمارين التنفس العميق والابتعاد عن مصادر القلق قبل النوم بـ 3 ساعات."),
        replyAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        riskLevel: "normal"
      },
      {
        id: "SK-2415",
        category: "anxiety",
        textEncrypted: encryptText("كلما سمعت صوتاً مرتفعاً، حتى لو كان عادياً، يبدأ قلبي بالخفقان بقوة ولا أستطيع التنفس. أشعر أنني سأموت في تلك اللحظة."),
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: "pending",
        riskLevel: "high",
        aiDraft: "الرد المقترح من ذكاء سكينة التوليدي: يظهر المريض أعراضاً كلاسيكية لاضطراب ما بعد الصدمة (PTSD) وهلع الأصوات المرتفعة. يُنصح الأخصائي بطمأنة المريض أولاً، ثم تقديم تمرين التفريغ الحسي باللمس (العد العكسي 5-4-3-2-1) لمساعدته على العودة للواقع وتأكيد زوال خطر الصوت الآني."
      }
    ],
    tipsStories: [
      {
        id: "TS-101",
        type: "doctor",
        author: "الأخصائي د. سمير كمال",
        title: "روتين الصباح المهدئ لمنع تشنج الهلع بعد الاستيقاظ المفاجئ",
        text: "إذا استيقظت فجأة على صوت قصف أو ذعر، ابدأ فوراً بتطبيق شهيق عميق من الأنف لمدة 4 ثوانٍ، اكتم الهواء 4 ثوانٍ، ثم زفير بطيء ممتد من الفم كالصفير لـ 6 ثوانٍ. يساعد هذا التمرين على موازنة الأكسجين وغسل ورفع قلوية الدم وتخفيف خفقان القلب السريع فورياً.",
        category: "panic",
        likes: 12,
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: "TS-102",
        type: "patient",
        author: "أمل متجددة (صابر من دير البلح)",
        title: "كيف استعدت ابتسامتي ونشاط خيمتي بعد الفراق المؤلم خلف الركام",
        text: "كنت أظن أن حزني على عائلتي التي فقدتها سيبتلع كليتي للأبد. لكن بمجرد أن بدأت بالتنفيس وتفريغ الكلمات هنا ومشاركة قلقي مع الأخصائي، بدأت بالمبادرة وصنع ألعاب من الورق اليدوي لأطفال المخيم. العطاء ومساندة الضعفاء حولت حزني لرسالة صمود، وحررت عقلي من كوابيس خيمتي النفسية.",
        category: "resilience",
        likes: 24,
        createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
      },
      {
        id: "TS-103",
        type: "doctor",
        author: "الأخصائية د. آمنة رضوان",
        title: "كيف تتعامل بحكمة واتزان مع ذعر طفلك من أصوات الانفجارات الشديدة؟",
        text: "القاعدة الذهبية: الأطفال يقرؤون هدوء وجوه آبائهم كمرآة للأمان. عند حدوث دوي شديد، لا تبكِ أو تذعر فجأة أمامهم. اضغط طفلك لصدرك بقوة ليشعر بنبضاتك الهادئة، قل له بصوت دافئ وثابت 'صوت قوي لكنه يبتعد الآن ونحن تحت الحماية'، هذا يفصل الاستجابة الدفاعية العصبية للطفل ويحميه من الصدمة العميقة.",
        category: "trauma",
        likes: 18,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: "TS-104",
        type: "patient",
        author: "نور يافا (صامدة بمدينة غزة)",
        title: "صندوق تفريغ الكلمات ساعدني على ترويض مخاوف الهلع من الظلام",
        text: "أكتب يومياً هنا لتبخير أحزاني وخوفي عندما تسدل العتمة ستائرها. رؤية الكلمات السيئة والذكريات المؤلمة وهي تتبخر وتزول، تعيد ترتيب عقلي وأنام وصدري هادئ كالبحر الصافي. أنصحكم بالاستمرار بالكتابة والمواظبة على السكينة اليومية.",
        category: "anxiety",
        likes: 15,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ],
    messages: [
      {
        id: 1,
        roomId: "trauma",
        alias: "صمود ١٤",
        userToken: "token-sample-1",
        message: "السلام عليكم، هل يوجد طبيب متواجد معنا هنا؟",
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        isDoctor: false,
        isDeleted: false
      },
      {
        id: 2,
        roomId: "trauma",
        alias: "المعالج سَكِينَة",
        userToken: "doctor-token",
        message: "وعليكم السلام ورحمة الله وبركاته. نعم، أنا معكم هنا للاستماع ومساعدتكم وتوجيه الفعاليات. كيف تشعرون اليوم؟",
        timestamp: new Date(Date.now() - 9 * 60000).toISOString(),
        isDoctor: true,
        isDeleted: false
      },
      {
        id: 3,
        roomId: "trauma",
        alias: "أمل ٠٥",
        userToken: "token-sample-2",
        message: "الحمد لله، نحاول البقاء أقوياء في دير البلح رغم كل شيء.",
        timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
        isDoctor: false,
        isDeleted: false
      }
    ],
    blockedTokens: [],
    privateChats: [],
    doctors: [],
    assessments: []
  };
}

let db: Database = getInitialDB();

// Fast database saving with persistence
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf8");
      db = JSON.parse(content);
      if (!db.doctors) {
        db.doctors = [];
      }
      if (!db.tipsStories) {
        db.tipsStories = getInitialDB().tipsStories || [];
      }
      if (!db.consultations) {
        db.consultations = getInitialDB().consultations || [];
      }
      if (!db.messages) {
        db.messages = getInitialDB().messages || [];
      }
      if (!db.blockedTokens) {
        db.blockedTokens = [];
      }
      if (!db.privateChats) {
        db.privateChats = [];
      }
      if (!db.assessments) {
        db.assessments = [];
      }
    } else {
      saveDB();
    }
  } catch (error) {
    console.error("Error loading database file:", error);
    db = getInitialDB();
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving database file:", error);
  }
}

loadDB();

// Smart Keyword Assessment and Gemini Triage Assist with Exponential Backoff retry
async function generateContentWithRetry(
  aiClient: GoogleGenAI,
  options: { model: string; contents: string; config?: any },
  maxRetries = 3,
  initialDelayMs = 1000
): Promise<any> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await aiClient.models.generateContent(options);
    } catch (err: any) {
      attempt++;
      const errorMsg = err?.message || "";
      const statusCode = err?.status || 0;
      
      const isTransient = 
        statusCode === 503 || 
        statusCode === 429 || 
        statusCode === 500 ||
        errorMsg.includes("503") || 
        errorMsg.includes("429") || 
        errorMsg.includes("500") ||
        errorMsg.includes("UNAVAILABLE") ||
        errorMsg.includes("RESOURCE_EXHAUSTED");

      if (isTransient && attempt < maxRetries) {
        const delay = initialDelayMs * Math.pow(2, attempt - 1);
        console.warn(`Gemini API: Encountered transient error (${errorMsg}). Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
}

async function generateTriageAndDraft(text: string, category: string): Promise<{ risk: "normal" | "high", draft: string }> {
  // Static check first (extremely safe fallback)
  const highRiskKeywords = ["أنتحر", "الانتحار", "أنهي حياتي", "أموت نفسي", "الموت أفضل", "أذبح نفسي", "تعبت من الحياة", "suicide", "kill myself", "end my life"];
  let isHighRisk = false;
  for (const word of highRiskKeywords) {
    if (text.includes(word)) {
      isHighRisk = true;
      break;
    }
  }

  let aiDraftResult = "";
  if (ai) {
    try {
      const prompt = `أنت مساعد أخصائي نفسي ذكي في منصة 'سكينة' لدعم غزة.
تلقينا رسالة استشارة سرية من مريض في قطاع غزة يعاني من مشاكل نفسية.
التصنيف التقريبي للحالة: ${category}.
محتوى الرسالة من المريض: "${text}"

المطلوب منك شيئين بأسلوب مهني وطبي ومحترم للغاية:
1. تقييم مدى خطورة الحالة الفورية (هل تشير لأفكار انتحارية حادة، جرح الذات الشديد، أو تدهور عقلي كامل؟) أجب بـ [HIGH] أو [NORMAL] مع مبرر طبي مكثف في سطر واحد باللغة العربية.
2. صياغة مسودة رد إرشادي أولي متعاطف جداً وداعم (بين 2-3 أسطر باللغة العربية) لمساعدة الطبيب المعالج الحقيقي على الاسترشاد بها لإجابة المريض وتخفيف معاناته فوراً.

صغ الإجابة كاملة باللغة العربية بشكل منسق وجاهز للطبيب.`;

      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      aiDraftResult = response.text || "";
      if (aiDraftResult.includes("[HIGH]") || aiDraftResult.toLowerCase().includes("high")) {
        isHighRisk = true;
      }
    } catch (err) {
      console.error("Gemini triage logic error:", err);
      aiDraftResult = "يتعذر تشغيل المساعد الذكي حالياً بسبب زيادة الضغط المؤقت على السحابة الذكية. يرجى مراجعة تفاصيل الحالة وتقييمها يدوياً للسرعة.";
    }
  } else {
    aiDraftResult = "لم ينشط الذكاء الاصطناعي بسبب عدم تفعيل مفتاح الخدمة API Key. تم الاعتماد على نظام المراقبة المحلي الذكي لتصنيف خطورة الاستشارة.";
  }

  return {
    risk: isHighRisk ? "high" : "normal",
    draft: aiDraftResult || "يرجى مراجعة المريض والرد مباشرة لمواساته وتخفيف أزمته الحالية."
  };
}

// REST API Endpoints

// 1. Send Consultation (Anonymous)
app.post("/api/consultations", async (req, res) => {
  try {
    const { category, text, pin, securityQuestionId, securityAnswer } = req.body;
    if (!text || !category) {
      return res.status(400).json({ status: "error", error: "Please enter category and text content" });
    }

    const randomID = "SK-" + Math.floor(1000 + Math.random() * 9000);
    const textEnc = encryptText(text);

    // Get 4-digit Pin safely
    let pinHash: string | undefined = undefined;
    if (pin) {
      const pinStr = String(pin).trim();
      if (pinStr.length === 4 && !isNaN(Number(pinStr))) {
        pinHash = crypto.createHash("sha256").update(pinStr).digest("hex");
      }
    }

    // Set up security question answer hash
    let securityAnswerHash: string | undefined = undefined;
    if (securityQuestionId && securityAnswer && securityAnswer.trim() !== "") {
      const normalizedAns = normalizeArabicText(securityAnswer);
      securityAnswerHash = crypto.createHash("sha256").update(normalizedAns).digest("hex");
    }

    // AI assessment in background
    const assessment = await generateTriageAndDraft(text, category);

    const newConsultation: Consultation = {
      id: randomID,
      category,
      textEncrypted: textEnc,
      createdAt: new Date().toISOString(),
      status: "pending",
      riskLevel: assessment.risk,
      aiDraft: assessment.draft,
      pinHash: pinHash,
      securityQuestionId,
      securityAnswerHash
    };

    db.consultations.unshift(newConsultation);
    saveDB();

    res.json({
      status: "success",
      trackingId: randomID,
      riskLevel: assessment.risk,
      hasPin: !!pinHash,
      hasSecurityQuestion: !!securityAnswerHash
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

// 2. Track Response (Retrieve Consultation)
app.get("/api/consultations/:id", (req, res) => {
  try {
    const { id } = req.params;
    const clientPin = req.query.pin as string;
    const clientQuestionId = req.query.questionId as string;
    const clientAnswer = req.query.answer as string;
    
    const consultation = db.consultations.find(c => c.id === id);

    if (!consultation) {
      return res.status(404).json({ status: "error", error: "لم نجد استشارة بهذا الرقم العشوائي، رجاءً تأكد من كتابته بشكل صحيح." });
    }

    // Verify 4-digit secure PIN if applicable
    if (consultation.pinHash) {
      let isAuthorized = false;

      // 1. Try PIN match
      if (clientPin) {
        const hashedClientPin = crypto.createHash("sha256").update(clientPin.trim()).digest("hex");
        if (hashedClientPin === consultation.pinHash) {
          isAuthorized = true;
        }
      } 
      // 2. Or try security question match
      else if (clientQuestionId && clientAnswer) {
        if (consultation.securityQuestionId === clientQuestionId && consultation.securityAnswerHash) {
          const normalizedInput = normalizeArabicText(clientAnswer);
          const hashedInput = crypto.createHash("sha256").update(normalizedInput).digest("hex");
          if (hashedInput === consultation.securityAnswerHash) {
            isAuthorized = true;
          }
        }
      }

      if (!isAuthorized) {
        // If recovery attempted but failed
        if (clientQuestionId && clientAnswer) {
          return res.status(403).json({
            status: "error",
            error: "إجابة سؤال الأمان غير صحيحة أو لا تتطابق مع البيانات المسجلة لهذه الاستشارة."
          });
        }
        
        return res.status(403).json({
          status: "error",
          error: "سريّة فائقة: هذه الاستشارة محمية برمز مرور (PIN). يرجى كتابة الرمز المكون من 4 أرقام أو الإجابة على سؤال الأمان لقراءة الرد."
        });
      }
    }

    // Decrypt reply with Salt PIN if configured
    let replyDecrypted: string | undefined = undefined;
    if (consultation.replyEncrypted) {
      if (consultation.pinHash) {
        replyDecrypted = decryptReply(consultation.replyEncrypted, consultation.pinHash);
      } else {
        replyDecrypted = decryptText(consultation.replyEncrypted);
      }
    }

    res.json({
      status: "success",
      id: consultation.id,
      category: consultation.category,
      textDecrypted: decryptText(consultation.textEncrypted),
      createdAt: consultation.createdAt,
      conStatus: consultation.status,
      replyDecrypted: replyDecrypted,
      replyAt: consultation.replyAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: "Internal error" });
  }
});

// 3. User Login & Registration (Doctor Access Authorization)
app.post("/api/doctor/login", (req, res) => {
  const { name, password, specialties } = req.body;

  // Fallback: If name is not provided, allow the default password login (legacy fallback)
  if (!name || name.trim() === "") {
    if (password === DOCTOR_PASSWORD) {
      return res.json({
        status: "success",
        token: "doctor-super-secure-token-2026-auth",
        name: "الأخصائي العام المعتمد",
        specialties: ["trauma", "panic", "resilience"]
      });
    }
    return res.status(401).json({ status: "error", error: "الرجاء إدخال اسم الأخصائي متبوعاً بكلمة المرور الخاصة به للتحقق أو التسجيل." });
  }

  const trimmedName = name.trim();
  if (!password || password.trim() === "") {
    return res.status(400).json({ status: "error", error: "كلمة المرور مطلوبة ومهمة للتسجيل أو التحقق." });
  }

  const passwordHash = crypto.createHash('sha256').update(password.trim()).digest('hex');

  if (!db.doctors) {
    db.doctors = [];
  }

  // Find existing doctor
  const existingDoc = db.doctors.find(d => d.name.toLowerCase() === trimmedName.toLowerCase());

  if (existingDoc) {
    // If exists, verify the password
    if (existingDoc.passwordHash === passwordHash) {
      const generatedToken = "doctor-token-" + Buffer.from(existingDoc.name).toString("hex");
      return res.json({
        status: "success",
        token: generatedToken,
        name: existingDoc.name,
        specialties: existingDoc.specialties
      });
    } else {
      return res.status(401).json({
        status: "error",
        error: "هذا الاسم مسجل مسبقاً في المنصة بكلمة مرور أخرى. يرجى إدخال كلمة المرور الصحيحة أو استخدام اسم أخصائي مختلف."
      });
    }
  } else {
    // If does not exist, dynamic registration
    const validatedSpecialties = Array.isArray(specialties) && specialties.length > 0 ? specialties : ["trauma"];
    const newDoc: Doctor = {
      name: trimmedName,
      passwordHash: passwordHash,
      specialties: validatedSpecialties,
      createdAt: new Date().toISOString()
    };
    db.doctors.push(newDoc);
    saveDB();

    const generatedToken = "doctor-token-" + Buffer.from(newDoc.name).toString("hex");
    return res.json({
      status: "success",
      token: generatedToken,
      name: newDoc.name,
      specialties: newDoc.specialties,
      isNew: true
    });
  }
});

// Helper for Auth Check
function requireDoctorAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  let token = "";
  const authHeader = req.headers.authorization;
  if (authHeader) {
    token = authHeader.replace("Bearer ", "");
  } else if (req.query.token) {
    token = req.query.token as string;
  }

  if (!token) {
    return res.status(403).json({ status: "error", error: "غير مصرح، يرجى تسجيل الدخول أولاً كأخصائي معتمد." });
  }

  if (token === "doctor-super-secure-token-2026-auth") {
    (req as any).doctor = { name: "الأخصائي العام المعتمد", specialties: ["trauma", "panic", "resilience"] };
    return next();
  }

  if (token.startsWith("doctor-token-")) {
    const hex = token.replace("doctor-token-", "");
    try {
      const name = Buffer.from(hex, "hex").toString("utf8");
      if (!db.doctors) db.doctors = [];
      const found = db.doctors.find(d => d.name.toLowerCase() === name.toLowerCase());
      if (found) {
        (req as any).doctor = found;
        return next();
      }
    } catch (err) {
      console.error("Token decoding error:", err);
    }
  }

  return res.status(403).json({ status: "error", error: "انتهت صلاحية الرمز أو اسم الطبيب غير معتمد، يرجى إعادة تسجيل الدخول." });
}

// 4. Doctor Endpoints
app.get("/api/doctor/consultations", requireDoctorAuth, (req, res) => {
  try {
    const consultations = db.consultations || [];
    // Decrypt on the fly for Authorized Doctor
    const decryptedItems = consultations.map(c => ({
      ...c,
      textDecrypted: decryptText(c.textEncrypted),
      replyDecrypted: c.replyEncrypted ? (c.pinHash ? decryptReply(c.replyEncrypted, c.pinHash) : decryptText(c.replyEncrypted)) : undefined
    }));
    res.json({ status: "success", consultations: decryptedItems });
  } catch (err: any) {
    console.error("Error in /api/doctor/consultations:", err);
    res.status(500).json({ status: "error", error: err.message || "Failed to fetch consultations" });
  }
});

app.post("/api/doctor/reply", requireDoctorAuth, (req, res) => {
  const { id, reply } = req.body;
  if (!id || !reply) {
    return res.status(400).json({ status: "error", error: "المعرف المرجعي والاستشارة حتمية" });
  }

  const idx = db.consultations.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ status: "error", error: "المستند غير متوفر" });
  }

  const consultation = db.consultations[idx];
  if (consultation.pinHash) {
    db.consultations[idx].replyEncrypted = encryptReply(reply, consultation.pinHash);
  } else {
    db.consultations[idx].replyEncrypted = encryptText(reply);
  }
  db.consultations[idx].replyAt = new Date().toISOString();
  db.consultations[idx].status = "answered";
  saveDB();

  res.json({ status: "success" });
});

// 5. Rooms messaging APIs
app.get("/api/rooms/:roomId/messages", (req, res) => {
  try {
    const { roomId } = req.params;
    const lastId = parseInt(req.query.lastId as string || "0");

    const messages = db.messages || [];
    const filtered = messages
      .filter(m => m.roomId === roomId && m.id > lastId)
      .map(m => ({
        id: m.id,
        roomId: m.roomId,
        alias: m.alias,
        message: m.isDeleted ? "[تم حذف هذه الرسالة بواسطة الأخصائي والمشرف لنشر الطاقة الإيجابية ومنع الإحباط]" : m.message,
        timestamp: m.timestamp,
        isDoctor: m.isDoctor,
        isDeleted: m.isDeleted
      }));

    res.json({ status: "success", messages: filtered });
  } catch (err: any) {
    console.error("Error in /api/rooms/:roomId/messages:", err);
    res.status(500).json({ status: "error", error: err.message || "Failed to load room messages" });
  }
});

app.post("/api/rooms/:roomId/messages", (req, res) => {
  const { roomId } = req.params;
  const { alias, message, userToken, isDoctor } = req.body;

  if (!message || !alias || !userToken) {
    return res.status(400).json({ status: "error", error: "Missing required properties" });
  }

  // Check Block Token
  if (db.blockedTokens.includes(userToken) && !isDoctor) {
    return res.status(403).json({ status: "error", error: "تم حجب حسابك مؤقتاً في الغرف العامة للتنظيف اللفظي وحماية الأمان والسكينة النفسية لزملائك بقاعة الحوار." });
  }

  const newId = db.messages.length > 0 ? Math.max(...db.messages.map(m => m.id)) + 1 : 1;

  const newMessage: ChatMessage = {
    id: newId,
    roomId,
    alias,
    userToken,
    message,
    timestamp: new Date().toISOString(),
    isDoctor: !!isDoctor,
    isDeleted: false
  };

  db.messages.push(newMessage);
  saveDB();

  res.json({ status: "success", message: newMessage });
});

// 6. Support Moderation
app.post("/api/doctor/rooms/message/delete", requireDoctorAuth, (req, res) => {
  const { messageId } = req.body;
  const idx = db.messages.findIndex(m => m.id === messageId);
  if (idx !== -1) {
    db.messages[idx].isDeleted = true;
    saveDB();
    return res.json({ status: "success" });
  }
  res.status(404).json({ status: "error", error: "الرسالة غير متوفرة" });
});

app.post("/api/doctor/rooms/user/ban", requireDoctorAuth, (req, res) => {
  const { userToken } = req.body;
  if (!db.blockedTokens.includes(userToken)) {
    db.blockedTokens.push(userToken);
    saveDB();
  }
  res.json({ status: "success" });
});

// 7. Private Chat Pulled by Doctor
app.post("/api/doctor/rooms/user/pull", requireDoctorAuth, (req, res) => {
  const { userToken, userAlias, roomId } = req.body;
  if (!userToken || !userAlias) {
    return res.status(400).json({ status: "error", error: "Token/Alias parameters required" });
  }

  // Generate private chat space
  const chatId = "PC-" + Math.floor(1000 + Math.random() * 9000);
  const newPrivate: PrivateChat = {
    id: chatId,
    userToken,
    userAlias,
    roomId,
    messages: [
      {
        sender: "doctor",
        message: `أهلاً بك يا ${userAlias}. لقد سحبتك لمحادثة هادئة ومغلقة آمنة هنا لمناقشة وضعك بشكل مستقل ودقيق بعيداً عن الغرف الجماعية. كيف يمكنني إراحتك؟`,
        timestamp: new Date().toISOString()
      }
    ],
    status: "active"
  };

  db.privateChats.push(newPrivate);
  saveDB();

  res.json({ status: "success", chatId });
});

// Check for pulled chat for a user
app.get("/api/user/private-pulls", (req, res) => {
  const userToken = req.query.userToken as string;
  if (!userToken) {
    return res.status(400).json({ status: "error", error: "Token expected" });
  }

  const activePulls = db.privateChats.filter(pc => pc.userToken === userToken && pc.status === "active");
  res.json({ status: "success", pulls: activePulls });
});

// Get private chat contents
app.get("/api/private-chat/:chatId", (req, res) => {
  const { chatId } = req.params;
  const pc = db.privateChats.find(chat => chat.id === chatId);
  if (!pc) {
    return res.status(404).json({ status: "error", error: "Private consultation not found or closed" });
  }
  res.json({ status: "success", chat: pc });
});

// Post a message to private chat
app.post("/api/private-chat/:chatId/message", (req, res) => {
  const { chatId } = req.params;
  const { sender, message } = req.body; // sender: 'doctor' | 'user'

  if (!message || !sender) {
    return res.status(400).json({ status: "error", error: "Missing properties" });
  }

  const idx = db.privateChats.findIndex(chat => chat.id === chatId);
  if (idx === -1) {
    return res.status(404).json({ status: "error", error: "Chatroom expired or does not exist" });
  }

  db.privateChats[idx].messages.push({
    sender,
    message,
    timestamp: new Date().toISOString()
  });
  saveDB();

  res.json({ status: "success", chat: db.privateChats[idx] });
});

// --- Support Tips & Recovery Stories Endpoints ---
app.get("/api/tips-stories", (req, res) => {
  if (!db.tipsStories) {
    db.tipsStories = [];
  }
  res.json({ status: "success", tipsStories: db.tipsStories });
});

app.post("/api/tips-stories", (req, res) => {
  const { type, author, title, text, category } = req.body;
  if (!text || !author || !category) {
    return res.status(400).json({ status: "error", error: "جميع الحقول (الاسم، العنوان، النص والتصنيف) مطلوبة" });
  }

  // Determine if it is a verified doctor post
  let isVerifiedDoctor = false;
  let finalAuthorName = author;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    if (token === "doctor-super-secure-token-2026-auth") {
      isVerifiedDoctor = true;
      finalAuthorName = author || "الأخصائي العام المعتمد";
    } else if (db.doctors) {
      const foundDecoded = db.doctors.find(d => {
        return token.includes("-auth") || token.length > 20;
      });
      if (foundDecoded) {
        isVerifiedDoctor = true;
        finalAuthorName = `الأخصائي د. ${foundDecoded.name}`;
      }
    }
  }

  const newTip: TipStory = {
    id: "TS-" + Math.floor(1000 + Math.random() * 9000),
    type: isVerifiedDoctor ? "doctor" : (type === "doctor" ? "patient" : type || "patient"),
    author: isVerifiedDoctor ? finalAuthorName : author,
    title: title || "قصة نجاح وصمود جديدة",
    text,
    category,
    likes: 0,
    createdAt: new Date().toISOString()
  };

  if (!db.tipsStories) {
    db.tipsStories = [];
  }
  db.tipsStories.unshift(newTip);
  saveDB();

  res.json({ status: "success", tipStory: newTip });
});

app.post("/api/tips-stories/:id/like", (req, res) => {
  const { id } = req.params;
  if (!db.tipsStories) db.tipsStories = [];
  const idx = db.tipsStories.findIndex(t => t.id === id);
  if (idx !== -1) {
    db.tipsStories[idx].likes = (db.tipsStories[idx].likes || 0) + 1;
    saveDB();
    return res.json({ status: "success", likes: db.tipsStories[idx].likes });
  }
  res.status(404).json({ status: "error", error: "المنشور غير متوفر" });
});

// Get global aggregated diagnostics (Anonymously metrics)
app.get("/api/doctor/statistics", requireDoctorAuth, (req, res) => {
  try {
    const consultations = db.consultations || [];
    const traumaCount = consultations.filter(c => c.category === "trauma").length;
    const anxietyCount = consultations.filter(c => c.category === "anxiety").length;
    const griefCount = consultations.filter(c => c.category === "grief").length;
    const otherCount = consultations.filter(c => c.category === "other").length;

    const total = consultations.length;
    const answered = consultations.filter(c => c.status === "answered").length;
    const pending = total - answered;

    const highRisk = consultations.filter(c => c.riskLevel === "high").length;

    res.json({
      status: "success",
      categories: { trauma: traumaCount, anxiety: anxietyCount, grief: griefCount, other: otherCount },
      total,
      answered,
      pending,
      highRisk
    });
  } catch (err: any) {
    console.error("Error in /api/doctor/statistics:", err);
    res.status(500).json({ status: "error", error: err.message || "Failed to load statistics" });
  }
});

// Report message as abusive
app.post("/api/rooms/message/:id/report", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!db.messages) db.messages = [];
    const idx = db.messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      db.messages[idx].isReported = true;
      db.messages[idx].reportCount = (db.messages[idx].reportCount || 0) + 1;
      saveDB();
      return res.json({ status: "success", isReported: true, reportCount: db.messages[idx].reportCount });
    }
    res.status(404).json({ status: "error", error: "الرسالة غير متوفرة" });
  } catch (err: any) {
    console.error("Error reporting message:", err);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

// Save assessment score under pseudo-anonymous secret account
app.post("/api/assessments", (req, res) => {
  try {
    const { username, pinHash, score, categoryScores, timestamp, securityQuestionId, securityAnswer } = req.body;
    if (!username || !pinHash || score === undefined) {
      return res.status(400).json({ status: "error", error: "الرجاء توفير جميع المعطيات لتخزين رصيد الصمود" });
    }
    if (!db.assessments) db.assessments = [];

    let securityAnswerHash: string | undefined = undefined;
    if (securityQuestionId && securityAnswer && securityAnswer.trim() !== "") {
      const normalizedAns = normalizeArabicText(securityAnswer);
      securityAnswerHash = crypto.createHash("sha256").update(normalizedAns).digest("hex");
    }

    db.assessments.push({ 
      username, 
      pinHash, 
      score, 
      categoryScores, 
      timestamp: timestamp || new Date().toISOString(),
      securityQuestionId,
      securityAnswerHash
    });
    saveDB();
    res.json({ status: "success" });
  } catch (err: any) {
    console.error("Error saving assessment:", err);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

// Retrieve assessment scores for pseudo-anonymous secret account
app.post("/api/assessments/retrieve", (req, res) => {
  try {
    const { username, pinHash, securityQuestionId, securityAnswer } = req.body;
    if (!username) {
      return res.status(400).json({ status: "error", error: "الرجاء إدخال اسم الحساب السري الخاص بك" });
    }
    if (!db.assessments) db.assessments = [];

    let list: any[] = [];
    if (pinHash) {
      list = db.assessments.filter(a => a.username === username && a.pinHash === pinHash);
    } else if (securityQuestionId && securityAnswer) {
      const normalizedAns = normalizeArabicText(securityAnswer);
      const computedHash = crypto.createHash("sha256").update(normalizedAns).digest("hex");
      list = db.assessments.filter(a => a.username === username && a.securityQuestionId === securityQuestionId && a.securityAnswerHash === computedHash);
      if (list.length === 0) {
        return res.status(403).json({ status: "error", error: "إجابة سؤال الأمان المخصصة غير صحيحة للتحقق من مسار صلابتك." });
      }
    } else {
      return res.status(400).json({ status: "error", error: "الرجاء إدخال الرمز السري PIN أو توفير سؤال الأمان لإعادة تشقاق الاسترداد." });
    }
    res.json({ status: "success", assessments: list });
  } catch (err: any) {
    console.error("Error retrieving assessments:", err);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

// Mount Vite middleware helper
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
