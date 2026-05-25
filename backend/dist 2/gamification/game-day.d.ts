export declare function getGameDayKey(instant: Date, timeZone?: string): Date;
export declare function getTodayGameDayKey(timeZone?: string): Date;
export declare function getYesterdayGameDayKey(timeZone?: string): Date;
export declare function getGameDayBounds(dayKey: Date, timeZone?: string): {
    start: Date;
    end: Date;
};
