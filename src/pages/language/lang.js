import {vi} from "../../pages/language/vi";
import {en} from "../../pages/language/en";
import {indo} from "../../pages/language/in";
export function lang () {
    let country = 'vn'
    const languageUser = localStorage.getItem('language')
    if(languageUser) {
        country = languageUser
    }
    if(country === 'vn') {
        return vi()
    } else if(country === 'en') {
        return en()
    } else {
        return indo()
    }
}