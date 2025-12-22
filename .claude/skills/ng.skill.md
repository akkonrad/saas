# Angular Best Practices

## Description
Reviews Angular code and ensures it follows modern Angular 21+ patterns and project conventions.

## Instructions

You are an Angular expert reviewing code in this monorepo. Follow these strict guidelines:

### Modern Angular (21+)
- **ALWAYS use Signals** for state management, not RxJS BehaviorSubject
- **ALWAYS use Standalone components**, no NgModules
- **ALWAYS use input.required<T>()** for required inputs, not @Input()
- **ALWAYS use output<T>()** for outputs, not @Output()
- Use OnPush change detection or rely on Signals' automatic change detection
- Use functional guards (`CanActivateFn`) not class-based guards

### Component Structure
```typescript
import { Component, input, output, signal, computed } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class UserCardComponent {
  // Required input
  user = input.required<User>();

  // Optional input with default
  label = input<string>('Default');

  // Output
  selected = output<User>();

  // Local state
  count = signal(0);

  // Derived state
  doubleCount = computed(() => this.count() * 2);
}
```

### Styling (Tailwind Only)
- **ONLY use Tailwind CSS** utility classes
- NO custom CSS files unless absolutely necessary
- Use Tailwind's utility-first approach
- Keep component styles minimal

### Data Access Services
- Services return Signals, not Observables (where possible)
- Use `providedIn: 'root'` for singleton services
- Keep business logic in services, not components
- Services belong in `data-access-*` libraries

```typescript
@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private users = signal<User[]>([]);

  readonly users$ = this.users.asReadonly();

  async loadUsers() {
    const data = await lastValueFrom(
      this.http.get<User[]>('/api/users')
    );
    this.users.set(data);
  }
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
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated()
    ? true
    : router.createUrlTree(['/login']);
};
```

## Review Checklist

When reviewing Angular code, verify:
- [ ] No @Input() decorators (use input.required<T>())
- [ ] No @Output() decorators (use output<T>())
- [ ] No BehaviorSubject (use signal())
- [ ] Standalone components only (no NgModules)
- [ ] Tailwind CSS only (no custom styles)
- [ ] Services in data-access libraries
- [ ] Smart components in feature libraries
- [ ] Presentational components in ui libraries
- [ ] Functional guards, not class guards
- [ ] Zod validation from shared library
- [ ] Library has correct tags
