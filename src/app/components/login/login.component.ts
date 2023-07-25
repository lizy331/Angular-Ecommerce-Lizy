import { Component, Inject, OnInit } from '@angular/core';
import {OKTA_AUTH} from '@okta/okta-angular'
import {OktaAuth} from '@okta/okta-auth-js'
import myAppConfig from 'src/app/config/my-app-config';
import * as OktaSignIn from '@okta/okta-signin-widget'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth:OktaAuth) { 

    //  
    console.log("login component contructor method started ")

    this.oktaSignin = new OktaSignIn({

      logo: 'assets/images/logo.png',
      // features:{
      //   registration: true
      // },
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {

        // use dynamic secrets, between our app and authorization server (which is okta) 
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      },
      // authClient: oktaAuth,

    });

    console.log("login component contructor oktaSingin:" + this.oktaSignin);
  }

  ngOnInit(): void {
    

    console.log("login component ngOnInit method triggered, try to remove the oktaSin");
    this.oktaSignin.remove();

    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'}, // this name should be same as the html file
      (response: any) => {
        if(response.status === 'SUCCESS'){
          console.log("login component response is success");
          this.oktaAuth.signInWithRedirect();
        }else{
          console.log("login component response is not success");
        }
      },
      (error: any) => {
        console.log("login status component ngoninit throw error");
        throw error;
      });
  }

}
