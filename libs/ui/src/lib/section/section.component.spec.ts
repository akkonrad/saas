import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiSectionComponent } from './section.component';

describe('UiSectionComponent', () => {
  let component: UiSectionComponent;
  let fixture: ComponentFixture<UiSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default variant', () => {
    fixture.componentRef.setInput('variant', 'default');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('section');
    expect(section).toBeTruthy();
    expect(section?.classList.contains('bg-base-200')).toBeFalsy();
  });

  it('should render muted variant with background', () => {
    fixture.componentRef.setInput('variant', 'muted');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('section');
    expect(section?.classList.contains('bg-base-200')).toBeTruthy();
  });

  it('should apply id attribute', () => {
    fixture.componentRef.setInput('id', 'test-section');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('section');
    expect(section?.id).toBe('test-section');
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('customClass', 'custom-test-class');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('section');
    expect(section?.classList.contains('custom-test-class')).toBeTruthy();
  });
});
