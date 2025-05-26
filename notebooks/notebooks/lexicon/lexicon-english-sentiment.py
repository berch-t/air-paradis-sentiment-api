# ----------------------------------------------------------------------
# Extensive English sentiment lexicons – natural‑language tokens only
# ----------------------------------------------------------------------
self = {}
self.positive_words = set([
    # A
    'able', 'abundance', 'acclaim', 'accomplish', 'accomplished', 'achievement',
    'active', 'admire', 'admired', 'admirable', 'advantage', 'advanced', 'adventurous',
    'affable', 'affection', 'agreeable', 'alert', 'alive', 'amazing', 'ambitious',
    'angelic', 'appealing', 'appreciate', 'appreciated', 'appreciation', 'apt',
    'astonishing', 'astounding', 'attractive', 'authentic', 'awesome',
    # B
    'balance', 'beaming', 'beautiful', 'believe', 'beloved', 'beneficial', 'benefit',
    'best', 'better', 'bless', 'blessed', 'blessing', 'bliss', 'blissful', 'bloom',
    'booming', 'boost', 'brave', 'bravery', 'bright', 'brilliant', 'bubbly',
    'buoyant',
    # C
    'calm', 'captivating', 'celebrate', 'celebrated', 'champion', 'charismatic',
    'cheer', 'cheerful', 'cherish', 'clarity', 'classic', 'clean', 'clever',
    'comfort', 'comfortable', 'commendable', 'confident', 'congratulations',
    'consistent', 'constructive', 'cool', 'courageous', 'creative', 'crisp',
    'crucial', 'crystal', 'cute',
    # D
    'daring', 'dazzling', 'dedicated', 'delight', 'delightful', 'delighted',
    'dependable', 'desirable', 'determined', 'dignified', 'diligent', 'dynamic',
    # E
    'eager', 'early', 'earnest', 'easy', 'ecstatic', 'effective', 'efficient',
    'effortless', 'elegant', 'elite', 'empowered', 'empowering', 'encouraging',
    'energised', 'energized', 'engaging', 'enjoy', 'enjoyable', 'enlightened',
    'enthusiastic', 'essential', 'esteemed', 'ethical', 'excellent', 'exceptional',
    'exciting', 'exhilarating', 'exquisite', 'extraordinary', 'eye‑catching',
    # F
    'fabulous', 'fair', 'faithful', 'famed', 'fantastic', 'fascinating', 'favourable',
    'favorable', 'favourite', 'favorite', 'fearless', 'fertile', 'festive', 'fit',
    'flourishing', 'fond', 'fortunate', 'forward', 'free', 'fresh', 'friendly',
    'fun', 'funny', 'future‑proof',
    # G
    'gain', 'gallant', 'generous', 'genius', 'genuine', 'gifted', 'glad', 'glamorous',
    'gleaming', 'glimmering', 'glorious', 'glow', 'goal', 'good', 'gorgeous',
    'grace', 'graceful', 'gracious', 'grand', 'grateful', 'gratitude', 'great',
    'green', 'growth', 'guaranteed',
    # H
    'handsome', 'happy', 'harmonious', 'harmony', 'heartening', 'heartfelt',
    'heroic', 'high‑class', 'highlight', 'honest', 'honour', 'honourable', 'hope',
    'hopeful', 'hugely', 'humane', 'humour', 'humorous',
    # I
    'ideal', 'illustrious', 'imaginative', 'impeccable', 'important', 'impressive',
    'improved', 'improving', 'incredible', 'influential', 'ingenious', 'innovative',
    'inspired', 'inspiring', 'instant', 'intelligent', 'intuitive', 'inventive',
    'invigorating', 'irreproachable',
    # J
    'jolly', 'jovial', 'joy', 'joyful', 'joyous', 'jubilant', 'judicious', 'just',
    # K
    'keen', 'keeper', 'kind', 'kindly', 'kindness', 'knockout', 'knowledgeable',
    # L
    'laudable', 'lavish', 'leader', 'leading', 'legendary', 'liberated', 'life‑saving',
    'light', 'light‑hearted', 'limitless', 'lively', 'logical', 'love', 'lovely',
    'loving', 'loyal', 'luminous', 'lush', 'luxurious',
    # M
    'magic', 'magnificent', 'majestic', 'master', 'masterful', 'masterpiece',
    'meaningful', 'memorable', 'merit', 'merry', 'mind‑blowing', 'miracle',
    'modern', 'momentous', 'motivated', 'motivating', 'mutual',
    # N
    'neat', 'necessary', 'nice', 'nimble', 'noble', 'notable', 'noteworthy',
    'novel', 'nurturing',
    # O
    'optimal', 'optimistic', 'optimal', 'outstanding', 'outperform', 'overjoyed',
    'overtake', 'overwhelming', 'oxygenating',
    # P
    'paradise', 'passionate', 'peace', 'peaceful', 'perfect', 'phenomenal',
    'picturesque', 'pioneering', 'pleasant', 'pleased', 'pleasing', 'plus', 'polished',
    'popular', 'positive', 'powerful', 'praise', 'precious', 'premier', 'premium',
    'pretty', 'prime', 'pristine', 'proactive', 'prodigy', 'productive', 'professiona​l',
    'proficient', 'progress', 'progressive', 'prosper', 'prosperous', 'proud',
    'quality', 'quick', 'quintessential',
    # R
    'radiant', 'rapid', 'rational', 'ready', 'reassuring', 'refined', 'refreshing',
    'rejuvenated', 'rejoice', 'reliable', 'remarkable', 'renewed', 'renowned',
    'resilient', 'resourceful', 'respect', 'respected', 'respectful', 'revitalised',
    'reward', 'rewarding', 'rich', 'robust',
    # S
    'safe', 'satisfied', 'satisfying', 'savvy', 'scenic', 'secure', 'sensational',
    'serene', 'serenity', 'sharp', 'shimmering', 'shining', 'skilful', 'skillful',
    'slick', 'smart', 'smile', 'smooth', 'solid', 'spectacular', 'speedy', 'spirited',
    'splendid', 'stable', 'stellar', 'strength', 'strong', 'stunning', 'style',
    'sublime', 'successful', 'succinct', 'sufficient', 'suitable', 'super', 'superb',
    'superior', 'supportive', 'supreme', 'surpass', 'surprising', 'sustainable',
    'swift',
    # T
    'talent', 'talented', 'terrific', 'thrilled', 'thrilling', 'thriving', 'tidy',
    'top', 'tough', 'tranquil', 'transformative', 'transformed', 'treasure', 'trending',
    'trim', 'triumph', 'triumphant', 'trust', 'trustworthy', 'trusty', 'truthful',
    # U
    'ultimate', 'unbeatable', 'unbiased', 'unblemished', 'unforgettable',
    'unlimited', 'unmatched', 'unparalleled', 'unrivalled', 'unstoppable',
    'upbeat', 'upgraded', 'uplift', 'uplifting', 'useful',
    # V
    'valiant', 'valuable', 'valued', 'vibrant', 'victorious', 'victory', 'vigor',
    'vigorous', 'visionary', 'vital', 'vivacious', 'vivid',
    # W
    'wealthy', 'welcome', 'well', 'well‑done', 'well‑liked', 'wholesome', 'win',
    'winner', 'winning', 'wise', 'wisdom', 'wonderful', 'wondrous', 'worthwhile',
    'worthy',
    # X‑Y‑Z
    'xenial', 'youthful', 'zeal', 'zealous'
])

