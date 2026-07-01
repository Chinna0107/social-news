// src/utils/mockData.ts

export const mockUser = {
  id: "USR-001",
  name: "Alex Rivera",
  role: "Civic Leader",
  level: "Level 12 Contributor",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  impactPoints: 14200,
  email: "alex@socialnews.org"
};

export const mockCampaigns = [
  {
    id: "CAMP-001",
    title: "Reforest the Amazon 2024",
    description: "Supporting local indigenous communities in large-scale reforestation and biodiversity conservation.",
    image: "https://picsum.photos/seed/img1/800/600",
    collected: 75000,
    goal: 100000,
    progress: 75,
    tag: "URGENT",
    participants: 1240
  },
  {
    id: "CAMP-002",
    title: "Tech Literacy for All",
    description: "Distributing 5,000 refurbished laptops to underprivileged students and providing basic tech education.",
    image: "https://picsum.photos/seed/img2/800/600",
    collected: 250000,
    goal: 550000,
    progress: 45,
    tag: "",
    participants: 3420
  },
  {
    id: "CAMP-003",
    title: "Clean Energy Initiative",
    description: "Funding the installation of solar micro-grids in off-grid rural communities to power schools and clinics.",
    image: "https://picsum.photos/seed/img3/800/600",
    collected: 1840000,
    goal: 2100000,
    progress: 88,
    tag: "",
    participants: 8100
  }
];

export const mockTasks = [
  {
    id: "TASK-001",
    title: "Impact Report Writing",
    description: "Draft the quarterly environmental impact report.",
    status: "PENDING",
    priority: "High",
    points: 150
  },
  {
    id: "TASK-002",
    title: "Local News Interview",
    description: "Interview with the local community leader about the food drive.",
    status: "IN_PROGRESS",
    priority: "Medium",
    points: 300
  },
  {
    id: "TASK-003",
    title: "Donation Drive Video",
    description: "Edit the promotional video for the upcoming donation drive.",
    status: "SUBMITTED",
    priority: "High",
    points: 450
  },
  {
    id: "TASK-004",
    title: "Youth Mentorship",
    description: "Mentor 5 students in the weekend tech camp.",
    status: "APPROVED",
    priority: "Low",
    points: 600,
    earned: true
  }
];

export const mockProducts = [
  {
    id: "PROD-001",
    name: "Artisan Linen Tote",
    price: 35.00,
    description: "Support women's cooperatives",
    image: "https://picsum.photos/seed/img4/800/600"
  },
  {
    id: "PROD-002",
    name: "Sustainable Hydration Flask",
    price: 28.00,
    description: "1 Flask = 100L Clean Water",
    image: "https://picsum.photos/seed/img5/800/600"
  },
  {
    id: "PROD-003",
    name: "Direct Trade Coffee",
    price: 18.00,
    description: "Directly Sourced from Ethiopia",
    image: "https://picsum.photos/seed/img6/800/600"
  },
  {
    id: "PROD-004",
    name: "Solar Task Lamp",
    price: 55.00,
    description: "Off-grid Power Solution",
    image: "https://picsum.photos/seed/img7/800/600"
  }
];

export const mockCertificates = [
  {
    id: "CERT-001",
    title: "Digital Advocacy Foundations",
    verifiedDate: "2024-05-12",
    verified: true
  },
  {
    id: "CERT-002",
    title: "Civic Journalism Certificate",
    verifiedDate: "2024-03-28",
    verified: true
  }
];

export const mockAdminUsers = [
  {
    id: "1",
    initials: "JD",
    name: "Jane Doe",
    email: "jane@socialnews.org",
    role: "Civic Leader",
    status: "Active",
    impactPoints: 14200
  },
  {
    id: "2",
    initials: "MK",
    name: "Marcus Knight",
    email: "m.knight@global.com",
    role: "Moderator",
    status: "Review Pending",
    impactPoints: 8920
  },
  {
    id: "3",
    initials: "SC",
    name: "Sarah Chen",
    email: "sarah@impact.io",
    role: "Volunteer",
    status: "Active",
    impactPoints: 2450
  }
];

