# 🎨 Diagrammes de Flux - Profil Financier

## 1. Flux Global : 20 Questions → Profil Financier

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLUX UTILISATEUR                             │
└─────────────────────────────────────────────────────────────────┘

      [Login]
         │
         ├─→ Créer Session (Token JWT)
         │
         ▼
   ┌──────────────┐
   │ AVANT PROFIL │ ← User.financialProfile = null
   └──────────────┘
         │
         ├─→ GET /questions
         │   ├─ Reçoit 20 questions
         │   └─ Affiche formulaire
         │
         ▼
    [Utilisateur remplit 20 questions]
         │
         ├─→ POST /calculate + answers
         │   ├─ Validation (20 réponses)
         │   ├─ Calcul scores traits
         │   ├─ Détermination type profil
         │   ├─ Calcul confiance
         │   ├─ Créer FinancialProfile
         │   └─ Lier à User ✨
         │
         ▼
   ┌──────────────┐
   │ APRÈS PROFIL │ ← User.financialProfile = ObjectId(profil)
   └──────────────┘
         │
         ├─→ GET / ou GET /details
         │   ├─ Récupère profil complet
         │   ├─ Affiche results
         │   └─ Affiche recommandations
         │
         ▼
   [Utilisateur voit son profil]
```

---

## 2. Flux Base de Données - Avant et Après

### AVANT (Ancien Système)
```
┌─────────────────┐         ┌─────────────────────┐
│   Collection    │         │   Collection        │
│   USERS         │         │   FINANCIAL         │
│                 │         │   PROFILES          │
├─────────────────┤         ├─────────────────────┤
│ _id: U123       │         │ _id: P456           │
│ firstName: Jean │         │ user: U123          │
│ lastName: Dupont│         │ type: strategicS...  │
│ email: jean@... │         │ traitScores: {...}  │
│ password: ...   │         │ answers: [...]      │
│ (pas de lien)   │         │                     │
└─────────────────┘         └─────────────────────┘
    SÉPARÉ                       SÉPARÉ
    (difficile à récupérer ensemble)
```

### APRÈS (Nouveau Système)
```
┌─────────────────────────────────┐
│   Collection USERS              │
├─────────────────────────────────┤
│ _id: U123                       │
│ firstName: Jean                 │
│ lastName: Dupont                │
│ email: jean@...                 │
│ password: ...                   │
│ financialProfile: P456 ──────┐  │ ← RÉFÉRENCE
└─────────────────────────────┬┘  │
                              │   │
                              │   │
                        ┌─────▼───────────────────┐
                        │ Collection FINANCIAL    │
                        │ PROFILES                │
                        ├─────────────────────────┤
                        │ _id: P456               │
                        │ user: U123 ◄────────┐   │
                        │ type: strategicS...  │   │ ← RÉFÉRENCE INVERSE
                        │ traitScores: {...}   │   │
                        │ answers: [...]       │   │
                        └─────────────────────────┘
    
    LIEN BIDIRECTIONNEL ↔
```

---

## 3. Flux des Requêtes API

```
┌────────────────────────────────────────────────────┐
│              ROUTES API FINANCIALPROFILE            │
└────────────────────────────────────────────────────┘

    [Client avec Token]
            │
    ┌───────┴────────┬──────────────┬─────────────┐
    │                │              │             │
    ▼                ▼              ▼             ▼
GET /questions  POST /calculate  POST /    GET /
    │                │            │          │
    │                │            │          └──→ GET /details
    │                │            │
    ▼                ▼            ▼               ▼
  JSON[]        Profile + Link  Profile    Profile + Details
  (Questions)   (Créé User!)   (Sauvegardé) (Questions popul)

FLUX TEMPOREL:
    1️⃣  GET /questions     ← Avant réponses
    2️⃣  POST /calculate    ← Réponses + Création profil ✨
    3️⃣  GET / ou /details  ← Récupération profil
    4️⃣  Refaire test = POST /calculate (UPDATE profil)
