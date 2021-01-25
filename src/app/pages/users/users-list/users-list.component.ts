/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable semi */
/* eslint-disable no-array-constructor */
/* eslint-disable comma-dangle */
/* eslint-disable space-before-blocks */
/* eslint-disable space-infix-ops */
/* eslint-disable prefer-const */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-return-assign */
/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unresolved */
import {
  Component, OnInit, ViewChild, ElementRef,
} from '@angular/core';
import { User } from 'src/app/shared/user.model';
import {
  trigger, transition, style, animate, query, stagger,
} from '@angular/animations';
import { APIService } from 'src/app/shared/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      transition('void => *', [
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,

          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0
        }),
        // spacing animation
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingRight: '*',
          paddingLeft: '*'
        })),
        animate(68),
      ]),

      transition('* => void', [
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75
        })),
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0
        })),
        animate('150ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0,
          height: 0,
          'margin-bottom': 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0
        })),
      ])
    ]),

    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0
          }),
          stagger(100, [
            animate('0.2s ease')
          ]),
        ], {
          optional: true
        }),
      ]),
    ])
  ]
})

export class UsersListComponent implements OnInit {
  users: User[] = [];

  public users$: Observable<User[]>;

  user: User;

  userId: number;

  aId: number;

  bId: number;

  noteId: number;

  count : number = 0;

  filteredUsers: User[] = [];

  @ViewChild('filterInput', { static: true }) filterInputElRef: ElementRef<HTMLInputElement>;

  // eslint-disable-next-line no-unused-vars
  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.filter(' ');
    this.apiService.GetUsers().subscribe((data:User[]) => { this.filteredUsers = data; });
    this.filter('');
  }

  deleteUser(user: User) {
    // let userId = this.usersService.getId(user);
    this.apiService.DelUser(user.name).subscribe();
    this.filter(this.filterInputElRef.nativeElement.value);
    this.filteredUsers.splice(user.id);
    this.ngOnInit();
  }

  generateUserURL(user: User) {
    // if (this.count <= this.users.length) {
    //   this.apiService.GetUserById(user.id).subscribe((data: User) => {
    //     this.user = data;
    //   });
    //   this.count+=1;
    //   if (this.user !== undefined && this.user.id !== undefined) { 
    //     return this.user.id;
    //   }
    // } 
  }

  // eslint-disable-next-line no-shadow
  filter(query: string) {
    // eslint-disable-next-line no-param-reassign
    query = query.toLowerCase().trim();

    let allResults: User[] = new Array<User>();
    // split search (spaces)
    let terms: string[] = query.split(' ');
    terms = this.removeDuplicates(terms);

    terms.forEach((term) => {
      const results: User[] = this.relevantUsers(term);
      // Array destruction ->
      allResults = [...allResults, ...results];
    });

    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredUsers = uniqueResults;
    this.sortByRelevancy(allResults);
  }

  // eslint-disable-next-line class-methods-use-this
  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();

    arr.forEach((e) => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }

  // eslint-disable-next-line no-shadow
  relevantUsers(query: any): Array<User> {
    // eslint-disable-next-line no-param-reassign
    query = query.toLowerCase().trim();

    let relevantUsers = this.users.filter((data: User) => {
      if (data.name && data.name.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });

    return relevantUsers;
  }

  sortByRelevancy(searchResults: User[]) {
    let userCountObj: Object = {};

    searchResults.forEach((user) => {
      this.apiService.GetUserById(user.id).subscribe((data: User) => { 
        this.user = data;
      });
      // let userId = this.usersService.getId(user);
 
      // eslint-disable-next-line max-len
      if (this.user !== undefined && userCountObj[this.user.id] !== undefined && userCountObj[this.user.id]) {
        userCountObj[this.user.id]+=1;
      } else {
        userCountObj[this.user.id] =1;
      }
    });

    this.filteredUsers = this.filteredUsers.sort((a: User, b: User) => {
      this.apiService.GetUserById(a.id).subscribe((data: User) => {
        this.aId = data.id;
      });

      this.apiService.GetUserById(b.id).subscribe((data: User) => {
        this.bId = data.id;
      });

      let aCount = userCountObj[this.aId];
      let bCount = userCountObj[this.bId];

      return bCount - aCount;
    });
  }

  Refresh = () => this.apiService.GetUsers().subscribe((data: User[]) => this.users = data);
}
