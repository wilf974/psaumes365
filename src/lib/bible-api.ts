/**
 * Client API pour api.bible
 * Documentation: https://scripture.api.bible/
 */

const BIBLE_API_KEY = process.env.BIBLE_API_KEY || ''
const BIBLE_API_BASE = process.env.BIBLE_API_URL || 'https://rest.api.bible'

// ID de la Bible Louis Segond (français)
const LSG_BIBLE_ID = '61fd76eafa1577c2-01'

/**
 * Interface pour un verset biblique
 */
export interface BibleVerse {
  id: string
  reference: string
  content: string
  bookId: string
  chapterId: string
}

/**
 * Interface pour un passage biblique
 */
export interface BiblePassage {
  id: string
  reference: string
  content: string
  copyright: string
}

/**
 * Récupère un passage biblique par référence
 * @param passageId - ID du passage (ex: "JHN.3.16" pour Jean 3:16)
 */
export async function getPassage(passageId: string): Promise<BiblePassage | null> {
  try {
    const response = await fetch(
      `${BIBLE_API_BASE}/v1/bibles/${LSG_BIBLE_ID}/passages/${passageId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true`,
      {
        headers: {
          'api-key': BIBLE_API_KEY,
        },
        next: { revalidate: 3600 }, // Cache 1 heure
      }
    )

    if (!response.ok) {
      console.error('Erreur API Bible:', response.status)
      return null
    }

    const data = await response.json()
    return {
      id: data.data.id,
      reference: data.data.reference,
      content: cleanBibleText(data.data.content),
      copyright: data.data.copyright || '',
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du passage:', error)
    return null
  }
}

/**
 * Récupère un verset aléatoire du jour
 * Basé sur la date pour avoir le même verset toute la journée
 */
export async function getDailyVerse(): Promise<BiblePassage | null> {
  // Liste de versets populaires pour le verset du jour
  const dailyVerses = [
    'PSA.23.1-PSA.23.6',   // Psaume 23
    'JHN.3.16',            // Jean 3:16
    'PHP.4.13',            // Philippiens 4:13
    'ROM.8.28',            // Romains 8:28
    'JER.29.11',           // Jérémie 29:11
    'PRO.3.5-PRO.3.6',     // Proverbes 3:5-6
    'ISA.41.10',           // Ésaïe 41:10
    'PSA.46.1',            // Psaume 46:1
    'MAT.11.28-MAT.11.30', // Matthieu 11:28-30
    'PSA.119.105',         // Psaume 119:105
    'JOS.1.9',             // Josué 1:9
    'ROM.12.2',            // Romains 12:2
    'GAL.5.22-GAL.5.23',   // Galates 5:22-23
    'EPH.2.8-EPH.2.9',     // Éphésiens 2:8-9
    'HEB.11.1',            // Hébreux 11:1
    'PSA.91.1-PSA.91.2',   // Psaume 91:1-2
    '1CO.13.4-1CO.13.7',   // 1 Corinthiens 13:4-7
    '2TI.1.7',             // 2 Timothée 1:7
    'PSA.27.1',            // Psaume 27:1
    'ISA.40.31',           // Ésaïe 40:31
    'PHP.4.6-PHP.4.7',     // Philippiens 4:6-7
    'JHN.14.27',           // Jean 14:27
    'PSA.37.4',            // Psaume 37:4
    'MAT.6.33',            // Matthieu 6:33
    'COL.3.23',            // Colossiens 3:23
    '1PE.5.7',             // 1 Pierre 5:7
    'ROM.15.13',           // Romains 15:13
    'PSA.34.8',            // Psaume 34:8
    'LAM.3.22-LAM.3.23',   // Lamentations 3:22-23
    'JHN.15.5',            // Jean 15:5
  ]

  // Sélection basée sur le jour de l'année
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  const verseIndex = dayOfYear % dailyVerses.length

  return getPassage(dailyVerses[verseIndex])
}

/**
 * Nettoie le texte biblique (supprime les balises HTML et caractères spéciaux)
 */
function cleanBibleText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Supprime les balises HTML
    .replace(/\[\d+\]/g, '')  // Supprime les numéros de versets entre crochets
    .replace(/\s+/g, ' ')     // Normalise les espaces
    .trim()
}

/**
 * Données de secours si l'API est indisponible
 */
