# ------------------------------------------------------------------
# Lexique positif FR (≈ 360 mots)
# ------------------------------------------------------------------
self=()
self.positive_words_fr = set([
    # A
    'abondant', 'abouti', 'absolu', 'acceptable', 'accompli', 'accueillant',
    'acéré', 'adorable', 'adorer', 'affectueux', 'affriolant', 'agréable',
    'agrandir', 'alléchant', 'alluré', 'altruiste', 'amélioré', 'amical',
    'amusant', 'angélique', 'apaisant', 'apothéose', 'appréciable', 'apprécier',
    'ardent', 'artistique', 'assuré', 'astucieux', 'athlétique', 'attentif',
    'audacieux', 'auguste', 'authentique', 'avantageux', 'avancé',
    # B
    'belle', 'bénéfique', 'bien', 'bienfaiteur', 'bienheureux', 'bienveillant',
    'bio', 'bluffant', 'booster', 'boosté', 'boutique', 'bravo', 'brillant',
    'brillantissime', 'buoyant', 'bénédiction', 'béton', 'canon', 'captivant',
    'caritatif', 'chanceux', 'charmant', 'chouette', 'classe', 'clair', 'clément',
    'cohérent', 'coloré', 'combattif', 'commode', 'complice', 'complet',
    'concret', 'confiance', 'confiant', 'confortable', 'congratulant',
    'constructif', 'consistant', 'convaincant', 'convivial', 'coopératif',
    'courageux', 'couronné', 'créatif', 'crédible', 'cultivé', 'curatif',
    # D
    'délassant', 'délicat', 'délicieux', 'démarqué', 'd’enfer', 'digne',
    'divertissant', 'divin', 'doué', 'drôle', 'dynamique',
    # E
    'éblouissant', 'éclatant', 'économique', 'éducatif', 'élégant', 'élémentaire',
    'élevé', 'émouvant', 'enchanté', 'enchanteur', 'encourageant', 'endurance',
    'energique', 'engagé', 'enjoué', 'enrichi', 'enrichissant', 'entier',
    'enthousiaste', 'entrainant', 'épanoui', 'épatant', 'éperdu', 'épique',
    'équitable', 'équilibré', 'étoffé', 'étourdissant', 'éuphorique', 'exaltant',
    'excellent', 'exceptionnel', 'exemplaire', 'exploitable', 'exploit', 'express',
    'expressif', 'exquis', 'extra', 'extraordinaire',
    # F
    'fabuleux', 'fameux', 'fantastique', 'fascinant', 'fastueux', 'favori',
    'favorable', 'félicitations', 'festif', 'fervent', 'fidèle', 'fidélité',
    'fiable', 'fier', 'flambant', 'flexible', 'flexibilité', 'fluide', 'formidable',
    'fort', 'fortiche', 'franc', 'fraternel', 'fraîcheur', 'fringant', 'fructueux',
    'fun', 'féerique',
    # G
    'gagnant', 'galant', 'génial', 'génialissime', 'généreux', 'générosité',
    'glamour', 'glorieux', 'good job', 'grand', 'grandiose', 'gratifiant',
    'gratitude', 'gratuit', 'grave cool', 'grâcieux', 'grisant',
    # H
    'habile', 'harmonieux', 'haut', 'haut de gamme', 'héroïque', 'heureux',
    'hilarant', 'honnête', 'honorable',
    # I
    'idéal', 'illustre', 'impeccable', 'impressionnant', 'incroyable',
    'indéniable', 'indestructible', 'ingénieux', 'inoubliable', 'inspirant',
    'instantané', 'intelligent', 'intense', 'intègre', 'intéressant', 'irrésistible',
    # J
    'joli', 'jovial', 'joyeux', 'judicieux', 'juste',
    # K
    'kiff', 'kiffer', 'kiffant',
    # L
    'leader', 'légendaire', 'léger', 'libre', 'lumineux', 'luxueux', 'lyrique',
    # M
    'magnifique', 'majestueux', 'maîtrisé', 'malin', 'marquant', 'merveilleux',
    'mémorable', 'méritant', 'méritoire', 'mignon', 'miraculeux', 'mobile',
    'moderniste', 'motivant', 'motivé',
    # N
    'naturel', 'nickel', 'noble', 'novateur', 'nouveau', 'n°1',
    # O
    'objectif', 'optimal', 'optimiste', 'original', 'or', 'organisé',
    # P
    'paisible', 'palpitant', 'paradis', 'parfait', 'passionnant', 'passionné',
    'patient', 'pépite', 'performant', 'perfection', 'pertinent', 'pétillant',
    'phénoménal', 'phare', 'philanthrope', 'pilier', 'plaisant', 'plein', 'plus‑value',
    'poétique', 'populaire', 'positif', 'potable', 'premium', 'prestigieux',
    'prime', 'privilégié', 'pro', 'proactif', 'productif', 'profitable', 'propre',
    'protecteur', 'prouesse', 'précieux', 'qualitatif',
    # Q‑R
    'que du bon', 'quotidiennement bon', 'rassurant', 'raffiné', 'rapide',
    'rayonnant', 'réactif', 'récompense', 'réconfortant', 'récréatif',
    'remarquable', 'rentable', 'réussi', 'réjouissant', 'résilient', 'respectable',
    'respectueux', 'revigorant', 'riche', 'rigoureux', 'royal', 'rutilant',
    # S
    'sacré bon', 'sage', 'sain', 'satisfaisant', 'savoureux', 'serein',
    'séduisant', 'sensass', 'sensationnel', 'sensible', 'sexy', 'simple',
    'sincère', 'singulier', 'smashing', 'solaire', 'solide', 'somptueux',
    'souriant', 'spectaculaire', 'splendide', 'spontané', 'stable', 'stellaire',
    'stimulant', 'stylé', 'subtil', 'succès', 'super', 'superbe', 'surclassé',
    'surprenant', 'sûr', 'sympa', 'synergie',
    # T
    'talent', 'talentueux', 'tenace', 'terrible (bon)', 'top', 'topissime',
    'total', 'tour de force', 'tranquille', 'transcendant', 'transparent',
    'triomphant', 'triomphe', 'trippant',
    # U‑V
    'ultime', 'ultra', 'unique', 'utile', 'valorisé', 'valorisant', 'valide',
    'vaillant', 'vibrant', 'victorieux', 'vigoureux', 'vital', 'vivace',
    'vivant', 'vivifiant', 'vrai', 'waouh', 'winner',
    # X‑Y‑Z
    'xénial', 'youpie', 'zen', 'zélé', 'éclaireur', 'éclat', 'étoilé'
])

