import { Routes } from "./Routes";

class LRouteClass {

    get(name) {
        return Routes[name];
    }

    compile(name, args = null) {
        let r = Routes[name];
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
                            "{" + this.escapeRegExp(a) + "\\??}"
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

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    }
}



export const LRoute = new LRouteClass();
export const lroute = (name, args = null) => {

    return LRoute.compile(name, args);
};