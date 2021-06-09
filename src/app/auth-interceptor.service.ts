import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

export class AuthInterceptorService implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //if (req.url)  that is if you don't want to send to a certain url
    console.log('Request is on its way!');
    return next.handle(req);
  }
}
