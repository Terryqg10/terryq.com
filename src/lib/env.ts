import 'server-only';
import { parseEnv } from './env-schema';

/** Variables de entorno validadas. Solo servidor; si falta alguna, el build falla. */
export const env = parseEnv(process.env);
