import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable()
export class AuthService {
  constructor(private myRoute: Router) { }
  sendToken(token: any) {
    localStorage.setItem("_id", token.result._id)
    localStorage.setItem("role", token.result.userType)
    localStorage.setItem("token", token.token)

  }
  getToken() {
    return localStorage.getItem("token")
  }
  isLoggedIn() {
    return this.getToken() !== null;
  }
  logout() {
    localStorage.clear();
    this.myRoute.navigate(["/"]);
  }
}
