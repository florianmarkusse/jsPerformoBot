import * as C from './constant';
import en from './locale/en';
import U from './utils';
const parseLocale = (preset, object, isLocal) => {
    let l;
    if (!preset)
        return L;
    if (typeof preset === 'string') {
        if (Ls[preset]) {
            l = preset;
        }
        if (object) {
            Ls[preset] = object;
            l = preset;
        }
    } else {
        const {name} = preset;
        Ls[name] = preset;
        l = name;
    }
    if (!isLocal && l)
        L = l;
    return l || !isLocal && L;
};
class Dayjs {
    constructor(cfg) {
        this.$L = undefined || parseLocale(cfg.locale, null, true);
        this.parse(cfg);
    }
}