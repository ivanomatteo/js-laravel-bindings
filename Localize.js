
import { escapeRegExp } from './utils';
export class Localize {

    constructor(locale, params = true, pluralization = true) {
        this.locale = locale;

        this.usePluralization = pluralization;
        this.useParams = params;
    }

    getVuePlugin() {
        let _localize = this;
        const plugin = {
            install() {
                Vue.prototype.$translate = (str) => {
                    return _localize.translate(str);
                }
                Vue.filter("tr", (value) => {
                    if (value) {
                        return _localize.translate(value);
                    }
                });
            }
        };
        return plugin;
    }

    static getVuePluginNoTranslate() {
        let _localize = this;
        const plugin = {
            install() {
                Vue.prototype.$translate = (str) => {
                    return str;
                }
                Vue.filter("tr", (value) => {
                    return value;
                });
            }
        };
        return plugin;
    }

    translate(str, args, num = 1) {
        if (!str) {
            return str;
        }
        let t = this.locale['__json__'] ? this.locale['__json__'][str] : null;
        if (t) {
            return t;
        }
        let path = str.split('.');
        let tmp = this.locale;
        for (let p of path) {
            if (tmp)
                tmp = tmp[p];
            else {
                tmp = null
                break;
            }
        }

        
        if (tmp) {
            if(this.usePluralization){
                tmp = this.getPluralization(tmp,num);
            }
            if(this.useParams){
                tmp = this.bindArgs(tmp, args);
            }
        }

        return tmp || str;
    }

    getPluralization(str, num) {
        let tmp = str.split('|');

        if(tmp.length <= 1){
            return str;
        }

        for (let p of tmp) {

            // example: {0} There are none
            let exact_regex = /^\s*{[0-9]+}\s+/;
            let match_exact = p.match(exact_regex);
            if (match_exact) {
                let n =
                    match_exact[0]
                        .replace(/\s*{\s*/, '')
                        .replace(/\s*}\s*/, '');
                if (num === parseInt(n)) {
                    return p.replace(exact_regex, '');
                }
            }

            // example: [1,19] There are some|[20,*] There are many
            let between_regex = /^\s*\[[0-9]+,[0-9]+]\s+/;
            let match_between = p.match(between_regex);
            if (match_between) {
                let n =
                    match_between[0]
                        .replace(/\s*\[\s*/, '')
                        .replace(/\s*\]\s*/, '')
                        .split(',');
                if (n.length === 2) {
                    n[0] = n[0].trim();
                    n[1] = n[1].trim();
                    if ((n[0] === '*' || num >= parseInt(n[0])) && (n[1] === '*' || num <= parseInt(n[1]))) {
                        return p.replace(between_regex, '');
                    }
                }
            }
            if(num > 1){
                return tmp[1];
            }
            return tmp[0];
        }

    }

    bindArgs(str, args) {
        let tmp = str;
        for (let a in args) {
            let regex = new RegExp(
                ":" + escapeRegExp(a) + "(?![a-zA-Z_-])"
            );
            tmp = tmp.replace(regex, args[a]);
        }
        if (tmp.match(/:[a-zA-Z_-]+(?![a-zA-Z_-])/)) {
            // missing argument
            throw new Error("missing argument for: " + str + " ---> " + tmp);
        }
        return tmp;
    }

}



export const LocalizeVuePlugin = {

    install() {
        Vue.prototype.$translate = (str) => {
            return _localize.translate(str);
        }
    }

};