export const mockEvents = [
  {
    id: "EVT-001",
    date: "JUN 15, 2024",
    title: "Global Civic Summit",
    description: "A 24-hour virtual marathon of workshops and keynote speeches from global leaders.",
    type: "VIRTUAL"
  },
  {
    id: "EVT-002",
    date: "JULY 22, 2024",
    title: "Social News Forum: Europe",
    description: "In-person networking event focusing on policy changes and corporate accountability in the EU.",
    type: "LONDON, UK"
  },
  {
    id: "EVT-003",
    date: "AUGUST 10, 2024",
    title: "Youth Leadership Day",
    description: "Concurrent local meetups organized by our student chapters across 400 universities worldwide.",
    type: "GLOBAL"
  }
];

export const mockStats = {
  registeredMembers: "1,248,500",
  campaignsCompleted: "42,310",
  donationsOutward: "$5.4M+",
  certificatesIssued: "15,800",
  productsSold: "32,140"
};

export const mockQuizzes = [
  {
    id: "QZ-001",
    title: "Environmental Advocacy 101",
    description: "Learn the basics of community organizing and environmental protection.",
    questions: 15,
    score: 95,
    status: "COMPLETED"
  },
  {
    id: "QZ-002",
    title: "Digital Literacy & Misinformation",
    description: "How to spot fake news and protect your digital identity.",
    questions: 20,
    score: null,
    status: "IN_PROGRESS"
  },
  {
    id: "QZ-003",
    title: "Sustainable Urban Planning",
    description: "An introduction to green cities and sustainable infrastructure.",
    questions: 10,
    score: null,
    status: "LOCKED"
  }
];

export const mockDonations = [
  {
    id: "DON-001",
    campaign: "Reforest the Amazon 2024",
    amount: 150.00,
    date: "2024-06-10",
    status: "COMPLETED"
  },
  {
    id: "DON-002",
    campaign: "Clean Energy Initiative",
    amount: 50.00,
    date: "2024-05-22",
    status: "COMPLETED"
  },
  {
    id: "DON-003",
    campaign: "Tech Literacy for All",
    amount: 25.00,
    date: "2024-04-15",
    status: "COMPLETED"
  }
];

export const mockCategories = [
  { id: "home", label: "Home", path: "/" },
  { id: "science", label: "Science", path: "/category/science" },
  { id: "ts", label: "Telangana", path: "/category/ts" },
  { id: "national", label: "National", path: "/category/national" },
  { id: "international", label: "International", path: "/category/international" },
  { id: "cinema", label: "Cinema", path: "/category/cinema" },
  { id: "sports", label: "Sports", path: "/category/sports" },
  { id: "business", label: "Business", path: "/category/business" },
];

export const advertisementCategories = [
  "Services",
  "Real Estate",
  "Hotels",
  "Hospitals",
  "Function హాల్స్",
  "Packers & Movers",
  "Travelers",
  "Job Notifications",
  "Shopping",
  "Epaper",
];

