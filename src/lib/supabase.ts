import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables not set. Admin features will be unavailable.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder"
);

// ── Generic key-value helpers ─────────────────────────────────────────────────

export async function fetchSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .single();
    if (error || !data) return fallback;
    return { ...fallback, ...(data.value as Partial<T>) } as T;
  } catch {
    return fallback;
  }
}

export async function saveSetting<T>(key: string, value: T): Promise<void> {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}

// ── Image Upload Helper ────────────────────────────────────────────────────────

export async function uploadImageFile(file: File, bucketName = "site-images"): Promise<string> {
  try {
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, { cacheControl: "3600", upsert: true });

    if (!uploadError) {
      const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
      if (data?.publicUrl) return data.publicUrl;
    }
  } catch (err) {
    console.warn("Storage bucket upload warning:", err);
  }

  // Base64 Data URL fallback for instant compatibility
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SocialLink {
  key: string;
  label: string;
  url: string;
  icon: string;
}

export interface NavLink {
  href: string;
  label: string;
  mobileDesc?: string;
  order: number;
}

export interface GlobalSettings {
  site_name: string;
  site_tagline: string;
  contact_email: string;
  footer_copyright: string;
  footer_tagline: string;
  cta_label: string;
  cta_href: string;
  social_links: SocialLink[];
  nav_links: NavLink[];
}

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  site_name: "Pratik Aggarwal",
  site_tagline: "Disability Inclusion & Storytelling",
  contact_email: "hello@bloominginpain.com",
  footer_copyright: `© ${new Date().getFullYear()}`,
  footer_tagline: "Disability Inclusion & Storytelling",
  cta_label: "Start a Partnership",
  cta_href: "/contact",
  social_links: [
    { key: "instagram_bip", label: "Blooming in Pain Instagram", url: "https://instagram.com/blooming.in.pain", icon: "instagram" },
    { key: "medium_bip", label: "Blooming in Pain Medium", url: "https://medium.com/@BloomingInPain", icon: "medium" },
    { key: "linkedin_bip", label: "Blooming in Pain LinkedIn", url: "https://www.linkedin.com/company/bloominginpain", icon: "linkedin" },
    { key: "instagram_pratik", label: "Pratik Instagram", url: "https://instagram.com/pratik.aggarwal", icon: "instagram" },
    { key: "linkedin_pratik", label: "Pratik LinkedIn", url: "https://linkedin.com/in/pratik-aggarwal", icon: "linkedin" },
    { key: "youtube_pratik", label: "Pratik YouTube", url: "https://www.youtube.com/@pratikaggarwal", icon: "youtube" },
  ],
  nav_links: [
    { href: "/about", label: "About", mobileDesc: "Advocacy & lived authority", order: 1 },
    { href: "/services", label: "Services", mobileDesc: "Training, Advisory, Keynotes & Research", order: 2 },
    { href: "/blooming-in-pain", label: "Blooming in Pain", mobileDesc: "Storytelling & community work", order: 3 },
    { href: "/contact", label: "Contact", mobileDesc: "Partnerships & inquiries", order: 4 },
  ],
};

// ── Supabase helpers ───────────────────────────────────────────────────────────

export async function fetchGlobalSettings(): Promise<GlobalSettings> {
  return fetchSetting("global", DEFAULT_GLOBAL_SETTINGS);
}

export async function saveGlobalSettings(settings: GlobalSettings): Promise<void> {
  return saveSetting("global", settings);
}

// ── Home Page Types ───────────────────────────────────────────────────────────

export interface HomeStat {
  numeric: number;
  suffix: string;
  label: string;
}

export interface HomeOrgLogo {
  name: string;
  initials: string;
  bg: string;
  color: string;
}

export interface HomeMediaHighlight {
  outlet: string;
  category: string;
  title: string;
  description: string;
  url: string;
}

export interface HomeRoleWord {
  word: string;
  styleClass: string;
}

export interface HomePersonaHighlight {
  id: string;
  label: string;
  shortLabel: string;
  badge: string;
  iconKey: string;
  tagline: string;
  leadText: string;
  keyHighlights: string[];
  ctaLabel: string;
  ctaHref: string;
  photoUrl: string;
  photoAlt: string;
  photoCaption: string;
}

