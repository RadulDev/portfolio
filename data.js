/* =========================================================================
   PORTFOLIO CONTENT — edit only this file.
   Fields marked optional can be deleted or left as empty strings/arrays.
   ========================================================================= */

window.PORTFOLIO = {
  meta: {
    title: "Radul R Dev — Computational Biologist",
    description:
      "Radul R Dev is a computational biologist in Kerala, India, working on omics data science, structural bioinformatics and drug discovery, with a background in full-stack development.",
  },

  person: {
    name: "Radul R Dev",
    headline: "Computational biologist",
    location: "Kerala, India",
    status: "Open to computational biology roles", // optional
    intro:
      "I turn large biological datasets into answers researchers can use. My work spans proteomics, genomics and structure-based drug discovery, and I build the software and web platforms that make that analysis repeatable.",
    about: [
      "I started in plant biology, with a BSc in Botany, and moved into computational biology for my master's at Kannur University. Since then I have worked on data-driven biology at two research centres: CSIR-Institute of Genomics and Integrative Biology in New Delhi, and the Centre for Integrative Omics Data Science at Yenepoya, where I am now a Senior Data Scientist.",
      "My research sits where omics meets drug discovery. I analyse proteomics and genomics datasets, and I use docking, molecular dynamics and machine-learning QSAR to find candidate inhibitors. That work has fed into ten publications on targets in hepatocellular carcinoma, glioma, lymphoma, breast cancer, tuberculosis, Staphylococcus aureus and Hendra virus.",
      "Before research I built websites for local businesses, and I hold certifications in full-stack development and blockchain. That engineering background is why my analysis tends to end up as a tool, a pipeline or a web platform that other people can run.",
      "I am looking for a computational biologist role where I can keep growing in omics and drug discovery and contribute to innovative biological research."
    ],
    photo: "", // optional, e.g. "assets/photo.jpg"
    resume: "", // optional, e.g. "assets/Radul_R_Dev_CV.pdf"
    email: "radulrdev@gmail.com",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/radul-r-dev" },
      { label: "GitHub", url: "https://github.com/RadulDev" }
    ]
  },

  highlights: [
    { value: "3+", label: "years in omics research" },
    { value: "10", label: "publications" },
    { value: "11", label: "certifications" }
  ],

  // Most recent first. "end" can be "Present".
  experience: [
    {
      role: "Senior Data Scientist",
      company: "Centre for Integrative Omics Data Science, Yenepoya (Deemed to be University)",
      type: "Full-time",
      location: "Mangaluru, Karnataka",
      start: "Aug 2025",
      end: "Present",
      summary: "Omics data science for the centre's research programmes.",
      points: [],
      stack: ["Proteomics", "Drug discovery"]
    },
    {
      role: "Project Associate",
      company: "CSIR-Institute of Genomics & Integrative Biology",
      type: "",
      location: "New Delhi",
      start: "Mar 2024",
      end: "May 2025",
      summary: "Data and platform work for a breast cancer genome project.",
      points: [
        "Analysed and managed the project's genomic data.",
        "Developed and maintained the project's web platform."
      ],
      stack: ["Genomics", "Web development"]
    },
    {
      role: "Data Scientist",
      company: "Centre for Integrative Omics Data Science, Yenepoya (Deemed to be University)",
      type: "",
      location: "Mangaluru, Karnataka",
      start: "Aug 2023",
      end: "Feb 2024",
      summary: "Omics analysis and computational drug discovery.",
      points: [
        "Analysed omics datasets and turned them into insights for researchers.",
        "Identified candidate drugs computationally and carried out structural studies.",
        "Screened compounds for structural and physico-chemical druggability.",
        "Automated retrieval and processing of AlphaFold PDB files and mapped radial distances between sites of interest, with Python visualisations."
      ],
      stack: ["AlphaFold", "Schrödinger", "PyMOL", "Python"]
    },
    {
      role: "Project Trainee",
      company: "CSIR-Institute of Genomics & Integrative Biology",
      type: "Traineeship",
      location: "New Delhi",
      start: "Oct 2022",
      end: "Feb 2023",
      summary: "Immunopeptidomics research.",
      points: ["Identified immunopeptides computationally and analysed their associated functions."],
      stack: ["Immunopeptidomics"]
    },
    {
      role: "Data Entry Operator",
      company: "National Health Mission, Government of Kerala",
      type: "",
      location: "Kannur, Kerala",
      start: "Sep 2020",
      end: "Feb 2021",
      summary: "COVID-19 surveillance support for the district.",
      points: [
        "Analysed COVID-19 patient population data and produced reports for the district surveillance and health worker teams.",
        "Wrote news articles and public awareness content."
      ],
      stack: ["Data analysis", "Reporting"]
    },
    {
      role: "Web Developer & Digital Marketing Trainee",
      company: "Extreme Media",
      type: "",
      location: "Thiruvananthapuram, Kerala",
      start: "Oct 2019",
      end: "Apr 2020",
      summary: "Websites and brand building for local businesses.",
      points: [
        "Built and managed websites for local businesses.",
        "Created brands and promoted them on social media.",
        "Optimised pages for search to improve Google rankings and traffic."
      ],
      stack: ["HTML", "CSS", "JavaScript", "SEO"]
    }
  ],

  // Fallback list. On page load the site also fetches your ORCID record and
  // adds any new works it finds there (matched by DOI), so new papers appear
  // automatically once they are on ORCID. Set orcid to "" to turn that off.
  orcid: "0009-0001-9587-7053",
  scholar: "https://scholar.google.com/citations?user=lLcZzW8AAAAJ&hl=en",
  highlightAuthor: ["Radul R Dev", "Radul R. Dev", "Dev RR"], // bolded in author lists

  publications: [
    {
      title: "Computational identification of potential allosteric inhibitor of FtsZ to overcome PC190723 and TXA707 resistance in Staphylococcus aureus",
      authors: "Fathimath Henna, Varun T K, Radul R Dev, Bristow Ben Joseph, Anjana C Lalu, Rajesh Raju, Abhithaj J",
      venue: "Frontiers in Drug Discovery (accepted)",
      date: "2026",
      doi: "",
      url: "https://www.frontiersin.org/journals/drug-discovery"
    },
    {
      title: "Phosphoproteomics data-driven integrative analysis of autophosphorylation sites in the human kinome",
      authors: "Athira Perunelly Gopalakrishnan, Mahammad Nisar, Alimath Sambreena, Radul R. Dev, Prashant Kumar Modi, et al.",
      venue: "International Journal of Molecular Sciences 27, 6745",
      date: "Jul 2026",
      doi: "10.3390/ijms27156745"
    },
    {
      title: "Computational QSAR and structure-based identification of plerixafor-derived PIM-1 kinase inhibitors in diffuse large B-cell lymphoma",
      authors: "Amritha Thaikkad, B. Angitha, Radul R. Dev, Bristow Ben Joseph, Rajesh Raju, Abhithaj Jayanandan",
      venue: "Frontiers in Chemistry",
      date: "2026",
      doi: "10.3389/fchem.2026.1798835"
    },
    {
      title: "Targeting KasA: isosakuranetin derivatives as promising scaffolds for novel anti-tuberculosis agents against drug-resistant Mycobacterium tuberculosis",
      authors: "B. Angitha, T. Amritha, Radul R. Dev, Rajesh Raju, C. V. Umesh, J. Abhithaj",
      venue: "Frontiers in Bioinformatics",
      date: "2026",
      doi: "10.3389/fbinf.2026.1777858"
    },
    {
      title: "Structure-based and AI-assisted identification of AGPS inhibitors for glioma via integrated docking, molecular dynamics, and binding affinity screening",
      authors: "Amritha Thaikkad, Leona Dcunha, Naveen Joy, Radul R Dev, Rajesh Raju, Abhithaj Jayanandan, et al.",
      venue: "ACS Omega 11(11)",
      date: "2026",
      doi: "",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13019191/"
    },
    {
      title: "Machine learning-based QSAR and molecular modeling of phytocompounds in Barleria buxifolia L. as a potential aldose reductase inhibitor",
      authors: "Radul R Dev, Anjana C Lalu, Sinana Zarin, Bristow Ben Joseph, Rajesh Raju, Abhithaj Jayanandan, Sangeeth Thekkan",
      venue: "Frontiers in Bioinformatics",
      date: "2026",
      doi: "10.3389/fbinf.2026.1766339",
      note: "First author"
    },
    {
      title: "Repurposing FDA-approved drugs as Hendra virus RNA-dependent RNA polymerase inhibitors: a comprehensive computational drug discovery approach",
      authors: "Anjana C. Lalu, Varun Thachan Kundil, Bristow Ben Joseph, Radul R. Dev, Amritha Thaikkad, Suhail Subair, Rajesh Raju, Abhithaj Jayanandan",
      venue: "Viruses 17(12), 1613",
      date: "Dec 2025",
      doi: "10.3390/v17121613"
    },
    {
      title: "BC-Predict Database: a curated resource of experimentally validated markers in multidrug resistance in breast cancer",
      authors: "Sakshi Sanjay Parate, Rahad Rehas, Gupta Soyam, et al., Radul R Dev, et al.",
      venue: "bioRxiv (preprint)",
      date: "Oct 2025",
      doi: "10.1101/2025.10.09.681460"
    },
    {
      title: "Targeting AFP-RARβ complex formation: a potential strategy for treating AFP-positive hepatocellular carcinoma",
      authors: "Bhavya Banjan, Riya Vishwakarma, Krishnapriya Ramakrishnan, Radul R. Dev, Haritha Kalath, Pankaj Kumar, Sowmya Soman, Rajesh Raju, Amjesh Revikumar, Niyas Rehman, Chandran S Abhinand",
      venue: "Molecular Diversity",
      date: "Jul 2024",
      doi: "10.1007/s11030-024-10915-8"
    },
    {
      title: "Etiologically significant microRNAs in hepatitis B virus-induced hepatocellular carcinoma",
      authors: "Krishnapriya Ramakrishnan, Riya Vishwakarma, Radul R Dev, Rajesh Raju, Niyas Rehman",
      venue: "OMICS: A Journal of Integrative Biology",
      date: "May 2024",
      doi: "10.1089/omi.2024.007"
    }
  ],

  // Interactive panels in the Research section. "visual" picks the animation:
  // "spectrum" (mass spec), "molecule" (ligand in pocket), "genome" (coverage track).
  research: [
    {
      visual: "molecule",
      title: "Structure-based drug discovery",
      text: "Docking, molecular dynamics, binding-affinity screening and machine-learning QSAR to find inhibitors for cancer, tuberculosis, bacterial and viral targets."
    },
    {
      visual: "spectrum",
      title: "Proteomics and phosphoproteomics",
      text: "Mass-spectrometry data analysis, from protein quantification to phosphosite and kinome-level interpretation."
    },
    {
      visual: "genome",
      title: "Genomics and data platforms",
      text: "Analysing and managing genome project data, and building the web platforms researchers use to explore it."
    }
  ],

  projects: [
    {
      name: "AlphaFold site-distance mapping",
      year: "2023",
      tagline: "Automated structure retrieval and radial distance maps between sites of interest.",
      details:
        "Python tooling built at Yenepoya that queries AlphaFold, downloads and processes the PDB files, measures radial distances between residues or sites of interest and plots them.",
      stack: ["Python", "AlphaFold", "PDB"],
      links: []
    },
    {
      name: "Breast cancer genome project platform",
      year: "2024",
      tagline: "Web platform for a CSIR-IGIB genome project.",
      details:
        "Developed and maintained the project's web platform, alongside analysing and managing the project's data.",
      stack: ["Web development", "Genomics"],
      links: []
    },
    {
      name: "Molecular dynamics of HIV-1 protease",
      year: "",
      tagline: "MD simulation to study the enzyme's structure.",
      details:
        "Set up and ran a molecular dynamics simulation of HIV-1 protease in GROMACS to study its structure, with analysis plots in Xmgrace and Matplotlib.",
      stack: ["GROMACS", "Linux", "Python", "Jupyter"],
      links: [{ label: "Source on GitHub", url: "https://github.com/RadulDev/gromacs" }]
    },
    {
      name: "Clustering London and Paris neighbourhoods",
      year: "2020",
      tagline: "Machine learning to help tourists pick where to stay.",
      details:
        "IBM Data Science capstone that clusters the neighbourhoods of London and Paris by what each offers, so a visitor can choose areas that match the experience they want. Results are mapped with Folium.",
      stack: ["Python", "Pandas", "scikit-learn", "Folium", "IBM Watson"],
      links: [{ label: "Source on GitHub", url: "https://github.com/RadulDev/IBM-CAPSTONE-FINAL-PROJECT" }]
    }
  ],

  skills: [
    { group: "Omics & bioinformatics", items: ["Proteomics", "Genomics", "RNA-seq pipelines", "Metagenomics pipelines", "Scanpy & AnnData", "Kraken2", "Samtools", "Galaxy"] },
    { group: "Structure & drug discovery", items: ["Computer-aided drug design", "Molecular dynamics", "GROMACS", "Schrödinger", "PyMOL", "VMD", "AlphaFold"] },
    { group: "Programming", items: ["Python", "R", "JavaScript", "SQL & NoSQL", "Shell scripting"] },
    { group: "Data science & ML", items: ["scikit-learn", "TensorFlow", "Pandas", "Streamlit", "Jupyter"] },
    { group: "Infrastructure", items: ["Linux", "HPC & Slurm", "AWS", "Docker", "Conda"] },
    { group: "Web", items: ["Node.js", "Flask", "Full-stack development", "Postman", "SEO"] }
  ],

  education: [
    { school: "Kannur University", degree: "MSc, Computational Biology", start: "", end: "", note: "" },
    { school: "Kannur University", degree: "BSc, Botany", start: "2013", end: "2016", note: "" },
    { school: "Jawahar Navodaya Vidyalaya", degree: "Schooling", start: "2006", end: "2013", note: "" }
  ],

  certifications: [
    { name: "Artificial Intelligence & Computational Imaging in Healthcare", issuer: "CSIR-Central Scientific Instruments Organisation", date: "2023", url: "" },
    { name: "Computer Aided Drug Designing and Molecular Dynamics Simulations (CAMDS)", issuer: "NIT Rourkela", date: "2022", url: "" },
    { name: "Schrödinger Hands-on Training Workshop on CADD", issuer: "GENESYS, NIT Rourkela", date: "2022", url: "" },
    { name: "IBM Data Science Professional Certificate", issuer: "Coursera", date: "2020", url: "" },
    { name: "Certified Skill Diploma in Digital Marketing", issuer: "Jain (Deemed-to-be University)", date: "2020", url: "" },
    { name: "Certified Blockchain Associate", issuer: "Kerala Blockchain Academy", date: "2019", url: "" },
    { name: "Full Stack Developer Course", issuer: "ICT Academy of Kerala", date: "2018", url: "" },
    { name: "Google IT Support Professional Certificate", issuer: "Google", date: "", url: "" },
    { name: "Data Science Foundations, Level 1", issuer: "", date: "", url: "" },
    { name: "Become a Software Developer", issuer: "LinkedIn Learning", date: "", url: "" },
    { name: "Become a Data Analyst", issuer: "LinkedIn Learning", date: "", url: "" }
  ],

  languages: [
    { name: "English", level: "Full professional proficiency" },
    { name: "Malayalam", level: "Native or bilingual" },
    { name: "Hindi", level: "Native or bilingual" }
  ],

  recommendations: []
};
