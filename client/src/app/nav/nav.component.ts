import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  role = localStorage.getItem('role');
  constructor(public auth: AuthService) { }
  ngOnInit() {

  }
}