export interface HomeSettings {
  hero_prefix: string;
  hero_bio: string;
  hero_photo_url: string;
  hero_photo_alt: string;
  hero_photo_caption: string;
  hero_cta1_label: string;
  hero_cta1_href: string;
  hero_cta2_label: string;
  hero_cta2_href: string;
  persona_section_heading: string;
  persona_section_subheading: string;
  gallery_section_badge: string;
  gallery_section_heading: string;
  podcasts_section_badge: string;
  podcasts_section_heading: string;
  podcasts_section_subheading: string;
  media_section_heading: string;
  bip_section_badge: string;
  bip_section_heading: string;
  bip_section_text: string;
  bip_cta_label: string;
  bip_cta_href: string;
  stats: HomeStat[];
  org_logos: HomeOrgLogo[];
  media_highlights: HomeMediaHighlight[];
  role_words: HomeRoleWord[];
  personas: HomePersonaHighlight[];
}

export const DEFAULT_HOME_SETTINGS: HomeSettings = {
  hero_prefix: "Disability Inclusion",
  hero_bio: "Bringing together lived authority, community engagement, research, and public policy to help organisations build meaningful disability practices beyond compliance.",
  hero_photo_url: "/images/Pratik%20Pictures/Pratik%20Sir%20-%20ARNEC%20ASIA%20PACIFIC%20-%20MANILA%20-.jpg",
  hero_photo_alt: "Pratik Aggarwal speaking on global disability policy at ARNEC Asia Pacific Manila",
  hero_photo_caption: "ARNEC Asia Pacific Conference, Manila",
  hero_cta1_label: "Explore My Work →",
  hero_cta1_href: "/work",
  hero_cta2_label: "Start a Partnership →",
  hero_cta2_href: "/contact",
  persona_section_heading: "What represents you best today?",
  persona_section_subheading: "Select your context below to view tailored solutions, engagements, and impact focus.",
  gallery_section_badge: "Authentic Practice & Fieldwork",
  gallery_section_heading: "Pratik in Action Across Sectors",
  podcasts_section_badge: "Podcasts & Press Features",
  podcasts_section_heading: "In the News & Discussions",
  podcasts_section_subheading: "Selected podcast conversations, national ground reports, policy critiques, and media features.",
  media_section_heading: "National Media Features & Thought Leadership",
  bip_section_badge: "Blooming in Pain Community",
  bip_section_heading: "Centering Stories of Invisible Illness & Chronic Pain",
  bip_section_text: "Founded by Pratik in 2021 to create space for un-sanitised stories about living with persistent illness and non-visual disability.",
  bip_cta_label: "Read Community Stories →",
  bip_cta_href: "/blooming-in-pain",
  stats: [
    { numeric: 9, suffix: "+", label: "Years in Disability Practice" },
    { numeric: 40, suffix: "+", label: "Talks & Panels" },
    { numeric: 20, suffix: "+", label: "Partner Organisations" },
  ],
  org_logos: [
    { name: "UNICEF", initials: "UN", bg: "#E8F4FA", color: "#00689D" },
    { name: "HCL Foundation", initials: "HCL", bg: "#FEF0E6", color: "#C44B00" },
    { name: "Tech Mahindra", initials: "TM", bg: "#F2EAF7", color: "#5C1F7A" },
    { name: "ASTHA", initials: "AS", bg: "#E2EDE7", color: "#1F3D2A" },
    { name: "Delhi University", initials: "DU", bg: "#E6EBF1", color: "#1B3A5B" },
    { name: "IIT Delhi", initials: "IIT", bg: "#F7E8E8", color: "#8B1A1A" },
    { name: "Safdarjung Hospital", initials: "SH", bg: "#EDE4EF", color: "#3D1E3C" },
    { name: "NDMA + UN India", initials: "ND", bg: "#E6EFF6", color: "#3D6B8F" },
    { name: "Samuhik Pahal", initials: "SP", bg: "#EBF2EA", color: "#2B5329" },
    { name: "The Print", initials: "TP", bg: "#F5F0E6", color: "#6B4B00" },
    { name: "Times of India", initials: "TOI", bg: "#F9E8E8", color: "#AA151B" },
    { name: "Outlook India", initials: "OI", bg: "#E6EBF5", color: "#003580" },
  ],
  media_highlights: [
    { outlet: "The Better India", category: "Sensory Garden Pioneer", title: "At Safdarjung Hospital, 'Umang Vatika' Lets Children With Disabilities Play Freely & Safely", description: "North India's first government sensory garden designed for neurodivergent children in collaboration with ASTHA.", url: "https://thebetterindia.com/innovation/umang-vatika-safdarjung-hospital-delhi-sensory-park-children-disabilities-astha-11168102" },
    { outlet: "The Indian Express", category: "Sensory Garden Feature", title: "From visual art installations to mud pits: Sensory garden for neurodivergent children opens at Delhi's Safdarjung Hospital", description: "Visual art installations, mud pits, and accessible sensory pathways in New Delhi.", url: "https://indianexpress.com/article/cities/delhi/from-visual-art-installations-to-mud-pits-sensory-garden-for-neurodivergent-children-opens-at-delhis-safdarjung-hospital-10461086/" },
    { outlet: "DD News", category: "National Broadcast", title: "वीएमएमसी एवं सफदरजंग अस्पताल में 'उमंग वाटिका' का उद्घाटन", description: "DD News national television coverage on North India's first government sensory garden.", url: "https://ddnews.gov.in/inauguration-of-umang-vatika-at-vmmc-and-safdarjung-hospital-the-first-government-sensory-garden-in-north-india/" },
    { outlet: "The Print", category: "Ground Report", title: "How Delhi's 'Viklang Basti' lost everything in a fire and fought to get new wheelchairs", description: "Field reporting on emergency crisis response, disability rights advocacy, and wheelchair access.", url: "https://theprint.in/ground-reports/delhis-viklang-basti-lost-fire-fought-new-wheelchairs/2971119/" },
    { outlet: "Outlook India", category: "Policy & Data", title: "India's Persons With Disabilities Left Out As NFHS-6 Fact Sheets Omit Disability Data", description: "Critical commentary on systemic data omission of persons with disabilities in national health surveys.", url: "https://www.outlookindia.com/national/indias-persons-with-disabilities-left-out-as-nfhs-6-fact-sheets-omit-disability-data" },
    { outlet: "Times of India", category: "Media Quote", title: "Out of sight, out of support: Disability care lags in Delhi's slums in most trying of times", description: "Expert opinion on informal settlement care deficits during climate and health shocks.", url: "https://timesofindia.indiatimes.com/city/delhi/out-of-sight-out-of-support-disability-care-lags-in-delhis-slums-in-most-trying-of-times/articleshow/122526141.cms" },
    { outlet: "Citizen Matters", category: "Education Rights", title: "Most urban schools violate law, exclude children with disabilities", description: "Analysis of urban school non-compliance with the Rights of Persons with Disabilities Act.", url: "https://citizenmatters.in/most-urban-schools-violate-law-exclude-children-with-disabilities/" },
    { outlet: "Samuhik Pahal", category: "Thought Leadership", title: "Thirty years of working with communities: Reflections and Opinions", description: "Reflections on 30 years of rights-based community engagement and organizational learning.", url: "https://samuhikpahal.org/reflections-and-opinions/thirty-years-of-working-with-communities/" },
  ],
  role_words: [
    { word: "Expert", styleClass: "text-plum font-serif font-bold italic underline decoration-plum/40 decoration-2 underline-offset-4" },
    { word: "Researcher", styleClass: "text-[#1F3D2A] bg-[#E2EDE7] px-3 py-0.5 rounded-lg font-mono text-2xl sm:text-3xl md:text-4xl shadow-2xs" },
    { word: "Speaker", styleClass: "text-[#5C1F7A] font-serif underline decoration-plum/60 decoration-wavy decoration-2" },
    { word: "Executive Director @ ASTHA", styleClass: "text-foreground font-semibold bg-plum/10 text-plum px-3 py-0.5 rounded-full text-xl sm:text-2xl md:text-3xl" },
  ],
  personas: [
    { id: "training", label: "Training & Capacity Building", shortLabel: "Training", badge: "Workplace & Development Sector Training", iconKey: "users", tagline: "Interactive Training Delivered Across Organisational Hierarchies", leadText: "Delivering interactive training for corporates, NGOs, governments, and educational institutions — from senior leadership and HR teams to programme staff, teachers, and frontline health workers.", keyHighlights: ["Corporate DEI, disability awareness & inclusive communication", "RPwD Act 2016, rights-based frameworks & CBR", "Inclusive education, early intervention & child protection", "Capacity building for ASHAs, Anganwadi Workers & community teams"], ctaLabel: "Explore Training & Capacity Building →", ctaHref: "/services#training", photoUrl: "/images/Pratik%20Pictures/ToT%20on%20Neuro%20developmentak%20disabilities%20for%20TMF/TMF.jpg", photoAlt: "Pratik Aggarwal conducting Training of Trainers for Tech Mahindra Foundation", photoCaption: "Interactive Capacity Building Workshop" },
    { id: "consulting", label: "Consulting & Advisory", shortLabel: "Advisory", badge: "Systemic Inclusion & Policy Advisory", iconKey: "landmark", tagline: "Making Programmes, Policies, Workplaces & Systems Inclusive", leadText: "Advising organisations on making their existing systems and policies genuinely inclusive — including HR policies, universal design, accessibility reviews, programme evaluation, and MEL.", keyHighlights: ["Disability Inclusion & DEI strategy & legal/policy clarity", "Organisational HR policies, safeguarding & reasonable accommodation", "Sensory infrastructure co-design (e.g. Umang Vatika)", "Programme reviews, accessibility audits & impact evaluation"], ctaLabel: "Consult on Systems & Strategy →", ctaHref: "/services#consulting", photoUrl: "/images/Pratik%20Pictures/Sensory%20Park%20Safdarjung/DSCF6747%20(1).JPG", photoAlt: "Pratik Aggarwal co-creating Umang Vatika Sensory Garden at Safdarjung Hospital", photoCaption: "Sensory Infrastructure & Universal Design" },
    { id: "talks", label: "Speaking & Keynotes", shortLabel: "Keynotes", badge: "Keynotes, University Lectures & Summits", iconKey: "graduation-cap", tagline: "Challenging Conventional Disability Narratives", leadText: "Delivering compelling keynote addresses, university lectures, and public summit interventions — grounding policy and research in lived authority and disability rights.", keyHighlights: ["Keynote addresses on invisible disability & lived authority", "University guest lectures & postgraduate interactive seminars", "National & global conference panels (e.g. Purple Fest Goa, ARNEC Manila)", "Public health, media, and podcast dialogue facilitation"], ctaLabel: "Invite Pratik to Speak →", ctaHref: "/services#talks", photoUrl: "/images/Pratik%20Pictures/Purple%20Fest%20-%20Census%20and%20Disability%20/IMG_9575.jpeg", photoAlt: "Pratik Aggarwal delivering keynote address at Purple Fest", photoCaption: "Keynote Address on Lived Authority" },
    { id: "research", label: "Research & Writing", shortLabel: "Research", badge: "Research, Policy & Organisational Communication", iconKey: "building2", tagline: "Writing & Communication Supporting Impact & Fundraising", leadText: "Supporting non-profits and foundations with grant writing, donor proposals, policy briefs, research reports, and rendering organizational communication fully disability-inclusive.", keyHighlights: ["Grant and proposal writing & donor communication", "Programme, annual, and impact assessment reports", "Research reports, policy briefs & thought leadership articles", "Making digital, social media, and publications accessible"], ctaLabel: "Commission Research & Writing →", ctaHref: "/services#research", photoUrl: "/images/Pratik%20Pictures/ARNEC%20Manila/image%20(8).png", photoAlt: "Pratik Aggarwal presenting research paper at ARNEC Manila", photoCaption: "Global Advocacy & Research Presentation" },
  ],
};

