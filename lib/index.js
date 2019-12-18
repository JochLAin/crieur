const chalk = require('chalk');
const Color = require('teinte');
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

    warn(message, options) {
        return this.warning(message, options);
    }

    warning(message, options = {}) {
        if (!this.level[4]) return;
        this.write(message, Object.assign(options, { color: 'yellow' }), 'warn');
    }

    error(message, options = {}) {
        if (!this.level[5]) return;
        if (message instanceof Error) {
            const splitted = message.message.split('\n');
            const title = splitted.shift();
            const detail = splitted.length && `  ${splitted.join('\n  ')}`;
            const stacktrace = message.stack.split('\n').slice((message.message.match(/\n/g) || []).length + 1).join('\n');
            if (this.is_browser) {
                let msg = `%c${message.name}:`;
                msg += `%c ${chalk.red(title)}`;
                if (detail) msg += `%c\n${detail}`;
                msg += `%c\n${stacktrace}`;
                console.log(
                    msg,
                    'font-weight: bold;color:#ff5252',
                    'color:#ff5252',
                    'color:#ff8a65',
                    'color:#bf360c'
                );
            } else if (this.is_node) {
                let msg = `${chalk.red.bold(`${message.name}:`)} ${chalk.red(title)}`;
                if (detail) msg += `\n${chalk.hex('#ff8a65')(detail)}`;
                msg += `\n${chalk.hex('#bf360c')(stacktrace)}`;
                console.log(msg);
            }
        } else {
            this.write(message, Object.assign(options, { color: 'red' }), 'error');
        }
    }

    write(message, { background, color, bold, italic, strikethrough, underline, block } = {}, method = 'log') {
        if (background) background = Color.create(background);
        if (color) color = Color.create(color);

        if (block) {
            const tmp = background;
            background = color;
            color = tmp || color.yiq() ? Color.create('dark') : Color.create('light');
            message = ` ${message} `;
        }

        if (this.is_browser) {
            let style = '';
            if (bold) style += 'font-weight: bold;';
            if (italic) style += 'font-style: italic;';
            if (underline && strikethrough) style += 'text-decoration: line-through underline;';
            else if (underline) style += 'text-decoration: underline;';
            else if (strikethrough) style += 'text-decoration: line-through;';
            if (color) style += `color: ${color.hex()};`;
            if (background) style += `background-color: ${background.hex()};`;
            console.log(`%c${message}`, style.trim());
        } else if (this.is_node) {
            let styler = chalk;
            if (bold) styler = styler.bold;
            if (italic) styler = styler.italic;
            if (underline) styler = styler.underline;
            if (strikethrough) styler = styler.strikethrough;
            if (color) styler = styler.hex(color.hex());
            if (background) styler = styler.bgHex(background.hex());
            if (styler instanceof Function) {
                if (block) {
                    console.log('');
                    console[method](styler(Array(80).fill(' ').join('')));
                    console[method](styler(`${message}${Array(80 - message.length).fill(' ').join('')}`));
                    console[method](styler(Array(80).fill(' ').join('')));
                    console.log('');
                } else {
                    console[method](styler(message));
                }
            } else {
                console.log(message);
            }
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
        for (let y = 0; y < table.length; y++) {
            const row = table[y];
            for (let x = 0; x < row.length; x++) {
                const cell = row[x];
                const value = String(cell);
                const width = widths[x];
                if (y === 0) {
                    const left = Math.floor((width - value.length) / 2);
                    const right = Math.ceil((width - value.length) / 2);
                    text += Array(left).fill(' ').join('') + cell + Array(right).fill(' ').join('');
                } else if (typeof cell === 'number') {
                    text += `${Array(width - (value.length + 1)).fill(' ').join('')}${cell} `;
                } else {
                    text += ` ${cell}${Array(width - (value.length + 1)).fill(' ').join('')}`;
                }
            }
            if (y === 0) {
                text += `\n${Array(widths.reduce((accu, width) => accu + width) + widths.length - 1).fill('=').join('')}`;
            }
            text += '\n';
        }
        console.log(text);
    }

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
