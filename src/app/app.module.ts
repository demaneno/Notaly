import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotesListComponent } from './pages/notes/notes-list/notes-list.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { NoteCardComponent } from './cards/note-card/note-card.component';
import { NoteDetailsComponent } from './pages/notes/note-details/note-details.component';
import { UserDetailsComponent } from './pages/users/user-details/user-details.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { CategoryDetailsComponent } from './pages/categories/category-details/category-details.component';
import { UserCardComponent } from './cards/user-card/user-card.component';
import { CategoryCardComponent } from './cards/category-card/category-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NotesListComponent,
    MainLayoutComponent,
    NoteCardComponent,
    NoteDetailsComponent,
    UserDetailsComponent,
    UsersListComponent,
    CategoriesListComponent,
    CategoryDetailsComponent,
    UserCardComponent,
    CategoryCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
