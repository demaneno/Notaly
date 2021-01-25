/* eslint-disable no-unused-vars */
/* eslint-disable no-return-assign */
/* eslint-disable space-infix-ops */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-array-constructor */
/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unresolved */
import {
  Component, OnInit, ViewChild, ElementRef,
} from '@angular/core';
import { Category } from 'src/app/shared/category.model';
import { APIService } from 'src/app/shared/api.service';
import {
  trigger, transition, style, animate, query, stagger,
} from '@angular/animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
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

export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];

  public category$: Observable<Category[]>;

  category: Category;

  aCategory: Category;

  bCategory: Category;

  categoryId: number;

  count : number = 0;

  filteredCategories : Category[] = [];

  @ViewChild('filterInput', { static: true }) filterInputElRef: ElementRef <HTMLInputElement>;

  // eslint-disable-next-line no-unused-vars
  constructor(private apiService: APIService) { }

   ngOnInit() {
     this.Refresh();
    this.filter('');
  }

  deleteCategory(category: Category) {
    // const categoryId = this.apiService.GetCategoryById(category);
    this.apiService.DelCategory(category.name).subscribe((result)=>{
      console.log(result)
      this.filteredCategories.splice(category.id,1);
    this.filter(this.filterInputElRef.nativeElement.value);
      this.ngOnInit();
    });
    
  }

  generateCategoryURL(category: Category) {
    // if (this.count <= this.categories.length) {
    //   this.apiService.GetCategoryById(category.id).subscribe((data) => {
    //     this.categoryId = data.id;
    //   });
    //   this.count+=1;
    //   if (this.categoryId !== undefined && this.categoryId !== undefined) {
    //     return this.categoryId;
    //   }
    // }
    // return 0;
  }

  filter(query: string) {
    query = query.toLowerCase().trim();

    let allResults: Category[] = new Array<Category>();
    // split search (spaces)
    let terms: string[] = query.split(' ');
    terms = this.removeDuplicates(terms);

    terms.forEach((term) => {
      const results: Category[] = this.relevantCategories(term);
      // Array destruction ->
      allResults = [...allResults, ...results];
    });

    const uniqueResults = this.removeDuplicates(allResults);
    this.filteredCategories = uniqueResults;
    this.sortByRelevancy(allResults);
  }

  removeDuplicates(arr: Array<any>) : Array<any> {
    const uniqueResults: Set<any> = new Set<any>();

    arr.forEach((e) => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }

  relevantCategories(query: any) : Array<Category> {
    query = query.toLowerCase().trim();
    const relevantNotes = this.categories.filter((category) => {
      if (category.name && category.name.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });

    return relevantNotes;
  }

  sortByRelevancy(searchResults: Category[]) {
    let categoryCountObj: Object = {};

    searchResults.forEach((category) => {
      this.apiService.GetCategoryById(category.id).subscribe((data: Category) => {
        this.category = data;
      });

      if (this.category !== undefined && categoryCountObj[this.category.id] !== undefined && categoryCountObj[this.category.id]) {
        categoryCountObj[this.category.id] += 1;
      } else {
        categoryCountObj[this.category.id] = 1;
      }
    });

    this.filteredCategories = this.filteredCategories.sort((a: Category, b: Category) => {
      this.apiService.GetCategoryById(a.id).subscribe((data: Category) => {
        this.aCategory = data;
      });

      this.apiService.GetUserById(b.id).subscribe((data: Category) => {
        this.bCategory = data;
      });

      let aCount = categoryCountObj[this.aCategory.id];
      let bCount = categoryCountObj[this.bCategory.id];

      return bCount - aCount;
    });
  }

  Refresh = () => this.apiService.GetCategories().subscribe((data: Category[]) => {
    this.categories = data
    this.filteredCategories = this.categories;
  });
}