export const mockAdvertisements = [
  {
    id: "ADV-001",
    title: "Sri Sai Home Services",
    category: "Services",
    description: "Electrician, plumbing, AC repair, and home maintenance bookings across Hyderabad.",
    location: "Hyderabad",
    phone: "+91 98765 43210",
    image: "https://picsum.photos/seed/services-ad/800/600",
  },
  {
    id: "ADV-002",
    title: "Prime City Real Estate",
    category: "Real Estate",
    description: "Verified plots, apartments, rentals, and commercial properties with site visits.",
    location: "Vijayawada",
    phone: "+91 99887 76655",
    image: "https://picsum.photos/seed/real-estate-ad/800/600",
  },
  {
    id: "ADV-003",
    title: "Royal Grand Hotels",
    category: "Hotels",
    description: "Rooms, banquet dining, and family packages near major city landmarks.",
    location: "Visakhapatnam",
    phone: "+91 91234 56789",
    image: "https://picsum.photos/seed/hotel-ad/800/600",
  },
  {
    id: "ADV-004",
    title: "Care Plus Hospitals",
    category: "Hospitals",
    description: "24/7 emergency care, diagnostics, specialist appointments, and health packages.",
    location: "Secunderabad",
    phone: "+91 90000 11223",
    image: "https://picsum.photos/seed/hospital-ad/800/600",
  },
  {
    id: "ADV-005",
    title: "Srinivasa Function హాల్స్",
    category: "Function హాల్స్",
    description: "Wedding, reception, birthday, and corporate event halls with catering support.",
    location: "Guntur",
    phone: "+91 94444 55667",
    image: "https://picsum.photos/seed/function-hall-ad/800/600",
  },
  {
    id: "ADV-006",
    title: "Speed Packers & Movers",
    category: "Packers & Movers",
    description: "Local and interstate relocation, packing, loading, transport, and storage.",
    location: "Telangana & AP",
    phone: "+91 95555 12121",
    image: "https://picsum.photos/seed/packers-ad/800/600",
  },
  {
    id: "ADV-007",
    title: "Deccan Travelers",
    category: "Travelers",
    description: "Car rentals, temple tours, airport pickup, and custom travel packages.",
    location: "Telugu States",
    phone: "+91 96666 34343",
    image: "https://picsum.photos/seed/travel-ad/800/600",
  },
  {
    id: "ADV-008",
    title: "Weekly Job Notifications",
    category: "Job Notifications",
    description: "Government, private, fresher, and walk-in job alerts updated every week.",
    location: "India",
    phone: "+91 97777 45454",
    image: "https://picsum.photos/seed/jobs-ad/800/600",
  },
  {
    id: "ADV-009",
    title: "Festival Shopping Offers",
    category: "Shopping",
    description: "Fashion, electronics, home goods, and local store offers in one place.",
    location: "Online & Local",
    phone: "+91 98888 56565",
    image: "https://picsum.photos/seed/shopping-ad/800/600",
  },
  {
    id: "ADV-010",
    title: "Social Voice Epaper",
    category: "Epaper",
    description: "Read daily digital editions, archives, district pages, and special supplements.",
    location: "Digital",
    phone: "+91 99999 67676",
    image: "https://picsum.photos/seed/epaper-ad/800/600",
  },
];

export const BREAKING_NEWS_STORAGE_KEY = "social_voice_breaking_news";

export const mockBreakingNews = [
  "New satellite data helps scientists track coastal weather patterns.",
  "Sensex drops 500 points amid global market sell-off.",
  "New updates on the highly anticipated pan-India movie release date.",
  "Tech giant announces setting up a new campus in Hyderabad."
];

