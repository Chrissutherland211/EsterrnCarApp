export const SET_USER_DATA = '[SET_USER_DATA]';

export function setUserData(user)
{
    return (dispatch) => {
        dispatch({
            type   : SET_USER_DATA,
            payload: user
        })
    }
}