```

---

## 4. Détail de l'Objet Profil Retourné

```javascript
GET /api/financialProfile/
│
└─→ Response:
    {
      success: true,
      data: {
        profile: {
          _id: ObjectId,
          user: {
            _id: ObjectId,
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean@...",
            avatar: ""
          },
          type: "strategicSaver",           ← Classification (6 types)
          traitScores: {                    ← Scores 0-100
            impulsivity: 35,
            discipline: 78,
            savingCapacity: 82,
            emotionalControl: 72,
            organizationLevel: 85,
            riskTolerance: 55
          },
          confidenceScore: 87,              ← Confiance 0-100
          aiFeedback: "Vous êtes...",       ← Feedback optionnel
          answers: [                        ← Les 20 réponses
            {
              questionId: ObjectId,
              selectedChoiceId: "A",
              freeText: "...",
              answeredAt: ISODate
            },
            ... × 19
          ],
          createdAt: ISODate,
          updatedAt: ISODate
        },
        user: {                             ← Données utilisateur
          _id: ObjectId,
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean@...",
          avatar: "",
          financialProfile: ObjectId        ← ✨ LIEN VERS PROFIL
        }
      }
    }
```

---

## 5. Cycle de Vie Utilisateur

```
POINT A: Nouvel Utilisateur
├─ Créé User
│  └─ financialProfile: null
│
├─ Login → Reçoit token
│
├─ GET /questions
│  └─ Reçoit 20 questions
│
├─ Répond aux 20 questions
│  └─ POST /calculate
│
└─→ POINT B: Utilisateur avec Profil ✨
   ├─ FinancialProfile créé
   ├─ User.financialProfile = ID profil
   ├─ Lien bidirectionnel établi
   │
   ├─ Plus tard: GET /
   │  └─ Voir profil + user complets
   │
   ├─ Plus tard: GET /details
   │  └─ Voir profil + questions répondues
   │
   ├─ Optionnel: POST /calculate (nouveau test)
   │  └─ MISE À JOUR profil existant
   │
   └─→ Cycle continue...
```

---

## 6. Schéma de Validation des Données

```
POST /api/financialProfile/calculate
├─ Input Validation:
│  ├─ ✓ answers: Array
│  ├─ ✓ answers.length === 20
│  ├─ ✓ Chaque answer a questionId
│  └─ ✓ Au moins selectedChoiceId OU freeText
│
├─ Processing:
│  ├─ Récupère les 20 questions
│  ├─ Pour chaque réponse:
│  │  ├─ Trouve la question
│  │  ├─ Trouve le choix
│  │  └─ Accumule les scores
│  └─ Calcule profil type + confiance
│
└─ Output:
   ├─ Crée FinancialProfile
   ├─ Met à jour User.financialProfile
   └─ Retourne profil complet
```

---

## 7. Arbre de Décision - Récupérer un Profil

```
                        [GET Profil Utilisateur]
                                │
                    ┌───────────┴───────────┐
                    │                       │
            [Veut juste voir]      [Veut voir les]
            [le profil?]           [questions répondues?]
                    │                       │
                    │                       │
            GET /api/                GET /api/
            financialProfile/        financialProfile/details
                    │                       │
                    ▼                       ▼
        ┌─────────────────────┐   ┌──────────────────────┐
        │ Retourne:           │   │ Retourne:            │
        │ - Profile complet   │   │ - Profil complet     │
        │ - User avec ref     │   │ - Questions PEUPLÉES │
        │ - Réponses (IDs)    │   │ - Texte questions    │
        │                     │   │ - Choix détaillés    │
        └─────────────────────┘   └──────────────────────┘
                    │                       │
                    └───────────┬───────────┘
                                │
                        [Affiche les résultats]
```

---

## 8. Flux d'Erreurs et Gestion

```
POST /api/financialProfile/calculate
    │
    ├─ Erreur: Pas d'answers?
    │  └─ 400: "Réponses manquantes"
    │
    ├─ Erreur: Moins de 20 réponses?
    │  └─ 400: "Nombre de réponses insuffisant"
    │
    ├─ Erreur: User pas authentifié?
    │  └─ 401: "Non autorisé"
    │
    ├─ Erreur: QuestionId invalide?
    │  └─ Ignoré (continue avec autres)
    │
    ├─ Erreur: Erreur base de données?
    │  └─ 500: error.message
    │
    └─ ✅ Succès
       └─ 200: Profile créé + User lié
