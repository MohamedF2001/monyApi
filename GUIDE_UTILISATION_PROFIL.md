# Guide d'Utilisation - Flux Profil Financier

## 📌 Résumé des Modifications

L'intégration du profil financier après les 20 questions est maintenant complète. Voici ce qui a changé :

### ✨ Nouvelles Fonctionnalités

1. **Lien automatique User ↔ FinancialProfile**
   - Quand un utilisateur répond aux 20 questions, un profil est créé
   - Le champ `User.financialProfile` est automatiquement rempli
   - Vous pouvez maintenant récupérer le profil via l'utilisateur

2. **Routes API améliorées**
   - `GET /api/financialProfile/` : Retourne profil + user
   - `GET /api/financialProfile/details` : Retourne profil complet avec questions

3. **Migrations supportées**
   - Script `migrateFinancialProfiles.js` pour lier profils existants

## 🎬 Workflow Détaillé

### Étape 1 : Authentification
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "user@example.com",
      "avatar": "",
      "financialProfile": null  // Pas encore de profil
    }
  }
}
```

### Étape 2 : Récupérer les 20 Questions
```bash
GET /api/financialProfile/questions
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response:
{
  "success": true,
  "data": {
    "questions": [
      {
        "_id": "607f1f77bcf86cd799439001",
        "order": 1,
        "text": "Comment dépensez-vous généralement votre argent?",
        "type": "multipleChoice",
        "choices": [
          {
            "id": "A",
            "text": "Je dépense sans réfléchir",
            "scores": {
              "impulsivity": 20,
              "discipline": -15,
              "savingCapacity": -10,
              ...
            }
          },
          ...
        ],
        "weight": 1.0
      },
      // ... 19 autres questions
    ]
  }
}
```

### Étape 3 : Répondre aux 20 Questions (Frontend)
```javascript
// Exemple sur le frontend (Flutter/React/etc.)

const answers = [
  {
    questionId: "607f1f77bcf86cd799439001",
    selectedChoiceId: "A",
    freeText: null
  },
  {
    questionId: "607f1f77bcf86cd799439002",
    selectedChoiceId: "C",
    freeText: "Je préfère économiser pour l'avenir"
  },
  // ... jusqu'à 20 réponses
];

// Envoyer au backend
POST /api/financialProfile/calculate
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "answers": answers
}
```

### Étape 4 : Profil Créé et Lié Automatiquement
```bash
Response:
{
  "success": true,
  "message": "Profil financier enregistré avec succès.",
  "data": {
    "profile": {
      "_id": "507f191e810c19729de860ea",
      "user": "507f1f77bcf86cd799439011",
      "type": "strategicSaver",
      "traitScores": {
        "impulsivity": 35,
        "discipline": 78,
        "savingCapacity": 82,
        "emotionalControl": 72,
        "organizationLevel": 85,
        "riskTolerance": 55
      },
      "confidenceScore": 87,
      "answers": [...], // 20 réponses
      "createdAt": "2024-05-24T10:30:00Z",
      "updatedAt": "2024-05-24T10:30:00Z"
    }
  }
}
```

**À ce moment :**
- ✅ FinancialProfile créé et rempli
- ✅ User.financialProfile = ID du profil créé
- ✅ Lien bidirectionnel établi

### Étape 5 : Récupérer le Profil (Plus tard)

#### Option A : Récupération simple
```bash
GET /api/financialProfile/
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response:
{
  "success": true,
  "data": {
    "profile": {
      "_id": "507f191e810c19729de860ea",
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "Jean",
        "lastName": "Dupont",
        "email": "user@example.com",
        "avatar": ""
      },
      "type": "strategicSaver",
      "traitScores": {...},
      "confidenceScore": 87,
      "answers": [
        {
          "questionId": "607f1f77bcf86cd799439001",
          "selectedChoiceId": "A",
          "freeText": null,
          "answeredAt": "2024-05-24T10:30:00Z"
        },
        ...
      ]
    },
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "user@example.com",
      "avatar": "",
      "financialProfile": "507f191e810c19729de860ea"
    }
  }
}
```

#### Option B : Récupération avec détails (questions complètes)
```bash
GET /api/financialProfile/details
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response:
{
  "success": true,
  "data": {
    "profile": {
      "_id": "507f191e810c19729de860ea",
      "user": { ... },
      "type": "strategicSaver",
      "traitScores": {...},
      "confidenceScore": 87,
      "answers": [
        {
          "questionId": {
            "_id": "607f1f77bcf86cd799439001",
            "order": 1,
            "text": "Comment dépensez-vous généralement votre argent?",
            "type": "multipleChoice",
            "choices": [...]
            // Question COMPLÈTE
          },
          "selectedChoiceId": "A",
          "freeText": null,
          "answeredAt": "2024-05-24T10:30:00Z"
        },
        // ... 19 autres réponses avec questions complètes
      ]
    },
    "user": { ... }
  }
}
```

## 🔍 Récupération de l'Utilisateur avec Profil

Vous pouvez aussi récupérer l'utilisateur et son profil via d'autres routes existantes :

```bash
# Via contrôleur user (si disponible)
GET /api/users/me
Authorization: Bearer token

