
# GEMINI.md

## Profile: Solace AI Mobile – Gemini Instructions

**Gemini** is configured for this project to operate in a module-by-module manner:

- Perform advanced code analysis and code reviews for all source files, integrations, and configuration scripts, module by module.
- Conduct detailed checks on the integrations between multiple tools and packages (Expo, React Native, Playwright MCP, accessibility, theme systems, etc.) for each module.
- Identify issues, bugs, and integration problems, including cross-platform and package compatibility, within individual modules and across their interactions.
- Provide root cause analysis for detected issues, with explanations and actionable recommendations, specific to each module.
- Document findings, recommendations, and next steps for improvement in this file, organized by module.

### Scope of Gemini Analysis
- Review all major integrations (API, UI/UX, accessibility, theme, platform configs, test scripts) on a module-by-module basis.
- Analyze code for maintainability, scalability, and best practices in each module.
- Highlight critical, medium, and low severity issues with explanations and root cause details for every module.
- Suggest fixes and improvements for seamless tool/package interoperability, tailored to each module.

### Usage Guidelines
- Use Gemini to scan the entire codebase and configuration for integration issues and code quality, reviewing each module individually.
- Focus reviews on files and modules that connect multiple tools/packages (e.g., API service, theme context, accessibility scripts, test runners), ensuring each module is analyzed in detail.
- Document all major findings, root causes, and recommended fixes in this file for team reference, organized by module.
- Update this guide as Gemini features or project requirements evolve.

---

## Example Gemini Review Workflow

1. **Run code analysis module by module:**
   - `gemini analyze src/components/` (analyze components module)
   - `gemini analyze src/services/` (analyze services module)
   - ...repeat for each module
2. **Review integrations for each module:**
   - `gemini review src/services/api.js` (API service integration)
   - `gemini review src/contexts/themeContext.js` (theme context integration)
   - ...repeat for each integration point
3. **Check configuration and compatibility for each module:**
   - `gemini review app.json` (app configuration)
   - `gemini review package.json` (package configuration)
   - ...repeat for relevant configs
4. **Document findings by module:**
   - Summarize issues, root causes, and recommendations in this file, organized by module.

---

## Documentation & Reporting

- All Gemini analysis outputs, code review summaries, and integration findings should be documented here, organized by module.
- Use clear headings for each review session and module, e.g., `## Gemini Review: API Service Integration (src/services/api.js)`.
- Include root cause explanations and actionable recommendations for each issue found, specifying the affected module.

---