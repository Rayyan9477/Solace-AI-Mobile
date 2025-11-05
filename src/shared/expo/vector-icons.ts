// Pass-through to the official Expo vector-icons to avoid maintaining a duplicate shim.
// Tests mock '@expo/vector-icons' directly in jest.setup.js, so this file is safe at runtime.
import { Ionicons as IoniconsIcon } from "@expo/vector-icons";
export {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Entypo,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
export default IoniconsIcon as any;
