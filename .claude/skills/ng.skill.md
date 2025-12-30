# Angular Best Practices

## Description
Reviews Angular code and ensures it follows modern Angular 21+ patterns, accessibility standards, and project conventions.

## Instructions

You are an Angular expert reviewing code in this monorepo. Follow these strict guidelines:

### TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- Write functional, maintainable, performant code

### Accessibility Requirements (CRITICAL)
- **MUST pass all AXE checks**
- **MUST follow WCAG AA minimums** including:
  - Focus management
  - Color contrast
  - ARIA attributes
  - Keyboard navigation

### Modern Angular (21+)
- **ALWAYS use Signals** for state management, not RxJS BehaviorSubject
- **ALWAYS use Standalone components**, no NgModules
- **DO NOT set `standalone: true`** in decorators (it's the default in Angular 20+)
- **ALWAYS use input.required<T>()** for required inputs, not @Input()
- **ALWAYS use output<T>()** for outputs, not @Output()
- **ALWAYS use inject()** function instead of constructor injection
- **DO NOT use @HostBinding/@HostListener** - use `host` object in decorator instead
- Use OnPush change detection: `changeDetection: ChangeDetectionStrategy.OnPush`
- Use functional guards (`CanActivateFn`) not class-based guards
- Implement lazy loading for feature routes

### Component Structure
- Keep components small and focused on a single responsibility
- Prefer inline templates for small components
- When using external templates/styles, use paths relative to the component TS file
- Prefer Reactive forms over Template-driven forms

```typescript
import { Component, input, output, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-card',
  // standalone: true is DEFAULT in Angular 20+ - DO NOT set it
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // Use host object instead of @HostBinding/@HostListener
    '[class.selected]': 'isSelected()',
    '(click)': 'handleClick()'
  },
  template: `...`
})
export class UserCardComponent {
  // Use inject() instead of constructor injection
  private userService = inject(UserService);

  // Required input
  user = input.required<User>();

  // Optional input with default
  label = input<string>('Default');

  // Output
  selected = output<User>();

  // Local state
  count = signal(0);

  // Derived state - use computed() for derived state
  doubleCount = computed(() => this.count() * 2);
  isSelected = computed(() => this.count() > 0);

  handleClick() {
    // Use update() or set(), NOT mutate()
    this.count.update(c => c + 1);
  }
}
```

### Templates
- Keep templates simple and avoid complex logic
- **ALWAYS use native control flow** (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- **DO NOT use `ngClass`** - use `class` bindings instead: `[class.active]="isActive()"`
- **DO NOT use `ngStyle`** - use `style` bindings instead: `[style.width.px]="width()"`
- Use the async pipe to handle observables
- Do NOT assume globals like `new Date()` are available
- Do NOT write arrow functions in templates (they are not supported)

**Example:**
```html
<!-- ✅ CORRECT: Native control flow -->
@if (user()) {
  <div [class.active]="isActive()" [style.color]="color()">
    {{ user().name }}
  </div>
}

@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- ❌ WRONG: Old syntax -->
<div *ngIf="user()" [ngClass]="{'active': isActive()}" [ngStyle]="{'color': color()}">
  {{ user().name }}
</div>
```

### Images
- **ALWAYS use `NgOptimizedImage`** for all static images
- Note: `NgOptimizedImage` does NOT work for inline base64 images

```typescript
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  template: `<img ngSrc="/assets/hero.jpg" width="500" height="300" priority />`
})
```

### Styling (Tailwind Only)
- **ONLY use Tailwind CSS** utility classes
- NO custom CSS files unless absolutely necessary
- Use Tailwind's utility-first approach
- Keep component styles minimal

### Data Access Services
- Design services around a single responsibility
- Services return Signals, not Observables (where possible)
- Use `providedIn: 'root'` for singleton services
- **ALWAYS use inject()** function instead of constructor injection
- Keep business logic in services, not components
- Keep state transformations pure and predictable
- Services belong in `data-access-*` libraries

```typescript
@Injectable({ providedIn: 'root' })
export class UsersService {
  // ✅ CORRECT: Use inject() function
  private http = inject(HttpClient);
  private users = signal<User[]>([]);

  // Expose read-only signal
  readonly users$ = this.users.asReadonly();

  async loadUsers() {
    const data = await lastValueFrom(
      this.http.get<User[]>('/api/users')
    );
    // Use set() or update(), NOT mutate()
    this.users.set(data);
  }

  // ❌ WRONG: Constructor injection (old pattern)
  // constructor(private http: HttpClient) {}
}
```

### Routing (Standalone)
- Use lazy loading with `loadComponent` and `loadChildren`
- Use functional guards
- Define routes in `*.routes.ts` files

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard.component').then(m => m.DashboardComponent)
  }
];
```

### Form Validation with Zod
- Import schemas from `@saas/shared/util-schema`
- Validate form data with Zod before submission
- Handle ZodError for user feedback

```typescript
onSubmit() {
  const formData = this.form.getRawValue();
  try {
    const validData = UserSchema.parse(formData);
    await this.service.create(validData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      this.handleErrors(error);
    }
  }
}
```

### Library Organization
- Libraries use tags: `type:*,platform:web,scope:*`
- Feature libraries contain smart components with routing
- UI libraries contain presentational components
- Data-access libraries contain services and HTTP clients

```
libs/web/feature-dashboard/
├── src/
│   ├── lib/
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.routes.ts
│   │   └── index.ts
│   └── index.ts
└── project.json (tags: type:feature,platform:web,scope:*)
```

### Smart vs Presentational Components

**Smart (Feature):**
- Handle routing and navigation
- Inject services
- Manage application state
- Located in `feature-*` libraries

**Presentational (UI):**
- Only inputs and outputs
- No service injection
- Pure presentation logic
- Located in `ui-*` libraries

### Common Patterns

**Signal-based State:**
```typescript
private state = signal({
  items: [] as Item[],
  loading: false,
  error: null as string | null
});

items = computed(() => this.state().items);
loading = computed(() => this.state().loading);
```

**Functional Guard:**
```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// ✅ CORRECT: Functional guard with inject()
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated()
    ? true
    : router.createUrlTree(['/login']);
};

// ❌ WRONG: Class-based guard (deprecated)
```

## Quick Reference

**Common Mistakes to Avoid:**
```typescript
// ❌ WRONG
@Component({ standalone: true }) // Don't set (default in v20+)
@Input() name: string; // Use input.required<string>()
@Output() click = new EventEmitter(); // Use output<void>()
constructor(private http: HttpClient) {} // Use inject()
signal.mutate(x => x.push(1)); // Use update() or set()

// ❌ WRONG - Templates
*ngIf="condition" // Use @if (condition)
[ngClass]="{'active': true}" // Use [class.active]="true"
[ngStyle]="{'color': 'red'}" // Use [style.color]="'red'"
```

**For automated code reviews, see `.claude/skills/ng-review.skill.md`**
