import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../pages/authentication/services/auth-service.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthServiceService);
    const router = inject(Router);

    if (authService.isAuth.value == false) {
        router.navigate(['/authentication/login']);
        return false;
    }

    return authService.isAuth.value;
};