// Ensure Date.now remains available even if tests mock global Date constructor
(function ensureDateNow() {
  const RealDate = Date;
  function reattach() {
    try {
      if (typeof Date.now !== 'function') {
        Object.defineProperty(Date, 'now', {
          configurable: true,
          writable: true,
          value: () => new RealDate().getTime(),
        });
      }
    } catch {
      // fallback assignment
      // eslint-disable-next-line no-undef
      Date.now = () => new RealDate().getTime();
    }
  }
  reattach();
  beforeEach(() => reattach());
})();
