# Architecture rules

- Keep the portfolio on TanStack Start and represent each case study with a typed file route backed by the existing projects table; this preserves shareable SEO metadata and the current admin data source.
- Load browser-only motion and graphics lazily after hydration, with reduced-motion and low-power static fallbacks, so server rendering stays safe and first paint remains content-first.