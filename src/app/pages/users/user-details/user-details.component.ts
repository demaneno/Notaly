import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/shared/user.model';
import { UsersService } from 'src/app/shared/users.service';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  user: User;
  userId: number;
  new: boolean; 

  constructor(private usersService: UsersService,private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.user = new User();
      if(params.id){
        this.user = this.usersService.get(params.id);
        this.userId = params.id;
        this.new = false;
      } else {
        this.new = true;
    }
  })
  }

  onSubmit(form: NgForm) {
    if(this.new) {
      this.usersService.add(form.value);
      this.router.navigateByUrl('/users');
    } else {
      this.usersService.update(this.userId, form.value.name);
      this.router.navigateByUrl('/users');
    }
  }

  cancel() {
    this.router.navigateByUrl('/users');
  }

}