```

---

## 9. Performance et Indexing

```
RECOMMANDÉ DE CRÉER CES INDEX:

1. users.financialProfile (ObjectId)
   ├─ Accélère: GET /api/financialProfile/
   └─ Raison: Lookup rapide de profil par user

2. financialprofiles.user (ObjectId, unique)
   ├─ Accélère: POST /calculate (upsert)
   └─ Raison: Un user = max un profil

3. financialprofiles.createdAt (Date)
   ├─ Accélère: Lister profils par date
   └─ Raison: Analytics, admin

Exemple Création Index:
db.users.createIndex({ financialProfile: 1 })
db.financialprofiles.createIndex({ user: 1 }, { unique: true })
```

---

## 10. Intégration Frontend - Pseudo-Code

```javascript
// ÉTAPE 1: Login
const token = await login(email, password);
// token = "eyJhbGc..."

// ÉTAPE 2: Récupérer questions
const questionsResponse = await fetch(
  '/api/financialProfile/questions',
  { headers: { Authorization: `Bearer ${token}` } }
);
const questions = questionsResponse.data.questions;

// ÉTAPE 3: Afficher formulaire (UI)
// displayQuestionsForm(questions);
// Utilisateur remplit 20 questions

// ÉTAPE 4: Soumettre réponses
const answers = gatherUserAnswers(); // 20 réponses
const profileResponse = await fetch(
  '/api/financialProfile/calculate',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answers })
  }
);
const profile = profileResponse.data.profile; // ✨ PROFIL CRÉÉ

// ÉTAPE 5: Afficher résultats
// showProfileResults(profile);
// ├─ Type de profil
// ├─ Graphique scores
// └─ Recommandations

// ÉTAPE 6: Plus tard - Récupérer profil
const myProfile = await fetch(
  '/api/financialProfile/',
  { headers: { Authorization: `Bearer ${token}` } }
);
// showStoredProfile(myProfile);
```

---

## 11. Comparaison : Avant ↔ Après

```
┌──────────────────────────────────────────────────┐
│           AVANT LES MODIFICATIONS                 │
├──────────────────────────────────────────────────┤
│ User.financialProfile: ❌ N'existe pas           │
│ Récupérer profil: GET /financialProfile/         │
│  └─ Retourne juste FinancialProfile              │
│  └─ Pas d'infos utilisateur                      │
│ Lien User-Profile: ⚠️  Indirect (via user ID)   │
│ Populate possible: ❌ Non, pas de référence      │
│ Migration requise: ❌ Non                         │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│           APRÈS LES MODIFICATIONS                │
├──────────────────────────────────────────────────┤
│ User.financialProfile: ✅ Référence ObjectId    │
│ Récupérer profil: GET /financialProfile/         │
│  └─ Retourne Profile + User complets             │
│  ├─ User avec ref au profil peuplée              │
│  └─ Profile avec user peuplé                     │
│ Lien User-Profile: ✨ Direct (2 sens)           │
│ Populate possible: ✅ Oui, populate()            │
│ Migration requise: ⚠️  Optionnel (pour existants)│
│ Route /details: ✨ NOUVELLE (questions peuplées) │
└──────────────────────────────────────────────────┘
```

---

## Notes Importantes

- 🎯 Le lien est créé **automatiquement** quand on répond aux questions
- 🔗 Relation **bidirectionnelle** : User ↔ FinancialProfile
- 📊 Un User = **max 1** FinancialProfile (unique)
- 🔄 Refaire le test = **UPDATE** (pas duplication)
- 🔐 Tous les endpoints nécessitent **authentication**
- ⚡ `.populate()` utilisé pour récupérer données liées
- 🧪 Migration script disponible pour profils existants

---

**Diagrammes créés:** 24 mai 2026
