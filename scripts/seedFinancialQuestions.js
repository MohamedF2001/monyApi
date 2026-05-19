import "dotenv/config";
import mongoose from "mongoose";
import FinancialQuestion from "../models/FinancialQuestion.js";
import connectDB from "../config/db.js";

const questions = [
  // === QUESTION 1 : Argent inattendu ===
  {
    id: "q1",
    text: "Quand vous recevez de l'argent inattendu (prime, cadeau...), vous :",
    type: "mixed",
    choices: [
      {
        id: "q1_a",
        text: "Le dépensez rapidement pour vous faire plaisir",
        scores: {
          impulsivity: 30,
          savingCapacity: -20,
          discipline: -15,
        },
      },
      {
        id: "q1_b",
        text: "L'épargnez immédiatement",
        scores: {
          savingCapacity: 30,
          discipline: 25,
          impulsivity: -20,
        },
      },
      {
        id: "q1_c",
        text: "Prenez le temps de réfléchir à la meilleure utilisation",
        scores: {
          emotionalControl: 20,
          discipline: 15,
          organizationLevel: 10,
        },
      },
    ],
    freeTextPrompt: "Pourquoi réagissez-vous ainsi ? (optionnel)",
    isRequired: true,
    weight: 1.5,
    order: 1,
  },

  // === QUESTION 2 : Suivi des dépenses ===
  {
    id: "q2",
    text: "À quelle fréquence consultez-vous vos comptes bancaires ?",
    type: "multipleChoice",
    choices: [
      {
        id: "q2_a",
        text: "Plusieurs fois par jour",
        scores: {
          organizationLevel: 25,
          emotionalControl: -15,
        },
      },
      {
        id: "q2_b",
        text: "Une fois par jour",
        scores: {
          organizationLevel: 20,
          discipline: 15,
        },
      },
      {
        id: "q2_c",
        text: "Quelques fois par semaine",
        scores: {
          organizationLevel: 10,
        },
      },
      {
        id: "q2_d",
        text: "Rarement ou jamais",
        scores: {
          organizationLevel: -30,
          discipline: -20,
        },
      },
    ],
    isRequired: true,
    weight: 1.2,
    order: 2,
  },

  // === QUESTION 3 : Achat coup de cœur ===
  {
    id: "q3",
    text: "Face à un achat coup de cœur important, vous :",
    type: "multipleChoice",
    choices: [
      {
        id: "q3_a",
        text: "Achetez immédiatement si vous en avez envie",
        scores: {
          impulsivity: 35,
          emotionalControl: -25,
        },
      },
      {
        id: "q3_b",
        text: "Attendez 24-48h pour réfléchir",
        scores: {
          emotionalControl: 25,
          discipline: 20,
        },
      },
      {
        id: "q3_c",
        text: "Comparez les prix et alternatives",
        scores: {
          organizationLevel: 20,
          riskTolerance: -10,
        },
      },
      {
        id: "q3_d",
        text: "Renoncez systématiquement",
        scores: {
          savingCapacity: 20,
          emotionalControl: 15,
        },
      },
    ],
    isRequired: true,
    weight: 1.8,
    order: 3,
  },

  // === QUESTION 4 : Budget mensuel ===
  {
    id: "q4",
    text: "Avez-vous un budget mensuel défini ?",
    type: "multipleChoice",
    choices: [
      {
        id: "q4_a",
        text: "Oui, détaillé par catégorie que je suis rigoureusement",
        scores: {
          organizationLevel: 30,
          discipline: 25,
        },
      },
      {
        id: "q4_b",
        text: "Oui, mais je le respecte rarement",
        scores: {
          organizationLevel: 10,
          discipline: -15,
        },
      },
      {
        id: "q4_c",
        text: "J'ai une idée générale de mes limites",
        scores: {
          organizationLevel: 5,
        },
      },
      {
        id: "q4_d",
        text: "Non, je dépense selon mes besoins du moment",
        scores: {
          organizationLevel: -25,
          impulsivity: 20,
        },
      },
    ],
    isRequired: true,
    weight: 1.5,
    order: 4,
  },

  // === QUESTION 5 : Épargne mensuelle ===
  {
    id: "q5",
    text: "Épargnez-vous régulièrement chaque mois ?",
    type: "multipleChoice",
    choices: [
      {
        id: "q5_a",
        text: "Oui, un montant fixe automatiquement",
        scores: {
          savingCapacity: 35,
          discipline: 30,
        },
      },
      {
        id: "q5_b",
        text: "Oui, mais le montant varie",
        scores: {
          savingCapacity: 20,
          discipline: 10,
        },
      },
      {
        id: "q5_c",
        text: "J'épargne ce qui reste en fin de mois",
        scores: {
          savingCapacity: 10,
          organizationLevel: -10,
        },
      },
      {
        id: "q5_d",
        text: "Non, je n'arrive pas à épargner",
        scores: {
          savingCapacity: -30,
          discipline: -20,
        },
      },
    ],
    isRequired: true,
    weight: 2.0,
    order: 5,
  },

  // === QUESTION 6 : Réaction découvert ===
  {
    id: "q6",
    text: "Si votre compte est à découvert, comment réagissez-vous ?",
    type: "mixed",
    choices: [
      {
        id: "q6_a",
        text: "Je panique et stresse énormément",
        scores: {
          emotionalControl: -25,
          organizationLevel: -15,
        },
      },
      {
        id: "q6_b",
        text: "J'analyse calmement et trouve des solutions",
        scores: {
          emotionalControl: 25,
          organizationLevel: 20,
        },
      },
      {
        id: "q6_c",
        text: "Je ne m'en rends compte qu'après coup",
        scores: {
          organizationLevel: -30,
          discipline: -20,
        },
      },
      {
        id: "q6_d",
        text: "Cela ne m'arrive jamais",
        scores: {
          discipline: 25,
          organizationLevel: 20,
        },
      },
    ],
    freeTextPrompt: "Que ressentez-vous face aux difficultés financières ?",
    isRequired: true,
    weight: 1.3,
    order: 6,
  },

  // === QUESTION 7 : Objectifs financiers ===
  {
    id: "q7",
    text: "Avez-vous des objectifs financiers à moyen/long terme ?",
    type: "multipleChoice",
    choices: [
      {
        id: "q7_a",
        text: "Oui, précis et écrits avec plan d'action",
        scores: {
          discipline: 30,
          organizationLevel: 25,
        },
      },
      {
        id: "q7_b",
        text: "Oui, mais vagues et non formalisés",
        scores: {
          discipline: 10,
          organizationLevel: 5,
        },
      },
      {
        id: "q7_c",
        text: "Non, je vis au jour le jour",
        scores: {
          discipline: -20,
          impulsivity: 15,
        },
      },
    ],
    isRequired: true,
    weight: 1.4,
    order: 7,
  },

  // === QUESTION 8 : Achats en ligne ===
  {
    id: "q8",
    text: "Vos achats en ligne sont généralement :",
    type: "multipleChoice",
    choices: [
      {
        id: "q8_a",
        text: "Planifiés et réfléchis",
        scores: {
          discipline: 20,
          impulsivity: -15,
        },
      },
      {
        id: "q8_b",
        text: "Spontanés, je craque facilement",
        scores: {
          impulsivity: 30,
          emotionalControl: -20,
        },
      },
      {
        id: "q8_c",
        text: "Je n'achète presque jamais en ligne",
        scores: {
          riskTolerance: -15,
        },
      },
    ],
    isRequired: true,
    weight: 1.0,
    order: 8,
  },

  // === QUESTION 9 : Promotions ===
  {
    id: "q9",
    text: "Face aux promotions et soldes :",
    type: "multipleChoice",
    choices: [
      {
        id: "q9_a",
        text: "J'achète même des choses dont je n'ai pas besoin",
        scores: {
          impulsivity: 35,
          emotionalControl: -25,
        },
      },
      {
        id: "q9_b",
        text: "Je profite uniquement pour ce qui était prévu",
        scores: {
          discipline: 25,
          organizationLevel: 15,
        },
      },
      {
        id: "q9_c",
        text: "Je me méfie, souvent ce n'est pas une vraie affaire",
        scores: {
          organizationLevel: 15,
          riskTolerance: -10,
        },
      },
      {
        id: "q9_d",
        text: "Je ne suis jamais les promotions",
        scores: {
          discipline: 10,
        },
      },
    ],
    isRequired: true,
    weight: 1.2,
    order: 9,
  },

  // === QUESTION 10 : Relation à l'argent ===
  {
    id: "q10",
    text: "Votre relation à l'argent est plutôt :",
    type: "mixed",
    choices: [
      {
        id: "q10_a",
        text: "Source de stress permanent",
        scores: {
          emotionalControl: -30,
          organizationLevel: -15,
        },
      },
      {
        id: "q10_b",
        text: "Neutre, c'est juste un outil",
        scores: {
          emotionalControl: 25,
        },
      },
      {
        id: "q10_c",
        text: "Plaisir, j'aime dépenser",
        scores: {
          impulsivity: 20,
          savingCapacity: -15,
        },
      },
      {
        id: "q10_d",
        text: "Sécurité, j'aime contrôler",
        scores: {
          savingCapacity: 25,
          discipline: 20,
        },
      },
    ],
    freeTextPrompt: "Décrivez en quelques mots votre rapport à l'argent",
    isRequired: true,
    weight: 2.0,
    order: 10,
  },

  // === QUESTION 11 : Paiement carte/espèces ===
  {
    id: "q11",
    text: "Vous préférez payer :",
    type: "multipleChoice",
    choices: [
      {
        id: "q11_a",
        text: "En espèces pour mieux contrôler",
        scores: {
          organizationLevel: 15,
          discipline: 10,
        },
      },
      {
        id: "q11_b",
        text: "Par carte, c'est plus pratique",
        scores: {
          impulsivity: 10,
        },
      },
      {
        id: "q11_c",
        text: "Peu importe le moyen",
        scores: {},
      },
    ],
    isRequired: true,
    weight: 0.8,
    order: 11,
  },

  // === QUESTION 12 : Comparaison prix ===
  {
    id: "q12",
    text: "Avant un achat important, vous :",
    type: "multipleChoice",
    choices: [
      {
        id: "q12_a",
        text: "Comparez systématiquement les prix pendant des jours",
        scores: {
          organizationLevel: 25,
          riskTolerance: -15,
        },
      },
      {
        id: "q12_b",
        text: "Regardez vite 2-3 options",
        scores: {
          organizationLevel: 10,
        },
      },
      {
        id: "q12_c",
        text: "Achetez au premier endroit qui vous plaît",
        scores: {
          impulsivity: 25,
          organizationLevel: -15,
        },
      },
    ],
    isRequired: true,
    weight: 1.1,
    order: 12,
  },

  // === QUESTION 13 : Fin de mois ===
  {
    id: "q13",
    text: "En fin de mois, vous êtes généralement :",
    type: "multipleChoice",
    choices: [
      {
        id: "q13_a",
        text: "À découvert ou presque",
        scores: {
          savingCapacity: -30,
          discipline: -25,
        },
      },
      {
        id: "q13_b",
        text: "Juste avec ce qu'il faut",
        scores: {
          organizationLevel: 5,
        },
      },
      {
        id: "q13_c",
        text: "Avec un bon reste disponible",
        scores: {
          savingCapacity: 25,
          discipline: 20,
        },
      },
    ],
    isRequired: true,
    weight: 1.6,
    order: 13,
  },

  // === QUESTION 14 : Prêt à un proche ===
  {
    id: "q14",
    text: "Un proche vous demande de lui prêter de l'argent :",
    type: "multipleChoice",
    choices: [
      {
        id: "q14_a",
        text: "Vous acceptez facilement par générosité",
        scores: {
          emotionalControl: -15,
          impulsivity: 15,
        },
      },
      {
        id: "q14_b",
        text: "Vous évaluez d'abord votre situation",
        scores: {
          emotionalControl: 20,
          organizationLevel: 15,
        },
      },
      {
        id: "q14_c",
        text: "Vous refusez systématiquement",
        scores: {
          discipline: 15,
          savingCapacity: 10,
        },
      },
    ],
    isRequired: true,
    weight: 1.0,
    order: 14,
  },

  // === QUESTION 15 : Investissement ===
  {
    id: "q15",
    text: "Face à une opportunité d'investissement :",
    type: "multipleChoice",
    choices: [
      {
        id: "q15_a",
        text: "Vous vous lancez si ça semble intéressant",
        scores: {
          riskTolerance: 30,
          impulsivity: 20,
        },
      },
      {
        id: "q15_b",
        text: "Vous analysez longuement avant de décider",
        scores: {
          organizationLevel: 25,
          riskTolerance: 10,
        },
      },
      {
        id: "q15_c",
        text: "Vous évitez, c'est trop risqué",
        scores: {
          riskTolerance: -25,
          savingCapacity: 15,
        },
      },
    ],
    isRequired: true,
    weight: 1.3,
    order: 15,
  },

  // === QUESTION 16 : Factures ===
  {
    id: "q16",
    text: "Vos factures et abonnements sont :",
    type: "multipleChoice",
    choices: [
      {
        id: "q16_a",
        text: "Tous automatisés et suivis",
        scores: {
          organizationLevel: 30,
          discipline: 20,
        },
      },
      {
        id: "q16_b",
        text: "Certains automatisés, d'autres manuels",
        scores: {
          organizationLevel: 15,
        },
      },
      {
        id: "q16_c",
        text: "Payés au dernier moment ou en retard",
        scores: {
          organizationLevel: -25,
          discipline: -20,
        },
      },
    ],
    isRequired: true,
    weight: 1.2,
    order: 16,
  },

  // === QUESTION 17 : Récompense après effort ===
  {
    id: "q17",
    text: "Après un gros effort ou succès, vous :",
    type: "multipleChoice",
    choices: [
      {
        id: "q17_a",
        text: "Vous offrez une grosse récompense financière",
        scores: {
          impulsivity: 25,
          emotionalControl: -15,
        },
      },
      {
        id: "q17_b",
        text: "Un petit plaisir raisonnable",
        scores: {
          emotionalControl: 15,
          discipline: 10,
        },
      },
      {
        id: "q17_c",
        text: "Rien, vous préférez épargner",
        scores: {
          savingCapacity: 20,
          discipline: 15,
        },
      },
    ],
    isRequired: true,
    weight: 1.0,
    order: 17,
  },

  // === QUESTION 18 : Applications bancaires ===
  {
    id: "q18",
    text: "Utilisez-vous des applications de gestion financière ?",
    type: "multipleChoice",
    choices: [
      {
        id: "q18_a",
        text: "Oui, quotidiennement",
        scores: {
          organizationLevel: 25,
          discipline: 20,
        },
      },
      {
        id: "q18_b",
        text: "Oui, mais rarement",
        scores: {
          organizationLevel: 10,
        },
      },
      {
        id: "q18_c",
        text: "Non, jamais",
        scores: {
          organizationLevel: -15,
        },
      },
    ],
    isRequired: true,
    weight: 0.9,
    order: 18,
  },

  // === QUESTION 19 : Crédit/Découvert ===
  {
    id: "q19",
    text: "Votre position sur le crédit à la consommation :",
    type: "multipleChoice",
    choices: [
      {
        id: "q19_a",
        text: "J'y ai recours régulièrement",
        scores: {
          riskTolerance: 25,
          discipline: -20,
        },
      },
      {
        id: "q19_b",
        text: "Seulement pour gros achats nécessaires",
        scores: {
          organizationLevel: 15,
          riskTolerance: 10,
        },
      },
      {
        id: "q19_c",
        text: "Jamais, je préfère économiser d'abord",
        scores: {
          discipline: 25,
          savingCapacity: 20,
        },
      },
    ],
    isRequired: true,
    weight: 1.4,
    order: 19,
  },

  // === QUESTION 20 : Vision future ===
  {
    id: "q20",
    text: "Dans 5 ans, financièrement vous vous voyez :",
    type: "mixed",
    choices: [
      {
        id: "q20_a",
        text: "Avec une belle épargne et patrimoine",
        scores: {
          discipline: 25,
          savingCapacity: 25,
        },
      },
      {
        id: "q20_b",
        text: "Stable, sans dette",
        scores: {
          organizationLevel: 15,
        },
      },
      {
        id: "q20_c",
        text: "Je ne me projette pas vraiment",
        scores: {
          discipline: -20,
          impulsivity: 15,
        },
      },
    ],
    freeTextPrompt: "Quel est votre rêve financier principal ?",
    isRequired: true,
    weight: 1.7,
    order: 20,
  },
];

const seedFinancialQuestions = async () => {
  try {
    await connectDB();
    console.log("✅ Connecté à MongoDB");

    // Supprimer les questions existantes
    await FinancialQuestion.deleteMany({});
    console.log("🗑️ Questions existantes supprimées");

    // Insérer les nouvelles questions
    await FinancialQuestion.insertMany(questions);
    console.log(`✅ ${questions.length} questions financières insérées`);

    await mongoose.disconnect();
    console.log("✅ Déconnecté de MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    process.exit(1);
  }
};

seedFinancialQuestions();
