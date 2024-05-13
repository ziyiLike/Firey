export const useMiddleware = ({before, after}: any) => {
    return (req: any, res: any, next: () => any) => {
        before && before(req)
        const response = next();
        after && after(response)
        return response
    };
}