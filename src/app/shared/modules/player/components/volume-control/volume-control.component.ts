import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-volume-control',
  templateUrl: './volume-control.component.html',
  styleUrls: ['./volume-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VolumeControlComponent implements OnInit {

  public volume = .5;
  public readonly defaultVolume = .5;
  public showSlider = false;

  @ViewChild('volumeControl', {static: true}) volumeControl: ElementRef<Range> | undefined;

  @Output() changeVolume = new EventEmitter<number>();

  constructor(private readonly renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.updateStyle(this.volume);
  }

  public onChangeValue(event: any): void {
    const value = event?.target?.value;
    if (!value) {
      return;
    }
    this.updateStyle(value);
    this.volume = value;
    this.changeVolume.emit(value);
  }

  private updateStyle(value: number): void {
    const control = this.volumeControl;
    if (!control) {
      return;
    }
    const min = 0;
    const max = 1;
    this.renderer.setStyle(
      control.nativeElement,
      'background',
      `linear-gradient(to right, red 0%, red ${(value - min) / (max - min) * 100}%, #DEE2E6 ${(value - min) / (max - min) * 100}%, #DEE2E6 100%)`
    );
  }

  public toggleVolume(): void {
    this.volume = this.volume > 0 ? 0 : this.defaultVolume;
    this.updateStyle(this.volume);
    this.changeVolume.emit(this.volume);
  }
}
