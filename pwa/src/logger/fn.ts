const styleArray = {
    red: ['color: red', '\x1b[31m'],
    green: ['color: green', '\x1b[32m'],
    yellow: ['color: #dddd36', '\x1b[33m'],
    reset: ['color:unset', '\x1b[0m'],
    orange: ['color: #f57c00', '\x1b[95m'],
    bold: ['color:unset; font-weight: bold;'],
    blue: ['color:#4095ec', '\x1b[34m'],
};

const levelMaping: { [key: string]: number } = {
    NONE: -1,
    ERROR: 0,
    WARNING: 1,
    INFO: 2,
    DEV: 3,
    DEBUG: 4,
    SILLY: 5
}
function getLoggerLevel(): number {
    const level = process.env.LOG_LEVEL ?? process.env.REACT_APP_LOG_LEVEL ?? ""

    return levelMaping[level] ?? (parseInt(level) || 2)
}

export function loggerFn(useCss = true, styles = styleArray) {
    let entry;
    return function configLogger(logger: any, logMethod = 'log') {
        const log = logger[logMethod];
        return function loggerColor(color: keyof typeof styleArray, message = '', logLevel: number) {
            const style = styles[color];
            return function (...value: any[]) {
                // create entry message (true = browser / false = server)
                if (useCss) entry = [`%c${message}`, style[0]];
                else {
                    entry = [`${style[1]}${message}${styles['reset'][1]}`];
                }

                // log message
                const currentLogLevel = getLoggerLevel()
                if (currentLogLevel >= logLevel) {
                    if (useCss)
                        log.apply(logger, [
                            new Date().toLocaleTimeString() + ` %c${message}%c ` + value.join(' '),
                            style[0],
                            styleArray.reset[0],
                        ]);
                    // logger: Console
                    else {
                        entry = [`${style[1]}${message}${styles['reset'][1]}`];
                        log.apply(logger, [new Date().toLocaleTimeString(), ...entry, ...value]); // logger: Console
                    }
                }

                return value;
            };
        };
    };
}