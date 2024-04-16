import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  userName: string = 'User1';
  id: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.id = Number(this.router.url.split('/').pop());
    if (this.id > 1) {
      this.userName = 'User' + this.id;
    }
  }

  addWin() {
    this.id = Number(this.router.url.split('/').pop());
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`user/${this.id + 1}`])
    );

    window.open(url, '_blank');
  }
}
