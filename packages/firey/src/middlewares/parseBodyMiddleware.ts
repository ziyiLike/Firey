import {useHooks} from "../utils";
import {ParseBodyError} from "../exceptions";
import {useSetupMiddleware} from "../hooks";
import {parse} from "querystring";
import ContentType from "../httpEnums/contentType";

export const parseBodyMiddleware = useSetupMiddleware(async (request, _, dispatch) => {
    if (useHooks("isIn", request.method, ['POST', 'PATCH', 'PUT', 'DELETE'])) {
        try {
            if (request.headers["content-type"] === ContentType.APPLICATION_JSON) {
                request.data = JSON.parse(request.body.__chunksData);
            }
            if (request.headers["content-type"] === ContentType.APPLICATION_FORM_URLENCODED) {
                request.data = parse(request.body.__chunksData);
            }
            if (request.headers["content-type"]?.startsWith(ContentType.FORM_DATA)) {
                request.data = useHooks('parseFormData', request.headers["content-type"], request.body.__chunksData)
            }
        } catch (error) {
            throw new ParseBodyError()
        }
    }
    await dispatch()
})