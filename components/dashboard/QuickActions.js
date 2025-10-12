// Compatibility bridge for tests importing from components/dashboard/QuickActions
// Re-export the actual implementation from the src barrel.
import { QuickActions as QuickActionsComponent } from '../../src/components';
export default QuickActionsComponent;
