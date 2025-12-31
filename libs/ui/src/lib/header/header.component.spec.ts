import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiHeaderComponent } from './header.component';

describe('UiHeaderComponent', () => {
  let component: UiHeaderComponent;
  let fixture: ComponentFixture<UiHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be fixed by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    expect(header?.classList.contains('fixed')).toBeTruthy();
  });

  it('should not be fixed when fixed input is false', () => {
    fixture.componentRef.setInput('fixed', false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    expect(header?.classList.contains('fixed')).toBeFalsy();
  });

  it('should toggle mobile menu', () => {
    expect(component.mobileMenuOpen()).toBeFalsy();
    component['toggleMobileMenu']();
    expect(component.mobileMenuOpen()).toBeTruthy();
    component['toggleMobileMenu']();
    expect(component.mobileMenuOpen()).toBeFalsy();
  });

  it('should close mobile menu', () => {
    component['mobileMenuOpen'].set(true);
    expect(component.mobileMenuOpen()).toBeTruthy();
    component['closeMobileMenu']();
    expect(component.mobileMenuOpen()).toBeFalsy();
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('customClass', 'custom-test-class');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    expect(header?.classList.contains('custom-test-class')).toBeTruthy();
  });

  it('should render mobile menu when open', () => {
    component['mobileMenuOpen'].set(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const mobileNav = compiled.querySelector('nav.flex-col');
    expect(mobileNav).toBeTruthy();
  });
});
