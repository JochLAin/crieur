const chalk = require('chalk');
const EventListener = require('./event_listener');

const LEVELS = [
    'debug',
    'info',
    'success',
    'log',
    'warning',
    'error',
];

class Logger extends EventListener {
    constructor() {
        super();
        this.on('data', this.write.bind(this));
    }

    debug(message, options = {}) {
        if (!this.level[0]) return;
        this.write(message, Object.assign(options, { color: 'blue' }), 'debug');
    }

    info(message, options = {}) {
        if (!this.level[1]) return;
        this.write(message, Object.assign(options, { color: 'cyan' }), 'info');
    }

    success(message, options = {}) {
        if (!this.level[2]) return;
        this.write(message, Object.assign(options, { color: 'green' }));
    }

    log(message, options = {}) {
        if (!this.level[3]) return;
        this.write(message, options);
    }

    warning(message, options = {}) {
        if (!this.level[4]) return;
        this.write(message, Object.assign(options, { color: 'yellow' }), 'warn');
    }

    error(message, options = {}) {
        if (!this.level[5]) return;
        if (message instanceof Error) {
            console.log(`${chalk.red.bold(`${message.name}:`)} ${chalk.red(message.message)}`);
            if (message.detail) console.log(chalk.hex('#ff8a65')(message.detail));
            console.log(chalk.hex('#bf360c')(message.stack.split('\n').slice((message.message.match(/\n/g) || []).length + 1).join('\n')));
        } else {
            this.write(message, Object.assign(options, { color: 'red' }), 'error');
        }
    }

    table(table = []) {
        const PADDING = 1;
        const widths = table[0].reduce((accu, value, x) => {
            const width = Math.max(...table.map(row => String(row[x]).length));
            accu.push(width + 2 * PADDING);
            return accu;
        }, []);

        let text = '';
        for (const y in table) {
            const row = table[y];
            for (let x in row) {
                const cell = row[x];
                const value = String(cell);
                const width = widths[x];
                if (y == 0) {
                    const left = Math.floor((width - value.length) / 2);
                    const right = Math.ceil((width - value.length) / 2);
                    text += Array(left).fill(' ').join('') + cell + Array(right).fill(' ').join('');
                } else if (typeof cell === 'number') {
                    text += `${Array(width - (value.length + 1)).fill(' ').join('')}${cell} `;
                } else {
                    text += ` ${cell}${Array(width - (value.length + 1)).fill(' ').join('')}`;
                }
            }
            if (y == 0) {
                text += `\n${Array(widths.reduce((accu, width) => accu + width) + widths.length - 1).fill('=').join('')}`
            }
            text += '\n';
        }
        console.log(text);
    }

    write(message, { background, color, bold, italic, strikethrough, underline, block } = {}, method = 'log') {
        let styler = chalk;

        if (block) {
            background = color;
            color = 'white';
        }

        if (bold) styler = styler.bold;
        if (italic) styler = styler.italic;
        if (strikethrough) styler = styler.strikethrough;
        if (underline) styler = styler.underline;
        if (color) styler = styler[color];
        if (background) styler = styler[`bg${background.slice(0, 1).toUpperCase()}${background.slice(1)}`];

        if (styler instanceof Function) {
            if (block) {
                console.log('');
                console[method](styler(Array(80).fill(' ').join('')));
                console[method](styler(` ${message}${Array(80 - message.length - 1).fill(' ').join('')}`));
                console[method](styler(Array(80).fill(' ').join('')));
                console.log('');
            } else {
                console[method](styler(message));
            }
        } else {
            console.log(message);
        }
    };

    get is_browser() {
        if (this._is_browser) return this._is_browser;
        const closure = () => { try { return !!window; } catch (e) { return false; } };
        return this._is_browser = closure();
    }

    get is_node() {
        if (this._is_node) return this._is_node;
        const closure = () => { try { return !!global; } catch (e) { return false; } };
        return this._is_node = closure();
    }

    set level(level) {
        if (typeof level === 'string') {
            level = LEVELS.indexOf(level);
        }
        if (typeof level === 'number') {
            level = [...Array(LEVELS.length)].map((a, index) => {
                return index >= level;
            });
        }
        this._level = level;
    }

    get level() {
        return this._level || [...Array(LEVELS.length)].map(() => true);
    }

    set support(support) {
        if (this.is_node && support !== global) return;
        if (this.is_browser && (![window, document].includes(support) || !(support instanceof Node))) return;
        this._support = support;
    }

    get support() {
        return this._support;
    }
}

const logger = new Logger();
module.exports = logger;
