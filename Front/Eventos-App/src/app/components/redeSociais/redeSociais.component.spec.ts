/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RedeSociaisComponent } from './redeSociais.component';

describe('RedeSociaisComponent', () => {
  let component: RedeSociaisComponent;
  let fixture: ComponentFixture<RedeSociaisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeSociaisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeSociaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
