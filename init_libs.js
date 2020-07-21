"use strict";

import { Localize } from 'js-laravel-bindings';

export const locale = {
    translate: (str, args, num = 1)=>{
        return str;
    }
}


export function loadLocale(lang) {

    let promise = new Promise(function (resolve, reject) {
        import( /* webpackChunkName: "./js/language" */  './lang/' + lang)
            .then(l => {
                let localize = new Localize(l.default);

                locale.translate = (str, args, num = 1)=>{
                    return localize.translate(str, args, num);
                };
    
                resolve(localize);
            }).catch(err => {
                reject(err);
            });
    });

    return promise;
}



import { LRouteClass } from 'js-laravel-bindings';
import { Routes } from "./Routes";

export const LRoute = new LRouteClass(Routes);
export const lroute = (name, args = null) => {
    return LRoute.compile(name, args);
};

window.lroute = lroute;


