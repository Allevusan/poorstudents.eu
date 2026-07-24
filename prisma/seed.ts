import { PrismaClient, Category, RedemptionType } from "@prisma/client";

const prisma = new PrismaClient();

const ALL = ["ALL"];

type DealSeed = {
  merchant: {
    name: string;
    slug: string;
    websiteUrl: string;
    description: string;
    category: Category;
    availableCountries: string[];
    contactEmail: string;
  };
  deal: {
    title: string;
    description: string;
    discountLabel: string;
    category: Category;
    redemptionType: RedemptionType;
    staticCode?: string;
    redemptionUrl: string;
    terms: string;
    availableCountries: string[];
    requiresAccount: boolean;
    isFeatured?: boolean;
    expiresAt?: Date;
  };
  couponCodes?: string[];
};

const seeds: DealSeed[] = [
  {
    merchant: {
      name: "Notely",
      slug: "notely",
      websiteUrl: "https://notely.example.com",
      description:
        "Clean, fast note-taking with backlinks, flashcard export and lecture audio sync. The notes app your future self will thank you for.",
      category: "STUDY_NOTES",
      availableCountries: ALL,
      contactEmail: "partners@notely.example.com",
    },
    deal: {
      title: "Notely Pro — half price for students",
      description:
        "Full Pro plan: unlimited notebooks, audio sync, offline mode and flashcard export. 50% off for as long as you keep the subscription.",
      discountLabel: "50% OFF",
      category: "STUDY_NOTES",
      redemptionType: "STATIC_CODE",
      staticCode: "POORSTUDENT50",
      redemptionUrl: "https://notely.example.com/students",
      terms: "Valid for new Notely accounts. Discount applies while the subscription stays active. One use per person.",
      availableCountries: ALL,
      requiresAccount: false,
      isFeatured: true,
    },
  },
  {
    merchant: {
      name: "Brainwave AI",
      slug: "brainwave-ai",
      websiteUrl: "https://brainwave.example.com",
      description:
        "An AI study assistant that explains, summarises and quizzes you on your own course material. Upload slides, get understanding.",
      category: "AI_TOOLS",
      availableCountries: ALL,
      contactEmail: "edu@brainwave.example.com",
    },
    deal: {
      title: "Brainwave AI — 6 months of Plus, free",
      description:
        "Six months of Brainwave Plus: unlimited uploads, exam-mode quizzes and priority answers. Each student gets a personal activation code.",
      discountLabel: "6 MONTHS FREE",
      category: "AI_TOOLS",
      redemptionType: "UNIQUE_CODE",
      redemptionUrl: "https://brainwave.example.com/redeem",
      terms: "One personal code per student. Code must be activated within 30 days of being issued. No card required.",
      availableCountries: ALL,
      requiresAccount: true,
      isFeatured: true,
    },
    couponCodes: Array.from({ length: 25 }, (_, i) => `BRAIN-${String(1000 + i * 37)}-EU`),
  },
  {
    merchant: {
      name: "Lingopop",
      slug: "lingopop",
      websiteUrl: "https://lingopop.example.com",
      description:
        "Language learning built around short daily conversations with native-speaker audio. 12 European languages and counting.",
      category: "LANGUAGE_LEARNING",
      availableCountries: ALL,
      contactEmail: "hello@lingopop.example.com",
    },
    deal: {
      title: "Lingopop Premium — 3 months free",
      description:
        "Three months of Premium free, no card needed. All languages, offline lessons and unlimited speaking practice.",
      discountLabel: "3 MONTHS FREE",
      category: "LANGUAGE_LEARNING",
      redemptionType: "LINK_ONLY",
      redemptionUrl: "https://lingopop.example.com/students-eu",
      terms: "New accounts only. Offer applied automatically at the link. Renews at the standard student price unless cancelled.",
      availableCountries: ALL,
      requiresAccount: false,
      isFeatured: true,
    },
  },
  {
    merchant: {
      name: "Pixelform",
      slug: "pixelform",
      websiteUrl: "https://pixelform.example.com",
      description:
        "Browser-based design suite for posters, presentations and social graphics. Everything your group project needs to look intentional.",
      category: "SOFTWARE_DESIGN",
      availableCountries: ALL,
      contactEmail: "partnerships@pixelform.example.com",
    },
    deal: {
      title: "Pixelform Studio — 60% off the annual plan",
      description:
        "The full Studio plan — premium templates, brand kits, background removal — at 60% off for your entire time as a student.",
      discountLabel: "60% OFF",
      category: "SOFTWARE_DESIGN",
      redemptionType: "STATIC_CODE",
      staticCode: "PIXEL-EDU-60",
      redemptionUrl: "https://pixelform.example.com/education",
      terms: "Annual plan only. Renews at the discounted rate while the code campaign is active.",
      availableCountries: ALL,
      requiresAccount: true,
      isFeatured: true,
    },
  },
  {
    merchant: {
      name: "Codecrate",
      slug: "codecrate",
      websiteUrl: "https://codecrate.example.com",
      description:
        "Cloud dev environments that spin up in seconds. Your whole toolchain in the browser — no more 'works on my machine'.",
      category: "DEVELOPER_TOOLS",
      availableCountries: ALL,
      contactEmail: "edu@codecrate.example.com",
    },
    deal: {
      title: "Codecrate — free Pro workspace for a year",
      description:
        "12 months of the Pro tier: 4-core workspaces, unlimited private projects and live-share for pair programming.",
      discountLabel: "12 MONTHS FREE",
      category: "DEVELOPER_TOOLS",
      redemptionType: "STATIC_CODE",
      staticCode: "SHIPIT-STUDENT",
      redemptionUrl: "https://codecrate.example.com/students",
      terms: "Verify with any email at signup. One workspace per person. Fair-use compute limits apply.",
      availableCountries: ALL,
      requiresAccount: false,
      isFeatured: true,
    },
  },
  {
    merchant: {
      name: "Nimbus Drive",
      slug: "nimbus-drive",
      websiteUrl: "https://nimbusdrive.example.com",
      description:
        "European cloud storage with end-to-end encryption and servers in the EU. Your thesis deserves better than a USB stick.",
      category: "CLOUD_STORAGE",
      availableCountries: ALL,
      contactEmail: "sales@nimbusdrive.example.com",
    },
    deal: {
      title: "Nimbus Drive 2TB — €40 off the yearly plan",
      description:
        "2TB of encrypted, EU-hosted storage with automatic backup, for €40 less than everyone else pays.",
      discountLabel: "€40 OFF",
      category: "CLOUD_STORAGE",
      redemptionType: "STATIC_CODE",
      staticCode: "NIMBUS40EU",
      redemptionUrl: "https://nimbusdrive.example.com/checkout",
      terms: "Applies to the first year of the 2TB annual plan. New customers only.",
      availableCountries: ALL,
      requiresAccount: true,
      isFeatured: true,
    },
  },
  {
    merchant: {
      name: "Flashdeck",
      slug: "flashdeck",
      websiteUrl: "https://flashdeck.example.com",
      description:
        "Spaced-repetition flashcards with shared decks for thousands of university courses. Cram less, remember more.",
      category: "EXAM_PREP",
      availableCountries: ALL,
      contactEmail: "team@flashdeck.example.com",
    },
    deal: {
      title: "Flashdeck Unlimited — 40% off",
      description:
        "Unlimited decks, image occlusion and exam-countdown scheduling at 40% off, forever, on any plan.",
      discountLabel: "40% OFF",
      category: "EXAM_PREP",
      redemptionType: "STATIC_CODE",
      staticCode: "CRAM40",
      redemptionUrl: "https://flashdeck.example.com/pricing",
      terms: "Discount locked in for as long as your subscription is active.",
      availableCountries: ALL,
      requiresAccount: true,
      isFeatured: true,
    },
  },
  {
    merchant: {
      name: "Calmster",
      slug: "calmster",
      websiteUrl: "https://calmster.example.com",
      description:
        "Sleep, focus and exam-stress sessions designed with university counselling services. Because your brain is your main study tool.",
      category: "WELLBEING",
      availableCountries: ALL,
      contactEmail: "hi@calmster.example.com",
    },
    deal: {
      title: "Calmster Premium — student year for €19",
      description:
        "A full year of Premium — normally €69 — for €19. All sleep stories, focus soundscapes and the exam-season programme.",
      discountLabel: "€50 OFF",
      category: "WELLBEING",
      redemptionType: "STATIC_CODE",
      staticCode: "BREATHE19",
      redemptionUrl: "https://calmster.example.com/student",
      terms: "One student year per person. Renews at the standard price unless cancelled.",
      availableCountries: ALL,
      requiresAccount: true,
      isFeatured: true,
    },
  },
  {
    merchant: {
      name: "Plugga",
      slug: "plugga",
      websiteUrl: "https://plugga.example.com",
      description:
        "Sweden's favourite study planner: schema import from Ladok, deadline tracking and group study rooms. Built in Stockholm.",
      category: "STUDY_NOTES",
      availableCountries: ["SE"],
      contactEmail: "partner@plugga.example.com",
    },
    deal: {
      title: "Plugga Plus — free for the whole academic year",
      description:
        "Plugga Plus free until the summer: unlimited schedules, CSN payment-date widget and priority sync with Swedish university timetables.",
      discountLabel: "1 YEAR FREE",
      category: "STUDY_NOTES",
      redemptionType: "STATIC_CODE",
      staticCode: "PLUGGA-GRATIS",
      redemptionUrl: "https://plugga.example.com/studenter",
      terms: "Only redeemable on Swedish accounts. Free period runs to the end of the academic year.",
      availableCountries: ["SE"],
      requiresAccount: false,
      isFeatured: true,
    },
  },
  {
    merchant: {
      name: "Notatka",
      slug: "notatka",
      websiteUrl: "https://notatka.example.com",
      description:
        "Polish note-sharing platform with verified notes for courses at every major Polish university.",
      category: "STUDY_NOTES",
      availableCountries: ["PL"],
      contactEmail: "kontakt@notatka.example.com",
    },
    deal: {
      title: "Notatka Premium — 3 months free",
      description:
        "Three months of unlimited downloads from the verified notes library, plus ad-free browsing.",
      discountLabel: "3 MONTHS FREE",
      category: "STUDY_NOTES",
      redemptionType: "STATIC_CODE",
      staticCode: "NOTATKA3M",
      redemptionUrl: "https://notatka.example.com/studenci",
      terms: "New accounts only. Available for accounts registered in Poland.",
      availableCountries: ["PL"],
      requiresAccount: false,
    },
  },
  {
    merchant: {
      name: "Klausurfit",
      slug: "klausurfit",
      websiteUrl: "https://klausurfit.example.com",
      description:
        "Exam prep for German-speaking universities: past papers, model answers and examiner-style feedback for law, medicine and engineering.",
      category: "EXAM_PREP",
      availableCountries: ["DE", "AT"],
      contactEmail: "unis@klausurfit.example.com",
    },
    deal: {
      title: "Klausurfit — 30% off every course pack",
      description:
        "30% off all subject packs, including the Staatsexamen collections, for your whole degree.",
      discountLabel: "30% OFF",
      category: "EXAM_PREP",
      redemptionType: "STATIC_CODE",
      staticCode: "KLAUSUR30",
      redemptionUrl: "https://klausurfit.example.com/studierende",
      terms: "Valid in Germany and Austria. Applies to all one-off course pack purchases.",
      availableCountries: ["DE", "AT"],
      requiresAccount: true,
    },
  },
  {
    merchant: {
      name: "Studiebuddy",
      slug: "studiebuddy",
      websiteUrl: "https://studiebuddy.example.com",
      description:
        "Dutch study-group matching and summary marketplace, connected to course lists from every university in the Netherlands.",
      category: "STUDY_NOTES",
      availableCountries: ["NL"],
      contactEmail: "info@studiebuddy.example.com",
    },
    deal: {
      title: "Studiebuddy Pro — half price",
      description:
        "Pro membership at 50% off: unlimited summary downloads and priority matching for study groups in your programme.",
      discountLabel: "50% OFF",
      category: "STUDY_NOTES",
      redemptionType: "STATIC_CODE",
      staticCode: "BUDDY50NL",
      redemptionUrl: "https://studiebuddy.example.com/studenten",
      terms: "Available for students at Dutch institutions. Billed monthly, cancel any time.",
      availableCountries: ["NL"],
      requiresAccount: true,
    },
  },
  {
    merchant: {
      name: "Parlato",
      slug: "parlato",
      websiteUrl: "https://parlato.example.com",
      description:
        "AI conversation partner for language exams: DELF, TestDaF, DELE and more. Speak first, panic never.",
      category: "LANGUAGE_LEARNING",
      availableCountries: ALL,
      contactEmail: "ciao@parlato.example.com",
    },
    deal: {
      title: "Parlato exam pack — 45% off",
      description:
        "45% off any exam-prep track, including unlimited AI speaking sessions with examiner-style scoring.",
      discountLabel: "45% OFF",
      category: "LANGUAGE_LEARNING",
      redemptionType: "STATIC_CODE",
      staticCode: "SPREKEN45",
      redemptionUrl: "https://parlato.example.com/exams",
      terms: "One exam track per redemption. Discount valid for 12 months of access.",
      availableCountries: ALL,
      requiresAccount: true,
    },
  },
  {
    merchant: {
      name: "Citely",
      slug: "citely",
      websiteUrl: "https://citely.example.com",
      description:
        "Reference manager with an AI librarian: drop in a PDF, get a clean citation in any style, and a summary you can actually quote.",
      category: "AI_TOOLS",
      availableCountries: ALL,
      contactEmail: "library@citely.example.com",
    },
    deal: {
      title: "Citely Pro — free while you study",
      description:
        "Citely Pro free on a student email: unlimited libraries, team bibliographies and Word/Docs plugins.",
      discountLabel: "100% OFF",
      category: "AI_TOOLS",
      redemptionType: "LINK_ONLY",
      redemptionUrl: "https://citely.example.com/students",
      terms: "Free while the student programme runs. No card required.",
      availableCountries: ALL,
      requiresAccount: true,
    },
  },
  {
    merchant: {
      name: "Vektor Studio",
      slug: "vektor-studio",
      websiteUrl: "https://vektorstudio.example.com",
      description:
        "Nordic vector illustration and prototyping tool loved by design schools in Scandinavia. Precise, fast, and a little bit fanatical about grids.",
      category: "SOFTWARE_DESIGN",
      availableCountries: ["SE", "DK", "NO", "FI"],
      contactEmail: "hej@vektorstudio.example.com",
    },
    deal: {
      title: "Vektor Studio — personal licence, 70% off",
      description:
        "A personal perpetual licence at 70% off for design students in the Nordics. Each student gets an individual licence code.",
      discountLabel: "70% OFF",
      category: "SOFTWARE_DESIGN",
      redemptionType: "UNIQUE_CODE",
      redemptionUrl: "https://vektorstudio.example.com/activate",
      terms: "Nordic student offer. One personal licence per student, non-transferable.",
      availableCountries: ["SE", "DK", "NO", "FI"],
      requiresAccount: true,
    },
    couponCodes: ["VEKTOR-A7F2-2026", "VEKTOR-K9Q4-2026"],
  },
  {
    merchant: {
      name: "Shipmate",
      slug: "shipmate",
      websiteUrl: "https://shipmate.example.com",
      description:
        "One-command deploys, preview environments and a free-forever hobby tier. The fastest way to get your side project a URL.",
      category: "DEVELOPER_TOOLS",
      availableCountries: ALL,
      contactEmail: "crew@shipmate.example.com",
    },
    deal: {
      title: "Shipmate Pro — 6 months free",
      description:
        "Six months of Pro: custom domains, team seats for your project group and no cold starts.",
      discountLabel: "6 MONTHS FREE",
      category: "DEVELOPER_TOOLS",
      redemptionType: "STATIC_CODE",
      staticCode: "ANCHORS-AWEIGH",
      redemptionUrl: "https://shipmate.example.com/students",
      terms: "New Pro subscriptions only. Reverts to the free tier afterwards unless upgraded.",
      availableCountries: ALL,
      requiresAccount: true,
      expiresAt: new Date("2026-12-31T23:59:59Z"),
    },
  },
  {
    merchant: {
      name: "Boxhaven",
      slug: "boxhaven",
      websiteUrl: "https://boxhaven.example.com",
      description:
        "Simple encrypted file lockers for group projects, with links that expire when the semester does.",
      category: "CLOUD_STORAGE",
      availableCountries: ["DE", "NL", "BE"],
      contactEmail: "post@boxhaven.example.com",
    },
    deal: {
      title: "Boxhaven 500GB — first year €1/month",
      description:
        "500GB of encrypted storage for €1/month in year one. Hosted in Frankfurt, GDPR-native.",
      discountLabel: "€1/MONTH",
      category: "CLOUD_STORAGE",
      redemptionType: "STATIC_CODE",
      staticCode: "HAVEN1EUR",
      redemptionUrl: "https://boxhaven.example.com/students",
      terms: "Regional launch offer for Germany, the Netherlands and Belgium. First 12 months, then standard pricing.",
      availableCountries: ["DE", "NL", "BE"],
      requiresAccount: false,
    },
  },
  {
    merchant: {
      name: "Tenttiapu",
      slug: "tenttiapu",
      websiteUrl: "https://tenttiapu.example.com",
      description:
        "Finnish exam archive and practice platform with graded solutions from top students at Finnish universities.",
      category: "EXAM_PREP",
      availableCountries: ["FI"],
      contactEmail: "moi@tenttiapu.example.com",
    },
    deal: {
      title: "Tenttiapu Premium — 2 months free",
      description:
        "Two months of full archive access and unlimited practice exams, free before the exam period.",
      discountLabel: "2 MONTHS FREE",
      category: "EXAM_PREP",
      redemptionType: "LINK_ONLY",
      redemptionUrl: "https://tenttiapu.example.com/opiskelijat",
      terms: "Available in Finland. New accounts only.",
      availableCountries: ["FI"],
      requiresAccount: false,
    },
  },
  {
    merchant: {
      name: "Mindsprout",
      slug: "mindsprout",
      websiteUrl: "https://mindsprout.example.com",
      description:
        "Habit tracking and focus timers with a study-streak system your group chat can join. Gentle, not guilt-trippy.",
      category: "WELLBEING",
      availableCountries: ALL,
      contactEmail: "grow@mindsprout.example.com",
    },
    deal: {
      title: "Mindsprout Premium — 30% off forever",
      description:
        "30% off the Premium plan for life: group streaks, deep-focus mode and the full soundscape library.",
      discountLabel: "30% OFF",
      category: "WELLBEING",
      redemptionType: "STATIC_CODE",
      staticCode: "SPROUT30",
      redemptionUrl: "https://mindsprout.example.com/students",
      terms: "Discount stays as long as the subscription does.",
      availableCountries: ALL,
      requiresAccount: true,
    },
  },
];

