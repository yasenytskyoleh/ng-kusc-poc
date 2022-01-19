import {FactoryProvider} from '@angular/core';
import {IncomingMessage} from 'http';
import {REQUEST} from '@nguniversal/express-engine/tokens';
import {LOCATION} from './location';

export function provideLocation(req: IncomingMessage): Location {
  const protocol = 'encrypted' in req.socket ? 'https' : 'http';
  const url: any = new URL(`${protocol}://${req.headers.host}${req.url}`);
  const emptyFunction = () => {};

  url.assign = emptyFunction;
  url.reload = emptyFunction;
  url.replace = emptyFunction;
  url.ancestorOrigins = new (class extends Array<string> implements DOMStringList {
    contains(): boolean {
      return false;
    }

    item(): null {
      return null;
    }
  })();

  return url;
}

export const UNIVERSAL_LOCATION: FactoryProvider = {
  provide: LOCATION,
  useFactory: provideLocation,
  deps: [REQUEST],
};