self.negative_words = set([
    # A
    'abandon', 'abandoned', 'abnormal', 'abrasive', 'absurd', 'abuse', 'abused',
    'abusive', 'accident', 'ache', 'aching', 'acrimonious', 'addict', 'addicted',
    'adverse', 'adversity', 'afraid', 'aggravate', 'aggravated', 'aggravating',
    'aggression', 'aggressive', 'agitated', 'alarm', 'alarming', 'alienate', 'anger',
    'angry', 'anguish', 'annihilate', 'annoy', 'annoyed', 'annoying', 'anxious',
    'apathetic', 'apology', 'appalling', 'apprehensive', 'arbitrary', 'arrogant',
    'ashamed', 'assault', 'atrocious', 'attack', 'austere', 'awful',
    # B
    'backlash', 'bad', 'ban', 'bankrupt', 'barbaric', 'barren', 'batter', 'beastly',
    'begrudge', 'belittle', 'bereft', 'betray', 'betrayal', 'bias', 'bigot',
    'bitter', 'bizarre', 'blacklist', 'blame', 'bleak', 'blind', 'blunder', 'boastful',
    'bogus', 'bore', 'boring', 'botched', 'break', 'breakdown', 'broken', 'brutal',
    'brutality', 'bug', 'bulky', 'bully', 'burden', 'bust', 'busted', 'busy', 'butcher',
    # C
    'calamity', 'cancer', 'capricious', 'careless', 'catastrophe', 'chaos',
    'chaotic', 'cheap', 'cheat', 'cheated', 'cheating', 'choke', 'clamour', 'clash',
    'clumsy', 'collapse', 'complain', 'complaint', 'complex', 'complicated',
    'concern', 'concerned', 'condemn', 'confess', 'conflict', 'confused',
    'confusing', 'congested', 'contempt', 'contested', 'controversial', 'corrupt',
    'corruption', 'costly', 'coward', 'cower', 'crack', 'cramp', 'cranky', 'crap',
    'crash', 'crave', 'crazed', 'crazy', 'crime', 'criminal', 'crisis', 'critic',
    'critical', 'criticise', 'criticism', 'criticize', 'crude', 'cruel', 'crumble',
    'crushed', 'cry', 'cumbersome', 'cynical',
    # D
    'damage', 'damaged', 'damaging', 'danger', 'dangerous', 'dark', 'darn', 'dead',
    'deadly', 'deaf', 'dearth', 'debase', 'debate', 'debilitating', 'debt', 'deceit',
    'deceive', 'deceived', 'deception', 'decimate', 'defeat', 'defect', 'defective',
    'defence', 'defensive', 'deficiency', 'deficit', 'defraud', 'degrade',
    'degraded', 'delay', 'delayed', 'delete', 'delinquent', 'delirious', 'delude',
    'delusion', 'demean', 'demise', 'demolish', 'demoralise', 'denial', 'denied',
    'denounce', 'dense', 'deplorable', 'depress', 'depressed', 'depressing',
    'depression', 'deprive', 'derail', 'deregulate', 'desert', 'deserted',
    'desolate', 'despair', 'desperate', 'despicable', 'destroy', 'destroyed',
    'destruction', 'deteriorate', 'detract', 'detrimental', 'devastate', 'devastated',
    'devastating', 'devious', 'diabolical', 'difficult', 'dirty', 'disable',
    'disabled', 'disadvantage', 'disagree', 'disappear', 'disappoint', 'disappointed',
    'disappointing', 'disaster', 'disastrous', 'disbelief', 'discard', 'discarded',
    'discomfort', 'disconnect', 'discourage', 'discourse', 'discover', 'discredit',
    'discrepancy', 'discriminate', 'disdain', 'disease', 'disgrace', 'disgruntled',
    'disgust', 'disgusted', 'disgusting', 'dishonest', 'dishonour', 'dislike',
    'dismal', 'dismay', 'dismiss', 'disorder', 'disoriented', 'disparage',
    'disparity', 'displace', 'disposable', 'displease', 'displeased', 'dispute',
    'disregard', 'disrepair', 'disrespect', 'disrupt', 'disruption', 'dissatisfied',
    'distaste', 'distinct', 'distress', 'distressed', 'distrust', 'disturb',
    'disturbance', 'disturbed', 'dizzy', 'dodgy', 'doom', 'doomed', 'double‑cross',
    'doubt', 'doubtful', 'down', 'downcast', 'downfall', 'downgrade', 'downhearted',
    'downside', 'drag', 'drain', 'drained', 'dread', 'dreadful', 'dreary', 'drunk',
    'dubious', 'dull', 'dump', 'dysfunctional',
    # E
    'eerie', 'egotistical', 'eliminate', 'embarrass', 'embarrassed', 'embarrassing',
    'emergency', 'emotionless', 'enraged', 'enraging', 'enslave', 'entangle',
    'entrap', 'envy', 'erratic', 'error', 'escape', 'estranged', 'evade', 'evict',
    'evil', 'exacerbate', 'exaggerate', 'excess', 'exclude', 'excruciating',
    'excuse', 'exhaust', 'exhausted', 'exhausting', 'exile', 'expire', 'exploit',
    'explosive', 'expose', 'exposed', 'exposure', 'extinct', 'extortion',
    # F
    'fail', 'failed', 'failing', 'failure', 'fake', 'fall', 'fallen', 'false', 'fanatic',
    'fatal', 'fatigue', 'fault', 'faulty', 'fear', 'fearful', 'feeble', 'fell',
    'ferocious', 'fiasco', 'fiery', 'filthy', 'flagrant', 'flawed', 'flee', 'flimsy',
    'flop', 'flustered', 'foe', 'fool', 'foolish', 'force', 'forced', 'forfeit',
    'forgotten', 'forlorn', 'frail', 'frantic', 'fraud', 'fraudulent', 'fret',
    'friction', 'frighten', 'frightened', 'frightening', 'frivolous', 'frown',
    'frustrate', 'frustrated', 'frustrating', 'frustration', 'futile',
    # G
    'garbage', 'gasp', 'gaudy', 'ghastly', 'glare', 'gloom', 'gloomy', 'glum',
    'gross', 'grotesque', 'gruesome', 'grumble', 'grumpy', 'guilt', 'guilty',
    # H
    'hack', 'hacked', 'haggle', 'half‑hearted', 'hallucinate', 'hamper', 'handicap',
    'hard', 'hardship', 'harm', 'harmful', 'harsh', 'hate', 'hated', 'hateful',
    'havoc', 'hazard', 'hazardous', 'heartache', 'heartbreaking', 'heartless',
    'heavy', 'hell', 'helpless', 'hesitant', 'hideous', 'hinder', 'hiss', 'hoax',
    'horrendous', 'horrible', 'horrid', 'horrific', 'horror', 'hostile', 'hurt',
    'hurtful', 'hustle', 'hysterical',
    # I
    'idiot', 'ignorance', 'ignorant', 'illegal', 'illicit', 'illogical', 'immature',
    'immoral', 'immune', 'impair', 'impatient', 'imperfect', 'impolite',
    'impossible', 'impractical', 'improper', 'impulsive', 'inability', 'inaccurate',
    'inadequate', 'inactive', 'inadvisable', 'inane', 'inappropriate', 'incapable',
    'incompetent', 'inconsiderate', 'inconsistent', 'inconvenient', 'incorrect',
    'indecent', 'indecisive', 'indifferent', 'indignant', 'indoctrinate',
    'ineffective', 'inefficient', 'inept', 'inexact', 'infect', 'infected', 'inferior',
    'infest', 'inflame', 'inflate', 'infringe', 'infuriate', 'infuriated', 'inhibit',
    'inhumane', 'injure', 'injured', 'injury', 'injustice', 'insane', 'insensitive',
    'insidious', 'insignificant', 'insincere', 'insolent', 'insomnia', 'instability',
    'insult', 'insulting', 'insupportable', 'intense', 'interfere', 'interrupted',
    'intimidate', 'intolerable', 'intolerant', 'invalid', 'invasion', 'inverse',
    'irrational', 'irrelevant', 'irresponsible', 'irritate', 'irritated', 'irritating',
    'irritation', 'isolate', 'itchy',
    # J
    'jealous', 'jeopardise', 'jeopardize', 'jinx', 'jittery', 'joke', 'junky',
    # K
    'kill', 'killer', 'killing', 'knocked', 'knock‑off', 'kriticise', 'kriticize',
    # L
    'lack', 'lacking', 'lag', 'laggy', 'lament', 'lame', 'landslide', 'languish',
    'large‑scale', 'lash', 'last‑ditch', 'laughable', 'lawsuit', 'lazy', 'leak',
    'leaked', 'leakage', 'lethal', 'liability', 'liar', 'lies', 'lifeless', 'limit',
    'limited', 'litigation', 'litter', 'livid', 'lonely', 'loom', 'loophole',
    'lose', 'loss', 'lost', 'lousy', 'ludicrous', 'lunatic', 'lurking', 'lying',
    # M
    'mad', 'maladjusted', 'malady', 'malfunction', 'malicious', 'malignant',
    'malpractice', 'manipulate', 'manipulative', 'manipulation', 'martyr', 'massacre',
    'mean', 'measly', 'mediocre', 'melancholy', 'menace', 'mess', 'messy', 'migrant',
    'misbehave', 'misconduct', 'misery', 'misfortune', 'misguided', 'mishap',
    'misinformation', 'mislead', 'misleading', 'misplace', 'mistake', 'mistaken',
    'mistrust', 'misuse', 'moan', 'mock', 'molest', 'monster', 'morbid', 'mourn',
    'muddle', 'muffled', 'murder', 'murky',
    # N
    'naive', 'nasty', 'negative', 'neglect', 'negligent', 'nervous', 'nightmare',
    'noise', 'noisy', 'nonsense', 'not', 'nothing', 'numb', 'nuisance', 'nutty',
    # O
    'obese', 'object', 'objection', 'obnoxious', 'obscene', 'obsessive', 'obsolete',
    'obstacle', 'odd', 'offence', 'offend', 'offended', 'offensive', 'old',
    'ominous', 'oppress', 'oppression', 'outrage', 'outrageous', 'overcharge',
    'overload', 'overlook', 'overprice', 'overrun', 'overweight', 'overwhelm',
    'overwhelmed', 'oversight', 'overtired', 'overturned',
    # P
    'pain', 'painful', 'panic', 'paradox', 'paranoid', 'pardon', 'pathetic',
    'penalty', 'peril', 'perish', 'perjury', 'persecute', 'pessimistic', 'petty',
    'phobia', 'pitfall', 'pitiful', 'plague', 'plastic', 'plead', 'pointless',
    'polluted', 'poor', 'poorly', 'poverty', 'powerless', 'precarious', 'prejudice',
    'pressure', 'pretence', 'prison', 'problem', 'problems', 'procrastinate',
    'profanity', 'prohibit', 'prolong', 'prone', 'provoke', 'pseudo', 'psycho',
    'punish', 'punitive', 'pushy', 'puzzled',
    # Q
    'quack', 'question', 'questionable', 'quicksand', 'quit', 'quitter',
    # R
    'rabid', 'rage', 'ragged', 'rash', 'rattle', 'ravage', 'reckless', 'refuse',
    'regress', 'regret', 'reject', 'rejection', 'relapse', 'relentless', 'reluctant',
    'remorse', 'repel', 'repetitive', 'resent', 'resentful', 'resign', 'resistance',
    'restless', 'restrict', 'restricted', 'retaliate', 'retreat', 'revenge',
    'revoke', 'ridicule', 'rigid', 'riot', 'risk', 'risky', 'rival', 'rob', 'robbery',
    'rotten', 'rough', 'rubbish', 'rude', 'ruin', 'ruined', 'rumour', 'rust', 'ruthless',
    # S
    'sad', 'sadden', 'sadness', 'salty', 'sarcasm', 'sarcastic', 'scam', 'scandal',
    'scared', 'scary', 'sceptical', 'scratch', 'scream', 'screwed', 'seedy',
    'selfish', 'senseless', 'severe', 'shabby', 'shadowy', 'shady', 'shame',
    'shameful', 'shaky', 'shallow', 'shame', 'shatter', 'sheer', 'shock', 'shocked',
    'shocking', 'shoddy', 'shortage', 'short‑sighted', 'shrink', 'shut', 'sick',
    'sicken', 'sickness', 'sin', 'sinister', 'skeptical', 'slack', 'slag', 'slow',
    'sluggish', 'smelly', 'smoke', 'smuggle', 'snag', 'sneer', 'so‑called', 'sorry',
    'spoil', 'spoiled', 'spook', 'stagnate', 'stagnant', 'stain', 'stale', 'stall',
    'stark', 'starve', 'steal', 'stench', 'stiff', 'stingy', 'stink', 'stolen',
    'stormy', 'strain', 'strange', 'stress', 'stressed', 'stressful', 'stricken',
    'strike', 'stringent', 'struggle', 'stuck', 'stupid', 'subdue', 'subpar',
    'substandard', 'suffer', 'suffering', 'suffocate', 'sullen', 'suspect',
    'suspicious', 'swindle', 'symptom', 'systemic',
    # T
    'taint', 'tamper', 'tarnish', 'tear', 'tears', 'temper', 'tense', 'terrible',
    'terrified', 'terrify', 'terror', 'terrorism', 'terrorist', 'threat', 'threaten',
    'threatened', 'threatening', 'thin', 'thorn', 'thoughtless', 'thump', 'tired',
    'tiresome', 'toxic', 'tragic', 'tragedy', 'traitor', 'trash', 'travesty',
    'treacherous', 'tremble', 'trick', 'trivial', 'trouble', 'troublesome',
    'tumult', 'turmoil', 'turpid', 'turbulent', 'tyrant',
    # U
    'ugly', 'unable', 'uncertain', 'unclear', 'uncomfortable', 'unconcerned',
    'uncontrolled', 'uncouth', 'undermine', 'uneasy', 'unexpected', 'unfair',
    'unfamiliar', 'unfinished', 'unfortunate', 'unfriendly', 'unhappy', 'unhealthy',
    'unimpressive', 'unjust', 'unkind', 'unknown', 'unlawful', 'unlucky',
    'unmanageable', 'unnatural', 'unpleasant', 'unreliable', 'unsafe', 'unsatisfied',
    'unscrupulous', 'unstable', 'unsuccessful', 'unsupported', 'unsure',
    'untested', 'untrustworthy', 'untrue', 'unused', 'unwanted', 'unwilling',
    'upheaval', 'upset', 'upsetting', 'urgency', 'useless', 'vague', 'vain', 'vanish',
    # V
    'vengeful', 'venom', 'vex', 'vexed', 'vicious', 'victim', 'vile', 'villain',
    'violate', 'violation', 'violent', 'virus', 'void', 'volatile', 'vulnerable',
    # W
    'wail', 'wane', 'war', 'warn', 'warning', 'waste', 'wasted', 'wasteful',
    'weak', 'weaken', 'weakness', 'wear', 'weary', 'weep', 'weird', 'wither',
    'woe', 'woeful', 'worry', 'worried', 'worse', 'worsen', 'worst', 'worthless',
    'wreck', 'wrecked', 'wrinkle', 'wrong', 'wrongful',
    # X‑Y‑Z
    'xenophobic', 'yell', 'yucky', 'yikes', 'zealous‑negative', 'zero'
])
