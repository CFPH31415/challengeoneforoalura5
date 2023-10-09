import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {


  currentUsername: string | null = null;

  constructor(
    private elementRef: ElementRef,
    private usersService: UsersService,
    private router: Router) { }



  ngOnInit(): void {
    this.usersService.getCurrentUsername().subscribe(username => {
      this.currentUsername = username;
    });
  }


  ngAfterViewInit(): void {
    const icons = this.elementRef.nativeElement.querySelector('#toggle');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (icons) {
      icons.addEventListener('click', () => {
        icons.classList.toggle('open');
        navbar.classList.toggle('efecto');
      });
    }


    document.addEventListener('click', (event: MouseEvent) => {
      if (navbar && !navbar.contains(event.target as Node) && icons && !icons.contains(event.target as Node)) {
        navbar.classList.remove('efecto');
        if (icons) {
          icons.classList.remove('open'); 
        }
      }
    });
  }

  logout(): void {
    this.usersService.logout();
    this.router.navigate(['/home']);
  }
}