export async function fetchHomeSettings(): Promise<HomeSettings> {
  return fetchSetting("home", DEFAULT_HOME_SETTINGS);
}

export async function saveHomeSettings(settings: HomeSettings): Promise<void> {
  return saveSetting("home", settings);
}

// ── Blooming in Pain Settings ──────────────────────────────────────────────────

export interface BipStoryItem {
  id: number;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  author: string;
  mediumUrl: string;
  imgUrl: string;
}

export interface BipSettings {
  hero_title: string;
  hero_subtitle: string;
  intro_heading: string;
  intro_body: string;
  stories: BipStoryItem[];
}

export const DEFAULT_BIP_SETTINGS: BipSettings = {
  hero_title: "Blooming in Pain",
  hero_subtitle: "A story-led initiative & community centering lived experiences of invisible illness, chronic pain, and disability.",
  intro_heading: "Un-sanitised Stories of Pain, Resilience & Care",
  intro_body: "Founded by Pratik Aggarwal in 2021, Blooming in Pain is a platform and community for people living with chronic pain, invisible illness, and non-visual disability. We publish personal essays, reflections, and care guides.",
  stories: [
    {
      id: 1,
      tag: "Endometriosis & Surgery",
      title: "Living with Endometriosis: Srinikhita Pole’s Story of Chronic Pain, Surgery, and Resilience",
      excerpt: "Srinikhita Pole reflects on living with severe endometriosis, navigating major surgeries, and discovering resilience amidst chronic pelvic pain.",
      readTime: "6 min",
      author: "Srinikhita Pole",
      mediumUrl: "https://medium.com/@BloomingInPain/living-with-endometriosis-srinikhita-poles-story-of-chronic-pain-surgery-and-resilience-e22486eeb5f7",
      imgUrl: "/medium/Living%20with%20Endometriosis-%20Srinikhita%20Pole%E2%80%99s%20Story%20of%20Chronic%20Pain,%20Surgery,%20and%20Resilience_image.webp",
    },
    {
      id: 2,
      tag: "Neuropsychology & Pain",
      title: "Understanding the Unseen: A Neuropsychologist’s Personal Journey with Chronic Pain",
      excerpt: "A neuropsychologist shares his lived experience of chronic pain and invisible illness, and why he founded Blooming in Pain to build community.",
      readTime: "5 min",
      author: "Pratik Aggarwal",
      mediumUrl: "https://medium.com/@BloomingInPain/understanding-the-unseen-a-neuropsychologists-personal-journey-with-chronic-pain-262dbee5357f",
      imgUrl: "/medium/Understanding%20the%20Unseen-%20A%20Neuropsychologist%E2%80%99s%20Personal%20Journey%20with%20Chronic%20Pain_image.webp",
    },
    {
      id: 3,
      tag: "Youth & Chronic Illness",
      title: "Living with Pain: Varshal’s Story of Strength and Stillness",
      excerpt: "Varshal shares her journey after her body suddenly turned against her at a young age, finding inner quiet, strength, and acceptance.",
      readTime: "5 min",
      author: "Varshal",
      mediumUrl: "https://medium.com/@BloomingInPain/living-with-pain-varshals-story-of-strength-and-stillness-de0f29706db9",
      imgUrl: "/medium/She%20Was%20Active,%20Healthy,%20and%20Young-%20Then%20Her%20Body%20Turned%20Against%20Her_image.webp",
    },
    {
      id: 4,
      tag: "Vulvodynia & Misdiagnosis",
      title: "She Thought It Was Just Another Yeast Infection: Years of Misdiagnosis & Pelvic Pain",
      excerpt: "Phillipa Baines’ brutally honest journey through vulvodynia, medical gaslighting, and the radical courage it took to reclaim her life.",
      readTime: "6 min",
      author: "Pratik Aggarwal",
      mediumUrl: "https://medium.com/@BloomingInPain/she-thought-it-was-just-another-yeast-infection-what-followed-was-years-of-misdiagnosis-pain-21ca8e569330",
      imgUrl: "/medium/She%20Thought%20It%20Was%20Just%20Another%20Yeast%20Infection,%20But%20It%20Stole%20Her%20Peace%20and%20Power_image.webp",
    },
    {
      id: 5,
      tag: "Medical Trauma & Advocacy",
      title: "Kevin James’ Unyielding Fight: Surviving Iatrogenic Injuries & Misdiagnoses",
      excerpt: "Navigating complex medical trauma, iatrogenic harm, and the emotional journey from systemic medical disbelief to fierce self-advocacy.",
      readTime: "7 min",
      author: "Kevin James",
      mediumUrl: "https://medium.com/@BloomingInPain/kevin-james-unyielding-fight-surviving-iatrogenic-injuries-misdiagnoses-and-the-emotional-bb4d0579d29f",
      imgUrl: "/medium/Kevin%20James%E2%80%99%20Unyielding%20Fight-%20Surviving%20Iatrogenic%20Injuries,%20Misdiagnoses,%20and%20the%20Emotional%20Journey%20to%20Self-Advocacy_image.webp",
    },
    {
      id: 6,
      tag: "Caregiving & Partner Support",
      title: "Shabnam Rakhiba’s Guide to Love and Care: Standing by Someone with Chronic Pain",
      excerpt: "An insightful guide for partners, family, and allies on providing meaningful care, emotional grounding, and active support for loved ones with chronic pain.",
      readTime: "5 min",
      author: "Shabnam Rakhiba",
      mediumUrl: "https://medium.com/@BloomingInPain/shabnam-rakhibas-guide-to-love-and-care-standing-by-someone-with-chronic-pain-b687cd63fc28",
      imgUrl: "/medium/Shabnam%20Rakhiba%E2%80%99s%20Guide%20to%20Love%20and%20Care-%20Standing%20by%20Someone%20with%20Chronic%20Pain_image.webp",
    },
    {
      id: 7,
      tag: "Global Patient Advocacy",
      title: "Rising from the Abyss: Virginia McIntyre’s Journey to International Advocacy",
      excerpt: "From chronic pain patient to global patient advocate, Virginia McIntyre shares how processing deep illness transformed her into a champion for disability rights.",
      readTime: "6 min",
      author: "Virginia McIntyre",
      mediumUrl: "https://medium.com/@BloomingInPain/rising-from-the-abyss-virginia-mcintyres-journey-from-chronic-pain-patient-to-international-1fefa2664bf1",
      imgUrl: "/medium/Rising%20from%20the%20Abyss-%20Virginia%20McIntyre%E2%80%99s%20Journey%20from%20Chronic%20Pain%20Patient%20to%20International%20Advocate_image.webp",
    },
  ],
};

