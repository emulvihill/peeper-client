import {Component, OnInit} from "@angular/core";
import {VideoSnapService} from "../service/video-snap.service";
import {firstValueFrom, Observable} from "rxjs";
import {VideoSnap} from "../models/graphql-models";
import {VideoSnapTileComponent} from "./snap-comparison-view/video-snap-tile/video-snap-tile.component";
import {ComparisonService} from "../service/comparison.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: false,
})
export class AppComponent implements OnInit {
  title = "Peeper";

  storage: VideoSnap[] = []; // Use this array as our database
  capturing: boolean = false;

  stream: MediaStream | null = null;
  captureInterval: ReturnType<typeof setTimeout> | undefined;
  startBtn: HTMLButtonElement | undefined;
  stopBtn: HTMLButtonElement | undefined;
  hideVid: HTMLInputElement | undefined;
  intervalSec: HTMLInputElement | undefined;
  videoElem: HTMLVideoElement | undefined;
  imageCountSpan: HTMLSpanElement | undefined;
  imagesDiv: HTMLDivElement | undefined;
  snapPair: [VideoSnap | undefined, VideoSnap | undefined] = [undefined, undefined];

  constructor(private videoSnapService: VideoSnapService, private comparisonService: ComparisonService) {
  }

  ngOnInit() {
    this.startBtn = document.querySelector("button#start")! as HTMLButtonElement;
    this.stopBtn = document.querySelector("button#stop")! as HTMLButtonElement;
    this.hideVid = document.querySelector("input#hideVid")! as HTMLInputElement;
    this.intervalSec = document.querySelector("input#interval")! as HTMLInputElement;
    this.videoElem = document.querySelector("video")! as HTMLVideoElement;
    this.imageCountSpan = document.querySelector("span#image_count")! as HTMLSpanElement;
    this.imagesDiv = document.querySelector("div#images")! as HTMLDivElement;
  }

  hideVidClick() {
    if (!this.videoElem || !this.hideVid) return;

    this.videoElem.hidden = this.hideVid.checked;
  }

  uploadData(result: string): Observable<VideoSnap> {
    return this.videoSnapService.createVideoSnap("1", result);
  }

  async startClick() {
    if (!this.videoElem || !this.startBtn || !this.stopBtn || !this.intervalSec) return;

    this.capturing = true;

    this.stream = await navigator.mediaDevices.getUserMedia({video: true});
    this.videoElem.onplaying = () =>
      console.log("video playing this.stream:", this.videoElem!.srcObject);
    this.videoElem.srcObject = this.stream;


    // (data check on the interval value) * that value is in seconds  * frame timestamps are in microseconds

    clearInterval(this.captureInterval);

    const interval = this.getTimoutInterval();
    this.captureInterval = setTimeout(this.createSnapshot(), interval);

    this.stopBtn.disabled = false;
  }

  private getTimoutInterval() {
    const intervalSecValue: number = parseInt(this.intervalSec!.value);
    return (intervalSecValue >= 1 ? intervalSecValue : 1) * 1000;
  }

  private createSnapshot() {
    return async () => {
      const canvas = new OffscreenCanvas(1, 1); // needs an initial size
      const ctx = canvas.getContext("2d")!;

      if (!this.videoElem || !this.imageCountSpan) return;
      // I am not assuming the source video has fixed dimensions
      canvas.height = this.videoElem.videoHeight;
      canvas.width = this.videoElem.videoWidth;

      const maxDimension = 128;
      const reduction = Math.max(canvas.width, canvas.height) / maxDimension;
      const dw = Math.floor(canvas.width / reduction);
      const dh = Math.floor(canvas.height / reduction);
      canvas.width = dw;
      canvas.height = dh;
      ctx.drawImage(this.videoElem, 0, 0, dw, dh);
      canvas.convertToBlob().then(blob => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          if (reader.result) {

            const snap = await firstValueFrom(this.uploadData(reader.result.toString()));
            console.info(`Image uploaded, ${snap.id} ${snap.date}`);
            this.storage.push(snap);
          } else {
            console.error("No result bitmap to upload!");
          }
        };
        reader.readAsDataURL(blob);
      });
      this.imageCountSpan.innerText = (parseInt(this.imageCountSpan.innerText) + 1).toString();

      const interval = this.getTimoutInterval();
      this.captureInterval = setTimeout(this.createSnapshot(), interval);
    };
  }

  async stopClick() {
    // stop capture
    clearInterval(this.captureInterval);
    this.capturing = false;

    // close the camera
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }

  compareSelected() {

    if (this.snapPair[0] && this.snapPair[1]) {
      this.comparisonService.compareVideoSnaps(this.snapPair[0], this.snapPair[1])
        .subscribe(result => {
          console.log(result);
        });
    }
  }

  comparisonEdited(snapPair: [VideoSnap | undefined, VideoSnap | undefined]) {
    this.snapPair = snapPair;
    console.log(`comparisonEdited, comparing: ${snapPair}`);
  }
}
