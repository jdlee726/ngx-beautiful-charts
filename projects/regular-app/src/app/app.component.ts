import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Regular Charts';

  data = [
    {x: 10, y: 10, info: ''},
    {x: 80, y: 40, info: ''},
    {x: 30, y: 30, info: ''},
    {x: 40, y: 20, info: ''},
    {x: 40, y: 30, info: ''},
    {x: 40, y: 40, info: ''},
    {x: 50, y: 20, info: ''},
    {x: 90, y: 20, info: ''},
    {x: 41, y: 45, info: ''},
    {x: 51, y: 22, info: ''},
    {x: 92, y: 10, info: ''}
  ];

  multiLineData = [
    {name: 'first', color: '#ff1111', data: [
      {x: 10, y: 10, info: ''},
      {x: 80, y: 40, info: ''},
      {x: 30, y: 30, info: ''},
      {x: 40, y: 20, info: ''},
      {x: 40, y: 30, info: ''},
      {x: 40, y: 40, info: ''},
      {x: 50, y: 20, info: ''},
      {x: 90, y: 20, info: ''},
      {x: 41, y: 45, info: ''},
      {x: 51, y: 22, info: ''},
      {x: 92, y: 10, info: ''}
    ]},
    {name: 'second', color: '#33bb33', data: [
      {x: 10, y: 5, info: ''},
      {x: 80, y: 30, info: ''},
      {x: 30, y: 25, info: ''},
      {x: 40, y: 35, info: ''},
      {x: 45, y: 25, info: ''},
      {x: 55, y: 35, info: ''},
      {x: 50, y: 15, info: ''},
      {x: 90, y: 15, info: ''},
      {x: 92, y: 5, info: ''}
    ]},
    {name: 'third', color: '#3333bb', data: [
      {x: 5, y: 5, info: ''},
      {x: 15, y: 30, info: ''},
      {x: 25, y: 25, info: ''},
      {x: 35, y: 15, info: ''},
      {x: 45, y: 15, info: ''},
      {x: 55, y: 35, info: ''},
      {x: 65, y: 25, info: ''},
      {x: 75, y: 5, info: ''}
    ]},
    {name: 'fourth', color: '#10ffbb', data: [
      {x: 15, y: 5, info: ''},
      {x: 5, y: 30, info: ''},
      {x: 25, y: 15, info: ''},
      {x: 30, y: 16, info: ''},
      {x: 4, y: 35, info: ''},
      {x: 65, y: 35, info: ''},
      {x: 65, y: 25, info: ''},
      {x: 85, y: 5, info: ''}
    ]}
  ];
}
