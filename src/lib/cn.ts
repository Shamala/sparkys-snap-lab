import { clsx, type ClassValue } from "clsx";

// No tailwind-merge: it does not know the token utilities and would drop classes that look like conflicts.
export const cn = (...inputs: ClassValue[]) => clsx(inputs);
