export const uniquify = (obj, runId, fields) => {
    const out = { ...obj }
    fields.forEach((field) => {
        out[field] = `${obj[field]}-${runId}`
    })
    return out
}
