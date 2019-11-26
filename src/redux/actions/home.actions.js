export const SET_HOME_DATA = '[SET_HOME_DATA]';
export const GET_JOB_OFFER = '[GET_JOB_OFFER]';

export function setHomeData(user)
{
    return (dispatch) => {
        dispatch({
            type   : SET_HOME_DATA,
            payload: user
        })
    }
}
export function getJobOffer(JobDetail)
{
    return (dispatch) => {
        dispatch({
            type   : GET_JOB_OFFER,
            payload: JobDetail
        })
    }
}