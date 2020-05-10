import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Category } from 'src/app/shared/category.model';
import { CategoriesService } from 'src/app/shared/categories.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
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
export class CategoriesListComponent implements OnInit {

  categories: Category[] = new Array<Category>();
  filteredCategories :  Category[] = new Array<Category>();

  @ViewChild('filterInput') filterInputElRef: ElementRef <HTMLInputElement>;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.categories = this.categoriesService.getAll();
      this.filter('');
  }

  deleteCategory(category: Category) {
    let categoryId = this.categoriesService.getId(category);
    this.categoriesService.delete(categoryId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }

  generateCategoryURL(category: Category) {
    let categoryId = this.categoriesService.getId(category);
    return categoryId;
  }

  filter(query: string) {
    query = query.toLowerCase().trim();

    let allResults: Category[] = new Array<Category>();
    //split search (spaces)
    let terms: string[] = query.split(' '); 
    terms = this.removeDuplicates(terms);

    terms.forEach(term => {
      let results: Category[] = this.relevantCategories(term);
      //Array destruction -> 
      allResults = [...allResults, ...results]
    });

    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredCategories = uniqueResults;
    this.sortByRelevancy(allResults);
  }

  removeDuplicates(arr: Array<any>) : Array<any> {
    let uniqueResults: Set<any> = new Set<any>();

    arr.forEach(e => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }

  relevantCategories(query: any) : Array<Category>  {
    query = query.toLowerCase().trim();
    let relevantNotes = this.categories.filter(category => {
      
      if( category.name && category.name.toLowerCase().includes(query)){
        return true;
      }

      return false;
    })
    
    return relevantNotes;
  }

  sortByRelevancy(searchResults: Category[]) {
    let categoryCountObj: Object = {};

    searchResults.forEach(category => {
      let categoryId = this.categoriesService.getId(category);

      if(categoryCountObj[categoryId]) {
        categoryCountObj[categoryId] += 1;
      } else {
        categoryCountObj[categoryId] = 1;
      }
    })

    this.filteredCategories = this.filteredCategories.sort((a:Category, b:Category) => {
      let aId = this.categoriesService.getId(a);
      let bId = this.categoriesService.getId(b);

      let aCount = categoryCountObj[aId];
      let bCount = categoryCountObj[bId];

      return bCount - aCount;
    })
  }
}

