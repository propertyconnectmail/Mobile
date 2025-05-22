import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  if (user) {
    const parsed = JSON.parse(user);
    if (parsed.type) {
      router.navigate(['/professional-home']);
    } else {
      router.navigate(['/client-home']);
    }
    return false;
  }

  return true;
};
