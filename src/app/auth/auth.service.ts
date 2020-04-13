import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AuthData } from './auth-data.model'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment} from '../../environments/environment'

const BACKEND_URL = environment.apiUrl + "/user";
@Injectable({providedIn:"root"})
export class AuthService {
  private tokenTimer: NodeJS.Timer;
  private userId:string;
  private token:string;
  private isAuthenticated=false;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient,private router: Router){
  }
  createUser(email: string, password: string){
    const authData: AuthData={
      email:email,
      password:password
    };
    this.http.post<{message:string}>( BACKEND_URL+'/signup',authData)
    .subscribe(()=>{
      this.router.navigate(["/"]);
    }, error =>{
      this.authStatusListener.next(false);
    })

  }
  login(email: string, password: string){
    const authData: AuthData={
      email:email,
      password:password
    };
    this.http.post<{token: string, expiresIn: number,userId: string}>( BACKEND_URL +'/login',authData)
    .subscribe((responseData)=>{
      this.token = responseData.token;
      if(responseData.token)
      {
        const expiresInDuration = responseData.expiresIn;
        this.setauthTimer(expiresInDuration);
        this.isAuthenticated=true;
        this.userId = responseData.userId;
        this.authStatusListener.next(true);
        const now  = new Date();
        const expirationDate = new Date(now.getTime()+expiresInDuration*1000);
        this.saveAuthData(this.token,expirationDate,responseData.userId);
        this.router.navigate(["/"]);
      }
    },error =>{
      this.authStatusListener.next(false);
    });
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }
  getToken(){
    return this.token;
  }
  getIsAuth(){
    return this.isAuthenticated;
  }
  getUserId(){
    return this.userId;
  }
  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
     this.router.navigate(["/"]);
  }
  private saveAuthData(token: string, expirationDate: Date,userId: string){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem( 'userId', userId);
  }
  private setauthTimer(duration: number)
  {
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    }, duration*1000)
  }
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }
  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
  //  console.log(authInformation);
    const now = new Date();
    const isInFuture = (authInformation.expirationDate).getTime() - now.getTime();
    if(isInFuture > 0){
      this.token = authInformation.token;
      this.setauthTimer(isInFuture/1000);
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.authStatusListener.next(true);
    }
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!token || !expirationDate){
      return ;
    }
    return {
      token:token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