export const fallbackVerses: BiblePassage[] = [
  {
    id: 'fallback-1',
    reference: 'Psaume 119:105',
    content: 'Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.',
    copyright: 'Louis Segond 1910',
  },
  {
    id: 'fallback-2',
    reference: 'Jean 3:16',
    content: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu\'il ait la vie éternelle.',
    copyright: 'Louis Segond 1910',
  },
  {
    id: 'fallback-3',
    reference: 'Philippiens 4:13',
    content: 'Je puis tout par celui qui me fortifie.',
    copyright: 'Louis Segond 1910',
  },
  {
    id: 'fallback-4',
    reference: 'Jérémie 29:11',
    content: 'Car je connais les projets que j\'ai formés sur vous, dit l\'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l\'espérance.',
    copyright: 'Louis Segond 1910',
  },
  {
    id: 'fallback-5',
    reference: 'Proverbes 3:5-6',
    content: 'Confie-toi en l\'Éternel de tout ton cœur, et ne t\'appuie pas sur ta sagesse; reconnais-le dans toutes tes voies, et il aplanira tes sentiers.',
    copyright: 'Louis Segond 1910',
  },
]

/**
 * Récupère un verset de secours basé sur la date
 */
export function getFallbackDailyVerse(): BiblePassage {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  return fallbackVerses[dayOfYear % fallbackVerses.length]
}

/**
 * Interface pour un résultat de recherche
 */
export interface SearchResult {
  id: string
  reference: string
  content: string
  bookId: string
  chapterId: string
  verseId: string
}

/**
 * Recherche de versets par texte
 * @param query - Texte à rechercher
 * @param limit - Nombre maximum de résultats (défaut: 20)
 */
export async function searchVerses(query: string, limit: number = 20): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  try {
    const response = await fetch(
      `${BIBLE_API_BASE}/v1/bibles/${LSG_BIBLE_ID}/search?query=${encodeURIComponent(query)}&limit=${limit}&sort=relevance`,
      {
        headers: {
          'api-key': BIBLE_API_KEY,
        },
        next: { revalidate: 3600 }, // Cache 1 heure
      }
    )

    if (!response.ok) {
      console.error('Erreur API Bible recherche:', response.status)
      return []
    }

    const data = await response.json()
    
    if (!data.data || !data.data.verses) {
      return []
    }

    return data.data.verses.map((verse: any) => ({
      id: verse.id,
      reference: verse.reference,
      content: cleanBibleText(verse.text),
      bookId: verse.bookId,
      chapterId: verse.chapterId,
      verseId: verse.id,
    }))
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    return []
  }
}

/**
 * Convertit une référence biblique en format passage ID pour l'API
 * Ex: "Jean 3:16" -> "JHN.3.16"
 */
