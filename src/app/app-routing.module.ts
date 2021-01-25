import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotesListComponent } from './pages/notes/notes-list/notes-list.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { NoteDetailsComponent } from './pages/notes/note-details/note-details.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { UserDetailsComponent } from './pages/users/user-details/user-details.component';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { CategoryDetailsComponent } from './pages/categories/category-details/category-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'notes', component: NotesListComponent },
      { path: 'users', component: UsersListComponent },
      { path: 'categories', component: CategoriesListComponent },
      { path: 'notes/new', component: NoteDetailsComponent },
      { path: 'notes/:id', component: NoteDetailsComponent },
      { path: 'users/new', component: UserDetailsComponent },
      { path: 'users/:id', component: UserDetailsComponent },
      { path: 'categories/new', component: CategoryDetailsComponent },
      { path: 'categories/:id', component: CategoryDetailsComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {};
