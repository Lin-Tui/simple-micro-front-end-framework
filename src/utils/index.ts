import { Application, Status } from '../interfaces/applications';


export function handleError(error: Error, app: Application, status: Status) {
    app.status = status;
    throw(error);
}