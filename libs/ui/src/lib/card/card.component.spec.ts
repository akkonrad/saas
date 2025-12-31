import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCardComponent } from './card.component';
import { UiCardHeaderComponent } from './card-header.component';
import { UiCardContentComponent } from './card-content.component';
import { UiCardFooterComponent } from './card-footer.component';

describe('UiCardComponent', () => {
  let component: UiCardComponent;
  let fixture: ComponentFixture<UiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render card with base classes', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cardElement = compiled.querySelector('.card');
    expect(cardElement).toBeTruthy();
    expect(cardElement?.classList.contains('bg-base-100')).toBeTruthy();
    expect(cardElement?.classList.contains('shadow-xl')).toBeTruthy();
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('customClass', 'custom-test-class');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.custom-test-class')).toBeTruthy();
  });

  it('should support content projection', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cardElement = compiled.querySelector('.card');
    expect(cardElement).toBeTruthy();
  });
});

describe('UiCardHeaderComponent', () => {
  let component: UiCardHeaderComponent;
  let fixture: ComponentFixture<UiCardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCardHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply header classes', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const headerElement = compiled.querySelector('.card-header');
    expect(headerElement).toBeTruthy();
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('customClass', 'custom-header-class');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.custom-header-class')).toBeTruthy();
  });
});

describe('UiCardContentComponent', () => {
  let component: UiCardContentComponent;
  let fixture: ComponentFixture<UiCardContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCardContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCardContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply content classes', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const contentElement = compiled.querySelector('.card-body');
    expect(contentElement).toBeTruthy();
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('customClass', 'custom-content-class');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.custom-content-class')).toBeTruthy();
  });
});

describe('UiCardFooterComponent', () => {
  let component: UiCardFooterComponent;
  let fixture: ComponentFixture<UiCardFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCardFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCardFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply footer classes', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const footerElement = compiled.querySelector('.card-footer');
    expect(footerElement).toBeTruthy();
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('customClass', 'custom-footer-class');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.custom-footer-class')).toBeTruthy();
  });
});
