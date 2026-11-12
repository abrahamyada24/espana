export const PERSONS = ['yo', 'tú', 'él/ella/usted', 'nosotros', 'vosotros', 'ellos/ustedes'] as const

export type Tense = 'presente' | 'indefinido' | 'imperfecto' | 'futuro' | 'perfecto'

export const TENSES: { id: Tense; name: string; level: string; desc: string }[] = [
  { id: 'presente', name: 'Presente', level: 'A1', desc: 'Sekarang / kebiasaan' },
  { id: 'indefinido', name: 'Pretérito indefinido', level: 'A2', desc: 'Lampau yang sudah selesai' },
  { id: 'imperfecto', name: 'Pretérito imperfecto', level: 'A2', desc: 'Lampau: kebiasaan & deskripsi' },
  { id: 'perfecto', name: 'Pretérito perfecto', level: 'B1', desc: 'Pengalaman / terkait masa kini' },
  { id: 'futuro', name: 'Futuro simple', level: 'B1', desc: 'Masa depan' },
]

interface VerbDef {
  inf: string
  id_: string
  /** Full irregular forms per tense (6 persons). */
  irr?: Partial<Record<Tense, string[]>>
  /** Irregular future/conditional stem. */
  futStem?: string
  participle?: string
}

export const VERBS: VerbDef[] = [
  { inf: 'hablar', id_: 'berbicara' },
  { inf: 'trabajar', id_: 'bekerja' },
  { inf: 'estudiar', id_: 'belajar' },
  { inf: 'comer', id_: 'makan' },
  { inf: 'beber', id_: 'minum' },
  { inf: 'vivir', id_: 'tinggal' },
  { inf: 'escribir', id_: 'menulis', participle: 'escrito' },
  {
    inf: 'ser',
    id_: 'adalah',
    irr: {
      presente: ['soy', 'eres', 'es', 'somos', 'sois', 'son'],
      indefinido: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
      imperfecto: ['era', 'eras', 'era', 'éramos', 'erais', 'eran'],
    },
  },
  {
    inf: 'estar',
    id_: 'berada / dalam keadaan',
    irr: {
      presente: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'],
      indefinido: ['estuve', 'estuviste', 'estuvo', 'estuvimos', 'estuvisteis', 'estuvieron'],
    },
  },
  {
    inf: 'tener',
    id_: 'memiliki',
    futStem: 'tendr',
    irr: {
      presente: ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'],
      indefinido: ['tuve', 'tuviste', 'tuvo', 'tuvimos', 'tuvisteis', 'tuvieron'],
    },
  },
  {
    inf: 'ir',
    id_: 'pergi',
    irr: {
      presente: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
      indefinido: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
      imperfecto: ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban'],
    },
  },
  {
    inf: 'hacer',
    id_: 'melakukan / membuat',
    futStem: 'har',
    participle: 'hecho',
    irr: {
      presente: ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen'],
      indefinido: ['hice', 'hiciste', 'hizo', 'hicimos', 'hicisteis', 'hicieron'],
    },
  },
  {
    inf: 'poder',
    id_: 'bisa',
    futStem: 'podr',
    irr: {
      presente: ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden'],
      indefinido: ['pude', 'pudiste', 'pudo', 'pudimos', 'pudisteis', 'pudieron'],
    },
  },
  {
    inf: 'querer',
    id_: 'mau / mencintai',
    futStem: 'querr',
    irr: {
      presente: ['quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren'],
      indefinido: ['quise', 'quisiste', 'quiso', 'quisimos', 'quisisteis', 'quisieron'],
    },
  },
  {
    inf: 'decir',
    id_: 'mengatakan',
    futStem: 'dir',
    participle: 'dicho',
    irr: {
      presente: ['digo', 'dices', 'dice', 'decimos', 'decís', 'dicen'],
      indefinido: ['dije', 'dijiste', 'dijo', 'dijimos', 'dijisteis', 'dijeron'],
    },
  },
  {
    inf: 'venir',
    id_: 'datang',
    futStem: 'vendr',
    irr: {
      presente: ['vengo', 'vienes', 'viene', 'venimos', 'venís', 'vienen'],
      indefinido: ['vine', 'viniste', 'vino', 'vinimos', 'vinisteis', 'vinieron'],
    },
  },
  {
    inf: 'saber',
    id_: 'tahu',
    futStem: 'sabr',
    irr: {
      presente: ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben'],
      indefinido: ['supe', 'supiste', 'supo', 'supimos', 'supisteis', 'supieron'],
    },
  },
  {
    inf: 'ver',
    id_: 'melihat',
    participle: 'visto',
    irr: {
      presente: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'],
      indefinido: ['vi', 'viste', 'vio', 'vimos', 'visteis', 'vieron'],
      imperfecto: ['veía', 'veías', 'veía', 'veíamos', 'veíais', 'veían'],
    },
  },
  {
    inf: 'dormir',
    id_: 'tidur',
    irr: {
      presente: ['duermo', 'duermes', 'duerme', 'dormimos', 'dormís', 'duermen'],
      indefinido: ['dormí', 'dormiste', 'durmió', 'dormimos', 'dormisteis', 'durmieron'],
    },
  },
  {
    inf: 'volver',
    id_: 'kembali',
    participle: 'vuelto',
    irr: { presente: ['vuelvo', 'vuelves', 'vuelve', 'volvemos', 'volvéis', 'vuelven'] },
  },
  {
    inf: 'pedir',
    id_: 'meminta / memesan',
    irr: {
      presente: ['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden'],
      indefinido: ['pedí', 'pediste', 'pidió', 'pedimos', 'pedisteis', 'pidieron'],
    },
  },
]

const ENDINGS: Record<'ar' | 'er' | 'ir', Partial<Record<Tense, string[]>>> = {
  ar: {
    presente: ['o', 'as', 'a', 'amos', 'áis', 'an'],
    indefinido: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'],
    imperfecto: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'],
  },
  er: {
    presente: ['o', 'es', 'e', 'emos', 'éis', 'en'],
    indefinido: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
    imperfecto: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
  },
  ir: {
    presente: ['o', 'es', 'e', 'imos', 'ís', 'en'],
    indefinido: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
    imperfecto: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
  },
}
const FUT = ['é', 'ás', 'á', 'emos', 'éis', 'án']
const HABER = ['he', 'has', 'ha', 'hemos', 'habéis', 'han']

export function participle(v: VerbDef): string {
  if (v.participle) return v.participle
  const stem = v.inf.slice(0, -2)
  return v.inf.endsWith('ar') ? `${stem}ado` : `${stem}ido`
}

export function conjugate(v: VerbDef, tense: Tense): string[] {
  const irr = v.irr?.[tense]
  if (irr) return irr
  if (tense === 'futuro') {
    const stem = v.futStem ?? v.inf
    return FUT.map((e) => stem + e)
  }
  if (tense === 'perfecto') {
    const p = participle(v)
    return HABER.map((h) => `${h} ${p}`)
  }
  const cls = v.inf.slice(-2) as 'ar' | 'er' | 'ir'
  // "ir" itself is handled by irr; other 2-letter infinitives (ver, ser) too.
  const stem = v.inf.slice(0, -2)
  return ENDINGS[cls][tense]!.map((e) => stem + e)
}

export function isIrregular(v: VerbDef, tense: Tense): boolean {
  if (tense === 'futuro') return !!v.futStem
  if (tense === 'perfecto') return !!v.participle
  return !!v.irr?.[tense]
}
