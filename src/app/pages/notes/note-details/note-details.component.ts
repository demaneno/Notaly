/* eslint-disable no-return-assign */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-parens */
/* eslint-disable no-useless-constructor */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Note } from 'src/app/shared/note.model';
import { User } from 'src/app/shared/user.model';
import { APIService } from 'src/app/shared/api.service';
import { Category } from 'src/app/shared/category.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { cpuUsage } from 'process';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss'],
})
export class NoteDetailsComponent implements OnInit {
  note: Note;

  noteId: number;

  new: boolean;

  userId: number;

  usersList: User[] = [];

  categoriesList: Category[] = [];

  constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.apiService.GetUsers().subscribe((data: User[]) => {
      this.usersList = data;
    });
    this.apiService.GetCategories().subscribe((data: Category[]) => {
      this.categoriesList = data;
    });

    this.route.params.subscribe((params: Params) => {
      this.note = new Note();
      if (params.id) {
        this.new = false;
        this.apiService.GetNoteById(params.id).subscribe((data) => {
          this.note = data;
        });
      } else {
        this.new = true;
      }
    });
  }

  onSubmit(form: NgForm) {
    if (this.new) {
      this.note = form.value;
      this.apiService.AddNote(this.note).subscribe((data: Note) => {
        this.note = data      
      });
      this.apiService.GetNotes().subscribe(() => {});
      this.return();
    } else {
      this.noteId = this.note.id;
      this.note = form.value;
      this.note.id = this.noteId;
      this.apiService.UpdateNote(this.note).subscribe((data: Note) => {
        this.note = data
        this.apiService.GetNotes().subscribe(() => {});
      this.return();
      });
    }
  }

  cancel() {
    this.return();
  }

  return(){
    this.router.navigateByUrl('/notes');
  }
}
