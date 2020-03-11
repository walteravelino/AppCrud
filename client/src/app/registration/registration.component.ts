import { Component, OnInit } from '@angular/core';
import { FormGroup , FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiService } from '../_services';
import { first } from 'rxjs/operators';
import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  successMsg = false
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
};
  constructor(private fb: FormBuilder,
    private myRoute: Router,
    private auth: AuthService, private apiService: ApiService) {

  }

  phoneNumber = '[0-9]{0-10}';


  regForm = new FormGroup({
    name: new FormControl('', Validators.required),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10),
      Validators.minLength(10)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    desc: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    dob: new FormControl('', Validators.required),
    url: new FormControl('', [Validators.required, Validators.pattern(this.urlRegex)])

   });

  ngOnInit() {
  }



  onSubmit() {
    if (this.regForm.valid) {
      console.log(this.regForm.value.dob)
      let userdata = {
        "name": this.regForm.value.name,
        "auth":{
        "email":this.regForm.value.email,
        "password":this.regForm.value.password
        },
        "mobile":this.regForm.value.mobile,
        "url":this.regForm.value.url,
        "gender":this.regForm.value.gender,
        "dob":this.regForm.value.dob.formatted,
        "desc":this.regForm.value.desc
      }
      this.apiService.register(userdata)
        .pipe(first()).subscribe((res: any) => {
          console.log("------------------------------")
          if (res.status) {
            this.successMsg = true;
            setTimeout (() => {
              this.myRoute.navigate(["/"]);
              console.log(res)
            }, 1000)
          } else {
            alert(res.result)
          }
        },error => { localStorage.clear(); location.reload(); });

    }
  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();

    }
}

}
