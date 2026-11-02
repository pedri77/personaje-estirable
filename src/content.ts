import datos from './personaje.json';

/**
 * Everything character-specific comes from personaje.json, written by
 * montar.py from the character brief, the expression catalogue and the rig
 * measured by procesar.py. Do not hand-edit the rig: re-run procesar.py.
 */

export const person = {
  name: datos.nombre,
  handle: datos.handle,
  /** Text before the highlighted name in the headline, e.g. "Hola, soy ". */
  greeting: datos.saludo,
};

export const page = datos.pagina;
export const nav = datos.nav;
export const bio = datos.bio;
export const subscribe = datos.suscripcion;
export const discColor = datos.disco;
/** Highlighter behind the name and the theme toggle. */
export const accentColor = datos.acento;

/** Wordmarks for the press strip, each in its own face. */
export const press = datos.prensa;

const keys = [
  'base',
  'l_left',
  'l_right',
  'x_cross',
  'x_tongue',
  'x_shock',
  'x_laugh',
  'x_skeptic',
  'x_whistle',
  'x_smug',
  'x_dizzy',
  'g_grimace',
  'g_ouch',
  'g_squish',
] as const;

export type FaceKey = (typeof keys)[number];

/**
 * Every expression is registered to the same canonical framing (face centred
 * at 0.5, 0.51 of a 1024 square), so they swap in place. A file that fails to
 * load falls back to the base face (a missing grab face falls back to g_grimace).
 */
export const faces = Object.fromEntries(
  keys.map((k) => [k, {src: `/faces/${k}.webp`, mood: (datos.animos as Record<FaceKey, string>)[k]}]),
) as Record<FaceKey, {src: string; mood: string}>;

/** Faces dealt at random when a stretch is let go. */
export const releaseFaces: FaceKey[] = ['x_tongue', 'x_laugh', 'x_skeptic', 'x_whistle', 'x_smug', 'x_cross'];

/** Landmarks in image UV (0–1, v from the top), measured by procesar.py on the normalised base face. */
export const rig = datos.rig;
