// GeoPredict AI case study content.
//
// Accuracy rule for this page: no customer names, accuracy figures, performance
// statistics, partnerships, datasets or revenue appear anywhere, because none
// were supplied. Only two hard facts are stated - 1st place in the NCDMB
// Technology Innovation Challenge 2026, and a TRL 7 assessment within that
// programme. Add nothing here that has not been verified.
//
// `platformUrl` is null until there is a real link. The hero's "View Platform"
// button only renders once it is set - it is never pointed at a placeholder.

export const geopredict = {
  name: "GeoPredict AI",
  company: "GeoPredict Technologies",
  tagline: "AI-Powered Subsurface Intelligence for Faster Well Interpretation",
  lede: "Turning well-log data into actionable subsurface intelligence.",
  description:
    "GeoPredict AI is an indigenous AI-powered subsurface intelligence platform that analyses well-log data to accelerate lithology classification and reservoir interval screening, helping petroleum professionals interpret wells faster and make better-informed decisions.",

  platformUrl: null,

  categories: ["Petroleum Engineering", "Machine Learning", "Energy Technology", "Enterprise Software"],
  badge: "1st Place - NCDMB Technology Innovation Challenge 2026",

  meta: [
    { label: "Role", value: "Co-Founder & Petroleum Technology Lead" },
    { label: "Venture", value: "GeoPredict Technologies" },
    { label: "Year", value: "2026" },
    { label: "Readiness", value: "TRL 7" }
  ],

  sections: [
    { id: "overview", label: "Overview" },
    { id: "problem", label: "Problem" },
    { id: "solution", label: "Solution" },
    { id: "built", label: "What We Built" },
    { id: "how", label: "How It Works" },
    { id: "tech", label: "Technology" },
    { id: "role", label: "My Role" },
    { id: "validation", label: "Validation" },
    { id: "impact", label: "Impact" },
    { id: "next", label: "Roadmap" },
    { id: "lessons", label: "Lessons" }
  ],

  problem: {
    heading: "The Subsurface Data Bottleneck",
    lede: "Oil and gas companies generate large volumes of well-log data, but turning those raw measurements into useful subsurface interpretation requires specialised expertise, software and significant time.",
    cards: [
      {
        key: "TIME",
        icon: "fa-regular fa-clock",
        body: "Manual interpretation can be time-consuming."
      },
      {
        key: "COST",
        icon: "fa-solid fa-coins",
        body: "Access to specialised interpretation workflows can be expensive, particularly for smaller operators."
      },
      {
        key: "DATA UNDERUTILISATION",
        icon: "fa-solid fa-database",
        body: "Valuable well data can remain underused because interpreting every well is resource-intensive."
      }
    ],
    pullQuote: "The data already exists. The challenge is turning it into intelligence quickly."
  },

  solution: {
    heading: "Meet GeoPredict AI",
    workflow: ["Upload", "Analyse", "Interpret", "Review", "Decide"],
    pipeline: [
      { step: "Well-log Data", note: "Raw measurements in", icon: "fa-solid fa-file-waveform" },
      { step: "AI Processing", note: "Model inference", icon: "fa-solid fa-microchip", key: true },
      { step: "Lithology Classification", note: "Rock types predicted", icon: "fa-solid fa-layer-group", key: true },
      { step: "Confidence Scoring", note: "Certainty attached", icon: "fa-solid fa-gauge-high" },
      { step: "Reservoir Interval Screening", note: "Intervals flagged", icon: "fa-solid fa-magnifying-glass-chart" },
      { step: "Engineer Review", note: "Human decision", icon: "fa-solid fa-user-check", human: true }
    ],
    callout:
      "AI handles the repetitive first-pass interpretation. Engineers remain in control of the technical decision."
  },

  built: {
    heading: "What We Built",
    features: [
      {
        title: "Lithology Classification",
        body: "AI-assisted classification of subsurface rock types from well-log data.",
        icon: "fa-solid fa-layer-group"
      },
      {
        title: "Confidence Scores",
        body: "Every prediction includes an indication of model confidence to support human review.",
        icon: "fa-solid fa-gauge-high"
      },
      {
        title: "Reservoir Interval Screening",
        body: "Highlights intervals that warrant further technical evaluation.",
        icon: "fa-solid fa-magnifying-glass-chart"
      },
      {
        title: "Interactive Visualization",
        body: "Allows users to examine AI predictions alongside well-log information.",
        icon: "fa-solid fa-chart-column"
      },
      {
        title: "AI Assistant",
        body: "Enables engineers to interact with completed interpretation results using natural language.",
        icon: "fa-solid fa-comments"
      },
      {
        title: "Secure Deployment",
        body: "Designed to support self-hosted/on-premises deployment for organisations with strict subsurface data governance requirements.",
        icon: "fa-solid fa-shield-halved"
      }
    ]
  },

  how: {
    heading: "From Well Logs to Subsurface Intelligence",
    lede: "The interpretation pipeline, end to end. Model architecture is deliberately not detailed here.",
    flow: [
      { title: "Raw Well Logs", note: "Measurements as recorded" },
      { title: "Data Quality Control & Preprocessing", note: "Cleaning and conditioning" },
      { title: "Feature Engineering", note: "Log responses shaped into model inputs" },
      { title: "Machine Learning Model", note: "Trained classifier", highlight: true },
      { title: "Lithology Prediction", note: "Rock type per interval", highlight: true },
      { title: "Confidence Assessment", note: "How certain the model is" },
      { title: "Reservoir Screening", note: "Intervals worth a closer look" },
      { title: "Petroleum Engineer Review", note: "Interpretation signed off by a human", highlight: true }
    ],
    explainer:
      "Well logs arrive with gaps, noise and inconsistent scales, so the first stage is quality control rather than modelling. Conditioned curves are turned into features that reflect how petroleum professionals actually read log responses, and a supervised model classifies lithology from them. Each prediction carries a confidence indication, which is what makes the output reviewable rather than a black box: intervals the model is unsure about are exactly the ones an engineer should look at first."
  },

  tech: {
    heading: "Technology",
    lede: "The stack behind the platform.",
    stack: [
      { category: "Machine Learning", items: ["Python", "Scikit-learn", "Machine Learning"], icon: "fa-solid fa-brain" },
      { category: "Data Processing", items: ["Pandas", "NumPy"], icon: "fa-solid fa-table" },
      { category: "Visualisation", items: ["Matplotlib", "Interactive Data Visualisation"], icon: "fa-solid fa-chart-line" },
      { category: "AI", items: ["Natural Language Interface", "Self-hosted AI models"], icon: "fa-solid fa-robot" },
      { category: "Application", items: ["Web-based platform", "API-ready architecture"], icon: "fa-solid fa-window-maximize" },
      { category: "Deployment", items: ["Cloud", "On-premises enterprise deployment"], icon: "fa-solid fa-server" }
    ]
  },

  role: {
    heading: "My Role - Co-Founder & Petroleum Technology Lead",
    body: "As Co-Founder and Petroleum Technology Lead, I contributed the petroleum engineering and subsurface domain expertise behind GeoPredict AI. My responsibilities included translating petroleum workflows into machine-learning requirements, defining relevant well-log and subsurface parameters, supporting model validation, shaping the product around real industry workflows, and engaging with industry stakeholders to validate the commercial and technical direction of the platform.",
    disciplines: ["Petroleum Engineering", "Machine Learning", "Software Engineering", "Energy Technology"],
    arc: [
      { step: "Identified the industry problem", note: "From inside petroleum engineering practice" },
      { step: "Translated it into an AI problem", note: "Workflows expressed as model requirements" },
      { step: "Worked with the technical team", note: "Domain input through build and iteration" },
      { step: "Supported build and validation", note: "Parameters defined, outputs checked" },
      { step: "Engaged industry stakeholders", note: "Technical and commercial validation" },
      { step: "Won a national innovation challenge", note: "NCDMB 2026", win: true },
      { step: "Moving toward commercialisation", note: "Operator pilots and partnerships" }
    ]
  },

  validation: {
    heading: "From Prototype to National Recognition",
    award: {
      place: "1st Place",
      event: "NCDMB Technology Innovation Challenge",
      year: "2026",
      description:
        "GeoPredict AI emerged as the overall winner of the NCDMB Technology Innovation Challenge 2026, a national programme focused on advancing indigenous technology and innovation in Nigeria's energy and oil & gas sector."
    },
    points: [
      {
        title: "Technology Readiness",
        body: "Assessed at TRL 7 within the NCDMB programme.",
        icon: "fa-solid fa-gauge-high"
      },
      {
        title: "Industry Engagement",
        body: "Engagement with petroleum professionals, operators and energy-sector stakeholders for technical and commercial validation.",
        icon: "fa-solid fa-handshake"
      },
      {
        title: "Pilot Development",
        body: "Progress toward operator pilot deployment and industry partnerships.",
        icon: "fa-solid fa-flask"
      }
    ]
  },

  impact: {
    heading: "Why It Matters",
    areas: [
      {
        title: "Faster Interpretation",
        body: "Reduce the time required for first-pass subsurface analysis.",
        icon: "fa-solid fa-bolt"
      },
      {
        title: "Lower Interpretation Barriers",
        body: "Make AI-assisted interpretation more accessible to operators with limited subsurface resources.",
        icon: "fa-solid fa-door-open"
      },
      {
        title: "Nigerian Content",
        body: "Build indigenous capability in petroleum technology and AI.",
        icon: "fa-solid fa-seedling"
      },
      {
        title: "Data-Driven Decisions",
        body: "Help technical teams extract more value from existing well data.",
        icon: "fa-solid fa-chart-simple"
      }
    ]
  },

  next: {
    heading: "The Road Ahead",
    lede: "GeoPredict AI is being developed toward a broader subsurface platform rather than remaining a lithology classification tool.",
    stages: [
      { when: "Today", title: "AI-assisted well-log interpretation" },
      { when: "Next", title: "Expanded formation evaluation and subsurface interpretation workflows" },
      { when: "Future", title: "Integrated AI-powered subsurface intelligence platform" }
    ]
  },

  lessons: {
    heading: "What Building GeoPredict AI Taught Me",
    quote:
      "Building GeoPredict AI taught me that solving an engineering problem with AI is only the beginning. The technology has to fit into an existing workflow, earn the trust of technical professionals, demonstrate measurable value and ultimately make commercial sense.",
    items: [
      {
        title: "Engineering + AI",
        body: "Domain expertise is essential when applying AI to complex technical problems.",
        icon: "fa-solid fa-diagram-project"
      },
      {
        title: "Build for the User",
        body: "Technical capability means little if it doesn't fit the user's workflow.",
        icon: "fa-solid fa-user-gear"
      },
      {
        title: "Technology to Business",
        body: "A successful innovation must move beyond the model and solve a commercially meaningful problem.",
        icon: "fa-solid fa-arrow-trend-up"
      }
    ]
  },

  cta: {
    heading: "Interested in the technology?",
    body: "I'm interested in collaborating with petroleum companies, technology organisations, researchers and energy-sector partners working at the intersection of AI and subsurface engineering."
  }
};