export async function fetchBipSettings(): Promise<BipSettings> {
  return fetchSetting("bip", DEFAULT_BIP_SETTINGS);
}

export async function saveBipSettings(settings: BipSettings): Promise<void> {
  return saveSetting("bip", settings);
}

// ── About Page Settings ────────────────────────────────────────────────────────

export interface AboutFAQItem {
  id: string;
  label: string;
  question: string;
  answer: string;
}

export interface AboutSettings {
  hero_title: string;
  hero_subtitle: string;
  bio_p1: string;
  bio_p2: string;
  bio_p3: string;
  faqs: AboutFAQItem[];
}

export const DEFAULT_ABOUT_SETTINGS: AboutSettings = {
  hero_title: "Advocacy, Lived Authority & Disability Practice",
  hero_subtitle: "Pratik Aggarwal is Executive Director at ASTHA and founder of Blooming in Pain.",
  bio_p1: "Pratik Aggarwal is Executive Director at ASTHA (Delhi) and founder of Blooming in Pain. With over 9 years of frontline practice, research, and institutional advisory in disability rights, he brings together lived authority, early intervention, public policy, and cross-sectoral capacity building.",
  bio_p2: "His work spans designing North India's first government sensory garden (Umang Vatika at Safdarjung Hospital), advising state disaster management authorities, conducting interactive workplace DEI workshops, and writing on invisible disability.",
  bio_p3: "Rooted in rights-based frameworks and community engagement, Pratik works with corporates, non-profits, UN agencies, and educational institutions across India and globally.",
  faqs: [
    {
      id: "services",
      label: "Core Services",
      question: "What core services & consulting does Pratik offer?",
      answer: "Pratik offers 4 main pillars: (1) Interactive Training & Capacity Building for leadership and staff; (2) Institutional Advisory for disability-inclusive policies & accessibility; (3) Keynote Speaking & University Lectures on invisible disability; and (4) Research, Grant Writing & Accessible Communication.",
    },
    {
      id: "invisible-disability",
      label: "Invisible Disability",
      question: "What is invisible disability advocacy?",
      answer: "Invisible disability advocacy addresses conditions not immediately apparent visually (e.g. chronic illness, pain conditions, neurodivergence). Pratik leverages lived authority to transform institutional policies, workplace accommodations, and social perceptions beyond physical mobility frameworks.",
    },
    {
      id: "trainings",
      label: "Capacity Building",
      question: "How does Pratik conduct capacity building workshops?",
      answer: "Pratik delivers interactive, practical training across organizational levels — from C-suite leadership and HR teams to frontline community workers. Topics include disability etiquette, RPwD Act compliance, inclusive communication, and early intervention.",
    },
    {
      id: "speaking",
      label: "Keynotes & Talks",
      question: "What keynote topics does Pratik present on?",
      answer: "Pratik delivers keynotes on 'Invisible Disability & Lived Authority', 'Intersectional DEI in Practice', 'Designing Sensory & Accessible Public Spaces', and 'De-stigmatizing Chronic Conditions'. He has spoken at global conferences like ARNEC Manila and top institutions like IIT Delhi.",
    },
    {
      id: "research",
      label: "Research & Writing",
      question: "What research, policy, and grant writing work does Pratik do?",
      answer: "Pratik supports NGOs and foundations with grant proposals, donor reporting, state policy roundtables (e.g. Chhattisgarh Disability Policy), disaster risk reduction frameworks (NDMA & UN India), and accessible digital publications.",
    },
  ],
};

