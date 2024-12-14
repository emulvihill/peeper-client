import {Component, EventEmitter, Input, input, Output} from '@angular/core';
import {VideoSnap} from "../../models/graphql-models";
import {VideoSnapTileComponent} from "./video-snap-tile/video-snap-tile.component";

@Component({
  selector: 'app-snap-comparison-view',
  imports: [
    VideoSnapTileComponent
  ],
  templateUrl: './snap-comparison-view.component.html',
  styleUrl: './snap-comparison-view.component.scss'
})
export class SnapComparisonViewComponent {

  //snaps = input<VideoSnap[]>;
  @Input() snaps!: VideoSnap[];

  beforeSnap: VideoSnap | undefined;
  afterSnap: VideoSnap | undefined;
  lastSelectedSnap: VideoSnap | undefined;

  @Output() edit = new EventEmitter<[VideoSnap|undefined, VideoSnap|undefined]>();

  onSnapSelected(snap: VideoSnap) {
    if (this.beforeSnap === snap || this.afterSnap === snap) {
      return;
    }

    if (this.lastSelectedSnap && this.lastSelectedSnap.id < snap.id) {
      this.afterSnap = snap;
    } else {
      this.beforeSnap = snap;
    }
    this.lastSelectedSnap = snap;

    this.edit.emit([this.beforeSnap, this.afterSnap]);
  }

}
