// lib/syllabus.ts

// Structure: grade → subject → chapters[]
export const SYLLABUS: Record<number, Record<string, string[]>> = {
7: {
  Maths: [
    "Integers",
    "Fractions and Decimals",
    "Data Handling",
    "Simple Equations",
    "Lines and Angles",
    "The Triangle and its Properties",
    "Congruence of Triangles",
    "Comparing Quantities",
    "Rational Numbers",
    "Practical Geometry",
    "Perimeter and Area",
    "Algebraic Expressions",
    "Exponents and Powers",
    "Symmetry",
    "Visualising Solid Shapes",
  ],

  Physics: [
    "Heat",
    "Electric Current and its Effects",
    "Motion and Time",
    "Light",
  ],

  Chemistry: [
    "Acids, Bases and Salts",
    "Physical and Chemical Changes",
  ],

  Biology: [
    "Nutrition in Plants",
    "Nutrition in Animals",
    "Respiration in Organisms",
    "Transportation in Animals and Plants",
    "Reproduction in Plants",
    "Forests: Our Lifeline",
    "Wastewater Story",
  ],
},



  
  8: {
  Maths: [
    "Rational Numbers",
    "Linear Equations in One Variable",
    "Understanding Quadrilaterals",
    "Practical Geometry",
    "Data Handling",
    "Squares and Square Roots",
    "Cubes and Cube Roots",
    "Comparing Quantities",
    "Algebraic Expressions and Identities",
    "Mensuration",
    "Exponents and Powers",
    "Direct and Inverse Proportions",
    "Factorisation",
    "Introduction to Graphs",
    "Playing with Numbers",
  ],

  Physics: [
    "Force and Pressure",
    "Friction",
    "Sound",
    "Light",
    "Electric Current and Circuits",
    "Some Natural Phenomena",
    "Stars and the Solar System",
  ],

  Chemistry: [
    "Synthetic Fibres and Plastics",
    "Metals and Non-metals",
    "Coal and Petroleum",
    "Combustion and Flame",
  ],

  Biology: [
    "Crop Production and Management",
    "Microorganisms: Friend and Foe",
    "Conservation of Plants and Animals",
    "Reaching the Age of Adolescence",
    "Cell – Structure and Functions",
    "Reproduction in Animals",
  ],
},

  // You can gradually add 7, 9, 10, 11, 12 later like this:
 9: {
  Maths: [
    "Number Systems",
    "Polynomials",
    "Coordinate Geometry",
    "Linear Equations in Two Variables",
    "Introduction to Euclid’s Geometry",
    "Lines and Angles",
    "Triangles",
    "Quadrilaterals",
    "Areas of Parallelograms and Triangles",
    "Circles",
    "Constructions",
    "Heron’s Formula",
    "Surface Areas and Volumes",
    "Statistics",
    "Probability",
  ],

  Physics: [
    "Motion",
    "Force and Laws of Motion",
    "Work and Energy",
    "Sound",
  ],

  Chemistry: [
    "Matter in Our Surroundings",
    "Is Matter Around Us Pure?",
    "Atoms and Molecules",
    "Structure of the Atom",
  ],

  Biology: [
    "The Fundamental Unit of Life",
    "Tissues",
    "Diversity in Living Organisms",
    "Why Do We Fall Ill?",
    "Natural Resources",
    "Improvement in Food Resources",
  ],
},

  10: {
  Maths: [
    "Real Numbers",
    "Polynomials",
    "Pair of Linear Equations in Two Variables",
    "Quadratic Equations",
    "Arithmetic Progressions",
    "Triangles",
    "Coordinate Geometry",
    "Introduction to Trigonometry",
    "Applications of Trigonometry",
    "Circles",
    "Constructions",
    "Areas Related to Circles",
    "Surface Areas and Volumes",
    "Statistics",
    "Probability",
  ],

  Physics: [
    "Light – Reflection and Refraction",
    "The Human Eye and the Colourful World",
    "Electricity",
    "Magnetic Effects of Electric Current",
    "Sources of Energy",
  ],

  Chemistry: [
    "Chemical Reactions and Equations",
    "Acids, Bases and Salts",
    "Metals and Non-metals",
    "Carbon and Its Compounds",
    "Periodic Classification of Elements",
  ],

  Biology: [
    "Life Processes",
    "Control and Coordination",
    "How Do Organisms Reproduce?",
    "Heredity and Evolution",
    "Our Environment",
    "Management of Natural Resources",
  ],
},
11: {
  Maths: [
    "Sets",
    "Relations and Functions",
    "Trigonometric Functions",
    "Principle of Mathematical Induction",
    "Complex Numbers and Quadratic Equations",
    "Linear Inequalities",
    "Permutations and Combinations",
    "Binomial Theorem",
    "Sequences and Series",
    "Straight Lines",
    "Conic Sections",
    "Introduction to 3D Geometry",
    "Limits and Derivatives",
    "Mathematical Reasoning",
    "Statistics",
    "Probability",
  ],

  Physics: [
    "Physical World",
    "Units and Measurement",
    "Motion in a Straight Line",
    "Motion in a Plane",
    "Laws of Motion",
    "Work, Energy and Power",
    "System of Particles and Rotational Motion",
    "Gravitation",
    "Mechanical Properties of Solids",
    "Mechanical Properties of Fluids",
    "Thermal Properties of Matter",
    "Thermodynamics",
    "Kinetic Theory",
    "Oscillations",
    "Waves",
  ],

  Chemistry: [
    "Some Basic Concepts of Chemistry",
    "Structure of Atom",
    "Classification of Elements and Periodicity",
    "Chemical Bonding",
    "States of Matter",
    "Thermodynamics",
    "Equilibrium",
    "Redox Reactions",
    "Organic Chemistry – Basic Principles",
    "Hydrocarbons",
    "Environmental Chemistry",
  ],

  Biology: [
    "The Living World",
    "Biological Classification",
    "Plant Kingdom",
    "Animal Kingdom",
    "Morphology of Flowering Plants",
    "Anatomy of Flowering Plants",
    "Structural Organisation in Animals",
    "Cell: Structure and Function",
    "Biomolecules",
    "Cell Cycle and Cell Division",
    "Transport in Plants",
    "Mineral Nutrition",
    "Photosynthesis in Higher Plants",
    "Respiration in Plants",
    "Plant Growth and Development",
    "Digestion and Absorption",
    "Breathing and Exchange of Gases",
    "Body Fluids and Circulation",
    "Excretory Products and Their Elimination",
    "Locomotion and Movement",
    "Neural Control and Coordination",
    "Chemical Coordination and Integration",
  ],
},
12: {
  Maths: [
    "Relations and Functions",
    "Inverse Trigonometric Functions",
    "Matrices",
    "Determinants",
    "Continuity and Differentiability",
    "Applications of Derivatives",
    "Integrals",
    "Applications of Integrals",
    "Differential Equations",
    "Vector Algebra",
    "Three-dimensional Geometry",
    "Linear Programming",
    "Probability"
  ],
},


   Physics: [
    // ELECTROSTATICS
    "Electric Charges and Their Properties",
    "Coulomb’s Law and Superposition Principle",
    "Electric Field and Field Lines",
    "Electric Flux and Gauss’s Theorem (and its Applications)",
    "Electric Potential and Potential Difference",
    "Equipotential Surfaces",
    "Relation Between Electric Field and Potential",
    "Electric Potential Energy of a System of Charges",
    "Capacitors and Capacitance",
    "Series and Parallel Combination of Capacitors",
    "Energy Stored in a Capacitor",
    "Dielectrics and Polarisation",

    // CURRENT ELECTRICITY
    "Electric Current and Drift Velocity",
    "Ohm’s Law and Electrical Resistance",
    "Resistivity and Conductivity",
    "Temperature Dependence of Resistance",
    "Combination of Resistors – Series and Parallel",
    "Internal Resistance of Cell, EMF and Terminal Potential Difference",
    "Cells in Series and Parallel",
    "Wheatstone Bridge and Meter Bridge",
    "Kirchhoff’s Laws and Simple Circuits",
    "Potentiometer and Its Applications",

    // MAGNETIC EFFECTS OF CURRENT AND MAGNETISM
    "Magnetic Field due to a Current-Carrying Conductor",
    "Biot–Savart Law and Its Applications",
    "Magnetic Field on Axis of a Circular Loop",
    "Force on a Moving Charge in a Magnetic Field",
    "Force on a Current-Carrying Conductor",
    "Torque on a Current Loop in a Magnetic Field",
    "Moving Coil Galvanometer – Construction and Working",
    "Conversion of Galvanometer to Ammeter and Voltmeter",
    "Bar Magnet as an Equivalent Solenoid",
    "Magnetic Field Lines of a Bar Magnet",
    "Earth’s Magnetic Field – Elements and Their Values",
    "Magnetic Properties of Materials (Diamagnetic, Paramagnetic, Ferromagnetic)",

    // ELECTROMAGNETIC INDUCTION AND ALTERNATING CURRENTS
    "Faraday’s Laws of Electromagnetic Induction",
    "Lenz’s Law and Conservation of Energy",
    "Self and Mutual Inductance",
    "AC Generator – Principle and Working",
    "Alternating Current and Its Representation",
    "Peak and RMS Values of AC",
    "Reactance and Impedance",
    "LCR Series Circuit – Phasor Diagrams and Resonance",
    "Power in AC Circuits and Power Factor",
    "Transformers – Principle and Uses",

    // ELECTROMAGNETIC WAVES
    "Displacement Current and Maxwell’s Correction",
    "Electromagnetic Waves and Their Characteristics",
    "Electromagnetic Spectrum – Regions and Uses",

    // RAY OPTICS AND OPTICAL INSTRUMENTS
    "Reflection of Light by Spherical Mirrors",
    "Refraction at Plane and Spherical Surfaces",
    "Total Internal Reflection and Its Applications",
    "Lens Formula and Magnification",
    "Combination of Thin Lenses in Contact",
    "Power of a Lens",
    "Refraction through Prism",
    "Human Eye and Its Defects (Myopia, Hypermetropia, Presbyopia, Astigmatism)",
    "Microscope and Astronomical Telescope – Ray Diagrams and Magnifying Power",

    // WAVE OPTICS
    "Huygens’ Principle and Wavefront",
    "Interference of Light – Young’s Double Slit Experiment",
    "Coherent Sources and Fringe Width",
    "Diffraction of Light (Single Slit Qualitative Idea)",
    "Polarisation of Light",
    "Uses of Polarised Light",

    // DUAL NATURE OF RADIATION AND MATTER
    "Photoelectric Effect – Experimental Study and Laws",
    "Einstein’s Photoelectric Equation and Work Function",
    "Particle Nature of Light",
    "Wave–Particle Duality of Matter",
    "De Broglie Wavelength",

    // ATOMS AND NUCLEI
    "Rutherford’s Nuclear Model of Atom",
    "Bohr’s Model of Hydrogen Atom",
    "Energy Levels and Spectral Series",
    "Atomic Spectra of Hydrogen",
    "Composition of Nucleus (Protons and Neutrons)",
    "Mass Defect and Binding Energy",
    "Nuclear Fission and Nuclear Fusion",
    "Radioactivity – Alpha, Beta, Gamma Decay (Basic Idea)",

    // SEMICONDUCTOR ELECTRONICS
    "Energy Bands in Solids – Conductor, Insulator and Semiconductor",
    "Intrinsic and Extrinsic Semiconductors",
    "p-type and n-type Semiconductors",
    "p–n Junction Diode and Its Characteristics",
    "Diode as a Rectifier (Half-wave and Full-wave)",
    "Zener Diode and Voltage Regulation (Basic Idea)",
    "Logic Gates – OR, AND, NOT, NAND, NOR (Truth Tables and Simple Circuits)",
  ],

  Chemistry: [
    // SOLID STATE
    "Crystalline and Amorphous Solids",
    "Unit Cell and Crystal Lattices",
    "Packing in Solids and Voids",
    "Number of Atoms per Unit Cell in Simple, bcc and fcc Structures",
    "Imperfections in Solids",
    "Electrical and Magnetic Properties of Solids",

    // SOLUTIONS
    "Types of Solutions and Concentration Terms",
    "Solubility and Factors Affecting It",
    "Vapour Pressure of Solutions and Raoult’s Law",
    "Ideal and Non-Ideal Solutions",
    "Colligative Properties – Relative Lowering of Vapour Pressure",
    "Elevation of Boiling Point and Depression of Freezing Point",
    "Osmotic Pressure and Its Applications",
    "Abnormal Molar Mass and Van’t Hoff Factor",

    // ELECTROCHEMISTRY
    "Redox Reactions and Electrochemical Cells",
    "Galvanic Cells and EMF of Cell",
    "Nernst Equation and Its Applications",
    "Electrochemical Series and Its Use",
    "Conductance of Electrolytic Solutions",
    "Molar Conductivity and Its Variation with Concentration",
    "Electrolysis and Faraday’s Laws",
    "Batteries and Fuel Cells (Basic Idea)",

    // CHEMICAL KINETICS
    "Rate of a Chemical Reaction",
    "Factors Affecting Rate of Reaction",
    "Rate Law and Order of Reaction",
    "Integrated Rate Equations for Zero and First Order Reactions",
    "Half-life of a Reaction",
    "Collision Theory (Elementary Idea)",
    "Activation Energy and Arrhenius Equation",

    // SURFACE CHEMISTRY
    "Adsorption – Types and Characteristics",
    "Freundlich Adsorption Isotherm (Empirical)",
    "Catalysis – Homogeneous and Heterogeneous",
    "Colloids – Types and Properties",
    "Emulsions and Applications of Colloids",

    // GENERAL PRINCIPLES AND PROCESSES OF ISOLATION OF ELEMENTS
    "Occurrence of Metals and Ores",
    "Concentration of Ores",
    "Extraction of Crude Metal – Pyrometallurgy, Hydrometallurgy and Electrometallurgy (Basic Steps)",
    "Thermodynamic Principles in Metallurgy (Ellingham Diagram – Idea Level)",
    "Refining of Metals – Distillation, Liquation, Electrolytic Refining",
    "Uses of Important Metals",

    // p-BLOCK ELEMENTS (GROUP 15, 16, 17 & 18 – MAIN HIGHLIGHTS)
    "Group 15 Elements – Nitrogen and Phosphorus – Properties and Important Compounds",
    "Group 16 Elements – Oxygen and Sulfur – Properties and Important Compounds",
    "Group 17 Elements – Halogens – Properties and Hydrogen Halides",
    "Group 18 Elements – Noble Gases – General Characteristics and Uses",

    // d- AND f-BLOCK ELEMENTS
    "General Characteristics of Transition Elements (d-block)",
    "Electronic Configuration, Variable Oxidation States, Catalytic Properties",
    "Formation of Coloured Ions and Complexes",
    "Inner Transition Elements (f-block) – Lanthanoids – Brief Overview",
    "Important Compounds and Their Uses",

    // COORDINATION COMPOUNDS
    "Coordination Number and Ligands",
    "Writing IUPAC Names of Coordination Compounds",
    "Isomerism in Coordination Compounds",
    "Bonding – Valence Bond Theory (Basic Idea)",
    "Importance and Applications of Coordination Compounds",

    // HALOALKANES AND HALOARENES
    "Nomenclature and Classification of Haloalkanes and Haloarenes",
    "Nature of C–X Bond and Reactivity",
    "Substitution and Elimination Reactions of Haloalkanes",
    "Uses and Environmental Effects of Some Halo Compounds",

    // ALCOHOLS, PHENOLS AND ETHERS
    "Classification and Nomenclature of Alcohols, Phenols and Ethers",
    "Methods of Preparation and Properties of Alcohols",
    "Methods of Preparation and Properties of Phenols",
    "Ethers – Preparation and Reactions",
    "Uses of Alcohols, Phenols and Ethers",

    // ALDEHYDES, KETONES AND CARBOXYLIC ACIDS
    "Nomenclature and Structure of Carbonyl Compounds",
    "Preparation and Properties of Aldehydes and Ketones",
    "Nucleophilic Addition Reactions",
    "Oxidation and Reduction Reactions",
    "Carboxylic Acids – Preparation and Properties",
    "Acid Strength and Factors Affecting It",

    // NITROGEN-CONTAINING ORGANIC COMPOUNDS
    "Amines – Classification and Nomenclature",
    "Basicity of Amines",
    "Preparation and Properties of Amines",
    "Diazonium Salts – Preparation and Synthetic Importance",

    // BIOMOLECULES, POLYMERS & CHEMISTRY IN EVERYDAY LIFE
    "Carbohydrates – Classification and Properties",
    "Proteins – Primary, Secondary and Tertiary Structure (Idea)",
    "Vitamins and Enzymes – Basic Ideas",
    "Nucleic Acids – DNA and RNA (Elementary Idea)",
    "Polymers – Types, Examples and Uses",
    "Drugs – Analgesics, Antacids, Antihistamines, Antimicrobials",
    "Cleansing Agents – Soaps and Detergents",
  ],
  Biology: [
    // REPRODUCTION
    "Reproduction in Organisms – Asexual and Sexual Reproduction",
    "Sexual Reproduction in Flowering Plants – Structures and Processes",
    "Double Fertilisation and Seed Formation",
    "Human Reproduction – Male and Female Reproductive Systems",
    "Gametogenesis, Menstrual Cycle and Fertilisation",
    "Reproductive Health – Birth Control Methods and STDs",

    // GENETICS AND EVOLUTION
    "Principles of Inheritance – Mendel’s Laws",
    "Monohybrid and Dihybrid Crosses",
    "Chromosomal Basis of Inheritance",
    "Linkage and Crossing Over (Basic Idea)",
    "Mutations and Genetic Disorders (Simple Overview)",
    "Molecular Basis of Inheritance – DNA Structure and Replication",
    "Transcription and Translation (Protein Synthesis)",
    "Genetic Code and Regulation of Gene Expression",
    "Human Genome and DNA Fingerprinting (Elementary Idea)",
    "Origin of Life – Basic Concepts of Evolution",
    "Evidences and Theories of Biological Evolution",

    // BIOLOGY AND HUMAN WELFARE
    "Human Health and Diseases – Types and Prevention",
    "Immunity and Vaccination",
    "Common Diseases – AIDS, Cancer, Lifestyle Diseases (Overview)",
    "Principles and Processes of Microbial Control",
    "Microbes in Household Products",
    "Microbes in Industrial Products (Antibiotics, Alcohols, etc.)",
    "Microbes in Sewage Treatment and Energy Production",
    "Microbes as Biocontrol Agents and Biofertilisers",

    // BIOTECHNOLOGY
    "Principles of Biotechnology – Genetic Engineering and Recombinant DNA",
    "Tools of Recombinant DNA Technology – Restriction Enzymes, Vectors, etc.",
    "Steps in Genetic Engineering – Isolation, Cutting, Ligation, Transformation",
    "Applications of Biotechnology in Agriculture – Bt Crops, GM Plants",
    "Biotechnology in Medicine – Insulin, Vaccines and Gene Therapy (Idea)",
    "Ethical Issues and Biosafety in Biotechnology",

    // ECOLOGY AND ENVIRONMENT
    "Organisms and Populations – Adaptations and Interactions",
    "Ecosystems – Structure and Function",
    "Energy Flow and Food Chains",
    "Ecological Pyramids and Nutrient Cycles",
    "Biodiversity – Levels, Importance and Loss",
    "Conservation of Biodiversity – In-situ and Ex-situ",
    "Environmental Issues – Pollution, Global Warming, Ozone Depletion",
    "Solid Waste Management and Sustainable Development",
  ],
},

}
};

export function getSubjectsForGrade(grade: number): string[] {
  const subjects = SYLLABUS[grade];
  return subjects ? Object.keys(subjects) : [];
}

export function getChaptersForGradeSubject(
  grade: number,
  subject: string
): string[] {
  const subjects = SYLLABUS[grade];
  if (!subjects) return [];
  const chapters = subjects[subject];
  return chapters ?? [];
}
