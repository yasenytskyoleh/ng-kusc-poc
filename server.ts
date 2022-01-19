import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import {ngExpressEngine} from '@nguniversal/express-engine';
import * as express from 'express';
import {join} from 'path';

import {AppServerModule} from './src/main.server';
import {APP_BASE_HREF} from '@angular/common';
import {existsSync} from 'fs';

import {REQUEST, RESPONSE} from '@nguniversal/express-engine/tokens';
import {NgxRequest, NgxResponse} from '@gorniv/ngx-universal';

const domino = require('domino');

// Uncomment for using https
// const privateKey = readFileSync('./ssl/server.key');
// const certificate = readFileSync('./ssl/server.crt');

const distFolder = join(process.cwd(), `dist/ng-kusk-poc/browser`);
const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

const win = domino.createWindow(indexHtml);
Object.assign(global, domino.impl);
(global as any).window = win;

Object.defineProperty(win.document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

(global as any).document = win.document;
(global as any).CSS = null;
(global as any).Prism = null;
(global as any).TDSdk = {};

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    (global as any).navigator = req.headers['user-agent'];
    const http = req.headers['x-forwarded-proto'] === undefined ? 'http' : req.headers['x-forwarded-proto'];
    res.render(indexHtml, {
      req,
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: req.baseUrl
        },
        {
          provide: REQUEST,
          useValue: req,
        },
        {
          provide: RESPONSE,
          useValue: res,
        },
        {
          provide: NgxRequest,
          useValue: req,
        },
        {
          provide: NgxResponse,
          useValue: res,
        },
        {
          provide: 'ORIGIN_URL',
          useValue: `${http}://${req.headers.host}`,
        },
      ],
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
