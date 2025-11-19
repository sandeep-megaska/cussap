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
    "Probability",
  ],

  Physics: [
    "Electric Charges and Fields",
    "Electrostatic Potential and Capacitance",
    "Current Electricity",
    "Moving Charges and Magnetism",
    "Magnetism and Matter",
    "Electromagnetic Induction",
    "Alternating Current",
    "Electromagnetic Waves
 ],
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
