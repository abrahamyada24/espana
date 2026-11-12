/** Alfabet & pelafalan, dijelaskan dari sudut pandang penutur bahasa Indonesia. */
export interface Letter {
  letter: string
  name: string
  sound: string
  examples: string[]
}

export const ALPHABET: Letter[] = [
  { letter: 'A a', name: 'a', sound: 'Seperti "a" dalam "apa".', examples: ['casa', 'agua'] },
  { letter: 'B b', name: 'be', sound: 'Seperti "b". Di antara vokal menjadi lebih lembut (bibir tidak rapat penuh).', examples: ['bueno', 'abuelo'] },
  { letter: 'C c', name: 'ce', sound: 'Sebelum a/o/u = "k". Sebelum e/i = "s" (Amerika Latin) atau "th" seperti think (Spanyol).', examples: ['casa', 'cena', 'cine'] },
  { letter: 'D d', name: 'de', sound: 'Seperti "d". Di antara vokal/akhir kata menjadi lembut seperti "th" dalam "this".', examples: ['día', 'nada', 'Madrid'] },
  { letter: 'E e', name: 'e', sound: 'Seperti "e" dalam "enak", tidak pernah seperti "e" pepet.', examples: ['mesa', 'leche'] },
  { letter: 'F f', name: 'efe', sound: 'Seperti "f".', examples: ['familia', 'café'] },
  { letter: 'G g', name: 'ge', sound: 'Sebelum a/o/u = "g". Sebelum e/i = "h" yang serak (seperti "kh"). "gue/gui" = "ge/gi".', examples: ['gato', 'gente', 'guitarra'] },
  { letter: 'H h', name: 'hache', sound: 'Selalu BISU, tidak dibaca sama sekali.', examples: ['hola', 'hermano'] },
  { letter: 'I i', name: 'i', sound: 'Seperti "i" dalam "ikan".', examples: ['libro', 'sí'] },
  { letter: 'J j', name: 'jota', sound: 'Seperti "kh" dalam "khusus" (dari tenggorokan).', examples: ['jamón', 'ojo'] },
  { letter: 'K k', name: 'ka', sound: 'Seperti "k". Hanya di kata serapan.', examples: ['kilo'] },
  { letter: 'L l', name: 'ele', sound: 'Seperti "l".', examples: ['libro', 'sol'] },
  { letter: 'Ll ll', name: 'doble ele', sound: 'Seperti "y" dalam "ya" (di Argentina seperti "sy").', examples: ['llamar', 'calle'] },
  { letter: 'M m', name: 'eme', sound: 'Seperti "m".', examples: ['madre', 'mano'] },
  { letter: 'N n', name: 'ene', sound: 'Seperti "n".', examples: ['noche', 'nada'] },
  { letter: 'Ñ ñ', name: 'eñe', sound: 'Seperti "ny" dalam "nyanyi".', examples: ['España', 'mañana', 'niño'] },
  { letter: 'O o', name: 'o', sound: 'Seperti "o" dalam "obat".', examples: ['ojo', 'todo'] },
  { letter: 'P p', name: 'pe', sound: 'Seperti "p", tanpa hembusan udara.', examples: ['padre', 'pan'] },
  { letter: 'Q q', name: 'cu', sound: 'Selalu "que/qui" = "ke/ki". Huruf u tidak dibaca.', examples: ['queso', 'aquí'] },
  { letter: 'R r', name: 'erre', sound: 'Di tengah kata = "r" ringan satu getaran. Di awal kata = "r" bergetar kuat.', examples: ['pero', 'rojo'] },
  { letter: 'Rr rr', name: 'doble erre', sound: '"r" bergetar kuat, seperti "r" dalam "rrrr" bahasa Indonesia.', examples: ['perro', 'arroz'] },
  { letter: 'S s', name: 'ese', sound: 'Seperti "s".', examples: ['sol', 'casa'] },
  { letter: 'T t', name: 'te', sound: 'Seperti "t" Indonesia (lidah menyentuh gigi).', examples: ['taza', 'tomate'] },
  { letter: 'U u', name: 'u', sound: 'Seperti "u" dalam "ular".', examples: ['uno', 'azúcar'] },
  { letter: 'V v', name: 'uve', sound: 'Dibaca SAMA seperti "b"!', examples: ['vino', 'nuevo'] },
  { letter: 'W w', name: 'uve doble', sound: 'Seperti "w". Hanya di kata serapan.', examples: ['wifi'] },
  { letter: 'X x', name: 'equis', sound: 'Seperti "ks". Di beberapa nama Meksiko dibaca "h": México.', examples: ['taxi', 'examen', 'México'] },
  { letter: 'Y y', name: 'ye', sound: 'Seperti "y" dalam "ya". Sendirian ("y" = dan) dibaca "i".', examples: ['yo', 'playa'] },
  { letter: 'Z z', name: 'zeta', sound: 'Seperti "s" (Amerika Latin) atau "th" seperti think (Spanyol).', examples: ['zapato', 'azul'] },
]

export const TIPS: { title: string; body: string }[] = [
  {
    title: 'Vokal selalu konsisten',
    body: 'Hanya ada 5 bunyi vokal (a, e, i, o, u), sama seperti bahasa Indonesia. Kabar baik: ejaan Spanyol sangat fonetis, apa yang ditulis itulah yang dibaca.',
  },
  {
    title: 'Aturan tekanan (acento)',
    body: 'Kata berakhiran vokal, -n, atau -s ditekan di suku kata kedua dari belakang (CA-sa, HA-blan). Kata berakhiran konsonan lain ditekan di suku kata terakhir (ha-BLAR, Ma-DRID). Jika melanggar aturan ini, ditulis tanda aksen: ca-FÉ, ár-bol.',
  },
  {
    title: 'Aksen bisa mengubah arti',
    body: 'si (jika) ≠ sí (ya) · tu (milikmu) ≠ tú (kamu) · el (artikel) ≠ él (dia) · hablo (saya bicara) ≠ habló (dia berbicara).',
  },
  {
    title: 'Spanyol vs Amerika Latin',
    body: 'Perbedaan utama: Spanyol membaca c/z sebagai "th" dan memakai "vosotros". Amerika Latin membaca keduanya "s" dan memakai "ustedes" untuk semua "kalian". Keduanya benar!',
  },
]