# Le profil financier sera populate automatiquement
# car User.financialProfile aura la référence
```

## 🚀 Cas d'Utilisation

### Cas 1 : Afficher le profil après réponses
```javascript
// Frontend après POST /calculate
1. Récupérer la réponse qui contient le profil
2. Afficher : type, scores, confidence
3. Afficher du feedback basé sur le type
```

### Cas 2 : Consulter le profil plus tard
```javascript
// Au chargement du dashboard
GET /api/financialProfile/
// Récupère le profil + infos utilisateur
// Affiche le profil enregistré
```

### Cas 3 : Montrer les réponses données
```javascript
// Si vous voulez revoir les questions répondues
GET /api/financialProfile/details
// answers[i].questionId contient la question complète
// Peut afficher : "Q1: [texte de question] - Réponse: [choix]"
```

### Cas 4 : Mettre à jour le profil
```javascript
// L'utilisateur peut refaire le test
POST /api/financialProfile/calculate
// Cela va UPDATE le profil existant
// La référence dans User reste la même
```

## 📊 Structure de Données

### Dans MongoDB après une réponse complète

**Collection: users**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  firstName: "Jean",
  lastName: "Dupont",
  email: "user@example.com",
  password: "hash...",
  financialProfile: ObjectId("507f191e810c19729de860ea"),  // ← NOUVEAU
  createdAt: ISODate("2024-05-24T08:00:00Z"),
  updatedAt: ISODate("2024-05-24T10:30:00Z")
}
```

**Collection: financialprofiles**
```javascript
{
  _id: ObjectId("507f191e810c19729de860ea"),
  user: ObjectId("507f1f77bcf86cd799439011"),
  type: "strategicSaver",
  traitScores: {
    impulsivity: 35,
    discipline: 78,
    savingCapacity: 82,
    emotionalControl: 72,
    organizationLevel: 85,
    riskTolerance: 55
  },
  confidenceScore: 87,
  aiFeedback: null,
  answers: [
    {
      questionId: ObjectId("607f1f77bcf86cd799439001"),
      selectedChoiceId: "A",
      freeText: null,
      answeredAt: ISODate("2024-05-24T10:30:15Z")
    },
    // ... 19 autres réponses
  ],
  createdAt: ISODate("2024-05-24T10:30:00Z"),
  updatedAt: ISODate("2024-05-24T10:30:00Z")
}
```

## ⚙️ Configuration Requise

### Variables d'Environnement
Assurez-vous que votre `.env` contient :
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key
```

## 🧪 Test via Postman/cURL

### 1. Récupérer token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'
```

### 2. Récupérer questions
```bash
curl -X GET http://localhost:5000/api/financialProfile/questions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Envoyer réponses
```bash
curl -X POST http://localhost:5000/api/financialProfile/calculate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId":"607f1f77bcf86cd799439001","selectedChoiceId":"A","freeText":null},
      ...
    ]
  }'
```

### 4. Récupérer profil
```bash
curl -X GET http://localhost:5000/api/financialProfile/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Dépannage

### Le profil n'est pas lié à l'utilisateur
**Solution :** Exécuter le script de migration
```bash
node scripts/migrateFinancialProfiles.js
```

### Erreur "financialProfile" non défini
**Solution :** Redémarrer le serveur pour recharger les modèles modifiés

### Le profil n'est pas créé après /calculate
**Solution :** Vérifier :
1. Les 20 réponses sont envoyées
2. Le token est valide
3. Les questionId correspondent aux questions réelles

## 📝 Prochaines Étapes (Optionnel)

- [ ] Ajouter endpoint pour modifier le profil
- [ ] Ajouter endpoint pour supprimer le profil
- [ ] Générer feedback IA après profil créé
- [ ] Ajouter tests unitaires
- [ ] Documenter en Swagger

---

**Questions?** Consultez [ARCHITECTURE_PROFIL_FINANCIER.md](./ARCHITECTURE_PROFIL_FINANCIER.md) pour plus de détails techniques.
