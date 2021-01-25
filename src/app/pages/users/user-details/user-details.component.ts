/* eslint-disable no-return-assign */
/* eslint-disable semi */
/* eslint-disable eqeqeq */
/* eslint-disable indent */
/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/shared/user.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { APIService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})

export class UserDetailsComponent implements OnInit {
  user: User

  userId: number;

  new: boolean;

  validUserObject;

  responseUserAdd: string;

  constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.user = new User();
      if (params.id) {
        this.new = false;
        this.apiService.GetUserById(params.id).subscribe((data: User) => {
          this.user = data;
        });
      } else {
        this.new = true;
      }
    });
  }

  onSubmit(form: NgForm) {
    if (this.new) {
      this.apiService.AddUser(this.user.name).subscribe(() => {});
    this.apiService.GetUsers().subscribe(() => {});
     } else {    
      this.apiService.UpdateUser(this.user).subscribe((result) => {});
    }
    
    this.return();
  }

  cancel() {
    this.return();
  }

  return(){
    this.router.navigateByUrl('/users');
  }
}
