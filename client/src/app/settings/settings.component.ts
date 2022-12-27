import { Component, OnInit } from '@angular/core';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  faHouse = faHouse
  selected = 'tables'

  constructor() { }

  ngOnInit(): void {
  }

  changeSelected(name: string, index: number) {
    this.selected = name
    // @ts-ignore
    document.querySelector('#hidden').setAttribute(
      "style",
      "top: " + index * 3 + "rem;")
  }

}
