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
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from './user.model';
import { Note } from './note.model';
import { Category } from './category.model';

@Injectable({ providedIn: 'root' })

// eslint-disable-next-line import/prefer-default-export
export class APIService {
  counter: number = 60;

  secondsSubject: Subject<number> = new Subject<number>();

  seconds = this.secondsSubject.asObservable();
  listUser: User[];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


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
    return this.http.post('https://grove-ribbon-gray.glitch.me/user?name=', data);
  }

  AddCategory = (name: string) => {
    const data = { 'name': name };
    return this.http.post('https://grove-ribbon-gray.glitch.me/category?name=', data);
  }

  AddNote = (note: Note) => {
    const temp = encodeURI(`https://grove-ribbon-gray.glitch.me/note?title=${note.title}&body=${note.body}&categoryId=${note.categoryId}&userId=${note.userId}`);
   return this.http.post(temp.replace('%20','+'),note);
  }

  // GETALL
  GetUsers = () => this.http.get('https://grove-ribbon-gray.glitch.me/users');

  GetCategories = () => this.http.get('https://grove-ribbon-gray.glitch.me/categories');

  GetNotes = () => this.http.get('https://grove-ribbon-gray.glitch.me/notes');

  // GET by ID
  GetUserById = (id: number): Observable<User> => {
    const encodedUri = encodeURI(`https://grove-ribbon-gray.glitch.me/getUserById?id=${id}`);
    return this.http.get<User>(encodedUri);
  }

  GetCategoryById = (id: number): Observable<Category> => {
    const encodedUri = encodeURI(`https://grove-ribbon-gray.glitch.me/getCategoryById?id=${id}`);
    return this.http.get<Category>(encodedUri);
  }

  GetNoteById = (id: number): Observable<Note> => {
    const encodedUri = encodeURI(`https://grove-ribbon-gray.glitch.me/getNoteById?id=${id}`);
    return this.http.get<Note>(encodedUri);
  }

  // DELETE
  // DelUser = (name: string) : Observable<User> => {
  // const encodedUri = encodeURI(`https://grove-ribbon-gray.glitch.me/deleteUser?name=${name}`);
  // return this.http.delete<User>(encodedUri);
  // }

  DelUser = (name: string) => {
    const encodedUri = encodeURI(`https://grove-ribbon-gray.glitch.me/deleteUser?name=${name}`);
    return this.http.delete<User>(encodedUri.toString());
  }

  DelCategory = (name: string) => {
    const encodedUri = encodeURI(`https://grove-ribbon-gray.glitch.me/deleteCategory?name=${name}`);
    return this.http.delete<Category>(encodedUri.toString());
  }

  DelNote = (id: number) => {
    const encodedUri = encodeURI(`https://grove-ribbon-gray.glitch.me/deleteNote?id=${id}`);
    return this.http.delete<Note>(encodedUri.toString());
  }

  // UPDATE
  UpdateUser = (user: User) => {
    const params = new HttpParams()
      .set('id', user.id.toString())
      .set('name', user.name.toString());
    return this.http.patch('https://grove-ribbon-gray.glitch.me/updateUser', user, { params })
  }

  UpdateCategories = (category: Category) => {
    const params = new HttpParams()
      .set('id', category.id.toString())
      .set('name', category.name.toString());
    return this.http.patch('https://grove-ribbon-gray.glitch.me/updateCategory', category, { params })
  }

  
  UpdateNote = (note: Note) => {
    const params = new HttpParams()
      .set('id', note.id.toString())
      .set('title', note.title.toString())
      .set('body', note.body.toString())
      .set('categoryId', note.categoryId.toString())
      .set('userId', note.userId.toString());
    return this.http.patch('https://grove-ribbon-gray.glitch.me/updateNote', note, { params });
  }

    
  // UpdateNote = (note: Note) => {
  //   // const params = new HttpParams()
  //   //   .set('id', note.id.toString())
  //   //   .set('title', note.title.toString())
  //   //   .set('body', note.body.toString())
  //   //   .set('categoryId', note.categoryId.toString())
  //   //   .set('userId', note.userId.toString());
  //     const temp = encodeURI(`https://grove-ribbon-gray.glitch.me/updateNote?id=${note.id}&title=${note.title}&body=${note.body}&categoryId=${note.categoryId}&userId=${note.userId}`);
  //     return this.http.patch(temp.replace('%20','+'),note);
  // }

}
