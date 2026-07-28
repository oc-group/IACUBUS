#!/usr/bin/env node

// Xcode 26's stricter module boundary enforcement rejects the direct
// `#import <netinet6/in6.h>` in cordova-plugin-advanced-http's bundled
// AFNetworking sources ("Use of private header from outside its module").
// `netinet/in.h`, already imported right above it, transitively provides
// everything the plugin needs, so the import is simply redundant.
// No released version of the plugin fixes this yet (tracked upstream in
// silkimen/cordova-plugin-advanced-http#550), so this hook strips the line
// from the generated iOS platform files after every `cordova prepare`.

const fs = require('fs');
const path = require('path');

const files = [
    'platforms/ios/App/Plugins/cordova-plugin-advanced-http/SM_AFNetworkReachabilityManager.m',
    'platforms/ios/App/Plugins/cordova-plugin-advanced-http/SM_AFHTTPSessionManager.m'
];

module.exports = function (context) {
    const projectRoot = context.opts.projectRoot;

    files.forEach((relativePath) => {
        const filePath = path.join(projectRoot, relativePath);
        if (!fs.existsSync(filePath)) {
            return;
        }

        const contents = fs.readFileSync(filePath, 'utf8');
        const patched = contents
            .split('\n')
            .filter((line) => line.trim() !== '#import <netinet6/in6.h>')
            .join('\n');

        if (patched !== contents) {
            fs.writeFileSync(filePath, patched, 'utf8');
            console.log(`[fix_advanced_http_netinet6] removed redundant netinet6/in6.h import from ${relativePath}`);
        }
    });
};
