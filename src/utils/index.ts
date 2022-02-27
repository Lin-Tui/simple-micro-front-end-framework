import { Application } from '../interfaces/applications';

export function handleError(error: any, app: Application, status: string) {
    app.status = status;
    console.log('Error:', error);
    throw error;
}
