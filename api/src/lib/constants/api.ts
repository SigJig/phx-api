
export default {
    pagination: {
        countDefault: 15,
        maximum: 50
    },
    version: {
        all: [1, 2],
        current: 2
    },
    deprecated: 1,
    rateLimit: {
        windowMs: 3 * 60 * 1000,
        max: (process.env.NODE_ENV === 'test') ? 500 : 50 // 3 minute
    },
    selects: {
        maxNested: 3
    }
} as const