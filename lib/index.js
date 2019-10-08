const ctx = require('chalk');
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
            console.log(`${ctx.red.bold(`${message.name}:`)} ${ctx.red(message.message)}`);
            console.log(ctx.red(message.stack.split('\n').slice(1).join('\n')));
            console.log('\n');
        } else {
            this.write(message, Object.assign(options, { color: 'red' }), 'error');
        }
    }

    success(message, options = {}) {
        this.write(message, Object.assign(options, { color: 'green' }));
    }

    write(message, { background, color, bold, italic, strikethrough, underline, block } = {}, method = 'log') {
        let styler = ctx;

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
                console[method](Array(80).fill(' ').join(''));
                console[method](` ${message}${Array(80 - message.length - 1).fill(' ').join('')}`);
                console[method](Array(80).fill(' ').join(''));
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
