export function getFieldError(errors: unknown[]) {
    const firstError = errors[0]
    if (!firstError) return undefined
    if (typeof firstError === "string") return firstError

    if (typeof firstError === "object" && firstError !== null && "message" in firstError) {
        return String(firstError.message)
    }
    return "Invalid Field"
}