import { Injectable } from '@angular/core';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  categories: Category[] = new Array<Category>();
  constructor() { }

  getAll(){
    return this.categories;
  }

  get(id: number) {
    return this.categories[id];
  }

  getId(category: Category) {
    return this.categories.indexOf(category);
  }

  add(category: Category) {
    let newLength = this.categories.push(category);
    let index = newLength - 1;
    return index;
  }

  update(id: number, name: string ){
    let category = this.categories[id];
    category.name = name;
  }

  delete(id: number) {
    this.categories.splice(id, 1);
  }
}
