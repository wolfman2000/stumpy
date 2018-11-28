import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  hasItem( key: string ): boolean {
    return this.getItem( key ) !== null;
  }

  getItem<T = any>( key: string ): T {
    return JSON.parse(localStorage.getItem( key ));
  }

  setItem<T = any>( key: string, value: T ): void {
    localStorage.setItem( key, JSON.stringify(value) );
  }

  removeItem( key: string ): void {
    localStorage.removeItem( key );
  }
}
