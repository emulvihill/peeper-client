import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {VideoSnap} from "../../../models/graphql-models";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-video-snap-tile',
  imports: [
    NgClass
  ],
  templateUrl: './video-snap-tile.component.html',
  styleUrl: './video-snap-tile.component.scss'
})
export class VideoSnapTileComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.snapSource = this.sanitizer.bypassSecurityTrustUrl(this.snap.data);
  }

  @Input() snap!: VideoSnap;

  @Input() selectedAsBefore: boolean = false;
  @Input() selectedAsAfter: boolean = false;

  @Output() onSelected = new EventEmitter<VideoSnap>();

  snapSource!: SafeUrl;

  onClick() {
    this.onSelected.emit(this.snap);
  }
}
