// Compatibility bridge: expose the reducer function for tests
import moodSlice from "../../app/store/slices/moodSlice";

const sliceCompat = moodSlice;

export default sliceCompat;
