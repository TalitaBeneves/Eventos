import { AccountService } from './../../services/account.service';
import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  usuarioLogado = false;

  constructor(private router: Router, public accountService: AccountService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.accountService.currentUser$.subscribe(
          (value) => (this.usuarioLogado = value !== null)
        );
      }
    });
  }

  ngOnInit(): void {}

  showMenu(): boolean {
    return this.router.url !== '/user/login';
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/user/login');
  }
}
