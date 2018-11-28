import { Injectable } from '@angular/core';

export enum SaveKey {
  Items = 'items',
  Dungeons = 'dungeons',
  ItemLocations = 'item-locations',
  StartState = 'start-state',
  SwordLogic = 'sword-logic',
  Difficulty = 'difficulty',
  Logic = 'logic',
  ShowGoMode = 'show-go-mode',
  Goal = 'goal',
  ItemShuffle = 'item-shuffle',
  Enemy = 'enemy',
}

@Injectable()
export class SaveService {
  save<T = any>(key: SaveKey, data: T): void {
    // URLSearchParams does not support IE
    const queryParams: URLSearchParams = new URLSearchParams(window.location.search);

    queryParams.set(key, JSON.stringify(data));

    window.history.replaceState(null, null, `?${queryParams.toString().replace(/%2C/g, ',')}`);
  }

  restore<T = any>(key: SaveKey, defaultValue = null): T {
    const queryParams: URLSearchParams = new URLSearchParams(window.location.search);

    const queryParam: string = queryParams.get(key);

    return queryParam ? JSON.parse(queryParam) : defaultValue;
  }

  has(key: SaveKey): boolean {
    const queryParams: URLSearchParams = new URLSearchParams(window.location.search);

    return !!queryParams.get(key);
  }

  reset(): void {
    window.history.replaceState(null, null, '/');
  }
}
