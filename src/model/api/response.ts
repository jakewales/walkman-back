export default interface respCtx {
    statusCode: number,
    data: object,
    token: string,
    errorMessage?: string[],
    message?: string[]
}