# Code Review for hamna-site

Run code review on changed files in the hamna-site project.

## Steps:
1. Check git status to see what files have changed
2. Run the code-reviewer agent on changed files
3. Focus on: Astro (.astro) files, React (.tsx) components, TypeScript, Tailwind usage
4. Review for: accessibility, performance, best practices, design system consistency

## Implementation:
When invoked, this command should:
- Use the code-reviewer agent type
- Review changed Astro and TypeScript files
- Provide specific feedback on code quality and adherence to project conventions
