import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private http: HttpClient, private router: Router,private auth: AuthService) { }


  private getToken(): string {
    return localStorage.getItem('access_token');
  }

  register(arrayObj: any) {
    return this.http.post<any[]>('http://localhost:5000/api/registerUser',arrayObj)
        .pipe(map(response => {
            return response;
        }));
}

login(arrayObj: any) {
    console.log(arrayObj)
    return this.http.post<any[]>('http://localhost:5000/api/login',arrayObj)
        .pipe(map(response => {
            return response;
        }));
}


getUser() {
    const token =  this.auth.getToken();

    const headers = new HttpHeaders({ 'Authorization': token });
    console.log("headers", headers)
    return this.http.get<any[]>('http://localhost:5000/api/list/users', { headers: headers });
}

getEmployeeById(userId: any){
    localStorage.removeItem('editEmpId');
    localStorage.setItem('editEmpId', userId._id);
    const token =  this.auth.getToken();

    const headers = new HttpHeaders({ 'Authorization': token });
    console.log("headers", headers)
    return this.http.get<any[]>('http://localhost:5000/api/list/user/'+userId, { headers: headers });

}
createUser(userData : any){
    const token =  this.auth.getToken();

    const headers = new HttpHeaders({ 'Authorization': token });
    console.log("headers", headers)
    return this.http.put<any[]>('http://localhost:5000/api/updateUser/', {updateQuery : userData}, { headers: headers });

}

updateUser(userData : any){
    const token =  this.auth.getToken();

    const headers = new HttpHeaders({ 'Authorization': token });
    console.log("headers", headers)
    return this.http.put<any[]>('http://localhost:5000/api/updateUser/', {updateQuery : userData}, { headers: headers });

}


deleteUser(userId : any){
    const token =  this.auth.getToken();

    const headers = new HttpHeaders({ 'Authorization': token });
    console.log("headers", headers)
    return this.http.delete<any[]>('http://localhost:5000/api/delete/'+userId, { headers: headers });

}

}
