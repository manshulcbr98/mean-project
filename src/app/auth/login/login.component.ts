import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

  private authStatusSubs : Subscription;
  isLoading = false;

  constructor(public authService: AuthService) { }

  onLogin(form: NgForm)
  {
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    console.log(form.value);
    this.authService.login(form.value.email,form.value.password);
  }

  ngOnInit(): void {
    this.authStatusSubs = this.authService.getAuthStatusListener()
    .subscribe(authStatus =>{
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe();
  }

}
