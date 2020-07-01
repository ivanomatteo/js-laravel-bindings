"use strict";

import { escapeRegExp } from  'js-utils-imatteo';

export class LRouteClass {


    constructor(routes){
        this.routes = routes;
    }

    get(name) {
        return this.routes[name];
    }

    compile(name, args = null) {
        let r = this.routes[name];
        if (r && r.uri) {
            let uri = r.uri;
            if (args) {
                if (Array.isArray(args)) {
                    for (let a of args) {
                        uri = uri.replace(/{[^{}]+}/, a);
                    }
                } else {
                    for (let a in args) {
                        let regex = new RegExp(
                            "{" + escapeRegExp(a) + "\\??}"
                        );

                        uri = uri.replace(regex, args[a]);
                    }
                }
            }
            if (uri.match(/{[^{}]*[^?]}/)) {
                // missing required argument
                throw new Error("missing required argument");
            }
            // remove optional arguments
            uri = uri.replace(/{[^{}]*\?}/g, "");

            if (uri.endsWith("/")) {
                uri.substr(0, uri.length - 1);
            }

            return '/' + uri;
        }
        throw new Error("route " + name + " not found");
    }

}



