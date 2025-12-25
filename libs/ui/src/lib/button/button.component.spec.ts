import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiButtonComponent } from './button.component';

describe('UiButtonComponent', () => {
  let component: UiButtonComponent;
  let fixture: ComponentFixture<UiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default classes', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('btn');
    expect(button.className).toContain('btn-primary');
  });

  it('should apply variant class', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('btn-secondary');
  });

  it('should apply size class', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('btn-lg');
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('should emit clicked event on click', () => {
    let clickEvent: MouseEvent | undefined;
    component.clicked.subscribe((event) => (clickEvent = event));

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(clickEvent).toBeDefined();
  });

  it('should not emit clicked event when disabled', () => {
    let clickEmitted = false;
    component.clicked.subscribe(() => (clickEmitted = true));

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(clickEmitted).toBe(false);
  });
});
