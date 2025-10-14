// Compatibility bridge: expose an object with `.reducer` so tests can call `moodSlice.reducer`
import reducer from "../../app/store/slices/moodSlice";

const sliceCompat = { reducer };

export default sliceCompat;
export * from "../../app/store/slices/moodSlice";
