import { Injectable } from '@angular/core';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: User[] = new Array<User>();
  constructor() { }

  getAll(){
    return this.users;
  }

  get(id: number) {
    return this.users[id];
  }

  getId(user: User) {
    return this.users.indexOf(user);
  }

  add(user: User) {
    let newLength = this.users.push(user);
    let index = newLength - 1;
    return index;
  }

  update(id: number, name: string ){
    let user = this.users[id];
    user.name = name;
  }

  delete(id: number) {
    this.users.splice(id, 1);
  }
}
