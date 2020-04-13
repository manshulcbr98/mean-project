import {
  HttpRequest,
  HttpInterceptor,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error-page/error.component';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

  constructor( private dialog: MatDialog){}
  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>{
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse)=>{
        let errorMessage = "An unknown error occured";
        if(error.error.message){
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, {
          data: { message: errorMessage },
        });
        console.log(error);

        return throwError(error);
      })
    )
  }
}
