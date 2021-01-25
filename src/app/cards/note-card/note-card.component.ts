/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
import {
  Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
})
// eslint-disable-next-line import/prefer-default-export
export class NoteCardComponent implements OnInit {
  @Input() id: number;

  @Input() title: string;

  @Input() body: string;

  @Input() user: string;

  @Input() category: string;

  @Input() link: string;

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter <void>();

  @ViewChild('truncator', { static: true }) truncator: ElementRef<HTMLElement>;

  @ViewChild('bodyText', { static: true }) bodyText: ElementRef<HTMLElement>;

  // eslint-disable-next-line no-useless-constructor
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    const style = window.getComputedStyle(this.bodyText.nativeElement, null);
    const viewableHeight = parseInt(style.getPropertyValue('height'), 10);

    if (this.bodyText.nativeElement.scrollHeight > viewableHeight) {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }

  onXButtonClick() {
    this.deleteEvent.emit();
  }
}