# ------------------------------------------------------------------
# Lexique négatif FR (≈ 360 mots)
# ------------------------------------------------------------------
self.negative_words_fr = set([
    # A
    'abandon', 'abandonné', 'abject', 'abominable', 'absurde', 'abus', 'abuser',
    'accablant', 'accident', 'accuser', 'acerbe', 'affligeant', 'agonie',
    'agressif', 'agression', 'agité', 'alarmant', 'aliéné', 'angoisse',
    'angoissant', 'annihiler', 'antipathique', 'apathique', 'appel au secours',
    'arbitraire', 'arnaque', 'arnaqueur', 'arrogant', 'asphyxier', 'assassin',
    'assassiner', 'assaut', 'atrocité', 'attaquer', 'austère', 'avarice',
    # B
    'bafoué', 'bagarre', 'barbare', 'barré', 'bataille', 'bête', 'bêtise', 'bidon',
    'bizarre', 'blasé', 'blessure', 'blâmer', 'bloquer', 'boiteux', 'bordel',
    'bourde', 'bourrin', 'bousiller', 'brisé', 'brut', 'brutal', 'brutalité', 'bug',
    # C
    'calamité', 'cancer', 'capricieux', 'casse‑pieds', 'cataclysme', 'catastrophe',
    'chaos', 'chaotique', 'charognard', 'chiant', 'chipoter', 'choc', 'choquer',
    'clash', 'cloîtrer', 'coincer', 'colère', 'comploter', 'complot', 'compromettre',
    'condamner', 'confisquer', 'conflit', 'confondre', 'confus', 'confusion',
    'connerie', 'conspuer', 'consternation', 'contraindre', 'contrarier',
    'controverse', 'corrompre', 'corruption', 'coupable', 'couper', 'courroux',
    'craindre', 'crapule', 'craquer', 'crash', 'crasse', 'cri', 'criminel',
    'critique', 'cruel', 'cruauté', 'cul‑de‑sac', 'cynique',
    # D
    'damné', 'danger', 'dangereux', 'dégager', 'déboire', 'débordement', 'débris',
    'déchiré', 'déconner', 'défaite', 'défectueux', 'défigurer', 'défoncer',
    'dégât', 'dégoût', 'dégoûtant', 'dégrader', 'dégueu', 'dégueulasse',
    'délaissé', 'délirant', 'délit', 'démence', 'démolir', 'dénigrer', 'dénoncer',
    'dépérir', 'déplaisant', 'déplorer', 'déprimer', 'déprimé', 'déranger',
    'désastre', 'désastreux', 'désavantage', 'désespoir', 'désillusion',
    'déstabiliser', 'destructeur', 'destruction', 'détresse', 'détruire',
    'diabolique', 'difficile', 'diffamer', 'dilapider', 'diminuer', 'discorde',
    'discréditer', 'discrimination', 'disgrâce', 'disparu', 'dispute', 'dissident',
    'dissuasif', 'dissoudre', 'doléance', 'dommage', 'douleur', 'drame',
    'dru', 'démuni',
    # E
    'échouer', 'effacer', 'effaré', 'effondrer', 'effrayant', 'effroi', 'égarer',
    'égoïste', 'égorger', 'empêcher', 'emprisonner', 'encombrer', 'endommager',
    'endurer', 'enfer', 'enflure', 'enfoncer', 'engueuler', 'ennemi', 'ennuyeux',
    'ennuyer', 'entacher', 'entaille', 'enterrement', 'envenimer', 'envie',
    'envieux', 'épave', 'épine', 'épouvantable', 'épuisé', 'erreur', 'escroquer',
    'escroc', 'espion', 'étouffer', 'étrangler', 'étrange', 'échec', 'exaspérer',
    'exclure', 'exécrer', 'exigu', 'exilé', 'expulser', 'extorquer',
    # F
    'fâcher', 'faible', 'faillite', 'faillible', 'fainéant', 'falsifier', 'fange',
    'fanatique', 'fatigue', 'fatiguer', 'fausser', 'faux', 'fêlé', 'fiasco',
    'fièvre', 'filou', 'fléau', 'flou', 'folle', 'folie', 'fou', 'fourbe',
    'fracasser', 'fragile', 'frayeur', 'freeze', 'frette', 'frustrant',
    'frustration', 'fuir', 'fumier', 'funeste', 'fureur', 'fusiller', 'gaffe',
    'garce', 'geler', 'gêner', 'gênant', 'gifler', 'glacial', 'gouffre', 'goujat',
    'grossier', 'gronder', 'grognement', 'grinçant', 'grotesque', 'gruger',
    # H
    'haine', 'haïr', 'handicap', 'harceler', 'hargneux', 'hésiter', 'heurter',
    'honte', 'honteux', 'horrible', 'horreur', 'hostile', 'humilier',
    # I
    'idiot', 'ignorance', 'ignorant', 'illégal', 'illégitime', 'illogique',
    'immature', 'immobile', 'immoral', 'immonde', 'impasse', 'impitoyable',
    'impoli', 'impopulaire', 'impossible', 'imposteur', 'imprécis', 'imprévisible',
    'improductif', 'incendie', 'incertain', 'incohérent', 'incomplet',
    'incompréhension', 'inconcevable', 'inconfortable', 'inconnu', 'incorrigible',
    'indécent', 'indésirable', 'indigent', 'indigne', 'indiscipliné',
    'inefficace', 'inespéré‑négatif', 'infect', 'infesté', 'infliger', 'infortune',
    'ingrat', 'inhumain', 'injuste', 'injustice', 'insalubre', 'insatisfaisant',
    'insensible', 'insidieux', 'insignifiant', 'insolent', 'instable',
    'insuffisant', 'insulte', 'insupportable', 'intenable', 'interdit',
    'interrompre', 'intolérable', 'intolérant', 'intrus', 'inutile', 'invalidé',
    'invasion', 'irascible', 'ironie', 'ironique', 'irrégulier', 'irresponsable',
    'irritant', 'irriter', 'isolé',
    # J‑K‑L
    'jaloux', 'jamais', 'jeter', 'juger', 'labyrinthe', 'lacune', 'lamentable',
    'lâche', 'lâcheté', 'laide', 'laideur', 'laisser tomber', 'languir',
    'laxiste', 'lenteur', 'lésion', 'lourd', 'lunatique',
    # M
    'macabre', 'machiavélique', 'mal', 'malade', 'maladroit', 'malchance',
    'maldonne', 'malencontreux', 'malentendu', 'malfaçon', 'malfaisant',
    'malgré', 'malheur', 'malhonnête', 'malingre', 'malmener', 'malsain',
    'maltraiter', 'manque', 'manquer', 'manquement', 'manipuler', 'marginal',
    'massacrer', 'massacre', 'mauvais', 'méchant', 'mécontent', 'médiocre',
    'mélancolie', 'menace', 'menacer', 'mensonge', 'menteur', 'merde',
    'mesquin', 'misère', 'misérable', 'monstrueux', 'mort', 'mortel', 'mou',
    'mutiler',
    # N
    'nauséabond', 'naïf', 'néant', 'néfaste', 'négatif', 'négligence', 'négliger',
    'nervosité', 'noirceur', 'non', 'nul', 'nuisible', 'nuisance',
    # O
    'obscur', 'obscène', 'obstacle', 'obtus', 'offenser', 'offensif', 'omission',
    'onéreux', 'opprimer', 'oppression', 'orageux', 'oublier', 'outrage',
    'outrager', 'outré',
    # P
    'pâle', 'panique', 'paralyser', 'paranoïa', 'paria', 'pathétique', 'pauvreté',
    'peine', 'perdre', 'perdu', 'perfide', 'péril', 'pessimisme', 'peste',
    'piège', 'pire', 'pirate', 'pitié', 'plainte', 'pleurer', 'plomber',
    'poids mort', 'poison', 'polluer', 'pollution', 'ponction', 'poursuite',
    'précarité', 'prédateur', 'pressuriser', 'prison', 'problème', 'profane',
    'prohibé', 'punir', 'putain',
    # Q‑R
    'quasiment foutu', 'querelle', 'questionner', 'rabaisser', 'rabat‑joie',
    'rage', 'raide', 'ralentir', 'ramper', 'rapace', 'rature', 'ravager',
    'rebelle', 'rebut', 'rechigner', 'recul', 'reculer', 'redouter', 'réduire',
    'refuser', 'regret', 'rejeter', 'relent', 'remords', 'renoncer', 'renverser',
    'repousser', 'reprocher', 'répréhensible', 'réprimande', 'réprobation',
    'résister', 'ressentiment', 'retard', 'retomber', 'revanche', 'revendiquer',
    'rien', 'rigide', 'risque', 'risqué', 'rival', 'rude', 'ruiner', 'rupture',
    'ruse', 'râler',
    # S
    'saccager', 'sacrifier', 'sadique', 'saturer', 'scandale', 'scélérat',
    'scinder', 'scrupule', 'sécher', 'séisme', 'séparé', 'serrer', 'sévère',
    'shérif absent', 'siffler', 'sombre', 'sordide', 'souci', 'souffrance',
    'souffrir', 'soupçon', 'sourd', 'sournois', 'soustraire', 'spasme', 'stress',
    'stressé', 'stresser', 'subir', 'submerger', 'subversion', 'succube',
    'suffoquer', 'suicidaire', 'suicide', 'supporter pas', 'supplice',
    'suspect', 'suspense négatif', 'suspendre', 'suintant', 'surcoût',
    'surestimer risque', 'surmené', 'survie précaire', 'susurrer de haine',
    # T
    'tainté', 'tamponner', 'tardif', 'tâter mauvais', 'taxer', 'tension',
    'terreur', 'terrible', 'terroriser', 'threat', 'toker', 'tomber', 'toxique',
    'tragédie', 'traitre', 'tranchant', 'trash', 'travesti insulte', 'trembler',
    'triche', 'tricher', 'triste', 'tristesse', 'trouble', 'tumulte', 'turpitude',
    'tyrannie',
    # U‑V‑W‑X‑Y‑Z
    'ugly (fr)', 'ulcérer', 'ultimatum', 'unanime contre', 'unfair', 'unforgiven',
    'usé', 'usurpateur', 'vache', 'vagabond', 'vain', 'vaincre personne',
    'vampire', 'vandale', 'vandalisme', 'vanité', 'vénéneux', 'vengeance',
    'venimeux', 'verdict', 'vexant', 'vexer', 'vice', 'vicieux', 'victime',
    'vif négatif', 'vil', 'villain', 'violation', 'violent', 'vipère', 'virus',
    'vulgaire', 'yoyo émotion', 'zéro', 'zigoto', 'zone rouge'
])
