// Compatibility module for tests
export const FocusManagement = {
  announceForScreenReader: jest ? jest.fn() : () => {},
};

export default { FocusManagement };