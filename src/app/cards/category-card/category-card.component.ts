/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
import {
  Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
})
// eslint-disable-next-line import/prefer-default-export
export class CategoryCardComponent implements OnInit {
  @Input() id: number;

  @Input() name: string;

  @Input() link: string;

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('bodyText', { static: true }) bodyText: ElementRef<HTMLElement>;

  // eslint-disable-next-line no-useless-constructor
  constructor(private renderer: Renderer2) { }

  // eslint-disable-next-line class-methods-use-this
  ngOnInit(): void { }

  onXButtonClick() {
    this.deleteEvent.emit();
  }
}