const institutions: { name: string; countryCode: string; emailDomains: string[] }[] = [
  // Sweden
  { name: "KTH Royal Institute of Technology", countryCode: "SE", emailDomains: ["kth.se"] },
  { name: "Lund University", countryCode: "SE", emailDomains: ["lu.se"] },
  { name: "Uppsala University", countryCode: "SE", emailDomains: ["uu.se"] },
  { name: "Stockholm University", countryCode: "SE", emailDomains: ["su.se"] },
  { name: "Chalmers University of Technology", countryCode: "SE", emailDomains: ["chalmers.se"] },
  { name: "University of Gothenburg", countryCode: "SE", emailDomains: ["gu.se"] },
  { name: "Linköping University", countryCode: "SE", emailDomains: ["liu.se"] },
  // Denmark
  { name: "University of Copenhagen", countryCode: "DK", emailDomains: ["ku.dk"] },
  { name: "Technical University of Denmark", countryCode: "DK", emailDomains: ["dtu.dk"] },
  { name: "Aarhus University", countryCode: "DK", emailDomains: ["au.dk"] },
  { name: "Aalborg University", countryCode: "DK", emailDomains: ["aau.dk"] },
  { name: "Copenhagen Business School", countryCode: "DK", emailDomains: ["cbs.dk"] },
  // Norway
  { name: "University of Oslo", countryCode: "NO", emailDomains: ["uio.no"] },
  { name: "Norwegian University of Science and Technology", countryCode: "NO", emailDomains: ["ntnu.no"] },
  { name: "University of Bergen", countryCode: "NO", emailDomains: ["uib.no"] },
  { name: "Oslo Metropolitan University", countryCode: "NO", emailDomains: ["oslomet.no"] },
  // Finland
  { name: "University of Helsinki", countryCode: "FI", emailDomains: ["helsinki.fi"] },
  { name: "Aalto University", countryCode: "FI", emailDomains: ["aalto.fi"] },
  { name: "University of Turku", countryCode: "FI", emailDomains: ["utu.fi"] },
  { name: "Tampere University", countryCode: "FI", emailDomains: ["tuni.fi"] },
  { name: "University of Jyväskylä", countryCode: "FI", emailDomains: ["jyu.fi"] },
  // Netherlands
  { name: "University of Amsterdam", countryCode: "NL", emailDomains: ["uva.nl"] },
  { name: "Delft University of Technology", countryCode: "NL", emailDomains: ["tudelft.nl"] },
  { name: "Utrecht University", countryCode: "NL", emailDomains: ["uu.nl"] },
  { name: "Leiden University", countryCode: "NL", emailDomains: ["leidenuniv.nl"] },
  { name: "University of Groningen", countryCode: "NL", emailDomains: ["rug.nl"] },
  { name: "Eindhoven University of Technology", countryCode: "NL", emailDomains: ["tue.nl"] },
  { name: "Erasmus University Rotterdam", countryCode: "NL", emailDomains: ["eur.nl"] },
  // Germany
  { name: "Technical University of Munich", countryCode: "DE", emailDomains: ["tum.de", "mytum.de"] },
  { name: "Ludwig Maximilian University of Munich", countryCode: "DE", emailDomains: ["lmu.de"] },
  { name: "Heidelberg University", countryCode: "DE", emailDomains: ["uni-heidelberg.de"] },
  { name: "Humboldt University of Berlin", countryCode: "DE", emailDomains: ["hu-berlin.de"] },
  { name: "Free University of Berlin", countryCode: "DE", emailDomains: ["fu-berlin.de"] },
  { name: "Technical University of Berlin", countryCode: "DE", emailDomains: ["tu-berlin.de"] },
  { name: "RWTH Aachen University", countryCode: "DE", emailDomains: ["rwth-aachen.de"] },
  { name: "Karlsruhe Institute of Technology", countryCode: "DE", emailDomains: ["kit.edu"] },
  { name: "University of Hamburg", countryCode: "DE", emailDomains: ["uni-hamburg.de"] },
  { name: "University of Cologne", countryCode: "DE", emailDomains: ["uni-koeln.de"] },
  // Poland
  { name: "University of Warsaw", countryCode: "PL", emailDomains: ["uw.edu.pl"] },
  { name: "Warsaw University of Technology", countryCode: "PL", emailDomains: ["pw.edu.pl"] },
  { name: "Jagiellonian University", countryCode: "PL", emailDomains: ["uj.edu.pl"] },
  { name: "AGH University of Krakow", countryCode: "PL", emailDomains: ["agh.edu.pl"] },
  { name: "University of Wrocław", countryCode: "PL", emailDomains: ["uwr.edu.pl"] },
  { name: "Adam Mickiewicz University in Poznań", countryCode: "PL", emailDomains: ["amu.edu.pl"] },
];

async function main() {
  for (const inst of institutions) {
    const existing = await prisma.institution.findFirst({
      where: { name: inst.name },
    });
    if (existing) {
      await prisma.institution.update({ where: { id: existing.id }, data: inst });
    } else {
      await prisma.institution.create({ data: inst });
    }
  }
  console.log(`Seeded ${institutions.length} institutions`);

  for (const s of seeds) {
    const merchant = await prisma.merchant.upsert({
      where: { slug: s.merchant.slug },
      create: s.merchant,
      update: s.merchant,
    });

    let deal = await prisma.deal.findFirst({
      where: { merchantId: merchant.id, title: s.deal.title },
    });
    if (deal) {
      deal = await prisma.deal.update({
        where: { id: deal.id },
        data: { ...s.deal, merchantId: merchant.id },
      });
    } else {
      deal = await prisma.deal.create({
        data: { ...s.deal, merchantId: merchant.id },
      });
    }

    if (s.couponCodes) {
      for (const code of s.couponCodes) {
        await prisma.couponCode.upsert({
          where: { dealId_code: { dealId: deal.id, code } },
          create: { dealId: deal.id, code },
          update: {},
        });
      }
    }
  }
  console.log(`Seeded ${seeds.length} merchants and deals`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
