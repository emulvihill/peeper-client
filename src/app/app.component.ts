import { AfterViewChecked, Component } from '@angular/core';
import {VideoSnapService} from "../service/video-snap.service";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements AfterViewChecked {
  title = 'Peeper';

  storage: ImageBitmap[] = []; // Use this array as our database

  stream: MediaStream | null = null;
  captureInterval: ReturnType<typeof setTimeout>|undefined;
  startBtn: HTMLButtonElement | undefined;
  stopBtn: HTMLButtonElement | undefined;
  hideVid: HTMLInputElement | undefined;
  intervalSec: HTMLInputElement | undefined;
  videoElem: HTMLVideoElement | undefined;
  imageCountSpan: HTMLSpanElement | undefined;
  imagesDiv: HTMLDivElement | undefined;

  constructor(private videoSnapService: VideoSnapService) {
  }

  ngAfterViewChecked() {
    this.startBtn = document.querySelector("button#start")! as HTMLButtonElement;
    this.stopBtn = document.querySelector("button#stop")! as HTMLButtonElement;
    this.hideVid = document.querySelector("input#hideVid")! as HTMLInputElement;
    this.intervalSec = document.querySelector("input#interval")! as HTMLInputElement;
    this.videoElem = document.querySelector("video")! as HTMLVideoElement;
    this.imageCountSpan = document.querySelector('span#image_count')! as HTMLSpanElement;
    this.imagesDiv = document.querySelector("div#images")! as HTMLDivElement;
  }

  hideVidClick() {
    if (!this.videoElem || !this.hideVid) return;

    this.videoElem.hidden = this.hideVid.checked;
  }

  async uploadData(result: string) {
    await firstValueFrom(this.videoSnapService.createVideoSnap("1", result));
  }

  async startClick() {
    if (!this.videoElem || !this.startBtn || !this.stopBtn || !this.intervalSec) return;

    this.startBtn.disabled = true;

    this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.videoElem.onplaying = () =>
      console.log("video playing this.stream:", this.videoElem!.srcObject);
    this.videoElem.srcObject = this.stream;


    // (data check on the interval value) * that value is in seconds  * frame timestamps are in microseconds
    const intervalSecValue: number = parseInt(this.intervalSec.value);
    const interval = (intervalSecValue >= 1 ? intervalSecValue : 1) * 1000;

    clearInterval(this.captureInterval);

    this.captureInterval = setInterval(async () => {
      const canvas = new OffscreenCanvas(1, 1); // needs an initial size
      const ctx = canvas.getContext("2d")!;

      if (!this.videoElem || !this.imageCountSpan) return;
      // I am not assuming the source video has fixed dimensions
      canvas.height = this.videoElem.videoHeight;
      canvas.width = this.videoElem.videoWidth;

      const maxDimension = 128;
      const reduction = Math.max(canvas.width, canvas.height)/maxDimension;
      const dw = Math.floor(canvas.width / reduction);
      const dh = Math.floor(canvas.height / reduction);
      canvas.width = dw;
      canvas.height = dh;
      ctx.drawImage(this.videoElem, 0, 0, dw, dh);
      canvas.convertToBlob().then(blob => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          reader.result && await this.uploadData(reader.result as string);
          const bitmap: ImageBitmap = canvas.transferToImageBitmap();
          this.storage.push(bitmap);
        }
        reader.readAsDataURL(blob);
      });
      this.imageCountSpan.innerText = (parseInt(this.imageCountSpan.innerText) + 1).toString();
    }, interval);

    this.stopBtn.disabled = false;
  }

  async stopClick() {
    // stop capture
    clearInterval(this.captureInterval);

    // close the camera
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }

    return this.showImages();
  }


  // Display each image
  async showImages() {
    if (!this.imagesDiv) return;

    const bitmap = this.storage.shift();
    if (!bitmap) {
      return;
    }
    const width = bitmap.width;
    const height = bitmap.height;

    console.log(bitmap);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    // Common method
    // const ctx = canvas.getContext("2d");
    // ctx.drawImage(frame, 0, 0);

    // less resource intensive method but no Safari support
    const ctx = canvas.getContext("bitmaprenderer")!;
    ctx.transferFromImageBitmap(bitmap);
    this.imagesDiv.appendChild(canvas);

    if (this.storage.length > 0) await this.showImages();
  }
}
