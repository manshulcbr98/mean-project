import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, NgForm} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {
  private authStatusSubs : Subscription;
  isLoading = false;
  onSignup(form: NgForm)
  {
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    console.log(form.value);
    this.authService.createUser(form.value.email,form.value.password );
  }

  constructor(public authService: AuthService) { }


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
