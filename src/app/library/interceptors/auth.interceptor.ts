import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthorizationService} from '../../global/services/authorization.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authorizationService = inject(AuthorizationService);

  const token = authorizationService.getTokenStorage;

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedRequest);
  }

  console.log('Interceptor: No token found');

  return next(req);
};
