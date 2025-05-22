import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const firstLaunchGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const firstLaunch = localStorage.getItem('firstLaunchDone');

  if (!firstLaunch) {
    return true; // First time, allow access to selection/onboarding
  }

  router.navigate(['/login']);
  return false;
};
