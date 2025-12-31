import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiThemeToggleComponent } from './theme-toggle.component';

describe('UiThemeToggleComponent', () => {
  let component: UiThemeToggleComponent;
  let fixture: ComponentFixture<UiThemeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiThemeToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render light and dark theme buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('should set initial theme', () => {
    fixture.componentRef.setInput('theme', 'dark');
    fixture.detectChanges();
    expect(component.currentTheme()).toBe('dark');
  });

  it('should emit theme change event when toggled', (done) => {
    const compiled = fixture.nativeElement as HTMLElement;
    const darkButton = compiled.querySelectorAll('button')[1];

    component.themeChange.subscribe((theme) => {
      expect(theme).toBe('dark');
      done();
    });

    darkButton.click();
  });

  it('should update active state when theme changes', () => {
    fixture.componentRef.setInput('theme', 'light');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const lightButton = compiled.querySelectorAll('button')[0];
    expect(lightButton.classList.contains('btn-active')).toBeTruthy();

    fixture.componentRef.setInput('theme', 'dark');
    fixture.detectChanges();
    const darkButton = compiled.querySelectorAll('button')[1];
    expect(darkButton.classList.contains('btn-active')).toBeTruthy();
  });
});
