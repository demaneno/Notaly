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
import { Category } from 'src/app/shared/category.model';
import { APIService } from 'src/app/shared/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss'],
})

export class CategoryDetailsComponent implements OnInit {
  category: Category;

  categoryId: number;

  new: boolean;

  constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.category = new Category();
      if (params.id) {
        this.new = false;
        this.apiService.GetCategoryById(params.id).subscribe((data:Category) => {
          this.category = data;
        });
      } else {
        this.new = true;
      }
    });
  }

  onSubmit(form: NgForm) {
    if (this.new) {
      this.category = form.value;
      this.apiService.AddCategory(this.category.name).subscribe((data:Category) => this.category = data);
      this.router.navigateByUrl('/categories');
    } else {
      this.apiService.UpdateCategories(this.category).subscribe((data:Category) => this.category = data);
      this.router.navigateByUrl('/categories');

      this.apiService.GetCategories().subscribe((data:Category[]) => {
      });
    }
  }

  cancel() {
    this.router.navigateByUrl('/categories');
  }
}
