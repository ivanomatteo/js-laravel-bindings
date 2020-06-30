"use strict";

export class Localize {

    constructor(locale) {
        this.locale = locale;
    }

    bindVue() {
        let _localize = this;
        const plugin = {
            install() {
                Vue.prototype.$translate = (str) => {
                    return _localize.translate(str);
                }
                Vue.filter("tr", (value) => {
                    if (value) {
                        return this.translate(value);
                    }
                });
            }
        };
        Vue.use(plugin);
    }

    static bindVueDefault() {
        let _localize = this;
        const plugin = {
            install() {
                Vue.prototype.$translate = (str) => {
                    return sstr;
                }
                Vue.filter("tr", (value) => {
                    return value;
                });
            }
        };
        Vue.use(plugin);
    }

    translate(str) {
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
        return tmp || str;
    }

}



export const LocalizeVuePlugin = {

    install() {
        Vue.prototype.$translate = (str) => {
            return _localize.translate(str);
        }
    }

};