import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from 'src/app/shared/user.model';
import { UsersService } from 'src/app/shared/users.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  animations:[
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
          paddingLeft: 0,
        }),
        //spacing animation 
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingRight: '*', 
          paddingLeft: '*',
        })),
        animate(68)
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
          height:0,
          'margin-bottom': 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0, 
          paddingLeft: 0,
        }))
      ])
    ]),

    trigger('listAnim',[
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional: true
        })
      ])
    ])
  ]
})
export class UsersListComponent implements OnInit {

  users: User[] = new Array<User>();
  filteredUsers :  User[] = new Array<User>();

  @ViewChild('filterInput') filterInputElRef: ElementRef <HTMLInputElement>;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.users = this.usersService.getAll();
      this.filter('');
  }

  deleteUser(user: User) {
    let userId = this.usersService.getId(user);
    this.usersService.delete(userId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }

  generateUserURL(user: User) {
    let noteId = this.usersService.getId(user);
    return noteId;
  }

  filter(query: string) {
    query = query.toLowerCase().trim();

    let allResults: User[] = new Array<User>();
    //split search (spaces)
    let terms: string[] = query.split(' '); 
    terms = this.removeDuplicates(terms);

    terms.forEach(term => {
      let results: User[] = this.relevantUsers(term);
      //Array destruction -> 
      allResults = [...allResults, ...results]
    });

    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredUsers = uniqueResults;
    this.sortByRelevancy(allResults);
  }

  removeDuplicates(arr: Array<any>) : Array<any> {
    let uniqueResults: Set<any> = new Set<any>();

    arr.forEach(e => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }

  relevantUsers(query: any) : Array<User>  {
    query = query.toLowerCase().trim();
    let relevantNotes = this.users.filter(user => {
      
      if( user.name && user.name.toLowerCase().includes(query)){
        return true;
      }

      return false;
    })
    
    return relevantNotes;
  }

  sortByRelevancy(searchResults: User[]) {
    let userCountObj: Object = {};

    searchResults.forEach(user => {
      let userId = this.usersService.getId(user);

      if(userCountObj[userId]) {
        userCountObj[userId] += 1;
      } else {
        userCountObj[userId] = 1;
      }
    })

    this.filteredUsers = this.filteredUsers.sort((a:User, b:User) => {
      let aId = this.usersService.getId(a);
      let bId = this.usersService.getId(b);

      let aCount = userCountObj[aId];
      let bCount = userCountObj[bId];

      return bCount - aCount;
    })
  }
}
