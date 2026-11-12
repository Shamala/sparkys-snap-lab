// Clip file names in the voice service: p<project>-<step> for a step, part-<KEY> for a Meet card.
export const clipName = (projectOrPart, step) =>
  typeof projectOrPart === 'string' ? `part-${projectOrPart}` : `p${projectOrPart.id}-${step}`