export function parseReference(reference: string): string | null {
  // Mapping des livres bibliques en français vers les codes API
  const bookMap: Record<string, string> = {
    'genèse': 'GEN', 'gen': 'GEN',
    'exode': 'EXO', 'exo': 'EXO',
    'lévitique': 'LEV', 'lev': 'LEV',
    'nombres': 'NUM', 'nom': 'NUM',
    'deutéronome': 'DEU', 'deu': 'DEU',
    'josué': 'JOS', 'jos': 'JOS',
    'juges': 'JDG', 'jug': 'JDG',
    'ruth': 'RUT', 'rut': 'RUT',
    '1 samuel': '1SA', '1 sam': '1SA', '1samuel': '1SA',
    '2 samuel': '2SA', '2 sam': '2SA', '2samuel': '2SA',
    '1 rois': '1KI', '1 roi': '1KI', '1rois': '1KI',
    '2 rois': '2KI', '2 roi': '2KI', '2rois': '2KI',
    '1 chroniques': '1CH', '1 chr': '1CH', '1chroniques': '1CH',
    '2 chroniques': '2CH', '2 chr': '2CH', '2chroniques': '2CH',
    'esdras': 'EZR', 'ezr': 'EZR',
    'néhémie': 'NEH', 'neh': 'NEH',
    'esther': 'EST', 'est': 'EST',
    'job': 'JOB',
    'psaume': 'PSA', 'psaumes': 'PSA', 'ps': 'PSA',
    'proverbes': 'PRO', 'pro': 'PRO',
    'ecclésiaste': 'ECC', 'ecc': 'ECC',
    'cantique': 'SNG', 'sng': 'SNG',
    'ésaïe': 'ISA', 'esaie': 'ISA', 'isa': 'ISA',
    'jérémie': 'JER', 'jeremie': 'JER', 'jer': 'JER',
    'lamentations': 'LAM', 'lam': 'LAM',
    'ézéchiel': 'EZK', 'ezechiel': 'EZK', 'ezk': 'EZK',
    'daniel': 'DAN', 'dan': 'DAN',
    'osée': 'HOS', 'osee': 'HOS', 'hos': 'HOS',
    'joël': 'JOL', 'joel': 'JOL', 'jol': 'JOL',
    'amos': 'AMO', 'amo': 'AMO',
    'abdias': 'OBA', 'oba': 'OBA',
    'jonas': 'JON', 'jon': 'JON',
    'michee': 'MIC', 'mic': 'MIC',
    'nahum': 'NAM', 'nam': 'NAM',
    'habacuc': 'HAB', 'hab': 'HAB',
    'sophonie': 'ZEP', 'zep': 'ZEP',
    'aggée': 'HAG', 'aggee': 'HAG', 'hag': 'HAG',
    'zacharie': 'ZEC', 'zec': 'ZEC',
    'malachie': 'MAL', 'mal': 'MAL',
    'matthieu': 'MAT', 'mat': 'MAT', 'mt': 'MAT',
    'marc': 'MRK', 'mrk': 'MRK', 'mc': 'MRK',
    'luc': 'LUK', 'luk': 'LUK', 'lc': 'LUK',
    'jean': 'JHN', 'jhn': 'JHN', 'jn': 'JHN',
    'actes': 'ACT', 'act': 'ACT',
    'romains': 'ROM', 'rom': 'ROM', 'rm': 'ROM',
    '1 corinthiens': '1CO', '1 cor': '1CO', '1corinthiens': '1CO',
    '2 corinthiens': '2CO', '2 cor': '2CO', '2corinthiens': '2CO',
    'galates': 'GAL', 'gal': 'GAL', 'gl': 'GAL',
    'éphésiens': 'EPH', 'ephesiens': 'EPH', 'eph': 'EPH',
    'philippiens': 'PHP', 'php': 'PHP', 'ph': 'PHP',
    'colossiens': 'COL', 'col': 'COL',
    '1 thessaloniciens': '1TH', '1 thes': '1TH', '1thessaloniciens': '1TH',
    '2 thessaloniciens': '2TH', '2 thes': '2TH', '2thessaloniciens': '2TH',
    '1 timothée': '1TI', '1 tim': '1TI', '1timothee': '1TI',
    '2 timothée': '2TI', '2 tim': '2TI', '2timothee': '2TI',
    'tite': 'TIT', 'tit': 'TIT',
    'philémon': 'PHM', 'philemon': 'PHM', 'phm': 'PHM',
    'hébreux': 'HEB', 'hebreux': 'HEB', 'heb': 'HEB',
    'jacques': 'JAS', 'jas': 'JAS', 'jc': 'JAS',
    '1 pierre': '1PE', '1 pi': '1PE', '1pierre': '1PE',
    '2 pierre': '2PE', '2 pi': '2PE', '2pierre': '2PE',
    '1 jean': '1JN', '1 jn': '1JN', '1jean': '1JN',
    '2 jean': '2JN', '2 jn': '2JN', '2jean': '2JN',
    '3 jean': '3JN', '3 jn': '3JN', '3jean': '3JN',
    'jude': 'JUD', 'jud': 'JUD',
    'apocalypse': 'REV', 'rev': 'REV', 'apoc': 'REV',
  }

  const ref = reference.toLowerCase().trim()
  const match = ref.match(/(\d+\s+)?([a-zéèêà]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/i)
  
  if (!match) {
    return null
  }

  const [, bookNum, bookName, chapter, startVerse, endVerse] = match
  const bookKey = (bookNum ? bookNum.trim() + ' ' : '') + bookName.trim()
  const bookCode = bookMap[bookKey] || bookMap[bookName]

  if (!bookCode) {
    return null
  }

  if (startVerse) {
    if (endVerse) {
      return `${bookCode}.${chapter}.${startVerse}-${bookCode}.${chapter}.${endVerse}`
    }
    return `${bookCode}.${chapter}.${startVerse}`
  }

  return `${bookCode}.${chapter}`
}

