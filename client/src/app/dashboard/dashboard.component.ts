import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ApiService } from '../_services';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  successondelete=false
  user : any;
  public users = {
    _id: ""
   };
   role = localStorage.getItem('role');

  constructor(private apiService: ApiService, private myRoute: Router,private router: Router,
    private auth: AuthService,private route: ActivatedRoute) { }

  ngOnInit() {
   this.apiService.getUser()
        .pipe(first()).subscribe((res: any) => {
          if (res.status) {
            this.user = res.result
            console.log(res)
          } else {
            alert(res.result)
          }
        },error => { console.log(error) });

  }

  deleteuser(userId): void {
    this.apiService.deleteUser(userId)
    .pipe(first()).subscribe((res: any) => {
      if (res.status) {
        this.user = res.result
        console.log(res)
        this.successondelete=true
        setTimeout (() => {
          this.successondelete=false
        }, 2000)
        this.ngOnInit()
      } else {
        alert(res.result)
      }
    },error => { console.log(error) });
  }
  edituser(userId) {
    localStorage.removeItem('userId');
    localStorage.setItem('userId',userId);
    this.router.navigate(['user']);
  }

}
