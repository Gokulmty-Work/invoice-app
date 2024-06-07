import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthServiceService } from 'src/app/pages/authentication/services/auth-service.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit{
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  selectedFile: any;
  tabs = [
    {id:1, name:'Home', url:'/home/list'},
    {id:2, name:'New Invoice', url:'/home/add-new'},
    {id:3, name:'Config', url:'/configure/config'}
  ];

  constructor(public dialog: MatDialog,
     private authService: AuthServiceService,
     private sharedService: SharedService,
     private sanitizer: DomSanitizer) {}
     
  ngOnInit(): void {
    this.getUserData();
    this.getProfileImg();
    this.sharedService.uploadSuccess$.subscribe(() => {
      this.getProfileImg();
    });
  }

  getUserData(): any {
    const userData = this.authService.getUserData();
    return userData;
  }

  getProfileImg(){
    let id = this.getUserData().id;
    this.sharedService.getProfilePhoto(id).subscribe(
      {
        next: (response) => {
          let objectURL = URL.createObjectURL(response);
          this.selectedFile =  (this.sanitizer.bypassSecurityTrustResourceUrl(objectURL) as any).changingThisBreaksApplicationSecurity;
        },
        error: (error: any) => {
        console.error('Error:', error);
         },
      }
    );
  }

  logoutUser(){
    this.authService.logOut();
  }

}
