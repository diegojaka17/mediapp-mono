import { Router, NavigationEnd } from '@angular/router';
import { environment } from './../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {


  userName: String;
  roles: String[];
  constructor(private router: Router, private location: Location ) {
    console.log(location); 
    this.router.events.subscribe( event => {
      if(event instanceof NavigationEnd){
        console.log('Url->'+event.url);
      }
    });
  }

  ngOnInit() {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    let decodedToken = helper.decodeToken(token);
    this.roles = decodedToken.authorities;
    this.userName = decodedToken.user_name;
    
  }

  volver(){
    this.location.back();
  }

}
