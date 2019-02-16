import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DrawState, PencilState, DrawCommand } from './helpers/draw-state.interface';

@Component({
  selector: 'aia-image-annotator',
  templateUrl: './aia-image-annotator.component.html',
  styleUrls: ['./aia-image-annotator.component.scss']
})
export class AiaImageAnnotatorComponent implements OnInit {
  @Input() image: string;

  @ViewChild('imageCanvas') private imageCanvasRef: ElementRef;
  @ViewChild('drawingCanvas') private drawingCanvasRef: ElementRef;

  public imageWidth = 0;
  private _state: DrawState = new PencilState();
  private _drawCommands: DrawCommand[] = [];

  public imageCtx: CanvasRenderingContext2D;
  public drawingCtx: CanvasRenderingContext2D;

  public get canvasRect(): ClientRect {
    return this.drawingCanvasRef.nativeElement.getBoundingClientRect();
  }

  constructor() { }

  ngOnInit() {
    const tempImage = new Image();
    tempImage.onload = _ => {
      this.imageWidth = tempImage.width;
      this.initializeCanvas(tempImage);
    };
    tempImage.src = this.image;
  }

  private initializeCanvas(img: HTMLImageElement) {
    this.imageCanvasRef.nativeElement.width = img.width;
    this.imageCanvasRef.nativeElement.height = img.height;
    this.imageCtx = this.imageCanvasRef.nativeElement.getContext('2d');
    this.imageCtx.drawImage(img, 0, 0);

    this.drawingCanvasRef.nativeElement.width = img.width;
    this.drawingCanvasRef.nativeElement.height = img.height;

    this.drawingCtx = this.drawingCanvasRef.nativeElement.getContext('2d');
    this.drawingCtx.lineJoin = 'round';
    this.drawingCtx.lineWidth = 2;
  }

  public addCommand(command: DrawCommand) {
    this._drawCommands.push(command);
  }

  public touchStart(ev: TouchEvent) {
    this._state.touchStart(this, ev);
  }

  public touchMove(ev: TouchEvent) {
    this._state.touchMove(this, ev);
  }

  public touchEnd(ev: TouchEvent) {
    this._state.touchEnd(this, ev);
  }
}
