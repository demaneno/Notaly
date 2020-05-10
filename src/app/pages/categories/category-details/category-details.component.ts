import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from 'src/app/shared/category.model';
import { CategoriesService } from 'src/app/shared/categories.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit {

  category: Category;
  categoryId: number;
  new: boolean; 

  constructor(private categoriesService: CategoriesService,private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.category = new Category();
      if(params.id){
        this.category = this.categoriesService.get(params.id);
        this.categoryId = params.id;
        this.new = false;
      } else {
        this.new = true;
    }
  })
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if(this.new) {
      this.categoriesService.add(form.value);
      this.router.navigateByUrl('/categories');
    } else {
      this.categoriesService.update(this.categoryId, form.value.name);
      this.router.navigateByUrl('/categories');
    }
  }

  cancel() {
    this.router.navigateByUrl('/categories');
  }

}
