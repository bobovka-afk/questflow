type XpEventReader = {
    xpEvent: {
        findFirst: (args: {
            where: {
                userId: number;
                createdAt: {
                    gte: Date;
                    lt: Date;
                };
            };
            select: {
                id: true;
            };
        }) => Promise<{
            id: number;
        } | null>;
    };
};
export declare function wasUserActiveOnGameDay(prisma: XpEventReader, userId: number, dayKey: Date, timeZone: string): Promise<boolean>;
export {};
