export * from "./store";
export { default as authReducer } from "./slices/authSlice";

// For JavaScript projects, use these untyped hooks
export {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from "react-redux";
