import { Component, Inject, OnInit } from '@angular/core';
import {OKTA_AUTH,OktaAuthStateService} from '@okta/okta-angular'
import {OktaAuth} from '@okta/okta-auth-js'

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated?: boolean = false;
  userFullName: string='';

  constructor(private oktaAuthService: OktaAuthStateService, @Inject(OKTA_AUTH) public oktaAuth: OktaAuth) {}

  ngOnInit(): void {

    // Subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) =>{
        this.isAuthenticated = result.isAuthenticated;
        this.getUserDetails();
      }
    );

    console.log("fetched login-status on init method triggered: " + this.userFullName)
  }

  getUserDetails() {
    if(this.isAuthenticated){

      // get the user info who has logged in
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;
        }
      );
    }
  }

  async login() {
    await this.oktaAuth.signInWithRedirect();
  }

  logout(){
    // stop the session with okta, and remove current tokens
    this.oktaAuth.signOut();
  }

}
