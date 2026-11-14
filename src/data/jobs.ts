export interface SampleJob {
  id: string;
  title: { en: string; am: string };
  employerType: { en: string; am: string };
  city: { en: string; am: string };
  remote: boolean;
  offeredAccommodations: string[];
  summary: { en: string; am: string };
}

export const SAMPLE_JOBS: SampleJob[] = [
  {
    id: "job-data-clerk",
    title: { en: "Junior data clerk (Sample)", am: "ጀማሪ የዳታ ባለሙያ (ናሙና)" },
    employerType: { en: "Logistics company", am: "የሎጂስቲክስ ኩባንያ" },
    city: { en: "Addis Ababa", am: "አዲስ አበባ" },
    remote: false,
    offeredAccommodations: ["screen_reader", "extra_time", "flexible_hours"],
    summary: {
      en: "Enter delivery records using screen-reader-tested spreadsheets, with extra time on practical assessments.",
      am: "በስክሪን አንባቢ በተፈተሸ ሰንጠረዥ የማድረስ መረጃዎችን መመዝገብ፣ ለፈተና ተጨማሪ ጊዜ ይሰጣል።",
    },
  },
  {
    id: "job-support-agent",
    title: { en: "Customer support agent (Sample)", am: "የደንበኞች ድጋፍ ወኪል (ናሙና)" },
    employerType: { en: "Telecom services", am: "የቴሌኮም አገልግሎት" },
    city: { en: "Remote", am: "በርቀት" },
    remote: true,
    offeredAccommodations: ["screen_reader", "remote_option", "quiet_room"],
    summary: {
      en: "Answer customer questions by chat and phone in Amharic from home or a quiet office booth.",
      am: "ከቤት ወይም ጸጥ ካለ ክፍል በአማርኛ የደንበኞችን ጥያቄ በጽሑፍና በስልክ መመለስ።",
    },
  },
  {
    id: "job-tailor-assistant",
    title: { en: "Workshop tailoring assistant (Sample)", am: "የልብስ ስፌት ረዳት (ናሙና)" },
    employerType: { en: "Garment cooperative", am: "የልብስ ስፌት ህብረት ስራ" },
    city: { en: "Addis Ababa (Bole)", am: "አዲስ አበባ (ቦሌ)" },
    remote: false,
    offeredAccommodations: ["step_free", "sign_language", "flexible_hours"],
    summary: {
      en: "Ground-floor workshop with step-free entry and sign language interpretation during weekly team briefings.",
      am: "ደረጃ የሌለው የምድር ወለል መስሪያ ቦታ እና በሳምንታዊ ስብሰባዎች የምልክት ቋንቋ አስተርጓሚ ያለው።",
    },
  },
  {
    id: "job-inventory-aide",
    title: { en: "Shop inventory & bookkeeping aide (Sample)", am: "የሱቅ ንብረትና ሂሳብ ረዳት (ናሙና)" },
    employerType: { en: "Retail shop", am: "የችርቻሮ ሱቅ" },
    city: { en: "Adama", am: "አዳማ" },
    remote: false,
    offeredAccommodations: ["large_print", "extra_time", "step_free"],
    summary: {
      en: "Track daily stock and sales receipts using large-print checklists and untimed counting tasks.",
      am: "ትልቅ ጽሑፍ ባላቸው ዝርዝሮች እና ያለ ጊዜ ገደብ የእለት እቃና ሽያጭ መመዝገብ።",
    },
  },
  {
    id: "job-community-tutor",
    title: { en: "Digital literacy peer mentor (Sample)", am: "የዲጂታል ክህሎት አጋዥ (ናሙና)" },
    employerType: { en: "Community training centre", am: "የማህበረሰብ ስልጠና ማዕከል" },
    city: { en: "Addis Ababa (Lideta)", am: "አዲስ አበባ (ልደታ)" },
    remote: false,
    offeredAccommodations: ["screen_reader", "step_free", "sign_language", "large_print"],
    summary: {
      en: "Help new learners practise basic smartphone tasks. Accessible lab equipped for blind and Deaf learners.",
      am: "አዲስ ተማሪዎች መሰረታዊ የስልክ አጠቃቀምን እንዲለማመዱ መርዳት። ለዓይነ ስውራንና መስማት ለተሳናቸው የተመቻቸ ማዕከል።",
    },
  },
  {
    id: "job-content-reviewer",
    title: { en: "Amharic audio reviewer (Sample)", am: "የአማርኛ ድምፅ ገምጋሚ (ናሙና)" },
    employerType: { en: "Media & education studio", am: "የሚዲያና ትምህርት ስቱዲዮ" },
    city: { en: "Remote", am: "በርቀት" },
    remote: true,
    offeredAccommodations: ["remote_option", "extra_time", "quiet_room", "flexible_hours"],
    summary: {
      en: "Listen to short educational clips and verify Amharic captions on your own schedule.",
      am: "አጫጭር የትምህርት ቅጂዎችን በመስማት የአማርኛ ጽሑፎችን በራስዎ ሰዓት ማረጋገጥ።",
    },
  },
];
