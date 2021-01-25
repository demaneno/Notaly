/* eslint-disable class-methods-use-this */
/* eslint-disable space-infix-ops */
/* eslint-disable prefer-const */
/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-return-assign */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-array-constructor */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unresolved */
import {
  Component, OnInit, ViewChild, ElementRef,
} from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import {
  trigger, transition, style, animate, query, stagger,
} from '@angular/animations';
import { Router } from '@angular/router';
import { APIService } from 'src/app/shared/api.service';
import { User } from 'src/app/shared/user.model';
import { Category } from 'src/app/shared/category.model';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
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
          paddingLeft: 0,
        }),
        // spacing animation
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingRight: '*',
          paddingLeft: '*',
        })),
        animate(68),
      ]),
      transition('* => void', [
        animate(50, style({
          transform: 'scale(1.05)',
        })),
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75,
        })),
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0,
        })),
        animate('150ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0,
          height: 0,
          'margin-bottom': 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
        })),
      ]),
    ]),

    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0,
          }),
          stagger(100, [
            animate('0.2s ease'),
          ]),
        ], {
          optional: true,
        }),
      ]),
    ]),
  ],
})

export class NotesListComponent implements OnInit {
  notes: Note[] = [];

  note: Note;

  noteId: number;

  user: User;

  category: Category;

  usersList: User[] = [];

  categoriesList: Category[] = [];

  aId: number;

  bId: number;

  count: number = 0;

  filteredNotes: Note[] = [];

  @ViewChild('filterInput', { static: true }) filterInputElRef: ElementRef<HTMLInputElement>;

  constructor(private apiService: APIService, private router: Router) { }

  ngOnInit() {
    this.Refresh();
    this.filter('');
  }

  deleteNote(note: Note) {
    this.apiService.DelNote(note.id).subscribe(() => {});
    this.filter(this.filterInputElRef.nativeElement.value);
    this.filteredNotes.splice(note.id,1);
    this.ngOnInit();
  }

  generateNoteURL(note: Note) {
    if (this.count <= this.notes.length) {
      this.apiService.GetNoteById(note.id).subscribe((data: Note) => {
        this.note = data;
      });
      this.count+=1;
      if (this.note !== undefined && this.note.id !== undefined) {
        return this.note.id;
      }
    }
    return 0;
  }

  // eslint-disable-next-line no-shadow
  filter(query: string) {
    query = query.toLowerCase().trim();

    let allResults: Note[] = new Array<Note>();
    // split search (spaces)
    let terms: string[] = query.split(' ');
    terms = this.removeDuplicates(terms);

    terms.forEach((term) => {
      const results: Note[] = this.relevantNotes(term);
      // Array destruction ->
      allResults = [...allResults, ...results];
    });

    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;
    this.sortByRelevancy(allResults);
  }

  // eslint-disable-next-line class-methods-use-this
  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();

    arr.forEach((e) => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }

  // eslint-disable-next-line no-shadow
  relevantNotes(query: any): Array<Note> {
    // eslint-disable-next-line no-param-reassign
    query = query.toLowerCase().trim();

    let relevantNotes = this.notes.filter((note) => {
      // eslint-disable-next-line no-shadow
      this.apiService.GetUserById(note.id).subscribe((data: User) => {
        this.user = data;
      });
      // this.apiService.GetCategoryById(note.noteId).subscribe( note => {
      //   this.user = note;
      //  });
      this.apiService.GetCategoryById(note.categoryId).subscribe((data: Category) => this.category = data);
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }

      if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }

      if (this.user.name && this.user.name.toLowerCase().includes(query)) {
        return true;
      }

      if (this.category.name && this.category.name.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });

    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]) {
    let noteCountObj: Object = {};

    searchResults.forEach((note) => {
      this.apiService.GetNoteById(note.id).subscribe((data: Note) => {
        this.note = data;
        console.log(data);
      });


      if (this.note !== undefined) {
        if (this.note.id !== undefined && noteCountObj[this.note.id]) {
          noteCountObj[this.note.id] += 1;
        } else {
          noteCountObj[this.note.id] = 1;
        }
      }
    });

    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      this.apiService.GetNoteById(a.id).subscribe((data: Note) => {
        this.aId = data.id;
      });
      this.apiService.GetNoteById(b.id).subscribe((data: Note) => {
        this.bId = data.id;
      });

      let aCount = noteCountObj[this.aId];
      let bCount = noteCountObj[this.bId];

      return bCount - aCount;
    });
  }

  Refresh() {   

    this.apiService.GetNotes().subscribe((data: Note[]) => {
      this.notes = data;
      this.filteredNotes = this.notes;
    });

    this.apiService.GetUsers().subscribe((data: User[]) => {
      this.usersList = data;
    });
    this.apiService.GetCategories().subscribe((data: Category[]) => {
      this.categoriesList = data;
    });

  }
}
