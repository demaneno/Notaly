/* eslint-disable linebreak-style */
/* eslint-disable no-empty-function */
/* eslint-disable no-return-assign */
/* eslint-disable lines-between-class-members */
/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable space-in-parens */
/* eslint-disable arrow-body-style */
/* eslint-disable arrow-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable import/no-unresolved */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from './user.model';
import { Note } from '../../app/shared/note.model';
import { Category } from '../../app/shared/category.model';

@Injectable({ providedIn: 'root' })

// eslint-disable-next-line import/prefer-default-export
export class APIService {
  counter: number = 60;

  secondsSubject: Subject<number> = new Subject<number>();

  seconds = this.secondsSubject.asObservable();
  listUser: User[];

  constructor(private http: HttpClient) {
    this.decreaseCounter();
  }

  decreaseCounter = () => {
    // eslint-disable-next-line no-plusplus
    this.counter--;
    if (this.counter > 0) {
      setTimeout(this.decreaseCounter, 1000);
    }
  };

  // ADD
  AddUser = (name: string) => {
  const data = { 'name': name };
    return this.http.post('https://fortunate-aged-moth.glitch.me/user?name=', data);
  }

  AddCategory = (name: string) => {
 const data = { 'name': name };
    return this.http.post('https://fortunate-aged-moth.glitch.me/category?name=', data);
  }

  AddNote = (name: string, note: string, category: string, userId: number) => {
 const data = {
 'name': name, 'content': note, 'category': category, 'userId': userId 
};
      return this.http.post('https://fortunate-aged-moth.glitch.me/note', data); 
    }

  // GETALL
  GetUsers = () => this.http.get('https://fortunate-aged-moth.glitch.me/users');

  GetCategories = () => this.http.get('https://fortunate-aged-moth.glitch.me/categories');

  GetNotes = () => this.http.get('https://fortunate-aged-moth.glitch.me/notes');

  // GET by ID
  GetUserById = (id: number): Observable<User> => {
    const encodedUri = encodeURI(`https://fortunate-aged-moth.glitch.me/getUserById?id=${id}`);
    return this.http.get<User>(encodedUri);
  }

  GetCategoryById = (id: number): Observable<Category> => {
    const encodedUri = encodeURI(`https://fortunate-aged-moth.glitch.me/getCategoryById?id=${id}`);
    return this.http.get<Category>(encodedUri);
  }
 
  GetNoteById = (id: number): Observable<Note> => {
    const encodedUri = encodeURI(`https://fortunate-aged-moth.glitch.me/getNoteById?id=${id}`);
    return this.http.get<Note>(encodedUri);
  }

  // DELETE
  // DelUser = (name: string) : Observable<User> => {
  // const encodedUri = encodeURI(`https://fortunate-aged-moth.glitch.me/deleteUser?name=${name}`);
  // return this.http.delete<User>(encodedUri);
  // }

  DelUser = (name: string) => {
    const encodedUri = encodeURI(`https://fortunate-aged-moth.glitch.me/deleteUser?name=${name}`);
    return this.http.delete<User>(encodedUri.toString()); 
    }

  DelCategory = (name: string) => {
    const encodedUri = encodeURI(`https://fortunate-aged-moth.glitch.me/deleteCategory?name=${name}`);
    return this.http.delete<Category>(encodedUri.toString());
    }

  DelNote = (id: number) => {
    const encodedUri = encodeURI(`https://fortunate-aged-moth.glitch.me/deleteNote?id=${id}`);
    return this.http.delete<Note>(encodedUri.toString());
  }

  // UPDATE
  UpdateUser = (id: number, name: string) => {
 const data = { 'id': id, 'name': name };
    return this.http.patch<any>('https://fortunate-aged-moth.glitch.me/updateUser}', data);
  }

  UpdateCategories = (category: Category): Observable<Category> => {
    const http = 'https://fortunate-aged-moth.glitch.me/updateCote';
    return this.http.patch<Category>(http, { category });
  }

  UpdateNote = (note: Note): Observable<Note> => {
    const http = 'https://fortunate-aged-moth.glitch.me/updateNote';
    return this.http.patch<Note>(http, { note });
  }
}
