# Angular Code Review

## Description
Automatically reviews Angular code changes to ensure they follow modern Angular 21+ patterns, accessibility standards, and monorepo conventions.

## Instructions

You are an Angular code reviewer. When invoked, you should:

1. **Identify changed Angular files** (components, services, guards, etc.)
2. **Read each file** thoroughly
3. **Check against the review checklist** below
4. **Report findings** in a clear, actionable format
5. **Suggest fixes** for any violations

## Review Checklist

### TypeScript & Accessibility
- [ ] Strict type checking enabled
- [ ] No `any` types (use `unknown` if needed)
- [ ] **Passes AXE accessibility checks**
- [ ] **Meets WCAG AA standards** (focus management, color contrast, ARIA attributes, keyboard navigation)

### Modern Angular Patterns
- [ ] No `standalone: true` in decorators (default in Angular 20+)
- [ ] No `@Input()` decorators (use `input.required<T>()` or `input<T>()`)
- [ ] No `@Output()` decorators (use `output<T>()`)
- [ ] No `@HostBinding`/`@HostListener` decorators (use `host` object in decorator)
- [ ] No constructor injection (use `inject()` function)
- [ ] No `BehaviorSubject` for state (use `signal()`)
- [ ] `ChangeDetectionStrategy.OnPush` is set
- [ ] Standalone components only (no NgModules)
- [ ] Functional guards, not class-based guards
- [ ] Lazy loading implemented for feature routes

### Templates & Styling
- [ ] Native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- [ ] No `ngClass` (use `[class.active]="condition()"`)
- [ ] No `ngStyle` (use `[style.width.px]="value()"`)
- [ ] No arrow functions in templates
- [ ] No global assumptions (e.g., `new Date()`)
- [ ] `NgOptimizedImage` used for static images
- [ ] Tailwind CSS only (no custom styles unless necessary)

### State Management
- [ ] Signals used for state (not Observables where possible)
- [ ] `computed()` for derived state
- [ ] No `mutate()` on signals (use `set()` or `update()`)
- [ ] State transformations are pure and predictable

### Forms & Validation
- [ ] Reactive forms preferred over template-driven
- [ ] Zod validation from `@saas/shared/util-schema`

### Architecture (Monorepo)
- [ ] Services in `data-access` libraries (`libs/web/{domain}/*`)
- [ ] Smart components in `feature` libraries
- [ ] Presentational components in `ui` libraries
- [ ] Library has correct tags (`type:*`, `platform:*`, `scope:*`)
- [ ] Application has correct tags as well

## Output Format

Structure your review as:

```markdown
# Angular Code Review Results

## Files Reviewed
- path/to/component.ts
- path/to/service.ts

## ✅ Passes
- Modern Angular patterns followed
- Accessibility requirements met
- ...

## ⚠️ Warnings
### path/to/component.ts:42
**Issue**: Using `@Input()` decorator
**Fix**: Replace with `input.required<Type>()`
```typescript
// Before
@Input() user: User;

// After
user = input.required<User>();
```

### path/to/service.ts:15
**Issue**: Constructor injection used
**Fix**: Use `inject()` function
```typescript
// Before
constructor(private http: HttpClient) {}

// After
private http = inject(HttpClient);
```

## ❌ Violations
(List any critical issues)

## Summary
X files reviewed, Y warnings, Z violations
```

## When to Run

### Manual Invocation
Users can run `/ng-review` to review Angular code changes.

### Automatic Invocation
This skill can be triggered automatically via hooks when Angular files are modified:
- Angular component files (`*.component.ts`)
- Angular service files (`*.service.ts`)
- Template files (`*.html`)
- Files in Angular applications (`apps/*/web/`, `apps/*/landing/`)
- Files in Angular libraries (`libs/web/`)

See `.claude/HOOKS.md` for hook configuration instructions.
