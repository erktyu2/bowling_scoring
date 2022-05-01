import {Component, Input, OnInit} from '@angular/core';
import {Frame} from '../../models/frame.model';

@Component({
  selector: 'shared-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss']
})
export class FrameComponent implements OnInit {

  @Input() frame: Frame | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
