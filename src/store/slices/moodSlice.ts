// Bridge slice for tests expecting src/store/slices/moodSlice to expose a { reducer } shape
import reducer, * as moodExports from "../../app/store/slices/moodSlice";

const sliceShim: any = { reducer, ...moodExports };
export default sliceShim;
