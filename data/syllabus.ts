import { Grade, Subject } from '../types';

type SyllabusData = Record<Subject, Record<Grade, string[]>>;

export const SYLLABUS: SyllabusData = {
  [Subject.MATH]: {
    [Grade.CLASS_9]: ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Areas of Parallelograms and Triangles", "Circles", "Constructions", "Heron's Formula", "Surface Areas and Volumes", "Statistics", "Probability"],
    [Grade.CLASS_10]: ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", "Constructions", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"],
    [Grade.CLASS_11]: ["Sets", "Relations and Functions", "Trigonometric Functions", "Principle of Mathematical Induction", "Complex Numbers and Quadratic Equations", "Linear Inequalities", "Permutations and Combinations", "Binomial Theorem", "Sequences and Series", "Straight Lines", "Conic Sections", "Introduction to Three Dimensional Geometry", "Limits and Derivatives", "Mathematical Reasoning", "Statistics", "Probability"],
    [Grade.CLASS_12]: ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Application of Derivatives", "Integrals", "Application of Integrals", "Differential Equations", "Vector Algebra", "Three Dimensional Geometry", "Linear Programming", "Probability"]
  },
  [Subject.PHYSICS]: {
    [Grade.CLASS_9]: ["Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound"],
    [Grade.CLASS_10]: ["Light - Reflection and Refraction", "The Human Eye and the Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Sources of Energy"],
    [Grade.CLASS_11]: ["Physical World", "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion", "Work, Energy and Power", "System of Particles and Rotational Motion", "Gravitation", "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves"],
    [Grade.CLASS_12]: ["Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments", "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", "Semiconductor Electronics"]
  },
  [Subject.CHEMISTRY]: {
    [Grade.CLASS_9]: ["Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Structure of the Atom"],
    [Grade.CLASS_10]: ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Periodic Classification of Elements"],
    [Grade.CLASS_11]: ["Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity in Properties", "Chemical Bonding and Molecular Structure", "States of Matter", "Thermodynamics", "Equilibrium", "Redox Reactions", "Hydrogen", "The s-Block Elements", "The p-Block Elements", "Organic Chemistry - Some Basic Principles and Techniques", "Hydrocarbons", "Environmental Chemistry"],
    [Grade.CLASS_12]: ["The Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "General Principles of Isolation of Elements", "The p-Block Elements", "The d- and f- Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"]
  },
  [Subject.BIOLOGY]: {
    [Grade.CLASS_9]: ["The Fundamental Unit of Life", "Tissues", "Diversity in Living Organisms", "Why Do We Fall Ill", "Natural Resources", "Improvement in Food Resources"],
    [Grade.CLASS_10]: ["Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity and Evolution", "Our Environment", "Sustainable Management of Natural Resources"],
    [Grade.CLASS_11]: ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom", "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organisation in Animals", "Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division", "Transport in Plants", "Mineral Nutrition", "Photosynthesis in Higher Plants", "Respiration in Plants", "Plant Growth and Development", "Digestion and Absorption", "Breathing and Exchange of Gases", "Body Fluids and Circulation", "Excretory Products and their Elimination", "Locomotion and Movement", "Neural Control and Coordination", "Chemical Coordination and Integration"],
    [Grade.CLASS_12]: ["Reproduction in Organisms", "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health", "Principles of Inheritance and Variation", "Molecular Basis of Inheritance", "Evolution", "Human Health and Disease", "Strategies for Enhancement in Food Production", "Microbes in Human Welfare", "Biotechnology: Principles and Processes", "Biotechnology and its Applications", "Organisms and Populations", "Ecosystem", "Biodiversity and Conservation", "Environmental Issues"]
  },
  [Subject.HISTORY]: {
    [Grade.CLASS_9]: ["The French Revolution", "Socialism in Europe and the Russian Revolution", "Nazism and the Rise of Hitler", "Forest Society and Colonialism", "Pastoralists in the Modern World"],
    [Grade.CLASS_10]: ["The Rise of Nationalism in Europe", "The Nationalist Movement in Indo-China", "Nationalism in India", "The Making of a Global World", "The Age of Industrialisation", "Work, Life and Leisure", "Print Culture and the Modern World", "Novels, Society and History"],
    [Grade.CLASS_11]: ["From the Beginning of Time", "Writing and City Life", "An Empire Across Three Continents", "The Central Islamic Lands", "Nomadic Empires", "The Three Orders", "Changing Cultural Traditions", "Confrontation of Cultures", "The Industrial Revolution", "Displacing Indigenous Peoples", "Paths to Modernisation"],
    [Grade.CLASS_12]: ["Bricks, Beads and Bones", "Kings, Farmers and Towns", "Kinship, Caste and Class", "Thinkers, Beliefs and Buildings", "Through the Eyes of Travellers", "Bhakti-Sufi Traditions", "An Imperial Capital: Vijayanagara", "Peasants, Zamindars and the State", "Kings and Chronicles", "Colonialism and the Countryside", "Rebels and the Raj", "Colonial Cities", "Mahatma Gandhi and the Nationalist Movement", "Understanding Partition", "Framing the Constitution"]
  }
};