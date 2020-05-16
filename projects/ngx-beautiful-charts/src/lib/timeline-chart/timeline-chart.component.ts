import { Component, OnInit, Input, OnChanges, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { colorSchemes } from '../../constants/color-schemes';
import { TimelineChartService } from './timeline-chart.service';
import { GlobalParametersService } from '../../global/global-parameters.service';
import { fromEvent as observableFromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ngx-timeline-chart',
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.scss'],
  providers: [TimelineChartService]
})
export class TimelineChartComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input() data: any;
  @Input() width: number;
  @Input() height: number;
  @Input() colorScheme = 'colorful';
  @Input() customColorScheme: string[] = [];


  componentID;
  xPadding = 60;
  yPadding = this.xPadding / 2;
  gTranslate: string;

  barWidth: number;
  barStartY: number;
  barEndY: number;

  timeBubbleRadius: number;
  textBlockHeight: number;
  timeData = [];

  setWidth = 0;
  setHeight = 0;
  resizeSubscription: Subscription;


  computeBarDimensions() {
    this.barWidth = this.timelineChartService.rectHeight * .05;
    this.barStartY = this.yPadding + this.timelineChartService.rectHeight / 2 - this.barWidth / 2;
    this.barEndY = this.yPadding + this.timelineChartService.rectHeight / 2 + this.barWidth / 2;
  }

  setColors() {
    let cnt = 0;
    for (const oneTimeData of this.data) {
      if (!oneTimeData.color) {
        if (this.customColorScheme.length > 0) {
          oneTimeData.color = this.customColorScheme[cnt % this.customColorScheme.length];
        } else {
          oneTimeData.color = colorSchemes[this.colorScheme][cnt % 10];
        }
        cnt++;
      }
    }
  }

  setDimensions() {
    if (this.width && this.height) {
      this.setWidth = this.width;
      this.setHeight = this.height;
    } else if (this.width && !this.height) {
      this.setWidth = this.width;
      this.setHeight = this.setWidth / 2;
    } else if (!this.width && this.height) {
      this.setWidth = this.height * 2;
      this.setHeight = this.height;
    } else if (!this.width && !this.height) {
      const host = this.currentElement.nativeElement;
      if (host.parentNode != null) {
        const dims = host.parentNode.getBoundingClientRect();
        this.setWidth = Math.max(dims.width, 600);
        this.setHeight = Math.max(dims.width / 2, 300);
      }
    }
    // console.log('---set dimensions---');
    // console.log('width: ' + this.width);
    // console.log('height: ' + this.height);
    // console.log('--------------------');
  }

  textWrap(text, width) {
    const noOfCharactersPerLine = width / 10;
    const newLineStr = '\n';
    let done = false;
    const res = [];
    do {
      let found = false;
      for (let i = noOfCharactersPerLine - 1; i >= 0; i--) {
          if ((text.charAt(i)  === ' ')) {
              res.push([text.slice(0, i), newLineStr].join(''));
              text = text.slice(i + 1);
              found = true;
              break;
          }
      }
      if (!found) {
          res.push([text.slice(0, noOfCharactersPerLine), newLineStr].join(''));
          text = text.slice(noOfCharactersPerLine);
      }
      if (text.length < noOfCharactersPerLine) done = true;
    } while (!done);
    res.push(text);
    return res;
  }

  computeTimeData() {
    // const distanceBetweenTimeBubbles = this.width * .8 / (this.data.length - 1);
    const minTime = Math.min(...this.data.map(timeData => timeData.time));
    const maxTime = Math.max(...this.data.map(timeData => timeData.time));
    const perTimeWidth = this.timelineChartService.rectWidth * .8 / (maxTime - minTime);
    this.data.sort((a, b) => a.time < b.time ? -1 : a.time > b.time ? 1 : 0);
    const diffs = [];
    for (let i = 1; i < this.data.length; i++) {
      diffs.push(this.data[i].time - this.data[i - 1].time);
    }
    const minDiff = Math.min(...diffs);
    this.timeBubbleRadius = Math.min(minDiff * perTimeWidth * .4);
    const maxRadius = this.timelineChartService.rectWidth * .8 / (this.data.length - 1) * .25;
    const minRadius = this.timelineChartService.rectWidth * .8 * .04;

    // console.log('max: ' + maxRadius);
    // console.log('min: ' + minRadius);


    if (this.timeBubbleRadius > maxRadius) this.timeBubbleRadius = maxRadius;
    if (this.timeBubbleRadius < minRadius) this.timeBubbleRadius = minRadius;
    this.textBlockHeight = this.timelineChartService.rectHeight * 2 / 16;
    this.timeData = [];
    let cnt = 0;
    let up = 1;
    for (const oneTimeData of this.data) {
      const color = oneTimeData.color;
      const x = (oneTimeData.time - minTime) * perTimeWidth;
      const timeBubble = {
        centre: {
          x,
          y: this.barStartY + this.barWidth / 2
        },
        text: oneTimeData.displayTime ? oneTimeData.displayTime : oneTimeData.time
        // oneTimeData.displayTime ?
        // this.textWrap(oneTimeData.displayTime, this.timeBubbleRadius * 2) :
        // [oneTimeData.time]
      };
      const start = {
        x,
        y: (up === 1) ? this.barStartY : this.barEndY
      };
      const end = {
        x,
        y: (up === 1) ? this.barStartY - this.timelineChartService.rectHeight / 4 : this.barEndY + this.timelineChartService.rectHeight / 4
      };
      const line = 'M ' + start.x + ' ' + start.y + ' ' + end.x + ' ' + end.y;
      const text = this.textWrap(oneTimeData.text, this.timeBubbleRadius * 4);
      const textBlock = {
        position: {
          x,
          y: (up === 1) ?
          this.barStartY - this.timelineChartService.rectHeight  / 4 - ( text.length * 20) :
          this.barEndY + this.timelineChartService.rectHeight * 4 / 16
        },
        text
      };
      this.timeData.push({
        timeBubble,
        line,
        textBlock,
        color,
        up: (up === 1) ? true : false
      });
      up = up * -1;
      cnt++;
    }
  }

  constructor(public timelineChartService: TimelineChartService,
              private globalParametersService: GlobalParametersService,
              private currentElement: ElementRef) {
  }

  bindWindowResizeEvent(): void {
    const source = observableFromEvent(window, 'resize');
    const subscription = source.pipe(debounceTime(200)).subscribe(e => {
      console.log('window has been resized new.');
      this.doAll();
      // if (this.cd) {
      //   this.cd.markForCheck();
      // }
    });
    this.resizeSubscription = subscription;
  }

  doAll() {
    this.setDimensions();
    this.computeBarDimensions();
    this.setColors();
    this.timelineChartService.setValues({
      componentID: this.componentID,
      width: this.setWidth,
      height: this.setHeight,
      xPadding: this.xPadding,
      yPadding: this.yPadding
    });
    const transX = this.xPadding + this.timelineChartService.rectWidth * .1;
    this.gTranslate = 'translate(' + transX + 'px, ' + this.yPadding + 'px)';
    this.computeBarDimensions();
    this.computeTimeData();
    console.log(this.timeData);
  }

  ngOnInit() {
    this.componentID = this.globalParametersService.addNewComponent();
    this.doAll();
  }

  ngOnChanges() {
    this.doAll();
  }

  ngAfterViewInit(): void {
    this.bindWindowResizeEvent();
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }
}
