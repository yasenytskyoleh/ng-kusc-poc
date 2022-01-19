import {Injectable} from '@angular/core';
import {CookieService} from '@gorniv/ngx-universal';

@Injectable()
export class UniversalStorageService {

  [index: number]: string;

  [key: string]: unknown;

  constructor(private cookieService: CookieService) {
  }

  public clear(): void {
    this.cookieService.removeAll();
  }

  public getAll(): object {
    return this.cookieService.getAll();
  }

  public getItem(key: string): string {
    return this.cookieService.get(key);
  }

  public removeItem(key: string): void {
    this.cookieService.remove(key);
  }

  public setItem(key: string, data: string | null): void {
    // @ts-ignore
    this.cookieService.put(key, data);
  }
}
