import { BaseServerResponse } from "../../shared/models/responses/base-server-response.interface";

interface AnonymousAuthApiInterfaceData {
    uuid: string;
    token: string;
}
export interface AnonymousAuthApiInterface extends BaseServerResponse<AnonymousAuthApiInterfaceData> {
    data: AnonymousAuthApiInterfaceData;
    message: string;
    status: number;
    success: boolean;
     
}
