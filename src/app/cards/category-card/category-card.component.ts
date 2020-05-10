import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent implements OnInit {

  @Input() name: string;
  @Input() link: string;

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter <void>();

  @ViewChild('bodyText',{static: true}) bodyText: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit(): void {
  }

  onXButtonClick() {
    this.deleteEvent.emit();
  }
}
