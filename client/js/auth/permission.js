// A set of predefined permission verification/authorization
import Authorization from './authorization';

export const verify = {
    basic: (page, defaultPage) => {
        return Authorization(['basic'], defaultPage)(page);
    },

    advanced: (page, defaultPage) => {
        return Authorization(['advanced'], defaultPage)(page);
    },

    custom: Authorization,
};
