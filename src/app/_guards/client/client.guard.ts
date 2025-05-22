import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const clientGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  if (user) {
    const parsed = JSON.parse(user);
    if (!parsed.type) {
      return true;
    }
  }

  router.navigate(['/login']);
  return false;
};
