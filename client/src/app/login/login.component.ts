import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiService } from '../_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMsg = false
  message
  form;
  constructor(private fb: FormBuilder,
    private myRoute: Router,
    private auth: AuthService,private apiService: ApiService) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }
  login() {
    if (this.form.valid) {
      this.apiService.login(this.form.value)
        .pipe(first()).subscribe((res: any) => {
          if (res.status) {
            this.auth.sendToken(res)
            this.myRoute.navigate(["dashboard"]);
          } else {
            this.errorMsg = true
            this.message =res.result
            //alert(res.result)
          }
        },error => { localStorage.clear(); location.reload(); });

    }
  }
}
