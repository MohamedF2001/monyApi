# Architecture - Intégration du Profil Financier

## 📋 Vue d'ensemble

Après inspection du projet, voici comment le profil financier a été intégré au flux d'authentification et de récupération d'utilisateur.

## 🔗 Flux de Données - 20 Questions → Profil Financier

```
1. USER SE CONNECTE
   ↓
2. REÇOIT LES 20 QUESTIONS
   GET /api/financialProfile/questions
   ↓
3. RÉPOND AUX 20 QUESTIONS
   POST /api/financialProfile/calculate
   ├─ Réponses validées
   ├─ Scores de traits calculés
   ├─ Type de profil déterminé
   ├─ Score de confiance calculé
   ↓
4. PROFIL SAUVEGARDÉ & LIEN CRÉÉ
   ├─ Création/Mise à jour FinancialProfile
   ├─ Référence ajoutée dans User.financialProfile
   ↓
5. PROFIL RÉCUPÉRABLE APRÈS
   GET /api/financialProfile/         (profil + user)
   GET /api/financialProfile/details  (profil complet avec réponses)
```

## 📊 Modèles de Données

### User Model (modifié)
```javascript
{
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  password: String,
  avatar: String,
  financialProfile: ObjectId (référence à FinancialProfile)  // ✨ NOUVEAU
}
```

### FinancialProfile Model (existant, utilisé)
```javascript
{
  user: ObjectId (référence à User),
  type: String (impulsiveSpender, balancedAware, etc.),
  traitScores: {
    impulsivity: Number,
    discipline: Number,
    savingCapacity: Number,
    emotionalControl: Number,
    organizationLevel: Number,
    riskTolerance: Number,
  },
  confidenceScore: Number (0-100),
  aiFeedback: String (optionnel),
  answers: [
    {
      questionId: ObjectId (référence à FinancialQuestion),
      selectedChoiceId: String,
      freeText: String,
      answeredAt: Date,
    }
  ],
  createdAt, updatedAt
}
```

## 🔌 Routes API

### Récupération des questions (avant réponses)
```
GET /api/financialProfile/questions
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  data: {
    questions: [
      {
        _id, order, text, type, choices, freeTextPrompt, weight
      },
      ... (20 questions)
    ]
  }
}
```

### Calcul et sauvegarde du profil (après 20 réponses)
```
POST /api/financialProfile/calculate
Headers: Authorization: Bearer <token>
Body: {
  answers: [
    { questionId, selectedChoiceId, freeText }
    ... (20 réponses)
  ]
}

Response:
{
  success: true,
  message: "Profil financier enregistré avec succès.",
  data: {
    profile: {
      _id, user, type, traitScores, confidenceScore, answers, ...
    }
  }
}
```

### Récupérer le profil (après création)
```
GET /api/financialProfile/
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  data: {
    profile: {
      _id, user, type, traitScores, confidenceScore, answers, ...
    },
    user: {
      _id, firstName, lastName, email, avatar, financialProfile
    }
  }
}
```

### Récupérer profil avec détails complets
```
GET /api/financialProfile/details
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  data: {
    profile: {
      _id,
      user: { firstName, lastName, email, avatar },
      type,
      traitScores,
      confidenceScore,
      answers: [
        {
          questionId: { order, text, type, choices, ... },
          selectedChoiceId,
          freeText,
          answeredAt
        }
        ... (20 réponses avec questions complètes)
      ]
    },
    user: { _id, firstName, lastName, email, avatar, financialProfile }
  }
}
```

## 🔄 Changements Apportés

### 1. **models/User.js**
- ✅ Ajout du champ `financialProfile` (référence ObjectId)
- ✅ Relation optionnelle (peut être null au départ)

### 2. **controllers/financialProfileController.js**
- ✅ Import de User pour créer le lien
- ✅ Modification de `saveProfileForUser()` pour :
  - Sauvegarder le profil dans FinancialProfile
  - Créer la référence dans User.financialProfile
- ✅ Amélioration de `getMyProfile()` pour retourner profil + user
- ✅ Ajout de `getProfileWithDetails()` pour récupération complète

### 3. **routes/financialProfileRoutes.js**
- ✅ Export de `getProfileWithDetails`
- ✅ Nouvelle route : `GET /details`

## 🎯 Workflow Complet

### Phase 1 : Avant réponses aux questions
```
1. Utilisateur se connecte
   → L'API de login retourne token
   
2. Utilisateur récupère les 20 questions
   GET /api/financialProfile/questions
   → Récupère questions avec ordre (1-20)
```

### Phase 2 : Réponses aux questions
```
3. Utilisateur remplit les 20 questions
   POST /api/financialProfile/calculate
   ├─ Système calcule les traits (scores 0-100)
   ├─ Système détermine le type de profil
   ├─ Système calcule confiance (0-100)
   ├─ Sauvegarde tout dans FinancialProfile
   └─ Crée lien dans User.financialProfile
```

### Phase 3 : Après création du profil
```
4. Utilisateur peut récupérer son profil
   GET /api/financialProfile/
   → Retourne profile + user avec financialProfile
   
5. Ou récupérer détails complets (avec questions)
   GET /api/financialProfile/details
   → Retourne profile avec questions populées
```

## 💾 Base de Données

### Collections
- **users** : Contient tous les utilisateurs + référence financialProfile
- **financialprofiles** : Contient tous les profils + réponses aux questions
- **financialquestions** : Contient les 20 questions (statique)

### Relations
```
User (1) ←→ (1) FinancialProfile
FinancialProfile (1) ←→ (many) FinancialQuestion (via answers)
```

## ✨ Points Clés

1. **Lien bidirectionnel** : 
   - User.financialProfile pointe à FinancialProfile
   - FinancialProfile.user pointe à User

2. **Atomicité** :
   - Quand profil créé → User automatiquement mis à jour
   - Pas de profil sans user
   - Pas de profil orphelin

3. **Sécurité** :
   - Toutes les routes nécessitent authentication
   - Un utilisateur ne peut voir que son propre profil
   - Validation stricte des données entrantes

4. **Performance** :
   - `.populate()` utilisé pour récupérer les données liées
   - Sélection des champs retournés (pas de password)
   - Index sur `user` dans FinancialProfile (unique)

## 🧪 Test du Workflow

```bash
# 1. Login
POST /api/auth/login
Body: { email, password }
→ Récupérer: token

# 2. Récupérer les 20 questions
GET /api/financialProfile/questions
Headers: Authorization: Bearer <token>

# 3. Remplir et envoyer les réponses
POST /api/financialProfile/calculate
Headers: Authorization: Bearer <token>
Body: { answers: [ { questionId, selectedChoiceId, freeText } ] }

# 4. Récupérer le profil créé
GET /api/financialProfile/
Headers: Authorization: Bearer <token>

# 5. Récupérer les détails complets
GET /api/financialProfile/details
Headers: Authorization: Bearer <token>
```

## 🚀 Prochaines Étapes (Optionnel)

1. **Frontend** : Intégrer le formulaire des 20 questions
2. **Analytics** : Logger les profils créés
3. **API Gemini** : Générer feedback personnalisé après le profil
4. **Tests** : Créer tests E2E du flux complet
5. **Cache** : Cacher les questions (changent rarement)
