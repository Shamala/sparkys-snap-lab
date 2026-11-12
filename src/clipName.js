// Clip file names in the voice service: p<project>-<step> for a step, part-<KEY> for a Meet card.
export const clipName = (projectOrPart, step) =>
  typeof projectOrPart === 'string' ? `part-${projectOrPart}` : `p${projectOrPart.id}-${step}`

// What Sparky says for a part (Things you need Play button and the part-<KEY> clips). One place so the clip and the text never drift.
export const partSpeech = (part) => `${part.name}. ${part.what} ${part.why} ${part.how}`
