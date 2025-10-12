// Bridge export to resolve duplicate folder naming (crisis-intervention vs crisisIntervention)
// Prefer kebab-case path for imports: `@features/crisis-intervention`
export { default as CrisisManager } from '../crisisIntervention/CrisisManager';
