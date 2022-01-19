import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

export class ApiInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const apiEndpoint = environment.apiEndpoint;
    const url = req.url;

    if (apiEndpoint && url.includes('api')) {
      const resultUrl = `${apiEndpoint}/${url}`;
      req = req.clone({
        url: resultUrl
      });
    }

    return next.handle(req);
  }

}
