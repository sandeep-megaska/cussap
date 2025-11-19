// lib/syllabus.ts

// Structure: grade → subject → chapters[]
export const SYLLABUS: Record<number, Record<string, string[]>> = {
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
      "Reproduction in Animals",
      "Reaching the Age of Adolescence",
      "Cell – Structure and Functions",
    ],
    "General Science": [
      "Crop Production and Management",
      "Microorganisms: Friend and Foe",
      "Synthetic Fibres and Plastics",
      "Metals and Non-metals",
      "Coal and Petroleum",
      "Combustion and Flame",
      "Conservation of Plants and Animals",
      "Reaching the Age of Adolescence",
      "Friction",
      "Sound",
      "Electric Current and Circuits",
      "Some Natural Phenomena",
      "Stars and the Solar System",
    ],
  },

  // You can gradually add 7, 9, 10, 11, 12 later like this:
  9: {
    Maths: [
      "Number Systems",
      "Polynomials",
      "Coordinate Geometry",
      "Linear Equations in Two Variables",
      // ...
    ],
    Physics: [
      "Motion",
      "Force and Laws of Motion",
      "Gravitation",
      // ...
    ],
    // Chemistry, Biology, etc.
  },

  // 10: { ... }, 11: { ... }, 12: { ... }
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
