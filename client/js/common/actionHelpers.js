export const okState = 'FULFILLED';
export const failState = 'REJECTED';

export const ok = (str) => str + '_' + okState;
export const fail = (str) => str + '_' + failState;

export function parseActionType(action) {
    const splitedType = action.type.split('/');
    const moduleName = splitedType[0];
    const typeStr = (splitedType.length > 1) ? splitedType[1] : splitedType[0];
    // concat default values in case the size of splitted string is too small
    const tokens = typeStr.split('_').concat(['', '', '']);
    return {
        module: moduleName,
        act: tokens[0],
        sub: tokens[1],
        stat: tokens[2],
        tokens: tokens,
    };
}

export function getActionSubject(action) {
    // concat default values in case the size of splitted string is too small
    const tokens = action.type.split('_').concat(['', '', '']);
    return tokens[1];
}

export function getActionState(action) {
    // concat default values in case the size of splitted string is too small
    const tokens = action.type.split('_').concat(['', '', '']);
    return tokens[2];
}

export function updateObjectState(action, obj) {
    const tokens = action.type.split('_').concat(['', '', '']);

    switch (tokens[2]) {
        case '':
            obj.fetching = true;
            obj.fetched = false;
            obj.error = null;
            break;
        case 'REJECTED':
            obj.fetching = false;
            obj.fetched = true;
            obj.error = action.payload;
            break;
        case 'FULFILLED':
            obj.fetching = false;
            obj.fetched = true;
            obj.error = null;
            break;
    }
}
