/**
 * Données des plans de méditation pour Psaumes365
 * Chaque plan contient des jours avec versets, méditations et prières
 */

export interface PlanDay {
  day: number
  title: string
  verseRef: string
  verseText: string
  meditation: string
  prayer: string
}

export interface Plan {
  id: string
  title: string
  description: string
  theme: string
  durationDays: number
  imageGradient: string
  icon: string
  days: PlanDay[]
}

export const PLANS_DATA: Plan[] = [
  // Plan 1: La Paix intérieure (7 jours)
  {
    id: '1',
    title: 'La Paix intérieure',
    description: 'Trouvez le repos en Dieu au milieu des tempêtes de la vie.',
    theme: 'paix',
    durationDays: 7,
    imageGradient: 'from-ciel-400 to-ciel-600',
    icon: '🕊️',
    days: [
      {
        day: 1,
        title: 'Le Berger veille',
        verseRef: 'Psaume 23:1-3',
        verseText: "L'Éternel est mon berger: je ne manquerai de rien. Il me fait reposer dans de verts pâturages, il me dirige près des eaux paisibles. Il restaure mon âme.",
        meditation: "Imaginez-vous comme une brebis dans un pâturage verdoyant. Le Berger est là, veillant sur vous. Vous n'avez besoin de rien d'autre que Sa présence. Laissez cette image vous apaiser.",
        prayer: "Seigneur, Tu es mon Berger. Je choisis de me reposer en Toi aujourd'hui. Restaure mon âme et guide-moi vers Ta paix, au nom de Jésus, Amen.",
      },
      {
        day: 2,
        title: 'La paix que Jésus donne',
        verseRef: 'Jean 14:27',
        verseText: "Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point, et ne s'alarme point.",
        meditation: "La paix de Jésus n'est pas comme celle du monde. Elle ne dépend pas des circonstances. C'est une paix profonde, ancrée dans Sa présence. Recevez cette paix maintenant.",
        prayer: "Jésus, je reçois Ta paix aujourd'hui. Que mon cœur ne se trouble pas face aux défis. Ta paix me suffit, au nom de Jésus, Amen.",
      },
      {
        day: 3,
        title: "L'antidote à l'anxiété",
        verseRef: 'Philippiens 4:6-7',
        verseText: "Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ.",
        meditation: "L'inquiétude est une invitation à la prière. Chaque souci peut devenir une prière. Transformez vos anxiétés en conversations avec Dieu, et Sa paix gardera votre cœur.",
        prayer: "Père, je dépose devant Toi toutes mes inquiétudes. Je Te fais confiance pour chaque situation. Merci pour Ta paix qui garde mon cœur, au nom de Jésus, Amen.",
      },
      {
        day: 4,
        title: "L'esprit fixé sur Dieu",
        verseRef: 'Ésaïe 26:3',
        verseText: "À celui qui est ferme dans ses sentiments Tu assures la paix, la paix, parce qu'il se confie en toi.",
        meditation: 'Notre paix dépend de la direction de nos pensées. Quand notre esprit est fixé sur Dieu, la paix règne. Prenez un moment pour rediriger vos pensées vers Lui.',
        prayer: "Seigneur, aide-moi à garder mon esprit fixé sur Toi. Dans le chaos du quotidien, que mes pensées reviennent toujours vers Ta fidélité, au nom de Jésus, Amen.",
      },
      {
        day: 5,
        title: 'Venez à moi',
        verseRef: 'Matthieu 11:28-30',
        verseText: "Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos. Prenez mon joug sur vous et recevez mes instructions, car je suis doux et humble de cœur; et vous trouverez du repos pour vos âmes.",
        meditation: "Jésus invite les fatigués et les chargés. Il ne demande pas la perfection, mais la venue. Approchez-vous de Lui avec vos fardeaux.",
        prayer: "Jésus, je viens à Toi avec mes fardeaux. Je dépose tout à Tes pieds. Merci pour le repos que Tu offres à mon âme, au nom de Jésus, Amen.",
      },
      {
        day: 6,
        title: 'La paix qui gouverne',
        verseRef: 'Colossiens 3:15',
        verseText: "Et que la paix de Christ, à laquelle vous avez été appelés pour former un seul corps, règne dans vos cœurs. Et soyez reconnaissants.",
        meditation: "La paix de Christ doit régner, gouverner dans nos cœurs. Laissez cette paix être l'arbitre de vos décisions et de vos réactions aujourd'hui.",
        prayer: "Seigneur, que Ta paix gouverne mon cœur aujourd'hui. Dans chaque décision, chaque interaction, que Ta paix soit mon guide, au nom de Jésus, Amen.",
      },
      {
        day: 7,
        title: 'Arrêtez-vous et reconnaissez',
        verseRef: 'Psaume 46:10',
        verseText: "Arrêtez, et sachez que je suis Dieu: Je domine sur les nations, je domine sur la terre.",
        meditation: "Dans l'agitation de la vie, Dieu nous invite à nous arrêter. À reconnaître Sa souveraineté. À trouver la paix dans la certitude qu'Il est aux commandes.",
        prayer: "Père, je m'arrête devant Toi. Je reconnais que Tu es Dieu, souverain sur toute chose. Dans cette certitude, je trouve ma paix, au nom de Jésus, Amen.",
      },
    ],
  },

  // Plan 2: Identité en Christ (7 jours)
  {
    id: '2',
    title: 'Identité en Christ',
    description: 'Découvrez qui vous êtes vraiment aux yeux de Dieu.',
    theme: 'identite',
    durationDays: 7,
    imageGradient: 'from-olive-400 to-olive-600',
    icon: '👤',
    days: [
      {
        day: 1,
        title: 'Enfant de Dieu',
        verseRef: 'Jean 1:12',
        verseText: "Mais à tous ceux qui l'ont reçue, à ceux qui croient en son nom, elle a donné le pouvoir de devenir enfants de Dieu.",
        meditation: "Vous n'êtes pas un étranger pour Dieu. Par la foi en Jésus, vous êtes devenu Son enfant. Cette identité ne dépend pas de vos performances, mais de Son amour.",
        prayer: "Père, merci de m'avoir adopté comme Ton enfant. Aide-moi à vivre dans cette identité aujourd'hui, au nom de Jésus, Amen.",
      },
      {
        day: 2,
        title: 'Nouvelle création',
        verseRef: '2 Corinthiens 5:17',
        verseText: "Si quelqu'un est en Christ, il est une nouvelle créature. Les choses anciennes sont passées; voici, toutes choses sont devenues nouvelles.",
        meditation: "En Christ, vous êtes une nouvelle création. Le passé ne vous définit plus. Dieu vous voit à travers le prisme de Sa grâce. Embrassez cette nouvelle identité.",
        prayer: "Seigneur, merci pour cette vie nouvelle en Toi. Aide-moi à laisser derrière moi les vieilles pensées et à marcher dans ma nouvelle identité, au nom de Jésus, Amen.",
      },
      {
        day: 3,
        title: 'Plus de condamnation',
        verseRef: 'Romains 8:1',
        verseText: "Il n'y a donc maintenant aucune condamnation pour ceux qui sont en Jésus-Christ.",
        meditation: "La culpabilité et la honte ne sont pas votre héritage. En Christ, vous êtes libre de toute condamnation. Laissez cette vérité libérer votre cœur.",
        prayer: "Jésus, merci d'avoir porté ma condamnation. Je refuse la culpabilité et j'accepte Ta grâce, au nom de Jésus, Amen.",
      },
      {
        day: 4,
        title: 'Choisi et aimé',
        verseRef: 'Éphésiens 1:4-5',
        verseText: "En lui Dieu nous a élus avant la fondation du monde, pour que nous soyons saints et irrépréhensibles devant lui, nous ayant prédestinés dans son amour à être ses enfants d'adoption par Jésus-Christ.",
        meditation: "Avant même la création du monde, Dieu vous a choisi. Ce choix vient de Son amour, pas de vos mérites. Vous êtes précieux à Ses yeux.",
        prayer: "Père, merci de m'avoir choisi par amour. Que cette vérité transforme ma vision de moi-même, au nom de Jésus, Amen.",
      },
      {
        day: 5,
        title: 'Un peuple royal',
        verseRef: '1 Pierre 2:9',
        verseText: "Vous, au contraire, vous êtes une race élue, un sacerdoce royal, une nation sainte, un peuple acquis, afin que vous annonciez les vertus de celui qui vous a appelés des ténèbres à son admirable lumière.",
        meditation: "Vous appartenez à un peuple royal. Votre identité en Christ vous confère une dignité et un but. Vous êtes appelé à refléter Sa lumière.",
        prayer: "Seigneur, aide-moi à vivre comme un membre de Ton peuple royal, portant Ta lumière dans ce monde, au nom de Jésus, Amen.",
      },
      {
        day: 6,
        title: 'Temple du Saint-Esprit',
        verseRef: '1 Corinthiens 6:19',
        verseText: "Ne savez-vous pas que votre corps est le temple du Saint-Esprit qui est en vous, que vous avez reçu de Dieu, et que vous ne vous appartenez point à vous-mêmes?",
        meditation: "L'Esprit de Dieu habite en vous. Votre corps est Son temple. Cette réalité transforme la façon dont vous vous voyez et dont vous traitez votre corps.",
        prayer: "Saint-Esprit, merci d'habiter en moi. Que ma vie soit un temple digne de Ta présence, au nom de Jésus, Amen.",
      },
      {
        day: 7,
        title: 'Plus que vainqueur',
        verseRef: 'Romains 8:37',
        verseText: "Mais dans toutes ces choses nous sommes plus que vainqueurs par celui qui nous a aimés.",
        meditation: "Quelle que soit la bataille, vous êtes plus que vainqueur. Non par votre force, mais par l'amour de Christ. Cette victoire est déjà acquise.",
        prayer: "Jésus, merci pour la victoire que Tu m'as acquise. Je marche aujourd'hui en vainqueur par Ton amour, au nom de Jésus, Amen.",
      },
    ],
  },

  // Plan 3: La Foi qui déplace les montagnes (7 jours)
  {
    id: '3',
    title: 'La Foi qui déplace les montagnes',
    description: "Fortifiez votre foi et croyez en l'impossible.",
    theme: 'foi',
    durationDays: 7,
    imageGradient: 'from-amber-400 to-orange-500',
    icon: '⛰️',
    days: [
      {
        day: 1,
        title: "Qu'est-ce que la foi ?",
        verseRef: 'Hébreux 11:1',
        verseText: "Or la foi est une ferme assurance des choses qu'on espère, une démonstration de celles qu'on ne voit pas.",
        meditation: "La foi n'est pas un sentiment, mais une conviction. C'est croire en ce que Dieu a promis, même quand nos yeux ne le voient pas encore.",
        prayer: "Seigneur, augmente ma foi. Aide-moi à avoir une ferme assurance en Tes promesses, au nom de Jésus, Amen.",
      },
      {
        day: 2,
        title: 'La source de la foi',
        verseRef: 'Romains 10:17',
        verseText: "Ainsi la foi vient de ce qu'on entend, et ce qu'on entend vient de la parole de Christ.",
        meditation: "La foi grandit en écoutant la Parole de Dieu. Plus vous vous nourrissez des Écritures, plus votre foi se fortifie. Prenez du temps dans la Parole.",
        prayer: "Père, donne-moi faim de Ta Parole. Que ma foi grandisse à mesure que je T'écoute, au nom de Jésus, Amen.",
      },
      {
        day: 3,
        title: 'La foi comme une graine',
        verseRef: 'Matthieu 17:20',
        verseText: "Je vous le dis en vérité, si vous aviez de la foi comme un grain de sénevé, vous diriez à cette montagne: Transporte-toi d'ici là, et elle se transporterait; rien ne vous serait impossible.",
        meditation: "Jésus ne demande pas une grande foi, mais une foi authentique. Même petite, la foi sincère peut accomplir l'impossible avec Dieu.",
        prayer: "Jésus, je T'offre ma petite foi. Multiplie-la pour Ta gloire, au nom de Jésus, Amen.",
      },
      {
        day: 4,
        title: 'Marcher par la foi',
        verseRef: '2 Corinthiens 5:7',
        verseText: "Car nous marchons par la foi et non par la vue.",
        meditation: "La vie chrétienne est un voyage de foi. Nous ne voyons pas toujours le chemin devant nous, mais nous faisons confiance à Celui qui nous guide.",
        prayer: "Seigneur, apprends-moi à marcher par la foi, même quand je ne comprends pas tout, au nom de Jésus, Amen.",
      },
      {
        day: 5,
        title: 'La foi qui plaît à Dieu',
        verseRef: 'Hébreux 11:6',
        verseText: "Or sans la foi il est impossible de lui être agréable; car il faut que celui qui s'approche de Dieu croie que Dieu existe, et qu'il est le rémunérateur de ceux qui le cherchent.",
        meditation: "Dieu prend plaisir dans notre foi. Croire en Lui et en Sa bonté, c'est Lui faire honneur. Votre foi Le réjouit.",
        prayer: "Père, je crois que Tu existes et que Tu récompenses ceux qui Te cherchent. Que ma foi Te soit agréable, au nom de Jésus, Amen.",
      },
      {
        day: 6,
        title: 'La foi sans douter',
        verseRef: 'Jacques 1:6',
        verseText: "Mais qu'il la demande avec foi, sans douter; car celui qui doute est semblable au flot de la mer, agité par le vent et poussé de côté et d'autre.",
        meditation: "Le doute disperse notre foi. Comme une mer agitée, il nous déstabilise. Ancrez votre foi dans les promesses immuables de Dieu.",
        prayer: "Seigneur, affermis mon cœur. Chasse le doute et ancre ma foi en Toi seul, au nom de Jésus, Amen.",
      },
      {
        day: 7,
        title: 'La foi en action',
        verseRef: 'Jacques 2:17',
        verseText: "Il en est ainsi de la foi: si elle n'a pas les œuvres, elle est morte en elle-même.",
        meditation: "La vraie foi se manifeste par des actes. Ce n'est pas juste croire, mais agir selon ce que nous croyons. Que votre foi porte du fruit.",
        prayer: "Jésus, que ma foi soit vivante et active. Montre-moi comment la mettre en pratique aujourd'hui, au nom de Jésus, Amen.",
      },
    ],
  },

  // Plan 4: Combat spirituel (7 jours)
  {
    id: '4',
    title: 'Combat spirituel',
    description: 'Apprenez à résister et à tenir ferme dans la foi.',
    theme: 'combat',
    durationDays: 7,
    imageGradient: 'from-sable-500 to-beige-600',
    icon: '⚔️',
    days: [
      {
        day: 1,
        title: "L'armure de Dieu",
        verseRef: 'Éphésiens 6:10-11',
        verseText: "Au reste, fortifiez-vous dans le Seigneur, et par sa force toute-puissante. Revêtez-vous de toutes les armes de Dieu, afin de pouvoir tenir ferme contre les ruses du diable.",
        meditation: "Le combat spirituel est réel, mais Dieu nous a équipés. Son armure nous protège. Prenez conscience de l'équipement qu'Il vous a donné.",
        prayer: "Seigneur, je me revêts de Ton armure aujourd'hui. Fortifie-moi par Ta puissance, au nom de Jésus, Amen.",
      },
      {
        day: 2,
        title: 'Résister au diable',
        verseRef: 'Jacques 4:7',
        verseText: "Soumettez-vous donc à Dieu; résistez au diable, et il fuira loin de vous.",
        meditation: "La soumission à Dieu précède la résistance au diable. Quand nous nous soumettons à Dieu, nous recevons Sa force pour résister à l'ennemi.",
        prayer: "Père, je me soumets à Toi. Dans Ta force, je résiste à l'ennemi, au nom de Jésus, Amen.",
      },
      {
        day: 3,
        title: 'Vigilance et sobriété',
        verseRef: '1 Pierre 5:8',
        verseText: "Soyez sobres, veillez. Votre adversaire, le diable, rôde comme un lion rugissant, cherchant qui il dévorera.",
        meditation: "L'ennemi est rusé et patient. Il cherche nos moments de faiblesse. Restons vigilants, ancrés dans la prière et la Parole.",
        prayer: "Seigneur, garde-moi vigilant. Que je ne donne aucune prise à l'ennemi, au nom de Jésus, Amen.",
      },
      {
        day: 4,
        title: 'Nos armes spirituelles',
        verseRef: '2 Corinthiens 10:4',
        verseText: "Car les armes avec lesquelles nous combattons ne sont pas charnelles; mais elles sont puissantes, par la vertu de Dieu, pour renverser des forteresses.",
        meditation: "Nos armes ne sont pas physiques mais spirituelles. La prière, la Parole, la louange – ce sont des armes puissantes pour détruire les forteresses.",
        prayer: "Père, apprends-moi à manier les armes spirituelles que Tu m'as données, au nom de Jésus, Amen.",
      },
      {
        day: 5,
        title: 'Vaincre le mal par le bien',
        verseRef: 'Romains 12:21',
        verseText: "Ne te laisse pas vaincre par le mal, mais surmonte le mal par le bien.",
        meditation: "La victoire sur le mal ne vient pas par la vengeance, mais par le bien. Répondre au mal par le bien, c'est suivre l'exemple de Christ.",
        prayer: "Jésus, aide-moi à vaincre le mal par le bien, comme Tu l'as fait, au nom de Jésus, Amen.",
      },
      {
        day: 6,
        title: "Le sang de l'Agneau",
        verseRef: 'Apocalypse 12:11',
        verseText: "Ils l'ont vaincu à cause du sang de l'agneau et à cause de la parole de leur témoignage, et ils n'ont pas aimé leur vie jusqu'à craindre la mort.",
        meditation: "Notre victoire repose sur le sang de Jésus et notre témoignage. Proclamez ce que Christ a fait pour vous – c'est une arme puissante.",
        prayer: "Jésus, je proclame la victoire de Ton sang sur ma vie. Mon témoignage est que Tu m'as sauvé, au nom de Jésus, Amen.",
      },
      {
        day: 7,
        title: 'Tenir ferme',
        verseRef: 'Éphésiens 6:13',
        verseText: "C'est pourquoi, prenez toutes les armes de Dieu, afin de pouvoir résister dans le mauvais jour, et tenir ferme après avoir tout surmonté.",
        meditation: "Après avoir combattu, tenez ferme. La victoire n'est pas seulement de résister, mais de rester debout. Dieu vous donne la force de tenir.",
        prayer: "Père, après avoir tout surmonté, aide-moi à tenir ferme. Ma victoire est en Toi, au nom de Jésus, Amen.",
      },
    ],
  },

  // Plan 5: Guérison intérieure (7 jours)
  {
    id: '5',
    title: 'Guérison intérieure',
    description: 'Laissez Dieu guérir vos blessures et restaurer votre âme.',
    theme: 'guerison',
    durationDays: 7,
    imageGradient: 'from-rose-400 to-pink-500',
    icon: '💚',
    days: [
      {
        day: 1,
        title: 'Il guérit les cœurs brisés',
        verseRef: 'Psaume 147:3',
        verseText: "Il guérit ceux qui ont le cœur brisé, et il panse leurs blessures.",
        meditation: "Dieu voit vos blessures. Il n'est pas distant de votre douleur. Avec tendresse, Il veut panser vos plaies et guérir votre cœur.",
        prayer: "Seigneur, je T'ouvre mon cœur brisé. Viens panser mes blessures, au nom de Jésus, Amen.",
      },
      {
        day: 2,
        title: 'Proche des affligés',
        verseRef: 'Psaume 34:18',
        verseText: "L'Éternel est près de ceux qui ont le cœur brisé, et il sauve ceux qui ont l'esprit dans l'abattement.",
        meditation: "Dans vos moments les plus sombres, Dieu n'est pas loin. Il se tient près de vous, prêt à vous relever et à vous sauver.",
        prayer: "Père, merci d'être près de moi dans ma peine. Sauve-moi de l'abattement, au nom de Jésus, Amen.",
      },
      {
        day: 3,
        title: 'Guéri par ses meurtrissures',
        verseRef: 'Ésaïe 53:5',
        verseText: "Mais il était blessé pour nos péchés, brisé pour nos iniquités; le châtiment qui nous donne la paix est tombé sur lui, et c'est par ses meurtrissures que nous sommes guéris.",
        meditation: "Jésus a porté non seulement nos péchés, mais aussi nos douleurs. Sa souffrance est la source de notre guérison. Recevez cette guérison.",
        prayer: "Jésus, merci pour Tes meurtrissures qui m'apportent la guérison. Je reçois cette guérison, au nom de Jésus, Amen.",
      },
      {
        day: 4,
        title: 'Le Dieu de toute consolation',
        verseRef: '2 Corinthiens 1:3-4',
        verseText: "Béni soit Dieu, le Père de notre Seigneur Jésus-Christ, le Père des miséricordes et le Dieu de toute consolation, qui nous console dans toutes nos afflictions.",
        meditation: "Dieu est le Père des miséricordes. Il console dans toutes les afflictions. Laissez-vous consoler par Sa présence aimante.",
        prayer: "Père des miséricordes, console-moi dans mes afflictions. Je m'abandonne à Ta tendresse, au nom de Jésus, Amen.",
      },
      {
        day: 5,
        title: 'Dieu essuie les larmes',
        verseRef: 'Apocalypse 21:4',
        verseText: "Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n'y aura plus ni deuil, ni cri, ni douleur, car les premières choses ont disparu.",
        meditation: "Un jour, toute douleur disparaîtra. En attendant, Dieu essuie vos larmes avec tendresse. Il promet un avenir sans souffrance.",
        prayer: "Seigneur, essuie mes larmes. Je me réjouis de l'espérance d'un monde sans douleur, au nom de Jésus, Amen.",
      },
      {
        day: 6,
        title: "Restauration de l'âme",
        verseRef: 'Psaume 23:3',
        verseText: "Il restaure mon âme; il me conduit dans les sentiers de la justice, à cause de son nom.",
        meditation: "Dieu ne se contente pas de panser les blessures – Il restaure. Il ramène votre âme à la plénitude qu'Il a voulue pour vous.",
        prayer: "Berger de mon âme, restaure ce qui a été brisé. Conduis-moi dans Tes sentiers, au nom de Jésus, Amen.",
      },
      {
        day: 7,
        title: 'Beauté pour cendre',
        verseRef: 'Ésaïe 61:3',
        verseText: "Pour accorder à ceux qui mènent deuil en Sion, pour leur donner un diadème au lieu de cendre, une huile de joie au lieu du deuil, un vêtement de louange au lieu d'un esprit abattu.",
        meditation: "Dieu transforme les cendres en beauté, le deuil en joie, l'abattement en louange. Il est le Dieu de la transformation.",
        prayer: "Père, transforme mes cendres en beauté. Que ma vie devienne un témoignage de Ta restauration, au nom de Jésus, Amen.",
      },
    ],
  },

  // Plan 6: La Gratitude (7 jours)
  {
    id: '6',
    title: 'La Gratitude',
    description: 'Cultivez un cœur reconnaissant et découvrez la joie.',
    theme: 'gratitude',
    durationDays: 7,
    imageGradient: 'from-yellow-400 to-amber-500',
    icon: '🙏',
    days: [
      {
        day: 1,
        title: 'Rendez grâces en tout',
        verseRef: '1 Thessaloniciens 5:18',
        verseText: "Rendez grâces en toutes choses, car c'est à votre égard la volonté de Dieu en Jésus-Christ.",
        meditation: "La gratitude n'est pas seulement pour les bons moments. C'est un choix quotidien, une posture du cœur qui reconnaît la bonté de Dieu en toutes circonstances.",
        prayer: "Seigneur, je choisis de Te remercier aujourd'hui. En toutes choses, je reconnais Ta bonté, au nom de Jésus, Amen.",
      },
      {
        day: 2,
        title: 'Entrez avec louange',
        verseRef: 'Psaume 100:4',
        verseText: "Entrez dans ses portes avec des louanges, dans ses parvis avec des cantiques! Célébrez-le, bénissez son nom!",
        meditation: "La louange et la reconnaissance ouvrent la porte de la présence de Dieu. Commencez votre journée par la gratitude et entrez dans Sa présence.",
        prayer: "Père, j'entre dans Ta présence avec reconnaissance. Je Te bénis pour qui Tu es, au nom de Jésus, Amen.",
      },
      {
        day: 3,
        title: 'Compter les bienfaits',
        verseRef: 'Psaume 103:2',
        verseText: "Mon âme, bénis l'Éternel, et n'oublie aucun de ses bienfaits!",
        meditation: "Il est facile d'oublier les bienfaits de Dieu. Prenez un moment pour les compter : la vie, la santé, les relations, la grâce... Ne les oubliez pas.",
        prayer: "Mon âme, bénis l'Éternel! Je me souviens de Tes bienfaits et je T'en remercie, au nom de Jésus, Amen.",
      },
      {
        day: 4,
        title: 'Un cœur qui déborde',
        verseRef: 'Colossiens 2:7',
        verseText: "Étant enracinés et fondés en lui, et affermis par la foi, d'après les instructions qui vous ont été données, et abondez en actions de grâces.",
        meditation: "La gratitude doit abonder, déborder de nos vies. Plus nous sommes enracinés en Christ, plus notre reconnaissance grandit.",
        prayer: "Seigneur, enracine-moi profondément en Toi. Que la gratitude déborde de ma vie, au nom de Jésus, Amen.",
      },
      {
        day: 5,
        title: 'Le sacrifice de louange',
        verseRef: 'Hébreux 13:15',
        verseText: "Par lui, offrons sans cesse à Dieu un sacrifice de louange, c'est-à-dire le fruit de lèvres qui confessent son nom.",
        meditation: "Parfois, la louange est un sacrifice. Même quand c'est difficile, choisissez de confesser la bonté de Dieu. C'est un acte de foi.",
        prayer: "Père, je T'offre le sacrifice de ma louange. Même dans les moments difficiles, je confesse Ta bonté, au nom de Jésus, Amen.",
      },
      {
        day: 6,
        title: 'La joie de la gratitude',
        verseRef: 'Philippiens 4:4',
        verseText: "Réjouissez-vous toujours dans le Seigneur; je le répète, réjouissez-vous.",
        meditation: "La gratitude et la joie sont intimement liées. Un cœur reconnaissant est un cœur joyeux. La joie en Dieu ne dépend pas des circonstances.",
        prayer: "Seigneur, je me réjouis en Toi aujourd'hui. Ma joie est enracinée dans Ta fidélité, au nom de Jésus, Amen.",
      },
      {
        day: 7,
        title: 'Témoigner de Sa bonté',
        verseRef: 'Psaume 107:1-2',
        verseText: "Louez l'Éternel, car il est bon, car sa miséricorde dure à toujours! Qu'ainsi disent les rachetés de l'Éternel, ceux qu'il a délivrés de la main de l'ennemi.",
        meditation: "La gratitude se partage. Témoignez de la bonté de Dieu autour de vous. Votre reconnaissance peut encourager d'autres à chercher Dieu.",
        prayer: "Père, je proclame Ta bonté. Utilise mon témoignage pour toucher d'autres vies, au nom de Jésus, Amen.",
      },
    ],
  },

  // Plan 7: L'Amour de Dieu (7 jours)
  {
    id: '7',
    title: "L'Amour de Dieu",
    description: "Plongez dans l'amour inconditionnel du Père.",
    theme: 'amour',
    durationDays: 7,
    imageGradient: 'from-red-400 to-rose-500',
    icon: '❤️',
    days: [
      {
        day: 1,
        title: 'Dieu est amour',
        verseRef: '1 Jean 4:8',
        verseText: "Celui qui n'aime point n'a pas connu Dieu, car Dieu est amour.",
        meditation: "L'amour n'est pas simplement quelque chose que Dieu fait – c'est ce qu'Il est. Son essence même est amour. Tout ce qu'Il fait découle de cet amour.",
        prayer: "Père, révèle-moi la profondeur de Ton amour. Que je connaisse vraiment qui Tu es, au nom de Jésus, Amen.",
      },
      {
        day: 2,
        title: "La preuve de l'amour",
        verseRef: 'Romains 5:8',
        verseText: "Mais Dieu prouve son amour envers nous, en ce que, lorsque nous étions encore des pécheurs, Christ est mort pour nous.",
        meditation: "L'amour de Dieu n'attend pas que nous soyons parfaits. Il nous a aimés dans notre péché. C'est un amour qui prend l'initiative.",
        prayer: "Jésus, merci d'être mort pour moi alors que j'étais encore pécheur. Ton amour me transforme, au nom de Jésus, Amen.",
      },
      {
        day: 3,
        title: 'Un amour éternel',
        verseRef: 'Jérémie 31:3',
        verseText: "De loin l'Éternel m'est apparu: Je t'aime d'un amour éternel; c'est pourquoi je te conserve ma bonté.",
        meditation: "L'amour de Dieu n'a pas de fin. Il ne diminue pas avec le temps. Avant même votre naissance, Il vous aimait déjà d'un amour éternel.",
        prayer: "Seigneur, merci pour Ton amour éternel. Il ne change jamais, même quand je vacille, au nom de Jésus, Amen.",
      },
      {
        day: 4,
        title: 'Rien ne peut nous séparer',
        verseRef: 'Romains 8:38-39',
        verseText: "Car j'ai l'assurance que ni la mort ni la vie, ni les anges ni les dominations, ni les choses présentes ni les choses à venir, ni les puissances, ni la hauteur, ni la profondeur, ni aucune autre créature ne pourra nous séparer de l'amour de Dieu manifesté en Jésus-Christ notre Seigneur.",
        meditation: "Aucune force dans l'univers ne peut vous séparer de l'amour de Dieu. Cette certitude est votre ancre dans toutes les tempêtes.",
        prayer: "Père, je me repose dans la certitude que rien ne peut me séparer de Ton amour, au nom de Jésus, Amen.",
      },
      {
        day: 5,
        title: "La largeur de l'amour",
        verseRef: 'Éphésiens 3:18-19',
        verseText: "Vous puissiez comprendre avec tous les saints quelle est la largeur, la longueur, la profondeur et la hauteur, et connaître l'amour de Christ, qui surpasse toute connaissance.",
        meditation: "L'amour de Christ dépasse notre compréhension. Il est plus large que nos péchés, plus long que notre vie, plus profond que nos blessures.",
        prayer: "Saint-Esprit, aide-moi à saisir les dimensions de l'amour de Christ qui surpasse toute connaissance, au nom de Jésus, Amen.",
      },
      {
        day: 6,
        title: 'Aimés comme Jésus',
        verseRef: 'Jean 15:9',
        verseText: "Comme le Père m'a aimé, je vous ai aussi aimés. Demeurez dans mon amour.",
        meditation: "Jésus vous aime de la même façon que le Père L'aime. Cet amour parfait est pour vous. Demeurez dans cet amour.",
        prayer: "Jésus, aide-moi à demeurer dans Ton amour. Que je ne cherche jamais l'amour ailleurs, au nom de Jésus, Amen.",
      },
      {
        day: 7,
        title: 'Aimer comme on est aimé',
        verseRef: '1 Jean 4:19',
        verseText: "Pour nous, nous l'aimons, parce qu'il nous a aimés le premier.",
        meditation: "Notre capacité d'aimer vient de l'amour que nous avons reçu. Plus nous réalisons combien nous sommes aimés, plus nous pouvons aimer les autres.",
        prayer: "Père, remplis-moi de Ton amour pour que je puisse aimer les autres comme Tu m'as aimé, au nom de Jésus, Amen.",
      },
    ],
  },

  // Plan 8: La Sagesse divine (7 jours)
  {
    id: '8',
    title: 'La Sagesse divine',
    description: "Recherchez la sagesse qui vient d'en haut.",
    theme: 'sagesse',
    durationDays: 7,
    imageGradient: 'from-indigo-400 to-purple-500',
    icon: '📖',
    days: [
      {
        day: 1,
        title: 'Demandez la sagesse',
        verseRef: 'Jacques 1:5',
        verseText: "Si quelqu'un d'entre vous manque de sagesse, qu'il la demande à Dieu, qui donne à tous simplement et sans reproche, et elle lui sera donnée.",
        meditation: "Dieu donne généreusement la sagesse à ceux qui la demandent. Il ne reproche pas notre manque – Il nous invite à demander.",
        prayer: "Père, je Te demande la sagesse aujourd'hui. Guide mes décisions et mes paroles, au nom de Jésus, Amen.",
      },
      {
        day: 2,
        title: 'Le commencement de la sagesse',
        verseRef: 'Proverbes 9:10',
        verseText: "Le commencement de la sagesse, c'est la crainte de l'Éternel; et la science des saints, c'est l'intelligence.",
        meditation: "La vraie sagesse commence par le respect de Dieu. Reconnaître Sa grandeur et Sa souveraineté ouvre la porte à la compréhension.",
        prayer: "Seigneur, donne-moi un cœur qui Te révère. Que ma vie soit fondée sur la crainte de Ton nom, au nom de Jésus, Amen.",
      },
      {
        day: 3,
        title: "La sagesse d'en haut",
        verseRef: 'Jacques 3:17',
        verseText: "La sagesse d'en haut est premièrement pure, ensuite pacifique, modérée, conciliante, pleine de miséricorde et de bons fruits, exempte de duplicité, d'hypocrisie.",
        meditation: "La sagesse divine se reconnaît à ses fruits. Elle apporte la paix, la miséricorde, l'intégrité. Elle est différente de la sagesse du monde.",
        prayer: "Saint-Esprit, donne-moi la sagesse d'en haut. Qu'elle se manifeste dans mes relations, au nom de Jésus, Amen.",
      },
      {
        day: 4,
        title: "Mieux que l'or",
        verseRef: 'Proverbes 16:16',
        verseText: "Combien acquérir la sagesse vaut mieux que l'or! Combien acquérir l'intelligence est préférable à l'argent!",
        meditation: "La sagesse a plus de valeur que toutes les richesses. Elle guide nos pas et nous évite bien des erreurs. Recherchez-la comme un trésor.",
        prayer: "Père, que je valorise la sagesse plus que les richesses matérielles. Aide-moi à la rechercher chaque jour, au nom de Jésus, Amen.",
      },
      {
        day: 5,
        title: 'Écouter les conseils',
        verseRef: 'Proverbes 12:15',
        verseText: "La voie de l'insensé est droite à ses yeux, mais celui qui écoute les conseils est sage.",
        meditation: "Le sage reconnaît qu'il a besoin des autres. Il écoute les conseils, même quand ils sont difficiles à entendre. L'humilité ouvre la voie à la sagesse.",
        prayer: "Seigneur, garde-moi de l'orgueil. Donne-moi l'humilité d'écouter les conseils sages, au nom de Jésus, Amen.",
      },
      {
        day: 6,
        title: 'Agir avec prudence',
        verseRef: 'Éphésiens 5:15-16',
        verseText: "Prenez donc garde de vous conduire avec circonspection, non comme des insensés, mais comme des sages; rachetez le temps, car les jours sont mauvais.",
        meditation: "La sagesse nous appelle à vivre intentionnellement. Chaque jour est précieux. Utilisez votre temps avec discernement.",
        prayer: "Père, aide-moi à racheter le temps. Que mes journées soient remplies de ce qui compte vraiment, au nom de Jésus, Amen.",
      },
      {
        day: 7,
        title: 'Christ, notre sagesse',
        verseRef: '1 Corinthiens 1:30',
        verseText: "Or, c'est par lui que vous êtes en Jésus-Christ, lequel, de par Dieu, a été fait pour nous sagesse, justice et sanctification et rédemption.",
        meditation: "Jésus est notre sagesse. En Lui, nous trouvons tout ce dont nous avons besoin. Plus nous Le connaissons, plus nous marchons dans la sagesse.",
        prayer: "Jésus, Tu es ma sagesse. Aide-moi à Te connaître davantage et à marcher dans Tes voies, au nom de Jésus, Amen.",
      },
    ],
  },

  // Plan 9: La Prière efficace (7 jours)
  {
    id: '9',
    title: 'La Prière efficace',
    description: 'Approfondissez votre vie de prière et parlez à Dieu.',
    theme: 'priere',
    durationDays: 7,
    imageGradient: 'from-teal-400 to-cyan-500',
    icon: '🙌',
    days: [
      {
        day: 1,
        title: 'Entrer dans la chambre',
        verseRef: 'Matthieu 6:6',
        verseText: "Mais quand tu pries, entre dans ta chambre, ferme ta porte, et prie ton Père qui est là dans le lieu secret; et ton Père, qui voit dans le secret, te le rendra.",
        meditation: "La prière est d'abord une rencontre intime avec le Père. Avant les mots, il y a la présence. Trouvez votre lieu secret avec Dieu.",
        prayer: "Père, je viens dans le lieu secret de Ta présence. Merci de m'accueillir tel que je suis, au nom de Jésus, Amen.",
      },
      {
        day: 2,
        title: 'Demandez, cherchez, frappez',
        verseRef: 'Matthieu 7:7-8',
        verseText: "Demandez, et l'on vous donnera; cherchez, et vous trouverez; frappez, et l'on vous ouvrira. Car quiconque demande reçoit, celui qui cherche trouve, et l'on ouvre à celui qui frappe.",
        meditation: "Jésus nous invite à demander avec audace, à chercher avec persévérance, à frapper avec foi. Dieu répond à ceux qui Le cherchent.",
        prayer: "Seigneur, je demande, je cherche, je frappe. Merci de répondre à mes prières, au nom de Jésus, Amen.",
      },
      {
        day: 3,
        title: 'Priez sans cesse',
        verseRef: '1 Thessaloniciens 5:17',
        verseText: "Priez sans cesse.",
        meditation: "La prière n'est pas seulement un moment, c'est un mode de vie. Restez en communion constante avec Dieu tout au long de la journée.",
        prayer: "Père, que ma vie soit une prière continue. Garde mon cœur connecté au Tien à chaque instant, au nom de Jésus, Amen.",
      },
      {
        day: 4,
        title: "La prière de l'accord",
        verseRef: 'Matthieu 18:19-20',
        verseText: "Je vous dis encore que, si deux d'entre vous s'accordent sur la terre pour demander une chose quelconque, elle leur sera accordée par mon Père qui est dans les cieux. Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux.",
        meditation: "Il y a une puissance particulière dans la prière collective. Quand nous nous accordons ensemble, Jésus est au milieu de nous.",
        prayer: "Seigneur, bénis les temps de prière avec mes frères et sœurs. Manifeste Ta présence quand nous prions ensemble, au nom de Jésus, Amen.",
      },
      {
        day: 5,
        title: "L'aide du Saint-Esprit",
        verseRef: 'Romains 8:26',
        verseText: "De même aussi l'Esprit nous aide dans notre faiblesse, car nous ne savons pas ce qu'il nous convient de demander dans nos prières. Mais l'Esprit lui-même intercède par des soupirs inexprimables.",
        meditation: "Même quand nous ne savons pas quoi prier, l'Esprit intercède pour nous. Nous ne sommes jamais seuls dans la prière.",
        prayer: "Saint-Esprit, aide-moi dans ma prière. Intercède pour moi selon la volonté du Père, au nom de Jésus, Amen.",
      },
      {
        day: 6,
        title: 'La prière fervente',
        verseRef: 'Jacques 5:16',
        verseText: "Confessez donc vos péchés les uns aux autres, et priez les uns pour les autres, afin que vous soyez guéris. La prière fervente du juste a une grande efficace.",
        meditation: "La prière du juste est puissante. La ferveur, l'intensité, la passion dans la prière produisent des résultats. Priez avec tout votre cœur.",
        prayer: "Père, donne-moi la ferveur dans la prière. Que mes prières soient efficaces pour Ta gloire, au nom de Jésus, Amen.",
      },
      {
        day: 7,
        title: 'Selon Sa volonté',
        verseRef: '1 Jean 5:14-15',
        verseText: "Nous avons auprès de lui cette assurance, que si nous demandons quelque chose selon sa volonté, il nous écoute. Et si nous savons qu'il nous écoute, quelque chose que nous demandions, nous savons que nous possédons la chose que nous lui avons demandée.",
        meditation: "La confiance dans la prière vient de l'alignement avec la volonté de Dieu. Cherchez Sa volonté et priez avec assurance.",
        prayer: "Père, aligne mes prières sur Ta volonté. Donne-moi l'assurance que Tu m'écoutes et que Tu réponds, au nom de Jésus, Amen.",
      },
    ],
  },

  // Plan 10: La Persévérance (7 jours)
  {
    id: '10',
    title: 'La Persévérance',
    description: "Restez ferme dans les épreuves et tenez bon jusqu'au bout.",
    theme: 'perseverance',
    durationDays: 7,
    imageGradient: 'from-emerald-400 to-green-600',
    icon: '💪',
    days: [
      {
        day: 1,
        title: "L'épreuve produit la persévérance",
        verseRef: 'Jacques 1:2-4',
        verseText: "Mes frères, regardez comme un sujet de joie complète les diverses épreuves auxquelles vous pouvez être exposés, sachant que l'épreuve de votre foi produit la patience. Mais il faut que la patience accomplisse parfaitement son œuvre.",
        meditation: "Les épreuves ne sont pas inutiles. Elles forgent notre caractère et produisent la persévérance. Regardez-les comme des opportunités de croissance.",
        prayer: "Seigneur, aide-moi à voir mes épreuves différemment. Que la persévérance accomplisse son œuvre en moi, au nom de Jésus, Amen.",
      },
      {
        day: 2,
        title: 'Ne pas perdre courage',
        verseRef: 'Galates 6:9',
        verseText: "Ne nous lassons pas de faire le bien; car nous moissonnerons au temps convenable, si nous ne nous relâchons pas.",
        meditation: "La récolte viendra, mais il faut de la patience. Ne vous découragez pas dans le bien. Continuez à semer avec foi.",
        prayer: "Père, garde-moi du découragement. Aide-moi à persévérer dans le bien, sachant que je récolterai, au nom de Jésus, Amen.",
      },
      {
        day: 3,
        title: 'La course de la foi',
        verseRef: 'Hébreux 12:1-2',
        verseText: "Nous aussi, puisque nous sommes environnés d'une si grande nuée de témoins, rejetons tout fardeau, et le péché qui nous enveloppe si facilement, et courons avec persévérance dans la carrière qui nous est ouverte, ayant les regards sur Jésus.",
        meditation: "La vie chrétienne est une course d'endurance. Gardez vos yeux fixés sur Jésus, l'auteur et le consommateur de votre foi.",
        prayer: "Jésus, je garde mes yeux fixés sur Toi. Aide-moi à courir avec persévérance jusqu'à la fin, au nom de Jésus, Amen.",
      },
      {
        day: 4,
        title: 'La force de Dieu',
        verseRef: 'Ésaïe 40:31',
        verseText: "Mais ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; ils courent, et ne se lassent point; ils marchent, et ne se fatiguent point.",
        meditation: "La persévérance ne vient pas de notre propre force, mais de celle que Dieu renouvelle en nous. Confiez-vous en Lui pour être renouvelé.",
        prayer: "Seigneur, renouvelle ma force. Je me confie en Toi pour ne pas me lasser ni me fatiguer, au nom de Jésus, Amen.",
      },
      {
        day: 5,
        title: 'Être fidèle',
        verseRef: 'Apocalypse 2:10',
        verseText: "Sois fidèle jusqu'à la mort, et je te donnerai la couronne de vie.",
        meditation: "La fidélité jusqu'au bout est récompensée. Dieu ne demande pas la perfection, mais la persévérance. Restez fidèle.",
        prayer: "Père, donne-moi la grâce d'être fidèle jusqu'à la fin. Que ma vie Te glorifie, au nom de Jésus, Amen.",
      },
      {
        day: 6,
        title: 'Ne pas abandonner',
        verseRef: 'Hébreux 10:35-36',
        verseText: "N'abandonnez donc pas votre assurance, à laquelle est attachée une grande rémunération. Car vous avez besoin de persévérance, afin qu'après avoir accompli la volonté de Dieu, vous obteniez ce qui vous est promis.",
        meditation: "N'abandonnez pas votre confiance. La promesse est pour ceux qui persévèrent. Tenez ferme dans l'espérance.",
        prayer: "Seigneur, je n'abandonne pas. Je garde mon assurance en Tes promesses. Donne-moi la persévérance, au nom de Jésus, Amen.",
      },
      {
        day: 7,
        title: 'La victoire finale',
        verseRef: 'Matthieu 24:13',
        verseText: "Mais celui qui persévérera jusqu'à la fin sera sauvé.",
        meditation: "La persévérance conduit à la victoire finale. Celui qui tient bon jusqu'à la fin hérite des promesses. Gardez le cap.",
        prayer: "Jésus, aide-moi à persévérer jusqu'à la fin. Je veux remporter la victoire avec Toi, au nom de Jésus, Amen.",
      },
    ],
  },
]

/**
 * Récupère un plan par son ID
 */
export function getPlanById(id: string): Plan | undefined {
  return PLANS_DATA.find((plan) => plan.id === id)
}

/**
 * Récupère les plans par thème
 */
export function getPlansByTheme(theme: string): Plan[] {
  return PLANS_DATA.filter((plan) => plan.theme === theme)
}
