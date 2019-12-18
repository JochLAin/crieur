const chalk = require('chalk');
const supports = require('supports-color');
const Color = require('teinte');

const write = (message, options = {}, method = 'log') => {
    const parse = ({ background, color, bold, italic, strikethrough, underline, block }) => {
        if (!(module.exports.is_node && !(supports.stdout.has256 || supports.stdout.has16m))) {
            if (background) background = Color.create(background).hex();
            if (color) color = Color.create(color).hex();
        }
        if (block) {
            const tmp = background;
            background = color;
            color = tmp || Color.getYIQ(color) ? 'black' : 'white';
        }
        return {
            background,
            block,
            bold,
            color,
            italic,
            strikethrough,
            underline,
        };
    };

    const { background, color, bold, italic, strikethrough, underline, block } = parse(options);
    if (block) {
        if (module.exports.is_browser) message = ` ${message} `;
        else if (module.exports.is_node) message = `  ${message}`;
    }
    if (module.exports.is_browser) {
        let style = '';
        if (bold) style += 'font-weight: bold;';
        if (italic) style += 'font-style: italic;';
        if (underline && strikethrough) style += 'text-decoration: line-through underline;';
        else if (underline) style += 'text-decoration: underline;';
        else if (strikethrough) style += 'text-decoration: line-through;';
        if (color) style += `color: ${color};`;
        if (background) style += `background-color: ${background};`;
        console[method](`%c${message}`, style.trim());
    } else if (module.exports.is_node) {
        let styler = chalk;
        if (bold) styler = styler.bold;
        if (italic) styler = styler.italic;
        if (underline) styler = styler.underline;
        if (strikethrough) styler = styler.strikethrough;
        if (color) {
            if (color[0] === '#') styler = styler.hex(color);
            else if (styler[color]) styler = styler[color];
        }
        if (background) {
            if (background[0] === '#') styler = styler.bgHex(background);
            else {
                const name = `${background.slice(0, 1).toUpperCase()}${background.slice(1)}`;
                if (styler[name]) styler = styler[name];
            }
        }
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
            console[method](message);
        }
    }
};

module.exports = {
    debug(message, options = {}) {
        if (!module.exports.level[0]) return;
        write(message, Object.assign(options, { color: 'blue' }), 'debug');
    },

    info(message, options = {}) {
        if (!module.exports.level[1]) return;
        write(message, Object.assign(options, { color: 'cyan' }), 'info');
    },

    success(message, options = {}) {
        if (!module.exports.level[2]) return;
        write(message, Object.assign(options, { color: 'green' }));
    },

    log(message, options = {}) {
        if (!module.exports.level[3]) return;
        write(message, options);
    },

    warn(message, options) {
        return module.exports.warning(message, options);
    },

    warning(message, options = {}) {
        if (!module.exports.level[4]) return;
        write(message, Object.assign(options, { color: 'yellow' }), 'warn');
    },

    error(message, options = {}) {
        if (!module.exports.level[5]) return;
        if (message instanceof Error) {
            const splitted = message.message.split('\n');
            const title = splitted.shift();
            const detail = splitted.length && `  ${splitted.join('\n  ')}`;
            const stacktrace = message.stack.split('\n').slice((message.message.match(/\n/g) || []).length + 1).join('\n');
            if (module.exports.is_browser) {
                let msg = `%c${message.name}:`;
                msg += `%c ${chalk.red(title)}`;
                if (detail) msg += `%c\n${detail}`;
                msg += `%c\n${stacktrace}`;
                console.error(
                    msg,
                    'font-weight: bold;color:#ff5252',
                    'color:#ff5252',
                    'color:#ff8a65',
                    'color:#bf360c'
                );
            } else if (module.exports.is_node) {
                let msg = `${chalk.red.bold(`${message.name}:`)} ${chalk.red(title)}`;
                if (detail) msg += `\n${chalk.hex('#ff8a65')(detail)}`;
                msg += `\n${chalk.hex('#bf360c')(stacktrace)}`;
                console.error(msg);
            }
        } else {
            write(message, Object.assign(options, { color: 'red' }), 'log');
        }
    },

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
        write(text);
    },
};

const is_browser_closure = () => { try { return !!(window && document); } catch (e) { return false; } };
const is_node_closure = () => { try { return !(window && document); } catch (e) { return true; } };

Object.defineProperty(module.exports, 'is_browser', {
    value: is_browser_closure(),
    configurable: false,
    writable: false,
});

Object.defineProperty(module.exports, 'is_node', {
    value: is_node_closure(),
    configurable: false,
    writable: false,
});

let level;
const LEVELS = [
    'debug',
    'info',
    'success',
    'log',
    'warning',
    'error',
];
Object.defineProperty(module.exports, 'level', {
    get() {
        return level || [...Array(LEVELS.length)].map(() => true);
    },
    set(value) {
        if (typeof value === 'string') {
            value = LEVELS.indexOf(value);
        }
        if (typeof value === 'number') {
            value = [...Array(LEVELS.length)].map((a, index) => {
                return index >= value;
            });
        }
        level = value;
    }
});
