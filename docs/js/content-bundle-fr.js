/**
 * OB -- French Content Bundle
 * ============================
 * All French content embedded as JS for file:// compatibility.
 * Loaded before content.js. When present, content.js uses this
 * instead of fetch(). Regenerate by copying JSON file contents here.
 */
(function () {
  "use strict";
  var OB = window.OB = window.OB || {};

  OB._bundleFr = {
  "i18n/ui-fr.json": {
    "app.title": "Windchill OCP",
    "app.subtitle": "Formation",
    "app.courseProgress": "Progression du cours",
    "app.courseProgressPct": "Progression du cours : {pct}%",
    "app.resetProgress": "Réinitialiser la progression",
    "app.resetConfirm": "Réinitialiser toute la progression et les notes ?",
    "app.openMenu": "Ouvrir le menu",
    "app.toggleTheme": "Changer le thème",
    "sidebar.dashboard": "Tableau de bord",
    "sidebar.modules": "Modules",
    "sidebar.resources": "Ressources",
    "sidebar.glossary": "Glossaire",
    "sidebar.knowledgeCheck": "Contrôle des connaissances",
    "sidebar.comingSoon": "Bientôt disponible",
    "sidebar.topicLabel": "Sujet {mod}.{topic}",
    "sidebar.exerciseLabel": "Exercice {num}",
    "dashboard.continueLabel": "Reprendre là où vous en étiez",
    "dashboard.statComplete": "Terminé",
    "dashboard.statTopics": "Sujets",
    "dashboard.statEstimated": "Estimation",
    "dashboard.modules": "Modules",
    "dashboard.moduleNum": "Module {num}",
    "dashboard.moduleComingSoon": "Module {num} - Bientôt disponible",
    "dashboard.topicsProgress": "{done}/{total} sujets",
    "dashboard.estimatedMin": "~{min} min",
    "dashboard.routeTopic": "Sujet {label}",
    "dashboard.routeModule": "Module {label}",
    "dashboard.routeQuiz": "Quiz {label}",
    "dashboard.routeGlossary": "Glossaire",
    "topic.breadcrumbDashboard": "Tableau de bord",
    "topic.breadcrumbModule": "Module {num}",
    "topic.topicNum": "Sujet {mod}.{topic}",
    "topic.exerciseNum": "Exercice {num}",
    "topic.estimated": "Estimation : ~{min} min",
    "topic.keyTakeaways": "Points clés à retenir",
    "topic.markComplete": "Marquer comme terminé",
    "topic.completedUndo": "Terminé - Cliquer pour annuler",
    "topic.previous": "Précédent",
    "topic.next": "Suivant",
    "topic.moduleOverview": "Vue d'ensemble du module",
    "topic.takeQuiz": "Passer le quiz",
    "topic.clickToReveal": "Cliquer pour révéler",
    "topic.allMatchedCorrectly": "Tout est correctement associé !",
    "topic.scenarioLabel": "Scénario",
    "topic.strategyLabel": "Stratégie",
    "topic.showHint": "Afficher l'indice",
    "topic.hideHint": "Masquer l'indice",
    "topic.objective": "Objectif",
    "topic.stepsCompleted": "{done}/{total} étapes terminées",
    "topic.stepsProgress": "{done}/{total} étapes",
    "topic.doThis": "À faire",
    "topic.whyItMatters": "Pourquoi c'est important",
    "topic.doneNextStep": "Terminé — Étape suivante",
    "topic.topicsComplete": "{done}/{total} sujets terminés",
    "topic.moduleBadge": "Module {num}",
    "topic.topics": "Sujets",
    "topic.startModule": "Commencer le module",
    "topic.backToDashboard": "Tableau de bord",
    "topic.knowledgeCheck": "Contrôle des connaissances du module {num}",
    "topic.quizBest": "Meilleur : {score}/{total}",
    "topic.quizNotAttempted": "Pas encore tenté",
    "quiz.moduleKnowledgeCheck": "Contrôle des connaissances du module {num}",
    "quiz.questionProgress": "Question {current} sur {total}",
    "quiz.previous": "Précédent",
    "quiz.back": "Retour",
    "quiz.next": "Suivant",
    "quiz.seeResults": "Voir les résultats",
    "quiz.retryQuiz": "Réessayer le quiz",
    "quiz.backToModule": "Retour au module",
    "quiz.greatJob": "Excellent travail !",
    "quiz.goodEffort": "Bon effort !",
    "quiz.keepStudying": "Continuez à étudier !",
    "quiz.scoreMessage": "Vous avez obtenu {pct}% au contrôle des connaissances du module {num}.",
    "quiz.review": "Révision",
    "quiz.yourAnswer": "Votre réponse : {answer}",
    "quiz.correct": "Bonne réponse : {answer}",
    "quiz.notAvailable": "Quiz pas encore disponible.",
    "quiz.topicNotFound": "Sujet introuvable.",
    "quiz.moduleNotFound": "Module introuvable.",
    "glossary.title": "Glossaire",
    "glossary.subtitle": "Terminologie Options et Produits Configurables ({count} termes)",
    "glossary.searchPlaceholder": "Rechercher des termes...",
    "glossary.noResults": "Aucun terme ne correspond à votre recherche.",
    "glossary.notAvailable": "Glossaire non disponible.",
    "notepad.title": "Notes",
    "notepad.placeholder": "Prenez des notes pendant votre apprentissage...",
    "notepad.charCount": "{count} caractères",
    "notepad.openNotepad": "Ouvrir le bloc-notes",
    "error.loadingContent": "Erreur de chargement du contenu",
    "error.serverRequired": "Assurez-vous de servir cette page depuis un serveur HTTP (par ex., python -m http.server). L'API fetch() ne fonctionne pas avec les URL file://.",
    "locale.en": "English",
    "locale.fr": "Français",
    "locale.de": "Deutsch",
    "locale.ja": "日本語",
    "locale.zh": "中文",
    "locale.ko": "한국어",
    "locale.es": "Español"
  },
  "course.json": {
    "id": "wc-ocp1",
    "title": "Windchill : Options et Produits Configurables 1",
    "description": "Apprenez les approches métier des produits configurables, explorez la terminologie des options et variantes, étudiez les règles et maîtrisez les ensembles d'options.",
    "prerequisite": "Windchill : Restructuration de nomenclature",
    "modules": [
      {
        "id": "m1",
        "title": "Introduction aux produits configurables",
        "description": "Examinez les stratégies métier pour la variabilité des produits, les plateformes produit, les variantes produit et les approches de configuration Windchill.",
        "estimatedMinutes": 55,
        "topicCount": 7,
        "exerciseTopicStart": 5,
        "contentFile": "modules/m1-configurable-products.json",
        "quizFile": "quizzes/q1-configurable-products.json"
      },
      {
        "id": "m2",
        "title": "Réviser les options et variantes Windchill",
        "description": "Examinez la terminologie des options et variantes, discutez des options et choix, explorez les préférences et créez des modules configurables.",
        "estimatedMinutes": 25,
        "topicCount": 5,
        "contentFile": "modules/m2-options-and-variants.json",
        "quizFile": "quizzes/q2-options-and-variants.json"
      },
      {
        "id": "m3",
        "title": "Étudier les règles des options et variantes",
        "description": "Examinez les règles d'inclusion, d'exclusion, d'activation et conditionnelles. Explorez la validation des règles et les alias d'expressions.",
        "estimatedMinutes": 20,
        "topicCount": 4,
        "exerciseTopicStart": 4,
        "contentFile": "modules/m3-rules.json",
        "quizFile": "quizzes/q3-rules.json"
      },
      {
        "id": "m4",
        "title": "Explorer les ensembles d'options",
        "description": "Définissez les ensembles d'options, explorez la gestion des modifications, affectez les ensembles d'options, appliquez les expressions et utilisez les filtres d'options.",
        "estimatedMinutes": 25,
        "topicCount": 5,
        "exerciseTopicStart": 4,
        "contentFile": "modules/m4-option-sets.json",
        "quizFile": "quizzes/q4-option-sets.json"
      }
    ]
  },
  "glossary.json": {
    "terms": [
      {
        "term": "Expression avancée",
        "definition": "Une expression qui inclut des choix, des opérateurs et des fonctions. Peut être affectée aux articles et aux liens d'utilisation d'articles pour spécifier les conditions dans lesquelles un composant doit être inclus dans la structure produit."
      },
      {
        "term": "Expression de base",
        "definition": "Des choix d'options que vous pouvez affecter aux articles et aux liens d'utilisation d'articles pour spécifier les conditions dans lesquelles un composant doit être inclus dans la structure produit."
      },
      {
        "term": "Module configurable",
        "definition": "Un article Windchill qui peut avoir un ou plusieurs articles enfants représentant des variations dans la conception et la configuration d'un composant ou d'une unité fonctionnelle."
      },
      {
        "term": "Produit configurable",
        "definition": "Un article de niveau supérieur qui représente un ensemble de variations de produit. Par exemple, une famille de produits avec différents modèles partageant certains composants standard."
      },
      {
        "term": "Structure de produit configurable",
        "definition": "Inclut des modules configurables pour permettre la création de multiples variantes de produit à partir de la même structure produit."
      },
      {
        "term": "Règle conditionnelle",
        "definition": "Une règle utilisant des instructions SI/ALORS pour spécifier quand certains choix d'options doivent être inclus, activés ou désactivés en fonction d'autres sélections de choix dans le filtre d'options."
      },
      {
        "term": "Règle d'activation",
        "definition": "Une règle qui fait apparaître uniquement des choix spécifiques à la sélection une fois qu'un certain choix cible est sélectionné."
      },
      {
        "term": "Règle d'exclusion",
        "definition": "Une règle qui restreint la sélection de choix incompatibles. Par exemple, sélectionner 110 Volts empêche de sélectionner une fréquence de 50 Hz."
      },
      {
        "term": "Alias d'expression",
        "definition": "Une instruction logique nommée qui peut être réutilisée lors de la création de règles conditionnelles, d'expressions avancées et d'autres alias. Capture des définitions communes pour la gestion globale des produits."
      },
      {
        "term": "Règle d'inclusion",
        "definition": "Une règle qui associe la sélection d'un choix d'option à un ou plusieurs choix d'options associés. La sélection du choix source sélectionne automatiquement les choix cibles."
      },
      {
        "term": "Variante de module",
        "definition": "Les articles spécifiques sélectionnés parmi les articles optionnels et les composants d'un module configurable en fonction des critères de sélection et des affectations de choix lors de la génération de variantes."
      },
      {
        "term": "Option",
        "definition": "Une caractéristique particulière du produit. Une option a un ou plusieurs choix, peut être obligatoire ou à sélection unique, et est applicable à des variations de produit spécifiques."
      },
      {
        "term": "Filtre d'options",
        "definition": "Un ensemble de critères utilisés pour filtrer la structure produit en fonction des choix affectés aux articles et de l'utilisation d'un article dans une structure."
      },
      {
        "term": "Gestionnaire d'options",
        "definition": "Un rôle de contexte Windchill ayant l'autorité de créer des options et des choix et de gérer les ensembles d'options et autres informations associées."
      },
      {
        "term": "Pool d'options",
        "definition": "Un conteneur qui regroupe toutes les options disponibles et leurs choix pour un produit. Les options et les choix sont gérés au sein du pool d'options."
      },
      {
        "term": "Ensemble d'options",
        "definition": "Un sous-ensemble d'options et de choix provenant d'un ou plusieurs pools d'options, utilisé pour définir les variations au sein d'une famille de produits. Les ensembles d'options sont des objets gérés par les modifications."
      },
      {
        "term": "Paramètre",
        "definition": "Un attribut défini localement dans le contexte d'un module configurable pour prendre en charge la logique de sélection avancée lors du processus de configuration d'article."
      },
      {
        "term": "Famille de produits",
        "definition": "Un ensemble de produits apparentés qui offrent une gamme de capacités et partagent un pourcentage substantiel des mêmes articles."
      },
      {
        "term": "Variante",
        "definition": "Un article ou une structure d'article représentant une configuration spécifique d'une structure de produit configurable, créée lors d'un processus de configuration."
      },
      {
        "term": "Spécification de variante",
        "definition": "Un enregistrement des saisies utilisateur de choix d'options et de valeurs de paramètres fournis lors d'un processus de configuration, utilisé pour générer une structure d'article variante."
      },
      {
        "term": "Support de module configurable",
        "definition": "Une préférence Windchill qui contrôle la possibilité de créer des structures produit optionnelles. Doit être définie sur Oui pour utiliser la fonctionnalité Options et Variantes."
      }
    ]
  },
  "modules/m1-configurable-products.json": {
    "id": "m1",
    "title": "Introduction aux produits configurables",
    "description": "Examinez les stratégies métier pour la variabilité des produits, discutez des considérations pour les plateformes et variantes de produits, et examinez les approches de configuration de produits avec Windchill.",
    "topics": [
      {
        "id": "m1t1",
        "title": "Stratégies métier pour la variabilité des produits",
        "estimatedMinutes": 6,
        "content": [
          {
            "type": "paragraph",
            "text": "Les entreprises manufacturières utilisent différentes stratégies métier pour livrer des produits avec des composants optionnels et personnalisables. Comprendre ces stratégies est la première étape pour configurer Windchill selon vos besoins de variabilité produit."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Cinq stratégies métier"
          },
          {
            "type": "comparison-table",
            "headers": [
              "Stratégie",
              "Description",
              "Exemple"
            ],
            "rows": [
              [
                "Assemblage à la commande",
                "Concevoir des produits avec une liste finie de choix d'options discrets pour les caractéristiques clés. La fabrication s'exécute sans implication du développement produit.",
                "Véhicules de tourisme, équipements lourds, ordinateurs"
              ],
              [
                "Assemblage sur stock",
                "Concevoir un produit général avec plusieurs variations discrètes composées de changements mineurs dans les caractéristiques.",
                "Produits de consommation en plusieurs couleurs et tailles (vêtements, appareils électroménagers)"
              ],
              [
                "Configuration à la commande",
                "Concevoir des produits flexibles qui peuvent être configurés ou personnalisés pour répondre aux besoins uniques des clients à l'aide d'un configurateur avec des règles.",
                "Équipements industriels, logiciels d'entreprise avec options interdépendantes"
              ],
              [
                "Ingénierie à la commande",
                "Comme la configuration à la commande, mais nécessite l'implication de l'équipe d'ingénierie pour la validation et la conception sur mesure par commande.",
                "Systèmes complexes (turbines, composants aéronautiques) nécessitant une revue d'ingénierie"
              ],
              [
                "Contrat",
                "Conception et fabrication entièrement sur mesure selon les spécifications du client. Produit unique par contrat.",
                "Conceptions uniques -- systèmes de défense, infrastructures personnalisées"
              ]
            ]
          },
          {
            "type": "callout",
            "variant": "insight",
            "text": "Le facteur clé de différenciation entre ces stratégies est le niveau d'implication du développement produit par commande. L'assemblage à la commande n'en requiert aucune, tandis que le contrat nécessite une ingénierie sur mesure complète pour chaque client."
          },
          {
            "type": "interactive-match",
            "prompt": "Associez chaque scénario à la bonne stratégie métier :",
            "pairs": [
              {
                "left": "Un constructeur automobile propose des packs avec des options prédéfinies comme Sport, Luxe et Base",
                "right": "Assemblage à la commande"
              },
              {
                "left": "Un fabricant de turbines conçoit chaque produit avec une revue d'ingénierie selon les spécifications du client",
                "right": "Ingénierie à la commande"
              },
              {
                "left": "Une marque de vêtements produit des chemises en 5 couleurs et 4 tailles",
                "right": "Assemblage sur stock"
              },
              {
                "left": "Un sous-traitant de défense construit un système radar unique pour un contrat militaire",
                "right": "Contrat"
              }
            ]
          }
        ],
        "keyTakeaways": [
          "Cinq stratégies métier principales existent, allant de l'assemblage sur stock (moins de personnalisation) au contrat (entièrement sur mesure)",
          "Le choix de la stratégie détermine le niveau d'implication du développement produit nécessaire par commande",
          "Windchill OCP prend principalement en charge les stratégies d'assemblage à la commande et de configuration à la commande"
        ]
      },
      {
        "id": "m1t2",
        "title": "Conception de plateforme générique",
        "estimatedMinutes": 5,
        "content": [
          {
            "type": "paragraph",
            "text": "Avant de créer des variantes de produit, les entreprises établissent d'abord une plateforme produit générique. Cette plateforme sert de fondation à partir de laquelle toutes les variations de produit sont dérivées."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Quatre étapes de la conception de plateforme"
          },
          {
            "type": "paragraph",
            "text": "La phase de conception de plateforme suit un processus structuré pour créer une fondation de produit réutilisable :"
          },
          {
            "type": "reveal-cards",
            "cards": [
              {
                "front": "Étape 1 : Analyser les exigences d'optionnalité de la plateforme",
                "back": "Analyser les exigences du nouveau produit et identifier les options nécessaires pour satisfaire ces exigences. Déterminer ce qui doit être variable par rapport à ce qui est fixe."
              },
              {
                "front": "Étape 2 : Évaluer les produits existants pour la réutilisation",
                "back": "Examiner les conceptions de variantes existantes pour la réutilisation et passer en revue les nouveaux concepts. Tirer parti de ce qui existe déjà avant de créer de nouvelles conceptions."
              },
              {
                "front": "Étape 3 : Créer la définition générique du produit",
                "back": "Développer le cadre pour prendre en charge l'optionnalité du produit. Réutiliser les articles, options et règles existants. Définir de nouvelles règles et logiques pour la sélection des options produit. Évaluer et itérer si nécessaire."
              },
              {
                "front": "Étape 4 : Publier et maintenir la plateforme",
                "back": "Après une conception et une validation réussies, publier la plateforme générique vers la planification de fabrication ou la fabrication. Gérer et modifier la plateforme selon les besoins au fil du temps."
              }
            ]
          },
          {
            "type": "callout",
            "variant": "tip",
            "text": "Une plateforme bien conçue maximise la réutilisation entre les variantes. L'objectif est de rendre les pièces communes vraiment communes et d'identifier clairement les sections variables."
          }
        ],
        "keyTakeaways": [
          "La conception de plateforme est un prérequis à la génération de variantes",
          "Toujours évaluer les produits existants pour la réutilisation avant de créer de nouvelles conceptions",
          "Le cadre de la plateforme définit quels articles sont fixes et lesquels sont variables"
        ]
      },
      {
        "id": "m1t3",
        "title": "Génération de variantes",
        "estimatedMinutes": 5,
        "content": [
          {
            "type": "paragraph",
            "text": "Une fois qu'une plateforme générique existe, des variantes de produit spécifiques peuvent être générées pour répondre aux exigences du marché ou des clients. Le processus de génération de variantes s'appuie sur la plateforme pour créer des produits configurés."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Étapes de la génération de variantes"
          },
          {
            "type": "reveal-cards",
            "cards": [
              {
                "front": "Étape 1 : Analyser les exigences spécifiques de la variante",
                "back": "Analyser les besoins spécifiques au marché ou au client. Qu'est-ce que ce client ou segment de marché particulier a besoin qui diffère de la plateforme de base ?"
              },
              {
                "front": "Étape 2 : Évaluer les plateformes existantes pour la réutilisation",
                "back": "Évaluer les plateformes génériques existantes pour sélectionner celle qui convient le mieux aux exigences. Choisir la plateforme qui nécessite le moins de personnalisation."
              },
              {
                "front": "Étape 3 : Créer la définition de la variante",
                "back": "Définir la configuration de la variante et générer les livrables tels que les structures d'articles et la documentation. Modifier la conception de la variante spécifique si nécessaire."
              },
              {
                "front": "Étape 4 : Publier et maintenir la variante",
                "back": "Une fois la variante générée et approuvée, la publier pour la fabrication. Maintenir et modifier la définition de la variante selon les besoins."
              }
            ]
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Gestion des produits configurables"
          },
          {
            "type": "paragraph",
            "text": "Les entreprises adoptent des pratiques industrielles courantes pour gérer les informations produit tout au long du processus de conception et de génération de variantes :"
          },
          {
            "type": "comparison-table",
            "headers": [
              "Pratique",
              "Description"
            ],
            "rows": [
              [
                "Structure produit modulaire",
                "Décomposer le produit en sections modulaires prenant en charge des fonctions spécifiques. Les modules peuvent être partagés entre les produits."
              ],
              [
                "Structure produit surchargée",
                "Des sections de la structure contiennent plusieurs conceptions pour satisfaire différents niveaux de capacité pour cette fonction."
              ],
              [
                "Gestion des options",
                "Définir des options et des choix pour identifier les caractéristiques variables. Affecter des choix aux conceptions dans les sections surchargées pour contrôler la sélection."
              ],
              [
                "Structure de commande",
                "Une structure d'article sans options supplémentaires, reflétant une commande de vente spécifique. Analysée, testée et validée."
              ]
            ]
          },
          {
            "type": "callout",
            "variant": "info",
            "text": "Une structure surchargée est un concept clé : elle contient TOUTES les variations de conception possibles. Lors de la génération de variantes, la structure surchargée est filtrée pour ne conserver que les articles nécessaires pour une configuration spécifique."
          }
        ],
        "keyTakeaways": [
          "La génération de variantes suit quatre étapes qui reflètent le processus de conception de plateforme",
          "Toujours évaluer les plateformes existantes avant de construire une nouvelle variante de zéro",
          "Les structures produit surchargées contiennent toutes les variations possibles ; les filtres d'options les réduisent à des configurations spécifiques"
        ]
      },
      {
        "id": "m1t4",
        "title": "Configuration de produit dans Windchill",
        "estimatedMinutes": 6,
        "content": [
          {
            "type": "paragraph",
            "text": "Windchill fournit des capacités spécifiques pour soutenir votre stratégie métier de livraison de produits configurables. Comprendre comment les stratégies métier correspondent aux fonctionnalités Windchill est essentiel pour une mise en œuvre réussie."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Stratégies métier associées à Windchill"
          },
          {
            "type": "comparison-table",
            "headers": [
              "Approche métier",
              "Capacité Windchill",
              "Fonctionnement"
            ],
            "rows": [
              [
                "Assemblage à la commande / Assemblage sur stock",
                "Options et choix pour le filtrage",
                "Les options et choix filtrent une structure produit surchargée. Les commandes sont généralement créées via un configurateur de vente externe (ATO) ou dans Windchill (ATS)."
              ],
              [
                "Configuration à la commande / Ingénierie à la commande",
                "Options basées sur des listes + paramètres",
                "Les options basées sur des listes filtrent la structure, tandis que les paramètres fournissent une logique de sélection avancée pour une configuration supplémentaire."
              ]
            ]
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Capacités Windchill pour la variabilité produit"
          },
          {
            "type": "reveal-cards",
            "cards": [
              {
                "front": "Structure de produit configurable",
                "back": "Les articles Windchill peuvent être définis comme configurables, désignant des sections destinées à avoir plusieurs conceptions. Prend en charge les structures modulaires et surchargées."
              },
              {
                "front": "Options pour la logique de sélection par filtrage",
                "back": "Définir une liste d'options et de choix fixes décrivant des configurations discrètes. Réutilisable entre les produits, avec des règles contraignant les combinaisons valides."
              },
              {
                "front": "Logique de sélection avancée (Paramètres)",
                "back": "Les paramètres fournissent une logique de sélection avancée utilisant des contraintes pour guider la saisie utilisateur pendant la configuration. Va au-delà des simples listes d'options/choix."
              },
              {
                "front": "Combinaison du filtrage et de la sélection avancée",
                "back": "D'abord filtrer une structure surchargée à l'aide d'options basées sur des listes, puis configurer davantage à l'aide de paramètres. Offre une flexibilité maximale."
              },
              {
                "front": "Génération et réutilisation de variantes",
                "back": "Créer et mettre à jour des variantes à l'aide de la logique de filtrage et de sélection. Windchill enregistre les choix d'options dans une spécification de variante et recherche les variantes existantes pour permettre la réutilisation."
              }
            ]
          },
          {
            "type": "callout",
            "variant": "insight",
            "text": "L'approche combinée est la plus puissante : utilisez les options pour le filtrage large (« Quel moteur ? »), puis les paramètres pour la configuration fine (« Quel alésage ? »). Cette approche en deux étapes gère la plupart des variabilités produit du monde réel."
          },
          {
            "type": "interactive-match",
            "prompt": "Associez chaque capacité Windchill à son objectif principal :",
            "pairs": [
              {
                "left": "Options et choix",
                "right": "Filtrer les structures surchargées à l'aide de sélections discrètes"
              },
              {
                "left": "Paramètres",
                "right": "Fournir une logique de sélection avancée avec des contraintes"
              },
              {
                "left": "Spécification de variante",
                "right": "Enregistrer les entrées utilisées pour générer une variante spécifique"
              },
              {
                "left": "Module configurable",
                "right": "Désigner les sections produit avec plusieurs variations de conception"
              }
            ]
          }
        ],
        "keyTakeaways": [
          "L'assemblage à la commande/sur stock utilise les options et choix pour le filtrage ; la configuration/ingénierie à la commande ajoute des paramètres",
          "Les options et les paramètres peuvent être combinés pour une configurabilité maximale",
          "Windchill suit les spécifications de variantes pour permettre la réutilisation des variantes entre les commandes"
        ]
      },
      {
        "id": "m1t5",
        "title": "Examiner les options et choix existants",
        "estimatedMinutes": 15,
        "isExercise": true,
        "content": [
          {
            "type": "paragraph",
            "text": "Dans cet exercice, vous allez explorer le produit PTC Motorcycle dans Windchill pour comprendre comment les pools d'options, les options, les choix et les structures produit sont organisés. Vous naviguerez dans le pool d'options, examinerez les options existantes et leurs choix, et parcourrez la structure produit pour identifier les modules configurables."
          },
          {
            "type": "callout",
            "variant": "info",
            "text": "Vous devez avoir accès au serveur de formation Windchill pour réaliser cet exercice. Connectez-vous avec votre identifiant de formation assigné."
          },
          {
            "type": "exercise",
            "exerciseId": "ex1",
            "title": "Examiner les options et choix existants",
            "objective": "Comprendre comment les pools d'options, les options, les choix et les structures produit sont organisés dans Windchill en explorant le produit PTC Motorcycle.",
            "tasks": [
              {
                "id": "ex1-t1",
                "title": "Accéder au pool d'options PTC Motorcycle",
                "steps": [
                  {
                    "action": "Connectez-vous à Windchill et naviguez vers l'onglet Parcourir. Allez dans Produits et sélectionnez PTC Motorcycle.",
                    "detail": "La zone Produits liste tous les produits auxquels vous avez accès. PTC Motorcycle est le produit configurable d'exemple utilisé tout au long de ce cours.",
                    "hint": "Utilisez l'URL fournie par votre instructeur. Vos identifiants sont généralement votre nom d'utilisateur et mot de passe de formation."
                  },
                  {
                    "action": "Cliquez sur l'onglet Pool d'options de la page du produit PTC Motorcycle.",
                    "detail": "L'onglet Pool d'options affiche toutes les options définies pour ce produit. Chaque option représente une caractéristique variable de la moto, comme la cylindrée du moteur ou la couleur.",
                    "hint": "L'onglet Pool d'options se trouve aux côtés d'autres onglets comme Détails, Structure et Modification."
                  },
                  {
                    "action": "Examinez la liste des options affichées dans le pool d'options. Notez les noms des options et le nombre de choix de chacune.",
                    "detail": "Chaque option (par ex., Cylindrée du moteur, Couleur, Emplacement des sacoches) représente une caractéristique configurable. Le nombre de choix par option détermine combien de variations cette caractéristique prend en charge.",
                    "hint": null
                  },
                  {
                    "action": "Cliquez sur l'option Cylindrée du moteur pour voir ses choix.",
                    "detail": "Les options contiennent des choix qui définissent les valeurs valides pour cette caractéristique. Pour la Cylindrée du moteur, vous verrez des choix comme 600cc, 1000cc et 1200cc. Chaque choix peut être affecté à des articles dans la structure produit.",
                    "hint": "Cliquez sur le lien du nom de l'option ou sur l'icône d'information pour ouvrir la page de détails de l'option."
                  },
                  {
                    "action": "Passez en revue les noms des choix, les descriptions et tout attribut ou image associé pour la Cylindrée du moteur.",
                    "detail": "Les choix incluent souvent des descriptions qui aident les utilisateurs à comprendre ce que chaque sélection signifie. Des choix bien documentés réduisent les erreurs de configuration lors de la génération de variantes.",
                    "hint": null
                  },
                  {
                    "action": "Revenez au Pool d'options et cliquez sur l'option Couleur. Examinez ses choix.",
                    "detail": "Remarquez comment les choix de couleur (par ex., Rouge, Bleu, Noir) suivent la même structure que les choix de cylindrée du moteur. Toutes les options suivent un modèle cohérent : nom de l'option, liste des choix et descriptions optionnelles.",
                    "hint": "Utilisez le bouton retour du navigateur ou la navigation par fil d'Ariane pour revenir au Pool d'options."
                  },
                  {
                    "action": "Revenez au Pool d'options et cliquez sur Emplacement des sacoches. Examinez ses choix actuels.",
                    "detail": "L'emplacement des sacoches contrôle où les sacoches sont montées sur la moto. Remarquez que cette option a actuellement des choix d'emplacement spécifiques. Vous modifierez cette option dans l'exercice 2.",
                    "hint": null
                  }
                ]
              },
              {
                "id": "ex1-t2",
                "title": "Parcourir les dossiers et voir la structure produit",
                "steps": [
                  {
                    "action": "Naviguez vers l'onglet Dossier de la page du produit PTC Motorcycle. Parcourez la structure des dossiers.",
                    "detail": "Les produits organisent leur contenu dans des dossiers. Parcourir les dossiers vous aide à comprendre comment les données de conception, les options et autres artefacts sont organisés dans un contexte produit.",
                    "hint": "L'onglet Dossier peut être intitulé 'Contenu du dossier' selon votre version de Windchill."
                  },
                  {
                    "action": "Utilisez la fonction Recherche pour trouver un article spécifique (par ex., recherchez 'moteur' ou 'cadre').",
                    "detail": "La recherche Windchill vous permet de trouver rapidement des articles, des documents et d'autres objets dans un produit. C'est plus rapide que de parcourir les dossiers quand vous savez ce que vous cherchez.",
                    "hint": "Utilisez la zone de recherche en haut de la page, ou allez dans l'onglet Recherche. Définissez la portée de la recherche sur le produit actuel."
                  },
                  {
                    "action": "Cliquez sur un article des résultats de recherche pour ouvrir sa page de détails. Regardez le type d'article et les autres attributs.",
                    "detail": "Chaque article a un type (par ex., Article, Assemblage) et des attributs qui définissent ses propriétés. Comprendre les types d'articles est important car les modules configurables doivent être de types d'articles spécifiques.",
                    "hint": null
                  },
                  {
                    "action": "Cliquez sur l'onglet Structure de l'article PTC Motorcycle de niveau supérieur pour voir la structure produit.",
                    "detail": "La structure produit montre comment les articles sont organisés dans une hiérarchie parent-enfant. C'est la nomenclature (BOM). Certaines sections de cette structure sont surchargées avec plusieurs options de conception.",
                    "hint": "Naviguez vers l'article PTC Motorcycle de niveau supérieur et cliquez sur l'onglet Structure."
                  },
                  {
                    "action": "Développez l'arborescence de la structure et identifiez les articles marqués comme Modules Configurables (cherchez l'icône ou la désignation de module configurable).",
                    "detail": "Les modules configurables sont des sections de la structure qui contiennent plusieurs variations de conception. Ce sont les éléments de base de la configurabilité du produit. Vous pouvez les reconnaître par leur icône ou par la désignation 'Module Configurable' dans les détails de l'article.",
                    "hint": "Les modules configurables apparaissent généralement aux points de frontière fonctionnelle majeurs de la structure, comme 'Assemblage Moteur' ou 'Assemblage Cadre'."
                  },
                  {
                    "action": "Cliquez sur un module configurable et examinez ses articles enfants. Notez comment plusieurs conceptions alternatives apparaissent sous le même module.",
                    "detail": "C'est le concept de structure surchargée du Sujet 3. Plusieurs articles enfants sous un module configurable représentent des conceptions alternatives. Lors de la génération de variantes, les filtres d'options sélectionnent les articles enfants à inclure en fonction des valeurs d'options choisies.",
                    "hint": null
                  }
                ]
              }
            ]
          }
        ],
        "keyTakeaways": [
          "Les pools d'options organisent toutes les options et choix d'un produit en un seul endroit",
          "Chaque option représente une caractéristique variable avec un ou plusieurs choix",
          "La structure produit utilise des modules configurables pour contenir plusieurs variations de conception (structure surchargée)",
          "Les choix d'options sont affectés aux articles de la structure pour contrôler quelles conceptions sont sélectionnées lors de la génération de variantes"
        ]
      },
      {
        "id": "m1t6",
        "title": "Créer une nouvelle option et un module configurable",
        "estimatedMinutes": 15,
        "isExercise": true,
        "content": [
          {
            "type": "paragraph",
            "text": "Dans cet exercice, vous allez créer une nouvelle option appelée Type de moto avec deux choix, ajouter un nouveau choix à l'option Emplacement des sacoches existante, et désigner un article comme Module Configurable et Article Final. Ces tâches montrent comment étendre la configurabilité d'un produit existant."
          },
          {
            "type": "callout",
            "variant": "warning",
            "text": "Cet exercice modifie la configuration du produit. Suivez les étapes attentivement et utilisez les noms exacts spécifiés pour assurer la cohérence avec les exercices suivants."
          },
          {
            "type": "exercise",
            "exerciseId": "ex2",
            "title": "Créer une nouvelle option et un module configurable",
            "objective": "Apprendre comment créer de nouvelles options et choix, ajouter des choix à des options existantes, et désigner des articles comme modules configurables dans Windchill.",
            "tasks": [
              {
                "id": "ex2-t1",
                "title": "Créer l'option Type de moto avec ses choix",
                "steps": [
                  {
                    "action": "Naviguez vers le produit PTC Motorcycle et ouvrez l'onglet Pool d'options.",
                    "detail": "Vous allez créer une nouvelle option dans le pool d'options de ce produit. Les nouvelles options étendent la configurabilité du produit en ajoutant de nouvelles caractéristiques variables.",
                    "hint": null
                  },
                  {
                    "action": "Cliquez sur le bouton 'Nouvelle Option' (ou utilisez le menu d'actions) pour créer une nouvelle option.",
                    "detail": "L'action Nouvelle Option ouvre un formulaire où vous définissez le nom de l'option, la description et les choix initiaux. Chaque option représente une dimension de variabilité du produit.",
                    "hint": "Cherchez une icône 'Nouvelle Option' dans la barre d'outils au-dessus du tableau du pool d'options, ou faites un clic droit pour le menu contextuel."
                  },
                  {
                    "action": "Entrez 'Type de moto' comme nom d'option et fournissez une description telle que 'Définit la catégorie d'utilisation prévue de la moto'.",
                    "detail": "Des noms d'options clairs et descriptifs aident tout le monde à comprendre ce que l'option contrôle. Le nom doit être suffisamment intuitif pour que quelqu'un configurant une variante sache exactement ce qu'il choisit.",
                    "hint": null
                  },
                  {
                    "action": "Ajoutez le premier choix : 'Tout-terrain'. Fournissez une description telle que 'Moto configurée pour la conduite tout-terrain et sur piste'.",
                    "detail": "Les choix définissent les valeurs valides pour une option. Chaque choix doit avoir un nom et une description clairs. Les motos tout-terrain ont généralement des spécifications de cadre, de suspension et de pneus différentes.",
                    "hint": "Après avoir saisi les détails de l'option, cherchez une action 'Ajouter un choix' ou 'Nouveau choix' dans le formulaire de création d'option."
                  },
                  {
                    "action": "Ajoutez le deuxième choix : 'Route/Homologué'. Fournissez une description telle que 'Moto configurée pour la conduite sur route homologuée'.",
                    "detail": "Les motos Route/Homologué nécessitent des composants différents pour respecter les réglementations routières, comme les feux, les rétroviseurs et des types de pneus spécifiques. Ces deux choix entraîneront des différences structurelles majeures dans le produit.",
                    "hint": null
                  },
                  {
                    "action": "Enregistrez la nouvelle option Type de moto. Vérifiez qu'elle apparaît dans le Pool d'options aux côtés des options existantes.",
                    "detail": "Après l'enregistrement, l'option et ses choix sont disponibles pour utilisation dans les ensembles d'options et peuvent être affectés aux articles de la structure produit. L'option fait maintenant partie du vocabulaire de configuration du produit.",
                    "hint": "Si l'option n'apparaît pas immédiatement, actualisez la vue du Pool d'options."
                  }
                ]
              },
              {
                "id": "ex2-t2",
                "title": "Ajouter un choix 'Non utilisé' à Emplacement des sacoches",
                "steps": [
                  {
                    "action": "Dans le Pool d'options, cliquez sur l'option Emplacement des sacoches existante pour l'ouvrir.",
                    "detail": "Vous modifiez une option existante en ajoutant un nouveau choix. C'est courant car les exigences produit évoluent — de nouvelles valeurs valides doivent être ajoutées aux options existantes.",
                    "hint": null
                  },
                  {
                    "action": "Cliquez sur l'action 'Nouveau choix' pour ajouter un choix à Emplacement des sacoches.",
                    "detail": "L'ajout d'un choix 'Non utilisé' permet à une variante de spécifier que les sacoches ne sont pas incluses du tout. Sans ce choix, chaque variante serait obligée d'avoir des sacoches à un emplacement quelconque.",
                    "hint": "Cherchez un bouton 'Nouveau choix' ou 'Ajouter un choix' dans la barre d'outils de la vue de détail de l'option."
                  },
                  {
                    "action": "Entrez 'Non utilisé' comme nom de choix. Ajoutez une description telle que 'Aucune sacoche n'est incluse dans cette configuration de moto'.",
                    "detail": "Un choix 'Non utilisé' ou 'Aucun' est un modèle courant dans la gestion des options. Il permet d'exclure explicitement une caractéristique plutôt que d'exiger que chaque configuration l'inclue.",
                    "hint": null
                  },
                  {
                    "action": "Enregistrez le nouveau choix et vérifiez qu'il apparaît dans la liste des choix d'Emplacement des sacoches.",
                    "detail": "L'option Emplacement des sacoches a maintenant un choix supplémentaire. Ce choix peut être utilisé dans les expressions et les règles pour contrôler si les composants de sacoche sont inclus dans la structure d'une variante.",
                    "hint": null
                  }
                ]
              },
              {
                "id": "ex2-t3",
                "title": "Désigner un article comme Module Configurable et Article Final",
                "steps": [
                  {
                    "action": "Naviguez vers l'onglet Structure et localisez l'article 'small-offroad_standalone' dans la structure produit.",
                    "detail": "Cet article représente un sous-assemblage de moto tout-terrain autonome. Vous allez le désigner comme Module Configurable (pour activer la configuration de variante) et comme Article Final (pour indiquer qu'il peut être commandé/fabriqué indépendamment).",
                    "hint": "Utilisez la fonction de recherche ou développez l'arborescence de la structure pour trouver cet article. Il peut être imbriqué à plusieurs niveaux de profondeur."
                  },
                  {
                    "action": "Faites un clic droit sur l'article (ou utilisez le menu d'actions) et sélectionnez l'option pour le définir comme 'Module Configurable'.",
                    "detail": "Marquer un article comme Module Configurable indique à Windchill que cette section de la structure prend en charge plusieurs configurations de conception. Les articles enfants sous ce module peuvent être filtrés à l'aide de choix d'options.",
                    "hint": "L'action peut se trouver sous 'Configuration' > 'Support de Module Configurable' ou un chemin de menu similaire selon votre version de Windchill."
                  },
                  {
                    "action": "De même, désignez le même article comme 'Article Final'.",
                    "detail": "Un Article Final est un produit ou un sous-assemblage qui peut être commandé, fabriqué ou livré indépendamment. Définir cet indicateur permet à l'article d'apparaître comme article final sélectionnable dans les workflows de génération de variantes.",
                    "hint": null
                  },
                  {
                    "action": "Vérifiez que l'article affiche maintenant l'icône de Module Configurable et la désignation d'Article Final dans la vue de structure.",
                    "detail": "Les indicateurs visuels dans la vue de structure confirment que les désignations ont été appliquées correctement. Cet article est maintenant prêt à participer à la configuration de produit basée sur les options.",
                    "hint": "Cherchez des icônes ou étiquettes mises à jour à côté du nom de l'article dans l'arborescence de la structure."
                  },
                  {
                    "action": "Ouvrez les détails de l'article et passez en revue les attributs pour confirmer que les deux désignations sont reflétées dans les propriétés de l'article.",
                    "detail": "La page des attributs de l'article fournit une vue définitive de tous les paramètres. Confirmer ici garantit que les changements ont été enregistrés correctement et se comporteront comme prévu lors de la génération de variantes.",
                    "hint": null
                  }
                ]
              }
            ]
          }
        ],
        "keyTakeaways": [
          "Les nouvelles options sont créées dans le Pool d'options et immédiatement disponibles pour utilisation dans le produit",
          "Des choix peuvent être ajoutés aux options existantes à mesure que les exigences produit évoluent",
          "Un choix 'Non utilisé' est un modèle courant pour permettre l'exclusion explicite d'une caractéristique",
          "Les désignations Module Configurable et Article Final contrôlent comment les articles participent à la génération de variantes"
        ]
      },
      {
        "id": "m1t7",
        "title": "Réviser les préférences Options et Variantes",
        "estimatedMinutes": 10,
        "isExercise": true,
        "content": [
          {
            "type": "paragraph",
            "text": "Dans cet exercice, vous allez explorer les préférences Options et Variantes au niveau du site et au niveau du produit. Comprendre l'héritage des préférences est important car les paramètres au niveau du site établissent des valeurs par défaut que les produits peuvent remplacer pour leurs besoins spécifiques."
          },
          {
            "type": "callout",
            "variant": "info",
            "text": "Cet exercice nécessite de se connecter en tant que différents utilisateurs (wcadmin pour le niveau site, Anna Chen pour le niveau produit). Votre instructeur fournira les identifiants."
          },
          {
            "type": "exercise",
            "exerciseId": "ex3",
            "title": "Réviser les préférences Options et Variantes",
            "objective": "Comprendre comment les préférences Options et Variantes sont configurées au niveau du site par rapport au niveau du produit, et comment l'héritage fonctionne entre eux.",
            "tasks": [
              {
                "id": "ex3-t1",
                "title": "Se connecter en tant qu'administrateur",
                "steps": [
                  {
                    "action": "Déconnectez-vous de votre session actuelle et connectez-vous en tant que 'wcadmin' (le compte administrateur du site).",
                    "detail": "Les administrateurs du site ont accès aux paramètres de préférences au niveau du site qui s'appliquent globalement à tous les produits. Ces paramètres établissent la configuration de base pour la fonctionnalité Options et Variantes.",
                    "hint": "Le mot de passe wcadmin sera fourni par votre instructeur. Utilisez la même URL Windchill."
                  }
                ]
              },
              {
                "id": "ex3-t2",
                "title": "Voir les préférences au niveau du site",
                "steps": [
                  {
                    "action": "Naviguez vers Site > Utilitaires > Gestion des préférences (ou Site > Administration > Préférences selon votre version).",
                    "detail": "Les préférences au niveau du site établissent le comportement par défaut pour tous les produits et contextes du système. Toutes les préférences définies ici s'appliquent sauf si elles sont remplacées à un niveau inférieur (organisation ou produit).",
                    "hint": "Cherchez 'Gestion des préférences' dans la zone d'administration du site. Vous devrez peut-être développer la section Utilitaires ou Administration."
                  },
                  {
                    "action": "Recherchez ou naviguez vers la catégorie de préférences 'Options et Variantes'. Passez en revue les préférences disponibles et leurs valeurs actuelles.",
                    "detail": "Les préférences clés incluent 'Support de Module Configurable' (doit être Oui pour utiliser O&V), 'Partage de Pool d'Options', et divers paramètres par défaut pour le comportement de génération de variantes. Notez quelles préférences sont activées et lesquelles sont désactivées au niveau du site.",
                    "hint": "Vous pouvez filtrer ou rechercher 'Options' ou 'Configurable' dans la liste des préférences pour trouver les paramètres pertinents."
                  }
                ]
              },
              {
                "id": "ex3-t3",
                "title": "Se connecter en tant que chef de produit",
                "steps": [
                  {
                    "action": "Déconnectez-vous de wcadmin et connectez-vous en tant que 'Anna Chen' (ou l'utilisateur chef de produit désigné).",
                    "detail": "Les chefs de produit travaillent dans des contextes produit spécifiques et peuvent remplacer les préférences au niveau du site pour leurs produits. Cela montre comment différents rôles expérimentent différentes configurations de préférences.",
                    "hint": "Le nom d'utilisateur et le mot de passe d'Anna Chen seront fournis par votre instructeur."
                  }
                ]
              },
              {
                "id": "ex3-t4",
                "title": "Voir les préférences au niveau produit et comparer",
                "steps": [
                  {
                    "action": "Naviguez vers le produit PTC Motorcycle, puis accédez à ses paramètres de préférences (généralement sous Utilitaires du produit ou Administration du produit).",
                    "detail": "Les préférences au niveau produit remplacent les valeurs par défaut au niveau du site pour ce produit spécifique. Cela permet à différents produits d'avoir différentes configurations Options et Variantes.",
                    "hint": "Le chemin peut être Produit > Utilitaires > Gestion des préférences ou similaire."
                  },
                  {
                    "action": "Trouvez les préférences 'Options et Variantes' au niveau produit. Comparez-les aux paramètres au niveau du site que vous avez notés précédemment.",
                    "detail": "Remarquez quelles préférences sont héritées du niveau site (affichées comme héritées ou grisées) et lesquelles ont été explicitement définies au niveau produit. Les remplacements au niveau produit ont priorité sur les paramètres au niveau site pour ce produit uniquement.",
                    "hint": null
                  },
                  {
                    "action": "Notez la valeur de la préférence 'Support de Module Configurable'. Confirmez qu'elle est définie sur 'Oui' pour le produit PTC Motorcycle.",
                    "detail": "Le Support de Module Configurable doit être activé (défini sur 'Oui') pour que la fonctionnalité Options et Variantes fonctionne dans un produit. C'est la préférence la plus critique — si elle est définie sur 'Non', vous ne pouvez pas créer de modules configurables ni utiliser la génération de variantes basée sur les options pour ce produit.",
                    "hint": "Si cette préférence est définie au niveau du site et héritée, elle s'affichera comme 'Oui (Hérité)'. Si définie au niveau produit, elle s'affichera comme 'Oui' avec un indicateur de niveau produit."
                  }
                ]
              }
            ]
          }
        ],
        "keyTakeaways": [
          "Les préférences au niveau du site établissent le comportement par défaut pour tous les produits",
          "Les préférences au niveau produit peuvent remplacer les valeurs par défaut au niveau du site pour des produits spécifiques",
          "Le Support de Module Configurable doit être défini sur Oui pour utiliser la fonctionnalité Options et Variantes",
          "Comprendre l'héritage des préférences aide à diagnostiquer les problèmes lorsque les fonctionnalités O&V ne sont pas disponibles dans des contextes spécifiques"
        ]
      }
    ]
  },
  "modules/m2-options-and-variants.json": {
    "id": "m2",
    "title": "Réviser les options et variantes Windchill",
    "description": "Examinez la terminologie des options et variantes, discutez des options et choix, explorez les structures configurables, comparez les approches de configuration et passez en revue les préférences clés.",
    "topics": [
      {
        "id": "m2t1",
        "title": "Terminologie des options et variantes",
        "estimatedMinutes": 5,
        "content": [
          {
            "type": "paragraph",
            "text": "Les Options et Variantes (O&V) dans Windchill utilisent un vocabulaire riche de termes spécialisés. Maîtriser cette terminologie est essentiel avant de travailler avec des produits configurables, car ces termes apparaissent dans toute l'interface et la documentation Windchill."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Termes clés O&V"
          },
          {
            "type": "comparison-table",
            "headers": [
              "Terme",
              "Catégorie",
              "Définition"
            ],
            "rows": [
              [
                "Expression avancée",
                "Logique",
                "Inclut des choix, des opérateurs et des fonctions. Peut être affectée aux articles et aux liens d'utilisation d'articles pour définir des critères de sélection complexes."
              ],
              [
                "Logique de sélection avancée",
                "Logique",
                "Logique pour un module configurable utilisant des paramètres et des contraintes pour guider la saisie utilisateur lors de la configuration."
              ],
              [
                "Expression de base",
                "Logique",
                "Choix d'options affectables aux articles et aux liens d'utilisation pour spécifier quand un composant est inclus dans une variante."
              ],
              [
                "Règle conditionnelle",
                "Logique",
                "Instructions SI/ALORS spécifiant quand des choix doivent être inclus, activés ou désactivés en fonction d'autres sélections."
              ],
              [
                "Module configurable",
                "Structure",
                "Un article Windchill avec des articles enfants représentant des variations de conception. L'élément de base pour la variabilité des produits."
              ],
              [
                "Structure de produit configurable",
                "Structure",
                "Une structure produit contenant des modules configurables qui prennent en charge plusieurs variantes de produit."
              ],
              [
                "Règle d'activation",
                "Logique",
                "Fait apparaître uniquement des choix spécifiques dans la liste de sélection une fois qu'un choix cible est sélectionné."
              ],
              [
                "Règle d'exclusion",
                "Logique",
                "Restreint la sélection de choix incompatibles, empêchant les configurations invalides."
              ],
              [
                "Règle d'inclusion",
                "Logique",
                "Associe la sélection d'un choix pour inclure automatiquement les choix associés."
              ],
              [
                "Filtre d'options",
                "Gestion",
                "Critères utilisés pour filtrer une structure produit en fonction des choix affectés aux articles."
              ],
              [
                "Gestionnaire d'options",
                "Gestion",
                "Un rôle de contexte Windchill responsable de la création des options et des choix et de la maintenance des ensembles d'options."
              ],
              [
                "Paramètre",
                "Logique",
                "Un attribut au sein d'un module configurable utilisé pour la logique de sélection avancée avec des contraintes."
              ],
              [
                "Famille de produits",
                "Structure",
                "Un ensemble de produits apparentés partageant une proportion importante d'articles, défini par un ensemble d'options et une structure de produit configurable."
              ],
              [
                "Variante",
                "Structure",
                "Un article ou une structure représentant une configuration spécifique, créée lors du processus de configuration."
              ],
              [
                "Spécification de variante",
                "Gestion",
                "Un enregistrement des saisies utilisateur (choix et valeurs de paramètres) utilisé pour générer une variante spécifique."
              ]
            ]
          },
          {
            "type": "callout",
            "variant": "insight",
            "text": "Ces 15 termes se répartissent en trois catégories : les termes de Structure (module configurable, structure de produit configurable, famille de produits, variante) définissent comment les produits sont organisés ; les termes de Logique (expressions, règles, paramètres) définissent comment les configurations sont déterminées ; les termes de Gestion (filtre d'options, gestionnaire d'options, spécification de variante) définissent comment les configurations sont administrées."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Testez vos connaissances"
          },
          {
            "type": "interactive-match",
            "prompt": "Associez chaque terme O&V à sa définition :",
            "pairs": [
              {
                "left": "Module configurable",
                "right": "Un article Windchill avec des articles enfants représentant des variations de conception"
              },
              {
                "left": "Spécification de variante",
                "right": "Un enregistrement des saisies utilisateur utilisé pour générer une variante spécifique"
              },
              {
                "left": "Règle d'exclusion",
                "right": "Restreint la sélection de choix incompatibles"
              },
              {
                "left": "Filtre d'options",
                "right": "Critères pour filtrer la structure produit en fonction des choix affectés"
              }
            ]
          }
        ],
        "keyTakeaways": [
          "Les Options et Variantes comptent un vocabulaire de plus de 15 termes spécialisés que vous devez comprendre",
          "Les termes se répartissent en trois catégories : structure (module configurable, famille de produits), logique (expressions, règles, paramètres) et gestion (filtre d'options, gestionnaire d'options)",
          "La compréhension de la terminologie est essentielle avant de travailler avec O&V dans Windchill"
        ]
      },
      {
        "id": "m2t2",
        "title": "Options et choix",
        "estimatedMinutes": 5,
        "content": [
          {
            "type": "paragraph",
            "text": "Les options et les choix sont les éléments fondamentaux pour définir la variabilité des produits dans Windchill. Une option représente une caractéristique particulière du produit, et chaque option possède un ou plusieurs choix qui définissent les valeurs valides pour cette caractéristique."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Fonctionnement des options et des choix"
          },
          {
            "type": "paragraph",
            "text": "Une option est une caractéristique particulière du produit qui peut varier selon les configurations. Chaque option possède un à plusieurs choix disponibles. Les options peuvent être marquées comme obligatoires (l'utilisateur doit sélectionner un choix) ou à sélection unique (un seul choix peut être sélectionné à la fois). Les options s'appliquent à des variations de produit spécifiques, et les choix peuvent être affectés aux articles, aux occurrences ou aux liens d'utilisation dans la structure produit."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Pool d'options vs. Ensemble d'options"
          },
          {
            "type": "paragraph",
            "text": "Les options et les choix sont organisés dans deux conteneurs clés : le pool d'options et l'ensemble d'options. Comprendre la relation entre ces deux éléments est essentiel pour gérer la configurabilité des produits."
          },
          {
            "type": "reveal-cards",
            "cards": [
              {
                "front": "Pool d'options",
                "back": "Le pool d'options contient TOUTES les options et les choix définis pour un contexte produit. C'est le référentiel maître à partir duquel les ensembles d'options puisent leur contenu. Considérez-le comme le catalogue complet de chaque caractéristique variable possible."
              },
              {
                "front": "Ensemble d'options",
                "back": "Un ensemble d'options est une collection sélectionnée d'options, de choix et de règles utilisée pour définir les configurations au sein d'une famille de produits spécifique. C'est un sous-ensemble du pool d'options, ne contenant que les options pertinentes pour une ligne de produits ou un scénario de configuration particulier."
              },
              {
                "front": "Pourquoi deux conteneurs ?",
                "back": "Le pool d'options peut contenir des options pour de nombreuses familles de produits. Un ensemble d'options ne sélectionne que les options pertinentes pour une famille de produits spécifique. Cette séparation permet la réutilisation — la même option (par ex., Couleur) peut apparaître dans plusieurs ensembles d'options pour différentes familles de produits."
              }
            ]
          },
          {
            "type": "callout",
            "variant": "tip",
            "text": "Rappelez-vous : le pool d'options est le surensemble, et l'ensemble d'options est un sous-ensemble sélectionné. Un produit peut avoir de nombreuses options dans son pool, mais l'ensemble d'options d'une famille de produits spécifique ne contient que les options pertinentes pour les configurations de cette famille."
          }
        ],
        "keyTakeaways": [
          "Une option représente une caractéristique variable du produit ; chaque option possède un ou plusieurs choix",
          "Les options peuvent être obligatoires ou à sélection unique, et les choix peuvent être affectés aux articles, aux occurrences ou aux liens d'utilisation",
          "Le pool d'options est le référentiel maître de toutes les options et choix pour un contexte produit",
          "Un ensemble d'options est un sous-ensemble sélectionné du pool d'options utilisé pour définir les configurations d'une famille de produits spécifique"
        ]
      },
      {
        "id": "m2t3",
        "title": "Éléments d'une structure configurable",
        "estimatedMinutes": 5,
        "content": [
          {
            "type": "paragraph",
            "text": "Une structure configurable dans Windchill contient à la fois des articles standard (présents dans chaque variante) et des articles optionnels (inclus uniquement lorsque des choix spécifiques sont sélectionnés). Trois objets configurables clés forment une hiérarchie qui définit comment la variabilité du produit est capturée et résolue."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Trois objets configurables"
          },
          {
            "type": "comparison-table",
            "headers": [
              "Objet",
              "Rôle",
              "Description"
            ],
            "rows": [
              [
                "Produit configurable",
                "Article final de niveau supérieur",
                "Le produit de niveau supérieur qui représente un ensemble de variations de produit. C'est le point d'entrée pour la configuration et il contient la structure surchargée complète."
              ],
              [
                "Module configurable",
                "Composant configurable",
                "Un composant configurable qui capture la variabilité au niveau du composant. Représenté par une structure surchargée contenant toutes les variations de conception pour cette section du produit."
              ],
              [
                "Variante de module",
                "Sélection spécifique",
                "Les articles spécifiques sélectionnés parmi les articles optionnels d'un module configurable, en fonction des critères de sélection et des choix. Représente une configuration résolue d'un module."
              ]
            ]
          },
          {
            "type": "callout",
            "variant": "info",
            "text": "Une structure surchargée est une structure qui contient TOUTES les variations de conception possibles pour un module configurable. Lors du processus de configuration, les filtres d'options réduisent cette structure surchargée aux seuls articles nécessaires pour une configuration spécifique, produisant une variante de module."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Hiérarchie des objets configurables"
          },
          {
            "type": "paragraph",
            "text": "Les trois objets configurables forment une hiérarchie claire du plus large au plus spécifique. Comprendre cette hiérarchie est essentiel pour travailler avec les structures configurables."
          },
          {
            "type": "interactive-sort",
            "prompt": "Classez les objets configurables du niveau le plus élevé (le plus large) au niveau le plus bas (le plus spécifique) :",
            "correctOrder": [
              "Produit configurable",
              "Module configurable",
              "Variante de module"
            ]
          }
        ],
        "keyTakeaways": [
          "Trois objets configurables forment une hiérarchie : Produit configurable, Module configurable et Variante de module",
          "Les modules configurables capturent la variabilité à l'aide de structures surchargées contenant toutes les variations de conception",
          "Les variantes de module sont les articles spécifiques sélectionnés d'un module configurable après application des filtres d'options",
          "Une structure configurable contient à la fois des articles standard (toujours présents) et des articles optionnels (inclus conditionnellement)"
        ]
      },
      {
        "id": "m2t4",
        "title": "Configuration descendante et ascendante",
        "estimatedMinutes": 5,
        "content": [
          {
            "type": "paragraph",
            "text": "Windchill prend en charge deux approches pour créer des produits configurables : descendante (en commençant dans Windchill) et ascendante (en commençant dans Creo). L'approche que vous choisissez dépend de l'origine de la conception de votre produit et de la façon dont votre organisation gère les données CAO et PLM."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Comparaison des deux approches"
          },
          {
            "type": "comparison-table",
            "headers": [
              "Aspect",
              "Descendante (Windchill en premier)",
              "Ascendante (Creo en premier)"
            ],
            "rows": [
              [
                "Point de départ",
                "Créer la structure d'articles dans Windchill en premier",
                "Créer le produit configurable (assemblage surchargé) dans Creo en premier"
              ],
              [
                "Définition des options",
                "Créer le pool d'options et l'ensemble d'options dans Windchill, puis affecter les choix aux articles",
                "Ouvrir l'assemblage surchargé dans Creo, l'archiver dans Windchill, puis définir les options et les choix dans Windchill"
              ],
              [
                "Flux de la structure",
                "Générer la structure CAO à partir de la structure Windchill, propager vers Creo",
                "Archiver l'assemblage Creo dans Windchill, désigner comme produit configurable, affecter les choix"
              ],
              [
                "Configuration",
                "Configurer la structure d'articles dans Windchill à l'aide de la spécification de variante, puis ouvrir dans Creo",
                "Configurer la variante dans Creo, archiver dans Windchill, vérifier les structures de variantes"
              ],
              [
                "Limitation des expressions",
                "Seules les expressions de base sont transmises de Windchill vers Creo",
                "Seules les expressions de base sont transmises de Windchill vers Creo"
              ],
              [
                "Idéal pour",
                "Les organisations où le PLM pilote la structure produit",
                "Les organisations où la conception CAO pilote la structure produit"
              ]
            ]
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Flux de travail descendant"
          },
          {
            "type": "paragraph",
            "text": "Dans l'approche descendante, vous commencez par créer la structure d'articles dans Windchill : créer le pool d'options, créer l'ensemble d'options, configurer les modules configurables et affecter les choix aux articles. Ensuite, vous générez la structure CAO et configurez la structure d'articles. Dans Creo, vous ouvrez le produit configurable, l'archivez, configurez à l'aide d'une spécification de variante et associez la variante."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Flux de travail ascendant"
          },
          {
            "type": "paragraph",
            "text": "Dans l'approche ascendante, vous commencez dans Creo en ouvrant l'assemblage surchargé et en l'archivant dans Windchill. Ensuite, dans Windchill, vous définissez les options et les choix, créez et affectez l'ensemble d'options, désignez le produit configurable, affectez les choix, configurez et propagez les choix vers la CAO. De retour dans Creo, vous passez en revue les affectations de choix, configurez la variante et archivez. Enfin, vous vérifiez les structures de variantes dans Windchill."
          },
          {
            "type": "callout",
            "variant": "warning",
            "text": "Quelle que soit l'approche utilisée, seules les expressions de base sont transmises de Windchill vers Creo. Les expressions avancées restent uniquement dans Windchill. C'est une limitation critique à garder à l'esprit lors de la planification de votre stratégie de configuration."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Associez les étapes"
          },
          {
            "type": "interactive-match",
            "prompt": "Associez chaque étape à la bonne approche de configuration :",
            "pairs": [
              {
                "left": "Créer la structure d'articles dans Windchill en premier",
                "right": "Descendante"
              },
              {
                "left": "Ouvrir l'assemblage surchargé dans Creo en premier",
                "right": "Ascendante"
              },
              {
                "left": "Générer la structure CAO depuis Windchill",
                "right": "Descendante"
              },
              {
                "left": "Archiver l'assemblage Creo dans Windchill, puis définir les options",
                "right": "Ascendante"
              }
            ]
          }
        ],
        "keyTakeaways": [
          "La configuration descendante commence dans Windchill et se propage vers Creo ; l'ascendante commence dans Creo et se propage vers Windchill",
          "Seules les expressions de base sont transférées entre Windchill et Creo — les expressions avancées restent uniquement dans Windchill",
          "Les deux approches aboutissent finalement à des structures de variantes vérifiées dans les deux systèmes",
          "Le choix de l'approche dépend du fait que le PLM ou la CAO pilote votre structure produit"
        ]
      },
      {
        "id": "m2t5",
        "title": "Préférences des options et variantes",
        "estimatedMinutes": 5,
        "content": [
          {
            "type": "paragraph",
            "text": "Windchill utilise un ensemble de préférences pour contrôler le comportement des Options et Variantes. La préférence la plus critique est le Support de module configurable, qui doit être défini sur Oui avant que toute fonctionnalité O&V puisse être utilisée. Les préférences suivent un modèle d'héritage des conteneurs de niveau supérieur vers les contextes de niveau inférieur."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Préférences O&V clés"
          },
          {
            "type": "reveal-cards",
            "cards": [
              {
                "front": "Support de module configurable",
                "back": "Contrôle la possibilité de créer des structures produit optionnelles. La valeur par défaut est Non. Doit être défini sur Oui pour utiliser toute fonctionnalité O&V. C'est la préférence maîtresse — si elle est à Non, les modules configurables ne peuvent pas être créés."
              },
              {
                "front": "Logique avancée",
                "back": "Active ou désactive la logique de sélection avancée utilisant des paramètres et des contraintes au sein des modules configurables. Nécessaire pour les scénarios de configuration à la commande et d'ingénierie à la commande."
              },
              {
                "front": "Format d'affichage des choix",
                "back": "Contrôle comment les choix sont affichés aux utilisateurs lors de la configuration. Les possibilités incluent l'affichage du nom du choix, du numéro, ou des deux. Affecte l'expérience utilisateur lors de la spécification de variante."
              },
              {
                "front": "Expressions prises en charge",
                "back": "Détermine quels types d'expressions sont disponibles : expressions de base uniquement, ou expressions de base et avancées. Limite la complexité de la logique de sélection qui peut être créée."
              }
            ]
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Héritage des préférences et rôles"
          },
          {
            "type": "paragraph",
            "text": "Les préférences O&V sont héritées des conteneurs de niveau supérieur (niveau site) vers les contextes de niveau inférieur (organisation, produit). Les préférences définies au niveau du site servent de valeurs par défaut. Les contextes de niveau inférieur peuvent remplacer les valeurs héritées ou les conserver telles quelles. Les préférences peuvent également être verrouillées à un niveau supérieur pour empêcher les remplacements de niveau inférieur."
          },
          {
            "type": "comparison-table",
            "headers": [
              "Rôle",
              "Portée",
              "Capacité"
            ],
            "rows": [
              [
                "Administrateur du site",
                "Site Windchill complet",
                "Définit les préférences par défaut à l'échelle du site qui s'appliquent à toutes les organisations et produits sauf remplacement."
              ],
              [
                "Administrateur d'organisation",
                "Organisation spécifique",
                "Peut remplacer les préférences au niveau du site pour son organisation. Les paramètres s'appliquent à tous les produits de l'organisation."
              ],
              [
                "Chef de produit",
                "Produit spécifique",
                "Peut remplacer les préférences au niveau de l'organisation pour son contexte produit. Niveau de contrôle le plus granulaire."
              ],
              [
                "Gestionnaire de bibliothèque",
                "Bibliothèque spécifique",
                "Peut remplacer les préférences pour les contextes de bibliothèque, contrôlant le comportement O&V pour le contenu partagé de la bibliothèque."
              ]
            ]
          },
          {
            "type": "callout",
            "variant": "tip",
            "text": "Si les fonctionnalités O&V ne sont pas disponibles dans un contexte produit spécifique, la première chose à vérifier est la préférence Support de module configurable. Vérifiez qu'elle est définie sur Oui au niveau approprié (site, organisation ou produit). Vérifiez également si un verrouillage de niveau supérieur empêche la modification de la préférence."
          }
        ],
        "keyTakeaways": [
          "Le Support de module configurable doit être défini sur Oui pour utiliser toute fonctionnalité Options et Variantes — sa valeur par défaut est Non",
          "Les préférences sont héritées des niveaux supérieurs (site) vers les niveaux inférieurs (organisation, produit) et peuvent être verrouillées ou remplacées",
          "Quatre rôles peuvent modifier les préférences O&V : Administrateur du site, Administrateur d'organisation, Chef de produit et Gestionnaire de bibliothèque",
          "Comprendre l'héritage des préférences est essentiel pour diagnostiquer les problèmes O&V dans des contextes produit spécifiques"
        ]
      }
    ]
  },
  "modules/m3-rules.json": {
    "id": "m3",
    "title": "Étudier les règles des options et variantes",
    "description": "Examinez les règles d'inclusion, d'exclusion, d'activation et conditionnelles. Explorez la validation des règles et les alias d'expressions.",
    "exerciseTopicStart": 4,
    "topics": [
      {
        "id": "m3t1",
        "title": "Types de règles et logique métier",
        "estimatedMinutes": 5,
        "content": [
          {
            "type": "paragraph",
            "text": "Les règles des options et variantes définissent les combinaisons valides de choix pouvant être sélectionnés ensemble lors de la configuration d'un produit. Windchill fournit quatre types de règles qui contrôlent les interactions entre les choix, garantissant que seules des configurations de produit valides peuvent être créées."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Quatre types de règles"
          },
          {
            "type": "comparison-table",
            "headers": [
              "Type de règle",
              "Description",
              "Exemple"
            ],
            "rows": [
              [
                "Règle d'inclusion",
                "Associe la sélection d'un choix à des choix associés. Lorsqu'un choix source est sélectionné, les choix cibles sont automatiquement sélectionnés également.",
                "Pays=États-Unis inclut automatiquement Tension=110 Volts"
              ],
              [
                "Règle d'exclusion",
                "Restreint la sélection simultanée de choix incompatibles. Lorsqu'un choix source est sélectionné, les choix cibles sont interdits.",
                "Tension=110V exclut Fréquence=50Hz car ils sont incompatibles"
              ],
              [
                "Règle d'activation",
                "Fait apparaître uniquement des choix spécifiques à la sélection une fois qu'un choix source est sélectionné. Contrôle quels choix d'options sont disponibles en fonction d'une condition.",
                "La sélection du Choix 1 active les Choix 7, 8, 13 et désactive les Choix 9, 12"
              ],
              [
                "Règle conditionnelle",
                "Instructions SI/ALORS spécifiant quand des choix doivent être inclus, activés ou désactivés. Fournit une logique complexe à conditions multiples.",
                "SI les Choix 1 ET 4 sont sélectionnés, ALORS les Choix 7, 8 et 13 sont désactivés"
              ]
            ]
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Méthodes de logique métier"
          },
          {
            "type": "paragraph",
            "text": "Windchill fournit plusieurs méthodes pour implémenter la logique métier qui contrôle la configuration des produits. Chaque méthode remplit un objectif spécifique dans le cadre global des règles :"
          },
          {
            "type": "reveal-cards",
            "cards": [
              {
                "front": "Conception d'option",
                "back": "Permet des actions sur les options au sein du pool d'options. C'est la base pour définir les caractéristiques variables d'un produit et les choix disponibles pour chaque caractéristique."
              },
              {
                "front": "Règles d'inclusion",
                "back": "Capturent les associations logiques entre les caractéristiques du produit. Lorsqu'un choix est sélectionné, les choix associés sont automatiquement inclus pour maintenir l'intégrité du produit."
              },
              {
                "front": "Règles d'exclusion",
                "back": "Capturent les choix incompatibles qui ne doivent pas être sélectionnés ensemble. Empêchent les combinaisons invalides qui entraîneraient des produits non fonctionnels ou non fabricables."
              },
              {
                "front": "Règles d'activation",
                "back": "Contrôlent quels choix d'options sont disponibles en fonction d'une condition. Ajustent dynamiquement les choix visibles en fonction des sélections précédentes pour guider les utilisateurs vers des configurations valides."
              },
              {
                "front": "Règles conditionnelles",
                "back": "Constructions SI/ALORS pour la sélection de choix dans le filtre d'options. Fournissent la logique la plus flexible et la plus complexe pour contrôler les interactions entre les choix à travers plusieurs options."
              }
            ]
          },
          {
            "type": "callout",
            "variant": "insight",
            "text": "Windchill vérifie que les nouvelles règles ne sont pas en conflit avec les règles existantes et ne les dupliquent pas. Cette validation intégrée des règles empêche une logique contradictoire qui pourrait rendre certaines configurations de produit impossibles ou ambiguës."
          },
          {
            "type": "interactive-match",
            "prompt": "Associez chaque type de règle à son comportement :",
            "pairs": [
              {
                "left": "Règle d'inclusion",
                "right": "Sélectionne automatiquement les choix associés lorsqu'un choix source est sélectionné"
              },
              {
                "left": "Règle d'exclusion",
                "right": "Empêche la sélection simultanée de choix incompatibles"
              },
              {
                "left": "Règle d'activation",
                "right": "Contrôle quels choix sont visibles ou disponibles en fonction d'une condition"
              },
              {
                "left": "Règle conditionnelle",
                "right": "Utilise la logique SI/ALORS pour activer ou désactiver des choix selon plusieurs conditions"
              }
            ]
          }
        ],
        "keyTakeaways": [
          "Quatre types de règles contrôlent les combinaisons de choix valides : inclusion, exclusion, activation et conditionnelle",
          "Les règles d'inclusion forcent la sélection automatique des choix associés ensemble",
          "Les règles d'exclusion empêchent la sélection de combinaisons incompatibles",
          "Windchill valide les règles pour prévenir les conflits et les doublons"
        ]
      },
      {
        "id": "m3t2",
        "title": "Règles d'inclusion, d'exclusion et conditionnelles",
        "estimatedMinutes": 5,
        "content": [
          {
            "type": "paragraph",
            "text": "Les règles d'inclusion, d'exclusion et conditionnelles forment le cœur de la logique de configuration des produits dans Windchill. Chaque type de règle traite un aspect différent de la façon dont les choix sont liés les uns aux autres, de la sélection automatique à l'application de l'incompatibilité en passant par les scénarios complexes à conditions multiples."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Détails et exemples de règles"
          },
          {
            "type": "reveal-cards",
            "cards": [
              {
                "front": "Règle d'inclusion",
                "back": "Identifie les choix cibles qui sont automatiquement sélectionnés lorsqu'un choix source est sélectionné. Par exemple, lorsque le Choix 1 est sélectionné, les Choix 7 et 13 sont automatiquement inclus. Cela garantit que les caractéristiques dépendantes sont toujours sélectionnées ensemble."
              },
              {
                "front": "Règle d'exclusion",
                "back": "Définit les choix incompatibles qui ne peuvent pas être sélectionnés en même temps qu'un choix source. Par exemple, lorsque le Choix 1 est sélectionné, le Choix 9 est interdit. Cela empêche les utilisateurs de créer des configurations de produit invalides avec des caractéristiques conflictuelles."
              },
              {
                "front": "Règle conditionnelle",
                "back": "Utilise la logique SI/ALORS pour gérer des scénarios complexes à choix multiples. Par exemple, SI vous sélectionnez les Choix 1 et 4, alors les Choix 7, 8 et 13 sont désactivés, laissant uniquement les Choix 9 et 12 disponibles. Cela fournit le contrôle le plus flexible sur les interactions entre les choix."
              }
            ]
          },
          {
            "type": "callout",
            "variant": "tip",
            "text": "Les règles d'inclusion et d'exclusion gèrent des relations simples un-à-un ou un-à-plusieurs entre les choix. Lorsque vous avez besoin d'une logique qui dépend de la sélection simultanée de plusieurs choix sources, utilisez des règles conditionnelles avec des instructions SI/ALORS."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Comment les règles fonctionnent ensemble"
          },
          {
            "type": "paragraph",
            "text": "En pratique, les produits utilisent une combinaison de ces trois types de règles. Les règles d'inclusion garantissent que les dépendances sont respectées, les règles d'exclusion empêchent les conflits, et les règles conditionnelles gèrent les interactions complexes qui ne peuvent pas être exprimées par une simple logique d'inclusion ou d'exclusion. Ensemble, elles forment un système de contraintes complet qui guide les utilisateurs vers des configurations valides."
          },
          {
            "type": "comparison-table",
            "headers": [
              "Type de règle",
              "Comportement Source → Cible",
              "Cas d'utilisation"
            ],
            "rows": [
              [
                "Inclusion",
                "Source sélectionnée → Cibles auto-sélectionnées",
                "Caractéristiques dépendantes qui doivent toujours apparaître ensemble"
              ],
              [
                "Exclusion",
                "Source sélectionnée → Cibles interdites",
                "Caractéristiques incompatibles qui ne peuvent pas coexister"
              ],
              [
                "Conditionnelle",
                "SI sources multiples → ALORS cibles activées/désactivées",
                "Scénarios complexes où le résultat dépend d'une combinaison de sélections"
              ]
            ]
          }
        ],
        "keyTakeaways": [
          "Les règles d'inclusion sélectionnent automatiquement les choix associés lorsqu'un choix source est sélectionné",
          "Les règles d'exclusion empêchent les sélections conflictuelles d'être choisies ensemble",
          "Les règles conditionnelles fournissent une logique SI/ALORS complexe pour les scénarios à choix multiples"
        ]
      },
      {
        "id": "m3t3",
        "title": "Règles d'activation et alias d'expressions",
        "estimatedMinutes": 5,
        "content": [
          {
            "type": "paragraph",
            "text": "Les règles d'activation et les alias d'expressions étendent le cadre des règles avec des capacités supplémentaires. Les règles d'activation contrôlent la visibilité et la disponibilité des choix en fonction des sélections précédentes, tandis que les alias d'expressions simplifient la création de règles complexes en encapsulant des instructions logiques réutilisables."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Règles d'activation"
          },
          {
            "type": "paragraph",
            "text": "Les règles d'activation contrôlent quels choix d'options sont disponibles une fois qu'un choix source est sélectionné. Contrairement aux règles d'inclusion ou d'exclusion qui forcent ou empêchent des sélections, les règles d'activation ajustent dynamiquement les choix visibles. Par exemple, la sélection du Choix 1 active les Choix 7, 8 et 13 tout en désactivant les Choix 9 et 12. Seuls les choix activés apparaissent comme options sélectionnables lors de la configuration."
          },
          {
            "type": "comparison-table",
            "headers": [
              "Aspect",
              "Règles d'activation",
              "Règles conditionnelles"
            ],
            "rows": [
              [
                "Déclencheur",
                "Sélection d'un seul choix source",
                "Sélection de plusieurs choix sources (SI/ALORS)"
              ],
              [
                "Effet",
                "Active ou désactive des choix spécifiques pour la visibilité",
                "Active ou désactive des choix en fonction de conditions composées"
              ],
              [
                "Complexité",
                "Contrôle de visibilité simple un-à-plusieurs",
                "Logique complexe à conditions multiples"
              ],
              [
                "Utilisation principale",
                "Contrôler quels choix apparaissent en fonction d'une seule sélection",
                "Gérer les interactions dépendant de combinaisons de sélections précédentes"
              ]
            ]
          },
          {
            "type": "callout",
            "variant": "info",
            "text": "Les règles d'activation sont particulièrement utiles lorsque certains choix n'ont de sens que dans le contexte d'une sélection préalable. Par exemple, des tailles de pneus spécifiques peuvent n'être pertinentes que lorsqu'un type de cadre particulier est sélectionné."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Alias d'expressions"
          },
          {
            "type": "paragraph",
            "text": "Les alias d'expressions représentent des instructions logiques qui peuvent être réutilisées dans plusieurs règles. Les définitions communes fréquemment utilisées dans la configuration de produits peuvent être capturées sous forme d'alias, simplifiant la création de règles et améliorant la maintenabilité."
          },
          {
            "type": "reveal-cards",
            "cards": [
              {
                "front": "Qu'est-ce qu'un alias d'expression ?",
                "back": "Un alias d'expression est une instruction logique nommée qui encapsule une condition ou un ensemble de choix couramment utilisés. Par exemple, un alias 'GrandsPneus' pourrait représenter l'ensemble des tailles de pneus 48PO, 50PO, 52PO, 54PO et 56PO de l'option PNEU."
              },
              {
                "front": "Où les alias sont-ils utilisés ?",
                "back": "Les alias d'expressions peuvent être utilisés lors de la création de règles conditionnelles, d'expressions avancées et d'autres alias. Ils servent de blocs de construction pour une logique de configuration complexe, réduisant la duplication et rendant les règles plus faciles à lire et à maintenir."
              },
              {
                "front": "Réutilisabilité entre les règles",
                "back": "Une fois défini, un alias peut être référencé dans plusieurs règles conditionnelles et expressions à travers la configuration du produit. Cela signifie qu'une modification de la définition de l'alias se propage automatiquement à toutes les règles qui le référencent."
              },
              {
                "front": "Exigences de licence",
                "back": "Les alias d'expressions sont une capacité avancée soumise à un droit de licence séparé. Les organisations doivent disposer de la licence Windchill appropriée pour créer et utiliser des alias d'expressions dans leurs configurations de produits."
              }
            ]
          },
          {
            "type": "callout",
            "variant": "warning",
            "text": "Les alias d'expressions nécessitent un droit de licence séparé. Vérifiez que la licence Windchill de votre organisation inclut cette capacité avant de prévoir l'utilisation d'alias dans vos définitions de règles."
          }
        ],
        "keyTakeaways": [
          "Les règles d'activation contrôlent la visibilité des choix en fonction d'une sélection source",
          "Les alias d'expressions simplifient la création de règles complexes en encapsulant des instructions logiques réutilisables",
          "Les alias sont réutilisables dans les règles conditionnelles et les expressions",
          "Les alias d'expressions nécessitent un droit de licence séparé"
        ]
      },
      {
        "id": "m3t4",
        "title": "Créer des règles d'inclusion et d'exclusion",
        "estimatedMinutes": 5,
        "isExercise": true,
        "content": [
          {
            "type": "paragraph",
            "text": "Dans cet exercice, vous allez créer des règles d'inclusion et d'exclusion pour le produit PTC Motorcycle. Anna Chen naviguera dans le Pool d'options pour définir une règle d'inclusion qui associe le type de moto Tout-terrain aux choix de roues appropriés, et une règle d'exclusion qui empêche les sélections de roues incompatibles."
          },
          {
            "type": "callout",
            "variant": "warning",
            "text": "Cet exercice modifie les règles de configuration du produit. Suivez les étapes attentivement et utilisez les noms exacts spécifiés pour assurer la cohérence avec les exercices suivants."
          },
          {
            "type": "exercise",
            "exerciseId": "ex4",
            "title": "Créer des règles d'inclusion et d'exclusion",
            "objective": "Apprendre à créer des règles d'inclusion et d'exclusion dans Windchill en définissant des associations logiques et des restrictions de choix incompatibles pour le produit PTC Motorcycle.",
            "tasks": [
              {
                "id": "ex4-t1",
                "title": "Créer une règle d'inclusion",
                "steps": [
                  {
                    "action": "Naviguez vers le produit PTC Motorcycle et ouvrez l'onglet Pool d'options.",
                    "detail": "Vous allez créer une règle d'inclusion qui associe le type de moto Tout-terrain aux choix de roues appropriés. Les règles d'inclusion sont créées depuis le Pool d'options.",
                    "hint": null
                  },
                  {
                    "action": "Développez l'option Type de moto dans le Pool d'options pour voir ses choix.",
                    "detail": "Vous devriez voir les choix Tout-terrain et Route/Homologué créés dans un exercice précédent. Le choix Tout-terrain sera la source de la règle d'inclusion.",
                    "hint": "Cliquez sur la flèche de développement à côté de Type de moto pour révéler ses choix."
                  },
                  {
                    "action": "Faites un clic droit sur le choix 'Tout-terrain' et sélectionnez 'Nouvelle règle d'inclusion'.",
                    "detail": "L'action Nouvelle règle d'inclusion ouvre une boîte de dialogue où vous spécifiez quels choix cibles doivent être automatiquement sélectionnés lorsque Tout-terrain est choisi. Cela garantit que les roues appropriées sont toujours incluses dans une configuration tout-terrain.",
                    "hint": "L'option peut se trouver dans un menu contextuel ou sous un menu déroulant Actions sur la ligne du choix."
                  },
                  {
                    "action": "Dans la boîte de dialogue de la règle d'inclusion, sélectionnez l'option Roues et choisissez 'Tout-terrain Avant' et 'Tout-terrain Arrière' comme choix cibles.",
                    "detail": "En sélectionnant les deux roues Tout-terrain Avant et Tout-terrain Arrière, vous définissez que chaque fois qu'un client sélectionne le type de moto Tout-terrain, les deux types de roues tout-terrain sont automatiquement inclus dans la configuration.",
                    "hint": "Si l'option Roues ne permet pas la sélection multiple, vous devrez d'abord la modifier (voir la tâche suivante)."
                  },
                  {
                    "action": "Si la boîte de dialogue ne permet pas de sélectionner plusieurs choix de roues, notez le problème et passez à la tâche suivante pour modifier d'abord l'option Roues.",
                    "detail": "L'option Roues peut être définie sur Sélection unique par défaut. Pour qu'une règle d'inclusion cible plusieurs choix de la même option, cette option doit permettre la sélection multiple. C'est une étape de configuration courante lors de la mise en place de règles d'inclusion.",
                    "hint": null
                  }
                ]
              },
              {
                "id": "ex4-t2",
                "title": "Modifier l'option Roues et terminer la règle d'inclusion",
                "steps": [
                  {
                    "action": "Dans le Pool d'options, faites un clic droit sur l'option Roues et sélectionnez 'Modifier'.",
                    "detail": "Vous devez changer l'option Roues de sélection unique à sélection multiple afin que la règle d'inclusion puisse cibler simultanément plusieurs choix de roues.",
                    "hint": "Cherchez une action Modifier dans le menu contextuel ou la barre d'outils d'actions lorsque l'option Roues est sélectionnée."
                  },
                  {
                    "action": "Changez le paramètre 'Sélection unique' de 'Oui' à 'Non' et enregistrez la modification.",
                    "detail": "Définir Sélection unique sur Non permet de sélectionner plusieurs choix pour l'option Roues. Cela est nécessaire car le type de moto Tout-terrain a besoin que les roues Tout-terrain Avant et Tout-terrain Arrière soient sélectionnées ensemble.",
                    "hint": "Le champ Sélection unique peut être une case à cocher ou une liste déroulante dans le formulaire de modification de l'option."
                  },
                  {
                    "action": "Retournez à l'option Type de moto, faites un clic droit sur 'Tout-terrain' et sélectionnez 'Nouvelle règle d'inclusion' à nouveau.",
                    "detail": "Maintenant que l'option Roues prend en charge la sélection multiple, vous pouvez créer la règle d'inclusion ciblant les deux choix de roues Tout-terrain Avant et Tout-terrain Arrière.",
                    "hint": null
                  },
                  {
                    "action": "Sélectionnez l'option Roues et choisissez à la fois 'Tout-terrain Avant' et 'Tout-terrain Arrière' comme choix cibles. Enregistrez la règle d'inclusion.",
                    "detail": "La règle d'inclusion est maintenant complète. Chaque fois qu'un utilisateur sélectionne Tout-terrain comme Type de moto, les roues Tout-terrain Avant et Tout-terrain Arrière seront automatiquement incluses dans la configuration.",
                    "hint": "Maintenez Ctrl enfoncé tout en cliquant pour sélectionner plusieurs choix dans la liste cible."
                  },
                  {
                    "action": "Vérifiez que la règle d'inclusion apparaît dans l'onglet Règles d'inclusion du choix Tout-terrain.",
                    "detail": "Après l'enregistrement, la règle devrait être visible dans la liste des règles. Confirmez que la source est Tout-terrain et que les cibles sont Tout-terrain Avant et Tout-terrain Arrière.",
                    "hint": "Naviguez vers les détails du choix Tout-terrain et vérifiez l'onglet ou la section Règles d'inclusion."
                  }
                ]
              },
              {
                "id": "ex4-t3",
                "title": "Créer une règle d'exclusion",
                "steps": [
                  {
                    "action": "Naviguez vers l'article PTC Motorcycle de niveau supérieur dans la structure produit ou la vue du pool d'options.",
                    "detail": "Les règles d'exclusion peuvent être créées depuis le contexte du produit de niveau supérieur. Vous allez créer une règle qui empêche la sélection de choix de roues incompatibles avec le type de moto Tout-terrain.",
                    "hint": "Sélectionnez le produit PTC Motorcycle au niveau supérieur de la structure."
                  },
                  {
                    "action": "Accédez à l'onglet Règles d'exclusion.",
                    "detail": "L'onglet Règles d'exclusion affiche toutes les règles d'exclusion existantes pour le produit et fournit des actions pour en créer de nouvelles. Cette vue centralisée facilite la gestion de toutes les règles d'incompatibilité.",
                    "hint": "L'onglet peut se trouver aux côtés des onglets Règles d'inclusion, Règles d'activation et d'autres onglets liés aux règles."
                  },
                  {
                    "action": "Cliquez sur 'Nouvelle règle d'exclusion' pour créer une nouvelle règle d'exclusion.",
                    "detail": "Vous allez définir une règle d'exclusion qui empêche la sélection des roues Route lorsque le type de moto Tout-terrain est choisi, garantissant que seuls les types de roues compatibles sont disponibles.",
                    "hint": "Cherchez un bouton ou une icône 'Nouvelle règle d'exclusion' dans la barre d'outils au-dessus du tableau des règles."
                  },
                  {
                    "action": "Définissez la source sur Type de moto = Tout-terrain. Définissez les cibles sur Roues = Route Avant et Roues = Route Arrière.",
                    "detail": "Cette règle d'exclusion stipule : lorsque Tout-terrain est sélectionné comme Type de moto, les choix de roues Route Avant et Route Arrière ne peuvent pas être sélectionnés. Cela empêche un utilisateur de choisir accidentellement des roues de route pour une moto tout-terrain.",
                    "hint": "Sélectionnez d'abord l'option et le choix source, puis sélectionnez l'option cible et les choix à exclure."
                  },
                  {
                    "action": "Enregistrez la règle d'exclusion et vérifiez qu'elle apparaît dans l'onglet Règles d'exclusion.",
                    "detail": "La règle d'exclusion est maintenant active. Combinée avec la règle d'inclusion de la tâche précédente, la sélection de Tout-terrain comme Type de moto inclura automatiquement les roues tout-terrain et empêchera la sélection des roues de route.",
                    "hint": null
                  }
                ]
              }
            ]
          }
        ],
        "keyTakeaways": [
          "Les règles d'inclusion sélectionnent automatiquement les choix associés lorsqu'un choix source est sélectionné",
          "Les options peuvent nécessiter une modification pour prendre en charge la sélection multiple pour les règles d'inclusion ciblant plusieurs choix",
          "Les règles d'exclusion empêchent la sélection simultanée de choix incompatibles",
          "Les règles sont créées depuis les onglets du Pool d'options et les onglets de règles au niveau du produit"
        ]
      }
    ]
  },
  "modules/m4-option-sets.json": {
    "id": "m4",
    "title": "Explorer les ensembles d'options",
    "description": "Définissez les ensembles d'options, explorez la gestion des modifications pour les ensembles d'options, affectez les ensembles d'options, appliquez les expressions et utilisez les filtres d'options pour générer des variantes.",
    "topics": [
      {
        "id": "m4t1",
        "title": "Ensembles d'options et gestion des modifications",
        "estimatedMinutes": 5,
        "content": [
          {
            "type": "paragraph",
            "text": "Un ensemble d'options est une collection sélectionnée d'options, de choix et de règles qui définit le vocabulaire de configuration pour une famille de produits spécifique. Alors que le pool d'options contient chaque option jamais définie pour un contexte produit, un ensemble d'options ne sélectionne que le sous-ensemble pertinent nécessaire pour une ligne de produits particulière. Comprendre comment les ensembles d'options sont gérés, versionnés et gouvernés est essentiel pour maintenir des configurations de produits fiables."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Qu'est-ce qu'un ensemble d'options ?"
          },
          {
            "type": "paragraph",
            "text": "Un ensemble d'options puise son contenu dans le pool d'options et le conditionne pour une utilisation avec un produit configurable ou une famille de produits spécifique. Il contient les options, les choix et les règles qui définissent les configurations valides pour cette famille. Un seul pool d'options peut alimenter plusieurs ensembles d'options, chacun adapté à une ligne de produits différente. Cette séparation permet aux organisations de maintenir un référentiel centralisé d'options tout en fournissant des vocabulaires de configuration ciblés pour les produits individuels."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Pool d'options vs. Ensemble d'options vs. Filtre d'options"
          },
          {
            "type": "comparison-table",
            "headers": [
              "Concept",
              "Contenu",
              "Portée",
              "Objectif"
            ],
            "rows": [
              [
                "Pool d'options",
                "Toutes les options, choix et règles définis pour un contexte produit",
                "Contexte produit complet (toutes les familles de produits)",
                "Référentiel maître de toutes les caractéristiques configurables disponibles pour les produits de l'organisation"
              ],
              [
                "Ensemble d'options",
                "Un sous-ensemble sélectionné d'options, de choix et de règles du pool d'options",
                "Famille de produits ou produit configurable spécifique",
                "Définit le vocabulaire de configuration valide pour une ligne de produits particulière, y compris les règles applicables"
              ],
              [
                "Filtre d'options",
                "Un ensemble spécifique de sélections de choix appliqué à un ensemble d'options",
                "Une seule instance de configuration",
                "Filtre une structure produit surchargée pour ne conserver que les articles nécessaires pour une variante de produit spécifique"
              ]
            ]
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Gestion des modifications pour les ensembles d'options"
          },
          {
            "type": "paragraph",
            "text": "Les ensembles d'options dans Windchill sont des objets gérés qui suivent les workflows standards de gestion des modifications. Cela signifie qu'ils prennent en charge le versionnement, les états du cycle de vie et les opérations d'archivage/extraction, garantissant que les modifications des définitions de configuration des produits sont contrôlées et traçables."
          },
          {
            "type": "callout",
            "variant": "info",
            "text": "Les ensembles d'options suivent les mêmes principes de gestion des modifications que les autres objets Windchill. Ils peuvent être extraits pour modification, archivés pour enregistrer les modifications, versionnés pour suivre l'évolution dans le temps et gouvernés par des états du cycle de vie (par ex., En cours, Publié). Cela garantit que les définitions de configuration sont toujours auditables et que des modifications non autorisées ne peuvent pas affecter les produits publiés."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Gouvernance des ensembles d'options"
          },
          {
            "type": "paragraph",
            "text": "La gouvernance des ensembles d'options implique de contrôler qui peut les créer, les modifier et les publier. Le rôle de Gestionnaire d'options est responsable de la maintenance des ensembles d'options, de l'ajout ou de la suppression d'options et de choix, de la définition des règles et de la gestion du cycle de vie de l'ensemble d'options. Les organisations établissent généralement des processus de revue et d'approbation avant qu'un ensemble d'options ne soit publié pour une utilisation en production."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Testez vos connaissances"
          },
          {
            "type": "interactive-match",
            "prompt": "Associez chaque concept de gestion d'ensemble d'options à sa description :",
            "pairs": [
              {
                "left": "Versionnement de l'ensemble d'options",
                "right": "Suit les modifications de l'ensemble d'options dans le temps, créant un historique des définitions de configuration"
              },
              {
                "left": "Archivage/Extraction",
                "right": "Contrôle l'édition concurrente en verrouillant l'ensemble d'options pendant sa modification"
              },
              {
                "left": "États du cycle de vie",
                "right": "Gouverne la maturité de l'ensemble d'options (par ex., En cours, En revue, Publié)"
              },
              {
                "left": "Rôle de Gestionnaire d'options",
                "right": "Le rôle Windchill responsable de la création et de la maintenance des ensembles d'options et de leur contenu"
              }
            ]
          }
        ],
        "keyTakeaways": [
          "Un ensemble d'options est une collection sélectionnée d'options, de choix et de règles puisée dans le pool d'options pour une famille de produits spécifique",
          "Le pool d'options est le référentiel maître ; l'ensemble d'options est un sous-ensemble ciblé ; le filtre d'options applique des choix spécifiques pour générer une variante",
          "Les ensembles d'options sont des objets gérés avec versionnement, états du cycle de vie et support d'archivage/extraction",
          "Le rôle de Gestionnaire d'options est responsable de la création, de la maintenance et de la gouvernance des ensembles d'options"
        ]
      },
      {
        "id": "m4t2",
        "title": "Affectation et gestion des ensembles d'options",
        "estimatedMinutes": 5,
        "content": [
          {
            "type": "paragraph",
            "text": "Une fois qu'un ensemble d'options a été créé et rempli avec les options, choix et règles appropriés, il doit être affecté à un produit configurable ou un module configurable. Le processus d'affectation lie le vocabulaire de configuration à la structure produit, permettant la génération de variantes basée sur les options. Une bonne gestion de l'appartenance aux ensembles d'options garantit que les produits restent configurables à mesure que les exigences évoluent."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Affectation des ensembles d'options"
          },
          {
            "type": "paragraph",
            "text": "Les ensembles d'options sont affectés aux produits configurables et aux modules configurables via l'interface utilisateur Windchill. Un produit configurable doit avoir un ensemble d'options affecté avant que les filtres d'options puissent être appliqués ou que les variantes puissent être générées. Les modules configurables au sein de la structure produit peuvent également avoir leurs propres ensembles d'options, permettant à différentes sections du produit d'utiliser différents vocabulaires de configuration si nécessaire."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Étapes clés pour l'affectation des ensembles d'options"
          },
          {
            "type": "reveal-cards",
            "cards": [
              {
                "front": "Étape 1 : Naviguer vers le produit configurable",
                "back": "Ouvrez le produit configurable dans Windchill et localisez le menu d'actions ou l'onglet Ensemble d'options. Le produit doit déjà être désigné comme Produit configurable avant qu'un ensemble d'options puisse lui être affecté."
              },
              {
                "front": "Étape 2 : Sélectionner l'action Affecter un ensemble d'options",
                "back": "Utilisez le menu Actions ou l'onglet Ensemble d'options pour initier l'affectation. Windchill présente une liste des ensembles d'options disponibles dans le contexte produit. Seuls les ensembles d'options appartenant au même contexte produit (ou à un contexte partagé) sont disponibles pour l'affectation."
              },
              {
                "front": "Étape 3 : Choisir l'ensemble d'options approprié",
                "back": "Sélectionnez l'ensemble d'options contenant les options, les choix et les règles pertinents pour cette famille de produits. Passez en revue le contenu de l'ensemble d'options pour confirmer qu'il inclut tous les paramètres de configuration nécessaires avant de finaliser l'affectation."
              },
              {
                "front": "Étape 4 : Vérifier l'affectation",
                "back": "Après l'affectation, vérifiez que l'ensemble d'options apparaît dans l'onglet Ensemble d'options du produit. Confirmez que les options et les choix de l'ensemble affecté sont maintenant disponibles pour utilisation dans les expressions et les filtres d'options sur la structure produit."
              }
            ]
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Gestion de l'appartenance aux ensembles d'options"
          },
          {
            "type": "paragraph",
            "text": "À mesure que les exigences produit évoluent, les ensembles d'options doivent être mis à jour pour refléter de nouvelles options, des choix supplémentaires ou des règles modifiées. Le Gestionnaire d'options peut ajouter de nouvelles options depuis le pool d'options, ajouter de nouveaux choix aux options existantes dans l'ensemble, supprimer des options ou des choix qui ne sont plus pertinents et mettre à jour les règles pour refléter l'évolution de la logique métier. Toutes les modifications nécessitent que l'ensemble d'options soit d'abord extrait, et les modifications ne sont visibles par les autres qu'après l'archivage."
          },
          {
            "type": "callout",
            "variant": "tip",
            "text": "Bonne pratique : organisez les ensembles d'options par famille de produits, et non par produit individuel. Un ensemble d'options bien conçu couvre toutes les configurations au sein d'une famille de produits. Évitez de créer un ensemble d'options par variante de produit, car cela va à l'encontre de l'objectif des produits configurables et crée une charge de maintenance inutile."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Ordonnez le processus d'affectation"
          },
          {
            "type": "interactive-sort",
            "prompt": "Classez les étapes d'affectation d'un ensemble d'options à un produit configurable dans le bon ordre :",
            "correctOrder": [
              "Naviguer vers le produit configurable dans Windchill",
              "Ouvrir le menu Actions et sélectionner Affecter un ensemble d'options",
              "Sélectionner l'ensemble d'options approprié dans la liste disponible",
              "Confirmer l'affectation et vérifier que l'ensemble d'options apparaît sur le produit"
            ]
          }
        ],
        "keyTakeaways": [
          "Les ensembles d'options doivent être affectés aux produits configurables avant que les filtres d'options ou la génération de variantes puissent être utilisés",
          "Le processus d'affectation implique de naviguer vers le produit, de sélectionner l'action Affecter un ensemble d'options, de choisir l'ensemble et de vérifier",
          "L'appartenance aux ensembles d'options peut être mise à jour en ajoutant ou supprimant des options, des choix et des règles à mesure que les exigences évoluent",
          "La bonne pratique est d'organiser les ensembles d'options par famille de produits plutôt que par variante de produit individuelle"
        ]
      },
      {
        "id": "m4t3",
        "title": "Expressions et filtres d'options",
        "estimatedMinutes": 5,
        "content": [
          {
            "type": "paragraph",
            "text": "Les expressions et les filtres d'options sont les mécanismes qui relient les choix d'options à la structure produit. Les expressions sont affectées aux articles et aux liens d'utilisation pour spécifier quand un composant doit être inclus dans une variante. Les filtres d'options utilisent les expressions affectées pour évaluer quels articles appartiennent à une configuration spécifique en fonction des sélections de choix de l'utilisateur."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Expressions de base vs. expressions avancées"
          },
          {
            "type": "paragraph",
            "text": "Windchill prend en charge deux types d'expressions pour affecter des choix aux articles et aux liens d'utilisation. Les expressions de base utilisent des références de choix simples, tandis que les expressions avancées ajoutent des opérateurs et des fonctions pour une logique de sélection complexe. Le type d'expression que vous utilisez dépend de la complexité de vos exigences de configuration et de la nécessité d'une intégration Creo."
          },
          {
            "type": "comparison-table",
            "headers": [
              "Aspect",
              "Expression de base",
              "Expression avancée"
            ],
            "rows": [
              [
                "Syntaxe",
                "Référence de choix simple (par ex., Couleur=Rouge)",
                "Inclut des choix, des opérateurs (ET, OU, NON) et des fonctions"
              ],
              [
                "Capacité",
                "Affecte un choix unique ou une liste simple de choix à un article ou un lien d'utilisation",
                "Prend en charge des conditions logiques complexes combinant plusieurs options et choix avec des opérateurs booléens"
              ],
              [
                "Support Creo",
                "Transmise de Windchill vers Creo et prise en charge dans les deux systèmes",
                "Reste uniquement dans Windchill ; NON transmise vers Creo"
              ],
              [
                "Cas d'utilisation",
                "Configurations simples où un article est inclus lorsqu'un seul choix est sélectionné",
                "Configurations complexes où l'inclusion d'un article dépend de combinaisons de choix à travers plusieurs options"
              ],
              [
                "Exemple",
                "Type de moto = Tout-terrain",
                "(Type de moto = Tout-terrain) ET (Cylindrée du moteur = 1200cc)"
              ],
              [
                "Préférence requise",
                "Préférence Expressions prises en charge définie sur De base ou Les deux",
                "Préférence Expressions prises en charge définie sur Les deux"
              ]
            ]
          },
          {
            "type": "callout",
            "variant": "warning",
            "text": "Les expressions avancées ne sont PAS transmises de Windchill vers Creo. Si votre flux de travail implique la configuration de variantes dans Creo, vous devez utiliser des expressions de base pour toute affectation de choix devant être visible dans Creo. Planifiez soigneusement votre stratégie d'expressions en fonction de vos exigences d'intégration Creo."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Filtres d'options"
          },
          {
            "type": "paragraph",
            "text": "Un filtre d'options est un ensemble de sélections de choix appliqué à une structure produit surchargée pour générer une variante filtrée. Lorsque vous créez un filtre d'options, vous sélectionnez des choix spécifiques pour chaque option dans l'ensemble d'options affecté. Windchill évalue ensuite les expressions sur chaque article et lien d'utilisation dans la structure, n'incluant que les articles dont les expressions correspondent aux choix sélectionnés. Le résultat est une structure réduite représentant une variante de produit spécifique."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Concepts des filtres d'options"
          },
          {
            "type": "reveal-cards",
            "cards": [
              {
                "front": "Création d'un filtre d'options",
                "back": "Naviguez vers la structure du produit configurable et sélectionnez l'action Créer un filtre d'options. Windchill présente les options de l'ensemble d'options affecté. Sélectionnez un choix pour chaque option pour définir les critères de filtrage. Les règles de l'ensemble d'options appliquent automatiquement les combinaisons de choix valides."
              },
              {
                "front": "Application d'un filtre d'options",
                "back": "Une fois créé, le filtre d'options est appliqué à la structure surchargée. Windchill évalue l'expression de chaque article par rapport aux choix du filtre. Les articles dont les expressions correspondent sont inclus ; les articles dont les expressions ne correspondent pas sont exclus. Le résultat est une structure filtrée montrant uniquement les composants pour cette variante spécifique."
              },
              {
                "front": "Spécification de variante",
                "back": "Lorsqu'un filtre d'options est appliqué pour générer une variante, Windchill crée une spécification de variante qui enregistre les choix exacts utilisés. Cette spécification permet la réutilisation des variantes — si les mêmes choix sont demandés ultérieurement, Windchill peut trouver et réutiliser la variante existante au lieu d'en générer une nouvelle."
              },
              {
                "front": "Application des règles lors du filtrage",
                "back": "Les règles d'inclusion, d'exclusion, d'activation et conditionnelles sont appliquées pendant le processus de filtre d'options. Si un utilisateur sélectionne un choix qui déclenche une règle d'inclusion, les choix associés sont automatiquement sélectionnés. Si un choix viole une règle d'exclusion, il est empêché. Cela garantit que chaque variante générée est valide."
              }
            ]
          },
          {
            "type": "callout",
            "variant": "insight",
            "text": "Le filtre d'options est l'endroit où tout converge : l'ensemble d'options fournit le vocabulaire, les expressions lient les choix aux articles, les règles appliquent les combinaisons valides et le filtre applique des choix spécifiques pour réduire la structure surchargée en une variante concrète. Maîtriser les filtres d'options est la clé d'une configuration de produit efficace dans Windchill."
          }
        ],
        "keyTakeaways": [
          "Les expressions de base utilisent des références de choix simples et sont transmises à Creo ; les expressions avancées utilisent la logique booléenne et restent uniquement dans Windchill",
          "Les expressions sont affectées aux articles et aux liens d'utilisation pour spécifier quand un composant est inclus dans une variante",
          "Les filtres d'options appliquent des sélections de choix spécifiques à une structure surchargée pour générer une variante filtrée",
          "Les spécifications de variante enregistrent les choix utilisés pour générer une variante, permettant la réutilisation des variantes existantes"
        ]
      },
      {
        "id": "m4t4",
        "title": "Affecter un ensemble d'options et appliquer un filtre",
        "estimatedMinutes": 5,
        "isExercise": true,
        "content": [
          {
            "type": "paragraph",
            "text": "Dans cet exercice, vous allez affecter un ensemble d'options au produit configurable PTC Motorcycle, puis créer et appliquer un filtre d'options pour générer une structure de variante filtrée. Cet exercice rassemble les concepts des sujets précédents : ensembles d'options, expressions et filtres d'options."
          },
          {
            "type": "callout",
            "variant": "warning",
            "text": "Cet exercice s'appuie sur les exercices précédents. Assurez-vous d'avoir terminé les exercices de création d'options et de règles avant de continuer. L'ensemble d'options référencé dans cet exercice devrait déjà exister dans le contexte du produit PTC Motorcycle."
          },
          {
            "type": "exercise",
            "exerciseId": "ex5",
            "title": "Affecter un ensemble d'options et appliquer un filtre",
            "objective": "Apprendre à affecter un ensemble d'options à un produit configurable et appliquer un filtre d'options pour générer une structure de variante filtrée.",
            "tasks": [
              {
                "id": "ex5-t1",
                "title": "Affecter l'ensemble d'options au produit configurable",
                "steps": [
                  {
                    "action": "Naviguez vers le produit configurable PTC Motorcycle. Allez dans Parcourir > Produits et sélectionnez PTC Motorcycle.",
                    "detail": "Le PTC Motorcycle est le produit configurable utilisé tout au long de ce cours. Vous allez affecter l'ensemble d'options existant à ce produit afin que les filtres d'options puissent être appliqués à sa structure surchargée.",
                    "hint": "Connectez-vous en tant qu'Anna Chen ou votre utilisateur de formation assigné. Le PTC Motorcycle devrait apparaître dans la liste des Produits."
                  },
                  {
                    "action": "Ouvrez le menu Actions de la page du produit PTC Motorcycle et sélectionnez 'Affecter un ensemble d'options'.",
                    "detail": "L'action Affecter un ensemble d'options lie un ensemble d'options au produit configurable. Cette action est disponible depuis le menu Actions au niveau du produit ou depuis l'onglet Ensemble d'options. Un produit doit avoir un ensemble d'options affecté avant que les filtres d'options puissent être créés.",
                    "hint": "Si vous ne voyez pas l'action Affecter un ensemble d'options, vérifiez que le produit est désigné comme Produit configurable et que vous disposez des permissions appropriées."
                  },
                  {
                    "action": "Dans la boîte de dialogue d'affectation, sélectionnez l'ensemble d'options PTC Motorcycle dans la liste des ensembles d'options disponibles.",
                    "detail": "La boîte de dialogue affiche les ensembles d'options disponibles dans ce contexte produit. Sélectionnez l'ensemble d'options qui contient les options Type de moto, Cylindrée du moteur, Couleur, Roues et Emplacement des sacoches ainsi que les règles d'inclusion et d'exclusion créées dans les exercices précédents.",
                    "hint": "Si plusieurs ensembles d'options apparaissent, choisissez celui qui correspond aux options et règles que vous avez créées dans les exercices précédents."
                  },
                  {
                    "action": "Confirmez l'affectation et vérifiez que l'ensemble d'options apparaît maintenant dans l'onglet Ensemble d'options du PTC Motorcycle.",
                    "detail": "Après l'affectation, l'onglet Ensemble d'options devrait afficher l'ensemble d'options affecté avec toutes ses options, choix et règles. Parcourez les options pour confirmer que Type de moto, Cylindrée du moteur, Couleur, Roues et Emplacement des sacoches sont présents avec leurs choix respectifs.",
                    "hint": "Cliquez sur l'onglet Ensemble d'options de la page du produit. Développez les options pour vérifier que les choix et les règles sont intacts."
                  }
                ]
              },
              {
                "id": "ex5-t2",
                "title": "Créer et appliquer un filtre d'options",
                "steps": [
                  {
                    "action": "Naviguez vers la structure du produit PTC Motorcycle en cliquant sur l'onglet Structure.",
                    "detail": "L'onglet Structure affiche la structure produit surchargée contenant toutes les variations de conception possibles. Vous allez créer un filtre d'options pour réduire cette structure à une variante spécifique basée sur vos sélections de choix.",
                    "hint": "L'onglet Structure montre la nomenclature complète avec tous les modules configurables et leurs articles enfants."
                  },
                  {
                    "action": "Cliquez sur l'action 'Créer un filtre d'options' dans la barre d'outils de la vue de structure ou le menu Actions.",
                    "detail": "L'action Créer un filtre d'options ouvre une boîte de dialogue qui présente toutes les options de l'ensemble d'options affecté. Vous sélectionnerez des choix spécifiques pour chaque option afin de définir les critères de filtrage pour la variante que vous souhaitez générer.",
                    "hint": "Cherchez une icône de filtre ou l'action 'Filtre d'options' dans la barre d'outils au-dessus de l'arborescence de la structure."
                  },
                  {
                    "action": "Sélectionnez 'Tout-terrain' pour l'option Type de moto.",
                    "detail": "La sélection de Tout-terrain définit cette variante comme une configuration de moto tout-terrain. Remarquez que la règle d'inclusion que vous avez créée sélectionne automatiquement Tout-terrain Avant et Tout-terrain Arrière pour l'option Roues, et la règle d'exclusion empêche la sélection de Route Avant et Route Arrière.",
                    "hint": "Observez la mise à jour automatique des choix de l'option Roues à mesure que les règles d'inclusion et d'exclusion sont appliquées."
                  },
                  {
                    "action": "Sélectionnez des choix pour les options restantes : choisissez une Cylindrée du moteur (par ex., 1000cc), une Couleur (par ex., Noir) et vérifiez l'Emplacement des sacoches (par ex., Non utilisé).",
                    "detail": "Complétez le filtre d'options en sélectionnant un choix pour chaque option restante. La combinaison de tous les choix définit une variante de produit spécifique. Les règles continuent d'appliquer les combinaisons valides au fur et à mesure de vos sélections.",
                    "hint": "Si certains choix sont grisés ou indisponibles, vérifiez si une règle les restreint en fonction de vos sélections précédentes."
                  },
                  {
                    "action": "Cliquez sur 'Appliquer' ou 'OK' pour appliquer le filtre d'options à la structure produit.",
                    "detail": "Windchill évalue les expressions affectées à chaque article et lien d'utilisation dans la structure surchargée par rapport à vos choix sélectionnés. Les articles dont les expressions correspondent sont inclus dans le résultat filtré ; les articles qui ne correspondent pas sont exclus. La vue de structure se met à jour pour afficher uniquement les composants de cette variante spécifique.",
                    "hint": "La structure filtrée devrait être sensiblement plus petite que la structure surchargée complète, ne contenant que les articles pertinents pour la variante Tout-terrain."
                  }
                ]
              },
              {
                "id": "ex5-t3",
                "title": "Examiner la structure filtrée",
                "steps": [
                  {
                    "action": "Examinez la structure filtrée affichée dans l'onglet Structure. Notez quels articles sont inclus et lesquels ont été supprimés.",
                    "detail": "La structure filtrée représente la variante Tout-terrain du PTC Motorcycle. Comparez-la à la structure surchargée complète que vous avez vue précédemment. Les articles associés aux composants de route (par ex., roues de route, éclairage homologué) devraient être absents, tandis que les articles spécifiques au tout-terrain devraient être présents.",
                    "hint": "Développez l'arborescence de la structure pour voir la hiérarchie complète des articles inclus."
                  },
                  {
                    "action": "Comparez la structure filtrée à la structure surchargée complète en activant et désactivant le filtre d'options (si l'interface le permet) ou en notant les différences.",
                    "detail": "La structure surchargée contient tous les articles possibles pour toutes les variantes. La structure filtrée ne contient que les articles pour la configuration Tout-terrain que vous avez spécifiée. La différence entre les deux illustre comment les filtres d'options réduisent la complexité en restreignant la structure à une seule configuration valide.",
                    "hint": "Certaines versions de Windchill permettent d'effacer le filtre pour revenir à la vue surchargée complète. Cherchez une action 'Effacer le filtre' ou 'Tout afficher'."
                  },
                  {
                    "action": "Identifiez quels modules configurables ont été affectés par le filtre et comprenez pourquoi des articles spécifiques ont été inclus ou exclus en fonction des choix que vous avez sélectionnés.",
                    "detail": "Chaque module configurable de la structure peut avoir été filtré différemment selon les expressions affectées à ses articles enfants. Par exemple, le module Roues ne devrait maintenant afficher que les articles de roues tout-terrain car les choix Tout-terrain Avant et Tout-terrain Arrière ont été sélectionnés (via la règle d'inclusion) et les choix de route ont été exclus.",
                    "hint": "Cliquez sur des articles individuels pour voir leurs expressions affectées et comprendre pourquoi ils ont été inclus ou exclus par le filtre."
                  },
                  {
                    "action": "Notez la spécification de variante qui a été créée. Passez en revue les choix enregistrés pour confirmer qu'ils correspondent à vos sélections de filtre.",
                    "detail": "Windchill enregistre une spécification de variante documentant les choix exacts utilisés pour générer cette variante. Cette spécification permet la réutilisation des variantes : si quelqu'un demande la même combinaison de choix à l'avenir, Windchill peut trouver cette variante existante au lieu d'en générer une nouvelle, économisant du temps et assurant la cohérence.",
                    "hint": "Cherchez un lien ou un onglet Spécification de variante associé à la vue de structure filtrée."
                  }
                ]
              }
            ]
          }
        ],
        "keyTakeaways": [
          "Un ensemble d'options doit être affecté à un produit configurable avant que les filtres d'options puissent être créés",
          "La création d'un filtre d'options implique la sélection de choix spécifiques pour chaque option de l'ensemble d'options affecté",
          "Les règles sont automatiquement appliquées pendant le processus de filtrage, garantissant que seules les combinaisons de choix valides sont possibles",
          "La structure filtrée montre uniquement les articles pertinents pour la variante sélectionnée, réduisant la complexité de la structure surchargée complète"
        ]
      },
      {
        "id": "m4t5",
        "title": "Révision et synthèse du cours",
        "estimatedMinutes": 5,
        "isExercise": true,
        "content": [
          {
            "type": "paragraph",
            "text": "Ce dernier exercice passe en revue les concepts clés des quatre modules du cours Options et Produits Configurables. Utilisez cette synthèse pour valider votre compréhension et identifier les domaines qui pourraient nécessiter une révision supplémentaire avant d'appliquer ces concepts dans votre travail quotidien avec Windchill."
          },
          {
            "type": "callout",
            "variant": "info",
            "text": "Ceci est un exercice de révision. Travaillez sur chaque tâche pour revisiter les concepts majeurs du cours. Utilisez les indices pour rafraîchir votre mémoire sur les sujets qui vous semblent moins familiers."
          },
          {
            "type": "exercise",
            "exerciseId": "ex6",
            "title": "Révision et synthèse du cours",
            "objective": "Passer en revue les concepts clés des quatre modules et valider votre compréhension des Options et Produits Configurables.",
            "tasks": [
              {
                "id": "ex6-t1",
                "title": "Réviser les concepts clés",
                "steps": [
                  {
                    "action": "Rappelez les cinq stratégies métier pour la variabilité des produits : Assemblage à la commande, Assemblage sur stock, Configuration à la commande, Ingénierie à la commande et Contrat.",
                    "detail": "Chaque stratégie diffère par le niveau d'implication du développement produit par commande. L'assemblage à la commande ne nécessite aucune implication d'ingénierie par commande, tandis que le contrat nécessite une ingénierie sur mesure complète. Windchill OCP prend principalement en charge les stratégies d'assemblage à la commande et de configuration à la commande.",
                    "hint": "Le facteur clé de différenciation est le niveau d'implication d'ingénierie nécessaire pour chaque commande client."
                  },
                  {
                    "action": "Passez en revue les quatre étapes de la conception de plateforme générique : analyser les exigences, évaluer les produits existants pour la réutilisation, créer la définition générique du produit, et publier et maintenir la plateforme.",
                    "detail": "La conception de plateforme établit la fondation réutilisable à partir de laquelle toutes les variantes de produit sont dérivées. Une plateforme bien conçue maximise la réutilisation des pièces et identifie clairement les sections qui sont fixes par rapport aux sections variables.",
                    "hint": "Toujours évaluer les produits existants pour la réutilisation avant de créer de nouvelles conceptions de zéro."
                  },
                  {
                    "action": "Rappelez le concept de structure produit surchargée et comment elle contient toutes les variations de conception possibles pour un produit configurable.",
                    "detail": "Une structure surchargée inclut TOUTES les alternatives de conception sous les modules configurables. Lors de la génération de variantes, les filtres d'options réduisent cette structure aux seuls articles nécessaires pour une configuration spécifique. La structure surchargée est la structure maîtresse à partir de laquelle toutes les variantes sont dérivées.",
                    "hint": "Considérez la structure surchargée comme un surensemble et la variante filtrée comme un sous-ensemble."
                  },
                  {
                    "action": "Passez en revue les trois objets configurables et leur hiérarchie : Produit configurable, Module configurable et Variante de module.",
                    "detail": "Le Produit configurable est l'article final de niveau supérieur contenant la structure surchargée complète. Les Modules configurables sont des sections qui capturent la variabilité avec plusieurs alternatives de conception. Les Variantes de module sont les articles spécifiques sélectionnés d'un module configurable après application des filtres d'options.",
                    "hint": "La hiérarchie va du plus large (Produit configurable) au plus spécifique (Variante de module)."
                  }
                ]
              },
              {
                "id": "ex6-t2",
                "title": "Réviser la configuration des options et variantes",
                "steps": [
                  {
                    "action": "Passez en revue la terminologie clé O&V : options, choix, pool d'options, ensemble d'options, filtre d'options, expressions, spécification de variante, module configurable et rôle de Gestionnaire d'options.",
                    "detail": "Les options représentent des caractéristiques variables du produit, chacune avec un ou plusieurs choix. Le pool d'options est le référentiel maître ; les ensembles d'options sont des sous-ensembles sélectionnés pour les familles de produits. Les filtres d'options appliquent des choix pour générer des variantes. Les expressions lient les choix aux articles. Les spécifications de variante enregistrent les choix utilisés.",
                    "hint": "Les termes se répartissent en trois catégories : termes de structure, termes de logique et termes de gestion."
                  },
                  {
                    "action": "Rappelez la différence entre le pool d'options et l'ensemble d'options, et expliquez pourquoi les deux sont nécessaires.",
                    "detail": "Le pool d'options contient TOUTES les options et les choix pour un contexte produit — c'est le catalogue maître. L'ensemble d'options ne sélectionne que les options pertinentes pour une famille de produits spécifique. Cette séparation permet la réutilisation : la même option (par ex., Couleur) peut apparaître dans plusieurs ensembles d'options pour différentes familles de produits sans duplication.",
                    "hint": "Le pool d'options est le surensemble ; l'ensemble d'options est un sous-ensemble ciblé adapté à une famille de produits."
                  },
                  {
                    "action": "Passez en revue les deux approches de configuration : descendante (Windchill en premier) et ascendante (Creo en premier), et la limitation selon laquelle seules les expressions de base sont transférées vers Creo.",
                    "detail": "L'approche descendante commence par la structure d'articles dans Windchill et se propage vers Creo. L'ascendante commence par l'assemblage surchargé dans Creo et l'archive dans Windchill. Quelle que soit l'approche, seules les expressions de base sont transmises de Windchill vers Creo — les expressions avancées restent uniquement dans Windchill.",
                    "hint": "L'approche dépend du fait que le PLM ou la CAO pilote votre structure produit."
                  },
                  {
                    "action": "Rappelez la préférence Support de module configurable et son importance, ainsi que la façon dont les préférences héritent du niveau site vers le niveau organisation puis produit.",
                    "detail": "Le Support de module configurable doit être défini sur Oui pour utiliser toute fonctionnalité O&V — sa valeur par défaut est Non. Les préférences sont héritées des niveaux supérieurs (site) vers les niveaux inférieurs (organisation, produit) et peuvent être verrouillées ou remplacées à chaque niveau. Les Administrateurs du site, les Administrateurs d'organisation, les Chefs de produit et les Gestionnaires de bibliothèque peuvent modifier les préférences O&V.",
                    "hint": "Si les fonctionnalités O&V ne sont pas disponibles, la première chose à vérifier est la préférence Support de module configurable au niveau approprié."
                  }
                ]
              },
              {
                "id": "ex6-t3",
                "title": "Réviser les règles et les ensembles d'options",
                "steps": [
                  {
                    "action": "Passez en revue les quatre types de règles : règles d'inclusion (sélection automatique des choix associés), règles d'exclusion (prévention des choix incompatibles), règles d'activation (contrôle de la visibilité des choix) et règles conditionnelles (logique SI/ALORS).",
                    "detail": "Les règles d'inclusion forcent la sélection des choix associés ensemble. Les règles d'exclusion empêchent la coexistence de choix conflictuels. Les règles d'activation affichent ou masquent dynamiquement les choix en fonction des sélections précédentes. Les règles conditionnelles fournissent une logique SI/ALORS complexe à conditions multiples. Windchill valide les règles pour prévenir les conflits et les doublons.",
                    "hint": "Les règles d'inclusion et d'exclusion gèrent les relations simples ; les règles d'activation et conditionnelles gèrent les scénarios plus complexes."
                  },
                  {
                    "action": "Passez en revue les ensembles d'options, leur gestion des modifications (versionnement, états du cycle de vie, archivage/extraction) et le processus d'affectation d'un ensemble d'options à un produit configurable.",
                    "detail": "Les ensembles d'options sont des objets gérés avec un support complet de gestion des modifications. Ils doivent être extraits pour modification et archivés pour enregistrer les changements. Le processus d'affectation implique de naviguer vers le produit configurable, de sélectionner Affecter un ensemble d'options dans le menu Actions, de choisir l'ensemble approprié et de vérifier l'affectation.",
                    "hint": "Les ensembles d'options suivent les mêmes workflows de gestion des modifications que les autres objets Windchill."
                  },
                  {
                    "action": "Passez en revue les expressions (de base vs. avancées) et comment elles lient les choix d'options aux articles et aux liens d'utilisation dans la structure produit.",
                    "detail": "Les expressions de base utilisent des références de choix simples (par ex., Couleur=Rouge) et sont prises en charge dans Windchill et Creo. Les expressions avancées utilisent des opérateurs booléens (ET, OU, NON) pour une logique complexe mais restent uniquement dans Windchill. Les expressions sont affectées aux articles et aux liens d'utilisation pour spécifier quand un composant est inclus dans une variante.",
                    "hint": "Les expressions avancées sont plus puissantes mais ne peuvent pas être transmises à Creo."
                  },
                  {
                    "action": "Passez en revue les filtres d'options et comment ils rassemblent tous les éléments : l'ensemble d'options fournit le vocabulaire, les expressions lient les choix aux articles, les règles appliquent les combinaisons valides et le filtre réduit la structure surchargée à une variante spécifique.",
                    "detail": "La création d'un filtre d'options implique la sélection de choix dans l'ensemble d'options affecté. Windchill évalue l'expression de chaque article par rapport aux choix sélectionnés et n'inclut que les articles correspondants. Le résultat est une structure filtrée représentant une variante de produit spécifique. Une spécification de variante enregistre les choix pour une réutilisation future.",
                    "hint": "Le filtre d'options est l'aboutissement de tous les concepts O&V travaillant ensemble."
                  }
                ]
              }
            ]
          }
        ],
        "keyTakeaways": [
          "Le cours couvre quatre modules : présentation des produits configurables, configuration des options et variantes, règles et ensembles d'options",
          "Les concepts clés incluent les stratégies métier, la conception de plateforme, les structures surchargées, les options, les choix, les règles, les expressions, les ensembles d'options et les filtres d'options",
          "Les filtres d'options rassemblent tous les concepts en appliquant des choix à une structure surchargée pour générer des variantes de produit spécifiques",
          "Comprendre l'ensemble du workflow O&V, du pool d'options à la génération de variantes, est essentiel pour une configuration de produit efficace dans Windchill"
        ]
      }
    ]
  },
  "quizzes/q1-configurable-products.json": {
    "moduleId": "m1",
    "title": "Contrôle des connaissances : Produits configurables",
    "questions": [
      {
        "id": "m1-kc-001",
        "question": "Quelle affirmation reflète correctement une approche métier de configuration à la commande ?",
        "options": [
          "Une stratégie pour concevoir des produits avec une liste finie de choix d'options discrets pour les caractéristiques clés du produit.",
          "Une stratégie pour concevoir des produits flexibles, qui peuvent être configurés ou personnalisés pour répondre aux besoins uniques de chaque commande client.",
          "Une stratégie qui consiste à adapter un produit général aux exigences uniques du client avec l'implication de l'ingénierie.",
          "Une stratégie pour concevoir et fabriquer sur mesure un produit afin de répondre aux exigences uniques d'un client spécifique."
        ],
        "answerIndex": 1,
        "rationale": "La configuration à la commande consiste spécifiquement à concevoir des produits flexibles pouvant être configurés ou personnalisés pour répondre aux besoins uniques des clients, généralement à l'aide d'un configurateur avec des règles. L'option A décrit l'assemblage à la commande, l'option C décrit l'ingénierie à la commande, et l'option D décrit le développement de produit sur contrat.",
        "topic": "m1t1"
      },
      {
        "id": "m1-kc-002",
        "question": "Quelle est la première étape du processus de conception de plateforme générique ?",
        "options": [
          "Créer la définition générique du produit",
          "Évaluer les produits existants pour la réutilisation",
          "Analyser les exigences d'optionnalité de la plateforme",
          "Publier et maintenir la plateforme"
        ],
        "answerIndex": 2,
        "rationale": "Le processus de conception de plateforme commence par l'analyse des exigences. Vous devez comprendre quelles options sont nécessaires avant d'évaluer les opportunités de réutilisation ou de construire quoi que ce soit.",
        "topic": "m1t2"
      },
      {
        "id": "m1-kc-003",
        "question": "Qu'est-ce qu'une structure produit surchargée ?",
        "options": [
          "Une structure produit avec trop d'articles à gérer efficacement",
          "Une structure où les sections contiennent plusieurs conceptions pour satisfaire différents niveaux de capacité",
          "Une structure qui a été exportée et réimportée plusieurs fois",
          "Une structure produit qui dépasse le nombre maximum de modules configurables"
        ],
        "answerIndex": 1,
        "rationale": "Une structure produit surchargée contient plusieurs conceptions dans la même section pour prendre en charge une gamme d'options. Lors de la génération de variantes, la structure est filtrée pour ne conserver que les conceptions nécessaires pour une configuration donnée.",
        "topic": "m1t3"
      },
      {
        "id": "m1-kc-004",
        "question": "Pour les stratégies d'assemblage à la commande et d'assemblage sur stock, quelle capacité Windchill est principalement utilisée ?",
        "options": [
          "Des paramètres pour la logique de sélection avancée",
          "Des processus d'approbation basés sur les workflows",
          "Des options et des choix pour filtrer une structure produit surchargée",
          "Une configuration de produit pilotée par la CAO"
        ],
        "answerIndex": 2,
        "rationale": "Les stratégies d'assemblage à la commande et d'assemblage sur stock utilisent des options et des choix pour filtrer une structure produit surchargée. Les paramètres sont utilisés en complément pour les stratégies de configuration à la commande et d'ingénierie à la commande qui nécessitent une logique de sélection plus avancée.",
        "topic": "m1t4"
      }
    ]
  },
  "quizzes/q2-options-and-variants.json": {
    "moduleId": "m2",
    "title": "Contrôle des connaissances : Options et variantes",
    "questions": [
      {
        "id": "m2-kc-001",
        "question": "Quelle affirmation décrit correctement une option dans les Options et Variantes Windchill ?",
        "options": [
          "Un conteneur qui regroupe tous les choix définis pour chaque produit du système",
          "Un enregistrement des saisies utilisateur utilisé pour générer une variante spécifique",
          "Une collection sélectionnée de règles affectée à une famille de produits",
          "Une caractéristique particulière du produit qui peut varier selon les configurations, avec un ou plusieurs choix disponibles"
        ],
        "answerIndex": 3,
        "rationale": "Une option représente une caractéristique particulière du produit qui peut varier selon les configurations et possède un ou plusieurs choix définissant les valeurs valides. L'option A décrit un pool d'options, l'option B décrit une spécification de variante, et l'option C décrit un ensemble d'options (partiellement).",
        "topic": "m2t1"
      },
      {
        "id": "m2-kc-002",
        "question": "Quelle est la relation entre un pool d'options et un ensemble d'options ?",
        "options": [
          "Ce sont des conteneurs identiques utilisés de manière interchangeable",
          "Le pool d'options est un sous-ensemble de l'ensemble d'options pour une famille de produits",
          "L'ensemble d'options est un sous-ensemble sélectionné du pool d'options, ne contenant que les options pertinentes pour une famille de produits spécifique",
          "Le pool d'options contient les règles tandis que l'ensemble d'options contient les choix"
        ],
        "answerIndex": 2,
        "rationale": "Le pool d'options est le référentiel maître de TOUTES les options et choix pour un contexte produit, tandis qu'un ensemble d'options est un sous-ensemble sélectionné ne contenant que les options pertinentes pour les configurations d'une famille de produits spécifique.",
        "topic": "m2t2"
      },
      {
        "id": "m2-kc-003",
        "question": "Quel objet configurable représente les articles spécifiques sélectionnés parmi les articles optionnels d'un module configurable ?",
        "options": [
          "Produit configurable",
          "Variante de module",
          "Filtre d'options",
          "Module configurable"
        ],
        "answerIndex": 1,
        "rationale": "Une Variante de module représente les articles spécifiques sélectionnés parmi les articles optionnels d'un module configurable, en fonction des critères de sélection et des choix. Le Produit configurable est l'article final de niveau supérieur, le Module configurable capture la variabilité au niveau du composant, et un Filtre d'options est le critère utilisé pour filtrer la structure.",
        "topic": "m2t3"
      },
      {
        "id": "m2-kc-004",
        "question": "Quelle est une limitation clé lors de l'utilisation des approches de configuration descendante ou ascendante avec Creo ?",
        "options": [
          "Les configurations ascendantes ne peuvent pas utiliser d'ensembles d'options",
          "Les configurations descendantes nécessitent des mises à jour CAO manuelles",
          "Seules les expressions de base sont transmises de Windchill vers Creo — les expressions avancées restent uniquement dans Windchill",
          "Les configurations descendantes et ascendantes ne peuvent pas produire les mêmes résultats de variante"
        ],
        "answerIndex": 2,
        "rationale": "Quelle que soit l'approche utilisée (descendante ou ascendante), seules les expressions de base sont transmises de Windchill vers Creo. Les expressions avancées restent uniquement dans Windchill. C'est une limitation critique à prendre en compte lors de la planification de la stratégie de configuration.",
        "topic": "m2t4"
      }
    ]
  },
  "quizzes/q3-rules.json": {
    "moduleId": "m3",
    "title": "Contrôle des connaissances : Règles des options et variantes",
    "questions": [
      {
        "id": "m3-kc-001",
        "question": "Quel est l'objectif principal des règles des Options et Variantes ?",
        "options": [
          "Définir l'apparence visuelle des modules configurables dans l'arborescence de la structure",
          "Restreindre l'accès des utilisateurs à des options et choix spécifiques en fonction de leur rôle",
          "Appliquer la logique métier qui régit les relations valides entre les choix et les articles",
          "Créer automatiquement de nouvelles options lorsqu'une famille de produits est publiée"
        ],
        "answerIndex": 2,
        "rationale": "Les règles O&V appliquent la logique métier qui régit les relations valides entre les choix et les articles. Elles garantissent que seules des combinaisons de choix valides peuvent être sélectionnées et que les articles corrects sont inclus dans les structures de variantes.",
        "topic": "m3t1"
      },
      {
        "id": "m3-kc-002",
        "question": "Que se passe-t-il lorsqu'une règle d'exclusion est déclenchée pendant la configuration ?",
        "options": [
          "Le choix exclu est automatiquement sélectionné",
          "Le choix exclu est supprimé définitivement du pool d'options",
          "Le choix exclu devient indisponible, empêchant l'utilisateur de sélectionner une combinaison incompatible",
          "Le choix exclu déclenche un workflow de revue d'ingénierie"
        ],
        "answerIndex": 2,
        "rationale": "Une règle d'exclusion restreint la sélection de choix incompatibles. Lorsqu'elle est déclenchée, le choix exclu devient indisponible dans la liste de sélection, empêchant l'utilisateur de créer une configuration invalide.",
        "topic": "m3t2"
      },
      {
        "id": "m3-kc-003",
        "question": "Quelle affirmation décrit correctement une règle d'activation ?",
        "options": [
          "Une règle qui sélectionne automatiquement tous les choix d'une option donnée",
          "Une règle qui crée dynamiquement de nouveaux choix pendant la configuration",
          "Une règle qui verrouille les choix pour qu'ils ne puissent pas être modifiés après la sélection initiale",
          "Une règle qui fait apparaître uniquement des choix spécifiques dans la liste de sélection une fois qu'un choix cible est sélectionné"
        ],
        "answerIndex": 3,
        "rationale": "Une règle d'activation contrôle quels choix apparaissent dans une liste de sélection en fonction d'autres sélections. Une fois qu'un choix cible est sélectionné, seuls les choix activés deviennent visibles, restreignant les options disponibles aux sélections valides pour ce contexte.",
        "topic": "m3t3"
      }
    ]
  },
  "quizzes/q4-option-sets.json": {
    "moduleId": "m4",
    "title": "Contrôle des connaissances : Ensembles d'options",
    "questions": [
      {
        "id": "m4-kc-001",
        "question": "Quelle affirmation décrit correctement un ensemble d'options ?",
        "options": [
          "Un référentiel maître contenant toutes les options et choix pour chaque produit du système",
          "Une collection sélectionnée d'options, de choix et de règles utilisée pour définir les configurations au sein d'une famille de produits spécifique",
          "Un filtre qui supprime les choix invalides du pool d'options pendant la configuration",
          "Un rapport montrant toutes les spécifications de variantes générées pour un produit"
        ],
        "answerIndex": 1,
        "rationale": "Un ensemble d'options est une collection sélectionnée d'options, de choix et de règles utilisée pour définir les configurations au sein d'une famille de produits spécifique. L'option A décrit un pool d'options, l'option C décrit un filtre d'options, et l'option D décrit un rapport de variantes.",
        "topic": "m4t1"
      },
      {
        "id": "m4-kc-002",
        "question": "Que doit-il se passer avant qu'un ensemble d'options puisse être utilisé pour la configuration de produit ?",
        "options": [
          "L'ensemble d'options doit d'abord être exporté vers un système CAO",
          "L'ensemble d'options doit être affecté à un produit configurable ou un module configurable",
          "L'ensemble d'options doit être approuvé uniquement par un administrateur du site",
          "L'ensemble d'options doit contenir au moins dix options pour être valide"
        ],
        "answerIndex": 1,
        "rationale": "Un ensemble d'options doit être affecté à un produit configurable ou un module configurable avant de pouvoir être utilisé pour la configuration. Cette affectation établit le lien entre l'ensemble d'options disponibles et la structure produit qui sera configurée.",
        "topic": "m4t2"
      },
      {
        "id": "m4-kc-003",
        "question": "Quel est l'objectif d'un filtre d'options dans Windchill ?",
        "options": [
          "Supprimer définitivement du pool d'options les choix qui ne sont plus nécessaires",
          "Créer automatiquement de nouvelles variantes sans intervention de l'utilisateur",
          "Filtrer une structure de produit configurable en fonction des choix affectés aux articles, produisant une variante",
          "Restreindre les utilisateurs pouvant accéder à l'interface de gestion des ensembles d'options"
        ],
        "answerIndex": 2,
        "rationale": "Un filtre d'options utilise des critères basés sur les choix sélectionnés pour filtrer une structure de produit configurable, n'incluant que les articles dont les choix affectés correspondent aux sélections. C'est ainsi qu'une structure surchargée est réduite à une variante spécifique.",
        "topic": "m4t3"
      }
    ]
  }
};
})();
