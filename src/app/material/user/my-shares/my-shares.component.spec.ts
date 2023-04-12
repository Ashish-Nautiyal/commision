import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySharesComponent } from './my-shares.component';

describe('MySharesComponent', () => {
  let component: MySharesComponent;
  let fixture: ComponentFixture<MySharesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySharesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySharesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
