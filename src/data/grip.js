// GRIP case study content.
//
// Photographs live in public/Pictures/grip/. Any gallery slot left with a null
// `src` falls back to a clearly-labelled placeholder rather than a stock image.
//
// Content rule for this page: it describes a TEAM project and a PROPOSED
// programme design. No revenue figures, contracts, funding secured, customers
// or performance results are stated anywhere, because none were executed.

export const grip = {
  name: "GRIP",
  fullName: "Gas Reliability & Integration Programme",
  tagline:
    "Turning Nigeria's underutilised gas resources into reliable energy and industrial value.",
  categories: ["Energy Systems", "Gas Monetisation", "Infrastructure", "Digital Transformation"],
  badge: "1st Place - NEITC Challenge 2026",

  heroImage: "Pictures/grip/team-champions-trophy.jpg",

  meta: [
    { label: "Role", value: "Project Development & Commercial Strategy" },
    { label: "Format", value: "Team project" },
    { label: "Year", value: "2026" },
    { label: "Sector", value: "Energy / Oil & Gas" }
  ],

  sections: [
    { id: "overview", label: "Overview" },
    { id: "challenge", label: "Challenge" },
    { id: "solution", label: "Solution" },
    { id: "contribution", label: "My Contribution" },
    { id: "architecture", label: "Architecture" },
    { id: "commercial", label: "Commercial Model" },
    { id: "roadmap", label: "Roadmap" },
    { id: "risk", label: "Risk" },
    { id: "achievement", label: "Achievement" },
    { id: "gallery", label: "Gallery" },
    { id: "lessons", label: "Lessons" }
  ],

  overview:
    "GRIP is an integrated gas monetisation and infrastructure programme our team developed to improve Nigeria's domestic gas reliability by connecting gas processing, pipeline integrity, digital coordination and downstream gas utilisation into a single coordinated solution.",

  challenge: {
    lede: "Nigeria possesses significant natural gas resources, yet reliability across the domestic gas value chain remains constrained. The constraints are not isolated - they compound along the chain.",
    chain: [
      {
        stage: "Upstream",
        constraints: [
          {
            title: "Gas processing & monetisation",
            body: "Associated and stranded gas volumes sit outside the reach of fixed processing capacity."
          }
        ]
      },
      {
        stage: "Midstream",
        constraints: [
          {
            title: "Pipeline integrity",
            body: "Inspection and maintenance data is not consolidated into a reliability picture."
          },
          {
            title: "Infrastructure reliability",
            body: "Unplanned downtime propagates through every commitment downstream of it."
          }
        ]
      },
      {
        stage: "Coordination",
        constraints: [
          {
            title: "Gas supply coordination",
            body: "Operators, offtakers and regulators work from fragmented operational data."
          },
          {
            title: "Commercial alignment",
            body: "Supply commitments and demand are negotiated without a shared view of either."
          }
        ]
      },
      {
        stage: "Downstream",
        constraints: [
          {
            title: "Access to project finance",
            body: "Bankability suffers where offtake and risk allocation are unresolved."
          },
          {
            title: "Supply-to-demand connection",
            body: "Processed gas is not reliably matched to the domestic demand that needs it."
          }
        ]
      }
    ]
  },

  solution: {
    heading: "An Integrated Gas Reliability Framework",
    lede: "Our team developed GRIP as one programme connecting four components that are normally scoped, financed and operated separately.",
    components: [
      {
        code: "01",
        abbr: "MGPUs",
        title: "Modular Gas Processing Units",
        body: "Modular infrastructure for capturing and processing associated and stranded gas, preparing it for productive utilisation.",
        icon: "fa-solid fa-industry"
      },
      {
        code: "02",
        abbr: "PIMS",
        title: "Pipeline Integrity Management System",
        body: "Uses inspection, SCADA, pressure, flow and maintenance data to improve pipeline reliability and enable predictive maintenance.",
        icon: "fa-solid fa-wave-square"
      },
      {
        code: "03",
        abbr: "GIP-Connect",
        title: "Digital Gas Coordination Platform",
        body: "A digital coordination layer for gas allocation, monitoring, nominations, data management and operational visibility.",
        icon: "fa-solid fa-diagram-project"
      },
      {
        code: "04",
        abbr: "Utilisation",
        title: "Domestic Gas Utilisation",
        body: "Connecting processed gas to reliable domestic demand across power and industry.",
        icon: "fa-solid fa-plug-circle-bolt",
        offtakers: [
          "Power generation",
          "Cement",
          "Fertiliser",
          "Manufacturing",
          "CNG/LNG mobility",
          "Other industrial users"
        ]
      }
    ]
  },

  contribution: {
    role: "Project Development & Commercial Strategy",
    lede: "GRIP was a team project. The areas below are where my own work sat within it - what I contributed to, rather than what the team as a whole produced.",
    areas: [
      {
        id: "commercial",
        title: "Commercial & Financial Strategy",
        icon: "fa-solid fa-chart-line",
        items: [
          "Contributed to the project's commercial model",
          "Worked on DCF analysis",
          "Contributed to NPV, IRR, payback and investment-case analysis",
          "Worked on CAPEX/OPEX assumptions",
          "Contributed to market sizing and TAM/SAM/SOM analysis"
        ]
      },
      {
        id: "funding",
        title: "Funding Strategy",
        icon: "fa-solid fa-scale-balanced",
        intro: "Contributed to the blended-finance framework, covering the roles of:",
        items: [
          "Government and regulators",
          "NNPC/IOC JVs",
          "NSIA",
          "Development Finance Institutions",
          "Private infrastructure investors",
          "Carbon-finance participants",
          "Long-term gas offtakers"
        ]
      },
      {
        id: "strategy",
        title: "Project Strategy",
        icon: "fa-solid fa-compass-drafting",
        items: [
          "Contributed to the implementation roadmap",
          "Developed stakeholder and governance considerations",
          "Worked on risk identification and mitigation",
          "Helped connect the technical solution to a commercially viable deployment strategy"
        ]
      },
      {
        id: "defence",
        title: "Pitch & Defence",
        icon: "fa-solid fa-microphone-lines",
        items: [
          "Participated in technical and commercial presentation of the project",
          "Defended assumptions and responded to questions from industry judges",
          "Incorporated feedback from judges into the project"
        ]
      }
    ]
  },

  architecture: {
    lede: "The proposed system, from gas source to domestic offtaker.",
    flow: [
      { title: "Gas Source", note: "Associated and stranded gas" },
      { title: "Gas Capture / Monetisation", note: "Volumes brought into scope" },
      { title: "MGPUs", note: "Modular processing", highlight: true },
      { title: "Processed Gas", note: "Specification gas" },
      { title: "Pipeline / Transportation Infrastructure", note: "Network transport" },
      { title: "PIMS + SCADA + Predictive Analytics", note: "Integrity and reliability layer", highlight: true },
      { title: "GIP-Connect", note: "Digital coordination layer", highlight: true },
      { title: "Gas Allocation & Coordination", note: "Nominations and allocation" },
      { title: "Domestic Offtakers", note: "Contracted demand" }
    ],
    branches: [
      { title: "Electricity Generation", icon: "fa-solid fa-bolt" },
      { title: "Industrial Users", icon: "fa-solid fa-warehouse" }
    ]
  },

  commercial: {
    heading: "From Engineering Concept to Investable Business",
    lede: "Our team designed GRIP not only as an engineering solution but as a commercially structured infrastructure programme.",
    pillars: [
      { title: "Gas monetisation", body: "Volumes that currently generate no value are brought into a revenue-generating chain." },
      { title: "Long-term offtake agreements", body: "Contracted demand underwrites the revenue line rather than relying on spot exposure." },
      { title: "Blended finance", body: "Each participant carries the portion of risk it is best placed to hold." },
      { title: "Phased CAPEX deployment", body: "Capital is released against proven delivery rather than committed up front." },
      { title: "Diversified domestic demand", body: "Power, cement, fertiliser, manufacturing and mobility spread offtake concentration." },
      { title: "Risk mitigation", body: "Identified risks carry owners, triggers and mitigations rather than sitting in a register." },
      {
        title: "Carbon finance",
        body: "Treated as an additional revenue stream that improves returns - not as the basis of project viability.",
        caveat: true
      }
    ],
    equation: {
      inputs: [
        "Technical Feasibility",
        "Market Demand",
        "Commercial Structure",
        "Project Finance",
        "Risk Management"
      ],
      output: "Investable Infrastructure"
    },
    disclaimer:
      "Carbon finance is treated as an upside revenue stream. The programme's viability was not built on it."
  },

  roadmap: {
    lede: "The project team's proposed implementation roadmap. This is a plan produced for the competition, not an executed project timeline.",
    phases: [
      {
        name: "Mobilisation",
        window: "M0-3",
        items: ["Establish PMO", "SCADA audit", "GIP-Connect scope"]
      },
      {
        name: "Phase 1 - Foundation",
        window: "M3-12",
        items: ["ILI baseline", "SCADA implementation", "OML 17 pilot MGPU", "GIP-Connect pilot"]
      },
      {
        name: "Phase 2 - Expansion",
        window: "M12-24",
        items: ["Additional MGPUs", "GIP-Connect rollout", "LNG deployment at selected sites"]
      },
      {
        name: "Phase 3 - Optimisation",
        window: "M24-36",
        items: [
          "Predictive maintenance",
          "Further LNG deployment",
          "Regulatory/market integration",
          "Green financing opportunities"
        ]
      }
    ]
  },

  risk: {
    lede: "Risks the team identified, and the control principle applied to each.",
    principle: ["Identify", "Monitor", "Escalate", "Correct"],
    risks: [
      { name: "Community / Right-of-Way", category: "Social" },
      { name: "Financing / DFI drawdown", category: "Financial" },
      { name: "Regulatory uncertainty", category: "Regulatory" },
      { name: "Digital adoption", category: "Operational" },
      { name: "Cybersecurity", category: "Digital" },
      { name: "Leadership succession", category: "Governance" },
      { name: "Green financing", category: "Financial" },
      { name: "Technical reliability", category: "Technical" }
    ]
  },

  competition: {
    heading: "From Concept to Competition Winner",
    journey: [
      { step: "Idea", icon: "fa-regular fa-lightbulb" },
      { step: "Technical Development", icon: "fa-solid fa-gears" },
      { step: "Commercial Modelling", icon: "fa-solid fa-chart-line" },
      { step: "Pitch", icon: "fa-solid fa-microphone-lines" },
      { step: "Judging & Defence", icon: "fa-solid fa-gavel" },
      { step: "1st Place", icon: "fa-solid fa-trophy", win: true }
    ],
    award: {
      place: "1st Place",
      event: "NEITC Challenge",
      org: "SPE Nigeria Young Professionals",
      year: "2026",
      description:
        "Recognised for developing and defending an integrated, commercially viable gas infrastructure solution focused on gas monetisation, energy security, industrialisation and sustainable gas utilisation."
    },
    followUp:
      "The project was subsequently recognised through the NCDMB Technology/Innovation Challenge."
  },

  gallery: [
    {
      id: "team-group-stage",
      src: "Pictures/grip/team-group-stage.jpg",
      caption: "The team on stage after the result"
    },
    {
      id: "team-champions-trophy",
      src: "Pictures/grip/team-champions-trophy.jpg",
      caption: "With the NEITC 2026 trophy"
    },
    {
      id: "medal-presentation",
      src: "Pictures/grip/medal-presentation.jpg",
      caption: "Medal presentation"
    },
    {
      id: "award-handshake",
      src: "Pictures/grip/award-handshake.jpg",
      caption: "Receiving the award from the organisers"
    },
    {
      id: "team-presentation",
      src: "Pictures/grip/team-presentation.jpg",
      caption: "Presenting GRIP to the room"
    },
    {
      id: "grand-finale-lineup",
      src: "Pictures/grip/grand-finale-lineup.jpg",
      caption: "Finalists at the grand finale"
    },
    {
      id: "first-prize-cheque",
      src: "Pictures/grip/first-prize-cheque.jpg",
      caption: "Receiving the first-prize cheque"
    }
  ],

  lessons: [
    { title: "Translating engineering problems into commercial opportunities", icon: "fa-solid fa-arrow-right-arrow-left" },
    { title: "Project finance and investment analysis", icon: "fa-solid fa-building-columns" },
    { title: "DCF-based decision making", icon: "fa-solid fa-calculator" },
    { title: "Gas infrastructure strategy", icon: "fa-solid fa-diagram-project" },
    { title: "Stakeholder management", icon: "fa-solid fa-people-group" },
    { title: "Risk and sensitivity analysis", icon: "fa-solid fa-triangle-exclamation" },
    { title: "Defending technical assumptions", icon: "fa-solid fa-shield-halved" },
    { title: "Working effectively in a multidisciplinary team", icon: "fa-solid fa-users-gear" },
    { title: "Communicating complex engineering ideas to non-technical decision makers", icon: "fa-solid fa-comments" }
  ],

  outcome: {
    statement: "Built as a team. Defended under pressure. Recognised by industry.",
    role: "Project Development & Commercial Strategy"
  },

  cta: {
    question: "Interested in how I approach complex engineering and energy problems?"
  }
};
