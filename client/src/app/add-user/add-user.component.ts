import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from '../_services';
import { first } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {IMyDpOptions} from 'mydatepicker';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  errormsg=false
  successMsgupdate = false
  successMsAdd = false
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
};
  public users = {
    id: ""
   };

  empformlabel: string = 'Add User';
  empformbtn: string = 'Save';
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService,private route: ActivatedRoute) {
  }

  addForm: FormGroup;
  btnvisibility: boolean = true;
  userData :any;
  ngOnInit() {
       this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: [''],

      email: ['', [
        Validators.required,
        Validators.email
      ]],
      mobile: ['', [Validators.required, Validators.minLength(10),
        Validators.minLength(10)
      ]],
      desc: ['', Validators.required],
      gender: ['', Validators.required  ],
      dob: ['', Validators.required],
      url: ['', [Validators.required,Validators.pattern(this.urlRegex)]]
    });
    this.users.id = this.route.snapshot.paramMap.get('id');


    if (this.users.id) {

      this.apiService.getEmployeeById(this.users.id)
      .pipe(first()).subscribe((res: any) => {
        if (res.status) {
          this.userData = res.result
          // this.user = res.result
          console.log(res.result.auth.email)
          let user = {
            _id : this.userData._id,
            name : this.userData.name,
            email : this.userData.auth.email,
            mobile: this.userData.mobile,
            desc: this.userData.desc,
            gender: this.userData.gender,
            url: this.userData.url
          }
          this.addForm.patchValue(user);
            // Set today date using the patchValue function
            let date = this.userData.dob.split('-');
            var str = "07";
            let mon =  Number(date[1]);
            console.log(date,mon)
            this.addForm.patchValue({dob: {
            date: {
                year: date[2],
                month: mon,
                day: date[0]}
            }});

          console.log(res)
        } else {
          this.errormsg = true
          //alert(res.result)
        }
      },error => { console.log(error) });

      this.btnvisibility = false;
      this.empformlabel = 'Update User';
      this.empformbtn = 'Update';
    }
  }


  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();

    }
}
  onSubmit() {
    console.log('Create fire');
    let userdata = {
      "name": this.addForm.value.name,
      "auth":{
      "email":this.addForm.value.email,
      },
      "mobile":this.addForm.value.mobile,
      "url":this.addForm.value.url,
      "gender":this.addForm.value.gender,
      "dob":this.addForm.value.dob.formatted,
      "desc":this.addForm.value.desc
    }
    this.apiService.register(userdata)
        .pipe(first()).subscribe((res: any) => {
          if (res.status) {
            // this.user = res.result
            this.successMsAdd = true
            setTimeout (() => {
              this.router.navigate(['dashboard']);
            }, 2000)
          } else {
            this.errormsg = true
            //alert(res.result)
          }
        },error => { console.log(error) });
  }
  onUpdate() {
    console.log('Update fire');
    let userdata = {
      "_id": this.userData._id,
      "name": this.addForm.value.name,
      "email":this.addForm.value.email,
      "mobile":this.addForm.value.mobile,
      "url":this.addForm.value.url,
      "gender":this.addForm.value.gender,
      "dob":this.addForm.value.dob.formatted,
      "desc":this.addForm.value.desc
    }
    this.apiService.updateUser(userdata).pipe(first()).subscribe((data :any)=> {
      console.log("update calling",data.status)
        this.successMsgupdate = true
        setTimeout (() => {
          this.router.navigate(['dashboard']);
        }, 2000)
      },
      error => {
        alert(error);
      });
  }

}
