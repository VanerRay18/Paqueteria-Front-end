import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileTransferService {

  constructor() { }

  private fileSource = new BehaviorSubject<File | null>(null);

  setFile(file: File) {
    this.fileSource.next(file);
  }

  getFile() {
    return this.fileSource.asObservable();
  }

  private idSource = new BehaviorSubject<number | null>(null);
  currentIdTercero$ = this.idSource.asObservable();

  setIdTercero(id: number) {
    this.idSource.next(id);
  }

  clearIdTercero() {
    this.idSource.next(null);
  }


}
