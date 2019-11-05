const chalk = require('chalk');
const EventListener = require('./event_listener');

class Logger extends EventListener {
    constructor() {
        super();
        this.on('data', this.write.bind(this));
    }

    log(message, options = {}) {
        this.write(message, options);
    }

    debug(message, options = {}) {
        this.write(message, Object.assign(options, { color: 'blue' }), 'debug');
    }

    info(message, options = {}) {
        this.write(message, Object.assign(options, { color: 'cyan' }), 'info');
    }

    warning(message, options = {}) {
        this.write(message, Object.assign(options, { color: 'yellow' }), 'warn');
    }

    error(message, options = {}) {
        if (message instanceof Error) {
            console.log(`${chalk.red.bold(`${message.name}:`)} ${chalk.red(message.message)}`);
            console.log(chalk.red(message.stack.split('\n').slice(1).join('\n')));
            console.log('\n');
        } else {
            this.write(message, Object.assign(options, { color: 'red' }), 'error');
        }
    }

    success(message, options = {}) {
        this.write(message, Object.assign(options, { color: 'green' }));
    }

    table(table = []) {
        const PADDING = 1;
        table = table.map(row => row.map(cell => String(cell)));
        const widths = table[0].reduce((accu, value, x) => {
            const width = Math.max(...table.map(row => row[x].length));
            accu.push(width + 2 * PADDING);
            return accu;
        }, []);

        let value = '';
        for (const y in table) {
            const row = table[y];
            for (let x in row) {
                const cell = row[x];
                const width = widths[x];
                if (y == 0) {
                    const left = Math.floor((width - cell.length) / 2);
                    const right = Math.ceil((width - cell.length) / 2);
                    value += Array(left).fill(' ').join('') + cell + Array(right).fill(' ').join('');
                } else if (x == (row.length - 1)) {
                    value += `${Array(width - (cell.length + 1)).fill(' ').join('')}${cell} `;
                } else {
                    value += ` ${cell}${Array(width - (cell.length + 1)).fill(' ').join('')}`;
                }
            }
            if (y == 0) {
                value += `\n${Array(widths.reduce((accu, width) => accu + width) + widths.length - 1).fill('=').join('')}`
            }
            value += '\n';
        }
        console.log(value);
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
