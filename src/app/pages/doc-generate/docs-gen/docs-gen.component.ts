import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-docs-gen',
  templateUrl: './docs-gen.component.html',
  styleUrls: ['./docs-gen.component.scss']
})
export class DocsGenComponent implements OnInit {
   displayedColumns: string[] = ['select', 'name', 'upload', 'uploadedFile', 'status'];
  dataSource = [
    { id:1, selected: false, name: 'Document 1', uploadedFile: '', status: false, processedStatus: '' },
    { id:2, selected: false, name: 'Document 2', uploadedFile: '', status: false, processedStatus: ''},
    { id:3, selected: false, name: 'Document 3', uploadedFile: '', status: false, processedStatus: ''}
  ];
  isProcessing: boolean = false;

  constructor() { }

  ngOnInit(): void {
    
  }

    handleFileInput(event: any, row: any) {
    const file = event.target.files[0];
    if (file) {
      let data = this.dataSource.find(item => item.id === row.id);
      row.uploadedFile = file.name;
      row.status = true;
      row.processedStatus = 'Error';
      this.isProcessing = true;
      // You can also upload the file to your server or do other processing here
    }
  }
}
