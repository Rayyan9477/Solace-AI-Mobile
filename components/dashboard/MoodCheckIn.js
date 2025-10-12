// Compatibility bridge for tests importing from components/dashboard/MoodCheckIn
// Re-export the actual implementation from the src barrel.
import { MoodCheckIn as MoodCheckInComponent } from '../../src/components';
export default MoodCheckInComponent;