export async function fetchAboutSettings(): Promise<AboutSettings> {
  return fetchSetting("about", DEFAULT_ABOUT_SETTINGS);
}

export async function saveAboutSettings(settings: AboutSettings): Promise<void> {
  return saveSetting("about", settings);
}

// ── Services Page Settings ─────────────────────────────────────────────────────

export interface ServicePillarItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  photoUrl: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ServicesSettings {
  hero_title: string;
  hero_subtitle: string;
  pillars: ServicePillarItem[];
}

export const DEFAULT_SERVICES_SETTINGS: ServicesSettings = {
  hero_title: "Disability Practice & Institutional Services",
  hero_subtitle: "Tailored training, systemic advisory, keynotes, and research grounded in lived authority and 9+ years of field leadership.",
  pillars: [
    {
      id: "training",
      title: "Interactive Training & Capacity Building",
      subtitle: "For Leadership, HR Teams, Educators & Frontline Staff",
      description: "Custom workshops designed to build genuine disability awareness, legal compliance under RPwD Act 2016, inclusive communication, and workplace accommodations.",
      highlights: [
        "Corporate DEI & disability sensitization for all tiers",
        "Frontline health worker & CBR practitioner training",
        "Inclusive education & early intervention for schools",
        "Practical disability etiquette & language guidance",
      ],
      photoUrl: "/images/Pratik%20Pictures/ToT%20on%20Neuro%20developmentak%20disabilities%20for%20TMF/TMF.jpg",
      ctaLabel: "Schedule a Capacity Workshop →",
      ctaHref: "/contact?type=speaking",
    },
    {
      id: "consulting",
      title: "Consulting & Institutional Advisory",
      subtitle: "Systemic Inclusion, Universal Design & Policy Reviews",
      description: "Advising organisations on making physical spaces, HR policies, digital infrastructure, and programmes universally accessible and non-discriminatory.",
      highlights: [
        "Sensory infrastructure co-design (e.g. Umang Vatika)",
        "Disability inclusion policy & reasonable accommodation frameworks",
        "Accessibility audits & universal design reviews",
        "Programme evaluation & MEL with disability lens",
      ],
      photoUrl: "/images/Pratik%20Pictures/Sensory%20Park%20Safdarjung/DSCF6747%20(1).JPG",
      ctaLabel: "Commission Policy Advisory →",
      ctaHref: "/contact?type=consulting",
    },
    {
      id: "talks",
      title: "Keynotes & University Lectures",
      subtitle: "Challenging Conventional Disability Narratives",
      description: "Engaging, high-impact keynotes and interactive lectures grounding policy and research in lived authority and disability rights.",
      highlights: [
        "Invisible disability & lived authority keynotes",
        "University guest lectures & postgraduate interactive seminars",
        "International conference panels (Purple Fest, ARNEC Manila)",
        "Public health & media dialogue facilitation",
      ],
      photoUrl: "/images/Pratik%20Pictures/Purple%20Fest%20-%20Census%20and%20Disability%20/IMG_9575.jpeg",
      ctaLabel: "Invite Pratik to Speak →",
      ctaHref: "/contact?type=speaking",
    },
    {
      id: "research",
      title: "Research, Policy & Grant Writing",
      subtitle: "Rigorous Communications Supporting Impact & Funding",
      description: "Supporting non-profits and foundations with grant writing, donor proposals, policy briefs, research reports, and rendering organizational communication fully disability-inclusive.",
      highlights: [
        "Grant writing & donor proposal development",
        "State policy briefs & disaster risk reduction frameworks",
        "Impact assessment reports & annual reviews",
        "Accessible digital publication styling",
      ],
      photoUrl: "/images/Pratik%20Pictures/ARNEC%20Manila/image%20(8).png",
      ctaLabel: "Commission Research & Writing →",
      ctaHref: "/contact?type=consulting",
    },
  ],
};

