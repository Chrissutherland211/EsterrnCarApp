export const SET_SPLASH_DATA = '[SET_SPLASH_DATA]';

export function setSplashData(spash)
{
    return (dispatch) => {
        dispatch({
            type   : SET_SPLASH_DATA,
            payload: spash
        })
    }
}