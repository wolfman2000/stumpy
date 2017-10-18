import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  hasItem( key: string ): boolean {
    return this.getItem( key ) !== null;
  }

  getItem( key: string ): string {
    return localStorage.getItem( key );
  }

  setItem( key: string, value: string ): void {
    localStorage.setItem( key, value );
  }

  removeItem( key: string ): void {
    localStorage.removeItem( key );
  }
}