export async function fetchServicesSettings(): Promise<ServicesSettings> {
  return fetchSetting("services", DEFAULT_SERVICES_SETTINGS);
}

export async function saveServicesSettings(settings: ServicesSettings): Promise<void> {
  return saveSetting("services", settings);
}

// ── Work Page Settings ─────────────────────────────────────────────────────────

export interface WorkEngagementItem {
  event: string;
  org: string;
  year: string;
  role: string;
  description: string;
}

export interface WorkSettings {
  hero_title: string;
  hero_subtitle: string;
  engagements: WorkEngagementItem[];
}

export const DEFAULT_WORK_SETTINGS: WorkSettings = {
  hero_title: "Engagements & Visual Archive",
  hero_subtitle: "Keynotes, policy summits, workshops, and authentic fieldwork across India and internationally.",
  engagements: [
    {
      event: "ARNEC Asia-Pacific Early Childhood Regional Conference",
      org: "ARNEC Manila",
      year: "2024",
      role: "Keynote Speaker",
      description: "Presented research paper on inclusive early intervention policies across South Asia.",
    },
    {
      event: "Delhi Purple Fest 2024",
      org: "Government of NCT Delhi",
      year: "2024",
      role: "Keynote & Panelist",
      description: "Delivered keynote address on disability data omission in census surveys and organized 27-artist exhibition.",
    },
    {
      event: "Training of Trainers on Neurodevelopmental Disabilities",
      org: "Tech Mahindra Foundation",
      year: "2023",
      role: "Lead Trainer",
      description: "Capacity building for development professionals on disability rights and early intervention.",
    },
    {
      event: "Guest Lecture Series on Invisible Disability",
      org: "Kirori Mal College, Delhi University",
      year: "2023",
      role: "Guest Lecturer",
      description: "Interactive session with postgraduate students on lived authority, chronic pain, and institutional access.",
    },
  ],
};

export async function fetchWorkSettings(): Promise<WorkSettings> {
  return fetchSetting("work", DEFAULT_WORK_SETTINGS);
}

export async function saveWorkSettings(settings: WorkSettings): Promise<void> {
  return saveSetting("work", settings);
}

// ── Contact Page Settings ──────────────────────────────────────────────────────

export interface ContactSettings {
  hero_title: string;
  hero_subtitle: string;
  recipient_email: string;
  response_time_note: string;
}

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  hero_title: "Start a Partnership",
  hero_subtitle: "Reach out to discuss training, institutional advisory, keynote invitations, or research collaborations.",
  recipient_email: "hello@bloominginpain.com",
  response_time_note: "Pratik typically responds within 2 business days.",
};

export async function fetchContactSettings(): Promise<ContactSettings> {
  return fetchSetting("contact", DEFAULT_CONTACT_SETTINGS);
}

export async function saveContactSettings(settings: ContactSettings): Promise<void> {
  return saveSetting("contact", settings);
}



