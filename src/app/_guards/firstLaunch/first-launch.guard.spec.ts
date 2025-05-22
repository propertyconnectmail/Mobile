import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { firstLaunchGuard } from './first-launch.guard';

describe('firstLaunchGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => firstLaunchGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
