import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  cacheMap = new Map<string, HttpResponse<any>>();
  constructor() { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (!this.isRequestCachable(req)) {
      return next.handle(req);
    } else {
      const url = req.url.toLowerCase();
      if (this.cacheMap.has(url)) {
        return of(this.cacheMap.get(url) as HttpResponse<any>);
      }
      else {
        return next.handle(req).pipe(tap(event => {
          if (event instanceof HttpResponse) {
            this.cacheMap.set(url, event);
          }
        }))
      }
    }
  }

  isRequestCachable(req: HttpRequest<any>): boolean {
    if (req.method === 'GET') {
      const urls = ['https://faeus2devbeach.azurewebsites.net/api/LeftPanel?code=62Rb1K6inzsfE7Z4t3KtfRjKgMylylJkUtuVQa53hWI4x8NSEWTUQQ==&clientId=apim-apimeus2devbeach'];
      for (let i = 0; i < urls.length; i++) {
        if (req.url.toLowerCase().includes(urls[i].toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  }
}