export const mockArticles = [
  {
    id: "ART-001",
    title: "Major Investment Announced for New IT Hub in Visakhapatnam",
    excerpt: "The state government today announced a massive investment package to develop Visakhapatnam as a premier IT destination, promising thousands of new jobs.",
    content: "Full details of the IT hub investment in Visakhapatnam...",
    category: "science",
    image: "https://picsum.photos/seed/img8/800/600",
    date: "2 hours ago",
    author: "Special Correspondent"
  },
  {
    id: "ART-002",
    title: "Hyderabad Metro Phase 3 Detailed Project Report Submitted",
    excerpt: "The detailed project report for the Phase 3 expansion of the Hyderabad Metro has been officially submitted to the central government for approval.",
    content: "Details regarding Hyderabad Metro Phase 3...",
    category: "ts",
    image: "https://picsum.photos/seed/img9/800/600",
    date: "4 hours ago",
    author: "City Bureau"
  },
  {
    id: "ART-003",
    title: "Parliament Session Begins Amid High Expectations on Budget",
    excerpt: "The monsoon session of the Parliament has commenced today with the opposition demanding a discussion on inflation and employment generation.",
    content: "National news coverage on parliament...",
    category: "national",
    image: "https://picsum.photos/seed/img10/800/600",
    date: "5 hours ago",
    author: "National Desk"
  },
  {
    id: "ART-004",
    title: "Global Tech Leaders Gather at AI Summit in Geneva",
    excerpt: "Experts from around the world convene to discuss the ethical implications and future trajectory of artificial intelligence.",
    content: "International AI summit details...",
    category: "international",
    image: "https://picsum.photos/seed/img11/800/600",
    date: "6 hours ago",
    author: "World News"
  },
  {
    id: "ART-005",
    title: "Star Actor's Latest Action Thriller Crosses ₹100 Crore Mark",
    excerpt: "The recently released action thriller has been declared a blockbuster, crossing the coveted 100 crore mark in its opening weekend.",
    content: "Cinema box office details...",
    category: "cinema",
    image: "https://picsum.photos/seed/img12/800/600",
    date: "7 hours ago",
    author: "Entertainment Desk"
  },
  {
    id: "ART-006",
    title: "National Team Secures Thrilling Victory in Final Over",
    excerpt: "In a nail-biting finish, the national cricket team secured a brilliant victory against their rivals in the T20 series decider.",
    content: "Sports match summary...",
    category: "sports",
    image: "https://picsum.photos/seed/img13/800/600",
    date: "8 hours ago",
    author: "Sports Correspondent"
  },
  {
    id: "ART-007",
    title: "Inflation Drops Marginally, RBI Holds Repo Rate",
    excerpt: "The Reserve Bank of India has decided to keep the repo rate unchanged for the third consecutive time as retail inflation shows signs of cooling.",
    content: "Business economy details...",
    category: "business",
    image: "https://picsum.photos/seed/img14/800/600",
    date: "9 hours ago",
    author: "Business Bureau"
  },
  {
    id: "ART-008",
    title: "Tirupati Brahmotsavam Preparations in Full Swing",
    excerpt: "The TTD has commenced massive arrangements for the upcoming annual Brahmotsavam, expecting millions of devotees.",
    content: "Devotional news from science...",
    category: "science",
    image: "https://picsum.photos/seed/tirupati/800/600",
    date: "10 hours ago",
    author: "Local Reporter"
  },
  { id: "ART-AP1", title: "New Lab Maps How Plants Respond to Heat Stress", excerpt: "Researchers publish findings that could help crops withstand hotter summers.", content: "Full content...", category: "science", image: "https://picsum.photos/seed/img15/800/600", date: "11 hours ago", author: "Staff" },
  { id: "ART-AP2", title: "Students Build Low-Cost Air Quality Monitor", excerpt: "The device uses affordable sensors to track pollution at street level.", content: "Full content...", category: "science", image: "https://picsum.photos/seed/img16/800/600", date: "12 hours ago", author: "Staff" },
  { id: "ART-AP3", title: "Astronomy Team Spots Rare Meteor Shower Pattern", excerpt: "Skywatchers are expected to get clear views of the event this weekend.", content: "Full content...", category: "science", image: "https://picsum.photos/seed/img17/800/600", date: "13 hours ago", author: "Staff" },

  { id: "ART-TS1", title: "Hyderabad IT Exports Cross New Record", excerpt: "Telangana reports a 20% surge in IT exports this financial year.", content: "Full content...", category: "ts", image: "https://picsum.photos/seed/img18/800/600", date: "2 hours ago", author: "Staff" },
  { id: "ART-TS2", title: "Musam River Rejuvenation Project Announced", excerpt: "State government to allocate 500 crores to clean and revitalize the river.", content: "Full content...", category: "ts", image: "https://picsum.photos/seed/musi/800/600", date: "3 hours ago", author: "Staff" },
  { id: "ART-TS3", title: "New Flyover Inaugurated in Secunderabad", excerpt: "Traffic woes expected to ease with the opening of the 3km flyover.", content: "Full content...", category: "ts", image: "https://picsum.photos/seed/img19/800/600", date: "4 hours ago", author: "Staff" },

  { id: "ART-NAT1", title: "Elections: Historic Voter Turnout Recorded", excerpt: "Citizens cast their votes in record numbers across 15 states.", content: "Full content...", category: "national", image: "https://picsum.photos/seed/img20/800/600", date: "1 hour ago", author: "Staff" },
  { id: "ART-NAT2", title: "Union Budget Focuses on Infrastructure", excerpt: "Finance Minister outlines massive spending on roads, railways, and ports.", content: "Full content...", category: "national", image: "https://picsum.photos/seed/img21/800/600", date: "2 hours ago", author: "Staff" },
  { id: "ART-NAT3", title: "ISRO Plans New Lunar Mission Launch", excerpt: "The space agency is gearing up for its next ambitious moon landing attempt.", content: "Full content...", category: "national", image: "https://picsum.photos/seed/img22/800/600", date: "3 hours ago", author: "Staff" },

  { id: "ART-INT1", title: "Global Climate Summit Concludes with Pledge", excerpt: "190 nations agree to phase down fossil fuels by 2040.", content: "Full content...", category: "international", image: "https://picsum.photos/seed/img23/800/600", date: "4 hours ago", author: "Staff" },
  { id: "ART-INT2", title: "Major Breakthrough in Quantum Computing", excerpt: "Researchers achieve new stability record in quantum state manipulation.", content: "Full content...", category: "international", image: "https://picsum.photos/seed/img24/800/600", date: "5 hours ago", author: "Staff" },
  { id: "ART-INT3", title: "European Markets Rally on Positive Data", excerpt: "Inflation cools faster than expected across the Eurozone.", content: "Full content...", category: "international", image: "https://picsum.photos/seed/img25/800/600", date: "6 hours ago", author: "Staff" },

  { id: "ART-CIN1", title: "Top Director's Pan-India Film Teaser Drops", excerpt: "Fans go wild as the first glimpse of the historical epic hits YouTube.", content: "Full content...", category: "cinema", image: "https://picsum.photos/seed/img26/800/600", date: "7 hours ago", author: "Staff" },
  { id: "ART-CIN2", title: "Veteran Actor Honored with Lifetime Award", excerpt: "A legendary career celebrated at the prestigious national film awards.", content: "Full content...", category: "cinema", image: "https://picsum.photos/seed/img27/800/600", date: "8 hours ago", author: "Staff" },
  { id: "ART-CIN3", title: "Box Office: Small Budget Indie Film is a Hit", excerpt: "The emotional drama continues to draw massive crowds in its third week.", content: "Full content...", category: "cinema", image: "https://picsum.photos/seed/img28/800/600", date: "9 hours ago", author: "Staff" },

  { id: "ART-SPT1", title: "Olympians Return Home to Grand Welcome", excerpt: "Medalists receive hero's welcome at the national airport.", content: "Full content...", category: "sports", image: "https://picsum.photos/seed/img29/800/600", date: "10 hours ago", author: "Staff" },
  { id: "ART-SPT2", title: "Tennis: Young Sensation Wins Grand Slam", excerpt: "A stunning upset in straight sets crowns a new champion.", content: "Full content...", category: "sports", image: "https://picsum.photos/seed/img30/800/600", date: "11 hours ago", author: "Staff" },
  { id: "ART-SPT3", title: "Football League Finale Ends in Penalty Shootout", excerpt: "The championship decided in a nail-biting finish under the lights.", content: "Full content...", category: "sports", image: "https://picsum.photos/seed/img31/800/600", date: "12 hours ago", author: "Staff" },

  { id: "ART-BUS1", title: "Tech Startup Reaches Unicorn Status", excerpt: "The AI-driven local logistics firm secures massive Series C funding.", content: "Full content...", category: "business", image: "https://picsum.photos/seed/img32/800/600", date: "1 hour ago", author: "Staff" },
  { id: "ART-BUS2", title: "Auto Industry Sees EV Sales Surge", excerpt: "Electric vehicles account for 30% of new car sales this quarter.", content: "Full content...", category: "business", image: "https://picsum.photos/seed/img33/800/600", date: "2 hours ago", author: "Staff" },
  { id: "ART-BUS3", title: "Gold Prices Hit New All-Time High", excerpt: "Investors flock to safe-haven assets amid global economic uncertainty.", content: "Full content...", category: "business", image: "https://picsum.photos/seed/img34/800/600", date: "3 hours ago", author: "Staff" }
];

export const getArticlesByCategory = (categoryId: string) => {
  if (categoryId === "home") return mockArticles;
  return mockArticles.filter(article => article.category === categoryId);
};

export const getArticleById = (articleId: string) => {
  return mockArticles.find(article => article.id === articleId);
};
